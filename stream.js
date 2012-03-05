var index = 0;
var DELIMITER = '\r';

$("#graph-data").html('Graph Data');

function handlePartialResponse(request) {
  var i = request.responseText.indexOf(DELIMITER, index);
  while (i > index) {
    i += DELIMITER.length;
    var newChunk = request.responseText.substr(index, (i - index));
    index = i;
    flushBuffer(newChunk);
  }
}

function flushBuffer(buffer) {
  o = window.eval('(' + buffer + ')');
  for (var key in o) {
    switch(key) {
    case 'an': addNodes(o.an);
    case 'ae': addEdges(o.ae);
    }
  }
  //$("#graph-data").html(JSON.stringify(o));
}

function addNodes(nodes) {
  for (var key in nodes) {
    $("#graph-data").html('add node ' + key);
  }
}

function addEdges(edges) {
  for (var key in edges) {
    $("#graph-data").html('add edge ' + key + ' from ' + edges[key].source + ' to ' + edges[key].target);
  }
}

var myxhr = $.ajax({
   url:        "/stream",
   type:       "GET",
   dataType:   "text",
   beforeSend: function(xhr){

       xhr.onreadystatechange = function(){
           console.log('statechange');
           handlePartialResponse(xhr);
       };
   },
   success:    function(data){
       console.log(data);
   },
   error:      function(xhr, textStatus, error){
       console.log(xhr.statusText, textStatus, error);
   }
});
