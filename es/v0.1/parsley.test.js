// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const routers = {
    INITIAL: {
        "<": "NODE",
        DEFAULT: "TEXT"
    },
    TEXT: {
        "<": "NODE",
        DEFAULT: "TEXT"
    },
    NODE: {
        " ": "ERROR",
        "\n": "NODE",
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
        "<": "NODE",
        DEFAULT: "TEXT"
    },
    CLOSE_NODE_CLOSER: {
        "<": "NODE",
        DEFAULT: "TEXT"
    },
    CLOSE_INDEPENDENT_NODE: {
        "<": "NODE",
        DEFAULT: "TEXT"
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
const create = (origin = DEFAULT_POSITION, target = DEFAULT_POSITION)=>({
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
    const texts = [];
    const target = vector.target;
    const xDistance = target.x - origin.x;
    if (xDistance < 0) return;
    if (xDistance === 0) {
        const yDistance = target.y - origin.y + 1;
        return templateText.substr(origin.y, yDistance);
    }
    const firstDistance = templateText.length - origin.y;
    const first = templateText.substr(origin.y, firstDistance);
    texts.push(first);
    const bookend = target.x - 2;
    let index = origin.x + 1;
    while(index < bookend){
        const piece = template.templateArray[index];
        if (piece === undefined) return;
        texts.push(piece);
        index += 1;
    }
    const lastTemplate = template.templateArray[target.x];
    if (lastTemplate === undefined) return;
    let last = lastTemplate.substr(0, target.y + 1);
    texts.push(last);
    return texts.join("");
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
function crawl(template, builder, delta) {
    do {
        const __char = getChar(template, delta.vector.origin);
        if (__char === undefined) return;
        delta.prevState = delta.state;
        delta.state = routers[delta.prevState]?.[__char];
        if (delta.state === undefined) {
            delta.state = routers[delta.prevState]?.["DEFAULT"] ?? "ERROR";
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
const title = "** crawl tests **";
const testTextInterpolator = (templateArray, ...injections)=>{
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
const crawlTest = ()=>{
    const testVector = testTextInterpolator`<hello>hello ${"buster"}!</hello>`;
    console.log(testVector);
    const rb = new TestBuilder();
    crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
    console.log(rb.builderStack);
    return [
        "fail!"
    ];
};
const crawlNodeWithInjectionsTest = ()=>{
    const testVector = testTextInterpolator`<hello ${"world"}/>${"uwu"}</hello>`;
    console.log(testVector);
    const rb = new TestBuilder();
    crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
    console.log(rb.builderStack);
    return [
        "fail!"
    ];
};
const tests = [
    crawlTest,
    crawlNodeWithInjectionsTest
];
const unitTestCrawl = {
    title,
    tests,
    runTestsAsynchronously: true
};
const samestuff = (source, target, depth = 256)=>{
    if (depth < 1) {
        console.warn("exceeded maximum depth of recursion");
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
    const structureRender = testTextInterpolator1`hello`;
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
    const structureRender = testTextInterpolator1`hey${"world"}, how are you?`;
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
    const structureRender = testTextInterpolator1`${"hey"}${"world"}${"!!"}`;
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
    const structureRender = testTextInterpolator1`hey${"world"}, how are you?`;
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
    testGetTextReturnsActualText,
    testGetTextOverTemplate,
    testGetTextOverChonkyTemplate
];
const unitTestTextVector = {
    title: title1,
    tests: tests1,
    runTestsAsynchronously: true
};
const tests2 = [
    unitTestCrawl,
    unitTestTextVector
];
export { tests2 as tests };
