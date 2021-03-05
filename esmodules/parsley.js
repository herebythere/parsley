// brian taylor vann
// context
class ContextBase {
    // parent node reference
    // left node reference
    mount(parentNode, leftNode) {
        // attach siblings to parent
        // return leftmost node
        return;
    }
    unmount() {
        // remove siblings but don't disconnect descendants
    }
    bang() {
        // update using previous parameters
    }
    getReferences() {
        // get rendered reference pointers (*)
        return;
    }
    update(p) {
        // if template fundamentally changes?
        //   unmount, disconnect, render
        //
        // if siblings are different
        //   create new siblings
    }
    disconnect() {
        // remove siblings
        // call chunker.disconnect()
    }
    getSiblings() {
        // return siblings so parent chunk can mount
        return [];
    }
    getEffect() {
        return {
            quality: "UNMOUNTED",
            timestamp: performance.now(),
        };
    }
}

// brian taylor vann
const copy$1 = (position) => {
    return Object.assign({}, position);
};
const increment = (template, position) => {
    const chunk = template.templateArray[position.arrayIndex];
    if (chunk === undefined) {
        return;
    }
    // template boundaries
    const templateLength = template.templateArray.length - 1;
    if (position.arrayIndex >= templateLength &&
        position.stringIndex >= chunk.length - 1) {
        return;
    }
    // cannot % modulo by 0
    if (chunk.length > 0) {
        position.stringIndex += 1;
        position.stringIndex %= chunk.length;
    }
    if (position.stringIndex === 0) {
        position.arrayIndex += 1;
    }
    return position;
};
const decrement = (template, position) => {
    const chunk = template.templateArray[position.arrayIndex];
    if (chunk === undefined) {
        return;
    }
    // template boundaries
    if (position.arrayIndex <= 0 && position.stringIndex <= 0) {
        return;
    }
    position.stringIndex -= 1;
    if (position.arrayIndex > 0 && position.stringIndex < 0) {
        position.arrayIndex -= 1;
        const chunk = template.templateArray[position.arrayIndex];
        position.stringIndex = chunk.length - 1;
        // undefined case akin to divide by zero
        if (chunk === "") {
            position.stringIndex = chunk.length;
        }
    }
    return position;
};
const getCharAtPosition = (template, position) => {
    var _a;
    const templateArray = template.templateArray;
    return (_a = templateArray === null || templateArray === void 0 ? void 0 : templateArray[position.arrayIndex]) === null || _a === void 0 ? void 0 : _a[position.stringIndex];
};

// brian taylor vann
const DEFAULT_POSITION = {
    arrayIndex: 0,
    stringIndex: 0,
};
const create = (position = DEFAULT_POSITION) => ({
    origin: Object.assign({}, position),
    target: Object.assign({}, position),
});
const createFollowingVector = (template, vector) => {
    const followingVector = copy(vector);
    if (increment(template, followingVector.target)) {
        followingVector.origin = copy$1(followingVector.target);
        return followingVector;
    }
};
const copy = (vector) => {
    return {
        origin: copy$1(vector.origin),
        target: copy$1(vector.target),
    };
};
const incrementOrigin = (template, vector) => {
    if (increment(template, vector.origin)) {
        return vector;
    }
    return;
};
const incrementTarget = (template, vector) => {
    if (increment(template, vector.target)) {
        return vector;
    }
    return;
};
const decrementTarget = (template, vector) => {
    if (decrement(template, vector.target)) {
        return vector;
    }
    return;
};
const hasOriginEclipsedTaraget = (vector) => {
    if (vector.origin.arrayIndex >= vector.target.arrayIndex &&
        vector.origin.stringIndex >= vector.target.stringIndex) {
        return true;
    }
    return false;
};
const getText = (template, vector) => {
    // edge case, only one array length
    if (vector.target.arrayIndex === vector.origin.arrayIndex) {
        const distance = vector.target.stringIndex - vector.origin.stringIndex + 1;
        const templateText = template.templateArray[vector.origin.arrayIndex];
        const copiedText = templateText.substr(vector.origin.stringIndex, distance);
        return copiedText;
    }
    // otherwise, stack and arrayy
    const texts = [];
    // get head text
    let templateText = template.templateArray[vector.origin.arrayIndex];
    if (templateText === undefined) {
        return;
    }
    const templateTextIndex = vector.origin.stringIndex;
    let distance = templateText.length - templateTextIndex;
    let copiedText = templateText.substr(templateTextIndex, distance);
    texts.push(copiedText);
    // get in between
    let tail = vector.origin.arrayIndex + 1;
    while (tail < vector.target.arrayIndex) {
        texts.push(template.templateArray[tail]);
        tail += 1;
    }
    // get tail text
    templateText = template.templateArray[vector.target.arrayIndex];
    if (templateText === undefined) {
        return;
    }
    distance = vector.target.stringIndex + 1;
    copiedText = templateText.substr(0, distance);
    texts.push(copiedText);
    return texts.join("");
};

