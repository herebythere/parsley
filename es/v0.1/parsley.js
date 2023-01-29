// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

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
        DEFAULT: "COMMENT"
    }
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
function incrementOrigin(template, vector) {
    if (increment(template, vector.origin)) return vector;
}
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
function parse(template, builder, delta) {
    do {
        const __char = getChar(template, delta.vector.origin);
        if (__char === undefined) return;
        if (__char !== "") {
            delta.prevState = delta.state;
            delta.state = routes[delta.prevState]?.[__char];
            if (delta.state === undefined) {
                delta.state = routes[delta.prevState]?.["DEFAULT"] ?? "ERROR";
            }
            if (delta.state === "ERROR") {
                return;
            }
        }
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
export { parse as parse };
