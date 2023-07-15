import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    ¥
  </Box>
);

export default function TitleSentimentCard({
  header,
  title,
  sentiment,
  count,
  color,
}) {
  const minSentimentRound = sentiment.toFixed(4);

  return (
    <Card sx={{ minHeight: 350 }} style={{ backgroundColor: color }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {header}
        </Typography>
        <Typography variant="body1" component="div">
          {title}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Average Sentiment
            </Typography>
            <Typography variant="body1">{minSentimentRound}</Typography>
          </Grid>
          <Grid item xs={6} md={6}>
            <Typography
              sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              Comment Count
            </Typography>
            <Typography variant="body1">{count}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}