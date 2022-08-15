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
        " ": "NODE",
        "\n": "NODE",
        "/": "NODE_CLOSE",
        ">": "ERROR",
        "-": "COMMENT_0",
        DEFAULT: "TAGNAME"
    },
    NODE_CLOSE: {
        " ": "NODE_CLOSE",
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
        ">": "CLOSE_NODE",
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
        "\"": "ATTRIBUTE_DECLARATION",
        "\n": "SPACE_NODE",
        DEFAULT: "SPACE_NODE"
    },
    ATTRIBUTE_DECLARATION: {
        "\"": "CLOSE_ATTRIBUTE_DECLARATION",
        DEFAULT: "ATTRIBUTE_VALUE"
    },
    ATTRIBUTE_VALUE: {
        "\"": "CLOSE_ATTRIBUTE_DECLARATION",
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
const getText = (template, vector)=>{
    let templateText = template.templateArray[vector.origin.x];
    if (templateText === undefined) return;
    const texts = [];
    const targetX = vector.target.x;
    const originX = vector.origin.x;
    const xDistance = targetX - originX;
    if (xDistance < 0) return;
    if (xDistance === 0) {
        const yDistance = vector.target.y - vector.origin.y + 1;
        return templateText.substr(vector.origin.y, yDistance);
    }
    const firstDistance = templateText.length - vector.origin.y;
    const first = templateText.substr(vector.origin.y, firstDistance);
    texts.push(first);
    const bookend = targetX - 2;
    let index = originX + 1;
    while(index < bookend){
        const piece = template.templateArray[index];
        if (piece === undefined) return;
        texts.push(piece);
        index += 1;
    }
    const lastTemplate = template.templateArray[targetX];
    if (lastTemplate === undefined) return;
    let last = lastTemplate.substr(0, vector.target.y + 1);
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
    ], 
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
        if (delta.prevState !== delta.state) {
            const vector = create(delta.origin, delta.prevPos);
            const value = getText(template, vector);
            if (value === undefined) {
                delta.state = "ERROR";
                return;
            }
            builder.push({
                type: "BUILD",
                state: delta.prevState,
                value,
                vector
            });
            delta.origin.x = delta.vector.origin.x;
            delta.origin.y = delta.vector.origin.y;
        }
        if (delta.prevPos.x < delta.vector.origin.x) {
            if (delta.prevState === "TEXT") {
                const vector1 = create(delta.origin, delta.prevPos);
                const value1 = getText(template, vector1);
                if (value1 === undefined) {
                    delta.state = "ERROR";
                    return;
                }
                builder.push({
                    type: "BUILD",
                    state: "TEXT",
                    value: value1,
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
    if (delta.state === "ERROR" || delta.prevState === delta.state) return;
    const vector2 = create(delta.origin, delta.origin);
    const value2 = getText(template, vector2);
    if (value2 === undefined) {
        delta.state = "ERROR";
        return;
    }
    builder.push({
        type: "BUILD",
        state: delta.state,
        value: value2,
        vector: vector2
    });
}
new Set([
    "TAGNAME",
    "ATTRIBUTE_VALUE",
    "ATTRIBUTE",
    "NODE_CLOSE",
    "CLOSE_INDEPENDENT_NODE",
    "CLOSE_NODE",
    "CLOSE_TAGNAME",
    "TEXT"
]);
const createFragment = ()=>{
    return {
        injections: [],
        references: new Map(),
        siblings: []
    };
};
const createNode = (hooks, rs, stack, step)=>{
    if (step.type !== "BUILD") return;
    console.log("createNode:");
    const parentNodes = stack.nodes[stack.nodes.length - 2];
    const parentNode = parentNodes?.[(parentNodes.length ?? 1) - 1];
    const rowNodes = stack.nodes[stack.nodes.length - 1];
    const leftNode = rowNodes?.[(rowNodes.length ?? 1) - 1];
    const descendant = hooks.createNode(step.value);
    console.log(parentNodes);
    console.log(rowNodes);
    console.log(parentNode, leftNode, descendant);
    hooks.insertDescendant(descendant, parentNode, leftNode);
    const length = stack.nodes[stack.nodes.length - 1]?.push(descendant);
    if (length === undefined) {
        stack.nodes.push([
            descendant
        ]);
    }
    if (stack.nodes.length === 1) {
        rs.siblings.push(descendant);
    }
};
const buildFragment = (hooks, reader, rs, stack)=>{
    reader.reset();
    let step = reader.next();
    while(step){
        console.log("step:", step);
        if (step.type === "BUILD") {
            if (step.state === "TAGNAME") {
                console.log("build node:");
                createNode(hooks, rs, stack, step);
            }
        }
        if (step.type === "INJECT") {}
        step = reader.next();
    }
};
export { crawl as crawl };
export { buildFragment as buildFragment, createFragment as createFragment };
