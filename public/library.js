function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

function replaceHeaderCenter(div) {
    var centerdiv = getElement('HeaderCenter');
    removeAllChildNodes(centerdiv);
    if (div) centerdiv.appendChild(div);
}
function addToHeaderCenter(div) {
    var centerdiv = getElement('HeaderCenter');
    if (div)   centerdiv.appendChild(div);
}
function replaceHeaderRight(div) {
    var rightdiv = getElement('HeaderRight');
    removeAllChildNodes(rightdiv);
    if (div) rightdiv.appendChild(div);
}
function insertMainContent(text) {
    var ph = getElement('MainContent');
    ph.innerHTML = text;
}
function setAction(elemName, action, event = 'click') {
    var oldelement = getElement('' + elemName);
    var newElement = oldelement.cloneNode(true);  // remove all actions
    oldelement.parentNode.replaceChild(newElement, oldelement);
    if (action) {
        newElement.addEventListener(event, action);
        newElement.style.visibility = 'visible';
    } else {
        newElement.style.visibility = 'collapse';
    };
}
// function setCloseAction(action) {
//     var x =  getElement('Closer');
//     var newElement = x.cloneNode(true);  // remove all actions
//     x.parentNode.replaceChild(newElement,x);
//     if (action) {
//         newElement.addEventListener('click',action);
//         newElement.style.visibility = 'visible';
//     } else{
//         newElement.style.visibility = 'collapse';
//     };
// }
function setPlayerID(id) {
    if (id == null) {
        replaceHeaderCenter(null);
        return;
    }
    var div = createDiv();
    var lbl = createSpan("Commander:");
    var value = createSpan(id, { "class": "HeaderData", "padleft": "5" });
    value.id = "playerid";
    div.appendChild(lbl);
    div.appendChild(value);
    replaceHeaderRight(div);
}
function getPlayerID() {
    var id = getElement('playerid');
    return id.textContent;
}

function createDiv(divclass) {
    var d = document.createElement('div');
    if (divclass) d.className = divclass;
    return d;
}
function createSpan(text, options) {
    var span = document.createElement('span');
    span.appendChild(document.createTextNode(text));
    if (options != undefined) {
        if (options.class != undefined) span.className = options.class;
        if (options.padleft != undefined) span.style.paddingLeft = options.padleft;
        if (options.color != undefined) span.style.color = options.color;
        if (options.weight != undefined) span.style.fontWeight = options.weight;
        if (options.size != undefined) span.style.fontSize = options.size;
    }
    return span;
}
function createClickSpan(text, action, id, options) {
    var span = createSpan(text, options);
    makeElementClickable(span, action, id);
    return span;
}

function makeElementClickable(element, action, actionid) {
    if (typeof element == 'string') element = CreateDiv(element);
    element.id = actionid;
    if (action) {
        element.addEventListener("click", action);
        element.addEventListener('contextmenu', ev => Intercept(ev, action));
    }
    element.classList.add('ClickUnderline');
}
function Intercept(event, link) {
    event.preventDefault();
    link(event);
    return false;
}

function displayListCallback(listID, items, callBack) {
    var list = getElement('' + listID);
    removeAllChildNodes(list);
    var empty = true;
    items.forEach(i => {
        var item = document.createElement('li');
        var entry = callBack(i);
        if (entry) {
            var n = (typeof entry == 'string') ? document.createTextNode(entry) : entry;
            item.appendChild(n);
            list.appendChild(item);
            empty = false;
        }
    });
    if (empty) {
        var n = document.createTextNode('<none>');
        var li = document.createElement('li').appendChild(n)
        //   li.style.fontStyle = "italic";
        list.appendChild(li);
    }
}
// function addToList(entry, listID) {
//     var list = getElement(listID);
//     var item = document.createElement('li');
//     var n = (typeof entry == 'string') ? document.createTextNode(entry) : entry;
//     item.appendChild(n);
//     list.appendChild(item);
// }
// function addSubItemToList(entry, listID) {
//     var list = getElement(listID);
//     var item = document.createElement('li');
//     var n = (typeof entry == 'string') ? document.createTextNode(entry) : entry;
//     item.appendChild(n);
//     var sub = document.createElement('ul');
//     sub.appendChild(item);
//     list.appendChild(sub);
// }
function addItemToList(entry, listID, level) {
    if (entry == undefined) return;
    if (level == undefined) level=0;
    var list = getElement(listID);
    var item = document.createElement('li');
    var n = (typeof entry == 'string') ? document.createTextNode(entry) : entry;
    item.appendChild(n);
    var subElement = item;
    while (level > 0) {
        var sub = document.createElement('ul');
        sub.appendChild(subElement);
        sub.classList.add("ListLevel"+level);
        subElement = sub;       
        level--;
    }
    list.appendChild(subElement);
}


function getElement(elementname) {
    return document.querySelector('#' + elementname);
}

// class ItemClass {
//     constructor(name) {
//         this.name = name;
//         this.newItem = true;
//         this.age = 0;
//     }
//     static create(itemParm) {
//         var item = new ItemClass(itemParm.name);
//         return item;
//     }
// }