// brian taylor vann
const BREAK_RUNES$1 = {
    " ": true,
    "\n": true,
};
const crawlForTagName = (template, innerXmlBounds) => {
    const tagVector = copy(innerXmlBounds);
    let positionChar = getCharAtPosition(template, tagVector.origin);
    if (positionChar === undefined || BREAK_RUNES$1[positionChar]) {
        return;
    }
    while (BREAK_RUNES$1[positionChar] === undefined &&
        !hasOriginEclipsedTaraget(tagVector)) {
        if (incrementOrigin(template, tagVector) === undefined) {
            return;
        }
        positionChar = getCharAtPosition(template, tagVector.origin);
        if (positionChar === undefined) {
            return;
        }
    }
    const adjustedVector = {
        origin: Object.assign({}, innerXmlBounds.origin),
        target: Object.assign({}, tagVector.origin),
    };
    // walk back a step if successive space found
    if (BREAK_RUNES$1[positionChar]) {
        decrementTarget(template, adjustedVector);
    }
    return adjustedVector;
};

// brian taylor vann
const QUOTE_RUNE = '"';
const ASSIGN_RUNE = "=";
const ATTRIBUTE_FOUND = "ATTRIBUTE_FOUND";
const ATTRIBUTE_ASSIGNMENT = "ATTRIBUTE_ASSIGNMENT";
const IMPLICIT_ATTRIBUTE = "IMPLICIT_ATTRIBUTE";
const EXPLICIT_ATTRIBUTE = "EXPLICIT_ATTRIBUTE";
const INJECTED_ATTRIBUTE = "INJECTED_ATTRIBUTE";
const BREAK_RUNES = {
    " ": true,
    "\n": true,
};
const getAttributeName = (template, vectorBounds) => {
    let positionChar = getCharAtPosition(template, vectorBounds.origin);
    if (positionChar === undefined || BREAK_RUNES[positionChar]) {
        return;
    }
    let tagNameCrawlState = ATTRIBUTE_FOUND;
    const bounds = copy(vectorBounds);
    while (tagNameCrawlState === ATTRIBUTE_FOUND &&
        !hasOriginEclipsedTaraget(bounds)) {
        if (incrementOrigin(template, bounds) === undefined) {
            return;
        }
        positionChar = getCharAtPosition(template, bounds.origin);
        if (positionChar === undefined) {
            return;
        }
        tagNameCrawlState = ATTRIBUTE_FOUND;
        if (BREAK_RUNES[positionChar]) {
            tagNameCrawlState = IMPLICIT_ATTRIBUTE;
        }
        if (positionChar === ASSIGN_RUNE) {
            tagNameCrawlState = ATTRIBUTE_ASSIGNMENT;
        }
    }
    // we have found a tag, copy vector
    const attributeVector = {
        origin: Object.assign({}, vectorBounds.origin),
        target: Object.assign({}, bounds.origin),
    };
    // edge case, we've found text but no break runes
    if (tagNameCrawlState === ATTRIBUTE_FOUND) {
        return {
            kind: IMPLICIT_ATTRIBUTE,
            attributeVector,
        };
    }
    // if implict attribute
    if (tagNameCrawlState === IMPLICIT_ATTRIBUTE) {
        if (BREAK_RUNES[positionChar]) {
            decrementTarget(template, attributeVector);
        }
        return {
            kind: IMPLICIT_ATTRIBUTE,
            attributeVector,
        };
    }
    if (tagNameCrawlState === ATTRIBUTE_ASSIGNMENT) {
        decrementTarget(template, attributeVector);
        return {
            kind: EXPLICIT_ATTRIBUTE,
            valueVector: attributeVector,
            attributeVector,
        };
    }
};
const getAttributeValue = (template, vectorBounds, attributeAction) => {
    let positionChar = getCharAtPosition(template, vectorBounds.origin);
    if (positionChar !== ASSIGN_RUNE) {
        return;
    }
    // this could use some rewritting
    const bound = copy(vectorBounds);
    incrementOrigin(template, bound);
    if (hasOriginEclipsedTaraget(bound)) {
        return;
    }
    positionChar = getCharAtPosition(template, bound.origin);
    if (positionChar !== QUOTE_RUNE) {
        return;
    }
    // we have an attribute!
    const { arrayIndex } = bound.origin;
    const valVector = copy(bound);
    // check for injected attribute
    if (incrementOrigin(template, valVector) === undefined) {
        return;
    }
    positionChar = getCharAtPosition(template, valVector.origin);
    if (positionChar === undefined) {
        return;
    }
    // check if there is a valid injection
    const arrayIndexDistance = Math.abs(arrayIndex - valVector.origin.arrayIndex);
    if (arrayIndexDistance === 1 && positionChar === QUOTE_RUNE) {
        return {
            kind: INJECTED_ATTRIBUTE,
            injectionID: arrayIndex,
            attributeVector: attributeAction.attributeVector,
            valueVector: {
                origin: Object.assign({}, bound.origin),
                target: Object.assign({}, valVector.origin),
            },
        };
    }
    // explore potential for explicit attribute
    while (positionChar !== QUOTE_RUNE && !hasOriginEclipsedTaraget(valVector)) {
        if (incrementOrigin(template, valVector) === undefined) {
            return;
        }
        // return if unexpected injection found
        if (arrayIndex < valVector.origin.arrayIndex) {
            return;
        }
        positionChar = getCharAtPosition(template, valVector.origin);
        if (positionChar === undefined) {
            return;
        }
    }
    // exlpicit attribute found
    if (attributeAction.kind === "EXPLICIT_ATTRIBUTE" &&
        positionChar === QUOTE_RUNE) {
        attributeAction.valueVector = {
            origin: Object.assign({}, bound.origin),
            target: Object.assign({}, valVector.origin),
        };
        return attributeAction;
    }
};
const crawlForAttribute = (template, vectorBounds) => {
    // get first character of attribute or return
    const attrResults = getAttributeName(template, vectorBounds);
    if (attrResults === undefined) {
        return;
    }
    if (attrResults.kind === "IMPLICIT_ATTRIBUTE") {
        return attrResults;
    }
    // get bounds for attribute value
    const valBounds = copy(vectorBounds);
    valBounds.origin = Object.assign({}, attrResults.attributeVector.target);
    incrementOrigin(template, valBounds);
    return getAttributeValue(template, valBounds, attrResults);
};

