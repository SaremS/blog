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

async function optimize_portfolio(means, covs, nFields, setRiskReturnState) {
  const means_target = means.slice(0, nFields);
  const covs_target = covs
    .slice(0, nFields)
    .map((row) => row.slice(0, nFields))
    .flat();

  await init()
    .then(() => optimize(means_target, covs_target))
    .then((x) => {
      const result = x.map((pf) =>
        getChartDataRow(pf.stddev, pf.mean, pf.weights)
      );

      document
        .getElementById("plot-area")
        .scrollIntoView({ behavior: "smooth" });
      setRiskReturnState(result);
    });
}

function getChartDataRow(stddev, mean, weights) {
  let stddev_string = stddev.toFixed(2);
  let mean_string = mean.toFixed(2);
  let weights_strings = weights.map(x=>x.toFixed(4));

  return [
    stddev,
    mean,
    `<div style="margin: 5px; font-size:15px">
                          <p>\u03BC: ${mean_string}</p>
                          <p>\u03C3: ${stddev_string}</p>
                          <hr>
                          <p>Weights: ${weights_strings}</p>
                          <div>`,
  ];
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
