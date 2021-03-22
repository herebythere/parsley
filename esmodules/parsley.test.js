const samestuff = (source, comparator)=>{
    if (source === null || comparator === null) {
        return source === comparator;
    }
    const isSourceObject = source instanceof Object;
    const isComparatorObject = comparator instanceof Object;
    if (!isSourceObject || !isComparatorObject) {
        return source === comparator;
    }
    const isSourceFunc = source instanceof Function;
    const isComparatorFunc = comparator instanceof Function;
    if (isSourceFunc || isComparatorFunc) {
        return source === comparator;
    }
    const isSourceArray = source instanceof Array;
    const isComparatorArray = comparator instanceof Array;
    if (isSourceArray !== isComparatorArray) {
        return source === comparator;
    }
    if (source instanceof Object && comparator instanceof Object) {
        for(const sourceKey in source){
            const typedSourceKey = sourceKey;
            const nextSource = source[typedSourceKey];
            const nextComparator = comparator[typedSourceKey];
            if (!samestuff(nextSource, nextComparator)) {
                return false;
            }
        }
        for(const comparatorKey in comparator){
            const typedComparatorKey = comparatorKey;
            const nextComparator = comparator[typedComparatorKey];
            const nextSource = source[typedComparatorKey];
            if (!samestuff(nextComparator, nextSource)) {
                return false;
            }
        }
    }
    return true;
};
const DEFAULT_POSITION = {
    arrayIndex: 0,
    stringIndex: 0
};
const create = (position = DEFAULT_POSITION)=>({
        ...position
    })
