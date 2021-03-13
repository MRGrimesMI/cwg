function loadCreateGame() {
    $ajaxUtils.loadHTML('creategame.html', loadWorldData);
}

var WorldInfo;

function loadWorldData() {
  //  $ajaxUtils.RequestJSON("worlds", WorldDataReceived);
    $ajaxUtils.requestFromServer(EP.WORLDS, ACTION.GETSUMMARY, 'default', WorldDataReceived);
}



function WorldDataReceived(data) {
    WorldInfo = data;
    getElement('WorldName').innerHTML = WorldInfo.worldName;
    var table = getElement('RegionTable');
    WorldInfo.regions.forEach(r => {
        var row = document.createElement('tr');
        var rn = document.createElement('td')
        rn.style.color = r.color;
        rn.innerHTML = r.name;
        row.appendChild(rn);
        var entry = document.createElement('input');
        entry.id = r.name + "P";
        entry.classList.add("playerTxt");
        row.appendChild(entry);
        table.appendChild(row);
    });
    createGameSetup();
}
function createGameSetup() {
    getElement('btnSubmit').addEventListener("click", GameSubmit);
    setAction('closer', createGameClose);
}

function GameSubmit() {
    var gameData = new Object();
    gameData.name = getElement('gameName').value;
    gameData.creatorID = getPlayerID();
    gameData.worldName = WorldInfo.worldName;
    gameData.nations = new Array();
    WorldInfo.regions.forEach(r => {
        var p = getElement('' + r.name + "P").value;
        if (p) {
            var entry = new Object();
            entry.homeRegion = r.name;
            entry.playerID = p;
            entry.color = r.color;
            entry.name = r.name;
            gameData.nations.push(entry);
        }
    });
    $ajaxUtils.requestFromServer("games", ACTION.CREATE, gameData, submitResponse);
}
function submitResponse(data) {
        loadGameMgr();
}
function createGameClose() {
    loadGameMgr();
}