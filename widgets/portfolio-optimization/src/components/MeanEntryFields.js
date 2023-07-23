import * as React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import NumericTextField from "./NumericTextField";

export default function MeanEntryFields({
  state,
  setState,
  nFieldsState,
  namesState,
}) {
  const means = state;
  const nFields = nFieldsState;
  const names = namesState;

  const fieldList = [...Array(nFields).keys()].map((i) =>
    makeFields(i, names[i], state[i], changeStateFun(state, setState, i))
  );

  return (
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      <Grid item xs={12} md={12}>
        <div style={{ textAlign: "center", userSelect: "none", color:"white"}}>A</div>
      </Grid>
      {fieldList}
    </Grid>
  );
}

function changeStateFun(state, setState, i) {
  var newState = { state }.state.map((x) => x);

  function target(e) {
    newState[i] = e.target.value;
    setState(newState);
  }

  return target;
}

function makeFields(i, name, state, changeStateFun) {
  const fieldId = "meanno_" + i;
  const numField = NumericTextField(fieldId, state, changeStateFun);

  return (
    <Grid container key={i} alignItems="center" justifyContent="center">
      <Grid item xs={6} md={6}>
        <div style={{ textAlign: "center" }}>{"" + name}</div>
      </Grid>
      <Grid item xs={6} md={6}>
        {numField}
      </Grid>
    </Grid>
  );
}
