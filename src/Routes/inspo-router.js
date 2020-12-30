const express = require("express");
const WinWallService = require("../Services/win-wall-service");

const inspoRouter = express.Router();

inspoRouter
  .route("/")
  .get((req, res, next) => {
    WinWallService.getInspo(req.app.get('db'))
      .then((inspo) => res.status(200).json(inspo))
      .catch(next);
  });

module.exports = inspoRouter;
