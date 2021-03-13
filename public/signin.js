function loadSignin() {
    $ajaxUtils.loadHTML('signin.html',signinHTMLloaded)
}
var devMode=true;
var devID = 'mrg'

function signinHTMLloaded(text) {
    var btn = getElement('SubmitID');
    btn.addEventListener('click', submitSignin);
    setAction('closer', null);
    setPlayerID(null);
    if (devMode=true) {
        getElement('enteredPlayerID').value = devID;
        submitSignin();
    }
}


function submitSignin(event) {
    var id = getElement('enteredPlayerID').value;
    setPlayerID(id);
    loadGameMgr();
}
