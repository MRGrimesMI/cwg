function econArrayToSpan(array, label) {
    if (array == undefined) return null;
    var str = label ? label : "";
    array.forEach(r => {
        str += EconString(r) + "; ";
        //    str += Scale(r.amount) + " " + r.name + "; ";
    })
    if (array.length == 0) str += "<none>";
    return createSpan(str);
}
// function Scale(amt) {
//     var suffix = "";
//     if (amt >= 1000) {
//         amt = amt / 1000;
//         suffix = "K";
//     }
//     if (amt >= 1000) {
//         amt = amt / 1000;
//         suffix = "M";
//     }
//     amt = Math.floor(amt);
//     return amt.toString() + suffix;
// }

function econAdd(r1, r2) {
    var sum = [];
    if (r1) {
        r1.forEach(r => {
            sum.push({ "name": r.name, "amount": r.amount });
        });
    }
    if (r2) {
        r2.forEach(r => {
            const same = sum.find(q => q.name == r.name);
            if (same) same.amount = same.amount + r.amount;
            else sum.push({ "name": r.name, "amount": r.amount });
        });
    }
    return sum;
}
function econMult(array, factor) {
    var result = new Array();
    array.forEach(x => {
        var e = { "name": x.name, "amount": x.amount * factor };
        result.push(e);
    });
    return result;
}
// class EconClass {
//     constructor(name, amount, units) {
//         this.name = name;
//         this.amount = amount;
//         this.units = units;
//     }
//     toString() {
//         return Scale(this.amount) + " " + this.units + " " + this.name;
//     }

// }
function EconString(econ) {
    var str = scale(econ.amount);
    var name = econ.name;
    var parm = nation.parms.goods.find(p => p.name == econ.name);
    if (!parm) {
        parm = nation.parms.goods.find(p => p.facility.name == econ.name);
        if (parm) parm = parm.facility;
    }
    if (!parm) {
        parm = nation.parms.goods.find(p => p.resource.name == econ.name);
        if (parm) parm = parm.resource;
    }
    if (!parm) return "";
    if (parm.units) str += " " + parm.units;
    if (!parm.units) {
        if (econ.amount > 1) {
            if (parm.plural) name = parm.plural;
        }
    }
    str += " " + name;
    return str;
}

function scale(amt) {
    var suffix = "";
    var abs = Math.abs(amt);
    if (abs >= 1000) {
        amt = amt / 1000;
        suffix = "K";
    }
    if (abs >= 1000000) {
        amt = amt / 1000000;
        suffix = "M";
    }
    //amt = Number.parseFloat(amt).toPrecision(2);
    if (amt < 10 && amt > -10) amt = Math.round(amt * 10) / 10;
    else amt = Math.round(amt);
    return amt.toString() + suffix;
}
function sumArray(arr) {
    var sum = 0
    arr.forEach(a => { sum += a });
    return sum;
}
function econArraySum(econs) {
    var sum = [];
    econs.forEach(e => {
        sum = econAdd(sum, e);
    });
    return sum;
}
function econAccumulate(accum, addition) {
    if (!addition) return;
    addition.forEach(item => {
        const same = accum.find(q => q.name == item.name);
        if (same) {
            same.amount += item.amount;
        }
        else accum.push({
            "name": item.name,
            "amount": item.amount
        });
    });
}
function econConsume(accum, consumption) {
    if (!consumption) return;
    consumption.forEach(item => {
        const same = accum.find(q => q.name == item.name);
        if (same) {
            same.amount -= item.amount;
        }
        else {
            accum.push(
                { "name": item.name, "amount": -consumption.amount });
        }
    });
    econRemoveZeros(accum);
}
function econAccumNegatives(accum, consumption) {
    if (!consumption) return;
    consumption.forEach(item => {
        if (item.amount < 0) {
            const same = accum.find(q => q.name == item.name);
            if (same) {
                same.amount += item.amount;
            }
            else {
                accum.push(
                    { "name": item.name, "amount": -consumption.amount });
            }
        }
    });
    econRemoveZeros(accum);
}

function econRemoveZeros(accum) {
    var i = accum.length
    while (i--) {
        if (accum[i].amount == 0) accum.splice(i, 1);
    }
}

if (typeof exports === "object") module.exports = {econAccumulate};