let x, y;
let count = 0;
let model, graph = null, parent;
let oldVertex = null;
let container = null;

function initialize() {
  container = document.getElementById('add-container');
  if (!mxClient.isBrowserSupported()) {
    // Displays an error message if the browser is not supported.
    mxUtils.error('Browser is not supported!', 200, false);
  } else {
    // x = 2;
    // y = 20;
    oldVertex = null;
    graph = null;
    count = 0;
    model = new mxGraphModel();
    graph = new mxGraph(container, model);
    console.log(graph)
    // Gets the default parent for inserting new cells. This
    // is normally the first child of the root (ie. layer 0).
    parent = graph.getDefaultParent();
    // mxConnectionHandler.prototype.connectImage = new mxImage('images/connector.gif', 16, 16);
    // Enables new connections in the graph
    // graph.setConnectable(true);
    // graph.setMultigraph(false);

    // Stops editing on enter or escape keypress
    // graph.addListener(mxEvent.CLICK, function(sender, evt)
    // {
    //   var cell = evt.getProperty('cell');
    //
    //   if (cell != null)
    //   {
    //     console.log(cell.value,cell.id);
    //   }
    // });

    /** context menu**/
    mxEvent.disableContextMenu(container);
    mxConstants.HANDLE_FILLCOLOR = '#99ccff';
    mxConstants.HANDLE_STROKECOLOR = '#0088cf';
    mxConstants.VERTEX_SELECTION_COLOR = '#00a8ff';
    //graph.setTooltips(true);
    // var overlay = new mxCellOverlay(new mxImage('editors/images/overlays/check.png', 16, 16), 'Overlay tooltip');

    var mxCellRendererInstallCellOverlayListeners = mxCellRenderer.prototype.installCellOverlayListeners;
    mxCellRenderer.prototype.installCellOverlayListeners = function (state, overlay, shape) {
      mxCellRendererInstallCellOverlayListeners.apply(this, arguments);
      var graph = state.view.graph;

      mxEvent.addGestureListeners(shape.node,
        function (evt) {
          graph.fireMouseEvent(mxEvent.MOUSE_DOWN, new mxMouseEvent(evt, state));
        },
        function (evt) {
          graph.fireMouseEvent(mxEvent.MOUSE_MOVE, new mxMouseEvent(evt, state));
        },
        function (evt) {
          if (mxClient.IS_QUIRKS) {
            graph.fireMouseEvent(mxEvent.MOUSE_UP, new mxMouseEvent(evt, state));
          }
        });

      if (!mxClient.IS_TOUCH) {
        mxEvent.addListener(shape.node, 'mouseup', function (evt) {
          overlay.fireEvent(new mxEventObject(mxEvent.CLICK,
            'event', evt, 'cell', state.cell));
        });
      }
    };
    // Configures automatic expand on mouseover
    graph.popupMenuHandler.autoExpand = true;

    // Installs context menu
    graph.popupMenuHandler.factoryMethod = function (menu, cell, evt) {
      // console.log('----------- ', cell);
      if (cell !== null && cell.id !== -1) {
        // if (cell.value === 'Approval-User') {
          menu.addItem('Define State', null, function () {
            var event = new CustomEvent("customClick", {
              "detail": {
                "menu": cell.value,
                "id": cell.id
              }
            });
            document.dispatchEvent(event);
          });
        // }
      }
    };

    graph.connectionHandler.addListener(mxEvent.CONNECT, function (sender, evt) {
      var edge = evt.getProperty('cell');
      console.log(edge)
      var source = graph.getModel().getTerminal(edge, true);
      var target = graph.getModel().getTerminal(edge, false);
      var event = new CustomEvent("onConnectNode", {
        "detail": {
          "source": {"values": source.value, "id": source.id},
          "target": {"values": target.value, "id": target.id},
          "graph": edge
        }
      });
      document.dispatchEvent(event);
      // console.log(source, target.id)
    });


    /** context menu completed here**/

      // Returns the graph under the mouse
    var graphF = function (evt) {
        var x = mxEvent.getClientX(evt);
        var y = mxEvent.getClientY(evt);
        var elt = document.elementFromPoint(x, y);

        // for (var i = 0; i < graphs.length; i++)
        // {
        if (mxUtils.isAncestorNode(graph.container, elt)) {
          return graph;
        }
        // }

        return null;
      };
    // Disables built-in DnD in IE (this is needed for cross-frame DnD, see below)
    // if (mxClient.IS_IE) {
    //   mxEvent.addListener(img, 'dragstart', function (evt) {
    //     evt.returnValue = false;
    //   });
    // }
    // console.log(document.getElementById('di'));
    var keyHandler = new mxKeyHandler(graph);

    /**
     * on delete key press,remove selected node and
     * create a edges between adjacent vertices
     */
    keyHandler.bindKey(46, function (evt) {
      if (graph.isEnabled()) {
        const selectedCell = graph.getSelectionCell();
        if (selectedCell.isEdge()) {
          // console.log('>>>>>>> ', {"source": selectedCell.source.value, "target": selectedCell.target.value})
          // selectedCell.remove()
          // graph.removeCells();
          console.log('selectedCell ', selectedCell);
          var event = new CustomEvent("onRemoveConnectorClick", {
            "detail": {
              "graph": graph,
              "selectedCell": selectedCell,
              "source": selectedCell.source.id,
              "target": selectedCell.target.id
            }
          });
          document.dispatchEvent(event);
        } else {
          var event = new CustomEvent("deleteNodeRequest", {"detail": {"cell": selectedCell, "id": selectedCell.id}});
          document.dispatchEvent(event);
          // console.log(selectedCell)
          /*if (graph.getIncomingEdges(selectedCell)[0]) {
            let source = graph.getIncomingEdges(selectedCell)[0].source;
            if (graph.getOutgoingEdges(selectedCell)[0]) {
              let target = graph.getOutgoingEdges(selectedCell)[0].target;
              graph.removeCells();
              graph.insertEdge(parent, null, '', source, target);

            } else {
              oldVertex = source;
              graph.removeCells();
            }
            // if(selectedCell.value === "Model Execution") {
            console.log('selectedCell >> ', selectedCell);
            var event = new CustomEvent("deleteNode", {"detail": selectedCell.id.replace('state_', '')});
            document.dispatchEvent(event);
            // }
          } else {
            console.log('selectedCell >> ', selectedCell);
            var event = new CustomEvent("deleteNode", {"detail": selectedCell.id.replace('state_', '')});
            document.dispatchEvent(event);
            if (selectedCell.id !== 1) {
              graph.removeCells();
            }
          }*/
        }
      }
    });
    graph.addListener(mxEvent.DOUBLE_CLICK, function (sender, evt) {
      evt.consume();
    });
    const cont = document.getElementsByClassName("statename");
    // console.log(cont.length)
    for (let i = 0; i < cont.length; i++) {
      // console.log(cont[i].childNodes[0].textContent);
      if (cont[i].id !== '') {
        // console.log(cont[i].childNodes);
        initializeDragButton(graph,
          cont[i].childNodes[0].textContent.trim(),
          '', document.getElementById(cont[i].id), 'edit',cont[i].id);
      }
    }
  }
}

