"use strict";var isMac=void 0!==this.navigator&&void 0!==this.navigator.platform&&this.navigator.platform.toUpperCase().indexOf('MAC')>=0;function Robot(o){void 0===o&&(o=null),this.diagram=o}Robot.prototype.initializeEvent=function(o,t){if(t)for(var e in t)'sourceDiagram'!==e&&(o[e]=t[e]),'control'===e&&(isMac?o.alt=t[e]:o[e]=t[e])},Robot.prototype.mouseDown=function(o,t,e,i){if('number'!=typeof o||'number'!=typeof t)throw new Error('Robot.mouseDown first two args must be X,Y numbers');void 0===e&&(e=0);var r=this.diagram;if(i&&i.sourceDiagram&&(r=i.sourceDiagram),r.isEnabled){var n=new go.InputEvent;n.diagram=r,n.documentPoint=new go.Point(o,t),n.viewPoint=r.transformDocToView(n.documentPoint),n.timestamp=e,n.down=!0,this.initializeEvent(n,i),r.lastInput=n,r.firstInput=n.copy(),r.currentTool.doMouseDown()}},Robot.prototype.mouseMove=function(o,t,e,i){if('number'!=typeof o||'number'!=typeof t)throw new Error('Robot.mouseMove first two args must be X,Y numbers');void 0===e&&(e=0);var r=this.diagram;if(i&&i.sourceDiagram&&(r=i.sourceDiagram),r.isEnabled){var n=new go.InputEvent;n.diagram=r,n.documentPoint=new go.Point(o,t),n.viewPoint=r.transformDocToView(n.documentPoint),n.timestamp=e,this.initializeEvent(n,i),r.lastInput=n,r.currentTool.doMouseMove()}},Robot.prototype.mouseUp=function(o,t,e,i){if('number'!=typeof o||'number'!=typeof t)throw new Error('Robot.mouseUp first two args must be X,Y numbers');void 0===e&&(e=0);var r=this.diagram;if(i&&i.sourceDiagram&&(r=i.sourceDiagram),r.isEnabled){var n=new go.InputEvent;n.diagram=r,n.documentPoint=new go.Point(o,t),n.viewPoint=r.transformDocToView(n.documentPoint),n.timestamp=e,n.up=!0,r.firstInput.documentPoint.equals(n.documentPoint)&&(n.clickCount=1),this.initializeEvent(n,i),r.lastInput=n,r.currentTool.doMouseUp()}},Robot.prototype.mouseWheel=function(o,t,e){if('number'!=typeof o)throw new Error('Robot.mouseWheel first arg must be DELTA number');void 0===t&&(t=0);var i=this.diagram;if(i.isEnabled){var r=i.lastInput.copy();r.diagram=i,r.delta=o,r.timestamp=t,this.initializeEvent(r,e),i.lastInput=r,i.currentTool.doMouseWheel()}},Robot.prototype.keyDown=function(o,t,e){if('string'!=typeof o&&'number'!=typeof o)throw new Error('Robot.keyDown first arg must be a string or a number');void 0===t&&(t=0);var i=this.diagram;if(i.isEnabled){var r=i.lastInput.copy();r.diagram=i,'string'==typeof o?r.key=o:'number'==typeof o&&(r.key=String.fromCharCode(o)),r.timestamp=t,r.down=!0,this.initializeEvent(r,e),i.lastInput=r,i.currentTool.doKeyDown()}},Robot.prototype.keyUp=function(o,t,e){if('string'!=typeof o&&'number'!=typeof o)throw new Error('Robot.keyUp first arg must be a string or a number');void 0===t&&(t=0);var i=this.diagram;if(i.isEnabled){var r=i.lastInput.copy();r.diagram=i,'string'==typeof o?r.key=o:'number'==typeof o&&(r.key=String.fromCharCode(o)),r.timestamp=t,r.up=!0,this.initializeEvent(r,e),i.lastInput=r,i.currentTool.doKeyUp()}};
const diagram = go.Diagram.fromDiv("ebx_WorkflowModelDiagram");
const robot = new Robot(diagram);

