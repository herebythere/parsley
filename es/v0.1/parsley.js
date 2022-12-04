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
const incrementOrigin = (template, vector)=>{
    if (increment(template, vector.origin)) {
        return vector;
    }
    return;
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
export { crawl as crawl };
