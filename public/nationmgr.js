function loadNationMgr(data) {
    $ajaxUtils.loadHTML('nationmgr.html', () => {
        $ajaxUtils.requestFromServer(EP.NATIONS, ACTION.GETNATION, data, nationMgrLoaded);
    });
}
var nation;
function nationMgrLoaded(data) {
    nation = data;
    //    setupClasses(nation);
    nationMgrSetup(nation);
    refresh(false);
}

function refresh(modified) {
    displayListCallback('DistrictList', nation.knownDistricts.filter(a => a.isLand), createDistrictItem);
    displayListCallback('SeaList', nation.knownDistricts.filter(a => !a.isLand), createDistrictItem);
    var ownedDistricts = nation.knownDistricts.filter(a => a.owner == nation.homeRegion);
    // ownedDistricts.forEach(district => {
    //      updateDistrictEconomics(district);
    //      });
    showNationEconomics(ownedDistricts);
}
function showNationEconomics(districts) {
    var econ = {};
    econ.population = 0;
    econ.popConsumption = new Array();
    econ.goodsAvailable = new Array();

    econ.activeFacilities = new Array();
    econ.production = new Array();
    econ.facilityConsumption = new Array();
    econ.resourcesUsed = new Array();

    econ.adjustments = new Array();
    econ.adjustmentConsumption = new Array();

    econ.resourcesAvailable = new Array();

    districts.forEach(district => {
        updateDistrictEconomics(district);
        econ.population += district.population;
        econAccumulate(econ.popConsumption, district.popConsumption);
        econAccumulate(econ.goodsAvailable, district.goodsAvailable);

        econAccumulate(econ.activeFacilities, district.activeFacilities);
        econAccumulate(econ.production, district.production);
        econAccumulate(econ.facilityConsumption, district.facilityConsumption);
        econAccumulate(econ.resourcesUsed, district.resourcesUsed);

        econAccumulate(econ.adjustments, district.adjustments);
        econAccumulate(econ.adjustmentConsumption, district.adjustmentConsumption);

        econAccumulate(econ.resourcesAvailable, district.resources);
    });
    removeAllChildNodes(getElement('SummaryList'));
    addItemToList("Districts: " + districts.length, 'SummaryList');
    addStatusToList(econ, 'SummaryList');
}

function updateDistrictEconomics(district) {

    district.popConsumption = econMult(nation.parms.population.consumption, district.population);
    district.goodsAvailable = district.goods.slice();
    district.production = new Array();
    district.facilityConsumption = new Array();
    district.adjustmentConsumption = new Array();
    district.resourcesUsed = new Array();
    district.resourcesAvailable = district.resources.slice();
    district.activeFacilities = new Array();
    if (district.facilities) {
        econAccumulate(district.activeFacilities, district.facilities);
        econAccumNegatives(district.activeFacilities, district.adjustments);
        district.activeFacilities.forEach(facility => {
            var parm = nation.parms.goods.find(f => f.facility.name == facility.name);
            var amount = facility.amount;
            var production = econMult(parm.facility.production, amount);
            var operationalConsumption = econMult(parm.facility.operatingConsumption, amount);
            var resourceConsumption = econMult(parm.facility.resourceConsumption, amount);
            econAccumulate(district.production, production);
            econAccumulate(district.facilityConsumption, operationalConsumption);
            econConsume(district.goodsAvailable, operationalConsumption);
            econConsume(district.resourcesAvailable, resourceConsumption);
            econAccumulate(district.resourcesUsed, resourceConsumption);
        });
    }
    if (district.adjustments) {
        district.adjustments.forEach(facility => {
            var parm = nation.parms.goods.find(f => f.facility.name == facility.name);
            var goods;
            if (facility.amount > 0) {
                goods = econMult(parm.facility.startupConsumption, facility.amount);
            }
            if (facility.amount < 0) {
                goods = econMult(parm.facility.removalConsumption, -facility.amount);
            }
            econAccumulate(district.adjustmentConsumption, goods);
            econConsume(district.goodsAvailable, goods);
        });
    }
}


function nationMgrSetup(info) {
    createCenterHeaer(info)
    setAction('closer', exit);
    setAction('sendButton', saveSend);
    setAction('seasonOKcheck', seasonOKchange);
}
function createCenterHeaer(info) {
    // var od = createDiv("HeaderCenter");
    // var d1 = createDiv("HeaderCenter");
    var od = createDiv();
    var d1 = createDiv();
    d1.appendChild(createSpan("Game: "));
    d1.appendChild(createSpan(info.gameName, { "class": "HeaderData" }));
    od.appendChild(d1);
    var d2 = createDiv();
    d2.appendChild(createSpan("Nation: "));
    d2.appendChild(createSpan(info.name, { "class": "HeaderData" }));
    od.appendChild(d2);
    var d3 = createDiv();
    d3.appendChild(createSpan("Season: "));
    d3.appendChild(createSpan(info.seasonString, { "class": "HeaderData" }));
    od.appendChild(d3);
    replaceHeaderCenter(od);
}

function createDistrictItem(district) {
    const od = createDiv();
    const id = createDiv();
    id.appendChild(createClickSpan(district.name, districtClick, district.name, { "weight": "bold" }));
    id.appendChild(createSpan(" (Pop: " + district.population + ")"));
    od.appendChild(id);
    const rd = createDiv("DistrictDetails");
    if (district.facilities) {
        rd.appendChild(econArrayToSpan(district.facilities, "Facilities: "));
        od.appendChild(rd);
    }

    if (district.adjustments && district.adjustments.length > 0) {
        const iv = createDiv("DistrictDetails");
        iv.appendChild(econArrayToSpan(district.adjustments, "New Facilities: "));
        od.appendChild(iv);
    }
    return od;
}

async function saveSend() {
    sendUpdate(saveCompleted);
}
noExitOnSend = false;  // for Development 
function saveCompleted(result) {
    getElement('sendButton').disabled = true;
    alert("Update Saved");
    var seasonOK = getElement('seasonOKcheck').checked;
    if (seasonOK && !noExitOnSend) exit();
}
function seasonOKchange() {
    sendButton.disabled = false;
}
function exit() {
    loadGameMgr();
}
