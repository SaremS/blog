import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import AddRemoveButtons from "./components/AddRemoveButtons";
import InstrumentEntryFields from "./components/InstrumentEntryFields";
import MeanEntryFields from "./components/MeanEntryFields";


import Divider from "@mui/material/Divider";

function App() {
  const [nInstrumentsState, setNInstrumtentsState] = React.useState(1);
  if ({ nInstrumentsState } < 1) {
    setNInstrumtentsState(1);
  }
  if ({ nInstrumentsState } > 5) {
    setNInstrumtentsState(5);
  }

  const [namesState, setNamesState] = React.useState(["A","B","C","D","E"]);
  const [meansState, setMeansState] = React.useState(["0.0", "0.0", "0.0", "0.0", "0.0"]);


  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={12}>
            <Paper elevation={3}>
              <div
                style={{ backgroundColor: "green", minHeight: "22.5em" }}
              ></div>
            </Paper>
          </Grid>
          <Grid item xs={3} md={1.5}>
            <AddRemoveButtons
              state={nInstrumentsState}
              setState={setNInstrumtentsState}
            />
          </Grid>
          <Grid item xs={3} md={1.5}>
            <div style={{ minHeight: "17.5em" }}>
              <Divider>Ticker</Divider>
              <InstrumentEntryFields
                state={namesState}
                setState={setNamesState}
                nFieldsState={nInstrumentsState}
              />
            </div>
          </Grid>
          <Grid item xs={6} md={3}>
            <div style={{ minHeight: "17.5em" }}>
              <Divider>Means</Divider>
              <MeanEntryFields
                state={meansState}
                setState={setMeansState}
                nFieldsState={nInstrumentsState}
                namesState={namesState}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3}>
              <div
                style={{ backgroundColor: "orange", minHeight: "17.5em" }}
              ></div>
            </Paper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Paper elevation={3}>
              <div
                style={{ backgroundColor: "purple", minHeight: "5em" }}
              ></div>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default App;