// brian taylor vann
const RECURSION_SAFETY = 256;
// creates a side effect in innerXmlBounds
const incrementOriginToNextSpaceRune = (template, innerXmlBounds) => {
    let positionChar = getCharAtPosition(template, innerXmlBounds.origin);
    if (positionChar === undefined) {
        return;
    }
    while (positionChar !== " ") {
        if (hasOriginEclipsedTaraget(innerXmlBounds)) {
            return;
        }
        if (incrementOrigin(template, innerXmlBounds) === undefined) {
            return;
        }
        positionChar = getCharAtPosition(template, innerXmlBounds.origin);
        if (positionChar === undefined) {
            return;
        }
    }
    return innerXmlBounds;
};
// creates a side effect in innerXmlBounds
const incrementOriginToNextCharRune = (template, innerXmlBounds) => {
    let positionChar = getCharAtPosition(template, innerXmlBounds.origin);
    if (positionChar === undefined) {
        return;
    }
    while (positionChar === " ") {
        if (hasOriginEclipsedTaraget(innerXmlBounds)) {
            return;
        }
        if (incrementOrigin(template, innerXmlBounds) === undefined) {
            return;
        }
        positionChar = getCharAtPosition(template, innerXmlBounds.origin);
        if (positionChar === undefined) {
            return;
        }
    }
    return innerXmlBounds;
};
const appendNodeAttributeIntegrals = ({ integrals, template, chunk, }) => {
    let safety = 0;
    while (!hasOriginEclipsedTaraget(chunk) && safety < RECURSION_SAFETY) {
        safety += 1;
        if (incrementOriginToNextSpaceRune(template, chunk) === undefined) {
            return;
        }
        if (incrementOriginToNextCharRune(template, chunk) === undefined) {
            return;
        }
        const attributeCrawlResults = crawlForAttribute(template, chunk);
        // something has gone wrong and we should stop
        if (attributeCrawlResults === undefined) {
            return;
        }
        // set origin to following position
        if (attributeCrawlResults.kind === "IMPLICIT_ATTRIBUTE") {
            chunk.origin = Object.assign({}, attributeCrawlResults.attributeVector.target);
        }
        if (attributeCrawlResults.kind === "EXPLICIT_ATTRIBUTE") {
            chunk.origin = Object.assign({}, attributeCrawlResults.valueVector.target);
        }
        if (attributeCrawlResults.kind === "INJECTED_ATTRIBUTE") {
            chunk.origin = Object.assign({}, attributeCrawlResults.valueVector.target);
        }
        integrals.push(attributeCrawlResults);
    }
    return integrals;
};
const appendNodeIntegrals = ({ integrals, template, chunk, }) => {
    const innerXmlBounds = copy(chunk.vector);
    // adjust vector
    incrementOrigin(template, innerXmlBounds);
    decrementTarget(template, innerXmlBounds);
    // get tag name
    const tagNameVector = crawlForTagName(template, innerXmlBounds);
    if (tagNameVector === undefined) {
        return;
    }
    integrals.push({
        kind: "NODE",
        tagNameVector,
    });
    const followingVector = createFollowingVector(template, tagNameVector);
    if (followingVector === undefined) {
        return;
    }
    followingVector.target = Object.assign({}, innerXmlBounds.target);
    // more debugs here lol
    appendNodeAttributeIntegrals({ integrals, template, chunk: followingVector });
    return integrals;
};
const appendSelfClosingNodeIntegrals = ({ integrals, template, chunk, }) => {
    const innerXmlBounds = copy(chunk.vector);
    // adjust vector
    incrementOrigin(template, innerXmlBounds);
    decrementTarget(template, innerXmlBounds);
    decrementTarget(template, innerXmlBounds);
    // get tag name
    const tagNameVector = crawlForTagName(template, innerXmlBounds);
    if (tagNameVector === undefined) {
        return;
    }
    integrals.push({
        kind: "SELF_CLOSING_NODE",
        tagNameVector,
    });
    return integrals;
};
const appendCloseNodeIntegrals = ({ integrals, template, chunk, }) => {
    const innerXmlBounds = copy(chunk.vector);
    // adjust vector
    incrementOrigin(template, innerXmlBounds);
    incrementOrigin(template, innerXmlBounds);
    decrementTarget(template, innerXmlBounds);
    // get tag name
    let tagNameVector = copy(innerXmlBounds);
    tagNameVector = crawlForTagName(template, tagNameVector);
    if (tagNameVector === undefined) {
        return;
    }
    // add tag name to
    tagNameVector.origin = Object.assign({}, innerXmlBounds.origin);
    // append integralAction to integrals
    integrals.push({
        kind: "CLOSE_NODE",
        tagNameVector,
    });
    return integrals;
};
const appendContentIntegrals = ({ integrals, template, chunk, }) => {
    const { origin, target } = chunk.vector;
    if (origin.arrayIndex === target.arrayIndex) {
        integrals.push({ kind: "TEXT", textVector: chunk.vector });
        return;
    }
    let stringIndex = template.templateArray[origin.arrayIndex].length - 1;
    let textVector = {
        origin,
        target: {
            arrayIndex: origin.arrayIndex,
            stringIndex,
        },
    };
    integrals.push({ kind: "TEXT", textVector });
    integrals.push({
        kind: "CONTEXT_INJECTION",
        injectionID: origin.arrayIndex,
    });
    // get that middle text stuff
    let arrayIndex = origin.arrayIndex + 1;
    while (arrayIndex < target.arrayIndex) {
        stringIndex = template.templateArray[arrayIndex].length - 1;
        textVector = {
            origin: {
                arrayIndex,
                stringIndex: 0,
            },
            target: {
                arrayIndex,
                stringIndex,
            },
        };
        integrals.push({ kind: "TEXT", textVector });
        integrals.push({
            kind: "CONTEXT_INJECTION",
            injectionID: arrayIndex,
        });
        arrayIndex += 1;
    }
    // get that end text stuff
    textVector = {
        origin: {
            arrayIndex: target.arrayIndex,
            stringIndex: 0,
        },
        target,
    };
    integrals.push({ kind: "TEXT", textVector });
    return integrals;
};
const buildIntegrals = ({ template, skeleton }) => {
    const integrals = [];
    for (const chunk of skeleton) {
        const nodeType = chunk.nodeType;
        const origin = chunk.vector.origin;
        if (origin.stringIndex === 0 && origin.arrayIndex !== 0) {
            integrals.push({
                kind: "CONTEXT_INJECTION",
                injectionID: origin.arrayIndex - 1,
            });
        }
        if (nodeType === "OPEN_NODE_CONFIRMED") {
            appendNodeIntegrals({ integrals, template, chunk });
        }
        if (nodeType === "CLOSE_NODE_CONFIRMED") {
            appendCloseNodeIntegrals({ integrals, template, chunk });
        }
        if (nodeType === "CONTENT_NODE") {
            appendContentIntegrals({ integrals, template, chunk });
        }
        if (nodeType === "SELF_CLOSING_NODE_CONFIRMED") {
            appendSelfClosingNodeIntegrals({ integrals, template, chunk });
        }
    }
    return integrals;
};

