class ChunkBase {
    mount(parentNode, leftNode) {
        return;
    }
    unmount() {
    }
    bang() {
    }
    getReferences() {
        return;
    }
    update(p) {
    }
    disconnect() {
    }
    getSiblings() {
        return [];
    }
    getEffect() {
        return {
            quality: "UNMOUNTED",
            timestamp: performance.now()
        };
    }
}
const copy1 = (position)=>{
    return {
        ...position
    };
};
const increment = (template, position)=>{
    const chunk = template.templateArray[position.arrayIndex];
    if (chunk === undefined) {
        return;
    }
    const templateLength = template.templateArray.length - 1;
    if (position.arrayIndex >= templateLength && position.stringIndex >= chunk.length - 1) {
        return;
    }
    if (chunk.length > 0) {
        position.stringIndex += 1;
        position.stringIndex %= chunk.length;
    }
    if (position.stringIndex === 0) {
        position.arrayIndex += 1;
    }
    return position;
};
const decrement = (template, position)=>{
    const chunk = template.templateArray[position.arrayIndex];
    if (chunk === undefined) {
        return;
    }
    if (position.arrayIndex <= 0 && position.stringIndex <= 0) {
        return;
    }
    position.stringIndex -= 1;
    if (position.arrayIndex > 0 && position.stringIndex < 0) {
        position.arrayIndex -= 1;
        const chunk1 = template.templateArray[position.arrayIndex];
        position.stringIndex = chunk1.length - 1;
        if (chunk1 === "") {
            position.stringIndex = chunk1.length;
        }
    }
    return position;
};
const getCharAtPosition = (template, position)=>{
    const templateArray = template.templateArray;
    return templateArray[position.arrayIndex]?.[position.stringIndex];
};
const DEFAULT_POSITION = {
    arrayIndex: 0,
    stringIndex: 0
};
const create = (position = DEFAULT_POSITION)=>({
        origin: {
            ...position
        },
        target: {
            ...position
        }
    })
