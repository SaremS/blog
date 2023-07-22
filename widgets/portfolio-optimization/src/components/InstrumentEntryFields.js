import * as React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

export default function InstrumentEntryFields({
  state,
  setState,
  nFieldsState,
}) {
  const names = state;
  const nFields = nFieldsState;
  const fieldList = [...Array(nFields).keys()].map((i) =>
    makeFields(i, names[i], changeStateFun(state, setState, i))
  );

  return (
    <Grid container spacing={0} alignItems="center" justifyContent="center">
      {fieldList}
    </Grid>
  );
}

function changeStateFun(state, setState, i) {
  var newState = { state }.state.map((x) => x);

  function target(e) {
    newState[i] = e.target.value.toUpperCase();
    setState(newState);
  }

  return target;
}

function makeFields(i, name, changeStateFun) {
  const fieldId = "instrument" + i;
  return (
    <Grid item key={i}>
      <TextField
        key={i}
        margin="dense"
        id={fieldId}
        size="small"
        defaultValue={name}
        label=""
        style={{ fontSize: "1px" }}
        inputProps={{ maxLength: 4, style: { textTransform: "uppercase" } }}
        onChange={(e) => changeStateFun(e)}
      />
    </Grid>
  );
}
