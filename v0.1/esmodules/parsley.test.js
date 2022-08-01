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
        " ": "SPACE_NODE",
        "\n": "SPACE_NODE",
        "/": "0_INDEPENDENT_NODE",
        DEFAULT: "0_TAGNAME"
    },
    "0_TAGNAME_CLOSE": {
        ">": "C_NODE_CLOSE",
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
    C_NODE_CLOSE: {
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
const title = "** crawl tests **";
const testTextInterpolator = (templateArray, ...injections)=>{
    return {
        templateArray,
        injections
    };
};
const crawlExplicitAttributeTest = ()=>{
    const testVector = testTextInterpolator`<hello attribute="value"/>`;
    console.log(testVector);
    crawl(testVector);
    return [
        "fail!"
    ];
};
const crawlExplicitAttributeWithSpacesTest = ()=>{
    const testVector = testTextInterpolator`<hello  attribute="value"  />`;
    console.log(testVector);
    crawl(testVector);
    return [
        "fail!"
    ];
};
const tests = [
    crawlExplicitAttributeTest,
    crawlExplicitAttributeWithSpacesTest, 
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
