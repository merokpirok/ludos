import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import Context from 'Context';
import {
  Button,
} from '@material-ui/core';
import { EmptyList } from 'components';
import { QuestionList } from './components/index';
import api from 'api';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(2),
  },
}));

const UserQuestions = () => {
  const classes = useStyles();
  const [questions, setQuestions] = useState([]);
  const { selectedGame } = useContext(Context);

  useEffect(() => {
    if (!selectedGame) {
      setQuestions([]);
      return;
    }
    api.get(`/games/${selectedGame.id}/questions`)
      .then(response => setQuestions(response.data));
  }, [selectedGame])

  if (!selectedGame) {
    return (
      <EmptyList
        subtitle={(
          <>
            Você precisa selecionar um jogo para continuar.
            <br />
            <Link to="/game-select">
              <Button
                variant="text"
              >
                Selecionar jogo
              </Button>
            </Link>
          </>
        )}
        title="Nenhum jogo selecionado."
      />
    );
  }



  return (
    <div className={classes.root}>
      {/* {selectedGame.name} */}
      <QuestionList questions={questions} />
    </div>
  );
};

export default UserQuestions;
