const { ECONNABORTED } = require('constants');
const path = require('path');
var fileServices = require('./fileservices.js');
var econ = require('./econclasses.js');

// class WorldClass {
//     constructor(data) {
//         this.name = data.name;
//         this.version = data.version;
//         this.regions = new Array();
//         data.regions.forEach(r => {
//             this.regions.push(new RegionClass(r));
//         });
//         this.districts = new Array();
//         data.districts.forEach(a => {
//             this.districts.push(new DistrictClass(a));
//         });
//     }
//     static load(name) {
//         if (name == 'default' || name == null) name = 'valhalla';
//         var filePath = path.join("data", "worlds", name + ".json");
//         var data = fileServices.ReadJSON(filePath);
//         if (data == null) return false;
//         var world = new WorldClass(data);
//         CleanupWorld(world);
//         return world;
//     }
//     static getSummary(name) {
//         var world = WorldClass.load(name);
//         var summary = {
//             "worldName": world.name,
//             "version": world.version,
//             "regions": world.regions,
//         }
//         return {"status": true, "data":summary};
//     }
// }
function load(worldName) {
    if (!worldName || worldName=='default') worldName = 'valhalla';
    var filePath = path.join("data", "worlds", worldName + ".json");
    var world = fileServices.ReadJSON(filePath);
    if (world == null) return null;
    CleanupWorld(world);
    return world;
}
function getSummary(name) {
    var world = load(name);
    var summary = {
        "worldName": world.name,
        "version": world.version,
        "regions": world.regions,
    }
    return {"status": true, "data":summary};
}

// class RegionClass {
//     constructor(data) {
//         this.name = data.name;
//         this.possessiveName = data.possessive;
//         this.id = data.id;
//         this.color = data.textColor;
//     }
// }
// class DistrictClass {
//     constructor(data) {
//         this.name = data.name;
//         this.id = data.id;
//         this.region = data.region;
//         this.isLand = data.isLand;
//         this.population = data.population;
//         if (data.resources) {
//             this.resources = new Array();
//             data.resources.forEach(r => {
//                 this.resources.push(new econ.EconClass(r.name, r.amount, r.units));
//             });
//         }
//         if (data.commodities) {
//             this.commodities = new Array();
//             data.commodities.forEach(c=>{
//                 this.commodities.push(new econ.EconClass(c.name, c.amount, c.units));
//             });
//         }
//         if (data.items) {
//             this.items = new Array();
//             data.items.forEach(i=>{
//                 this.items.push(new ItemClass(i.name));
//             });
//         }
//         this.connections = new Array();
//         data.connections.forEach(c => {
//             this.connections.push(new ConnectionClass(c));
//         });
//     }
// }
// class ConnectionClass {
//     constructor(data) {
//         this.id = data.id;
//         this.isCoastal = data.isCoastal;
//     }
// }
// class ItemClass {
//     constructor(name) {
//         this.name = name;
//     }
//     static create(itemParm) {
//         var item = new ItemClass(itemParm.name);
//         return item;
//     }
// }



function CleanupWorld(world) {
    world.districts.forEach(district => {
        var regionName = district.region;
        switch (regionName) {
            case "Sea":
            case "?":
                break;
            default:
                var region = world.regions.find(r => r.id == regionName);
                if (region) district.region = region.name;
                break;
        }
        district.connections.forEach(c => {
            var ar = world.districts.find(x => x.id == c.id);
            if (ar) {
                c.id = ar.name;
            }
        })
    });
}

function loadParms(filename) {
    var filePath = path.join("data", "worlds", filename + ".json");
    return fileServices.ReadJSON(filePath);
}


module.exports = {
 //   WorldClass,
    // RegionClass,
    // DistrictClass,
    // ConnectionClass,
    loadParms,
    load,
    getSummary
}