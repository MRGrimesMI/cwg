var fileServices = require('./fileservices.js');
var path = require( 'path');
const { exists, fstat } = require('fs');


class PlayerClass {
    constructor(data){
        this.id = data.id;
        this.password = data.password;
        this.salt = data.salt;
        this.email = data.email;;
        this.games = data.games; 
    }
    addGame(game, homeRegion) {
        var identifier = {"gameName": game, "homeRegion": homeRegion};
        if (!this.games) this.games = new Array();
        this.games.push(identifier);
    }
    save() {
        var status = fileServices.WriteJSON(PlayerClass.filePath(this.id), this);    
        return status;
    }
    static load(name) {
        var fp = PlayerClass.filePath(name);
        var data = fileServices.ReadJSON(fp);
        var player = new PlayerClass(data);
        return player; 
    }
    static filePath(name) {
        var fp =  path.join("data","players", name.toLowerCase() + ".json"); 
        return fp; 
    } 
}

function getGamesList(playerID) {
    var player = PlayerClass.load(playerID);
    return player.games;
}
function invite(playerID, gameName, homeRegion) {
    var player = PlayerClass.load(playerID);
    if (player == undefined) return false;
    player.addGame(gameName, homeRegion);
    var ps = player.save();
    return ps;
}
function exist(id) {
    var fp = PlayerClass.filePath(id);
    return fileServices.fileExists(fp);
}


module.exports =  {PlayerClass, getGamesList, invite, exist};