// brian taylor vann
// skeleton routers
const routers = {
    CONTENT_NODE: {
        "<": "OPEN_NODE",
        DEFAULT: "CONTENT_NODE",
    },
    OPEN_NODE: {
        " ": "CONTENT_NODE",
        "\n": "CONTENT_NODE",
        "<": "OPEN_NODE",
        "/": "CLOSE_NODE",
        DEFAULT: "OPEN_NODE_VALID",
    },
    OPEN_NODE_VALID: {
        "<": "OPEN_NODE",
        "/": "SELF_CLOSING_NODE_VALID",
        ">": "OPEN_NODE_CONFIRMED",
        DEFAULT: "OPEN_NODE_VALID",
    },
    CLOSE_NODE: {
        " ": "CONTENT_NODE",
        "\n": "CONTENT_NODE",
        "<": "OPEN_NODE",
        DEFAULT: "CLOSE_NODE_VALID",
    },
    CLOSE_NODE_VALID: {
        "<": "OPEN_NODE",
        ">": "CLOSE_NODE_CONFIRMED",
        DEFAULT: "CLOSE_NODE_VALID",
    },
    SELF_CLOSING_NODE_VALID: {
        "<": "OPEN_NODE",
        ">": "SELF_CLOSING_NODE_CONFIRMED",
        DEFAULT: "SELF_CLOSING_NODE_VALID",
    },
};

