const path = require('path');
var fileServices = require('./fileservices.js');
var creationServices = require('./gamecreationservices.js');
var seasonServices = require('./seasonservices.js');
require('../public/constants.js');
var commonServices = require('./commonservices.js');


function filePath(gameName, history) {
    var folder = gameName.toLowerCase();
    var filename = folder;
    if (history!=undefined) filename = filename+"."+padZeros(history,3);
    return path.join("data", "games", folder, filename + ".json");
}
function load(gameName) {
    var p = filePath(gameName);
    if (!p) return null;
    var g = fileServices.ReadJSON(p);
    return g; 
}
function save(game) {
    if (!game || !game.name) return null;
    var fileName = filePath(game.name);
    var status = fileServices.WriteJSON(fileName, game);
    return status; 
}
function saveHistory(game) {
    if (!game || !game.name) return false;
    var fileName = filePath(game.name, game.seasonCount); 
    var status = fileServices.WriteJSON(fileName, game);
    return status; 
}
function padZeros(num, size) {
    num = num.toString();
    while (num.length < size) num = "0" + num;
    return num;
}
function advanceSeason(game) {
    game.seasonCount++;
    setSeasonString(game);
}
function setSeasonString(game) {
    var str = ((game.seasonCount % 2) == 0) ? "Spring " : "Fall ";
    var yearCount = Math.floor(game.seasonCount / 2);
    game.seasonString = str + (game.year0 + yearCount).toString();  
}

function accept(data) {
    var game = load(data.gameName);
    var found = game.nations.find(n=>n.homeRegion == data.homeRegion);
    found.seasonStatus = READINESS.AWAITORDERS;
    save(game);
    return new commonServices.ResponseClass(true, null);
}
function reject(data) {
    var game = load(data.gameName);
    var found = game.nations.findIndex(n=>n.homeRegion == data.homeRegion);
    game.nations.splice(found,1);
    save(game);
    return new commonServices.ResponseClass(true, null);
}

function create(data) {
    cleanupData(data);
    var game = creationServices.create(data);
    setSeasonString(game);
    save(game);
    return game;
}
function cleanupData(gameData) {
    gameData.parmsFile = "standardparms";
    gameData.name = gameData.name.toUpperCase();
}

function getGameSummaries(gameList) {
    var summaries = new Array();
    gameList.forEach(i => {
        var game = load(i.gameName);
        var nation = game.nations.find(n=>n.homeRegion == i.homeRegion);
// && homeRegion is the same
        if (nation) {
            var smry = 
                {"gameName":game.name, 
                 "homeRegion": nation.homeRegion,
                 'name': nation.name,
                 "seasonString": game.seasonString,
                 "seasonStatus":nation.seasonStatus  
                }
            summaries.push(smry);    
        }
    });
    return new commonServices.ResponseClass(true, summaries);
//    return {"status":true, "data":summaries};
}
function seasonUpdateAsReady(game) {
    var ready = true;
    game.nations.forEach(nation =>{
        if (nation.seasonStatus != READINESS.SEASONREADY) ready = false;
    });
    if (!ready) return true;
    saveHistory(game);
    var result = seasonServices.update(game);
    if (result) {
        advanceSeason(game);
        result = save(game);
    }
    return result;
}

module.exports = {
//    GameClass,
    load,
    save,
    advanceSeasonCount: advanceSeason,
    deploy: create,
    accept,
    reject,
    getGameSummaries,
    create,
    seasonUpdateAsReady
}