function initializeDragButton(graph, label, image, div, type = null,id=null) {
  console.log('------- ', id);
  var funct = function (graph, evt, cell, x, y) {
    console.log('uuuuuuuuuuuuuu ', div.id);
    // console.log('uuuuuuuuuuuuuu ', div.dataset.name);
    // console.log('-------> ', id);

    let currentTime = new Date().getTime();
    id = div.id + '_' + currentTime;
    // console.log(id);
    var event = new CustomEvent("createNode", {"detail": {"elemId": div.id + '_' + currentTime, "name": label}});
    document.dispatchEvent(event);
    // console.log(id);
    createNode(label, x, y, image, type,id);
  };
  var dragElt = document.createElement('div');
  dragElt.style.border = 'dashed black 1px';
  dragElt.style.width = '100px';
  dragElt.style.height = '50px';
  mxUtils.makeDraggable(div, graph, funct, dragElt, 0, 0, true, true);
}

function createNode(name, x, y, image = null, type = null,id) {
  // if (count > 0) {
  //   x = x + 180;
  // }
  // console.log('>>>>>>>>>>>> ', id);
  count++;
  model.beginUpdate();
  graph.setAllowDanglingEdges(false);
  graph.setDisconnectOnMove(false);
  mxConnectionHandler.prototype.connectImage = new mxImage('/../assets/img/connector.gif', 16, 16);
  graph.setConnectable(true);
  try {
    let newVertex = '';
    if (image !== null && image !== '') {
      newVertex = graph.insertVertex(parent, id, name, x, y, 120, 50, 'shape=label;image=' + image + ';imageWidth=16;imageHeight=16;spacingLeft=20;fillColor=#4E4E4E;fontColor=white');
    } else {
      newVertex = graph.insertVertex(parent, id, name, x, y, 120, 50, 'fillColor=#4E4E4E;fontColor=white');
    }
    // console.log(newVertex.getGeometry());
    if (oldVertex !== null && type === null) {
      graph.insertEdge(parent, '', '', oldVertex, newVertex);
    }
    oldVertex = newVertex;
  } finally {
    // Updates the display
    model.endUpdate();
  }
}

