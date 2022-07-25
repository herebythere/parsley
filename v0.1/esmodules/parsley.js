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
        "<": "0_NODE",
        "-": "0_COMMENT",
        DEFAULT: "0_TAGNAME"
    },
    "0_NODE_CLOSE": {
        " ": "TEXT",
        DEFAULT: "0_TAGNAME_CLOSE"
    },
    "0_TAGNAME": {
        ">": "C_NODE",
        " ": "SPACE_COMMENT",
        "/": "0_INDEPENDENT_NODE",
        DEFAULT: "0_TAGNAME"
    },
    "0_TAGNAME_CLOSE": {
        ">": "C_NODE_CLOSE",
        " ": "SPACE_CLOSE_NODE",
        DEFAULT: "0_TAGNAME_CLOSE"
    },
    "0_INDEPENDENT_NODE": {
        " ": "SPACE_COMMENT",
        ">": "C_INDEPENDENT_NODE",
        DEFAULT: "SPACE_COMMENT"
    },
    C_NODE: {
        "<": "0_NODE",
        DEFAULT: "TEXT"
    },
    C_INDEPENDENT_NODE: {
        "<": "0_NODE",
        DEFAULT: "TEXT"
    },
    C_NODE_CLOSE: {
        "<": "0_NODE",
        DEFAULT: "TEXT"
    },
    "SPACE_COMMENT": {
        ">": "C_NODE",
        DEFAULT: "SPACE_COMMENT"
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
    if (position.x >= templateLength && position.y >= chunkLength) {
        return;
    }
    position.y += 1;
    if (position.y > chunkLength) {
        position.x += 1;
        position.y = 0;
    }
    return position;
};
const getChar = (template, position)=>{
    return template.templateArray[position.x]?.[position.y];
};
const createFromTemplate = (template)=>{
    const last = template.templateArray.length - 1;
    const lastChunk = template.templateArray[last].length - 1;
    return {
        origin: {
            x: 0,
            y: 0
        },
        target: {
            x: last,
            y: lastChunk
        }
    };
};
const incrementOrigin = (template, vector)=>{
    if (increment(template, vector.origin)) {
        return vector;
    }
    return;
};
const hasOriginEclipsedTaraget = (vector)=>vector.origin.x >= vector.target.x && vector.origin.y >= vector.target.y;
const INITIAL = "INITIAL";
function crawl(template) {
    const templateVector = createFromTemplate(template);
    let prevPosition = {
        ...templateVector.origin
    };
    let lastChangeOrigin = {
        ...templateVector.origin
    };
    let prevState = INITIAL;
    let currState = INITIAL;
    console.log("vector:", templateVector);
    while(!hasOriginEclipsedTaraget(templateVector)){
        if (template.templateArray[templateVector.origin.x] === "") {
            console.log("skipping!");
            incrementOrigin(template, templateVector);
            continue;
        }
        const __char = getChar(template, templateVector.origin);
        if (__char === undefined) return;
        prevState = currState;
        currState = routers[prevState]?.[__char];
        if (currState === undefined) {
            currState = routers[prevState]?.["DEFAULT"];
        }
        if (prevState !== currState) {
            console.log("*** STATE_CHANGE ***", prevState, lastChangeOrigin, prevPosition);
            lastChangeOrigin = {
                ...templateVector.origin
            };
        }
        prevPosition = {
            ...templateVector.origin
        };
        incrementOrigin(template, templateVector);
    }
    const char1 = getChar(template, templateVector.origin);
    if (char1 === undefined) return;
    prevState = currState;
    currState = routers[prevState]?.[char1];
    if (currState === undefined) {
        currState = routers[prevState]?.["DEFAULT"];
    }
    if (prevState !== currState) {
        console.log("*** STATE_CHANGE ***", prevState, lastChangeOrigin, prevPosition);
        lastChangeOrigin = {
            ...templateVector.origin
        };
    }
    console.log("*** FINAL STATE_CHANGE ***", currState, prevPosition, templateVector.origin);
}
export { crawl as crawl };
