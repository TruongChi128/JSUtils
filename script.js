// The result depends on both rate and view port.
function getRelativePositionOf(xpath, rate) {
    var ele = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    var posX = ele.getBoundingClientRect().x;
    var posY = ele.getBoundingClientRect().y;
    var docWidth = document.body.getBoundingClientRect().width;
    var docHeight = document.body.getBoundingClientRect().height;
    console.log("element: " + posX + "---" + posY)
    console.log("doc: " + docWidth + "---" + docHeight)
    rPos = "";
    if (posY > 0 && posY <= rate * docHeight) {
        rPos += "Top";
    }
    if (posY >= ((docHeight / 2) - ((rate / 2) * docHeight)) && posY <= ((docHeight / 2) + ((rate / 2) * docHeight))) {
        rPos += "Mid";
    }
    if (posY >= (1 - rate) * docHeight && posX <= docHeight) {
        rPos += "Bot";
    }
    if (posX >= 0 && posX <= (rate / 2) * docWidth) {
        rPos += " Left";
    }
    if (posX >= ((docWidth / 2) - ((rate / 2) * docWidth)) && posX <= ((docWidth / 2) + ((rate / 2) * docWidth))) {
        if (rPos != "Mid") {
            rPos += " Mid";
        }
    }
    if (posX >= (1 - rate) * docWidth && posX <= docWidth) {
        rPos += " Right";
    }
    console.log(rPos);
    return rPos;
}
return getRelativePositionOf("//*[@title='Information']", 0.3);
