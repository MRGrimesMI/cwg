var   express = require('express');
const gameServices = require("../services/gameservices.js");
const playerServices = require("../services/playerservices.js");
const commonServices = require("../services/commonservices.js");
require('../public/constants.js');
var router = express.Router();

router.route('/')
.post((req, res, next) => {
    var action = req.body.action;
    var data = req.body.data;
    var jResponse = null;
    switch (action) {
        case ACTION.CREATE: jResponse = deployGame(data); break;
        case ACTION.ACCEPT: jResponse = gameServices.accept(data); break;
        case ACTION.REJECT: jResponse = gameServices.reject(data); break;
    }
    commonServices.sendResponse(req, res, jResponse);
});

function deployGame(data) {
    var notPlayers = confirm(data.nations);
    if (notPlayers.length>0) {
        var str = "Does not exist: " + notPlayers.join(', ');
        return new commonServices.ResponseClass(false, str);
    }
    var game = gameServices.create(data);
    var netStatus = true;
    game.nations.forEach(n => {
        var status = playerServices.invite(n.playerID, game.name, n.homeRegion);
        if (status != true) netStatus = false;
    });
    if (netStatus) res = new commonServices.ResponseClass(true, "OK");
    else res = commonServices.StdErrorResponse;
    return res;
}
function confirm(nations) {
    var invalid = new Array();
    nations.forEach(n=>{
        var exist = playerServices.exist(n.playerID);
        if (!exist) invalid.push(n.playerID);
    })
    return invalid;
}

module.exports = router;