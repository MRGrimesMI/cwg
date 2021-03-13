function districtClick(event) {
    var district = nation.knownDistricts.find(a => a.name == event.target.id);
    if (!district) return;
    if (event.button == RIGHTBUTTON) {
        displayReport(district, event);
        return;
    }
    const districtPopup = new PopupClass(district.name);
    nation.parms.goods.forEach(goodParm => {
        var facilityParm = goodParm.facility;
        var str = "Add " + facilityParm.name;
        districtPopup.addMenuChoice(str, adjustFacilitiesEvent,
            JSON.stringify({ "districtName": district.name, "goodName": goodParm.name, "adjust": 1 }));
    });
    if (district.facilities) {
        districtPopup.AddRule();
        nation.parms.goods.forEach(goodParm => {
            var existing = district.facilities.filter(f => f.name == goodParm.facility.name).length;
            if (existing > 0) {
                var facilityParm = goodParm.facility;
                var str = "Remove " + facilityParm.name;
                districtPopup.addMenuChoice(str, adjustFacilitiesEvent,
                    JSON.stringify({ "districtName": district.name, "goodName": goodParm.name, "adjust": -1 }));
            }
        });
    }
    const rect = event.target.getBoundingClientRect();
    districtPopup.Show(rect.top, rect.right + 50);
}
function adjustFacilitiesEvent(event) {
    var data = JSON.parse(event.target.id);
    var district = nation.knownDistricts.find(a => a.name == data.districtName);

    var goodParm = nation.parms.goods.find(c => c.name == data.goodName);
    if (!goodParm) return;
    //   var facility = ItemClass.create(facParm);
    if (!district.adjustments) district.adjustments = new Array();
    econAccumulate(district.adjustments, [
        { "name": goodParm.facility.name, "amount": data.adjust }]);
    if (district.adjustments.length == 0) district.adjustments = undefined;
    PopupClass.closeParent(event);
    refresh(true);
}

function displayReport(district, event) {
    if (district == undefined) return;
    var tstr = district.name;
    var statusPopup = new PopupClass(tstr);
    statusPopup.StyleTitle("ReportTitleBar");
    var statusList = document.createElement('ul');
    statusList.id = district.name + 'StatusList';
    statusPopup.addLine(statusList);
    addStatusToList(district, statusList.id);
    const rect = event.target.getBoundingClientRect();
    statusPopup.Show(rect.top, rect.right + 50);
}
function sendUpdate(responseHandler) {
    const owner = nation.homeRegion;
    var updates = {};
    updates.gameName = nation.gameName;
    updates.homeRegion = owner;
    updates.seasonString = nation.seasonString;
    var seasonOK = getElement('seasonOKcheck').checked;
    updates.seasonStatus = seasonOK ? READINESS.SEASONREADY : READINESS.AWAITORDERS;
    updates.adjustments = new Array();
    var knownDistricts = nation.knownDistricts.filter(a => a.owner == owner);
    knownDistricts.forEach(a => {
        if (a.adjustments) {
            var adj = { "district": a.name, "adjustments": a.adjustments };
            updates.adjustments.push(adj);
        }
    });
    // if (updatedDistricts.length == 0) {
    //     responseHandler({'status':false});
    //     return;
    // } 
    $ajaxUtils.requestFromServer(EP.NATIONS, ACTION.NATIONUPDATE,
        updates, responseHandler);
}

function addStatusToList(entity, list) {
    addItemToList("Population: " + scale(entity.population), list);
    addItemToList(econArrayToSpan(entity.popConsumption, "Consumption: "), list, 1);
    addItemToList("Goods Available:",list);
    addItemToList(econArrayToSpan(entity.goodsAvailable, ""), list, 1);

    if (entity.activeFacilities && entity.activeFacilities.length != 0) {
        addItemToList(econArrayToSpan(entity.activeFacilities, "Active Facilities: "), list);
        addItemToList(econArrayToSpan(entity.production, "Production: "), list, 1);
        addItemToList(econArrayToSpan(entity.facilityConsumption, "Consumption: "), list, 1);
        addItemToList(econArrayToSpan(entity.resourcesUsed, "Resources Used: "), list, 1);
    }

    if (entity.adjustments && entity.adjustments.length != 0) {
        addItemToList(econArrayToSpan(entity.adjustments, "New Facilities: "), list);
        addItemToList(econArrayToSpan(entity.adjustmentConsumption, "Consumption: "), list, 1);
    }
    addItemToList("Resources Available",list);
    addItemToList(econArrayToSpan(entity.resourcesAvailable, ""), list, 1);


}