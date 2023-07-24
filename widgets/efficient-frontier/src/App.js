import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

import AddRemoveButtons from "./components/AddRemoveButtons";
import InstrumentEntryFields from "./components/InstrumentEntryFields";
import MeanEntryFields from "./components/MeanEntryFields";
import CovEntryFields from "./components/CovEntryFields";
import OptimizeButton from "./components/OptimizeButton";
import RiskReturnPlot from "./components/RiskReturnPlot";

import Divider from "@mui/material/Divider";


function App() {
  const [nInstrumentsState, setNInstrumtentsState] = React.useState(1);
  if ({ nInstrumentsState } < 1) {
    setNInstrumtentsState(1);
  }
  if ({ nInstrumentsState } > 4) {
    setNInstrumtentsState(4);
  }

  const [namesState, setNamesState] = React.useState(["A", "B", "C", "D"]);
  const [meansState, setMeansState] = React.useState([
    "0.05",
    "0.1",
    "0.15",
    "0.2",
  ]);
  const [covsState, setCovsState] = React.useState([
    ["0.1", "0.05", "-0.05", "0.0"],
    ["0.05", "0.2", "0.0", "0.15"],
    ["-0.05", "0.0", "0.3", "0.0"],
    ["0.0", "0.15", "0.0", "0.4"],
  ]);

  const [riskReturnState, setRiskReturnState] = React.useState([]);

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={12}>
            <div style={{  minHeight: "22.5em" }} id="plot-area">
              <RiskReturnPlot data={riskReturnState} />
            </div>
          </Grid>
          <Grid item xs={3} md={1.5}>
            <AddRemoveButtons
              state={nInstrumentsState}
              setState={setNInstrumtentsState}
            />
          </Grid>
          <Grid item xs={3} md={1.5}>
            <div style={{ minHeight: "16em" }}>
              <Divider style={{ fontWeight: "bold" }}>Ticker</Divider>
              <div style={{ minHeight: "0.5em" }}></div>

              <InstrumentEntryFields
                state={namesState}
                setState={setNamesState}
                nFieldsState={nInstrumentsState}
              />
            </div>
          </Grid>
          <Grid item xs={6} md={3}>
            <div style={{ minHeight: "16em" }}>
              <Divider style={{ fontWeight: "bold" }}>Means</Divider>
              <div style={{ minHeight: "0.5em" }}></div>
              <MeanEntryFields
                state={meansState}
                setState={setMeansState}
                nFieldsState={nInstrumentsState}
                namesState={namesState}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <div style={{ minHeight: "16em" }}>
              <Divider style={{ fontWeight: "bold" }}>Covariances</Divider>
              <div style={{ minHeight: "0.5em" }}></div>

              <CovEntryFields
                state={covsState}
                setState={setCovsState}
                nFieldsState={nInstrumentsState}
                namesState={namesState}
              />
            </div>
          </Grid>
          <Grid item xs={12} md={12}>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justifyContent="center"
              sx={{ minHeight: "5em" }}
            >
              <Grid item xs={3}>
                <OptimizeButton
                  meanState={meansState}
                  covState={covsState}
                  nFields={nInstrumentsState}
                  setRiskReturnState={setRiskReturnState}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}


export default App;
