// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const routers = {
    INITIAL: {
        "<": "0_NODE",
        DEFAULT: "TEXT"
    },
    TEXT: {
        "<": "0_NODE",
        DEFAULT: "TEXT"
    },
    "0_NODE": {
        " ": "TEXT",
        "\n": "TEXT",
        "/": "0_NODE_CLOSE",
        ">": "TEXT",
        "-": "0_COMMENT",
        DEFAULT: "0_TAGNAME"
    },
    "0_NODE_CLOSE": {
        " ": "TEXT",
        DEFAULT: "0_TAGNAME_CLOSE"
    },
    "0_TAGNAME": {
        ">": "C_NODE",
        " ": "SPACE_NODE",
        "\n": "SPACE_NODE",
        "/": "0_INDEPENDENT_NODE",
        DEFAULT: "0_TAGNAME"
    },
    "0_TAGNAME_CLOSE": {
        ">": "C_NODE",
        " ": "SPACE_CLOSE_NODE",
        "\n": "SPACE_CLOSE_NODE",
        DEFAULT: "0_TAGNAME_CLOSE"
    },
    "0_INDEPENDENT_NODE": {
        ">": "C_INDEPENDENT_NODE",
        DEFAULT: "TEXT"
    },
    C_NODE: {
        "<": "0_NODE",
        DEFAULT: "TEXT"
    },
    C_INDEPENDENT_NODE: {
        "<": "0_NODE",
        DEFAULT: "TEXT"
    },
    "SPACE_NODE": {
        ">": "C_NODE",
        " ": "SPACE_NODE",
        "\n": "SPACE_NODE",
        "/": "0_INDEPENDENT_NODE",
        DEFAULT: "ATTRIBUTE"
    },
    "ATTRIBUTE": {
        " ": "SPACE_NODE",
        "\n": "SPACE_NODE",
        "=": "ATTRIBUTE_SETTER",
        ">": "C_NODE",
        DEFAULT: "ATTRIBUTE"
    },
    "ATTRIBUTE_SETTER": {
        "\"": "ATTRIBUTE_DECLARATION",
        "\n": "SPACE_NODE",
        DEFAULT: "SPACE_NODE"
    },
    "ATTRIBUTE_DECLARATION": {
        "\"": "C_ATTRIBUTE_VALUE",
        DEFAULT: "0_ATTRIBUTE_VALUE"
    },
    "0_ATTRIBUTE_VALUE": {
        "\"": "C_ATTRIBUTE_VALUE",
        DEFAULT: "0_ATTRIBUTE_VALUE"
    },
    "C_ATTRIBUTE_VALUE": {
        ">": "C_INDEPENDENT_NODE",
        DEFAULT: "SPACE_NODE"
    },
    "0_COMMENT": {
        "-": "1_COMMENT",
        DEFAULT: "TEXT"
    },
    "1_COMMENT": {
        "-": "0_COMMENT_CLOSE",
        DEFAULT: "TEXT_COMMENT"
    },
    TEXT_COMMENT: {
        "-": "0_COMMENT_CLOSE",
        DEFAULT: "TEXT_COMMENT"
    },
    "0_COMMENT_CLOSE": {
        "-": "1_COMMENT_CLOSE",
        DEFAULT: "TEXT_COMMENT"
    },
    "1_COMMENT_CLOSE": {
        ">": "C_COMMENT",
        DEFAULT: "TEXT_COMMENT"
    },
    C_COMMENT: {
        "<": "0_NODE",
        DEFAULT: "TEXT"
    }
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
const incrementOrigin = (template, vector)=>{
    if (increment(template, vector.origin)) {
        return vector;
    }
    return;
};
const partMap = new Map([
    [
        "TEXT_COMMENT",
        "COMMENT"
    ],
    [
        "TEXT",
        "TEXT"
    ],
    [
        "0_TAGNAME",
        "NODE"
    ],
    [
        "ATTRIBUTE",
        "ATTRIBUTE"
    ],
    [
        "0_ATTRIBUTE_VALUE",
        "ATTRIBUTE_VALUE"
    ],
    [
        "0_TAGNAME_CLOSE",
        "POP_NODE_NAMED"
    ],
    [
        "C_INDEPENDENT_NODE",
        "POP_NODE"
    ], 
]);
const injectionMap = new Map([
    [
        "0_TAGNAME",
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
        "C_NODE",
        "DESCENDANT_INJECTION"
    ],
    [
        "C_INDEPENDENT_NODE",
        "DESCENDANT_INJECTION"
    ],
    [
        "TEXT",
        "DESCENDANT_INJECTION"
    ]
]);
class ResultsBuilder {
    builderStack = [];
    push(buildStep) {
        this.builderStack.push(buildStep);
    }
}
function deltaCrawl(template, builder, delta) {
    const __char = getChar(template, delta.vector.origin);
    if (__char === undefined) return;
    delta.prevState = delta.state;
    delta.state = routers[delta.prevState]?.[__char];
    if (delta.state === undefined) {
        delta.state = routers[delta.prevState]?.["DEFAULT"];
    }
    const state = partMap.get(delta.prevState);
    console.log(delta.prevState, state, delta.origin, delta.prevState);
    if (delta.prevState !== delta.state) {
        const origin = {
            ...delta.origin
        };
        const target = {
            ...delta.prevPos
        };
        builder.push({
            type: 'build',
            state: delta.prevState,
            vector: {
                origin,
                target
            }
        });
        delta.origin.x = delta.vector.origin.x;
        delta.origin.y = delta.vector.origin.y;
    }
    if (delta.prevPos.x < delta.vector.origin.x) {
        const injection = injectionMap.get(delta.prevState);
        console.log("injection:", state);
        if (state === "TEXT") {
            console.log("text injecition!");
            builder.push({
                type: 'build',
                state: "TEXT",
                vector: {
                    origin: {
                        ...delta.origin
                    },
                    target: {
                        ...delta.prevPos
                    }
                }
            });
            delta.prevState = delta.state;
            delta.origin.x = delta.vector.origin.x;
            delta.origin.y = delta.vector.origin.y;
            delta.prevPos.x = delta.vector.origin.x;
            delta.prevPos.y = delta.vector.origin.y;
        }
        if (injection) {
            builder.push({
                type: 'injection',
                state: injection,
                index: delta.prevPos.x
            });
        }
    }
    delta.prevPos.x = delta.vector.origin.x;
    delta.prevPos.y = delta.vector.origin.y;
}
function crawl(template, builder, delta) {
    deltaCrawl(template, builder, delta);
    while(incrementOrigin(template, delta.vector)){
        deltaCrawl(template, builder, delta);
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
const crawlNodeWithInjectionsTest = ()=>{
    const testVector = testTextInterpolator`<hello ${"world"}/>${"uwu"}</hello>`;
    console.log(testVector);
    const rb = new ResultsBuilder();
    crawl(testVector, rb, createDelta(createFromTemplate(testVector)));
    console.log(rb.builderStack);
    return [
        "fail!"
    ];
};
const tests = [
    crawlNodeWithInjectionsTest, 
];
const unitTestCrawl = {
    title,
    tests,
    runTestsAsynchronously: true
};
const tests1 = [
    unitTestCrawl, 
];
export { tests1 as tests };
