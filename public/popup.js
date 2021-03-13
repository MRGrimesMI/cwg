const POPUPID = "_popupid_";
const TITLEBAR = POPUPID + "_TitleBar_";
const RIGHTBUTTON = 2;

class PopupClass {
    constructor(title) {
        this.Popup = createDiv("PopupBase");
        this.Popup.style.display = 'block';
        this.Popup.style.visibility = 'hidden';
        this.Popup.id = POPUPID;
        this.TitleBar = createDiv("PopupTitleBase");
        if (title) {
            const n = document.createTextNode(title);
            this.TitleBar.appendChild(n);
        }
        this.Popup.appendChild(this.TitleBar);
        this.addClose();
        this.Body = createDiv("PopupBodyBase");
        this.Popup.appendChild(this.Body);

        document.body.appendChild(this.Popup);
    }
    GetBodyDiv() { return this.Body; }

    Show(top, left, width) {
        this.Popup.style.left = left;
        this.Popup.style.top = top;
        if (width) this.Popup.style.width = width;
     //   if (height) this.Popup.style.height = height;
     //   this.Popup.style.display = 'block';
        this.Popup.style.visibility = 'visible';
     //   DragPopup(this.Popup, this.TitleBar);
    }

    ShowCentered(width) {
        var containerwidth = window.innerWidth;
        var rect = document.getElementById(POPUPID).getBoundingClientRect();
        if (width==undefined) width = rect.width;
        var left = (containerwidth - width) / 2;
        var containerheight = window.innerHeight;
        var height = rect.height;
        var top = (containerheight - height) / 2;
        this.Show(top, left, width);
        // var y1 = document.getElementById(POPUPID).getBoundingClientRect().height;
        // var y2 = document.getElementById(POPUPID).offsetHeight;
    }
    //     AddTitle(text) {
    //         const n = document.createTextNode(text);
    //         // this.TitleBar = CreateDiv("PopupTitleBase");
    //         this.TitleBar.appendChild(n);
    // //        this.Popup.appendChild(this.TitleBar);
    //     }
    StyleTitle(style) {
        this.TitleBar.classList.add(style);
    }
    addLine(elem) {
        if (typeof elem == "string") {
            const s = CreateSpan(elem);
            elem = CreateDiv();
            elem.appendChild(s);
        }
        this.Body.appendChild(elem);
    }
    addMenuChoice(text, action, id) {
        var span = createSpan(text);
        if (action) makeElementClickable(span, action, id);
        var d = createDiv("PopupItem");
        //        var d = document.createElement('div');
        d.appendChild(span);
        //       d.className = "PopupItem";
        this.addLine(d);
    }
    AddBreak() { this.Body.appendChild(document.createElement('br')); }
    AddRule(rclass) {
        var rule = document.createElement('hr');
        if (rclass) rule.className = rclass;
         this.Body.appendChild(rule); 
        }
    CreateButton(text, bclass, action) {
        var btn = document.createElement('button');
        btn.type = "button";
        if (bclass) btn.className = bclass; 
        btn.addEventListener('click', action);
        btn.innerHTML = text; 
        return btn;
    }
    CreateNUDSpan(min, max, onchange) {
        var nud = document.createElement('input');
        nud.type = 'number';
        nud.className = "NumericUpDown";
        nud.min = min;
        nud.max = max;
        nud.value = min;
        nud.onchange = onchange;
        return nud;
    }
    // CreateButton(text, bclass, id, action, location) {
    //     var btn = document.createElement('button');
    //     btn.type = "button";
    //     if (bclass) btn.className = bclass;
    //     btn.id = id;
    //     btn.addEventListener('click', action);
    //     btn.innerHTML = text;
    //     if (location != undefined) {
    //         var style = btn.style;
    //         style.position = "absolute";
    //         switch (location) {
    //             case "TR":
    //                 style.right = "0";
    //                 style.top = "0";
    //                 break;
    //             case "BR":
    //                 style.right = "0";
    //                 style.bottom = "0";
    //                 break;
    //         }
    //     }
    //     return btn;
    // }
    addClose() {
        const cb = createDiv("PopupCloseBase");
        cb.innerHTML = "❌";
        //     cb.classList.add("PopupCloseBase");
        cb.onclick = PopupClass.closeParent;
        cb.id = this.Popup.id;
        this.Popup.appendChild(cb);
    }
    // close(){
    //     var e = document.getElementById(POPUPID);
    //     if (e) document.body.removeChild(e);
    // }
    // static close(event) {
    //     var id = event.target.id;
    //     var x = getElement(''+id);
    //     document.body.removeChild(x);
    //     // var parent = event.target.parentElement;
    //     // while (parent.id != POPUPID) {
    //     //     parent = parent.parentElement;
    //     // }
    //     // document.body.removeChild(parent);
    // }
    static closeParent(event) {
        var parent = event.target.parentElement;
        while (parent.id != POPUPID) {
            parent = parent.parentElement;
        }
        document.body.removeChild(parent); 
    }
}