function findNodeByTitle(title) {
    for (const data of diagram.model.nodeDataArray) {
        if (data.title == title){
            return diagram.findNodeForData(data);
        }
    }
    return null;
}
function scrollToNode(title){
    var node = findNodeByTitle(title);
    diagram.scale = 1;
    diagram.commandHandler.scrollToPart(node);
}
function clickOnNode(title){
    var node = findNodeByTitle(title);
    scrollToNode(title);
    if(node.isSelected == false) {
        diagram.select(node);
    }
    return node.isSelected;
    //    var nodeLoc = node.getDocumentPoint(go.Spot.Center);
//    var nodeLoc = node.location;
//    robot.mouseDown(nodeLoc.x + 10, nodeLoc.y + 10, 0, {});
//    robot.mouseUp(nodeLoc.x + 10, nodeLoc.y + 10, 100, {});
}

function clickOnNodeByKey(key){
    var node = findNodeByKey(key);
    if(node.isSelected == false) {
        diagram.select(node);
    }
    return node.isSelected;
    //    var nodeLoc = node.getDocumentPoint(go.Spot.Center);
//    var nodeLoc = node.location;
//    robot.mouseDown(nodeLoc.x + 10, nodeLoc.y + 10, 0, {});
//    robot.mouseUp(nodeLoc.x + 10, nodeLoc.y + 10, 100, {});
}
function getLink(fNodeTitle, tNodeTitle){
    var fNode = findNodeByTitle(fNodeTitle);
	var tNode = findNodeByTitle(tNodeTitle)
	var linkIt = diagram.findLinksByExample({from: fNode.key, to: tNode.key});
	var it = linkIt.iterator;
	if (it.next()) {
		return it.value;
	}
}
function getLinkLocation(fNodeTitle, tNodeTitle){
    var link = getLink(fNodeTitle, tNodeTitle);
	var docLoc = link.points.get(1);
	var viewLoc = diagram.transformDocToView(new go.Point(docLoc.x, docLoc.y));
    return viewLoc.x+";"+viewLoc.y;
}
function getLastInputLocation(){
    var viewLoc = diagram.lastInput.viewPoint;
    return viewLoc.x+";"+viewLoc.y;
}
function clickOnAddNodeButton(fNodeTitle, tNodeTitle){
   var link = getLink(fNodeTitle, tNodeTitle);
    setTimeout(diagram.select(link), 3000);
//    var button = link.findAdornment("addNode");
    var docLoc = link.getDocumentPoint(go.Spot.Center);
    robot.mouseDown(docLoc.x, docLoc.y, 0, {});
    robot.mouseUp(docLoc.x, docLoc.y, 100, {});
}
function openNode(title){
    var node = findNodeByTitle(title);
    if (node == null) {
        return 'Node not found. It could be due to wrong title of node!';
    }
    scrollToNode(title);
    var docLoc = node.location;
    robot.mouseDown(docLoc.x + 10, docLoc.y + 10, 0, {});
    robot.mouseUp(docLoc.x + 10, docLoc.y + 10, 100, {});
    robot.mouseDown(docLoc.x + 10, docLoc.y + 10, 200, {clickCount: 2});
    robot.mouseUp(docLoc.x + 10, docLoc.y + 10, 300, {clickCount: 2});
    return 'Click at location x: ' + docLoc.x +' y: '+ docLoc.y;
}
function clickOnAButtonOfNode(version,title, nodeShape, btnName){
    var offset;
    switch(nodeShape) {
        case 'Rectangle':
            offset = {'edit': 18, 'del': 41, 'duplicate': 69, 'redirect': 95, 'hide': 120};
            break;
        case 'Diamond':
        if(version.includes('RC'))
           offset = {'edit': -16, 'del': 10, 'duplicate': 37, 'redirect': 61, 'hide': 88};
           else{
            offset = {'edit': 4, 'del': 20, 'duplicate': 57, 'redirect': 81, 'hide': 108};
           }
            break;
        case 'Circle':
            offset = {'edit': -22, 'del': 3, 'duplicate': 31, 'redirect': 56, 'hide': 82};
            break;
        default:
            return 'Node shape is wrong. Check again!';
    }
    var node = findNodeByTitle(title);
    if (node == null) {
        return 'Node not found. It could be due to wrong title of node!';
    }
    var docLoc = node.getDocumentPoint(go.Spot.TopLeft);
    var tDocLoc;
    switch(btnName) {
        case 'Edit':
            tDocLoc = new go.Point(docLoc.x + offset.edit, docLoc.y - 15);
            break;
        case 'Delete':
            tDocLoc = new go.Point(docLoc.x + offset.del, docLoc.y - 15);
            break;
        case 'Duplicate':
            tDocLoc = new go.Point(docLoc.x + offset.duplicate, docLoc.y - 15);
            break;
        case 'Redirect':
            tDocLoc = new go.Point(docLoc.x + offset.redirect, docLoc.y - 15);
            break;
        case 'Hide':
            tDocLoc = new go.Point(docLoc.x + offset.hide, docLoc.y - 15);
            break;
        default:
            return 'Button name is wrong. Check again!';
    }
    robot.mouseDown(tDocLoc.x, tDocLoc.y, 0, {});
    robot.mouseUp(tDocLoc.x, tDocLoc.y, 100, {});
    return 'Click at location x: ' + tDocLoc.x +' y: '+ tDocLoc.y + " node.isSelected " +node.isSelected;
}
function moveNode(title){
	var node = findNodeByTitle(title);
	var docLoc1 = node.location;
	robot.mouseDown(docLoc1.x + 10, docLoc1.y + 10, 0, {});
	robot.mouseMove(docLoc1.x + 60, docLoc1.y + 60, 100, {});
	robot.mouseUp(docLoc1.x + 60, docLoc1.y + 60, 200, {});
	var docLoc2 = node.location;
	return (docLoc2.x - docLoc1.x) + ";"+ (docLoc2.y - docLoc1.y);
}
function isGridVisible(){
    var dia = go.Diagram.fromDiv("ebx_WorkflowModelDiagram");
    return dia.grid.isVisibleObject();
}
function getAllNodes(){
    var dia = go.Diagram.fromDiv("ebx_WorkflowModelDiagram");
	const nodes = [];
	for (const data of dia.model.nodeDataArray) {
        var node = dia.findNodeForData(data);
		var nodeObj = {key: node.key, x: parseFloat(node.location.x).toFixed(2), y: parseFloat(node.location.y).toFixed(2)};
		nodes.push(nodeObj);
    }
	return nodes;
}
function getAllLinks(){
    var dia = go.Diagram.fromDiv("ebx_WorkflowModelDiagram");
	const links = [];
	for (const dt of dia.model.linkDataArray) {
	    var fNode = dia.findNodeForKey(dt.from);
	    var tNode = dia.findNodeForKey(dt.to);
        var linkIt = dia.findLinksByExample({from: fNode.key, to: tNode.key});
        var it = linkIt.iterator;
        var link;
        if (it.next()) {
            link = it.value;
        }
		var linkObj = {from: link.fromNode.key, to: link.toNode.key, x: parseFloat(link.location.x).toFixed(2), y: parseFloat(link.location.y).toFixed(2)};
		links.push(linkObj);
	}
	return links;
}
function getAllLinksWithInforTitle(){
    var dia = go.Diagram.fromDiv("ebx_WorkflowModelDiagram");
	const links = [];
	for (const dt of dia.model.linkDataArray) {
	    var fNode = dia.findNodeForKey(dt.from);
	    var tNode = dia.findNodeForKey(dt.to);
        var linkIt = dia.findLinksByExample({from: fNode.key, to: tNode.key});
        var it = linkIt.iterator;
        var link;
        if (it.next()) {
            link = it.value;
        }
		var linkObj = {from: link.fromNode.jb.title, to: link.toNode.jb.title};
		links.push(linkObj);
	}
	return links;
}
function selectAllUserDefinedSteps(){
    var dia = go.Diagram.fromDiv("ebx_WorkflowModelDiagram");
    dia.nodes.each(node => {
    	if(node.key != 'start' && node.key != 'end' && node.isSelected == false){
    		node.isSelected  = true;
    	}
    });
}
function isOverviewDiagramExist(){
	var ovDia = go.Diagram.fromDiv('ebx_WorkflowDiagramOverview');
	return ovDia != null;
}

