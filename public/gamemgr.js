function loadGameMgr() {
    $ajaxUtils.loadHTML('gamemgr.html', loadPlayerData);
}
function loadPlayerData() {
    var id = getPlayerID();
    $ajaxUtils.requestFromServer(EP.PLAYERS, ACTION.GETGAMESLIST, id, gamesSummaryLoaded);  
}


function gamesSummaryLoaded(data) {
    displayGames(data);
    gameMgrSetup();
}

function displayGames(summaries) {
    displayListCallback('GameList', summaries, createGameItem);
}

function createGameItem(s) {
    var item = createDiv();
    var itemID = JSON.stringify({'gameName': s.gameName, 'homeRegion':s.homeRegion});
    var nationStr = s.homeRegion;
    if (s.homeRegion != s.name) nationStr += " (" + s.name + ")"; 
    item.appendChild(createSpan(s.gameName + ": "));
    var nationSpan = createSpan(nationStr,{weight:'bold'});
    item.appendChild(nationSpan);
    if (s.seasonStatus == READINESS.INVITED) {
        item.appendChild(createSpan("New Invitation:", {padleft:10}));
        var aspan = createClickSpan("👍Accept", acceptClick,
                            itemID, {padleft:5});
        item.appendChild(aspan);
        var rspan = createClickSpan("❌(reject)", rejectClick,
                            itemID, {color:"coral",size:"smaller",padleft:20})
        item.appendChild(rspan);     
    } else {
        item.appendChild(createSpan(s.seasonString, {padleft: 10}));
        var statusColor = "black";
        switch (s.seasonStatus) {
            case READINESS.INACTIVE: statusColor = 'gray'; break;
            case READINESS.AWAITORDERS: statusColor = 'orangered'; break;
            case READINESS.SEASONREADY: statusColor = 'green'; break;
        }
        var orders = createClickSpan(s.seasonStatus, gameClick, itemID, 
                {padleft:10, color:statusColor, weight:'bold'});
        item.appendChild(orders);
    }
    return item;
}

function gameClick(event) {
    var smry =  JSON.parse(event.target.id);
    loadNationMgr(smry);
}
function acceptClick(event) {
    var smry =  JSON.parse(event.target.id);
    $ajaxUtils.requestFromServer(EP.GAMES, ACTION.ACCEPT, smry, sendConfirm);
}
function rejectClick(event) {
    var smry =  JSON.parse(event.target.id);
    $ajaxUtils.requestFromServer(EP.GAMES, ACTION.REJECT, smry, sendConfirm); 
}
function clickCreateGame() {
    loadCreateGame(); 
}
function sendConfirm(data) {
        loadGameMgr();
}

function gameMgrSetup() {
    replaceHeaderCenter(null);
    var btn = getElement('CreateGame');
    btn.addEventListener('click', clickCreateGame);
    var x =  getElement('Closer');
    x.addEventListener('click',gameMgrClose);
    x.style.visibility = 'visible';
}
function gameMgrClose() {
    loadSignin();
}



