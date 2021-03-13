// const path = require('path');
// var fileServices = require('./fileservices.js');
const gameServices = require("../services/gameservices.js");
var commonServices = require('./commonservices.js');

// class nationInfo {
//     constructor(identity) {
//         this.homeRegion = identity.homeRegion;
//         this.knownDistricts = new Array();
//         // this.districts = districts;
//         //       nation.Population = nation.GetPopulation();
//         //        nation.Commodities = commodities;
//     }
// };
function getNationInfo(data) {
    var game = gameServices.load(data.gameName);
    return assembleNationInfo(game, data.homeRegion);
}

function nationUpdate(data) {
    var game = gameServices.load(data.gameName);
    var nation = game.nations.find(n => n.homeRegion == data.homeRegion);
    if (data.seasonString != game.seasonString) return new commonServices.ResponseClass(false, "Game is at a different season!")
    nation.seasonStatus = data.seasonStatus;
    if (data.adjustments) {
        data.adjustments.forEach(a => {
            var district = game.world.districts.find(ga => ga.name == a.district);
            if (district) {
                district.adjustments = a.adjustments;
            }
        });
    };
    var status = gameServices.save(game);
    if (status) status = gameServices.seasonUpdateAsReady(game);
    if (!status) return commonServices.StdErrorResponse;
    return assembleNationInfo(game, nation.homeRegion);
}

function assembleNationInfo(game, homeRegion) {
    var nation = game.nations.find(n => n.homeRegion == homeRegion);
    var info = {};
    info.homeRegion = homeRegion;
    info.gameName = game.name;
    info.name = nation.name;
    info.seasonString = game.seasonString;
    info.seasonStatus = nation.seasonStatus;
    info.parms = game.parms;
    info.knownDistricts = new Array();
    game.world.districts.forEach(district => {
        if (district.region == nation.homeRegion) {
            info.knownDistricts.push(district);
        }
    });
    return new commonServices.ResponseClass(true, info);
}



module.exports = {
    getNationInfo,
    nationUpdate
}