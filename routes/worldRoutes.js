var express = require('express');
var router = express.Router();
var worldServices = require('../services/worldservices.js');
const commonServices = require("../services/commonservices.js");
require('../public/constants.js');

router.route('/')
.post((req, res, next) => {
    var action = req.body.action;
    var data = req.body.data;
    var jResponse = null;
    switch (action) {
        case ACTION.GETSUMMARY: 
        jResponse = worldServices.getSummary(data);
        break;
    }
    commonServices.sendResponse(req,res, jResponse);
});

module.exports = router;