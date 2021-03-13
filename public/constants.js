EP = typeof exports == 'undefined' ? window : exports
EP.GAMES = 'games';
EP.WORLDS = 'worlds';
EP.NATIONS = 'nations';
EP.PLAYERS = 'players';


ACTION = typeof exports == 'undefined' ? window : exports
// games actions
ACTION.CREATE = "create";
ACTION.ACCEPT = "accept";
ACTION.REJECT = "reject";

// nations actions
ACTION.GETNATION = "getnation"
ACTION.NATIONUPDATE = "nationupdate";

//worlds actions
ACTION.GETSUMMARY = 'getsummary';

// players actions
ACTION.GETGAMESLIST = "getgames";


// seasonStatus
READINESS = typeof exports == 'undefined' ? window : exports
READINESS.INVITED = "Invited";;
READINESS.AWAITORDERS = "Awaiting Orders";
READINESS.SEASONREADY = "Orders Submitted";
READINESS.INACTIVE = "Inactive";



// class facility {
//     constructor() {
        
//     }
//     static createNew(name, amount) {
//         var instance = Object.assign(new facility,obj);
//         instance.age = 0;
//     }
// }

// if (typeof exports != 'undefined') module.exports = {facility}; 

