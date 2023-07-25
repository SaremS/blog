import * as React from "react";
import Button from "@mui/material/Button";
import init, { optimize } from "portfolio-optimization";

export default function OptimizeButton({
  meanState,
  covState,
  nFields,
  setRiskReturnState,
}) {
  const meansValid = checkMeansValid(meanState, nFields);
  const covsValid = checkCovsValid(covState, nFields);

  return (
    <Button
      variant="contained"
      disabled={!(meansValid & covsValid)}
      onClick={(e) =>
        optimize_portfolio(meanState, covState, nFields, setRiskReturnState)
      }
    >
      Optimize
    </Button>
  );
}

function optimize_portfolio(means, covs, nFields, setRiskReturnState) {
  const means_target = means.slice(0, nFields);
  const covs_target = covs
    .slice(0, nFields)
    .map((row) => row.slice(0, nFields))
    .flat();

  var the_state = [];
  const logspace = [...Array(100).keys()].map((x) =>
    Math.pow(10, (x / 100) * 5 - 1.0)
  );
  document.getElementById("plot-area").scrollIntoView({ behavior: "smooth" });

  for (let l in logspace) {
    init()
      .then(() => optimize(means_target, covs_target, l))
      .then((x) => {
        the_state = the_state.map((s) => s);
        the_state.push([x.stddev, x.mean]);
        setRiskReturnState(the_state);
      });
  }
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