// brian taylor vann
const DEFAULT = "DEFAULT";
const CONTENT_NODE = "CONTENT_NODE";
const OPEN_NODE = "OPEN_NODE";
const validSieve = {
    ["OPEN_NODE_VALID"]: "OPEN_NODE_VALID",
    ["CLOSE_NODE_VALID"]: "CLOSE_NODE_VALID",
    ["SELF_CLOSING_NODE_VALID"]: "SELF_CLOSING_NODE_VALID",
};
const confirmedSieve = {
    ["OPEN_NODE_CONFIRMED"]: "OPEN_NODE_CONFIRMED",
    ["CLOSE_NODE_CONFIRMED"]: "CLOSE_NODE_CONFIRMED",
    ["SELF_CLOSING_NODE_CONFIRMED"]: "SELF_CLOSING_NODE_CONFIRMED",
};
const setStartStateProperties = (template, previousCrawl) => {
    if (previousCrawl === undefined) {
        return {
            nodeType: CONTENT_NODE,
            vector: create(),
        };
    }
    const followingVector = createFollowingVector(template, previousCrawl.vector);
    if (followingVector === undefined) {
        return;
    }
    const crawlState = {
        nodeType: CONTENT_NODE,
        vector: followingVector,
    };
    return crawlState;
};
const setNodeType = (template, crawlState) => {
    var _a, _b;
    const nodeStates = routers[crawlState.nodeType];
    const char = getCharAtPosition(template, crawlState.vector.target);
    if (nodeStates !== undefined && char !== undefined) {
        const defaultNodeType = (_a = nodeStates[DEFAULT]) !== null && _a !== void 0 ? _a : CONTENT_NODE;
        crawlState.nodeType = (_b = nodeStates[char]) !== null && _b !== void 0 ? _b : defaultNodeType;
    }
    return crawlState;
};
const crawl = (template, previousCrawl) => {
    const crawlState = setStartStateProperties(template, previousCrawl);
    if (crawlState === undefined) {
        return;
    }
    let openPosition;
    setNodeType(template, crawlState);
    while (incrementTarget(template, crawlState.vector)) {
        if (validSieve[crawlState.nodeType] === undefined &&
            crawlState.vector.target.stringIndex === 0) {
            crawlState.nodeType = CONTENT_NODE;
        }
        setNodeType(template, crawlState);
        if (crawlState.nodeType === OPEN_NODE) {
            openPosition = copy$1(crawlState.vector.target);
        }
        if (confirmedSieve[crawlState.nodeType]) {
            if (openPosition !== undefined) {
                crawlState.vector.origin = openPosition;
            }
            break;
        }
    }
    return crawlState;
};

// brian taylor vann
const MAX_DEPTH = 128;
const DEFAULT_CRAWL_RESULTS = {
    nodeType: "CONTENT_NODE",
    vector: {
        origin: { arrayIndex: 0, stringIndex: 0 },
        target: { arrayIndex: 0, stringIndex: 0 },
    },
};
const SKELETON_SIEVE = {
    ["OPEN_NODE_CONFIRMED"]: "OPEN_NODE",
    ["SELF_CLOSING_NODE_CONFIRMED"]: "SELF_CLOSING_NODE",
    ["CLOSE_NODE_CONFIRMED"]: "CLOSE_NODE",
    ["CONTENT_NODE"]: "CONTENT_NODE",
};
const isDistanceGreaterThanOne = ({ template, origin, target, }) => {
    if (hasOriginEclipsedTaraget({ origin, target })) {
        return false;
    }
    const originCopy = copy$1(origin);
    if (increment(template, originCopy) === undefined) {
        return false;
    }
    if (target.arrayIndex === originCopy.arrayIndex &&
        target.stringIndex === originCopy.stringIndex) {
        return false;
    }
    return true;
};
const buildMissingStringNode = ({ template, previousCrawl, currentCrawl, }) => {
    // get text vector
    const originPos = previousCrawl !== undefined
        ? previousCrawl.vector.target
        : DEFAULT_CRAWL_RESULTS.vector.target;
    const targetPos = currentCrawl.vector.origin;
    if (!isDistanceGreaterThanOne({
        template,
        origin: originPos,
        target: targetPos,
    })) {
        return;
    }
    // copy and correlate position values
    const origin = previousCrawl === undefined
        ? copy$1(DEFAULT_CRAWL_RESULTS.vector.target)
        : copy$1(previousCrawl.vector.target);
    const target = copy$1(currentCrawl.vector.origin);
    decrement(template, target);
    if (previousCrawl !== undefined) {
        increment(template, origin);
    }
    return {
        nodeType: "CONTENT_NODE",
        vector: {
            origin,
            target,
        },
    };
};
const buildSkeleton = (template) => {
    const skeleton = [];
    let previousCrawl;
    let currentCrawl = crawl(template, previousCrawl);
    let depth = 0;
    while (currentCrawl && depth < MAX_DEPTH) {
        // get string in between crawls
        const stringBone = buildMissingStringNode({
            template,
            previousCrawl,
            currentCrawl,
        });
        if (stringBone) {
            skeleton.push(stringBone);
        }
        if (SKELETON_SIEVE[currentCrawl.nodeType]) {
            skeleton.push(currentCrawl);
        }
        previousCrawl = currentCrawl;
        currentCrawl = crawl(template, previousCrawl);
        depth += 1;
    }
    return skeleton;
};

