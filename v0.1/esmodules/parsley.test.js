// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const routers = {
    TEXT: {
        "<": "NODE_0",
        DEFAULT: "TEXT"
    },
    NODE_0: {
        " ": "TEXT",
        "\n": "TEXT",
        "/": "TEXT",
        ">": "TEXT",
        "<": "NODE_0",
        "-": "COMMENT_0",
        DEFAULT: "NODE_1"
    }
};
const title = "skeleton routers";
const text_states = ()=>{
    const assertions = [];
    if (routers["TEXT"]["<"] !== "NODE_0") {
        assertions.push("< should return OPENED");
    }
    if (routers["TEXT"]["DEFAULT"] !== "TEXT") {
        assertions.push("space should return TEXT");
    }
    return assertions;
};
const node_0_states = ()=>{
    const assertions = [];
    if (routers["NODE_0"][" "] !== "TEXT") {
        assertions.push("space should return TEXT");
    }
    if (routers["NODE_0"]["\n"] !== "TEXT") {
        assertions.push("< should return TEXT");
    }
    if (routers["NODE_0"]["/"] !== "TEXT") {
        assertions.push("< should return OPENED");
    }
    if (routers["NODE_0"][">"] !== "TEXT") {
        assertions.push("< should return OPENED");
    }
    if (routers["NODE_0"]["<"] !== "NODE_0") {
        assertions.push("space should return NODE_0");
    }
    if (routers["NODE_0"]["DEFAULT"] !== "NODE_1") {
        assertions.push("space should return NODE_!");
    }
    if (routers["NODE_0"]["-"] !== "COMMENT_0") {
        assertions.push("< should return COMMENT_0");
    }
    return assertions;
};
const tests = [
    text_states,
    node_0_states, 
];
const unitTestSkeletonRouters = {
    title,
    tests,
    runTestsAsynchronously: true
};
const tests1 = [
    unitTestSkeletonRouters, 
];
export { tests1 as tests };