function clearGraph(){
  if(graph) {
    graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
    container.innerHTML='';
  }
}
function getXml() {
  var encoder = new mxCodec();
  var node = encoder.encode(graph.getModel());
  var xml = mxUtils.getXml(node);
  return xml;
}

function parseXmlJSON() {
  var encoder = new mxCodec();
  var node = encoder.encode(graph.getModel());

  var testString = mxUtils.getXml(node);   // fetch xml (string or document/node)
  var result = xmlToJSON.parseString(testString);   // parses to JSON object
  // mxUtils.popup(JSON.stringify(result, null, 4), true); // turns into string
  return result;
}

function mapXmldata(xml) {
  // console.log(graph);
  var xmlDocument = mxUtils.parseXml(xml);
  // console.log(xmlDocument);
  if (xmlDocument.documentElement != null && xmlDocument.documentElement.nodeName == 'mxGraphModel') {
    var decoder = new mxCodec(xmlDocument);
    var node = xmlDocument.documentElement;
    decoder.decode(node, graph.getModel());
    parent = graph.getDefaultParent();
    for (var key in graph.getModel().cells) {
      const cell = graph.getModel().getCell(key);
      if (graph.getModel().isVertex(cell)) {
        oldVertex = cell;
      }
      // console.log(tmp,graph.getModel().isVertex(tmp));
    }

    graph.setAllowDanglingEdges(false);
    graph.setDisconnectOnMove(false);

    mxConnectionHandler.prototype.connectImage = new mxImage('/../assets/img/connector.gif', 16, 16);

    graph.setConnectable(true);
    graph.setMultigraph(false);
  }
}

function deleteLastCell() {
  if (graph.isEnabled()) {
    const selectedCell = oldVertex;
    if (graph.getIncomingEdges(selectedCell)[0]) {
      let source = graph.getIncomingEdges(selectedCell)[0].source;
      oldVertex = source;
      graph.removeCells([selectedCell]);
    } else {
      if (selectedCell.id !== 1) {
        graph.removeCells([selectedCell]);
      }
    }
  }
}

function deleteNode_2(selectedCell) {
  if (graph.getIncomingEdges(selectedCell)[0]) {
    let source = graph.getIncomingEdges(selectedCell)[0].source;
    if (graph.getOutgoingEdges(selectedCell)[0]) {
      let target = graph.getOutgoingEdges(selectedCell)[0].target;
      graph.removeCells();
      // graph.insertEdge(parent, null, '', source, target);

    } else {
      oldVertex = source;
      graph.removeCells();
    }
    var event = new CustomEvent("deleteNode", {"detail": selectedCell.id});
    document.dispatchEvent(event);
  } else {
    var event = new CustomEvent("deleteNode", {"detail": selectedCell.id});
    document.dispatchEvent(event);
    if (selectedCell.id !== 1) {
      graph.removeCells();
    }
  }
}

function confirmRemoveConnector(graph, selectedCell) {
  graph.removeCells();
  console.log('selectedCell ', selectedCell);
  var event = new CustomEvent("onRemoveConnector", {
    "detail": {
      "source": selectedCell.source.id,
      "target": selectedCell.target.id
    }
  });
  document.dispatchEvent(event);
}

function connectionNotValid(graph) {
  graph.removeCells();
}