;
const createFollowingVector = (template, vector)=>{
    const followingVector = copy2(vector);
    if (increment(template, followingVector.target)) {
        followingVector.origin = copy1(followingVector.target);
        return followingVector;
    }
};
const copy2 = (vector)=>{
    return {
        origin: copy1(vector.origin),
        target: copy1(vector.target)
    };
};
const incrementOrigin = (template, vector)=>{
    if (increment(template, vector.origin)) {
        return vector;
    }
    return;
};
const decrementOrigin = (template, vector)=>{
    if (decrement(template, vector.origin)) {
        return vector;
    }
    return;
};
const incrementTarget = (template, vector)=>{
    if (increment(template, vector.target)) {
        return vector;
    }
    return;
};
const decrementTarget = (template, vector)=>{
    if (decrement(template, vector.target)) {
        return vector;
    }
    return;
};
const getTextFromTarget = (template, vector)=>{
    const templateArray = template.templateArray;
    const { arrayIndex , stringIndex  } = vector.target;
    if (arrayIndex > templateArray.length - 1) {
        return;
    }
    if (stringIndex > templateArray[arrayIndex].length - 1) {
        return;
    }
    return templateArray[arrayIndex][stringIndex];
};
const hasOriginEclipsedTaraget = (vector)=>{
    if (vector.origin.arrayIndex >= vector.target.arrayIndex && vector.origin.stringIndex >= vector.target.stringIndex) {
        return true;
    }
    return false;
};
const getText = (template, vector)=>{
    if (vector.target.arrayIndex === vector.origin.arrayIndex) {
        const distance = vector.target.stringIndex - vector.origin.stringIndex + 1;
        const templateText = template.templateArray[vector.origin.arrayIndex];
        const copiedText = templateText.substr(vector.origin.stringIndex, distance);
        return copiedText;
    }
    const texts = [];
    let templateText = template.templateArray[vector.origin.arrayIndex];
    if (templateText === undefined) {
        return;
    }
    const templateTextIndex = vector.origin.stringIndex;
    let distance = templateText.length - templateTextIndex;
    let copiedText = templateText.substr(templateTextIndex, distance);
    texts.push(copiedText);
    let tail = vector.origin.arrayIndex + 1;
    while(tail < vector.target.arrayIndex){
        texts.push(template.templateArray[tail]);
        tail += 1;
    }
    templateText = template.templateArray[vector.target.arrayIndex];
    if (templateText === undefined) {
        return;
    }
    distance = vector.target.stringIndex + 1;
    copiedText = templateText.substr(0, distance);
    texts.push(copiedText);
    return texts.join("");
};
const BREAK_RUNES = {
    " ": true,
    "\n": true
};
const crawlForTagName = (template, innerXmlBounds)=>{
    const tagVector = copy2(innerXmlBounds);
    let positionChar = getCharAtPosition(template, tagVector.origin);
    if (positionChar === undefined || BREAK_RUNES[positionChar]) {
        return;
    }
    while(BREAK_RUNES[positionChar] === undefined && !hasOriginEclipsedTaraget(tagVector)){
        if (incrementOrigin(template, tagVector) === undefined) {
            return;
        }
        positionChar = getCharAtPosition(template, tagVector.origin);
        if (positionChar === undefined) {
            return;
        }
    }
    const adjustedVector = {
        origin: {
            ...innerXmlBounds.origin
        },
        target: {
            ...tagVector.origin
        }
    };
    if (BREAK_RUNES[positionChar]) {
        decrementTarget(template, adjustedVector);
    }
    return adjustedVector;
};
const QUOTE_RUNE = '"';
const ASSIGN_RUNE = "=";
const ATTRIBUTE_FOUND = "ATTRIBUTE_FOUND";
const ATTRIBUTE_ASSIGNMENT = "ATTRIBUTE_ASSIGNMENT";
const IMPLICIT_ATTRIBUTE = "IMPLICIT_ATTRIBUTE";
const EXPLICIT_ATTRIBUTE = "EXPLICIT_ATTRIBUTE";
const INJECTED_ATTRIBUTE = "INJECTED_ATTRIBUTE";
const BREAK_RUNES1 = {
    " ": true,
    "\n": true,
    "/": true
};
const getAttributeName = (template, vectorBounds)=>{
    let positionChar = getCharAtPosition(template, vectorBounds.origin);
    if (positionChar === undefined || BREAK_RUNES1[positionChar]) {
        return;
    }
    let tagNameCrawlState = ATTRIBUTE_FOUND;
    const bounds = copy2(vectorBounds);
    while(tagNameCrawlState === ATTRIBUTE_FOUND && !hasOriginEclipsedTaraget(bounds)){
        if (incrementOrigin(template, bounds) === undefined) {
            return;
        }
        positionChar = getCharAtPosition(template, bounds.origin);
        if (positionChar === undefined) {
            return;
        }
        tagNameCrawlState = ATTRIBUTE_FOUND;
        if (BREAK_RUNES1[positionChar]) {
            tagNameCrawlState = IMPLICIT_ATTRIBUTE;
        }
        if (positionChar === ASSIGN_RUNE) {
            tagNameCrawlState = ATTRIBUTE_ASSIGNMENT;
        }
    }
    const attributeVector = {
        origin: {
            ...vectorBounds.origin
        },
        target: {
            ...bounds.origin
        }
    };
    if (tagNameCrawlState === ATTRIBUTE_FOUND) {
        return {
            kind: IMPLICIT_ATTRIBUTE,
            attributeVector
        };
    }
    if (tagNameCrawlState === IMPLICIT_ATTRIBUTE) {
        if (BREAK_RUNES1[positionChar]) {
            decrementTarget(template, attributeVector);
        }
        return {
            kind: IMPLICIT_ATTRIBUTE,
            attributeVector
        };
    }
    if (tagNameCrawlState === ATTRIBUTE_ASSIGNMENT) {
        decrementTarget(template, attributeVector);
        return {
            kind: EXPLICIT_ATTRIBUTE,
            valueVector: attributeVector,
            attributeVector
        };
    }
};
const getAttributeValue = (template, vectorBounds, attributeAction)=>{
    let positionChar = getCharAtPosition(template, vectorBounds.origin);
    if (positionChar !== ASSIGN_RUNE) {
        return;
    }
    const bound = copy2(vectorBounds);
    incrementOrigin(template, bound);
    if (hasOriginEclipsedTaraget(bound)) {
        return;
    }
    positionChar = getCharAtPosition(template, bound.origin);
    if (positionChar !== QUOTE_RUNE) {
        return;
    }
    const { arrayIndex  } = bound.origin;
    const valVector = copy2(bound);
    if (incrementOrigin(template, valVector) === undefined) {
        return;
    }
    positionChar = getCharAtPosition(template, valVector.origin);
    if (positionChar === undefined) {
        return;
    }
    const arrayIndexDistance = Math.abs(arrayIndex - valVector.origin.arrayIndex);
    if (arrayIndexDistance === 1 && positionChar === QUOTE_RUNE) {
        return {
            kind: INJECTED_ATTRIBUTE,
            injectionID: arrayIndex,
            attributeVector: attributeAction.attributeVector,
            valueVector: {
                origin: {
                    ...bound.origin
                },
                target: {
                    ...valVector.origin
                }
            }
        };
    }
    while(positionChar !== QUOTE_RUNE && !hasOriginEclipsedTaraget(valVector)){
        if (incrementOrigin(template, valVector) === undefined) {
            return;
        }
        if (arrayIndex < valVector.origin.arrayIndex) {
            return;
        }
        positionChar = getCharAtPosition(template, valVector.origin);
        if (positionChar === undefined) {
            return;
        }
    }
    if (attributeAction.kind === "EXPLICIT_ATTRIBUTE" && positionChar === QUOTE_RUNE) {
        attributeAction.valueVector = {
            origin: {
                ...bound.origin
            },
            target: {
                ...valVector.origin
            }
        };
        return attributeAction;
    }
};
const crawlForAttribute = (template, vectorBounds)=>{
    const attrResults = getAttributeName(template, vectorBounds);
    if (attrResults === undefined) {
        return;
    }
    if (attrResults.kind === "IMPLICIT_ATTRIBUTE") {
        return attrResults;
    }
    const valBounds = copy2(vectorBounds);
    valBounds.origin = {
        ...attrResults.attributeVector.target
    };
    incrementOrigin(template, valBounds);
    return getAttributeValue(template, valBounds, attrResults);
};
const incrementOriginToNextSpaceRune = (template, innerXmlBounds)=>{
    let positionChar = getCharAtPosition(template, innerXmlBounds.origin);
    if (positionChar === undefined) {
        return;
    }
    while(positionChar !== " "){
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
const incrementOriginToNextCharRune = (template, innerXmlBounds)=>{
    let positionChar = getCharAtPosition(template, innerXmlBounds.origin);
    if (positionChar === undefined) {
        return;
    }
    while(positionChar === " "){
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
const appendNodeAttributeIntegrals = ({ integrals , template , chunk ,  })=>{
    let safety = 0;
    while(!hasOriginEclipsedTaraget(chunk) && safety < 256){
        safety += 1;
        if (incrementOriginToNextSpaceRune(template, chunk) === undefined) {
            return;
        }
        if (incrementOriginToNextCharRune(template, chunk) === undefined) {
            return;
        }
        const attributeCrawlResults = crawlForAttribute(template, chunk);
        if (attributeCrawlResults === undefined) {
            return;
        }
        if (attributeCrawlResults.kind === "IMPLICIT_ATTRIBUTE") {
            chunk.origin = {
                ...attributeCrawlResults.attributeVector.target
            };
        }
        if (attributeCrawlResults.kind === "EXPLICIT_ATTRIBUTE") {
            chunk.origin = {
                ...attributeCrawlResults.valueVector.target
            };
        }
        if (attributeCrawlResults.kind === "INJECTED_ATTRIBUTE") {
            chunk.origin = {
                ...attributeCrawlResults.valueVector.target
            };
        }
        integrals.push(attributeCrawlResults);
    }
    return integrals;
};
const appendNodeIntegrals = ({ kind , integrals , template , chunk ,  })=>{
    const innerXmlBounds = copy2(chunk.vector);
    incrementOrigin(template, innerXmlBounds);
    decrementTarget(template, innerXmlBounds);
    const tagNameVector = crawlForTagName(template, innerXmlBounds);
    if (tagNameVector === undefined) {
        return;
    }
    integrals.push({
        kind,
        tagNameVector
    });
    const followingVector = createFollowingVector(template, tagNameVector);
    if (followingVector === undefined) {
        return;
    }
    followingVector.target = {
        ...innerXmlBounds.target
    };
    appendNodeAttributeIntegrals({
        integrals,
        template,
        chunk: followingVector
    });
    return integrals;
};
const appendCloseNodeIntegrals = ({ integrals , template , chunk ,  })=>{
    const innerXmlBounds = copy2(chunk.vector);
    incrementOrigin(template, innerXmlBounds);
    incrementOrigin(template, innerXmlBounds);
    decrementTarget(template, innerXmlBounds);
    const tagNameVector = crawlForTagName(template, copy2(innerXmlBounds));
    if (tagNameVector === undefined) {
        return;
    }
    tagNameVector.origin = {
        ...innerXmlBounds.origin
    };
    integrals.push({
        kind: "CLOSE_NODE",
        tagNameVector
    });
    return integrals;
};
const appendContentIntegrals = ({ integrals , template , chunk ,  })=>{
    const { origin , target  } = chunk.vector;
    if (origin.arrayIndex === target.arrayIndex) {
        integrals.push({
            kind: "TEXT",
            textVector: chunk.vector
        });
        return;
    }
    let stringIndex = template.templateArray[origin.arrayIndex].length - 1;
    let textVector = {
        origin,
        target: {
            arrayIndex: origin.arrayIndex,
            stringIndex
        }
    };
    integrals.push({
        kind: "TEXT",
        textVector
    });
    integrals.push({
        kind: "CHUNK_ARRAY_INJECTION",
        injectionID: origin.arrayIndex
    });
    let arrayIndex = origin.arrayIndex + 1;
    while(arrayIndex < target.arrayIndex){
        stringIndex = template.templateArray[arrayIndex].length - 1;
        textVector = {
            origin: {
                arrayIndex,
                stringIndex: 0
            },
            target: {
                arrayIndex,
                stringIndex
            }
        };
        integrals.push({
            kind: "TEXT",
            textVector
        });
        integrals.push({
            kind: "CHUNK_ARRAY_INJECTION",
            injectionID: arrayIndex
        });
        arrayIndex += 1;
    }
    textVector = {
        origin: {
            arrayIndex: target.arrayIndex,
            stringIndex: 0
        },
        target
    };
    integrals.push({
        kind: "TEXT",
        textVector
    });
    return integrals;
};
const buildIntegrals = ({ template , skeleton  })=>{
    const integrals = [];
    for (const chunk of skeleton){
        const nodeType = chunk.nodeType;
        const origin = chunk.vector.origin;
        if (origin.stringIndex === 0 && origin.arrayIndex !== 0) {
            integrals.push({
                kind: "CHUNK_ARRAY_INJECTION",
                injectionID: origin.arrayIndex - 1
            });
        }
        if (nodeType === "OPEN_NODE_CONFIRMED") {
            appendNodeIntegrals({
                kind: "NODE",
                integrals,
                template,
                chunk
            });
        }
        if (nodeType === "CLOSE_NODE_CONFIRMED") {
            appendCloseNodeIntegrals({
                integrals,
                template,
                chunk
            });
        }
        if (nodeType === "CONTENT_NODE") {
            appendContentIntegrals({
                integrals,
                template,
                chunk
            });
        }
        if (nodeType === "SELF_CLOSING_NODE_CONFIRMED") {
            appendNodeIntegrals({
                kind: "SELF_CLOSING_NODE",
                integrals,
                template,
                chunk
            });
        }
    }
    return integrals;
};
const routers = {
    CONTENT_NODE: {
        "<": "OPEN_NODE",
        DEFAULT: "CONTENT_NODE"
    },
    OPEN_NODE: {
        " ": "CONTENT_NODE",
        "\n": "CONTENT_NODE",
        "<": "OPEN_NODE",
        "/": "CLOSE_NODE",
        DEFAULT: "OPEN_NODE_VALID"
    },
    OPEN_NODE_VALID: {
        "<": "OPEN_NODE",
        "/": "SELF_CLOSING_NODE_VALID",
        ">": "OPEN_NODE_CONFIRMED",
        DEFAULT: "OPEN_NODE_VALID"
    },
    CLOSE_NODE: {
        " ": "CONTENT_NODE",
        "\n": "CONTENT_NODE",
        "<": "OPEN_NODE",
        DEFAULT: "CLOSE_NODE_VALID"
    },
    CLOSE_NODE_VALID: {
        "<": "OPEN_NODE",
        ">": "CLOSE_NODE_CONFIRMED",
        DEFAULT: "CLOSE_NODE_VALID"
    },
    SELF_CLOSING_NODE_VALID: {
        "<": "OPEN_NODE",
        ">": "SELF_CLOSING_NODE_CONFIRMED",
        DEFAULT: "SELF_CLOSING_NODE_VALID"
    }
};
const DEFAULT = "DEFAULT";
const CONTENT_NODE = "CONTENT_NODE";
const OPEN_NODE = "OPEN_NODE";
const validSieve = {
    ["OPEN_NODE_VALID"]: "OPEN_NODE_VALID",
    ["CLOSE_NODE_VALID"]: "CLOSE_NODE_VALID",
    ["SELF_CLOSING_NODE_VALID"]: "SELF_CLOSING_NODE_VALID"
};
const confirmedSieve = {
    ["OPEN_NODE_CONFIRMED"]: "OPEN_NODE_CONFIRMED",
    ["CLOSE_NODE_CONFIRMED"]: "CLOSE_NODE_CONFIRMED",
    ["SELF_CLOSING_NODE_CONFIRMED"]: "SELF_CLOSING_NODE_CONFIRMED"
};
const setStartStateProperties = (template, previousCrawl)=>{
    if (previousCrawl === undefined) {
        return {
            nodeType: CONTENT_NODE,
            vector: create()
        };
    }
    const followingVector = createFollowingVector(template, previousCrawl.vector);
    if (followingVector === undefined) {
        return;
    }
    const crawlState = {
        nodeType: CONTENT_NODE,
        vector: followingVector
    };
    return crawlState;
};
const setNodeType = (template, crawlState)=>{
    const nodeStates = routers[crawlState.nodeType];
    const __char = getCharAtPosition(template, crawlState.vector.target);
    if (nodeStates !== undefined && __char !== undefined) {
        const defaultNodeType = nodeStates[DEFAULT] ?? CONTENT_NODE;
        crawlState.nodeType = nodeStates[__char] ?? defaultNodeType;
    }
    return crawlState;
};
const crawl = (template, previousCrawl)=>{
    const crawlState = setStartStateProperties(template, previousCrawl);
    if (crawlState === undefined) {
        return;
    }
    let openPosition;
    setNodeType(template, crawlState);
    while(incrementTarget(template, crawlState.vector)){
        if (validSieve[crawlState.nodeType] === undefined && crawlState.vector.target.stringIndex === 0) {
            crawlState.nodeType = CONTENT_NODE;
        }
        setNodeType(template, crawlState);
        if (crawlState.nodeType === OPEN_NODE) {
            openPosition = copy1(crawlState.vector.target);
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
const DEFAULT_CRAWL_RESULTS = {
    nodeType: "CONTENT_NODE",
    vector: {
        origin: {
            arrayIndex: 0,
            stringIndex: 0
        },
        target: {
            arrayIndex: 0,
            stringIndex: 0
        }
    }
};
const SKELETON_SIEVE = {
    ["OPEN_NODE_CONFIRMED"]: "OPEN_NODE",
    ["SELF_CLOSING_NODE_CONFIRMED"]: "SELF_CLOSING_NODE",
    ["CLOSE_NODE_CONFIRMED"]: "CLOSE_NODE",
    ["CONTENT_NODE"]: "CONTENT_NODE"
};
const isDistanceGreaterThanOne = ({ template , origin , target ,  })=>{
    if (hasOriginEclipsedTaraget({
        origin,
        target
    })) {
        return false;
    }
    const originCopy = copy1(origin);
    if (increment(template, originCopy) === undefined) {
        return false;
    }
    if (target.arrayIndex === originCopy.arrayIndex && target.stringIndex === originCopy.stringIndex) {
        return false;
    }
    return true;
};
const buildMissingStringNode = ({ template , previousCrawl , currentCrawl ,  })=>{
    const originPos = previousCrawl !== undefined ? previousCrawl.vector.target : DEFAULT_CRAWL_RESULTS.vector.target;
    const targetPos = currentCrawl.vector.origin;
    if (!isDistanceGreaterThanOne({
        template,
        origin: originPos,
        target: targetPos
    })) {
        return;
    }
    const origin = previousCrawl === undefined ? copy1(DEFAULT_CRAWL_RESULTS.vector.target) : copy1(previousCrawl.vector.target);
    const target = copy1(currentCrawl.vector.origin);
    decrement(template, target);
    if (previousCrawl !== undefined) {
        increment(template, origin);
    }
    return {
        nodeType: "CONTENT_NODE",
        vector: {
            origin,
            target
        }
    };
};
const buildSkeleton = (template)=>{
    const skeleton = [];
    let previousCrawl;
    let currentCrawl = crawl(template, previousCrawl);
    let depth = 0;
    while(currentCrawl && depth < 128){
        const stringBone = buildMissingStringNode({
            template,
            previousCrawl,
            currentCrawl
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
const popSelfClosingNode = (rs)=>{
    const parent = rs.stack[rs.stack.length - 1];
    if (parent !== undefined && parent.kind === "NODE" && parent.selfClosing === true) {
        rs.stack.pop();
        rs.lastNodes.pop();
    }
};
const createTextNode = ({ hooks , rs , integral  })=>{
    popSelfClosingNode(rs);
    const text = getText(rs.template, integral.textVector);
    if (text === undefined) {
        return;
    }
    const descendant = hooks.createTextNode(text);
    const parentNode = rs.stack[rs.stack.length - 1]?.node;
    const lastNodeIndex = rs.lastNodes.length - 1;
    const leftNode = rs.lastNodes[lastNodeIndex];
    const isSiblingLevel = rs.stack.length === 0;
    if (rs.stack.length === 0) {
        rs.siblings.push([
            descendant
        ]);
    } else {
        hooks.insertDescendant({
            parentNode,
            descendant,
            leftNode
        });
    }
    rs.lastNodes[lastNodeIndex] = descendant;
};
const createNode = ({ hooks , rs , integral  })=>{
    popSelfClosingNode(rs);
    const tagName = getText(rs.template, integral.tagNameVector);
    if (tagName === undefined) {
        return;
    }
    const parent = rs.stack[rs.stack.length - 1];
    const descendant = hooks.createNode(tagName);
    const parentNode = parent?.node;
    const lastNodeIndex = rs.lastNodes.length - 1;
    const leftNode = rs.lastNodes[lastNodeIndex];
    const isSiblingLevel = rs.stack.length === 0;
    if (isSiblingLevel) {
        rs.siblings.push([
            descendant
        ]);
    } else {
        hooks.insertDescendant({
            parentNode,
            leftNode,
            descendant
        });
    }
    rs.lastNodes[lastNodeIndex] = descendant;
    rs.lastNodes.push(undefined);
    const selfClosing = integral.kind === "SELF_CLOSING_NODE";
    rs.stack.push({
        kind: "NODE",
        node: descendant,
        selfClosing,
        tagName
    });
};
const closeNode = ({ hooks , rs , integral  })=>{
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
const createChunkArrayInjection = ({ hooks , rs , integral ,  })=>{
    popSelfClosingNode(rs);
    const parentNode = rs.stack[rs.stack.length - 1]?.node;
    const lastNodeIndex = rs.lastNodes.length - 1;
    const leftNode = rs.lastNodes[lastNodeIndex];
    const injection = rs.template.injections[integral.injectionID];
    const isSiblingLevel = rs.stack.length === 0;
    let siblingIndex;
    if (!Array.isArray(injection)) {
        const text = String(injection);
        const textNode = hooks.createTextNode(text);
        if (rs.stack.length === 0) {
            rs.siblings.push([
                textNode
            ]);
            siblingIndex = rs.siblings.length - 1;
        } else {
            hooks.insertDescendant({
                descendant: textNode,
                parentNode,
                leftNode
            });
        }
        rs.descendants[integral.injectionID] = {
            kind: "TEXT",
            params: {
                textNode,
                leftNode,
                parentNode,
                text,
                siblingIndex
            }
        };
        rs.lastNodes[lastNodeIndex] = textNode;
        return;
    }
    const siblingsFromContextArray = [];
    let prevSibling = leftNode;
    for(const contextID in injection){
        const context = injection[contextID];
        const siblings = context.getSiblings();
        if (isSiblingLevel) {
            for(const siblingID in siblings){
                const sibling = siblings[siblingID];
                siblingsFromContextArray.push(sibling);
                prevSibling = sibling;
            }
        } else {
            prevSibling = context.mount(parentNode, prevSibling);
        }
    }
    if (isSiblingLevel) {
        rs.siblings.push(siblingsFromContextArray);
        siblingIndex = rs.siblings.length - 1;
    }
    rs.descendants[integral.injectionID] = {
        kind: "CHUNK_ARRAY",
        params: {
            chunkArray: injection,
            leftNode,
            parentNode,
            siblingIndex
        }
    };
    rs.lastNodes[lastNodeIndex] = prevSibling;
};
const appendExplicitAttribute = ({ hooks , rs , integral ,  })=>{
    const references = rs.references;
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
    hooks.setAttribute({
        references: rs.references,
        node,
        attribute,
        value
    });
};
const appendImplicitAttribute = ({ hooks , rs , integral ,  })=>{
    if (rs.stack.length === 0) {
        return;
    }
    const { node  } = rs.stack[rs.stack.length - 1];
    const attribute = getText(rs.template, integral.attributeVector);
    if (attribute === undefined) {
        return;
    }
    hooks.setAttribute({
        value: true,
        references: rs.references,
        node,
        attribute
    });
};
const appendInjectedAttribute = ({ hooks , rs , integral ,  })=>{
    if (rs.stack.length === 0) {
        return;
    }
    const { node  } = rs.stack[rs.stack.length - 1];
    const attribute = getText(rs.template, integral.attributeVector);
    if (attribute === undefined) {
        return;
    }
    const { injectionID  } = integral;
    const value = rs.template.injections[injectionID];
    if (value instanceof ChunkBase) {
        return;
    }
    rs.attributes[injectionID] = {
        kind: "ATTRIBUTE",
        params: {
            references: rs.references,
            node,
            attribute,
            value
        }
    };
    hooks.setAttribute({
        references: rs.references,
        node,
        attribute,
        value
    });
};
const buildRender = ({ hooks , template , integrals  })=>{
    const rs = {
        template,
        attributes: {
        },
        references: {
        },
        descendants: {
        },
        siblings: [],
        lastNodes: [
            undefined
        ],
        stack: []
    };
    for (const integral of integrals){
        if (integral.kind === "NODE") {
            createNode({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "SELF_CLOSING_NODE") {
            createNode({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "CLOSE_NODE") {
            closeNode({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "TEXT") {
            createTextNode({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "CHUNK_ARRAY_INJECTION") {
            createChunkArrayInjection({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "EXPLICIT_ATTRIBUTE") {
            appendExplicitAttribute({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "IMPLICIT_ATTRIBUTE") {
            appendImplicitAttribute({
                hooks,
                rs,
                integral
            });
        }
        if (integral.kind === "INJECTED_ATTRIBUTE") {
            appendInjectedAttribute({
                hooks,
                rs,
                integral
            });
        }
    }
    return rs;
};
const builds = {
};
const buildRenderStructure = (hooks, template)=>{
    const cacheable = template.templateArray.join();
    let integrals = builds[cacheable];
    if (integrals === undefined) {
        const skeleton = buildSkeleton(template);
        integrals = buildIntegrals({
            template,
            skeleton
        });
        builds[cacheable] = integrals;
    }
    const render = buildRender({
        hooks,
        template,
        integrals
    });
    return render;
};
class Banger {
    constructor(chunk){
        this.chunk = chunk;
    }
    bang() {
        this.chunk.bang();
    }
    getReferences() {
        return this.chunk.getReferences();
    }
}
class Chunk1 extends ChunkBase {
    constructor(baseParams){
        super();
        this.banger = new Banger(this);
        this.hooks = baseParams.hooks;
        this.chunker = baseParams.chunker;
        this.params = baseParams.params;
        this.state = this.chunker.connect({
            banger: this.banger,
            params: baseParams.params
        });
        const template1 = this.getTemplate();
        this.rs = buildRenderStructure(this.hooks, template1);
        this.siblings = getUpdatedSiblings(this.rs);
        this.effect = this.updateEffect("UNMOUNTED");
    }
    bang() {
        this.update(this.params);
    }
    update(params) {
        this.setParams(params);
        const template1 = this.getTemplate();
        if (this.effect.quality === "DISCONNECTED") {
            this.disconnect();
            this.remount(template1);
            return;
        }
        if (hasTemplateChanged(this.rs, template1)) {
            this.remount(template1);
            return;
        }
        updateAttributes(this.hooks, this.rs, template1);
        const descendantsHaveUpdated = updateDescendants({
            contextParentNode: this.parentNode,
            hooks: this.hooks,
            rs: this.rs,
            template: template1
        });
        if (descendantsHaveUpdated) {
            this.siblings = getUpdatedSiblings(this.rs);
        }
    }
    mount(parentNode, leftNode) {
        this.parentNode = parentNode;
        this.leftNode = leftNode;
        let prevSibling;
        let descendant = leftNode;
        for(const siblingID in this.siblings){
            prevSibling = descendant;
            descendant = this.siblings[siblingID];
            this.hooks.insertDescendant({
                leftNode: prevSibling,
                parentNode,
                descendant
            });
        }
        this.updateEffect("MOUNTED");
        return descendant;
    }
    unmount() {
        this.parentNode = undefined;
        this.leftNode = undefined;
        for(const siblingID in this.siblings){
            const sibling = this.siblings[siblingID];
            this.hooks.removeDescendant(sibling);
        }
        this.updateEffect("UNMOUNTED");
    }
    disconnect() {
        disconnectDescendants(this.hooks, this.rs);
        if (this.state !== undefined && this.chunker.disconnect !== undefined) {
            this.chunker.disconnect({
                state: this.state
            });
        }
        this.updateEffect("DISCONNECTED");
    }
    getSiblings() {
        return this.siblings;
    }
    getReferences() {
        if (this.rs !== undefined) {
            return this.rs.references;
        }
    }
    getEffect() {
        return this.effect;
    }
    remount(template) {
        this.rs = buildRenderStructure(this.hooks, template);
        this.siblings = getUpdatedSiblings(this.rs);
        this.mount(this.parentNode, this.leftNode);
        this.effect = this.updateEffect("CONNECTED");
    }
    updateEffect(quality) {
        this.effect = {
            timestamp: performance.now(),
            quality
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
            params: this.params
        });
    }
}
const getUpdatedSiblings = (rs)=>{
    const siblings = [];
    const originalSiblings = rs.siblings;
    for(const siblingArrayID in originalSiblings){
        const siblingArray = originalSiblings[siblingArrayID];
        for(const siblingID in siblingArray){
            const sibling = siblingArray[siblingID];
            siblings.push(sibling);
        }
    }
    return siblings;
};
const hasTemplateChanged = (rs, template2)=>{
    const templateLength = template2.templateArray.length;
    if (rs.template.templateArray.length !== templateLength) {
        return true;
    }
    let index = 0;
    while(index < templateLength){
        const sourceStr = rs.template.templateArray[index];
        const targetStr = template2.templateArray[index];
        if (sourceStr !== targetStr) {
            return true;
        }
        index += 1;
    }
    return false;
};
const updateAttributes = (hooks, rs, template2)=>{
    for(const attributesID in rs.attributes){
        const pastInjection = rs.attributes[attributesID];
        const attributeValue = template2.injections[attributesID];
        if (attributeValue === pastInjection.params.value) {
            continue;
        }
        hooks.removeAttribute(pastInjection.params);
        pastInjection.params.value = attributeValue;
        hooks.setAttribute(pastInjection.params);
    }
};
const updateDescendants = ({ hooks , rs , template: template2 , contextParentNode ,  })=>{
    let siblingLevelUpdated = false;
    for(const descenantID in rs.descendants){
        const pastDescendant = rs.descendants[descenantID];
        const descendant = template2.injections[descenantID];
        if (pastDescendant.kind === "TEXT" && !Array.isArray(descendant)) {
            const text = String(descendant);
            if (pastDescendant.params.text === text) {
                continue;
            }
        }
        if (pastDescendant.kind === "CHUNK_ARRAY") {
            const chunkArray = pastDescendant.params.chunkArray;
            for(const contextID in chunkArray){
                chunkArray[contextID].unmount();
            }
        }
        const { leftNode , parentNode , siblingIndex  } = pastDescendant.params;
        if (!siblingLevelUpdated) {
            siblingLevelUpdated = siblingIndex !== undefined;
        }
        if (pastDescendant.kind === "TEXT") {
            hooks.removeDescendant(pastDescendant.params.textNode);
        }
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
                    siblingIndex
                }
            };
            hooks.insertDescendant({
                descendant: textNode,
                leftNode,
                parentNode: parentNode ?? contextParentNode
            });
            if (siblingIndex !== undefined) {
                rs.siblings[siblingIndex] = [
                    textNode
                ];
            }
            continue;
        }
        const chunkArray = descendant;
        rs.descendants[descenantID] = {
            kind: "CHUNK_ARRAY",
            params: {
                chunkArray,
                leftNode,
                parentNode,
                siblingIndex
            }
        };
        let currLeftNode = leftNode;
        for(const contextID in descendant){
            const chunk1 = chunkArray[contextID];
            currLeftNode = chunk1.mount(parentNode ?? contextParentNode, currLeftNode);
        }
        if (pastDescendant.kind === "CHUNK_ARRAY") {
            const chunkArray1 = pastDescendant.params.chunkArray;
            for(const contextID1 in chunkArray1){
                const context = chunkArray1[contextID1];
                const effect = context.getEffect();
                if (effect.quality === "UNMOUNTED") {
                    context.disconnect();
                }
            }
        }
    }
    return siblingLevelUpdated;
};
const disconnectDescendants = (hooks, rs)=>{
    const attributes = rs.attributes;
    for(const attributeID in attributes){
        const attribute = attributes[attributeID];
        hooks.removeAttribute(attribute.params);
    }
    for(const descendantID in rs.descendants){
        const descendant = rs.descendants[descendantID];
        if (descendant.kind === "TEXT") {
            hooks.removeDescendant(descendant.params.textNode);
        }
        if (descendant.kind === "CHUNK_ARRAY") {
            const chunkArray = descendant.params.chunkArray;
            for(const contextID in chunkArray){
                const context = chunkArray[contextID];
                context.unmount();
                context.disconnect();
            }
        }
    }
};
export { Chunk1 as Chunk };
