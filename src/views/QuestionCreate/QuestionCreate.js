import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';

import { QuestionDetails } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(4)
  }
}));

const QuestionCreate = () => {
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
          xl={3}
        />
        <Grid
          item
          lg={6}
          md={6}
          xl={6}
          xs={12}
        >
          <QuestionDetails />
        </Grid>
      </Grid>
    </div>
  );
};

export default QuestionCreate;
