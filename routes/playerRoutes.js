var express = require('express');
const playerServices = require('../services/playerservices.js');
const gameservices = require('../services/gameservices.js');
const commonServices = require("../services/commonservices.js");
require('../public/constants.js');

var router = express.Router();


router.route('/')
.post((req, res, next) => {
    var action = req.body.action;
    var data = req.body.data;
    var jResponse = null;
    switch (action) {
        case ACTION.GETGAMESLIST: 
            var gameList = playerServices.getGamesList(data);
            jResponse = gameservices.getGameSummaries(gameList);
    }
    commonServices.sendResponse(req,res, jResponse);
});



module.exports = router;