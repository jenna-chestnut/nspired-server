const express = require("express");
const WinWallService = require("../Services/win-wall-service");
const xss = require('xss');

const winWallRouter = express.Router();

winWallRouter
  .route("/mini")
  .get((req, res, next) => {
    WinWallService.getHomeWinWall(req.app.get('db'))
      .then((winItems) => {
        winItems = winItems
          .map(win => {
            return {
              id: win.id,
              goal_name: xss(win.goal_name),
              upvote_count: win.upvote_count,
              creator: xss(win.user_name)
            }; 
          });
        return winItems;
      })
      .then(winItems => res.status(200).json(winItems))
      .catch(next);
  });

winWallRouter
  .route("/")
  .get((req, res, next) => {
    WinWallService.getWinWall(req.app.get('db'))
      .then(async (winItems) => {
        return Promise.all(winItems
          .map(async (win) => {
            
            let getClones = await WinWallService.getTotalClones(req.app.get('db'), win.id);
            let clones = await getClones;

            let getCompleted = await WinWallService.getTotalCompleted(req.app.get('db'), win.id);
            let completed = await getCompleted;

            return { 
              id: win.id,
              goal_name: xss(win.goal_name),
              date_created: win.date_created,
              upvote_count: win.upvote_count,
              creator: xss(win.user_name),
              clones,
              completed
            };
          })
        );
      })
      .then(winItems => res.status(200).json(winItems))
      .catch(next);
  });

module.exports = winWallRouter;
