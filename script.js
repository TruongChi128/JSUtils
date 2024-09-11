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

// search from chrome history then remove all of them

const timer = ms => new Promise(res => setTimeout(res, ms))
ele = document.querySelector('history-app').shadowRoot.querySelector('history-list')
while (true) {
    await timer(1000)
    items = document.querySelector('history-app').shadowRoot.querySelector('history-list').shadowRoot.querySelectorAll('history-item')
    for (let i = 0; i < items.length; i++) {
        item = items.item(i)
        item.shadowRoot.querySelector('cr-checkbox').click();
        if (item.hasAttribute("is-card-end")) {
            break;
        }
    }
    await timer(500)
    document.querySelector("#history-app").shadowRoot.querySelector("#toolbar").shadowRoot.querySelector("cr-toolbar-selection-overlay").querySelector("cr-button").click()
    await timer(500)
    document.querySelector("#history-app").shadowRoot.querySelector("#history").shadowRoot.querySelector("cr-dialog > div > cr-button.action-button").click()
    await timer(1500)
    searchResult = document.querySelector('history-app').shadowRoot.querySelector('history-list').shadowRoot.querySelector('#no-results')
    if (!searchResult.hasAttribute('hidden')) {
        break;
    }
}

//remove  item listing steam

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForElement(selector, timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const element = document.querySelector(selector);
        if (element && element.offsetParent !== null && !element.disabled) {
            return element;
        }
        await delay(100); // Poll every 100ms
    }
    throw new Error(`Timeout waiting for element ${selector}`);
}

async function waitForElementToDisappear(selector, timeout = 10000) {
    const startTime = Date.now();
    while (Date.now() - startTime < timeout) {
        const element = document.querySelector(selector);
        if (!element || element.offsetParent === null) {
            await delay(300);
			return;
        }
        await delay(100);
    }
    throw new Error(`Timeout waiting for element to disappear: ${selector}`);
}

async function performClicks() {
    const items = document.querySelectorAll('span.item_market_action_button_contents');
    for (const item of items) {
        item.click();
        console.log("Clicked on item");

        try {
            const confirmButton = await waitForElement('span#market_removelisting_dialog_accept');
            confirmButton.click();
            console.log("Clicked on confirm button");
        } catch (error) {
            console.log("Confirm button not found or not clickable!");
        }
        await waitForElementToDisappear('span#market_removelisting_dialog_accept');
    }
}
performClicks();

//remove listing steam slower version
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function performClicks() {
    const items = document.querySelectorAll('span.item_market_action_button_contents');
    for (const item of items) {
        item.click();
        console.log("Clicked on item");
        await delay(1000);
        const confirmButton = document.querySelector('span#market_removelisting_dialog_accept');
        if (confirmButton) {
            confirmButton.click();
            await delay(2000);
        } else {
            console.log("Confirm button not found!");
        }
    }
}
performClicks();

/**
 * Get absolute xPath position from dom element
 * xPath position will does not contain any id, class or attribute, etc selector
 * Because, Some page use random id and class. This function should ignore that kind problem, so we're not using any selector
 * 
 * @param {Element} element element to get position
 * @returns {String} xPath string
 */
 function getXPath(element) {
    // Selector
    let selector = '';
    // Loop handler
    let foundRoot;
    // Element handler
    let currentElement = element;

    // Do action until we reach html element
    do {
        // Get element tag name 
        const tagName = currentElement.tagName.toLowerCase();
        // Get parent element
        const parentElement = currentElement.parentElement;

        // Count children
        if (parentElement.childElementCount > 1) {
            // Get children of parent element
            const parentsChildren = [...parentElement.children];
            // Count current tag 
            let tag = [];
            parentsChildren.forEach(child => {
                if (child.tagName.toLowerCase() === tagName) tag.push(child) // Append to tag
            })

            // Is only of type
            if (tag.length === 1) {
                // Append tag to selector
                selector = `/${tagName}${selector}`;
            } else {
                // Get position of current element in tag
                const position = tag.indexOf(currentElement) + 1;
                // Append tag to selector
                selector = `/${tagName}[${position}]${selector}`;
            }

        } else {
            //* Current element has no siblings
            // Append tag to selector
            selector = `/${tagName}${selector}`;
        }

        // Set parent element to current element
        currentElement = parentElement;
        // Is root  
        foundRoot = parentElement.tagName.toLowerCase() === 'html';
        // Finish selector if found root element
        if(foundRoot) selector = `/html${selector}`;
    }
    while (foundRoot === false);

    // Return selector
    return selector;
}

//* Example
// const button = document.querySelector("#main > div:nth-child(27) > a.w3-left.w3-btn");
// getXPath(button) // '/html/body/div[7]/div[1]/div[1]/div[4]/a[1]'
