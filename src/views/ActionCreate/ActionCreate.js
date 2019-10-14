import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { ActionDetails } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const ActionCreate = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={4}
      >
        <Grid
          item
          lg={3}
          md={3}
          xl={6}
        />
        <Grid
          item
          lg={6}
          md={6}
          xl={6}
          xs={12}
        >
          <ActionDetails />
        </Grid>
      </Grid>
    </div>
  );
};

export default ActionCreate;
