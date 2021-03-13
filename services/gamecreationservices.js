const econ = require('./econclasses.js');
const worldServices = require('./worldservices.js');

function create(game) {
    game.world = worldServices.load(game.worldName)
    if (!game.world) return null;
    game.parms = worldServices.loadParms(game.parmsFile);
    if (!game.parms) return null;
    initializeNations(game.nations);
    initializeDistricts(game.world.districts, game.parms);
    assignOwners(game.nations, game.world.districts);
    setDate(game, game.parms.years);
    return game;
}
function initializeNations(nations) {
    nations.forEach(n => {
        n.seasonStatus = READINESS.INVITED;
    });
}

function initializeDistricts(districts, parms) {
    districts.forEach(district => {
        if (district.isLand) {
            assignPopulation(district, parms.population);
            assignEconomics(district, parms.goods);
            //            assignCommodities(a, parms.goods);
        }
        //a.owner = a.region;
        // if (newNations.find(n => n.homeRegion == a.homeRegion)) {
        //     a.owner = n.homeRegion;
        // }
    })
}

function assignOwners(nations, districts) {
    districts.forEach(district => {
        var nation = nations.find(n => n.homeRegion == district.region);
        if (nation) district.owner = nation.homeRegion;
    })
}
function assignPopulation(district, dist) {
    district.population = getRandomJSON(dist.size);
}
function assignEconomics(district, parms) {
    district.resources = new Array();
    district.goods = new Array();
    parms.forEach(ep => {
        var ramt = getRandomJSON(ep.resource.districtAmount);
        district.resources.push({"name": ep.resource.name, "amount":ramt});
        var camt = getRandomJSON(ep.initialAmount);
        district.goods.push({"name":ep.name, "amount":camt});
    });
}
// function assignCommodities(district, commodityParms) {
//     district.commodities = new Array();
//     commodityParms.forEach(c => {
//         district.commodities.push({ "name": c.name, "amount": c.initial });
//     })
// }
function setDate(game, parm) {
    game.seasonCount = 0;
    game.year0 = getRandom(parm.min, parm.max);
}

function getRandomJSON(minmax) {
    return getRandom(minmax.min, minmax.max);
}
function getRandom(min, max) {  // integers, between Min and Max both Included
    return (min + Math.floor(Math.random() * (max - min + 1)));
}

module.exports = { create }