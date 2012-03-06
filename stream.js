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
  o = JSON.parse(buffer);
  for (var key in o) {
    if (o.hasOwnProperty(key)) {
      switch(key) {
      case 'an': addNodes(o.an);
      case 'ae': addEdges(o.ae);
    }
    }
  }
  //$("#graph-data").html(JSON.stringify(o));
}

function addNodes(nodes) {
  for (var key in nodes) {
    if (nodes.hasOwnProperty(key)) {
        $("#graph-data").html('add node ' + key);
        add_node(key);
        //update_graph();
    }
  }
}

function addEdges(edges) {
  for (var key in edges) {
    if (edges.hasOwnProperty(key)) {
        $("#graph-data").html('add edge ' + key + ' from ' + edges[key].source + ' to ' + edges[key].target);
        add_edge(edges[key].source, edges[key].target);
        //update_graph();
    }
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
       //console.log(data);
   },
   error:      function(xhr, textStatus, error){
       console.log(xhr.statusText, textStatus, error);
   }
});

