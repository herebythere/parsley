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
const getChar = (template, position)=>template.templateArray[position.x]?.[position.y];
const create = (origin = DEFAULT_POSITION, target = origin)=>({
        origin: {
            ...origin
        },
        target: {
            ...target
        }
    });
const createFromTemplate = (template)=>{
    const x = template.templateArray.length - 1;
    const y = template.templateArray[x].length - 1;
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
    if (increment(template, vector.origin)) {
        return vector;
    }
    return;
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
    console.log(results);
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
const NODE = "NODE";
const TEXT = "TEXT";
const routes = {
    INITIAL: {
        "<": NODE,
        DEFAULT: TEXT
    },
    TEXT: {
        "<": NODE,
        DEFAULT: TEXT
    },
    NODE: {
        " ": "ERROR",
        "\n": NODE,
        "/": "NODE_CLOSER",
        ">": "ERROR",
        "-": "COMMENT_0",
        DEFAULT: "TAGNAME"
    },
    NODE_CLOSER: {
        " ": "ERROR",
        DEFAULT: "TAGNAME_CLOSE"
    },
    TAGNAME: {
        ">": "CLOSE_NODE",
        " ": "SPACE_NODE",
        "\n": "SPACE_NODE",
        "/": "INDEPENDENT_NODE",
        DEFAULT: "TAGNAME"
    },
    TAGNAME_CLOSE: {
        ">": "CLOSE_NODE_CLOSER",
        " ": "SPACE_CLOSE_NODE",
        "\n": "SPACE_CLOSE_NODE",
        DEFAULT: "TAGNAME_CLOSE"
    },
    INDEPENDENT_NODE: {
        ">": "CLOSE_INDEPENDENT_NODE",
        DEFAULT: "INDEPENDENT_NODE"
    },
    CLOSE_NODE: {
        "<": NODE,
        DEFAULT: TEXT
    },
    CLOSE_NODE_CLOSER: {
        "<": NODE,
        DEFAULT: TEXT
    },
    CLOSE_INDEPENDENT_NODE: {
        "<": NODE,
        DEFAULT: TEXT
    },
    SPACE_NODE: {
        ">": "CLOSE_NODE",
        " ": "SPACE_NODE",
        "\n": "SPACE_NODE",
        "/": "INDEPENDENT_NODE",
        DEFAULT: "ATTRIBUTE"
    },
    ATTRIBUTE: {
        " ": "SPACE_NODE",
        "\n": "SPACE_NODE",
        "=": "ATTRIBUTE_SETTER",
        ">": "CLOSE_NODE",
        DEFAULT: "ATTRIBUTE"
    },
    ATTRIBUTE_SETTER: {
        '"': "ATTRIBUTE_DECLARATION",
        "\n": "SPACE_NODE",
        DEFAULT: "SPACE_NODE"
    },
    ATTRIBUTE_DECLARATION: {
        '"': "CLOSE_ATTRIBUTE_DECLARATION",
        DEFAULT: "ATTRIBUTE_VALUE"
    },
    ATTRIBUTE_VALUE: {
        '"': "CLOSE_ATTRIBUTE_DECLARATION",
        DEFAULT: "ATTRIBUTE_VALUE"
    },
    CLOSE_ATTRIBUTE_DECLARATION: {
        ">": "CLOSE_INDEPENDENT_NODE",
        DEFAULT: "SPACE_NODE"
    },
    COMMENT_0: {
        "-": "COMMENT_1",
        DEFAULT: "ERROR"
    },
    COMMENT_1: {
        "-": "COMMENT_CLOSE",
        DEFAULT: "COMMENT"
    },
    COMMENT: {
        "-": "COMMENT_CLOSE",
        DEFAULT: "COMMENT"
    },
    COMMENT_CLOSE: {
        "-": "COMMENT_CLOSE_1",
        DEFAULT: "ERROR"
    },
    COMMENT_CLOSE_1: {
        ">": "CLOSE_NODE",
        DEFAULT: "COMMENT"
    }
};
const injectionMap = new Map([
    [
        "TAGNAME",
        "ATTRIBUTE_INJECTION_MAP"
    ],
    [
        "SPACE_NODE",
        "ATTRIBUTE_INJECTION_MAP"
    ],
    [
        "ATTRIBUTE_DECLARATION",
        "ATTRIBUTE_INJECTION"
    ],
    [
        "CLOSE_NODE",
        "DESCENDANT_INJECTION"
    ],
    [
        "CLOSE_INDEPENDENT_NODE",
        "DESCENDANT_INJECTION"
    ],
    [
        "TEXT",
        "DESCENDANT_INJECTION"
    ]
]);
function parse(template, builder, delta) {
    do {
        const __char = getChar(template, delta.vector.origin);
        if (__char === undefined) return;
        delta.prevState = delta.state;
        delta.state = routes[delta.prevState]?.[__char];
        if (delta.state === undefined) {
            delta.state = routes[delta.prevState]?.["DEFAULT"] ?? "ERROR";
        }
        if (delta.state === "ERROR") return;
        if (delta.prevState !== delta.state) {
            const vector = create(delta.origin, delta.prevPos);
            builder.push({
                type: "BUILD",
                state: delta.prevState,
                vector
            });
            delta.origin.x = delta.vector.origin.x;
            delta.origin.y = delta.vector.origin.y;
        }
        if (delta.prevPos.x < delta.vector.origin.x) {
            if (delta.prevState === "TEXT") {
                const vector1 = create(delta.origin, delta.prevPos);
                builder.push({
                    type: "BUILD",
                    state: "TEXT",
                    vector: vector1
                });
                delta.prevState = delta.state;
                delta.origin.x = delta.vector.origin.x;
                delta.origin.y = delta.vector.origin.y;
            }
            const state = injectionMap.get(delta.prevState);
            if (state) {
                builder.push({
                    type: "INJECT",
                    index: delta.prevPos.x,
                    state
                });
            }
        }
        delta.prevPos.x = delta.vector.origin.x;
        delta.prevPos.y = delta.vector.origin.y;
    }while (delta.state !== "ERROR" && incrementOrigin(template, delta.vector))
    if (delta.prevState === delta.state || delta.state === "ERROR") return;
    const vector2 = create(delta.origin, delta.origin);
    builder.push({
        type: "BUILD",
        state: delta.state,
        vector: vector2
    });
}
class TestBuilder {
    builderStack = [];
    push(buildStep) {
        this.builderStack.push(buildStep);
    }
}
const INITIAL = "INITIAL";
const title1 = "** parse tests **";
const testTextInterpolator1 = (templateArray, ...injections)=>{
    return {
        templateArray,
        injections
    };
};
function createDelta(vector) {
    return {
        prevPos: {
            x: 0,
            y: 0
        },
        origin: {
            x: 0,
            y: 0
        },
        vector,
        prevState: INITIAL,
        state: INITIAL
    };
}
const parseTest = ()=>{
    const testVector = testTextInterpolator1`<hello>hello ${"buster"}!</hello>`;
    console.log(testVector);
    const rb = new TestBuilder();
    parse(testVector, rb, createDelta(createFromTemplate(testVector)));
    console.log(rb.builderStack);
    return [
        "fail!"
    ];
};
const tests1 = [
    parseTest
];
const unitTestParse = {
    title: title1,
    tests: tests1,
    runTestsAsynchronously: true
};
const testCollections = [
    unitTestTextVector,
    unitTestParse
];
export { testCollections as testCollections };
