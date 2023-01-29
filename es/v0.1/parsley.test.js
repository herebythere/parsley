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
function increment(template, position) {
    const templateLength = template.length - 1;
    if (position.x > templateLength) return;
    const chunk = template[position.x];
    if (chunk === undefined) return;
    const chunkLength = chunk.length - 1;
    if (position.x >= templateLength && position.y >= chunkLength) return;
    position.y += 1;
    if (position.y > chunkLength) {
        position.x += 1;
        position.y = 0;
    }
    return position;
}
function getChar(template, position) {
    const str = template[position.x];
    if (str === undefined) return;
    if (str.length === 0) return str;
    return str[position.y];
}
function create(origin = DEFAULT_POSITION, target = origin) {
    return {
        origin: {
            ...origin
        },
        target: {
            ...target
        }
    };
}
function copy(vector) {
    return {
        origin: {
            ...vector.origin
        },
        target: {
            ...vector.target
        }
    };
}
function getText(template, vector) {
    const origin = vector.origin;
    let templateText = template[origin.x];
    if (templateText === undefined) return;
    return templateText.substr(origin.y, vector.target.y - origin.y + 1);
}
function testTextInterpolator(templateArray, ...injections) {
    return templateArray;
}
const title = "text_vector";
function createTextVector() {
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
}
function createTextVectorFromPosition() {
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
}
function copyTextVector() {
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
    const vector = copy(expectedResults);
    if (!samestuff(expectedResults, vector)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
}
function incrementTextVector() {
    const assertions = [];
    const expectedResults = {
        x: 0,
        y: 1
    };
    const structureRender = testTextInterpolator`hello`;
    const origin = {
        x: 0,
        y: 0
    };
    increment(structureRender, origin);
    if (!samestuff(expectedResults, origin)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
}
function incrementMultiTextVector() {
    const assertions = [];
    const expectedResults = {
        x: 1,
        y: 2
    };
    const structureRender = testTextInterpolator`hey${"world"}, how are you?`;
    const origin = {
        x: 0,
        y: 0
    };
    increment(structureRender, origin);
    increment(structureRender, origin);
    increment(structureRender, origin);
    increment(structureRender, origin);
    increment(structureRender, origin);
    if (!samestuff(expectedResults, origin)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
}
function incrementEmptyTextVector() {
    const assertions = [];
    const expectedResults = {
        x: 3,
        y: 0
    };
    const structureRender = testTextInterpolator`${"hey"}${"world"}${"!!"}`;
    const origin = {
        x: 0,
        y: 0
    };
    increment(structureRender, origin);
    increment(structureRender, origin);
    increment(structureRender, origin);
    if (increment(structureRender, origin) !== undefined) {
        assertions.push("should not return after traversed");
    }
    if (!samestuff(expectedResults, origin)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
}
function incrementTextVectorTooFar() {
    const assertions = [];
    const expectedResults = {
        x: 1,
        y: 13
    };
    const structureRender = testTextInterpolator`hey${"world"}, how are you?`;
    const origin = {
        x: 0,
        y: 0
    };
    let safety = 0;
    while(increment(structureRender, origin) && safety < 20){
        safety += 1;
    }
    if (!samestuff(expectedResults, origin)) {
        assertions.push("unexpected results found.");
    }
    return assertions;
}
function testGetTextReturnsActualText() {
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
}
function testGetTextOverTemplate() {
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
}
function testGetTextLastChunkTemplate() {
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
}
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
const ATTRIBUTE = "ATTRIBUTE";
const ATTRIBUTE_VALUE = "ATTRIBUTE_VALUE";
const TEXT = "TEXT";
const ERROR = "ERROR";
const NODE_SPACE = "NODE_SPACE";
const NODE_CLOSED = "NODE_CLOSED";
const INDEPENDENT_NODE = "INDEPENDENT_NODE";
const INDEPENDENT_NODE_CLOSED = "INDEPENDENT_NODE_CLOSED";
const CLOSE_TAGNAME = "CLOSE_TAGNAME";
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
        " ": ERROR,
        "\n": NODE,
        "\t": NODE,
        "/": "CLOSE_NODE_SLASH",
        ">": ERROR,
        "-": "COMMENT_0",
        DEFAULT: "TAGNAME"
    },
    CLOSE_NODE_SLASH: {
        " ": ERROR,
        DEFAULT: CLOSE_TAGNAME
    },
    TAGNAME: {
        ">": NODE_CLOSED,
        " ": NODE_SPACE,
        "\n": NODE_SPACE,
        "\t": NODE_SPACE,
        "/": INDEPENDENT_NODE,
        DEFAULT: "TAGNAME"
    },
    CLOSE_TAGNAME: {
        ">": "CLOSE_NODE_CLOSED",
        " ": "CLOSE_NODE_SPACE",
        "\n": "CLOSE_NODE_SPACE",
        DEFAULT: CLOSE_TAGNAME
    },
    CLOSE_NODE_SPACE: {
        ">": "CLOSE_NODE_CLOSED",
        DEFAULT: "CLOSE_NODE_SPACE"
    },
    INDEPENDENT_NODE: {
        ">": INDEPENDENT_NODE_CLOSED,
        DEFAULT: INDEPENDENT_NODE
    },
    NODE_CLOSED: {
        "<": NODE,
        DEFAULT: TEXT
    },
    CLOSE_NODE_CLOSED: {
        "<": NODE,
        DEFAULT: TEXT
    },
    INDEPENDENT_NODE_CLOSED: {
        "<": NODE,
        DEFAULT: TEXT
    },
    NODE_SPACE: {
        ">": NODE_CLOSED,
        " ": NODE_SPACE,
        "\n": NODE_SPACE,
        "\t": NODE_SPACE,
        "/": INDEPENDENT_NODE,
        DEFAULT: ATTRIBUTE
    },
    ATTRIBUTE: {
        " ": NODE_SPACE,
        "\n": NODE_SPACE,
        "\t": NODE_SPACE,
        "=": "ATTRIBUTE_SETTER",
        ">": NODE_CLOSED,
        "/": INDEPENDENT_NODE,
        DEFAULT: ATTRIBUTE
    },
    ATTRIBUTE_SETTER: {
        '"': "ATTRIBUTE_DECLARATION",
        "\n": NODE_SPACE,
        DEFAULT: NODE_SPACE
    },
    ATTRIBUTE_DECLARATION: {
        '"': "ATTRIBUTE_DECLARATION_CLOSE",
        DEFAULT: ATTRIBUTE_VALUE
    },
    ATTRIBUTE_VALUE: {
        '"': "ATTRIBUTE_DECLARATION_CLOSE",
        DEFAULT: ATTRIBUTE_VALUE
    },
    ATTRIBUTE_DECLARATION_CLOSE: {
        ">": INDEPENDENT_NODE_CLOSED,
        "/": INDEPENDENT_NODE,
        DEFAULT: NODE_SPACE
    },
    COMMENT_0: {
        "-": "COMMENT_1",
        DEFAULT: ERROR
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
        DEFAULT: ERROR
    },
    COMMENT_CLOSE_1: {
        ">": NODE_CLOSED,
        DEFAULT: ERROR
    }
};
const injectionMap = new Map([
    [
        "ATTRIBUTE_DECLARATION",
        "ATTRIBUTE_INJECTION"
    ],
    [
        "INDEPENDENT_NODE_CLOSED",
        "DESCENDANT_INJECTION"
    ],
    [
        "NODE_CLOSED",
        "DESCENDANT_INJECTION"
    ],
    [
        "INITIAL",
        "DESCENDANT_INJECTION"
    ],
    [
        "NODE_SPACE",
        "ATTRIBUTE_INJECTION_MAP"
    ],
    [
        "TAGNAME",
        "ATTRIBUTE_INJECTION_MAP"
    ],
    [
        "TEXT",
        "DESCENDANT_INJECTION"
    ]
]);
const INITIAL = "INITIAL";
function parse(template, builder, prev = INITIAL) {
    let prevState = prev;
    let currState = prevState;
    const origin = {
        x: 0,
        y: 0
    };
    const prevOrigin = {
        x: 0,
        y: 0
    };
    const prevTarget = {
        x: 0,
        y: 0
    };
    do {
        const __char = getChar(template, origin);
        if (__char === undefined) {
            builder.push({
                type: "ERROR",
                state: currState,
                vector: create(origin, origin)
            });
            return;
        }
        if (__char !== "") {
            prevState = currState;
            const route = routes[prevState];
            if (route) {
                currState = route[__char] ?? route["DEFAULT"];
            }
            if (currState === "ERROR") {
                builder.push({
                    type: "ERROR",
                    state: prevState,
                    vector: create(origin, origin)
                });
                return;
            }
        }
        if (prevState !== currState) {
            builder.push({
                type: "BUILD",
                state: prevState,
                vector: create(prevOrigin, prevTarget)
            });
            prevOrigin.x = origin.x;
            prevOrigin.y = origin.y;
        }
        if (prevTarget.x < origin.x) {
            if (prevState === "TEXT") {
                builder.push({
                    type: "BUILD",
                    state: "TEXT",
                    vector: create(prevOrigin, prevTarget)
                });
                prevState = currState;
                prevOrigin.x = origin.x;
                prevOrigin.y = origin.y;
            }
            const state = injectionMap.get(prevState);
            if (state) {
                builder.push({
                    type: "INJECT",
                    index: prevTarget.x,
                    state
                });
            }
        }
        prevTarget.x = origin.x;
        prevTarget.y = origin.y;
    }while (increment(template, origin))
    if (prevState === currState) return;
    builder.push({
        type: "BUILD",
        state: currState,
        vector: create(origin, origin)
    });
}
const title1 = "** parse tests **";
function testTextInterpolator1(templateArray, ...injections) {
    return templateArray;
}
function parseNodeTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<hello>`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_CLOSED",
            vector: {
                origin: {
                    x: 0,
                    y: 6
                },
                target: {
                    x: 0,
                    y: 6
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseNodeWithImplicitAttributeTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<hello attribute>`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 0,
                    y: 6
                },
                target: {
                    x: 0,
                    y: 6
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE",
            vector: {
                origin: {
                    x: 0,
                    y: 7
                },
                target: {
                    x: 0,
                    y: 15
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_CLOSED",
            vector: {
                origin: {
                    x: 0,
                    y: 16
                },
                target: {
                    x: 0,
                    y: 16
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseNodeWithImplicitAttributeWithSpacesTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<hello  attribute  >`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 0,
                    y: 6
                },
                target: {
                    x: 0,
                    y: 7
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE",
            vector: {
                origin: {
                    x: 0,
                    y: 8
                },
                target: {
                    x: 0,
                    y: 16
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 0,
                    y: 17
                },
                target: {
                    x: 0,
                    y: 18
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_CLOSED",
            vector: {
                origin: {
                    x: 0,
                    y: 19
                },
                target: {
                    x: 0,
                    y: 19
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseIndependentNodeTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<hello/>`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 6
                },
                target: {
                    x: 0,
                    y: 6
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE_CLOSED",
            vector: {
                origin: {
                    x: 0,
                    y: 7
                },
                target: {
                    x: 0,
                    y: 7
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseIndependentNodeWithImplicitAttributeTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<hello attribute/>`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 0,
                    y: 6
                },
                target: {
                    x: 0,
                    y: 6
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE",
            vector: {
                origin: {
                    x: 0,
                    y: 7
                },
                target: {
                    x: 0,
                    y: 15
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 16
                },
                target: {
                    x: 0,
                    y: 16
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE_CLOSED",
            vector: {
                origin: {
                    x: 0,
                    y: 17
                },
                target: {
                    x: 0,
                    y: 17
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseIndependentNodeWithImplicitAttributeWithSpacesTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<hello  attribute  />`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 0,
                    y: 6
                },
                target: {
                    x: 0,
                    y: 7
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE",
            vector: {
                origin: {
                    x: 0,
                    y: 8
                },
                target: {
                    x: 0,
                    y: 16
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 0,
                    y: 17
                },
                target: {
                    x: 0,
                    y: 18
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 19
                },
                target: {
                    x: 0,
                    y: 19
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE_CLOSED",
            vector: {
                origin: {
                    x: 0,
                    y: 20
                },
                target: {
                    x: 0,
                    y: 20
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseExplicitAttributeTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<hello attribute="value"/>`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 0,
                    y: 6
                },
                target: {
                    x: 0,
                    y: 6
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE",
            vector: {
                origin: {
                    x: 0,
                    y: 7
                },
                target: {
                    x: 0,
                    y: 15
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_SETTER",
            vector: {
                origin: {
                    x: 0,
                    y: 16
                },
                target: {
                    x: 0,
                    y: 16
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_DECLARATION",
            vector: {
                origin: {
                    x: 0,
                    y: 17
                },
                target: {
                    x: 0,
                    y: 17
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_VALUE",
            vector: {
                origin: {
                    x: 0,
                    y: 18
                },
                target: {
                    x: 0,
                    y: 22
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_DECLARATION_CLOSE",
            vector: {
                origin: {
                    x: 0,
                    y: 23
                },
                target: {
                    x: 0,
                    y: 23
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 24
                },
                target: {
                    x: 0,
                    y: 24
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE_CLOSED",
            vector: {
                origin: {
                    x: 0,
                    y: 25
                },
                target: {
                    x: 0,
                    y: 25
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseExplicitAttributeWithSpacesTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<hello  attribute="value"  />`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 0,
                    y: 6
                },
                target: {
                    x: 0,
                    y: 7
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE",
            vector: {
                origin: {
                    x: 0,
                    y: 8
                },
                target: {
                    x: 0,
                    y: 16
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_SETTER",
            vector: {
                origin: {
                    x: 0,
                    y: 17
                },
                target: {
                    x: 0,
                    y: 17
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_DECLARATION",
            vector: {
                origin: {
                    x: 0,
                    y: 18
                },
                target: {
                    x: 0,
                    y: 18
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_VALUE",
            vector: {
                origin: {
                    x: 0,
                    y: 19
                },
                target: {
                    x: 0,
                    y: 23
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_DECLARATION_CLOSE",
            vector: {
                origin: {
                    x: 0,
                    y: 24
                },
                target: {
                    x: 0,
                    y: 24
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 0,
                    y: 25
                },
                target: {
                    x: 0,
                    y: 26
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 27
                },
                target: {
                    x: 0,
                    y: 27
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE_CLOSED",
            vector: {
                origin: {
                    x: 0,
                    y: 28
                },
                target: {
                    x: 0,
                    y: 28
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseNodeInjectionsTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<hello>${"hi"}</hello>`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_CLOSED",
            vector: {
                origin: {
                    x: 0,
                    y: 6
                },
                target: {
                    x: 0,
                    y: 6
                }
            }
        },
        {
            type: "INJECT",
            index: 0,
            state: "DESCENDANT_INJECTION"
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 1,
                    y: 0
                },
                target: {
                    x: 1,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_SLASH",
            vector: {
                origin: {
                    x: 1,
                    y: 1
                },
                target: {
                    x: 1,
                    y: 1
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_TAGNAME",
            vector: {
                origin: {
                    x: 1,
                    y: 2
                },
                target: {
                    x: 1,
                    y: 6
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_CLOSED",
            vector: {
                origin: {
                    x: 1,
                    y: 7
                },
                target: {
                    x: 1,
                    y: 7
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseNodeWithAttributeInjectionsTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<hello world="${"world"}"/>`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 0,
                    y: 6
                },
                target: {
                    x: 0,
                    y: 6
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE",
            vector: {
                origin: {
                    x: 0,
                    y: 7
                },
                target: {
                    x: 0,
                    y: 11
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_SETTER",
            vector: {
                origin: {
                    x: 0,
                    y: 12
                },
                target: {
                    x: 0,
                    y: 12
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_DECLARATION",
            vector: {
                origin: {
                    x: 0,
                    y: 13
                },
                target: {
                    x: 0,
                    y: 13
                }
            }
        },
        {
            type: "INJECT",
            index: 0,
            state: "ATTRIBUTE_INJECTION"
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_DECLARATION_CLOSE",
            vector: {
                origin: {
                    x: 1,
                    y: 0
                },
                target: {
                    x: 1,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE",
            vector: {
                origin: {
                    x: 1,
                    y: 1
                },
                target: {
                    x: 1,
                    y: 1
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE_CLOSED",
            vector: {
                origin: {
                    x: 1,
                    y: 2
                },
                target: {
                    x: 1,
                    y: 2
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseNodeWithAttributeMapInjectionsTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<hello ${"world"}/>`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 0,
                    y: 6
                },
                target: {
                    x: 0,
                    y: 6
                }
            }
        },
        {
            type: "INJECT",
            index: 0,
            state: "ATTRIBUTE_INJECTION_MAP"
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE",
            vector: {
                origin: {
                    x: 1,
                    y: 0
                },
                target: {
                    x: 1,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE_CLOSED",
            vector: {
                origin: {
                    x: 1,
                    y: 1
                },
                target: {
                    x: 1,
                    y: 1
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseCommentTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<-- Hello world! -->`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "COMMENT_0",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 1
                }
            }
        },
        {
            type: "BUILD",
            state: "COMMENT_1",
            vector: {
                origin: {
                    x: 0,
                    y: 2
                },
                target: {
                    x: 0,
                    y: 2
                }
            }
        },
        {
            type: "BUILD",
            state: "COMMENT",
            vector: {
                origin: {
                    x: 0,
                    y: 3
                },
                target: {
                    x: 0,
                    y: 16
                }
            }
        },
        {
            type: "BUILD",
            state: "COMMENT_CLOSE",
            vector: {
                origin: {
                    x: 0,
                    y: 17
                },
                target: {
                    x: 0,
                    y: 17
                }
            }
        },
        {
            type: "BUILD",
            state: "COMMENT_CLOSE_1",
            vector: {
                origin: {
                    x: 0,
                    y: 18
                },
                target: {
                    x: 0,
                    y: 18
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_CLOSED",
            vector: {
                origin: {
                    x: 0,
                    y: 19
                },
                target: {
                    x: 0,
                    y: 19
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseErrorTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`< a>`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "ERROR",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 1
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseCloseNodeErrorTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`</ a>`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "ERROR",
            state: "CLOSE_NODE_SLASH",
            vector: {
                origin: {
                    x: 0,
                    y: 2
                },
                target: {
                    x: 0,
                    y: 2
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseCommentErrorTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<- `;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "ERROR",
            state: "COMMENT_0",
            vector: {
                origin: {
                    x: 0,
                    y: 2
                },
                target: {
                    x: 0,
                    y: 2
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseCloseCommentErrorTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`<-- -- `;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "COMMENT_0",
            vector: {
                origin: {
                    x: 0,
                    y: 1
                },
                target: {
                    x: 0,
                    y: 1
                }
            }
        },
        {
            type: "BUILD",
            state: "COMMENT_1",
            vector: {
                origin: {
                    x: 0,
                    y: 2
                },
                target: {
                    x: 0,
                    y: 2
                }
            }
        },
        {
            type: "BUILD",
            state: "COMMENT",
            vector: {
                origin: {
                    x: 0,
                    y: 3
                },
                target: {
                    x: 0,
                    y: 3
                }
            }
        },
        {
            type: "BUILD",
            state: "COMMENT_CLOSE",
            vector: {
                origin: {
                    x: 0,
                    y: 4
                },
                target: {
                    x: 0,
                    y: 4
                }
            }
        },
        {
            type: "ERROR",
            state: "COMMENT_CLOSE_1",
            vector: {
                origin: {
                    x: 0,
                    y: 6
                },
                target: {
                    x: 0,
                    y: 6
                }
            }
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseEmptyTest() {
    const assertions = [];
    const testVector = testTextInterpolator1``;
    const expectedResults = [];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseEmptyWithInjectionTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`${"buster"}`;
    const expectedResults = [
        {
            type: "INJECT",
            index: 0,
            state: "DESCENDANT_INJECTION"
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseEmptyWithMultipleInjectionsTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`${"yo"}${"buddy"}${"boi"}`;
    const expectedResults = [
        {
            type: "INJECT",
            index: 0,
            state: "DESCENDANT_INJECTION"
        },
        {
            type: "INJECT",
            index: 1,
            state: "DESCENDANT_INJECTION"
        },
        {
            type: "INJECT",
            index: 2,
            state: "DESCENDANT_INJECTION"
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
function parseNestedTemplateWithInjectionsTest() {
    const assertions = [];
    const testVector = testTextInterpolator1`${"stardust"}
  	<boop sunshine>${"yo"}<beep>hai</beep>
  		<doh ${"moonlight"}>${"buddy"}</doh><howdy starshine="darlin" />
  		<chomp>:3</chomp>
  		${"wolfy"}
  	</boop>
  ${"galaxy"}`;
    const expectedResults = [
        {
            type: "BUILD",
            state: "INITIAL",
            vector: {
                origin: {
                    x: 0,
                    y: 0
                },
                target: {
                    x: 0,
                    y: 0
                }
            }
        },
        {
            type: "INJECT",
            index: 0,
            state: "DESCENDANT_INJECTION"
        },
        {
            type: "BUILD",
            state: "TEXT",
            vector: {
                origin: {
                    x: 1,
                    y: 0
                },
                target: {
                    x: 1,
                    y: 3
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 1,
                    y: 4
                },
                target: {
                    x: 1,
                    y: 4
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 1,
                    y: 5
                },
                target: {
                    x: 1,
                    y: 8
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 1,
                    y: 9
                },
                target: {
                    x: 1,
                    y: 9
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE",
            vector: {
                origin: {
                    x: 1,
                    y: 10
                },
                target: {
                    x: 1,
                    y: 17
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_CLOSED",
            vector: {
                origin: {
                    x: 1,
                    y: 18
                },
                target: {
                    x: 1,
                    y: 18
                }
            }
        },
        {
            type: "INJECT",
            index: 1,
            state: "DESCENDANT_INJECTION"
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 2,
                    y: 0
                },
                target: {
                    x: 2,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 2,
                    y: 1
                },
                target: {
                    x: 2,
                    y: 4
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_CLOSED",
            vector: {
                origin: {
                    x: 2,
                    y: 5
                },
                target: {
                    x: 2,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "TEXT",
            vector: {
                origin: {
                    x: 2,
                    y: 6
                },
                target: {
                    x: 2,
                    y: 8
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 2,
                    y: 9
                },
                target: {
                    x: 2,
                    y: 9
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_SLASH",
            vector: {
                origin: {
                    x: 2,
                    y: 10
                },
                target: {
                    x: 2,
                    y: 10
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_TAGNAME",
            vector: {
                origin: {
                    x: 2,
                    y: 11
                },
                target: {
                    x: 2,
                    y: 14
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_CLOSED",
            vector: {
                origin: {
                    x: 2,
                    y: 15
                },
                target: {
                    x: 2,
                    y: 15
                }
            }
        },
        {
            type: "BUILD",
            state: "TEXT",
            vector: {
                origin: {
                    x: 2,
                    y: 16
                },
                target: {
                    x: 2,
                    y: 20
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 2,
                    y: 21
                },
                target: {
                    x: 2,
                    y: 21
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 2,
                    y: 22
                },
                target: {
                    x: 2,
                    y: 24
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 2,
                    y: 25
                },
                target: {
                    x: 2,
                    y: 25
                }
            }
        },
        {
            type: "INJECT",
            index: 2,
            state: "ATTRIBUTE_INJECTION_MAP"
        },
        {
            type: "BUILD",
            state: "NODE_CLOSED",
            vector: {
                origin: {
                    x: 3,
                    y: 0
                },
                target: {
                    x: 3,
                    y: 0
                }
            }
        },
        {
            type: "INJECT",
            index: 3,
            state: "DESCENDANT_INJECTION"
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 4,
                    y: 0
                },
                target: {
                    x: 4,
                    y: 0
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_SLASH",
            vector: {
                origin: {
                    x: 4,
                    y: 1
                },
                target: {
                    x: 4,
                    y: 1
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_TAGNAME",
            vector: {
                origin: {
                    x: 4,
                    y: 2
                },
                target: {
                    x: 4,
                    y: 4
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_CLOSED",
            vector: {
                origin: {
                    x: 4,
                    y: 5
                },
                target: {
                    x: 4,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 4,
                    y: 6
                },
                target: {
                    x: 4,
                    y: 6
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 4,
                    y: 7
                },
                target: {
                    x: 4,
                    y: 11
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 4,
                    y: 12
                },
                target: {
                    x: 4,
                    y: 12
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE",
            vector: {
                origin: {
                    x: 4,
                    y: 13
                },
                target: {
                    x: 4,
                    y: 21
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_SETTER",
            vector: {
                origin: {
                    x: 4,
                    y: 22
                },
                target: {
                    x: 4,
                    y: 22
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_DECLARATION",
            vector: {
                origin: {
                    x: 4,
                    y: 23
                },
                target: {
                    x: 4,
                    y: 23
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_VALUE",
            vector: {
                origin: {
                    x: 4,
                    y: 24
                },
                target: {
                    x: 4,
                    y: 29
                }
            }
        },
        {
            type: "BUILD",
            state: "ATTRIBUTE_DECLARATION_CLOSE",
            vector: {
                origin: {
                    x: 4,
                    y: 30
                },
                target: {
                    x: 4,
                    y: 30
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_SPACE",
            vector: {
                origin: {
                    x: 4,
                    y: 31
                },
                target: {
                    x: 4,
                    y: 31
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE",
            vector: {
                origin: {
                    x: 4,
                    y: 32
                },
                target: {
                    x: 4,
                    y: 32
                }
            }
        },
        {
            type: "BUILD",
            state: "INDEPENDENT_NODE_CLOSED",
            vector: {
                origin: {
                    x: 4,
                    y: 33
                },
                target: {
                    x: 4,
                    y: 33
                }
            }
        },
        {
            type: "BUILD",
            state: "TEXT",
            vector: {
                origin: {
                    x: 4,
                    y: 34
                },
                target: {
                    x: 4,
                    y: 38
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 4,
                    y: 39
                },
                target: {
                    x: 4,
                    y: 39
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
            vector: {
                origin: {
                    x: 4,
                    y: 40
                },
                target: {
                    x: 4,
                    y: 44
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE_CLOSED",
            vector: {
                origin: {
                    x: 4,
                    y: 45
                },
                target: {
                    x: 4,
                    y: 45
                }
            }
        },
        {
            type: "BUILD",
            state: "TEXT",
            vector: {
                origin: {
                    x: 4,
                    y: 46
                },
                target: {
                    x: 4,
                    y: 47
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 4,
                    y: 48
                },
                target: {
                    x: 4,
                    y: 48
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_SLASH",
            vector: {
                origin: {
                    x: 4,
                    y: 49
                },
                target: {
                    x: 4,
                    y: 49
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_TAGNAME",
            vector: {
                origin: {
                    x: 4,
                    y: 50
                },
                target: {
                    x: 4,
                    y: 54
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_CLOSED",
            vector: {
                origin: {
                    x: 4,
                    y: 55
                },
                target: {
                    x: 4,
                    y: 55
                }
            }
        },
        {
            type: "BUILD",
            state: "TEXT",
            vector: {
                origin: {
                    x: 4,
                    y: 56
                },
                target: {
                    x: 4,
                    y: 60
                }
            }
        },
        {
            type: "INJECT",
            index: 4,
            state: "DESCENDANT_INJECTION"
        },
        {
            type: "BUILD",
            state: "TEXT",
            vector: {
                origin: {
                    x: 5,
                    y: 0
                },
                target: {
                    x: 5,
                    y: 3
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 5,
                    y: 4
                },
                target: {
                    x: 5,
                    y: 4
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_SLASH",
            vector: {
                origin: {
                    x: 5,
                    y: 5
                },
                target: {
                    x: 5,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_TAGNAME",
            vector: {
                origin: {
                    x: 5,
                    y: 6
                },
                target: {
                    x: 5,
                    y: 9
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_CLOSED",
            vector: {
                origin: {
                    x: 5,
                    y: 10
                },
                target: {
                    x: 5,
                    y: 10
                }
            }
        },
        {
            type: "BUILD",
            state: "TEXT",
            vector: {
                origin: {
                    x: 5,
                    y: 11
                },
                target: {
                    x: 5,
                    y: 13
                }
            }
        },
        {
            type: "INJECT",
            index: 5,
            state: "DESCENDANT_INJECTION"
        }
    ];
    const stack = [];
    parse(testVector, stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
const tests1 = [
    parseNodeTest,
    parseNodeWithImplicitAttributeTest,
    parseNodeWithImplicitAttributeWithSpacesTest,
    parseIndependentNodeTest,
    parseIndependentNodeWithImplicitAttributeTest,
    parseIndependentNodeWithImplicitAttributeWithSpacesTest,
    parseExplicitAttributeTest,
    parseExplicitAttributeWithSpacesTest,
    parseNodeInjectionsTest,
    parseNodeWithAttributeInjectionsTest,
    parseNodeWithAttributeMapInjectionsTest,
    parseCommentTest,
    parseErrorTest,
    parseCloseNodeErrorTest,
    parseCommentErrorTest,
    parseCloseCommentErrorTest,
    parseEmptyTest,
    parseEmptyWithInjectionTest,
    parseEmptyWithMultipleInjectionsTest,
    parseNestedTemplateWithInjectionsTest
];
const unitTestParse = {
    title: title1,
    tests: tests1,
    runTestsAsynchronously: true
};
0;
const testCollections = [
    unitTestTextVector,
    unitTestParse
];
export { testCollections as testCollections };
