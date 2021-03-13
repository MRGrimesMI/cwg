const econ = require('../public/libraryecon.js');

function update(game) {
    updateDistricts(game.world.districts);
    updateNations(game.nations);
    updateGame(game);
    return true;
}

function updateGame(game) {
}

function updateNations(nations) {
    nations.forEach(nation => {
        nation.seasonStatus = READINESS.AWAITORDERS;
    });
}

function updateDistricts(districts) {
    districts.forEach(district => {
        if (district.adjustments) {
            if (!district.facilities) district.facilities = new Array();
            econ.econAccumulate(district.facilities, district.adjustments); 
            district.adjustments = undefined;
        }
    });
}

module.exports = { update };