// brian taylor vann
// add integral on to stack
const popSelfClosingNode = (rs) => {
    const parent = rs.stack[rs.stack.length - 1];
    if (parent !== undefined &&
        parent.kind === "NODE" &&
        parent.selfClosing === true) {
        rs.stack.pop();
        rs.lastNodes.pop();
    }
};
const createTextNode = ({ hooks, rs, integral }) => {
    var _a;
    // bounce through stack for self closing nodes
    popSelfClosingNode(rs);
    const text = getText(rs.template, integral.textVector);
    if (text === undefined) {
        return;
    }
    const descendant = hooks.createTextNode(text);
    const parentNode = (_a = rs.stack[rs.stack.length - 1]) === null || _a === void 0 ? void 0 : _a.node;
    const lastNodeIndex = rs.lastNodes.length - 1;
    const leftNode = rs.lastNodes[lastNodeIndex];
    rs.stack.length === 0;
    if (rs.stack.length === 0) {
        rs.siblings.push([descendant]);
    }
    else {
        hooks.insertDescendant({ parentNode, descendant, leftNode });
    }
    rs.lastNodes[lastNodeIndex] = descendant;
};
const createNode = ({ hooks, rs, integral }) => {
    popSelfClosingNode(rs);
    const tagName = getText(rs.template, integral.tagNameVector);
    if (tagName === undefined) {
        return;
    }
    const parent = rs.stack[rs.stack.length - 1];
    const descendant = hooks.createNode(tagName);
    // get parent node
    const parentNode = parent === null || parent === void 0 ? void 0 : parent.node;
    // add it to rs last nodes
    const lastNodeIndex = rs.lastNodes.length - 1;
    const leftNode = rs.lastNodes[lastNodeIndex];
    // add to silblings when stack is flat
    const isSiblingLevel = rs.stack.length === 0;
    if (isSiblingLevel) {
        rs.siblings.push([descendant]);
    }
    else {
        hooks.insertDescendant({ parentNode, leftNode, descendant });
    }
    // push to last nodes
    rs.lastNodes[lastNodeIndex] = descendant;
    rs.lastNodes.push(undefined);
    // push to stack
    const selfClosing = integral.kind === "SELF_CLOSING_NODE";
    rs.stack.push({
        kind: "NODE",
        node: descendant,
        selfClosing,
        tagName,
    });
};
const closeNode = ({ hooks, rs, integral }) => {
    if (rs.stack.length === 0) {
        return;
    }
    popSelfClosingNode(rs);
    const tagName = getText(rs.template, integral.tagNameVector);
    const nodeBit = rs.stack[rs.stack.length - 1];
    if (nodeBit.kind !== "NODE") {
        return;
    }
    if (nodeBit.tagName === tagName) {
        rs.stack.pop();
        rs.lastNodes.pop();
    }
};
const createContextInjection = ({ hooks, rs, integral, }) => {
    var _a;
    popSelfClosingNode(rs);
    // attach injection as Context
    const parentNode = (_a = rs.stack[rs.stack.length - 1]) === null || _a === void 0 ? void 0 : _a.node;
    const lastNodeIndex = rs.lastNodes.length - 1;
    const leftNode = rs.lastNodes[lastNodeIndex];
    const injection = rs.template.injections[integral.injectionID];
    const isSiblingLevel = rs.stack.length === 0;
    let siblingIndex;
    // String Injection
    if (!Array.isArray(injection)) {
        // attach injection as content
        const text = String(injection);
        const textNode = hooks.createTextNode(text);
        // push to siblings or stack
        if (rs.stack.length === 0) {
            rs.siblings.push([textNode]);
            siblingIndex = rs.siblings.length - 1;
        }
        else {
            hooks.insertDescendant({
                descendant: textNode,
                parentNode,
                leftNode,
            });
        }
        rs.descendants[integral.injectionID] = {
            kind: "TEXT",
            params: { textNode, leftNode, parentNode, text, siblingIndex },
        };
        rs.lastNodes[lastNodeIndex] = textNode;
        return;
    }
    // Add Context Siblings
    const siblingsFromContextArray = [];
    let prevSibling = leftNode;
    for (const contextID in injection) {
        const context = injection[contextID];
        const siblings = context.getSiblings();
        // add context siblings
        if (isSiblingLevel) {
            for (const siblingID in siblings) {
                const sibling = siblings[siblingID];
                siblingsFromContextArray.push(sibling);
                // set prev sibling
                prevSibling = sibling;
            }
        }
        else {
            // set prev sibling
            prevSibling = context.mount(parentNode, prevSibling);
        }
    }
    if (isSiblingLevel) {
        rs.siblings.push(siblingsFromContextArray);
        siblingIndex = rs.siblings.length - 1;
    }
    rs.descendants[integral.injectionID] = {
        kind: "CONTEXT_ARRAY",
        params: { contextArray: injection, leftNode, parentNode, siblingIndex },
    };
    rs.lastNodes[lastNodeIndex] = prevSibling;
};
const appendExplicitAttribute = ({ hooks, rs, integral, }) => {
    rs.references;
    const node = rs.stack[rs.stack.length - 1].node;
    const attribute = getText(rs.template, integral.attributeVector);
    if (attribute === undefined) {
        return;
    }
    incrementOrigin(rs.template, integral.valueVector);
    decrementTarget(rs.template, integral.valueVector);
    const value = getText(rs.template, integral.valueVector);
    if (value === undefined) {
        return;
    }
    hooks.setAttribute({ references: rs.references, node, attribute, value });
};
const appendImplicitAttribute = ({ hooks, rs, integral, }) => {
    if (rs.stack.length === 0) {
        return;
    }
    const { node } = rs.stack[rs.stack.length - 1];
    const attribute = getText(rs.template, integral.attributeVector);
    if (attribute === undefined) {
        return;
    }
    hooks.setAttribute({
        value: true,
        references: rs.references,
        node,
        attribute,
    });
};
const appendInjectedAttribute = ({ hooks, rs, integral, }) => {
    if (rs.stack.length === 0) {
        return;
    }
    const { node } = rs.stack[rs.stack.length - 1];
    const attribute = getText(rs.template, integral.attributeVector);
    if (attribute === undefined) {
        return;
    }
    const { injectionID } = integral;
    const value = rs.template.injections[injectionID];
    if (value instanceof ContextBase) {
        return;
    }
    // add to injection map
    rs.attributes[injectionID] = {
        kind: "ATTRIBUTE",
        params: { references: rs.references, node, attribute, value },
    };
    hooks.setAttribute({ references: rs.references, node, attribute, value });
};
const buildRender = ({ hooks, template, integrals }) => {
    const rs = {
        template,
        attributes: {},
        references: {},
        descendants: {},
        siblings: [],
        lastNodes: [undefined],
        stack: [],
    };
    for (const integral of integrals) {
        if (integral.kind === "NODE") {
            createNode({ hooks, rs, integral });
        }
        if (integral.kind === "SELF_CLOSING_NODE") {
            createNode({ hooks, rs, integral });
        }
        if (integral.kind === "CLOSE_NODE") {
            closeNode({ hooks, rs, integral });
        }
        if (integral.kind === "TEXT") {
            createTextNode({ hooks, rs, integral });
        }
        if (integral.kind === "CONTEXT_INJECTION") {
            createContextInjection({ hooks, rs, integral });
        }
        if (integral.kind === "EXPLICIT_ATTRIBUTE") {
            appendExplicitAttribute({ hooks, rs, integral });
        }
        if (integral.kind === "IMPLICIT_ATTRIBUTE") {
            appendImplicitAttribute({ hooks, rs, integral });
        }
        if (integral.kind === "INJECTED_ATTRIBUTE") {
            appendInjectedAttribute({ hooks, rs, integral });
        }
    }
    return rs;
};