function compareOrder(title, index){
    var dia = go.Diagram.fromDiv("ebx_WorkflowModelDiagram");
    const nodes = [];
	for (const data of dia.model.nodeDataArray) {
        var node = dia.findNodeForData(data);
		var nodeObj = {key: node.key, x: node.location.x, y: node.location.y};
		nodes.push(nodeObj);
    }
    var nodeToCompare = findNodeByTitle(title);
	return nodeToCompare.key==nodes[index].key && nodeToCompare.location.x==nodes[index].x && nodeToCompare.location.y==nodes[index].y;
}

function getVisibleState(title){
    var node = findNodeByTitle(title);
    return node.jb.hidden;
}

function getLinkWithLabel(fNodeTitle, tNodeTitle, label){
    var fNode = findNodeByTitle(fNodeTitle);
    var tNode = findNodeByTitle(tNodeTitle);
    var linkIt = diagram.findLinksByExample({from: fNode.key, to: tNode.key});
    var it = linkIt.iterator;
    var finalLink;
    var portId = label == 'Yes' ? "ifTrue" : "ifFalse";
          it.each(function(link){
                 if(link.fromPortId == portId) {
                             finalLink = link;
                              }
                          })
    var docLoc = finalLink.points.get(1);
    var viewLoc = diagram.transformDocToView(new go.Point(docLoc.x, docLoc.y));
    return viewLoc.x+";"+viewLoc.y;
}
function getNodeDisplayedStatus(title){
    for (const data of diagram.model.nodeDataArray) {
            if (data.title == title){
                return true;
            }
        }
        return false;
}

