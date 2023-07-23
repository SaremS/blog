import * as React from "react";
import Button from "@mui/material/Button";

export default function OptimizeButton({ meanState, covState, nFields }) {
  const meansValid = checkMeansValid(meanState, nFields);
  const covsValid = checkCovsValid(covState, nFields);

  return (
    <Button variant="contained" disabled={!(meansValid & covsValid)}>
      Optimize
    </Button>
  );
}

function checkMeansValid(means, nFields) {
  return [...Array(nFields).keys()].every((i) =>
    validateNumericInput(means[i])
  );
}

function checkCovsValid(covs, nFields) {
  const covsFlattened = covs.flat();
  return [...Array(nFields * nFields).keys()].every((i) =>
    validateNumericInput(covsFlattened[i])
  );
}

function validateNumericInput(input) {
  return /(^-?\d\.\d\d*$)|(^-?\d$)/.test(input);
}