//====================================================
class Dialog {
    constructor(title, statement) {
        this.Dialog = new PopupClass(title);
        var titlestyle = ((title=="") ? "DialogNote" : "Dialog.Alert"); 
        this.Dialog.StyleTitle(titlestyle);
        var div = CreateDiv("DialogText");
        div.appendChild(CreateSpan(statement));
        this.Dialog.AddLine(div);
        this.Dialog.AddRule();
        this.ButtonDiv = CreateDiv();
        this.Dialog.AddLine(this.ButtonDiv);
    }
    Show(width) {
        this.Dialog.ShowCentered(width);
    }
    AddButton(text, color, action) {
        var b = document.createElement('button');
        b.className = "ButtonFloatRight";
        b.style.backgroundColor = color;
        b.appendChild(document.createTextNode(text));
        b.addEventListener('click', action);
        this.ButtonDiv.appendChild(b);
    }
}
//=====================================================

function CreateAlert(title, text, callback) {
    var dialog = new Dialog(title,text);
    if (callback==undefined) callback = PopupClass.Close;
    dialog.AddButton("OK","lightgray",callback)
    dialog.Show();
}
//=====================================================
function DragPopup(popup, dragelement) {
    var CsrX, CsrY, PosX, PosY;
    dragelement.onmousedown = DragMouseDown;

    function DragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        CsrX = e.clientX;
        CsrY = e.clientY;
        document.onmouseup = CloseDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = ElementDrag;
    }
    function ElementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        PosX = CsrX - e.clientX;
        PosY = CsrY - e.clientY;
        CsrX = e.clientX;
        CsrY = e.clientY;
        // set the element's new position:
        popup.style.top = (popup.offsetTop - PosY) + "px";
        popup.style.left = (popup.offsetLeft - PosX) + "px";
    }
    function CloseDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}
//===================================================
// Table Display
class TableDisplay {
    constructor(Container, Titles, Widths) {
        this.Container = Container;
        this.Titles = Titles;
        this.Widths = Widths;
        this.ShowTitles()
    }
    ShowTitles() {
        this.Container.innerHTML = "";
        const dv = document.createElement("div");
        dv.style.whiteSpace = "nowrap";
        var w = 0;
        this.Titles.forEach(d => {
            var lbl = document.createElement("label");
            lbl.innerHTML = d;
            lbl.style.display = "inline-block";
            lbl.style.width = this.Widths[w++];
            lbl.style.whiteSpace = "nowrap";
            lbl.style.fontWeight = "bold";
            lbl.style.fontSize = "larger";
            lbl.style.textDecoration = "underline";
            dv.appendChild(lbl)
        })
        this.Container.appendChild(dv);
    }
    AddDataRow(Data) {
        const dv = document.createElement("div");
        dv.style.whiteSpace = "nowrap";
        var w = 0;
        Data.forEach(d => {
            var lbl = document.createElement("div");
            if (Array.isArray(d)) {
                lbl.innerHTML = d[0];
                lbl.style.color = d[1];
            }
            else lbl.innerHTML = d;
            lbl.style.display = "inline-block";
            lbl.style.width = this.Widths[w++];
            lbl.style.whiteSpace = "nowrap";
            lbl.style.fontWeight = "bold";
            dv.appendChild(lbl)
        })
        this.Container.appendChild(dv);
    }
}