function getCoordinatesOfNode(nodeTitle){
    var node = findNodeByTitle(nodeTitle)
    robot.mouseMove(node.location.x, node.location.y)
    return [node.location.x, node.location.y]
}

function findAllNodesByTitle(title) {
    var dia = go.Diagram.fromDiv("ebx_WorkflowModelDiagram");
    const nodes = [];
    for (const data of diagram.model.nodeDataArray) {
        if (data.title == title){
            var node = diagram.findNodeForData(data);
            var nodeObj = node.key;
            nodes.push(nodeObj);
        }
    }
    return nodes;
}

function findNodeByKey(key) {
    for (const data of diagram.model.nodeDataArray) {
        if (data.key == key){
            return diagram.findNodeForKey(key);
        }
    }
    return null;
}

function removeDuplicateNode(key, nodeShape) {
    var offset;
    switch (nodeShape) {
        case 'Rectangle':
            offset = 41 
            break;
        case 'Diamond':
            offset = 20
            break;
        case 'Circle':
            offset = 3
            break;
        default:
            return 'Node shape is wrong. Check again!';
    }
    var node = findNodeByKey(key);
    if (node == null) {
            return 'Node not found. It could be due to wrong title of node!';
        }
    var docLoc = node.getDocumentPoint(go.Spot.TopLeft);
    var tDocLoc = new go.Point(docLoc.x + offset, docLoc.y - 15);
//    diagram.scale = 1;
//    diagram.commandHandler.scrollToPart(node);
////    if(node.isSelected == false) {
//    clickOnNodeByKey(key);
////    }
    robot.mouseDown(tDocLoc.x, tDocLoc.y, 0, {});
    robot.mouseUp(tDocLoc.x, tDocLoc.y, 100, {});
    return 'Click at location x: ' + tDocLoc.x +' y: '+ tDocLoc.y + " node.isSelected " +node.isSelected;
}

function getValueOfNode(title){
    var node = findNodeByTitle(title)
    var nodeObj = [
        ["Identifier", node.jb.key.replace("s", "")],
        ["Step name", node.jb.title],
        ["Description", node.jb.description],
        ["Is hidden", node.jb.hidden]
    ]
    return nodeObj
}

function moveLinkBetweenNodeAndNodeToNode(fNodeTitle, tNodeTitle, attNodeTitle){
    var link = getLink(fNodeTitle, tNodeTitle)
    var node = findNodeByTitle(attNodeTitle)
    var docLoc = node.getDocumentPoint(go.Spot.Center);
    var it = link.points.iterator
    var points = []
    it.each(val => {
        points.push(val);
    });
    var last = points.pop()
    diagram.select(link)
    for (let i = 1; i <= 2; i++) {
    robot.mouseDown(last.x - 10, last.y, 0, {})
    robot.mouseMove(docLoc.x, docLoc.y, 100, {})
    robot.mouseUp(docLoc.x, docLoc.y, 200, {})
    }
}

function isLinkConnected(fNodeTitle, tNodeTitle){
    var link = getLink(fNodeTitle, tNodeTitle)
    if (link == null){
        return false;
    } else {
        diagram.select(link)
        return link.isSelected
    }
}

function getTypeOfNodeShape(nodeTitle){
    var node = findNodeByTitle(nodeTitle)
    var numbers = node.findObject("SHAPE").strokeDashArray
    if (numbers == null){
        return "solid";
    }
    return "dash";
}
