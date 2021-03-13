class EconClass {
    constructor(name, amount, units) {
        this.name = name;
        this.amount = amount;
        this.units = units;
    }
    toString() {
        return Scale(this.amount) + " " + this.units + " " + this.name;
    }
    static scale(amt) {
        var suffix = "";
        if (amt >= 1000) {
            amt = amt / 1000;
            suffix = "K";
        }
        if (amt >= 1000) {
            amt = amt / 1000;
            suffix = "M";
        }
        amt = Math.floor(amt);
        return amt.toString() + suffix;
    }
    // static ToString(resources) {
    //     var str = "";
    //     var iszero = true;
    //     resources.forEach(r => {
    //         if (r.Amount != 0) iszero = false;
    //         str += r.Amount + " " + r.Name + "; ";
    //     });
    //     if (iszero) str = 'none';
    //     return str;
    // }
    // static CreateGroup(name, amount) {
    //     const resource = new EconClass(name, amount);
    //     const RG = [];
    //     RG.push(resource);
    //     return RG;
    // }


}

// function addEcons(r1, r2) {
//     var sum = [];
//     r1.forEach(r => { 
//         sum.push(new EconClass(r.Name, r.Amount));
//     });
//     r2.forEach(r => {
//         const same = sum.find(q => q.Name == r.Name);
//         if (same) same.Amount += r.Amount;
//         else sum.push(r);
//     });
//     return sum;
// }
// function toString(resources) {
//     var str = "";
//     resources.forEach(r => {
//         str += Scale(r.amount) + " " + r.name + "; ";
//     });
//     return str;
// }
// function toSpan(resources) {
//     return createSpan(toString(resources));
// }

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

module.exports = { EconClass }