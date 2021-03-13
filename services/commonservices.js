class ResponseClass {
    constructor(status, data) {
        this.status = status;
        this.data = data;
    }
}
StdErrorResponse = new ResponseClass(false, "Error");

function sendResponse(req, res, jResponse) {
    res.setHeader('Content-Type','application/json');
    res.statusCode = 200; 
    if (!jResponse) 
        jResponse = new ResponseClass(false, "Unhandled Request.");
    res.json(jResponse);
}

module.exports = {ResponseClass, StdErrorResponse, sendResponse};