;
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
const DEFAULT_POSITION1 = {
    arrayIndex: 0,
    stringIndex: 0
};
const create1 = (position = DEFAULT_POSITION1)=>({
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
const QUOTE_RUNE = '"';
const ASSIGN_RUNE = "=";
const ATTRIBUTE_FOUND = "ATTRIBUTE_FOUND";
const ATTRIBUTE_ASSIGNMENT = "ATTRIBUTE_ASSIGNMENT";
const IMPLICIT_ATTRIBUTE = "IMPLICIT_ATTRIBUTE";
const EXPLICIT_ATTRIBUTE = "EXPLICIT_ATTRIBUTE";
const INJECTED_ATTRIBUTE = "INJECTED_ATTRIBUTE";
const BREAK_RUNES = {
    " ": true,
    "\n": true
};
const getAttributeName = (template, vectorBounds)=>{
    let positionChar = getCharAtPosition(template, vectorBounds.origin);
    if (positionChar === undefined || BREAK_RUNES[positionChar]) {
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
        if (BREAK_RUNES[positionChar]) {
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
        if (BREAK_RUNES[positionChar]) {
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
const title = "attribute_crawl";
const testTextInterpolator = (templateArray, ...injections)=>{
    return {
        templateArray,
        injections
    };
};
const emptyString = ()=>{
    const assertions = [];
    const template = testTextInterpolator``;
    const vector = create1();
    const results = crawlForAttribute(template, vector);
    if (results !== undefined) {
        assertions.push("this should have failed");
    }
    return assertions;
};
const emptySpaceString = ()=>{
    const assertions = [];
    const template = testTextInterpolator` `;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForAttribute(template, vector);
    if (results !== undefined) {
        assertions.push("this should have failed");
    }
    return assertions;
};
const emptyMultiSpaceString = ()=>{
    const assertions = [];
    const template = testTextInterpolator`   `;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForAttribute(template, vector);
    if (results !== undefined) {
        assertions.push("this should have failed");
    }
    return assertions;
};
const implicitString = ()=>{
    const assertions = [];
    const expectedResults = {
        kind: "IMPLICIT_ATTRIBUTE",
        attributeVector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 0,
                stringIndex: 6
            }
        }
    };
    const template = testTextInterpolator`checked`;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForAttribute(template, vector);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const implicitStringWithTrailingSpaces = ()=>{
    const assertions = [];
    const expectedResults = {
        kind: "IMPLICIT_ATTRIBUTE",
        attributeVector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 0,
                stringIndex: 6
            }
        }
    };
    const template = testTextInterpolator`checked    `;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForAttribute(template, vector);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const malformedExplicitString = ()=>{
    const assertions = [];
    const template = testTextInterpolator`checked=`;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForAttribute(template, vector);
    if (results !== undefined) {
        assertions.push("this should not have returned results");
    }
    return assertions;
};
const almostExplicitString = ()=>{
    const assertions = [];
    const template = testTextInterpolator`checked="`;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForAttribute(template, vector);
    if (results !== undefined) {
        assertions.push("this should not have returned results");
    }
    return assertions;
};
const emptyExplicitString = ()=>{
    const assertions = [];
    const expectedResults = {
        kind: "EXPLICIT_ATTRIBUTE",
        attributeVector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 0,
                stringIndex: 6
            }
        },
        valueVector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 8
            },
            target: {
                arrayIndex: 0,
                stringIndex: 9
            }
        }
    };
    const template = testTextInterpolator`checked=""`;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForAttribute(template, vector);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const validExplicitString = ()=>{
    const assertions = [];
    const expectedResults = {
        kind: "EXPLICIT_ATTRIBUTE",
        attributeVector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 0,
                stringIndex: 6
            }
        },
        valueVector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 8
            },
            target: {
                arrayIndex: 0,
                stringIndex: 16
            }
        }
    };
    const template = testTextInterpolator`checked="checked"`;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForAttribute(template, vector);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const validExplicitStringWithTrailingSpaces = ()=>{
    const assertions = [];
    const expectedResults = {
        kind: "EXPLICIT_ATTRIBUTE",
        attributeVector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 0,
                stringIndex: 6
            }
        },
        valueVector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 8
            },
            target: {
                arrayIndex: 0,
                stringIndex: 19
            }
        }
    };
    const template = testTextInterpolator`checked="checked   "`;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForAttribute(template, vector);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const injectedString = ()=>{
    const assertions = [];
    const expectedResults = {
        kind: "INJECTED_ATTRIBUTE",
        attributeVector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 0,
                stringIndex: 6
            }
        },
        valueVector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 8
            },
            target: {
                arrayIndex: 1,
                stringIndex: 0
            }
        },
        injectionID: 0
    };
    const template = testTextInterpolator`checked="${"hello"}"`;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForAttribute(template, vector);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    if (results === undefined) {
        assertions.push("this should have returned results");
    }
    return assertions;
};
const malformedInjectedString = ()=>{
    const assertions = [];
    const template = testTextInterpolator`checked="${"hello"}`;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForAttribute(template, vector);
    if (results !== undefined) {
        assertions.push("this should have returned results");
    }
    return assertions;
};
const malformedInjectedStringWithTrailingSpaces = ()=>{
    const assertions = [];
    const template = testTextInterpolator`checked="${"hello"} "`;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForAttribute(template, vector);
    if (results !== undefined) {
        assertions.push("this should not have returned results");
    }
    return assertions;
};
const malformedInjectedStringWithStartingSpaces = ()=>{
    const assertions = [];
    const template = testTextInterpolator`checked=" ${"hello"}"`;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForAttribute(template, vector);
    if (results !== undefined) {
        assertions.push("this should not have returned results");
    }
    return assertions;
};
const tests12 = [
    emptyString,
    emptySpaceString,
    emptyMultiSpaceString,
    implicitString,
    implicitStringWithTrailingSpaces,
    malformedExplicitString,
    almostExplicitString,
    emptyExplicitString,
    validExplicitString,
    validExplicitStringWithTrailingSpaces,
    injectedString,
    malformedInjectedString,
    malformedInjectedStringWithTrailingSpaces,
    malformedInjectedStringWithStartingSpaces, 
];
const unitTestAttributeCrawl = {
    title,
    tests: tests12,
    runTestsAsynchronously: true
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
            vector: create1()
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
const BREAK_RUNES1 = {
    " ": true,
    "\n": true
};
const crawlForTagName = (template, innerXmlBounds)=>{
    const tagVector = copy2(innerXmlBounds);
    let positionChar = getCharAtPosition(template, tagVector.origin);
    if (positionChar === undefined || BREAK_RUNES1[positionChar]) {
        return;
    }
    while(BREAK_RUNES1[positionChar] === undefined && !hasOriginEclipsedTaraget(tagVector)){
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
    if (BREAK_RUNES1[positionChar]) {
        decrementTarget(template, adjustedVector);
    }
    return adjustedVector;
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
const appendNodeIntegrals = ({ integrals , template , chunk ,  })=>{
    const innerXmlBounds = copy2(chunk.vector);
    incrementOrigin(template, innerXmlBounds);
    decrementTarget(template, innerXmlBounds);
    const tagNameVector = crawlForTagName(template, innerXmlBounds);
    if (tagNameVector === undefined) {
        return;
    }
    integrals.push({
        kind: "NODE",
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
const appendSelfClosingNodeIntegrals = ({ integrals , template , chunk ,  })=>{
    const innerXmlBounds = copy2(chunk.vector);
    incrementOrigin(template, innerXmlBounds);
    decrementTarget(template, innerXmlBounds);
    decrementTarget(template, innerXmlBounds);
    const tagNameVector = crawlForTagName(template, innerXmlBounds);
    if (tagNameVector === undefined) {
        return;
    }
    integrals.push({
        kind: "SELF_CLOSING_NODE",
        tagNameVector
    });
    return integrals;
};
const appendCloseNodeIntegrals = ({ integrals , template , chunk ,  })=>{
    const innerXmlBounds = copy2(chunk.vector);
    incrementOrigin(template, innerXmlBounds);
    incrementOrigin(template, innerXmlBounds);
    decrementTarget(template, innerXmlBounds);
    let tagNameVector = copy2(innerXmlBounds);
    tagNameVector = crawlForTagName(template, tagNameVector);
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
            appendSelfClosingNodeIntegrals({
                integrals,
                template,
                chunk
            });
        }
    }
    return integrals;
};
const title1 = "build_integrals";
const testTextInterpolator1 = (templateArray, ...injections)=>{
    const template = {
        templateArray,
        injections
    };
    return {
        template: template,
        skeleton: buildSkeleton(template)
    };
};
const findParagraph = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 1
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 1
                }
            }
        }, 
    ];
    const params = testTextInterpolator1`<p>`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const findParagraphWithAttributes = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 1
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 1
                }
            }
        },
        {
            kind: "EXPLICIT_ATTRIBUTE",
            attributeVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 3
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 9
                }
            },
            valueVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 11
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 25
                }
            }
        }, 
    ];
    const params = testTextInterpolator1`<p message="hello, world!">`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const findParagraphWithImplicitAttribute = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 1
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 1
                }
            }
        },
        {
            kind: "EXPLICIT_ATTRIBUTE",
            attributeVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 3
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 9
                }
            },
            valueVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 11
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 25
                }
            }
        },
        {
            kind: "IMPLICIT_ATTRIBUTE",
            attributeVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 27
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 33
                }
            }
        }, 
    ];
    const params = testTextInterpolator1`<p message="hello, world!" checked>`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const findParagraphWithInjectedAttribute = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 1
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 1
                }
            }
        },
        {
            kind: "INJECTED_ATTRIBUTE",
            attributeVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 3
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 9
                }
            },
            valueVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 11
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 0
                }
            },
            injectionID: 0
        }, 
    ];
    const params = testTextInterpolator1`<p message="${"hello, world!"}">`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const findParagraphWithInjectedAndImplicitAttributes = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 1
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 1
                }
            }
        },
        {
            kind: "INJECTED_ATTRIBUTE",
            attributeVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 3
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 9
                }
            },
            valueVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 11
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 0
                }
            },
            injectionID: 0
        },
        {
            kind: "IMPLICIT_ATTRIBUTE",
            attributeVector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 2
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 8
                }
            }
        }, 
    ];
    const params = testTextInterpolator1`<p message="${"hello, world!"}" checked>`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const testFindCloseParagraph = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "CLOSE_NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 2
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 2
                }
            }
        }, 
    ];
    const params = testTextInterpolator1`</p>`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const testFindCloseH1 = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "CLOSE_NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 2
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 3
                }
            }
        }, 
    ];
    const params = testTextInterpolator1`</h1>`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const testFindCloseParagraphWithTrailingSpaces = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "CLOSE_NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 2
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 3
                }
            }
        }, 
    ];
    const params = testTextInterpolator1`</h1        >`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const testFindContent = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "TEXT",
            textVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 11
                }
            }
        }, 
    ];
    const params = testTextInterpolator1`hello world!`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const testFindContentWithInjection = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "TEXT",
            textVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: -1
                }
            }
        },
        {
            kind: "CHUNK_ARRAY_INJECTION",
            injectionID: 0
        },
        {
            kind: "TEXT",
            textVector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 11
                }
            }
        }, 
    ];
    const params = testTextInterpolator1`${"hello"}hello world!`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const testFindContentWithInitialMultipleInjections = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "TEXT",
            textVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: -1
                }
            }
        },
        {
            kind: "CHUNK_ARRAY_INJECTION",
            injectionID: 0
        },
        {
            kind: "TEXT",
            textVector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 11
                }
            }
        },
        {
            kind: "CHUNK_ARRAY_INJECTION",
            injectionID: 1
        },
        {
            kind: "TEXT",
            textVector: {
                origin: {
                    arrayIndex: 2,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 2,
                    stringIndex: 0
                }
            }
        }, 
    ];
    const params = testTextInterpolator1`${"heyyo"}hello world,${"you're awesome"}!`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const testFindContentWithEdgeCaseInjections = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "CHUNK_ARRAY_INJECTION",
            injectionID: 0
        },
        {
            kind: "NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 1
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 1
                }
            }
        },
        {
            kind: "TEXT",
            textVector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 3
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 14
                }
            }
        },
        {
            kind: "CHUNK_ARRAY_INJECTION",
            injectionID: 1
        },
        {
            kind: "CLOSE_NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 2,
                    stringIndex: 2
                },
                target: {
                    arrayIndex: 2,
                    stringIndex: 2
                }
            }
        },
        {
            kind: "NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 2,
                    stringIndex: 5
                },
                target: {
                    arrayIndex: 2,
                    stringIndex: 9
                }
            }
        },
        {
            kind: "INJECTED_ATTRIBUTE",
            attributeVector: {
                origin: {
                    arrayIndex: 2,
                    stringIndex: 11
                },
                target: {
                    arrayIndex: 2,
                    stringIndex: 13
                }
            },
            valueVector: {
                origin: {
                    arrayIndex: 2,
                    stringIndex: 15
                },
                target: {
                    arrayIndex: 3,
                    stringIndex: 0
                }
            },
            injectionID: 2
        }, 
    ];
    const params = testTextInterpolator1`${"heyyo"}<p>hello world,${"you're awesome"}</p><image src="${"hello_world"}">`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const testSimpleNodes = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 1
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 1
                }
            }
        },
        {
            kind: "TEXT",
            textVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 3
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 14
                }
            }
        },
        {
            kind: "CLOSE_NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 17
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 17
                }
            }
        }, 
    ];
    const params = testTextInterpolator1`<p>hello world!</p>`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const testSimpleInjectionNodes = ()=>{
    const assertions = [];
    const expectedResults = [
        {
            kind: "NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 1
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 3
                }
            }
        },
        {
            kind: "CHUNK_ARRAY_INJECTION",
            injectionID: 0
        },
        {
            kind: "CLOSE_NODE",
            tagNameVector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 2
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 4
                }
            }
        }, 
    ];
    const params = testTextInterpolator1`<dog>${"hello world!"}</dog>`;
    const results = buildIntegrals(params);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const tests1 = [
    findParagraph,
    testFindContentWithInjection,
    findParagraphWithAttributes,
    findParagraphWithImplicitAttribute,
    findParagraphWithInjectedAttribute,
    findParagraphWithInjectedAndImplicitAttributes,
    testFindContentWithInitialMultipleInjections,
    testFindContentWithEdgeCaseInjections,
    testFindCloseParagraph,
    testFindCloseH1,
    testFindCloseParagraphWithTrailingSpaces,
    testFindContent,
    testSimpleNodes,
    testSimpleInjectionNodes, 
];
const unitTestBuildIntegrals = {
    title: title1,
    tests: tests1,
    runTestsAsynchronously: true
};
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
const buildRenderStructure = (hooks, template)=>{
    const skeleton = buildSkeleton(template);
    const integrals = buildIntegrals({
        template,
        skeleton
    });
    const render = buildRender({
        hooks: hooks,
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
class Chunk extends ChunkBase {
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
const hooks = {
    createNode: (tagname)=>{
        return {
            kind: "ELEMENT",
            attributes: {
            },
            tagname
        };
    },
    createTextNode: (text)=>{
        return {
            kind: "TEXT",
            text
        };
    },
    setAttribute: (params)=>{
        const { node , attribute , value  } = params;
        if (value instanceof Chunk) {
            return;
        }
        if (node.kind === "ELEMENT") {
            node.attributes[attribute] = value;
        }
    },
    removeAttribute: (params)=>{
        const { node , attribute , value  } = params;
        if (value instanceof Chunk) {
            return;
        }
        if (node.kind === "ELEMENT") {
            node.attributes[attribute] = undefined;
        }
    },
    getSibling: (sibling)=>{
        return sibling.right;
    },
    insertDescendant: ({ leftNode , parentNode , descendant  })=>{
        if (parentNode === undefined) {
            return;
        }
        if (leftNode !== undefined) {
            const leftRightDescendant = leftNode.right;
            descendant.right = leftRightDescendant;
            if (leftRightDescendant !== undefined) {
                leftRightDescendant.left = descendant;
            }
            descendant.left = leftNode;
            leftNode.right = descendant;
        }
        if (parentNode?.kind === "ELEMENT") {
            descendant.parent = parentNode;
            if (parentNode.leftChild === undefined) {
                parentNode.leftChild = descendant;
            }
            if (parentNode.rightChild === leftNode) {
                parentNode.rightChild = descendant;
            }
        }
    },
    removeDescendant: (descendant)=>{
        const parent = descendant.parent;
        const leftNode = descendant.left;
        const rightNode = descendant.right;
        descendant.parent = undefined;
        descendant.right = undefined;
        descendant.left = undefined;
        if (leftNode !== undefined) {
            leftNode.right = rightNode;
        }
        if (rightNode !== undefined) {
            rightNode.left = leftNode;
        }
        if (parent === undefined) {
            return;
        }
        if (descendant === parent.leftChild) {
            parent.leftChild = rightNode;
        }
        if (descendant === parent.rightChild) {
            parent.rightChild = leftNode;
        }
        return parent;
    }
};
const draw = (templateArray, ...injections)=>{
    return {
        injections,
        templateArray
    };
};
const title2 = "build_render";
const testTextInterpolator2 = (templateArray, ...injections)=>{
    const template2 = {
        templateArray,
        injections
    };
    const params = {
        skeleton: buildSkeleton(template2),
        template: template2
    };
    return {
        template: template2,
        integrals: buildIntegrals(params)
    };
};
const testCreateNode = ()=>{
    const assertions = [];
    const { template: template2 , integrals  } = testTextInterpolator2`<p>`;
    const results = buildRender({
        hooks,
        integrals,
        template: template2
    });
    if (results.siblings.length !== 1) {
        assertions.push("siblings should have length 1");
        return assertions;
    }
    const sibling = results.siblings[0][0];
    if (sibling.kind !== "ELEMENT") {
        assertions.push("sibling should be an ELEMENT");
        return assertions;
    }
    if (sibling.tagname !== "p") {
        assertions.push("sibling tagname should be p");
    }
    return assertions;
};
const testCloseNode = ()=>{
    const assertions = [];
    const { template: template2 , integrals  } = testTextInterpolator2`<p></p>`;
    const results = buildRender({
        hooks,
        integrals,
        template: template2
    });
    if (results.siblings.length !== 1) {
        assertions.push("siblings should have length 1");
        return assertions;
    }
    const sibling = results.siblings[0][0];
    if (sibling.kind !== "ELEMENT") {
        assertions.push("sibling should be an ELEMENT");
        return assertions;
    }
    if (sibling.tagname !== "p") {
        assertions.push("sibling tagname should be p");
    }
    return assertions;
};
const testTextNode = ()=>{
    const assertions = [];
    const { template: template2 , integrals ,  } = testTextInterpolator2`hello world!<p>It's me!</p>`;
    const results = buildRender({
        hooks,
        integrals,
        template: template2
    });
    if (results.siblings.length !== 2) {
        assertions.push("siblings should have length 1");
        return assertions;
    }
    const hopefulText = results.siblings[0][0];
    const hopefulElement = results.siblings[1][0];
    if (Array.isArray(hopefulText)) {
        assertions.push("sibling should not be an array");
        return assertions;
    }
    if (hopefulText.kind !== "TEXT") {
        assertions.push("sibling should be an TEXT");
    }
    if (hopefulText.kind === "TEXT" && hopefulText.text !== "hello world!") {
        assertions.push("sibling tagname should be p");
    }
    if (Array.isArray(hopefulElement)) {
        assertions.push("sibling should not be an array");
        return assertions;
    }
    if (hopefulElement.kind !== "ELEMENT") {
        assertions.push("sibling should be an ELEMENT");
    }
    if (hopefulElement.kind === "ELEMENT" && hopefulElement.tagname !== "p") {
        assertions.push("sibling tagname should be p");
    }
    return assertions;
};
const testAddAttributesToNodes = ()=>{
    const assertions = [];
    const { template: template2 , integrals  } = testTextInterpolator2`\n    <p\n      checked\n      label=""\n      disabled="false"\n      skies="${"blue"}">\n        Hello world, it's me!\n    </p>`;
    const results = buildRender({
        hooks,
        integrals,
        template: template2
    });
    if (results.siblings.length !== 2) {
        assertions.push("siblings should have length 2");
        return assertions;
    }
    const sibling = results.siblings[1][0];
    if (sibling.kind !== "ELEMENT") {
        assertions.push("sibling should be an ELEMENT");
        return assertions;
    }
    if (sibling.tagname !== "p") {
        assertions.push("sibling tagname should be p");
    }
    if (sibling.attributes["checked"] !== true) {
        assertions.push("sibling should be checked");
    }
    if (sibling.attributes["disabled"] !== "false") {
        assertions.push("sibling should be disabled");
    }
    if (sibling.attributes["label"] !== "") {
        assertions.push("label should be empty string");
    }
    if (sibling.attributes["skies"] !== "blue") {
        assertions.push("sibling skies should be blue");
    }
    return assertions;
};
const testAddAttributesToMultipleNodes = ()=>{
    const assertions = [];
    const { template: template2 , integrals  } = testTextInterpolator2`\n    <p>No properties in this paragraph!</p>\n    <p\n      checked\n      disabled="false"\n      skies="${"blue"}">\n        Hello world, it's me!\n    </p>`;
    const results = buildRender({
        hooks,
        integrals,
        template: template2
    });
    if (results.siblings.length !== 4) {
        assertions.push("siblings should have length 4");
        return assertions;
    }
    const firstParagraph = results.siblings[1][0];
    if (firstParagraph.kind !== "ELEMENT") {
        assertions.push("sibling should be an ELEMENT");
    }
    if (firstParagraph.kind === "ELEMENT" && firstParagraph.tagname !== "p") {
        assertions.push("sibling tagname should be p");
    }
    const secondParagraph = results.siblings[3][0];
    if (Array.isArray(secondParagraph)) {
        assertions.push("sibling should not be an array");
        return assertions;
    }
    if (secondParagraph.kind !== "ELEMENT") {
        assertions.push("sibling should be an ELEMENT");
        return assertions;
    }
    if (secondParagraph.tagname !== "p") {
        assertions.push("sibling tagname should be p");
    }
    if (secondParagraph.attributes["checked"] !== true) {
        assertions.push("sibling should be checked");
    }
    if (secondParagraph.attributes["disabled"] !== "false") {
        assertions.push("sibling should be disabled");
    }
    return assertions;
};
const testAddContext = ()=>{
    const assertions = [];
    const chunker = {
        update: ({ params , state  })=>{
            return draw`\n        <p>HelloWorld!</p>\n      `;
        },
        connect: ()=>{
        },
        disconnect: ()=>{
        }
    };
    const context = new Chunk({
        params: {
        },
        hooks,
        chunker
    });
    const { integrals: contextIntegrals , template: contextTemplate ,  } = testTextInterpolator2`\n    <p>${[
        context
    ]}</p>\n  `;
    const results = buildRender({
        hooks,
        integrals: contextIntegrals,
        template: contextTemplate
    });
    if (results.siblings.length !== 3) {
        assertions.push("siblings should have length 3");
        return assertions;
    }
    const textNode = results.siblings[0][0];
    if (Array.isArray(textNode)) {
        assertions.push("sibling should not be an array");
        return assertions;
    }
    if (textNode.kind !== "TEXT") {
        assertions.push("sibling 0 should have a text");
        return assertions;
    }
    if (results.descendants[0]?.kind !== "CHUNK_ARRAY") {
        assertions.push("descendant 0 should be a context array");
        return assertions;
    }
    const paragraph = results.siblings[1][0];
    if (Array.isArray(paragraph)) {
        assertions.push("sibling should not be an array");
        return assertions;
    }
    if (paragraph.kind !== "ELEMENT") {
        assertions.push("second sibling should be an ELEMENT");
        return assertions;
    }
    return assertions;
};
const tests2 = [
    testCreateNode,
    testCloseNode,
    testTextNode,
    testAddAttributesToNodes,
    testAddAttributesToMultipleNodes,
    testAddContext, 
];
const unitTestBuildRender = {
    title: title2,
    tests: tests2,
    runTestsAsynchronously: true
};
const title3 = "build_skeleton";
const testTextInterpolator3 = (templateArray, ...injections)=>{
    return {
        templateArray,
        injections
    };
};
const findNothingWhenThereIsPlainText = ()=>{
    const assertions = [];
    const sourceSkeleton = [
        {
            nodeType: "CONTENT_NODE",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 20
                }
            }
        }, 
    ];
    const testBlank = testTextInterpolator3`no nodes to be found!`;
    const testSkeleton = buildSkeleton(testBlank);
    if (!samestuff(sourceSkeleton, testSkeleton)) {
        assertions.push("skeletons are not equal");
    }
    return assertions;
};
const findStatementInPlainText = ()=>{
    const assertions = [];
    const sourceSkeleton = [
        {
            nodeType: "OPEN_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 6
                }
            }
        }, 
    ];
    const testOpenNode = testTextInterpolator3`<hello>`;
    const testSkeleton = buildSkeleton(testOpenNode);
    if (!samestuff(sourceSkeleton, testSkeleton)) {
        assertions.push("skeletons are not equal");
    }
    return assertions;
};
const findComplexFromPlainText = ()=>{
    const assertions = [];
    const sourceSkeleton = [
        {
            nodeType: "CONTENT_NODE",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 4
                }
            }
        },
        {
            nodeType: "OPEN_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 5
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 7
                }
            }
        },
        {
            nodeType: "CONTENT_NODE",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 8
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 12
                }
            }
        },
        {
            nodeType: "CLOSE_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 13
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 16
                }
            }
        }, 
    ];
    const testComplexNode = testTextInterpolator3`hello<p>world</p>`;
    const testSkeleton = buildSkeleton(testComplexNode);
    if (!samestuff(sourceSkeleton, testSkeleton)) {
        assertions.push("skeletons are not equal");
    }
    return assertions;
};
const findCompoundFromPlainText = ()=>{
    const assertions = [];
    const sourceSkeleton = [
        {
            nodeType: "OPEN_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 3
                }
            }
        },
        {
            nodeType: "CONTENT_NODE",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 4
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 8
                }
            }
        },
        {
            nodeType: "CLOSE_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 9
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 13
                }
            }
        }, 
    ];
    const testComplexNode = testTextInterpolator3`<h1>hello</h1>`;
    const testSkeleton = buildSkeleton(testComplexNode);
    if (!samestuff(sourceSkeleton, testSkeleton)) {
        assertions.push("skeletons are not equal");
    }
    return assertions;
};
const findInjectionFromPlainText = ()=>{
    const assertions = [];
    const sourceSkeleton = [
        {
            nodeType: "OPEN_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 3
                }
            }
        },
        {
            nodeType: "CLOSE_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 4
                }
            }
        }, 
    ];
    const testComplexNode = testTextInterpolator3`<h1>${"hello"}</h1>`;
    const testSkeleton = buildSkeleton(testComplexNode);
    if (!samestuff(sourceSkeleton, testSkeleton)) {
        assertions.push("skeletons are not equal");
    }
    return assertions;
};
const findPreceedingInjectionFromPlainText = ()=>{
    const assertions = [];
    const sourceSkeleton = [
        {
            nodeType: "OPEN_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 3
                }
            }
        },
        {
            nodeType: "CLOSE_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 2,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 2,
                    stringIndex: 4
                }
            }
        }, 
    ];
    const testComplexNode = testTextInterpolator3`${"hello"}<h1>${"hello"}</h1>`;
    const testSkeleton = buildSkeleton(testComplexNode);
    if (!samestuff(sourceSkeleton, testSkeleton)) {
        assertions.push("skeletons are not equal");
    }
    return assertions;
};
const findTrailingInjectionFromPlainText = ()=>{
    const assertions = [];
    const sourceSkeleton = [
        {
            nodeType: "OPEN_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 3
                }
            }
        },
        {
            nodeType: "CLOSE_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 4
                }
            }
        },
        {
            nodeType: "CONTENT_NODE",
            vector: {
                origin: {
                    arrayIndex: 2,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 2,
                    stringIndex: 0
                }
            }
        }, 
    ];
    const testComplexNode = testTextInterpolator3`<h1>${"hello"}</h1>${"hello"}`;
    const testSkeleton = buildSkeleton(testComplexNode);
    if (!samestuff(sourceSkeleton, testSkeleton)) {
        assertions.push("skeletons are not equal");
    }
    return assertions;
};
const findMultipleInjectionFromPlainText = ()=>{
    const assertions = [];
    const sourceSkeleton = [
        {
            nodeType: "OPEN_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 3
                }
            }
        },
        {
            nodeType: "CLOSE_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 2,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 2,
                    stringIndex: 4
                }
            }
        },
        {
            nodeType: "CONTENT_NODE",
            vector: {
                origin: {
                    arrayIndex: 3,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 3,
                    stringIndex: 0
                }
            }
        }, 
    ];
    const testComplexNode = testTextInterpolator3`${"hello"}<h1>${"hello"}</h1>${"hello"}`;
    const testSkeleton = buildSkeleton(testComplexNode);
    if (!samestuff(sourceSkeleton, testSkeleton)) {
        assertions.push("skeletons are not equal");
    }
    return assertions;
};
const findBrokenFromPlainText = ()=>{
    const assertions = [];
    const sourceSkeleton = [
        {
            nodeType: "CONTENT_NODE",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 5
                }
            }
        },
        {
            nodeType: "CLOSE_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 6
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 10
                }
            }
        },
        {
            nodeType: "OPEN_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 11
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 13
                }
            }
        },
        {
            nodeType: "CONTENT_NODE",
            vector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 14
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 18
                }
            }
        },
        {
            nodeType: "CLOSE_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 19
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 22
                }
            }
        }, 
    ];
    const testComplexNode = testTextInterpolator3`<${"hello"}h2>hey</h2><p>howdy</p>`;
    const testSkeleton = buildSkeleton(testComplexNode);
    if (!samestuff(sourceSkeleton, testSkeleton)) {
        assertions.push("skeletons are not equal");
    }
    return assertions;
};
const findSelfClosingNodesInOddPlainText = ()=>{
    const assertions = [];
    const sourceSkeleton = [
        {
            nodeType: "CONTENT_NODE",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 4
                }
            }
        },
        {
            nodeType: "SELF_CLOSING_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 5
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 10
                }
            }
        },
        {
            nodeType: "SELF_CLOSING_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 11
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 18
                }
            }
        },
        {
            nodeType: "CONTENT_NODE",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 19
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 23
                }
            }
        },
        {
            nodeType: "SELF_CLOSING_NODE_CONFIRMED",
            vector: {
                origin: {
                    arrayIndex: 0,
                    stringIndex: 24
                },
                target: {
                    arrayIndex: 0,
                    stringIndex: 33
                }
            }
        },
        {
            nodeType: "CONTENT_NODE",
            vector: {
                origin: {
                    arrayIndex: 1,
                    stringIndex: 0
                },
                target: {
                    arrayIndex: 1,
                    stringIndex: 11
                }
            }
        }, 
    ];
    const testComplexNode = testTextInterpolator3`\n    <dog/><doggo/>\n    <puppers/>${"woof"}\n    woof\n  `;
    const testSkeleton = buildSkeleton(testComplexNode);
    if (!samestuff(sourceSkeleton, testSkeleton)) {
        assertions.push("skeletons are not equal");
    }
    return assertions;
};
const tests3 = [
    findInjectionFromPlainText,
    findNothingWhenThereIsPlainText,
    findStatementInPlainText,
    findComplexFromPlainText,
    findCompoundFromPlainText,
    findBrokenFromPlainText,
    findPreceedingInjectionFromPlainText,
    findTrailingInjectionFromPlainText,
    findMultipleInjectionFromPlainText,
    findSelfClosingNodesInOddPlainText, 
];
const unitTestBuildSkeleton = {
    title: title3,
    tests: tests3,
    runTestsAsynchronously: true
};
const title4 = "context";
const numberChunker = {
    update: ({ params  })=>{
        return draw`${params}`;
    },
    connect: ()=>{
    },
    disconnect: ()=>{
    }
};
const createSimpleContext = ()=>{
    const assertions = [];
    const params = 5;
    const context = new Chunk({
        hooks,
        params: 5,
        chunker: numberChunker
    });
    const siblings = context.getSiblings();
    if (siblings.length !== 3) {
        assertions.push("context should have 2 siblings");
    }
    const textNode = siblings[1];
    if (textNode === undefined) {
        assertions.push("right sentinel should not be undefined");
        return assertions;
    }
    if (textNode.kind !== "TEXT") {
        assertions.push("node after left sentinel should be a TEXT");
    }
    if (textNode.kind === "TEXT" && textNode.text !== "5") {
        assertions.push("node after left setinel should have text as 5");
    }
    return assertions;
};
const mountAndUnmountSimpleComponent = ()=>{
    const assertions = [];
    const params = 5;
    const context = new Chunk({
        hooks,
        params: 5,
        chunker: numberChunker
    });
    const parentNode = hooks.createNode("div");
    let siblings = context.getSiblings();
    context.mount(parentNode);
    if (siblings.length !== 3) {
        assertions.push("context should have 2 siblings");
    }
    const textNode = siblings[1];
    if (textNode === undefined) {
        assertions.push("right sentinel should not be undefined");
        return assertions;
    }
    if (textNode.parent !== parentNode) {
        assertions.push("parent node should be 'div' instance");
    }
    if (textNode.kind !== "TEXT") {
        assertions.push("node after left sentinel should be a TEXT");
    }
    if (textNode.kind === "TEXT" && textNode.text !== "5") {
        assertions.push("node after left setinel should have text as 5");
    }
    context.unmount();
    siblings = context.getSiblings();
    for(const siblingID in siblings){
        const descendant = siblings[siblingID];
        if (descendant.parent !== undefined) {
            assertions.push("siblings should not have a parent");
        }
        if (descendant.left !== undefined) {
            assertions.push("siblings should not have a left sibling");
        }
        if (descendant.right !== undefined) {
            assertions.push("siblings should not have a left sibling");
        }
    }
    return assertions;
};
const updateContextSimpleContext = ()=>{
    const assertions = [];
    const params = 5;
    const context = new Chunk({
        hooks,
        params: 5,
        chunker: numberChunker
    });
    const parentNode = hooks.createNode("div");
    context.mount(parentNode);
    let siblings = context.getSiblings();
    if (siblings.length !== 3) {
        assertions.push("context should have 2 siblings");
    }
    let textNode = siblings[1];
    if (textNode === undefined) {
        assertions.push("right sentinel should not be undefined");
        return assertions;
    }
    if (textNode.parent !== parentNode) {
        assertions.push("parent node should be 'div' instance");
    }
    if (textNode.kind !== "TEXT") {
        assertions.push("node after left sentinel should be a TEXT");
    }
    if (textNode.kind === "TEXT" && textNode.text !== "5") {
        assertions.push("node after left setinel should have text as 5");
    }
    context.update(6);
    siblings = context.getSiblings();
    textNode = siblings[1];
    if (textNode.kind === "TEXT" && textNode.text !== "6") {
        assertions.push("node after left setinel should have text as 5");
    }
    for(const siblingID in siblings){
        const descendant = siblings[siblingID];
        if (descendant.parent !== parentNode) {
            assertions.push("siblings should have parent node instance");
        }
    }
    return assertions;
};
const createAndUpdateDescendantContextArray = ()=>{
    const assertions = [];
    const params = 5;
    const numberContext = new Chunk({
        hooks,
        params: 5,
        chunker: numberChunker
    });
    const parentChunker = {
        update: ({ params: params1 , state  })=>{
            numberContext.update(params1);
            return draw`<p>${[
                numberContext
            ]}</p>`;
        },
        connect: ()=>{
        },
        disconnect: ()=>{
        }
    };
    const parentContext = new Chunk({
        hooks,
        params: 5,
        chunker: parentChunker
    });
    let siblings = parentContext.getSiblings();
    if (siblings.length !== 1) {
        assertions.push("context should have 1 siblings");
    }
    const textNode = siblings[0];
    if (textNode === undefined) {
        assertions.push("descendant textNode should exist");
        return assertions;
    }
    if (textNode.kind !== "ELEMENT") {
        assertions.push("node after left sentinel should be an ELEMENT");
    }
    if (textNode.kind === "ELEMENT" && textNode.tagname !== "p") {
        assertions.push("node after left setinel should have text as 5");
    }
    parentContext.update(6);
    if (siblings[0].kind !== "ELEMENT") {
        assertions.push("updated parent siblings should be an ELEMENT");
        return assertions;
    }
    const updatedTextNode = siblings[0]?.leftChild?.right;
    siblings = parentContext.getSiblings();
    if (updatedTextNode === undefined) {
        assertions.push("updated descendant updatedTextNode should exist");
        return assertions;
    }
    if (updatedTextNode.kind !== "TEXT") {
        assertions.push("node after left sentinel should be a TEXT");
    }
    if (updatedTextNode.kind === "TEXT" && updatedTextNode.text !== "6") {
        assertions.push("node after left setinel should have text as '6'");
    }
    return assertions;
};
const createAndUpdateDescendantSiblingContextArray = ()=>{
    const assertions = [];
    const params = 5;
    const numberContext = new Chunk({
        hooks,
        params: 5,
        chunker: numberChunker
    });
    const parentChunker = {
        update: ({ params: params1 , state  })=>{
            numberContext.update(params1);
            return draw`${[
                numberContext
            ]}`;
        },
        connect: ()=>{
        },
        disconnect: ()=>{
        }
    };
    const parentContext = new Chunk({
        hooks,
        params: 5,
        chunker: parentChunker
    });
    const siblings = parentContext.getSiblings();
    if (siblings.length !== 5) {
        assertions.push("context should have 5 siblings");
    }
    parentContext.update(6);
    const numberSiblings = numberContext.getSiblings();
    if (numberSiblings.length !== 3) {
        assertions.push("context should have 5 siblings");
    }
    const updatedTextNode = numberSiblings[1];
    if (updatedTextNode === undefined) {
        assertions.push("updated descendant updatedTextNode should exist");
        return assertions;
    }
    if (updatedTextNode.kind !== "TEXT") {
        assertions.push("node after left sentinel should be a TEXT");
    }
    if (updatedTextNode.kind === "TEXT" && updatedTextNode.text !== "6") {
        assertions.push("node after left setinel should have text as '6'");
    }
    return assertions;
};
const createAndUpdateMultipleDescendants = ()=>{
    const assertions = [];
    const params = 5;
    const numberContext = new Chunk({
        hooks,
        params: 5,
        chunker: numberChunker
    });
    const otherNumberContext = new Chunk({
        hooks,
        params: 5,
        chunker: numberChunker
    });
    const parentChunker = {
        update: ({ params: params1  })=>{
            numberContext.update(params1);
            return draw`${[
                numberContext,
                otherNumberContext
            ]}`;
        },
        connect: ()=>{
        },
        disconnect: ()=>{
        }
    };
    const parentContext = new Chunk({
        hooks,
        params: 5,
        chunker: parentChunker
    });
    const siblings = parentContext.getSiblings();
    if (siblings.length !== 8) {
        assertions.push("context should have 8 siblings");
    }
    parentContext.update(6);
    const numberSiblings = numberContext.getSiblings();
    const otherSiblings = otherNumberContext.getSiblings();
    if (siblings.length !== 8) {
        assertions.push("context should have 8 siblings");
    }
    const updatedTextNode = numberSiblings[1];
    const updatedOtherTextNode = otherSiblings[1];
    if (updatedTextNode === undefined) {
        assertions.push("updated descendant updatedTextNode should exist");
        return assertions;
    }
    if (updatedTextNode.kind !== "TEXT") {
        assertions.push("node after left sentinel should be a TEXT");
    }
    if (updatedTextNode.kind === "TEXT" && updatedTextNode.text !== "6") {
        assertions.push("node after left setinel should have text as '6'");
    }
    if (updatedOtherTextNode.kind !== "TEXT") {
        assertions.push("node after left sentinel should be a TEXT");
    }
    if (updatedOtherTextNode.kind === "TEXT" && updatedOtherTextNode.text !== "5") {
        assertions.push("node after left setinel should have text as '5'");
    }
    return assertions;
};
const tests4 = [
    createSimpleContext,
    mountAndUnmountSimpleComponent,
    updateContextSimpleContext,
    createAndUpdateDescendantContextArray,
    createAndUpdateDescendantSiblingContextArray,
    createAndUpdateMultipleDescendants, 
];
const unitTestContext = {
    title: title4,
    tests: tests4,
    runTestsAsynchronously: true
};
const testTextInterpolator4 = (templateArray, ...injections)=>{
    return {
        templateArray,
        injections
    };
};
const title5 = "skeleton crawl";
const findNothingWhenThereIsPlainText1 = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "CONTENT_NODE",
        vector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 0,
                stringIndex: 20
            }
        }
    };
    const testBlank = testTextInterpolator4`no nodes to be found!`;
    const results = crawl(testBlank);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const findParagraphInPlainText = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "OPEN_NODE_CONFIRMED",
        vector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 0,
                stringIndex: 2
            }
        }
    };
    const testOpenNode = testTextInterpolator4`<p>`;
    const results = crawl(testOpenNode);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const findImageInPlainText = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "OPEN_NODE_CONFIRMED",
        vector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 0,
                stringIndex: 6
            }
        }
    };
    const testOpenNode = testTextInterpolator4`<image>`;
    const results = crawl(testOpenNode);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const findCloseParagraphInPlainText = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "CLOSE_NODE_CONFIRMED",
        vector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 0,
                stringIndex: 3
            }
        }
    };
    const testTextCloseNode = testTextInterpolator4`</p>`;
    const results = crawl(testTextCloseNode);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const findIndependentParagraphInPlainText = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "SELF_CLOSING_NODE_CONFIRMED",
        vector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 0,
                stringIndex: 3
            }
        }
    };
    const testTextIndependentNode = testTextInterpolator4`<p/>`;
    const results = crawl(testTextIndependentNode);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const findOpenParagraphInTextWithArgs = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "OPEN_NODE_CONFIRMED",
        vector: {
            origin: {
                arrayIndex: 1,
                stringIndex: 1
            },
            target: {
                arrayIndex: 1,
                stringIndex: 8
            }
        }
    };
    const testTextWithArgs = testTextInterpolator4`an ${"example"} <buster>${"!"}</buster>`;
    const results = crawl(testTextWithArgs);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const notFoundInUgglyMessText = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "CONTENT_NODE",
        vector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 2,
                stringIndex: 0
            }
        }
    };
    const testInvalidUgglyMess = testTextInterpolator4`an <${"invalid"}p> example${"!"}`;
    const results = crawl(testInvalidUgglyMess);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const notFoundInReallyUgglyMessText = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "CONTENT_NODE",
        vector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 2,
                stringIndex: 0
            }
        }
    };
    const testInvalidUgglyMess = testTextInterpolator4`an example${"!"}${"?"}`;
    const results = crawl(testInvalidUgglyMess);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const invalidCloseNodeWithArgs = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "CONTENT_NODE",
        vector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 1,
                stringIndex: 1
            }
        }
    };
    const testInvlaidCloseNodeWithArgs = testTextInterpolator4`closed </${"example"}p>`;
    const results = crawl(testInvlaidCloseNodeWithArgs);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const validCloseNodeWithArgs = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "CLOSE_NODE_CONFIRMED",
        vector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 7
            },
            target: {
                arrayIndex: 1,
                stringIndex: 0
            }
        }
    };
    const testValidCloseNodeWithArgs = testTextInterpolator4`closed </p ${"example"}>`;
    const results = crawl(testValidCloseNodeWithArgs);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const invalidIndependentNodeWithArgs = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "CONTENT_NODE",
        vector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 1,
                stringIndex: 2
            }
        }
    };
    const testInvalidIndependentNode = testTextInterpolator4`independent <${"example"}p/>`;
    const results = crawl(testInvalidIndependentNode);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const validIndependentNodeWithArgs = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "SELF_CLOSING_NODE_CONFIRMED",
        vector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 12
            },
            target: {
                arrayIndex: 1,
                stringIndex: 3
            }
        }
    };
    const testValidIndependentNode = testTextInterpolator4`independent <p ${"example"} / >`;
    const results = crawl(testValidIndependentNode);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const invalidOpenNodeWithArgs = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "CONTENT_NODE",
        vector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 0
            },
            target: {
                arrayIndex: 1,
                stringIndex: 1
            }
        }
    };
    const testInvalidOpenNode = testTextInterpolator4`open <${"example"}p>`;
    const results = crawl(testInvalidOpenNode);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const validOpenNodeWithArgs = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "OPEN_NODE_CONFIRMED",
        vector: {
            origin: {
                arrayIndex: 0,
                stringIndex: 5
            },
            target: {
                arrayIndex: 1,
                stringIndex: 0
            }
        }
    };
    const testValidOpenNode = testTextInterpolator4`open <p ${"example"}>`;
    const results = crawl(testValidOpenNode);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const findNextCrawlWithPreviousCrawl = ()=>{
    const assertions = [];
    const expectedResults = {
        nodeType: "SELF_CLOSING_NODE_CONFIRMED",
        vector: {
            origin: {
                arrayIndex: 2,
                stringIndex: 0
            },
            target: {
                arrayIndex: 2,
                stringIndex: 3
            }
        }
    };
    const testValidOpenNode = testTextInterpolator4`<p ${"small"}/>${"example"}<p/>`;
    const previousCrawl = crawl(testValidOpenNode);
    const results = crawl(testValidOpenNode, previousCrawl);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const tests5 = [
    findNothingWhenThereIsPlainText1,
    findParagraphInPlainText,
    findImageInPlainText,
    findCloseParagraphInPlainText,
    findIndependentParagraphInPlainText,
    findOpenParagraphInTextWithArgs,
    notFoundInUgglyMessText,
    notFoundInReallyUgglyMessText,
    invalidCloseNodeWithArgs,
    validCloseNodeWithArgs,
    invalidIndependentNodeWithArgs,
    validIndependentNodeWithArgs,
    invalidOpenNodeWithArgs,
    validOpenNodeWithArgs,
    findNextCrawlWithPreviousCrawl, 
];
const unitTestSkeletonCrawl = {
    title: title5,
    tests: tests5,
    runTestsAsynchronously: true
};
const title6 = "skeleton routers";
const notFoundReducesCorrectState = ()=>{
    const assertions = [];
    if (routers["CONTENT_NODE"]?.["<"] !== "OPEN_NODE") {
        assertions.push("< should return OPEN_NODE");
    }
    if (routers["CONTENT_NODE"]?.["DEFAULT"] !== "CONTENT_NODE") {
        assertions.push("space should return CONTENT_NODE");
    }
    return assertions;
};
const openNodeReducesCorrectState = ()=>{
    const assertions = [];
    if (routers["OPEN_NODE"]?.["<"] !== "OPEN_NODE") {
        assertions.push("< should return OPEN_NODE");
    }
    if (routers["OPEN_NODE"]?.["/"] !== "CLOSE_NODE") {
        assertions.push("/ should return CLOSE_NODE");
    }
    if (routers["OPEN_NODE"]?.[" "] !== "CONTENT_NODE") {
        assertions.push("space should return CONTENT_NODE");
    }
    if (routers["OPEN_NODE"]?.["DEFAULT"] !== "OPEN_NODE_VALID") {
        assertions.push("space should return OPEN_NODE_VALID");
    }
    return assertions;
};
const openNodeValidReducesCorrectState = ()=>{
    const assertions = [];
    if (routers["OPEN_NODE_VALID"]?.["<"] !== "OPEN_NODE") {
        assertions.push("< should return OPEN_NODE");
    }
    if (routers["OPEN_NODE_VALID"]?.["/"] !== "SELF_CLOSING_NODE_VALID") {
        assertions.push("/ should return SELF_CLOSING_NODE_VALID");
    }
    if (routers["OPEN_NODE_VALID"]?.[">"] !== "OPEN_NODE_CONFIRMED") {
        assertions.push("> should return OPEN_NODE_CONFIRMED");
    }
    if (routers["OPEN_NODE_VALID"]?.["DEFAULT"] !== "OPEN_NODE_VALID") {
        assertions.push("space should return OPEN_NODE_VALID");
    }
    return assertions;
};
const independentNodeValidReducesCorrectState = ()=>{
    const assertions = [];
    if (routers["SELF_CLOSING_NODE_VALID"]?.["<"] !== "OPEN_NODE") {
        assertions.push("< should return OPEN_NODE");
    }
    if (routers["SELF_CLOSING_NODE_VALID"]?.["DEFAULT"] !== "SELF_CLOSING_NODE_VALID") {
        assertions.push("space should return SELF_CLOSING_NODE_VALID");
    }
    return assertions;
};
const closeNodeReducesCorrectState = ()=>{
    const assertions = [];
    if (routers["CLOSE_NODE"]?.["<"] !== "OPEN_NODE") {
        assertions.push("< should return OPEN_NODE");
    }
    if (routers["CLOSE_NODE"]?.["DEFAULT"] !== "CLOSE_NODE_VALID") {
        assertions.push("space should return CLOSE_NODE_VALID");
    }
    if (routers["CLOSE_NODE"]?.[" "] !== "CONTENT_NODE") {
        assertions.push("space should return CONTENT_NODE");
    }
    return assertions;
};
const closeNodeValidReducesCorrectState = ()=>{
    const assertions = [];
    if (routers["CLOSE_NODE_VALID"]?.["<"] !== "OPEN_NODE") {
        assertions.push("< should return OPEN_NODE");
    }
    if (routers["CLOSE_NODE_VALID"]?.[">"] !== "CLOSE_NODE_CONFIRMED") {
        assertions.push("> should return CLOSE_NODE_CONFIRMED");
    }
    if (routers["CLOSE_NODE_VALID"]?.["DEFAULT"] !== "CLOSE_NODE_VALID") {
        assertions.push("space should return CLOSE_NODE_VALID");
    }
    return assertions;
};
const tests6 = [
    notFoundReducesCorrectState,
    openNodeReducesCorrectState,
    openNodeValidReducesCorrectState,
    independentNodeValidReducesCorrectState,
    closeNodeReducesCorrectState,
    closeNodeValidReducesCorrectState, 
];
const unitTestSkeletonRouters = {
    title: title6,
    tests: tests6,
    runTestsAsynchronously: true
};
const testTextInterpolator5 = (templateArray, ...injections)=>{
    return {
        templateArray,
        injections
    };
};
const title7 = "tag_name_crawl";
const testEmptyString = ()=>{
    const assertions = [];
    const template2 = testTextInterpolator5``;
    const vector = create1();
    const results = crawlForTagName(template2, vector);
    if (results !== undefined) {
        assertions.push("this should have failed");
    }
    return assertions;
};
const testEmptySpaceString = ()=>{
    const assertions = [];
    const template2 = testTextInterpolator5` `;
    const vector = create1();
    const results = crawlForTagName(template2, vector);
    if (results !== undefined) {
        assertions.push("this should have failed");
    }
    return assertions;
};
const testSingleCharacterString = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            arrayIndex: 0,
            stringIndex: 0
        },
        target: {
            arrayIndex: 0,
            stringIndex: 0
        }
    };
    const template2 = testTextInterpolator5`a`;
    const vector = create1();
    const results = crawlForTagName(template2, vector);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected tag name results happen.");
    }
    return assertions;
};
const testCharaceterString = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            arrayIndex: 0,
            stringIndex: 0
        },
        target: {
            arrayIndex: 0,
            stringIndex: 0
        }
    };
    const template2 = testTextInterpolator5`a `;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template2, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForTagName(template2, vector);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected tag name results happen.");
    }
    return assertions;
};
const testMultiCharaceterString = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            arrayIndex: 0,
            stringIndex: 0
        },
        target: {
            arrayIndex: 0,
            stringIndex: 2
        }
    };
    const template2 = testTextInterpolator5`aaa `;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template2, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForTagName(template2, vector);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected tag name results happen.");
    }
    return assertions;
};
const testMultiCharaceterStringWithTrailingSpaces = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            arrayIndex: 0,
            stringIndex: 0
        },
        target: {
            arrayIndex: 0,
            stringIndex: 2
        }
    };
    const template2 = testTextInterpolator5`aaa     `;
    const vector = create1();
    let safety = 0;
    while(incrementTarget(template2, vector) && safety < 256){
        safety += 1;
    }
    const results = crawlForTagName(template2, vector);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected tag name results happen.");
    }
    return assertions;
};
const tests7 = [
    testEmptyString,
    testEmptySpaceString,
    testSingleCharacterString,
    testCharaceterString,
    testMultiCharaceterString,
    testMultiCharaceterStringWithTrailingSpaces, 
];
const unitTestTagNameCrawl = {
    title: title7,
    tests: tests7,
    runTestsAsynchronously: true
};
const title8 = "test_hooks";
const testCreateNode1 = ()=>{
    const assertions = [];
    const node = hooks.createNode("hello");
    if (node === undefined) {
        assertions.push("node should not be undefined.");
    }
    if (node.kind !== "ELEMENT") {
        assertions.push("should create an ELEMENT");
    }
    if (node.kind === "ELEMENT" && node.tagname !== "hello") {
        assertions.push("tagname should be 'hello'");
    }
    return assertions;
};
const testCreateTextNode = ()=>{
    const assertions = [];
    const node = hooks.createTextNode("hello!");
    if (node === undefined) {
        assertions.push("text node should not be undefined.");
    }
    if (node.kind === "TEXT" && node.text !== "hello!") {
        assertions.push("text node should have 'hello!'");
    }
    return assertions;
};
const testSetAttribute = ()=>{
    const assertions = [];
    const node = hooks.createNode("basic");
    hooks.setAttribute({
        references: {
        },
        node,
        attribute: "checked",
        value: true
    });
    if (node.kind !== "ELEMENT") {
        assertions.push("node should be an ELEMENT");
    }
    if (node.kind === "ELEMENT" && node.attributes["checked"] !== true) {
        assertions.push("checked should be true.");
    }
    return assertions;
};
const testInsertDescendant = ()=>{
    const assertions = [];
    const sunshine = hooks.createNode("sunshine");
    const moonbeam = hooks.createNode("moonbeam");
    const starlight = hooks.createNode("starlight");
    hooks.insertDescendant({
        parentNode: sunshine,
        descendant: starlight
    });
    hooks.insertDescendant({
        leftNode: starlight,
        parentNode: sunshine,
        descendant: moonbeam
    });
    if (starlight.kind === "ELEMENT" && starlight.left !== undefined) {
        assertions.push("starlight should have no left sibling");
    }
    if (starlight.kind === "ELEMENT" && starlight.right !== moonbeam) {
        assertions.push("starlight should have moonbeam as a sibling");
    }
    if (moonbeam.kind === "ELEMENT" && starlight.parent !== sunshine) {
        assertions.push("starlight should have sunshin as a parent");
    }
    if (moonbeam.kind === "ELEMENT" && moonbeam.left !== starlight) {
        assertions.push("moonbeam should have starlight for left sibling");
    }
    if (moonbeam.kind === "ELEMENT" && moonbeam.right !== undefined) {
        assertions.push("moonbeam should have no right sibling");
    }
    if (moonbeam.kind === "ELEMENT" && moonbeam.parent !== sunshine) {
        assertions.push("moonbean should have sunshin as a parent");
    }
    return assertions;
};
const testRemoveDescendant = ()=>{
    const assertions = [];
    const sunshine = hooks.createNode("sunshine");
    const moonbeam = hooks.createNode("moonbeam");
    const starlight = hooks.createNode("starlight");
    hooks.insertDescendant({
        parentNode: sunshine,
        descendant: starlight
    });
    hooks.insertDescendant({
        leftNode: starlight,
        parentNode: sunshine,
        descendant: moonbeam
    });
    hooks.removeDescendant(starlight);
    if (starlight.left !== undefined) {
        assertions.push("starlight should not have a left sibling.");
    }
    if (starlight.right !== undefined) {
        assertions.push("starlight should not have a right sibling.");
    }
    if (starlight.parent !== undefined) {
        assertions.push("starlight should not have a parent.");
    }
    if (moonbeam.left !== undefined) {
        assertions.push("moonbeam should not have a left sibling.");
    }
    if (moonbeam.right !== undefined) {
        assertions.push("moonbeam should not have a right sibling.");
    }
    if (moonbeam.parent !== sunshine) {
        assertions.push("moonbeam should have sunshine as a parent.");
    }
    if (sunshine.kind === "ELEMENT" && sunshine.leftChild !== moonbeam) {
        assertions.push("sunshine should have moonbeam as a left child.");
    }
    if (sunshine.kind === "ELEMENT" && sunshine.rightChild !== moonbeam) {
        assertions.push("sunshine should have moonbeam as a right child.");
    }
    return assertions;
};
const testRemoveAllDescendants = ()=>{
    const assertions = [];
    const sunshine = hooks.createNode("sunshine");
    const moonbeam = hooks.createNode("moonbeam");
    const starlight = hooks.createNode("starlight");
    hooks.insertDescendant({
        parentNode: sunshine,
        descendant: starlight
    });
    hooks.insertDescendant({
        leftNode: starlight,
        parentNode: sunshine,
        descendant: moonbeam
    });
    hooks.removeDescendant(starlight);
    hooks.removeDescendant(moonbeam);
    if (starlight.left !== undefined) {
        assertions.push("starlight should not have a left sibling.");
    }
    if (starlight.right !== undefined) {
        assertions.push("starlight should not have a right sibling.");
    }
    if (starlight.parent !== undefined) {
        assertions.push("starlight should not have a parent.");
    }
    if (moonbeam.left !== undefined) {
        assertions.push("moonbeam should not have a left sibling.");
    }
    if (moonbeam.right !== undefined) {
        assertions.push("moonbeam should not have a right sibling.");
    }
    if (moonbeam.parent !== undefined) {
        assertions.push("moonbeam should not have a parent.");
    }
    if (sunshine.kind === "ELEMENT" && sunshine.leftChild !== undefined) {
        assertions.push("sunshine should not have a left child.");
    }
    if (sunshine.kind === "ELEMENT" && sunshine.rightChild !== undefined) {
        assertions.push("sunshine should not have a right child.");
    }
    return assertions;
};
const tests8 = [
    testCreateNode1,
    testCreateTextNode,
    testSetAttribute,
    testInsertDescendant,
    testRemoveDescendant,
    testRemoveAllDescendants, 
];
const unitTestTestHooks = {
    title: title8,
    tests: tests8,
    runTestsAsynchronously: true
};
const testTextInterpolator6 = (templateArray, ...injections)=>{
    return {
        templateArray,
        injections
    };
};
const title9 = "text_position";
const createTextPosition = ()=>{
    const assertions = [];
    const expectedResults = {
        arrayIndex: 0,
        stringIndex: 0
    };
    const position = create();
    if (!samestuff(expectedResults, position)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const createTextPositionFromPosition = ()=>{
    const assertions = [];
    const expectedResults = {
        arrayIndex: 3,
        stringIndex: 4
    };
    const position = create(expectedResults);
    if (!samestuff(expectedResults, position)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const copyTextPosition = ()=>{
    const assertions = [];
    const expectedResults = {
        arrayIndex: 2,
        stringIndex: 3
    };
    const position = copy1(expectedResults);
    if (!samestuff(expectedResults, position)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const incrementTextPosition = ()=>{
    const assertions = [];
    const expectedResults = {
        arrayIndex: 0,
        stringIndex: 1
    };
    const structureRender = testTextInterpolator6`hello`;
    const position = create();
    increment(structureRender, position);
    if (!samestuff(expectedResults, position)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const incrementMultiTextPosition = ()=>{
    const assertions = [];
    const expectedResults = {
        arrayIndex: 1,
        stringIndex: 2
    };
    const structureRender = testTextInterpolator6`hey${"world"}, how are you?`;
    const position = create();
    increment(structureRender, position);
    increment(structureRender, position);
    increment(structureRender, position);
    increment(structureRender, position);
    increment(structureRender, position);
    if (!samestuff(expectedResults, position)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const incrementEmptyTextPosition = ()=>{
    const assertions = [];
    const expectedResults = {
        arrayIndex: 3,
        stringIndex: 0
    };
    const structureRender = testTextInterpolator6`${"hey"}${"world"}${"!!"}`;
    const position = create();
    increment(structureRender, position);
    increment(structureRender, position);
    increment(structureRender, position);
    if (increment(structureRender, position) !== undefined) {
        assertions.push("should not return after traversed");
    }
    if (!samestuff(expectedResults, position)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const incrementTextPositionTooFar = ()=>{
    const assertions = [];
    const expectedResults = {
        arrayIndex: 1,
        stringIndex: 13
    };
    const structureRender = testTextInterpolator6`hey${"world"}, how are you?`;
    const arrayLength = structureRender.templateArray.length - 1;
    const stringLength = structureRender.templateArray[arrayLength].length - 1;
    const position = copy1({
        arrayIndex: arrayLength,
        stringIndex: stringLength
    });
    const MAX_DEPTH = 20;
    let safety = 0;
    while(increment(structureRender, position) && safety < 20){
        safety += 1;
    }
    if (!samestuff(expectedResults, position)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const decrementTextPosition = ()=>{
    const assertions = [];
    const expectedResults = {
        arrayIndex: 0,
        stringIndex: 3
    };
    const structureRender = testTextInterpolator6`hello`;
    const arrayLength = structureRender.templateArray.length - 1;
    const stringLength = structureRender.templateArray[arrayLength].length - 1;
    const position = copy1({
        arrayIndex: arrayLength,
        stringIndex: stringLength
    });
    decrement(structureRender, position);
    if (!samestuff(expectedResults, position)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const decrementMultiTextPosition = ()=>{
    const assertions = [];
    const expectedResults = {
        arrayIndex: 0,
        stringIndex: 1
    };
    const structureRender = testTextInterpolator6`hey${"hello"}bro!`;
    const arrayLength = structureRender.templateArray.length - 1;
    const stringLength = structureRender.templateArray[arrayLength].length - 1;
    const position = copy1({
        arrayIndex: arrayLength,
        stringIndex: stringLength
    });
    decrement(structureRender, position);
    decrement(structureRender, position);
    decrement(structureRender, position);
    decrement(structureRender, position);
    decrement(structureRender, position);
    if (!samestuff(expectedResults, position)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const decrementEmptyTextPosition = ()=>{
    const assertions = [];
    const expectedResults = {
        arrayIndex: 0,
        stringIndex: 0
    };
    const structureRender = testTextInterpolator6`${"hey"}${"world"}${"!!"}`;
    const arrayLength = structureRender.templateArray.length - 1;
    const stringLength = structureRender.templateArray[arrayLength].length - 1;
    const position = copy1({
        arrayIndex: arrayLength,
        stringIndex: stringLength
    });
    decrement(structureRender, position);
    decrement(structureRender, position);
    decrement(structureRender, position);
    if (decrement(structureRender, position) !== undefined) {
        assertions.push("should not return after traversed");
    }
    if (!samestuff(expectedResults, position)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const decrementTextPositionTooFar = ()=>{
    const assertions = [];
    const expectedResults = {
        arrayIndex: 0,
        stringIndex: 0
    };
    const structureRender = testTextInterpolator6`hey${"world"}, how are you?`;
    const position = create();
    const MAX_DEPTH = 20;
    let safety = 0;
    while(decrement(structureRender, position) && safety < 20){
        safety += 1;
    }
    if (!samestuff(expectedResults, position)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const getCharFromTemplate = ()=>{
    const assertions = [];
    const structureRender = testTextInterpolator6`hello`;
    const position = {
        arrayIndex: 0,
        stringIndex: 2
    };
    const __char = getCharAtPosition(structureRender, position);
    if (__char !== "l") {
        assertions.push("textPosition target is not 'l'");
    }
    return assertions;
};
const tests9 = [
    createTextPosition,
    createTextPositionFromPosition,
    copyTextPosition,
    incrementTextPosition,
    incrementMultiTextPosition,
    incrementEmptyTextPosition,
    incrementTextPositionTooFar,
    decrementTextPosition,
    decrementMultiTextPosition,
    decrementEmptyTextPosition,
    decrementTextPositionTooFar,
    getCharFromTemplate, 
];
const unitTestTextPosition = {
    title: title9,
    tests: tests9,
    runTestsAsynchronously: true
};
const testTextInterpolator7 = (templateArray, ...injections)=>{
    return {
        templateArray,
        injections
    };
};
const title10 = "text_vector";
const createTextVector = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            arrayIndex: 0,
            stringIndex: 0
        },
        target: {
            arrayIndex: 0,
            stringIndex: 0
        }
    };
    const vector = create1();
    if (!samestuff(expectedResults, vector)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const createTextVectorFromPosition = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            arrayIndex: 4,
            stringIndex: 3
        },
        target: {
            arrayIndex: 4,
            stringIndex: 3
        }
    };
    const vector = create1({
        stringIndex: 3,
        arrayIndex: 4
    });
    if (!samestuff(expectedResults, vector)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const copyTextVector = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            arrayIndex: 0,
            stringIndex: 1
        },
        target: {
            arrayIndex: 2,
            stringIndex: 3
        }
    };
    const copiedVector = copy2(expectedResults);
    if (!samestuff(expectedResults, copiedVector)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const incrementTextVector = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            arrayIndex: 0,
            stringIndex: 0
        },
        target: {
            arrayIndex: 0,
            stringIndex: 1
        }
    };
    const structureRender = testTextInterpolator7`hello`;
    const vector = create1();
    incrementTarget(structureRender, vector);
    if (!samestuff(expectedResults, vector)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const incrementMultiTextVector = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            arrayIndex: 0,
            stringIndex: 0
        },
        target: {
            arrayIndex: 1,
            stringIndex: 2
        }
    };
    const structureRender = testTextInterpolator7`hey${"world"}, how are you?`;
    const vector = create1();
    incrementTarget(structureRender, vector);
    incrementTarget(structureRender, vector);
    incrementTarget(structureRender, vector);
    incrementTarget(structureRender, vector);
    incrementTarget(structureRender, vector);
    if (!samestuff(expectedResults, vector)) {
        assertions.push("unexpected results found.");
    }
    if (vector.target.stringIndex !== 2) {
        assertions.push("text vector string index does not match");
    }
    if (vector.target.arrayIndex !== 1) {
        assertions.push("text vector array index does not match");
    }
    return assertions;
};
const incrementEmptyTextVector = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            arrayIndex: 0,
            stringIndex: 0
        },
        target: {
            arrayIndex: 3,
            stringIndex: 0
        }
    };
    const structureRender = testTextInterpolator7`${"hey"}${"world"}${"!!"}`;
    const vector = create1();
    incrementTarget(structureRender, vector);
    incrementTarget(structureRender, vector);
    incrementTarget(structureRender, vector);
    if (incrementTarget(structureRender, vector) !== undefined) {
        assertions.push("should not return after traversed");
    }
    if (!samestuff(expectedResults, vector)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const createFollowingTextVector = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            arrayIndex: 0,
            stringIndex: 5
        },
        target: {
            arrayIndex: 0,
            stringIndex: 5
        }
    };
    const structureRender = testTextInterpolator7`supercool`;
    const vector = create1();
    incrementTarget(structureRender, vector);
    incrementTarget(structureRender, vector);
    incrementTarget(structureRender, vector);
    incrementTarget(structureRender, vector);
    const results = createFollowingVector(structureRender, vector);
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const incrementTextVectorTooFar = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            arrayIndex: 0,
            stringIndex: 0
        },
        target: {
            arrayIndex: 1,
            stringIndex: 13
        }
    };
    const structureRender = testTextInterpolator7`hey${"world"}, how are you?`;
    const results = create1();
    const MAX_DEPTH = 20;
    let safety = 0;
    while(incrementTarget(structureRender, results) && safety < 20){
        safety += 1;
    }
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const testHasOriginEclipsedTaraget = ()=>{
    const assertions = [];
    const vector = create1();
    const results = hasOriginEclipsedTaraget(vector);
    if (results !== true) {
        assertions.push("orign eclipsed target");
    }
    return assertions;
};
const testHasOriginNotEclipsedTaraget = ()=>{
    const assertions = [];
    const structureRender = testTextInterpolator7`hey${"world"}, how are you?`;
    const vector = create1();
    incrementTarget(structureRender, vector);
    incrementTarget(structureRender, vector);
    incrementTarget(structureRender, vector);
    incrementTarget(structureRender, vector);
    const results = hasOriginEclipsedTaraget(vector);
    if (results !== false) {
        assertions.push("orign has not eclipsed target");
    }
    return assertions;
};
const testGetTextReturnsActualText = ()=>{
    const expectedResult = "world";
    const assertions = [];
    const structureRender = testTextInterpolator7`hey world, how are you?`;
    const vector = {
        origin: {
            arrayIndex: 0,
            stringIndex: 4
        },
        target: {
            arrayIndex: 0,
            stringIndex: 8
        }
    };
    const results = getText(structureRender, vector);
    if (expectedResult !== results) {
        assertions.push("text should say 'world'");
    }
    return assertions;
};
const testGetTextOverTemplate = ()=>{
    const expectedResult = "how  you";
    const assertions = [];
    const structureRender = testTextInterpolator7`hey ${"world"}, how ${"are"} you?`;
    const vector = {
        origin: {
            arrayIndex: 1,
            stringIndex: 2
        },
        target: {
            arrayIndex: 2,
            stringIndex: 3
        }
    };
    const results = getText(structureRender, vector);
    if (expectedResult !== results) {
        assertions.push("text should say 'world'");
    }
    return assertions;
};
const testGetTextOverChonkyTemplate = ()=>{
    const expectedResult = "how  you  buster";
    const assertions = [];
    const structureRender = testTextInterpolator7`hey ${"world"}, how ${"are"} you ${"doing"} buster?`;
    const vector = {
        origin: {
            arrayIndex: 1,
            stringIndex: 2
        },
        target: {
            arrayIndex: 3,
            stringIndex: 6
        }
    };
    const results = getText(structureRender, vector);
    if (expectedResult !== results) {
        assertions.push("text should say 'world'");
    }
    return assertions;
};
const tests10 = [
    createTextVector,
    createTextVectorFromPosition,
    createFollowingTextVector,
    copyTextVector,
    incrementTextVector,
    incrementMultiTextVector,
    incrementEmptyTextVector,
    incrementTextVectorTooFar,
    testHasOriginEclipsedTaraget,
    testHasOriginNotEclipsedTaraget,
    testGetTextReturnsActualText,
    testGetTextOverTemplate,
    testGetTextOverChonkyTemplate, 
];
const unitTestTextVector = {
    title: title10,
    tests: tests10,
    runTestsAsynchronously: true
};
const tests11 = [
    unitTestAttributeCrawl,
    unitTestBuildIntegrals,
    unitTestBuildRender,
    unitTestBuildSkeleton,
    unitTestContext,
    unitTestSkeletonCrawl,
    unitTestSkeletonRouters,
    unitTestTagNameCrawl,
    unitTestTestHooks,
    unitTestTextPosition,
    unitTestTextVector, 
];
export { tests11 as tests };
