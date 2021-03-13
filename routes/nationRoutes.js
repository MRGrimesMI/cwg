var   express = require('express');
const nationServices = require("../services/nationservices.js");
const commonServices = require("../services/commonservices.js");
require('../public/constants.js');

var router = express.Router();

router.route('/')
.post((req, res, next) => {
    var action = req.body.action;
    var data = req.body.data;
    var jResponse = null;
    switch (action) {
        case ACTION.GETNATION: jResponse = nationServices.getNationInfo(data); break;
        case ACTION.NATIONUPDATE: jResponse = nationServices.nationUpdate(data); break;
    }
    commonServices.sendResponse(req, res, jResponse);
});

module.exports = router;