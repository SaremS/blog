import * as React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";

export default function NumericTextField(id, state, changeStateFun) {
  const bgcolor = validateNumericInput(state)
    ? "rgb(0,0,0,0)"
    : "rgb(255,0,0,0.25)";
  const maxLen = checkIsNegative(state) ? 5 : 4;

  return (
    <TextField
      margin="dense"
      id={id}
      size="small"
      label=""
      inputProps={{ maxLength: maxLen, style: {textAlign: "center", fontSize: "0.9em"} }}
      onChange={(e) => changeStateFun(e)}
      defaultValue={state}
      style={{ backgroundColor: bgcolor, maxWidth:"65px" }}
    />
  );
}

function validateNumericInput(input) {
  return /(^-?\d\.\d\d*$)|(^-?\d$)/.test(input);
}

function checkIsNegative(input) {
  return /-.*/.test(input);
}
