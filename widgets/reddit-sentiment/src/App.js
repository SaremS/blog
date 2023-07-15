import TimeSeriesChart from "./components/TimeSeriesChart";
import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TitleSentimentCard from "./components/TitleSentimentCard";
import useWebSocket, { ReadyState } from "react-use-websocket";

function App() {
  const [sentimentStreamState, setSentimentStreamState] = React.useState([]);
  const [titleSentimentState, setTitleSentimentState] = React.useState({
    min: { title: null, mean: 0.0, count: null },
    max: { title: null, mean: 0.0, count: null },
    count: { title: null, mean: 0.0, count: null },
  });

  var loc = window.location, SOCKET_URL;
  if (loc.protocol === "https:") {
      SOCKET_URL = "wss:";
  } else {
      SOCKET_URL = "ws:";
  }
  SOCKET_URL += "//" + loc.host;
  SOCKET_URL += "/middleware/kafka";

  const { sendMessage, lastMessage, readyState } = useWebSocket(SOCKET_URL);

  React.useEffect(() => {
    if (lastMessage !== null) {
      const data = lastMessage.data;
      const parsed = JSON.parse(data);
      const sentiment_mean = parsed[0]["content"];
      const parsed_with_time = sentiment_mean.map((d) =>
        Object.assign({}, d, { time: new Date(d["time"] * 1000) })
      );

      setSentimentStreamState((prev) => parsed_with_time);

      const title_sentiment = parsed[1]["content"];
      setTitleSentimentState((prev) => title_sentiment);
    }
  }, [lastMessage, setSentimentStreamState]);

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <hr style={{ opacity: 0.5, marginBottom: "30px" }} />
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={12}>
            <Paper elevation={3}>
              <TimeSeriesChart
                data={sentimentStreamState.map((x) => ({
                  index: x["time"],
                  value: x["sentiment_moving_avg"],
                }))}
              />
            </Paper>
          </Grid>
          <br />
          <Grid item md={4} xs={12}>
            <TitleSentimentCard
              header={"Lowest average sentiment"}
              title={titleSentimentState["min"]["title"]}
              sentiment={titleSentimentState["min"]["mean"]}
              count={titleSentimentState["min"]["count"]}
              color={"#fc6a60"}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <TitleSentimentCard
              header={"Most comments"}
              title={titleSentimentState["count"]["title"]}
              sentiment={titleSentimentState["count"]["mean"]}
              count={titleSentimentState["count"]["count"]}
              color={"#ffffff"}
            />
          </Grid>
          <Grid item md={4} xs={12}>
            <TitleSentimentCard
              header={"Highest average sentiment"}
              title={titleSentimentState["max"]["title"]}
              sentiment={titleSentimentState["max"]["mean"]}
              count={titleSentimentState["max"]["count"]}
              color={"#66ff7a"}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default App;
