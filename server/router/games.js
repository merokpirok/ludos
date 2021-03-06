const { Router } = require('express');
const { Op, literal } = require('sequelize');
const { Game } = require('../models/index');

const router = new Router();
const validarBodyGames = body => {
  const errors = {};
  if (!body.companyId) {
    errors.companyId = ['Informe a empresa'];
  }
  if (!body.name) {
    errors.name = ['Informe a nome do jogo'];
  }
  if (!body.description) {
    errors.description = ['Informe uma descrição para o jogo'];
  }
  if (!body.startDate) {
    errors.startDate = ['Data inicial é obrigatória'];
  }
  if (!body.endDate) {
    errors.endDate = ['Data final é obrigatória'];
  }
  if (!body.playersIds || !body.playersIds.length || body.playersIds === 0) {
    errors.playersIds = ['Selecione um jogador'];
  }
  return errors;
};

router.post('/games', (req, res) => {
  const { body } = req;
  const errors = validarBodyGames(body);
  if (Object.values(errors).length) {
    return res.status(400).json({ errors });
  }

  return Game.create(body, {
    include: [Game.GameQuestion],
  })
    .then(game =>
      game.setPlayers(body.playersIds)
        .then(() => res.status(200).json(game.toJSON())),
    )
    .catch(err => res.status(500).json(err));
});

router.put('/games/:gameId', (req, res) => {
  const { body, params: { gameId } } = req;
  const errors = validarBodyGames(body);
  if (Object.values(errors).length) {
    return res.status(400).json({ errors });
  }

  return Game.findByPk(gameId, { include: [Game.GameQuestion] })
    .then(game => game.update(body))
    .then(game =>
      Promise.all([
        game.setGameQuestions(body.gameQuestions),
        game.setPlayers(body.playersIds),
      ])
        .then(() => res.status(200).json(game.toJSON())),
    )
    .catch(err => res.status(500).json(err));
});

router.get('/games', (req, res) => {
  const { companyId } = req.query;

  return Game.findAll({
    where: { companyId },
    include: [
      Game.User,
      Game.GameQuestion,
    ],
  })
    .then(games => res.status(200).json(games))
    .catch(err => res.status(400).json({ err: err.message }));
});

router.get('/games/:gameId', (req, res) => {
  const { gameId } = req.params;


  return Game.findByPk(gameId, {
    include: [
      Game.User,
      Game.GameQuestion,
    ],
  })
    .then(games => res.status(200).json(games))
    .catch(err => res.status(400).json({ err: err.message }));
});

router.delete('/games/:id', (req, res) => {
  const { id } = req.params;

  return Game.findByPk(id)
    .then(game => game.destroy())
    .then(() => res.status(204).json({}))
    .catch(err => res.status(400).json({ err: err.message }));
});

router.get('/users/:userId/games', (req, res) => {
  const { userId } = req.params;

  return Game
    .findAll({
      attributes: [
        'id',
        'name',
        'description',
        [literal(`((SELECT SUM(score) FROM answers WHERE gameId = games.id AND userId = ${userId}) + (SELECT SUM(score) FROM users_actions WHERE gameId = games.id AND userId = ${userId}))`), 'score']
      ],
      include: [
        {
          association: Game.User,
          where: {
            id: userId,
          },
          attributes: [],
        },
      ],
      where: {
        startDate: {
          [Op.lte]: new Date().toISOString(),
        },
        endDate: {
          [Op.gte]: new Date().toISOString(),
        },
      },
      group: [
        'id',
        'name',
        'description',
      ],
    })
    .then(games => res.status(200).json(games))
    // .catch(err => res.status(500).json(err))
});

module.exports = router;
