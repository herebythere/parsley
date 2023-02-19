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
const injectionStateMap = new Map([
    [
        ATTRIBUTE_DECLARATION,
        ATTRIBUTE_VALUE
    ],
    [
        ATTRIBUTE_VALUE,
        ATTRIBUTE_DECLARATION
    ],
    [
        TAGNAME,
        NODE_SPACE
    ],
    [
        ATTRIBUTE_DECLARATION_CLOSE,
        NODE_SPACE
    ],
    [
        NODE_SPACE,
        NODE_SPACE
    ],
    [
        DESCENDANT_INJECTION,
        INITIAL
    ],
    [
        CLOSE_NODE_CLOSED,
        INITIAL
    ],
    [
        INDEPENDENT_NODE_CLOSED,
        INITIAL
    ],
    [
        INITIAL,
        INITIAL
    ],
    [
        NODE_CLOSED,
        INITIAL
    ],
    [
        TEXT,
        INITIAL
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
        console.log("char:", __char);
        if (__char !== undefined) {
            prevState = currState;
            let route = routes.get(prevState);
            if (route) {
                currState = route.get(__char) ?? route.get(DEFAULT) ?? ERROR;
            }
            if (prevTarget.x < origin.x && prevState === currState) {
                const stater = injectionStateMap.get(prevState);
                if (stater) {
                    let route1 = routes.get(stater);
                    if (route1) {
                        currState = route1.get(__char) ?? route1.get(DEFAULT) ?? ERROR;
                    }
                }
            }
        }
        if (prevState !== currState || prevTarget.x < origin.x) {
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
                console.log("found an error!");
                console.log(prevState, state, __char);
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
export { getText as getText };
export { parse as parse };
export { ATTRIBUTE as ATTRIBUTE, ATTRIBUTE_DECLARATION as ATTRIBUTE_DECLARATION, ATTRIBUTE_DECLARATION_CLOSE as ATTRIBUTE_DECLARATION_CLOSE, ATTRIBUTE_INJECTION as ATTRIBUTE_INJECTION, ATTRIBUTE_INJECTION_MAP as ATTRIBUTE_INJECTION_MAP, ATTRIBUTE_SETTER as ATTRIBUTE_SETTER, ATTRIBUTE_VALUE as ATTRIBUTE_VALUE, BUILD as BUILD, CLOSE_NODE_CLOSED as CLOSE_NODE_CLOSED, CLOSE_NODE_SLASH as CLOSE_NODE_SLASH, CLOSE_NODE_SPACE as CLOSE_NODE_SPACE, CLOSE_TAGNAME as CLOSE_TAGNAME, DEFAULT as DEFAULT, DESCENDANT_INJECTION as DESCENDANT_INJECTION, ERROR as ERROR, INDEPENDENT_NODE as INDEPENDENT_NODE, INDEPENDENT_NODE_CLOSED as INDEPENDENT_NODE_CLOSED, INITIAL as INITIAL, INJECT as INJECT, NODE as NODE, NODE_CLOSED as NODE_CLOSED, NODE_SPACE as NODE_SPACE, TAGNAME as TAGNAME, TEXT as TEXT };
