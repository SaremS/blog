import * as React from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Grid from "@mui/material/Grid";

export default function AddRemoveButtons({ state, setState }) {
  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <Grid item xs={6} md={6}>
        <Fab
          size="small"
          color="grey"
          aria-label="remove"
          disabled={state == 5}
          onClick={() => {
            setState(state + 1);
          }}
        >
          <AddIcon />
        </Fab>
      </Grid>
      <Grid item xs={6} md={6}>
        <Fab
          size="small"
          color="grey"
          aria-label="add"
          disabled={state == 1}
          onClick={() => {
            setState(state - 1);
          }}
        >
          <RemoveIcon />
        </Fab>
      </Grid>
    </Grid>
  );
}
