var index = 0;
var DELIMITER = '\r';

//$("#graph-data").html('Graph Data');

function handlePartialResponse(request) {
  var i = request.responseText.indexOf(DELIMITER, index);
  while (i > index) {
    i += DELIMITER.length;
    var newChunk = request.responseText.substr(index, (i - index));
    index = i;
    i = request.responseText.indexOf(DELIMITER, index);
    flushBuffer(newChunk);
  }
}

function flushBuffer(buffer) {
  console.log(buffer)
  o = JSON.parse(buffer);
  for (var key in o) {
    if (o.hasOwnProperty(key)) {
      switch(key) {
      case 'an': addNodes(o.an);
      case 'ae': addEdges(o.ae);
      case 'de': deleteEdges(o.de);
    }
    }
  }
  //$("#graph-data").html(JSON.stringify(o));
}

function addNodes(nodes) {
  for (var key in nodes) {
    if (nodes.hasOwnProperty(key)) {
        add_node(key);
    }
  }
}

function addEdges(edges) {
  for (var key in edges) {
    if (edges.hasOwnProperty(key)) {
        add_edge(key, edges[key].source, edges[key].target);
    }
  }
}

function deleteEdges(edges) {
  for (var key in edges) {
    if (edges.hasOwnProperty(key)) {
        delete_edge(key);
    }
  }
}


var myxhr = $.ajax({
   url:        "/ht09",
   type:       "GET",
   dataType:   "text",
   beforeSend: function(xhr){

       xhr.onreadystatechange = function(){
           console.log('statechange');
           handlePartialResponse(xhr);
       };
   },
   success:    function(data){
       //console.log(data);
   },
   error:      function(xhr, textStatus, error){
       console.log(xhr.statusText, textStatus, error);
   }
});