const buildRenderStructure = (hooks, template) => {
    const skeleton = buildSkeleton(template);
    const integrals = buildIntegrals({ template, skeleton });
    const render = buildRender({
        hooks: hooks,
        template,
        integrals,
    });
    return render;
};

class Banger {
    constructor(context) {
        this.context = context;
    }
    bang() {
        this.context.bang();
    }
    getReferences() {
        return this.context.getReferences();
    }
}
class Context extends ContextBase {
    // INIT
    constructor(baseParams) {
        super();
        // REQUIRED EFFECTS
        this.banger = new Banger(this);
        this.hooks = baseParams.hooks;
        this.chunker = baseParams.chunker;
        // GENERATED EFFECTS
        this.params = baseParams.params;
        this.state = this.chunker.connect({
            banger: this.banger,
            params: baseParams.params,
        });
        const template = this.getTemplate();
        this.rs = buildRenderStructure(this.hooks, template);
        this.siblings = getUpdatedSiblings(this.rs);
        this.effect = this.updateEffect("UNMOUNTED");
    }
    bang() {
        this.update(this.params);
    }
    // LIFECYCLE API
    update(params) {
        this.setParams(params);
        const template = this.getTemplate();
        if (this.effect.quality === "DISCONNECTED") {
            this.disconnect();
            this.remount(template);
            return;
        }
        // compare template array and render new
        if (hasTemplateChanged(this.rs, template)) {
            this.remount(template);
            return;
        }
        // we like to update attributes
        updateAttributes(this.hooks, this.rs, template);
        const descendantsHaveUpdated = updateDescendants({
            contextParentNode: this.parentNode,
            hooks: this.hooks,
            rs: this.rs,
            template,
        });
        if (descendantsHaveUpdated) {
            this.siblings = getUpdatedSiblings(this.rs);
        }
    }
    mount(parentNode, leftNode) {
        // set parent and left nodes for context
        this.parentNode = parentNode;
        this.leftNode = leftNode;
        // attach siblings to parent
        let prevSibling;
        let descendant = leftNode;
        for (const siblingID in this.siblings) {
            prevSibling = descendant;
            descendant = this.siblings[siblingID];
            this.hooks.insertDescendant({
                leftNode: prevSibling,
                parentNode,
                descendant,
            });
        }
        this.updateEffect("MOUNTED");
        // return future 'left node'
        return descendant;
    }
    unmount() {
        // remove parent and left nodes
        this.parentNode = undefined;
        this.leftNode = undefined;
        // remove each sibling
        for (const siblingID in this.siblings) {
            const sibling = this.siblings[siblingID];
            this.hooks.removeDescendant(sibling);
        }
        this.updateEffect("UNMOUNTED");
    }
    disconnect() {
        disconnectDescendants(this.hooks, this.rs);
        this.chunker.disconnect(this.state);
        this.updateEffect("DISCONNECTED");
    }
    // CONTEXT API
    getSiblings() {
        return this.siblings;
    }
    getReferences() {
        // interesting base case outside of contrucutor, might (not) exist
        if (this.rs !== undefined) {
            return this.rs.references;
        }
    }
    getEffect() {
        return this.effect;
    }
    remount(template) {
        this.unmount();
        this.rs = buildRenderStructure(this.hooks, template);
        this.siblings = getUpdatedSiblings(this.rs);
        this.mount(this.parentNode, this.leftNode);
        this.effect = this.updateEffect("CONNECTED");
    }
    updateEffect(quality) {
        this.effect = {
            timestamp: performance.now(),
            quality,
        };
        return this.effect;
    }
    setParams(params) {
        this.params = params;
    }
    getTemplate() {
        return this.chunker.update({
            banger: this.banger,
            state: this.state,
            params: this.params,
        });
    }
}
const getUpdatedSiblings = (rs) => {
    const siblings = [];
    const originalSiblings = rs.siblings;
    for (const siblingArrayID in originalSiblings) {
        const siblingArray = originalSiblings[siblingArrayID];
        for (const siblingID in siblingArray) {
            const sibling = siblingArray[siblingID];
            siblings.push(sibling);
        }
    }
    return siblings;
};
const hasTemplateChanged = (rs, template) => {
    const templateLength = template.templateArray.length;
    if (rs.template.templateArray.length !== templateLength) {
        return true;
    }
    let index = 0;
    while (index < templateLength) {
        const sourceStr = rs.template.templateArray[index];
        const targetStr = template.templateArray[index];
        if (sourceStr !== targetStr) {
            return true;
        }
        index += 1;
    }
    return false;
};
// compare future template to current template (past injection)
const updateAttributes = (hooks, rs, template) => {
    for (const attributesID in rs.attributes) {
        const pastInjection = rs.attributes[attributesID];
        const attributeValue = template.injections[attributesID];
        // check if attribute value has changed
        if (attributeValue === pastInjection.params.value) {
            continue;
        }
        // give yourself a chance to remove attribute
        hooks.removeAttribute(pastInjection.params);
        pastInjection.params.value = attributeValue;
        hooks.setAttribute(pastInjection.params);
    }
};
const updateDescendants = ({ hooks, rs, template, contextParentNode, }) => {
    let siblingLevelUpdated = false;
    // iterate through descendants
    for (const descenantID in rs.descendants) {
        const pastDescendant = rs.descendants[descenantID];
        const descendant = template.injections[descenantID];
        if (pastDescendant.kind === "TEXT" && !Array.isArray(descendant)) {
            const text = String(descendant);
            if (pastDescendant.params.text === text) {
                continue;
            }
        }
        // unmount previous contexts, they could be stale
        if (pastDescendant.kind === "CONTEXT_ARRAY") {
            const contextArray = pastDescendant.params.contextArray;
            for (const contextID in contextArray) {
                contextArray[contextID].unmount();
            }
        }
        // we assume siblings have changed from this point
        const { leftNode, parentNode, siblingIndex } = pastDescendant.params;
        if (!siblingLevelUpdated) {
            siblingLevelUpdated = siblingIndex !== undefined;
        }
        // remove previous descendants
        if (pastDescendant.kind === "TEXT") {
            hooks.removeDescendant(pastDescendant.params.textNode);
        }
        // text descednant
        if (!Array.isArray(descendant)) {
            const text = String(descendant);
            const textNode = hooks.createTextNode(text);
            rs.descendants[descenantID] = {
                kind: "TEXT",
                params: {
                    textNode,
                    text,
                    leftNode,
                    parentNode,
                    siblingIndex,
                },
            };
            hooks.insertDescendant({
                descendant: textNode,
                leftNode,
                parentNode: parentNode !== null && parentNode !== void 0 ? parentNode : contextParentNode, // append actual parent
            });
            // add sibling to render structure to get mounted later
            if (siblingIndex !== undefined) {
                rs.siblings[siblingIndex] = [textNode];
            }
            continue;
        }
        const contextArray = descendant;
        rs.descendants[descenantID] = {
            kind: "CONTEXT_ARRAY",
            params: {
                contextArray,
                leftNode,
                parentNode,
                siblingIndex,
            },
        };
        // add sibling to render structure to get mounted later
        let currLeftNode = leftNode;
        for (const contextID in descendant) {
            const chunk = contextArray[contextID];
            currLeftNode = chunk.mount(parentNode !== null && parentNode !== void 0 ? parentNode : contextParentNode, currLeftNode);
        }
        // new ness
        //
        // if (siblingIndex !== undefined) {
        //   let updatedSiblings = [];    
        //   for (const contextID in descendant) {
        //     const chunk = contextArray[contextID];
        //     const siblings = chunk.getSiblings();
        //     for (const siblingID in siblings) {
        //       updatedSiblings.push(siblings[siblingID]);
        //     }
        //   }
        //   rs.siblings[siblingIndex] = updatedSiblings;
        // }
        if (pastDescendant.kind === "CONTEXT_ARRAY") {
            const contextArray = pastDescendant.params.contextArray;
            for (const contextID in contextArray) {
                const context = contextArray[contextID];
                const effect = context.getEffect();
                if (effect.quality === "UNMOUNTED") {
                    context.disconnect();
                }
            }
        }
    }
    // return if sibling level nodes were updated
    return siblingLevelUpdated;
};
const disconnectDescendants = (hooks, rs) => {
    const attributes = rs.attributes;
    for (const attributeID in attributes) {
        const attribute = attributes[attributeID];
        hooks.removeAttribute(attribute.params);
    }
    for (const descendantID in rs.descendants) {
        const descendant = rs.descendants[descendantID];
        if (descendant.kind === "TEXT") {
            hooks.removeDescendant(descendant.params.textNode);
        }
        if (descendant.kind === "CONTEXT_ARRAY") {
            const contextArray = descendant.params.contextArray;
            for (const contextID in contextArray) {
                const context = contextArray[contextID];
                context.unmount();
                context.disconnect();
            }
        }
    }
};

export { Context };
