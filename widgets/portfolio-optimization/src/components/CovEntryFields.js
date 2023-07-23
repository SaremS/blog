import * as React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

import NumericTextField from "./NumericTextField";

const emptySec = (
  <div style={{ textAlign: "center", userSelect: "none", color: "white" }}>
    A
  </div>
);

export default function CovEntryFields({
  state,
  setState,
  nFieldsState,
  namesState,
}) {
  const nFields = nFieldsState;
  const names = namesState;

  const fieldList = [...Array(nFields + 1).keys()].map((i) =>
    makeFields(
      i,
      nFields,
      names,
      state[i - 1],
      changeStateFun(state, setState, i - 1)
    )
  );

  return (
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      {fieldList}
    </Grid>
  );
}

function changeStateFun(state, setState, i) {
  var newState = { state }.state.map((x) => x);

  function targetOuter(j) {
    function targetInner(e) {
      newState[i][j] = e.target.value;
      setState(newState);
    }
    return targetInner;
  }

  return targetOuter;
}

function makeFields(i, nFields, names, state, changeStateFunOuter) {
  if (i == 0) {
    const name = names[i];
    const fieldId = "covno_" + i;
    const columns = makeTextColumns(names, nFields);

    return (
      <Grid container key={i} alignItems="center" justifyContent="center">
        <Grid item xs={2} md={2}>
          {emptySec}
        </Grid>
        {columns}
      </Grid>
    );
  } else {
    const name = names[i - 1];
    const fieldId = "covno_" + i;
    const columns = [...Array(nFields).keys()].map((j) =>
      makeNumFieldItem(fieldId + "_" + j, state[j], changeStateFunOuter(j))
    );

    return (
      <Grid container key={i} alignItems="center" justifyContent="center">
        <Grid item xs={2} md={2}>
          <div style={{ textAlign: "center" }}>{"" + name}</div>
        </Grid>
        {columns}
      </Grid>
    );
  }
}

function makeTextColumns(texts, nFields) {
  const cols = [...Array(nFields).keys()].map((i) => (
    <Grid item xs={2} md={2}>
      {i < nFields ? (
        <div style={{ textAlign: "center", maxWidth: "65px" }}>{"" + texts[i]}</div>
      ) : (
        emptySec
      )}
    </Grid>
  ));
  return cols;
}

function makeNumFieldItem(fieldId, state, changeStateFun) {
  const field = NumericTextField(fieldId, state, changeStateFun);

  return (
    <Grid item xs={2} md={2}>
      {field}
    </Grid>
  );
}
