const fs = require('fs');
const path = require('path');


function ReadJSON(filepath) {
 //   var x = __dirname;
//    console.log("Dir Name: " + x);
 //   var y = path.join(__dirname,filepath);
//    console.log('FullPath: ' + y);
    try {
        var data = fs.readFileSync(filepath);
        var d = JSON.parse(data);
        return d;
    }
    catch (err) {
        console.log("Fail to read: " + filepath)
        console.log(" Error: " + err);
        return undefined;
    }
};

function WriteJSON(filepath, data) {
    var result = true;
    try {
        ensureDirectoryExistence(filepath);
        fs.writeFileSync(filepath, JSON.stringify(data));
    }
    catch (err) {
        console.log(err);
        result = false;
    }
    // var str = " ServerWrite: " + filepath + "  - " + (result ? "Success" : "Fail!");
    // console.log(str);
    return result;
};
function ReadText(filepath) {
    try {
        var data = fs.readFileSync(filepath);
        return data.toString();
    }
    catch (err) {
        console.log("Fail to read: " + filepath)
        return undefined;
    }  
}

function ensureDirectoryExistence(filePath) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
      return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
  }

  function fileExists(filepath) {
      return fs.existsSync(filepath);
  }
module.exports = {ReadJSON, WriteJSON, ReadText, fileExists}