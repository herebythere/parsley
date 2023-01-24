// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const samestuff = (source, target, depth = 256)=>{
    if (depth < 1) {
        console.warn("samestuff: exceeded maximum depth of recursion");
        return false;
    }
    if (source === target) return true;
    if (typeof source !== "object" || typeof target !== "object") return source === target;
    if (source === null || target === null) return source === target;
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
const DEFAULT_POSITION = {
    x: 0,
    y: 0
};
const increment = (template, position)=>{
    const templateLength = template.templateArray.length - 1;
    if (position.x > templateLength) return;
    const chunk = template.templateArray[position.x];
    if (chunk === undefined) return;
    const chunkLength = chunk.length - 1;
    if (position.x >= templateLength && position.y >= chunkLength) return;
    position.y += 1;
    if (position.y > chunkLength) {
        position.x += 1;
        position.y = 0;
    }
    return position;
};
const create = (origin = DEFAULT_POSITION, target = origin)=>({
        origin: {
            ...origin
        },
        target: {
            ...target
        }
    });
const createFromTemplate = (template)=>{
    const { templateArray  } = template;
    const x = templateArray.length - 1;
    const y = templateArray[x].length - 1;
    return {
        origin: {
            x: 0,
            y: 0
        },
        target: {
            x,
            y
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
    if (increment(template, vector.origin)) return vector;
};
const getText = (template, vector)=>{
    const origin = vector.origin;
    let templateText = template.templateArray[origin.x];
    if (templateText === undefined) return;
    return templateText.substr(origin.y, vector.target.y - origin.y + 1);
};
const testTextInterpolator = (templateArray, ...injections)=>{
    return {
        templateArray,
        injections
    };
};
const title = "text_vector";
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
    const vector = create();
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
    const vector = create({
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
    const structureRender = testTextInterpolator`hello`;
    const vector = createFromTemplate(structureRender);
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
    const structureRender = testTextInterpolator`hey${"world"}, how are you?`;
    const vector = createFromTemplate(structureRender);
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
    const structureRender = testTextInterpolator`${"hey"}${"world"}${"!!"}`;
    const vector = createFromTemplate(structureRender);
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
    const structureRender = testTextInterpolator`hey${"world"}, how are you?`;
    const results = createFromTemplate(structureRender);
    let safety = 0;
    while(incrementOrigin(structureRender, results) && safety < 20){
        safety += 1;
    }
    if (!samestuff(expectedResults, results)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
};
const testGetTextReturnsActualText = ()=>{
    const expectedResult = "world";
    const assertions = [];
    const structureRender = testTextInterpolator`hey world, how are you?`;
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
    const expectedResult = "how";
    const assertions = [];
    const structureRender = testTextInterpolator`hey ${"world"}, how ${"are"} you?`;
    const vector = {
        origin: {
            x: 1,
            y: 2
        },
        target: {
            x: 1,
            y: 4
        }
    };
    const results = getText(structureRender, vector);
    if (expectedResult !== results) {
        assertions.push("text should say 'world'");
    }
    return assertions;
};
const testGetTextLastChunkTemplate = ()=>{
    const expectedResult = "buster";
    const assertions = [];
    const structureRender = testTextInterpolator`hey ${"world"}, how ${"are"} you ${"doing"} buster?`;
    const vector = {
        origin: {
            x: 3,
            y: 1
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
const tests = [
    createTextVector,
    createTextVectorFromPosition,
    copyTextVector,
    incrementTextVector,
    incrementMultiTextVector,
    incrementEmptyTextVector,
    incrementTextVectorTooFar,
    testGetTextReturnsActualText,
    testGetTextOverTemplate,
    testGetTextLastChunkTemplate
];
const unitTestTextVector = {
    title,
    tests,
    runTestsAsynchronously: true
};
const testCollections = [
    unitTestTextVector
];
export { testCollections as testCollections };
