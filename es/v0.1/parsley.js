// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

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
    if (str === undefined || str.length === 0) return;
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
    if (templateText) {
        return templateText.substr(origin.y, vector.target.y - origin.y + 1);
    }
}
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
        "/": CLOSE_NODE_SLASH,
        ">": ERROR,
        DEFAULT: TAGNAME
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
        DEFAULT: TAGNAME
    },
    CLOSE_TAGNAME: {
        ">": CLOSE_NODE_CLOSED,
        " ": CLOSE_NODE_SPACE,
        "\n": CLOSE_NODE_SPACE,
        "\t": CLOSE_NODE_SPACE,
        DEFAULT: CLOSE_TAGNAME
    },
    CLOSE_NODE_SPACE: {
        ">": CLOSE_NODE_CLOSED,
        DEFAULT: CLOSE_NODE_SPACE
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
        "=": ATTRIBUTE_SETTER,
        ">": NODE_CLOSED,
        "/": INDEPENDENT_NODE,
        DEFAULT: ATTRIBUTE
    },
    ATTRIBUTE_SETTER: {
        '"': ATTRIBUTE_DECLARATION,
        "\n": NODE_SPACE,
        DEFAULT: NODE_SPACE
    },
    ATTRIBUTE_DECLARATION: {
        '"': ATTRIBUTE_DECLARATION_CLOSE,
        DEFAULT: ATTRIBUTE_VALUE
    },
    ATTRIBUTE_VALUE: {
        '"': ATTRIBUTE_DECLARATION_CLOSE,
        DEFAULT: ATTRIBUTE_VALUE
    },
    ATTRIBUTE_DECLARATION_CLOSE: {
        ">": INDEPENDENT_NODE_CLOSED,
        "/": INDEPENDENT_NODE,
        DEFAULT: NODE_SPACE
    }
};
const injectionMap = new Map([
    [
        "ATTRIBUTE_DECLARATION",
        "ATTRIBUTE_INJECTION"
    ],
    [
        "ATTRIBUTE_VALUE",
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
const DEFAULT = "DEFAULT";
const BUILD = "BUILD";
const INJECT = "INJECT";
const EMPTY = "";
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
        if (__char !== undefined && __char !== EMPTY) {
            prevState = currState;
            const route = routes[prevState];
            if (route) {
                currState = route[__char] ?? route[DEFAULT];
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
            if (prevState === TEXT || prevState === ATTRIBUTE_VALUE) {
                builder.push({
                    type: BUILD,
                    state: prevState,
                    vector: create(prevOrigin, prevTarget)
                });
                prevOrigin.x = origin.x;
                prevOrigin.y = origin.y;
            }
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
    if (currState === ERROR) {
        builder.push({
            type: ERROR,
            vector: create(origin, origin)
        });
        return;
    }
    builder.push({
        type: BUILD,
        state: currState,
        vector: create(origin, origin)
    });
}
export { getText as getText };
export { parse as parse };
export { NODE as NODE, TAGNAME as TAGNAME, ATTRIBUTE as ATTRIBUTE, ATTRIBUTE_SETTER as ATTRIBUTE_SETTER, ATTRIBUTE_DECLARATION as ATTRIBUTE_DECLARATION, ATTRIBUTE_VALUE as ATTRIBUTE_VALUE, ATTRIBUTE_DECLARATION_CLOSE as ATTRIBUTE_DECLARATION_CLOSE, TEXT as TEXT, ERROR as ERROR, NODE_SPACE as NODE_SPACE, NODE_CLOSED as NODE_CLOSED, INDEPENDENT_NODE as INDEPENDENT_NODE, INDEPENDENT_NODE_CLOSED as INDEPENDENT_NODE_CLOSED, CLOSE_NODE_SLASH as CLOSE_NODE_SLASH, CLOSE_TAGNAME as CLOSE_TAGNAME, CLOSE_NODE_SPACE as CLOSE_NODE_SPACE, CLOSE_NODE_CLOSED as CLOSE_NODE_CLOSED };
