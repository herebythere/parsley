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
    const chunk = template[position.x];
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
    if (str.length === 0) return "";
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
    if (templateText) {
        return templateText.substr(origin.y, vector.target.y - origin.y + 1);
    }
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
const ATTRIBUTE = "ATTRIBUTE";
const ATTRIBUTE_DECLARATION = "ATTRIBUTE_DECLARATION";
const ATTRIBUTE_DECLARATION_CLOSE = "ATTRIBUTE_DECLARATION_CLOSE";
const ATTRIBUTE_SETTER = "ATTRIBUTE_SETTER";
const ATTRIBUTE_VALUE = "ATTRIBUTE_VALUE";
const CLOSE_NODE_SLASH = "CLOSE_NODE_SLASH";
const CLOSE_NODE_SPACE = "CLOSE_NODE_SPACE";
const CLOSE_NODE_CLOSED = "CLOSE_NODE_CLOSED";
const CLOSE_TAGNAME = "CLOSE_TAGNAME";
const ERROR = "ERROR";
const INDEPENDENT_NODE = "INDEPENDENT_NODE";
const INDEPENDENT_NODE_CLOSED = "INDEPENDENT_NODE_CLOSED";
const NODE = "NODE";
const NODE_CLOSED = "NODE_CLOSED";
const NODE_SPACE = "NODE_SPACE";
const TAGNAME = "TAGNAME";
const TEXT = "TEXT";
const ATTRIBUTE_INJECTION = "ATTRIBUTE_INJECTION";
const DESCENDANT_INJECTION = "DESCENDANT_INJECTION";
const ATTRIBUTE_INJECTION_MAP = "ATTRIBUTE_INJECTION_MAP";
const INITIAL = "INITIAL";
const BUILD = "BUILD";
const INJECT = "INJECT";
const DEFAULT = "DEFAULT";
const INIITAL_MAP = new Map([
    [
        "<",
        NODE
    ],
    [
        DEFAULT,
        TEXT
    ]
]);
const NODE_MAP = new Map([
    [
        " ",
        ERROR
    ],
    [
        "\n",
        ERROR
    ],
    [
        "\t",
        ERROR
    ],
    [
        "/",
        CLOSE_NODE_SLASH
    ],
    [
        ">",
        ERROR
    ],
    [
        DEFAULT,
        TAGNAME
    ]
]);
const CLOSE_NODE_SLASH_MAP = new Map([
    [
        " ",
        ERROR
    ],
    [
        "\n",
        ERROR
    ],
    [
        "\t",
        ERROR
    ],
    [
        DEFAULT,
        CLOSE_TAGNAME
    ]
]);
const TAGNAME_MAP = new Map([
    [
        ">",
        NODE_CLOSED
    ],
    [
        " ",
        NODE_SPACE
    ],
    [
        "\n",
        NODE_SPACE
    ],
    [
        "\t",
        NODE_SPACE
    ],
    [
        "/",
        INDEPENDENT_NODE
    ],
    [
        DEFAULT,
        TAGNAME
    ]
]);
const CLOSE_TAGNAME_MAP = new Map([
    [
        ">",
        CLOSE_NODE_CLOSED
    ],
    [
        " ",
        CLOSE_NODE_SPACE
    ],
    [
        "\n",
        CLOSE_NODE_SPACE
    ],
    [
        "\t",
        CLOSE_NODE_SPACE
    ],
    [
        DEFAULT,
        CLOSE_TAGNAME
    ]
]);
const CLOSE_NODE_SPACE_MAP = new Map([
    [
        ">",
        CLOSE_NODE_CLOSED
    ],
    [
        DEFAULT,
        CLOSE_NODE_SPACE
    ]
]);
const INDEPENDENT_NODE_MAP = new Map([
    [
        ">",
        INDEPENDENT_NODE_CLOSED
    ],
    [
        DEFAULT,
        INDEPENDENT_NODE
    ]
]);
const NODE_SPACE_MAP = new Map([
    [
        ">",
        NODE_CLOSED
    ],
    [
        " ",
        NODE_SPACE
    ],
    [
        "\n",
        NODE_SPACE
    ],
    [
        "\t",
        NODE_SPACE
    ],
    [
        "/",
        INDEPENDENT_NODE
    ],
    [
        DEFAULT,
        ATTRIBUTE
    ]
]);
const ATTRIBUTE_MAP = new Map([
    [
        " ",
        NODE_SPACE
    ],
    [
        "\n",
        NODE_SPACE
    ],
    [
        "\t",
        NODE_SPACE
    ],
    [
        "=",
        ATTRIBUTE_SETTER
    ],
    [
        ">",
        NODE_CLOSED
    ],
    [
        "/",
        INDEPENDENT_NODE
    ],
    [
        DEFAULT,
        ATTRIBUTE
    ]
]);
const ATTRIBUTE_SETTER_MAP = new Map([
    [
        '"',
        ATTRIBUTE_DECLARATION
    ],
    [
        "\n",
        NODE_SPACE
    ],
    [
        DEFAULT,
        NODE_SPACE
    ]
]);
const ATTRIBUTE_DECLARATION_MAP = new Map([
    [
        '"',
        ATTRIBUTE_DECLARATION_CLOSE
    ],
    [
        DEFAULT,
        ATTRIBUTE_VALUE
    ]
]);
const ATTRIBUTE_VALUE_MAP = new Map([
    [
        '"',
        ATTRIBUTE_DECLARATION_CLOSE
    ],
    [
        DEFAULT,
        ATTRIBUTE_VALUE
    ]
]);
const ATTRIBUTE_DECLARATION_CLOSE_MAP = new Map([
    [
        ">",
        INDEPENDENT_NODE_CLOSED
    ],
    [
        "/",
        INDEPENDENT_NODE
    ],
    [
        DEFAULT,
        NODE_SPACE
    ]
]);
const routes = new Map([
    [
        INITIAL,
        INIITAL_MAP
    ],
    [
        TEXT,
        INIITAL_MAP
    ],
    [
        NODE,
        NODE_MAP
    ],
    [
        CLOSE_NODE_SLASH,
        CLOSE_NODE_SLASH_MAP
    ],
    [
        TAGNAME,
        TAGNAME_MAP
    ],
    [
        CLOSE_TAGNAME,
        CLOSE_TAGNAME_MAP
    ],
    [
        CLOSE_NODE_SPACE,
        CLOSE_NODE_SPACE_MAP
    ],
    [
        INDEPENDENT_NODE,
        INDEPENDENT_NODE_MAP
    ],
    [
        NODE_CLOSED,
        INIITAL_MAP
    ],
    [
        CLOSE_NODE_CLOSED,
        INIITAL_MAP
    ],
    [
        INDEPENDENT_NODE_CLOSED,
        INIITAL_MAP
    ],
    [
        NODE_SPACE,
        NODE_SPACE_MAP
    ],
    [
        ATTRIBUTE,
        ATTRIBUTE_MAP
    ],
    [
        ATTRIBUTE_SETTER,
        ATTRIBUTE_SETTER_MAP
    ],
    [
        ATTRIBUTE_DECLARATION,
        ATTRIBUTE_DECLARATION_MAP
    ],
    [
        ATTRIBUTE_VALUE,
        ATTRIBUTE_VALUE_MAP
    ],
    [
        ATTRIBUTE_DECLARATION_CLOSE,
        ATTRIBUTE_DECLARATION_CLOSE_MAP
    ]
]);
const injectionMap = new Map([
    [
        ATTRIBUTE_DECLARATION,
        ATTRIBUTE_INJECTION
    ],
    [
        ATTRIBUTE_VALUE,
        ATTRIBUTE_INJECTION
    ],
    [
        NODE_SPACE,
        ATTRIBUTE_INJECTION_MAP
    ],
    [
        ATTRIBUTE_DECLARATION_CLOSE,
        ATTRIBUTE_INJECTION_MAP
    ],
    [
        TAGNAME,
        ATTRIBUTE_INJECTION_MAP
    ],
    [
        CLOSE_NODE_CLOSED,
        DESCENDANT_INJECTION
    ],
    [
        INDEPENDENT_NODE_CLOSED,
        DESCENDANT_INJECTION
    ],
    [
        INITIAL,
        DESCENDANT_INJECTION
    ],
    [
        NODE_CLOSED,
        DESCENDANT_INJECTION
    ],
    [
        TEXT,
        DESCENDANT_INJECTION
    ]
]);
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
        if (__char !== undefined) {
            prevState = currState;
            let route = routes.get(prevState);
            if (route) {
                currState = route.get(__char) ?? route.get(DEFAULT) ?? ERROR;
            }
        }
        if (prevState !== currState) {
            builder.push({
                type: BUILD,
                state: prevState,
                vector: create(prevOrigin, prevTarget)
            });
            prevOrigin.x = origin.x;
            prevOrigin.y = origin.y;
        }
        if (prevTarget.x < origin.x) {
            const state = injectionMap.get(prevState);
            if (state === undefined) {
                currState = ERROR;
            } else {
                builder.push({
                    type: INJECT,
                    index: prevTarget.x,
                    state
                });
            }
        }
        prevTarget.x = origin.x;
        prevTarget.y = origin.y;
    }while (increment(template, origin) && currState !== ERROR)
    if (prevState === currState) return;
    builder.push({
        type: BUILD,
        state: currState,
        vector: create(origin, origin)
    });
}
const title1 = "** parse tests **";
function testTextInterpolator1(templateArray, ...injections) {
    return templateArray;
}
function parseLinearInjectionsTest() {
    const assertions = [];
    const textVector = testTextInterpolator1`${"a_head"}<a><b></b></a>${"a_tail"}`;
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
            state: "TEXT",
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
            state: "TAGNAME",
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
            state: "NODE_CLOSED",
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
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 1,
                    y: 3
                },
                target: {
                    x: 1,
                    y: 3
                }
            }
        },
        {
            type: "BUILD",
            state: "TAGNAME",
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
            state: "NODE_CLOSED",
            vector: {
                origin: {
                    x: 1,
                    y: 5
                },
                target: {
                    x: 1,
                    y: 5
                }
            }
        },
        {
            type: "BUILD",
            state: "NODE",
            vector: {
                origin: {
                    x: 1,
                    y: 6
                },
                target: {
                    x: 1,
                    y: 6
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_SLASH",
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
        },
        {
            type: "BUILD",
            state: "CLOSE_TAGNAME",
            vector: {
                origin: {
                    x: 1,
                    y: 8
                },
                target: {
                    x: 1,
                    y: 8
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_CLOSED",
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
            state: "NODE",
            vector: {
                origin: {
                    x: 1,
                    y: 10
                },
                target: {
                    x: 1,
                    y: 10
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_SLASH",
            vector: {
                origin: {
                    x: 1,
                    y: 11
                },
                target: {
                    x: 1,
                    y: 11
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_TAGNAME",
            vector: {
                origin: {
                    x: 1,
                    y: 12
                },
                target: {
                    x: 1,
                    y: 12
                }
            }
        },
        {
            type: "BUILD",
            state: "CLOSE_NODE_CLOSED",
            vector: {
                origin: {
                    x: 1,
                    y: 13
                },
                target: {
                    x: 1,
                    y: 13
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
            state: "TEXT",
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
        }
    ];
    const stack = [];
    parse(textVector, stack);
    console.log(stack);
    if (!samestuff(expectedResults, stack)) {
        assertions.push("stack does not match expected results");
    }
    return assertions;
}
const tests1 = [
    parseLinearInjectionsTest
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
