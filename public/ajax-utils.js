(function (global) {

  // Set up a namespace for our utility
  var ajaxUtils = {};


  // Returns an HTTP request object
  function getRequestObject() {
    if (global.XMLHttpRequest) {
      return (new XMLHttpRequest());
    }
    else if (global.ActiveXObject) {
      // For very old IE browsers (optional)
      return (new ActiveXObject("Microsoft.XMLHTTP"));
    }
    else {
      global.alert("Ajax is not supported!");
      return (null);
    }
  }

  // Makes an Ajax GET request to 'requestUrl'
  ajaxUtils.requestFromServer =
    function (requestUrl, action, jsonobject, responseHandler) {
      var data = JSON.stringify({ "action": action, "data": jsonobject });
      var request = getRequestObject();
      request.onreadystatechange =
        function () {
          handleJsonSendResponse(request, responseHandler);
        };
      request.open("POST", requestUrl, true);
      request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      request.send(data);
    };

  function handleJsonSendResponse(request, responseHandler) {
    if ((request.readyState == 4) && (request.status == 200)) {
      var response =JSON.parse(request.responseText);
      if (!response) { alert ("Response Error"); return; }
      if (response.status == false) {
        alert(response.data); return;
      }
      responseHandler(response.data);
    }
  }


  //=============== Load HTML into MainContent
  var loadedHTML = new Array();
  ajaxUtils.loadHTML =
    function (filename, callback) {
      var found = loadedHTML.find(f => f.fileName == filename);
      if (!found) {
        $ajaxUtils.getText(filename, (text) => {
          loadedHTML.push({ 'fileName': filename, 'text': text });
          insertMainContent(text);
          callback();
        });
      } else {
        insertMainContent(found.text);
        callback();
      }
    }

  ajaxUtils.getText =
    function (requestUrl, responseHandler) {
      var request = getRequestObject();
      request.onreadystatechange = function () {
        //      handleReplaceMainContentResponse(request, responseHandler);
        if ((request.readyState == 4) && (request.status == 200)) {
          responseHandler(request.responseText);
        }
      };
      request.open("GET", requestUrl, true);
      request.send(null); // for POST only
    };


  // Expose utility to the global object
  global.$ajaxUtils = ajaxUtils;


})(window);