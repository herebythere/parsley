// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const DEFAULT_POSITION = {
    x: 0,
    y: 0
};
const create = (position = DEFAULT_POSITION)=>({
        ...position
    });
const increment = (template, position)=>{
    const templateLength = template.templateArray.length - 1;
    if (position.x > templateLength) return;
    const chunk = template.templateArray[position.x];
    if (chunk === undefined) return;
    const chunkLength = chunk.length - 1;
    if (position.x >= templateLength && position.y >= chunkLength) {
        return;
    }
    position.y += 1;
    if (position.y > chunkLength) {
        position.x += 1;
        position.y = 0;
    }
    return position;
};
const getChar = (template, position)=>{
    return template.templateArray[position.x]?.[position.y];
};
const samestuff = (source, target, depth = 256)=>{
    if (depth < 1) {
        console.warn("exceeded maximum depth of recursion");
        return false;
    }
    if (source === target) {
        return true;
    }
    if (typeof source !== "object" || typeof target !== "object") {
        return source === target;
    }
    if (source === null || target === null) {
        return source === target;
    }
    const sourceKeys = Object.keys(source);
    const targetKeys = Object.keys(target);
    if (sourceKeys.length !== targetKeys.length) return false;
    for (const sourceKey of sourceKeys){
        if (!samestuff(source[sourceKey], target[sourceKey], depth - 1)) {
            return false;
        }
    }
    return true;
};
const testTextInterpolator = (templateArray, ...injections)=>{
    return {
        templateArray,
        injections
    };
};
const title = "text_position";
const createTextPosition = ()=>{
    const assertions = [];
    const expectedResults = {
        x: 0,
        y: 0
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
        x: 3,
        y: 4
    };
    const position = create(expectedResults);
    if (!samestuff(expectedResults, position)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const incrementTextPosition = ()=>{
    const assertions = [];
    const expectedResults = {
        x: 0,
        y: 1
    };
    const structureRender = testTextInterpolator`hello`;
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
        x: 1,
        y: 2
    };
    const structureRender = testTextInterpolator`hey${"world"}, how are you?`;
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
        x: 3,
        y: 0
    };
    const structureRender = testTextInterpolator`${"hey"}${"world"}${"!!"}`;
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
        x: 1,
        y: 13
    };
    const structureRender = testTextInterpolator`hey${"world"}, how are you?`;
    const arrayLength = structureRender.templateArray.length - 1;
    const stringLength = structureRender.templateArray[arrayLength].length - 1;
    const position = {
        x: arrayLength,
        y: stringLength
    };
    let safety = 0;
    while(increment(structureRender, position) && safety < 20){
        safety += 1;
    }
    if (!samestuff(expectedResults, position)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const getCharFromTemplate = ()=>{
    const assertions = [];
    const structureRender = testTextInterpolator`hello`;
    const position = {
        x: 0,
        y: 2
    };
    const __char = getChar(structureRender, position);
    if (__char !== "l") {
        assertions.push("textPosition target is not 'l'");
    }
    return assertions;
};
const tests = [
    createTextPosition,
    createTextPositionFromPosition,
    incrementTextPosition,
    incrementMultiTextPosition,
    incrementEmptyTextPosition,
    incrementTextPositionTooFar,
    getCharFromTemplate, 
];
const unitTestTextPosition = {
    title,
    tests,
    runTestsAsynchronously: true
};
const DEFAULT_POSITION1 = {
    x: 0,
    y: 0
};
const create1 = (position = DEFAULT_POSITION1)=>({
        origin: {
            ...position
        },
        target: {
            ...position
        }
    });
const createFromVector = (template)=>{
    const last = template.templateArray.length - 1;
    const lastChunk = template.templateArray[last].length - 1;
    return {
        origin: {
            x: 0,
            y: 0
        },
        target: {
            x: last,
            y: lastChunk
        }
    };
};
const copy = (vector)=>{
    return {
        origin: {
            ...vector.origin
        },
        target: {
            ...vector.target
        }
    };
};
const incrementOrigin = (template, vector)=>{
    if (increment(template, vector.origin)) {
        return vector;
    }
    return;
};
const hasOriginEclipsedTaraget = (vector)=>vector.origin.x >= vector.target.x && vector.origin.y >= vector.target.y;
const getText = (template, vector)=>{
    let templateText = template.templateArray[vector.origin.x];
    if (templateText === undefined) return;
    const texts = [];
    const targetX = vector.target.x;
    const originX = vector.origin.x;
    const xDistance = targetX - originX;
    if (xDistance < 0) {
        return;
    }
    if (xDistance === 0) {
        const yDistance = vector.target.y - vector.origin.y + 1;
        return templateText.substr(vector.origin.y, yDistance);
    }
    const firstDistance = templateText.length - vector.origin.y;
    const first = templateText.substr(vector.origin.y, firstDistance);
    texts.push(first);
    let depth = 0;
    const bookend = targetX - 1;
    let index = originX + 1;
    while(depth < 512 && index <= bookend){
        const piece = template.templateArray[index];
        if (piece === undefined) {
            return;
        }
        texts.push(piece);
        index += 1;
        depth += 1;
    }
    const lastTemplate = template.templateArray[targetX];
    if (lastTemplate === undefined) {
        return;
    }
    let last = lastTemplate.substr(0, vector.target.y + 1);
    texts.push(last);
    return texts.join("");
};
const testTextInterpolator1 = (templateArray, ...injections)=>{
    return {
        templateArray,
        injections
    };
};
const title1 = "text_vector";
const createTextVector = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            x: 0,
            y: 0
        },
        target: {
            x: 0,
            y: 0
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
            x: 4,
            y: 3
        },
        target: {
            x: 4,
            y: 3
        }
    };
    const vector = create1({
        y: 3,
        x: 4
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
            x: 0,
            y: 1
        },
        target: {
            x: 2,
            y: 3
        }
    };
    const copiedVector = copy(expectedResults);
    if (!samestuff(expectedResults, copiedVector)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const incrementTextVector = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            x: 0,
            y: 1
        },
        target: {
            x: 0,
            y: 4
        }
    };
    const structureRender = testTextInterpolator1`hello`;
    const vector = createFromVector(structureRender);
    incrementOrigin(structureRender, vector);
    if (!samestuff(expectedResults, vector)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const incrementMultiTextVector = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            x: 1,
            y: 2
        },
        target: {
            x: 1,
            y: 13
        }
    };
    const structureRender = testTextInterpolator1`hey${"world"}, how are you?`;
    const vector = createFromVector(structureRender);
    incrementOrigin(structureRender, vector);
    incrementOrigin(structureRender, vector);
    incrementOrigin(structureRender, vector);
    incrementOrigin(structureRender, vector);
    incrementOrigin(structureRender, vector);
    if (!samestuff(expectedResults, vector)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const incrementEmptyTextVector = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            x: 3,
            y: 0
        },
        target: {
            x: 3,
            y: -1
        }
    };
    const structureRender = testTextInterpolator1`${"hey"}${"world"}${"!!"}`;
    const vector = createFromVector(structureRender);
    incrementOrigin(structureRender, vector);
    incrementOrigin(structureRender, vector);
    incrementOrigin(structureRender, vector);
    if (incrementOrigin(structureRender, vector) !== undefined) {
        assertions.push("should not return after traversed");
    }
    if (!samestuff(expectedResults, vector)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const incrementTextVectorTooFar = ()=>{
    const assertions = [];
    const expectedResults = {
        origin: {
            x: 1,
            y: 13
        },
        target: {
            x: 1,
            y: 13
        }
    };
    const structureRender = testTextInterpolator1`hey${"world"}, how are you?`;
    const results = createFromVector(structureRender);
    let safety = 0;
    while(incrementOrigin(structureRender, results) && safety < 20){
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
    const structureRender = testTextInterpolator1`hey${"world"}, how are you?`;
    const vector = createFromVector(structureRender);
    incrementOrigin(structureRender, vector);
    incrementOrigin(structureRender, vector);
    incrementOrigin(structureRender, vector);
    incrementOrigin(structureRender, vector);
    const results = hasOriginEclipsedTaraget(vector);
    if (results !== false) {
        assertions.push("orign has not eclipsed target");
    }
    return assertions;
};
const testGetTextReturnsActualText = ()=>{
    const expectedResult = "world";
    const assertions = [];
    const structureRender = testTextInterpolator1`hey world, how are you?`;
    const vector = {
        origin: {
            x: 0,
            y: 4
        },
        target: {
            x: 0,
            y: 8
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
    const structureRender = testTextInterpolator1`hey ${"world"}, how ${"are"} you?`;
    const vector = {
        origin: {
            x: 1,
            y: 2
        },
        target: {
            x: 2,
            y: 3
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
    const structureRender = testTextInterpolator1`hey ${"world"}, how ${"are"} you ${"doing"} buster?`;
    const vector = {
        origin: {
            x: 1,
            y: 2
        },
        target: {
            x: 3,
            y: 6
        }
    };
    const results = getText(structureRender, vector);
    if (expectedResult !== results) {
        assertions.push("text should say 'world'");
    }
    return assertions;
};
const tests1 = [
    createTextVector,
    createTextVectorFromPosition,
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
    title: title1,
    tests: tests1,
    runTestsAsynchronously: true
};
const tests2 = [
    unitTestTextPosition,
    unitTestTextVector, 
];
export { tests2 as tests };
