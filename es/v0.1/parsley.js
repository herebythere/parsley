// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

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
function getText(template, vector) {
    const origin = vector.origin;
    let templateText = template[origin.x];
    if (templateText === undefined) return;
    return templateText.substr(origin.y, vector.target.y - origin.y + 1);
}
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
export { getText as getText };
export { parse as parse };
