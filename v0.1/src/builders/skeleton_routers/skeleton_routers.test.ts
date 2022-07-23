// brian taylor vann
// skeleton routers

import { routers } from "./skeleton_routers.ts";

const title = "skeleton routers";
const runTestsAsynchronously = true;

const notFoundReducesCorrectState = () => {
  const assertions: string[] = [];

  if (routers["TEXT"]?.["<"] !== "NODE_0") {
    assertions.push("< should return OPENED");
  }

  if (routers["TEXT"]?.["DEFAULT"] !== "TEXT") {
    assertions.push("space should return CONTENT");
  }

  return assertions;
};

// const openedNodeReducesCorrectState = () => {
//   const assertions: string[] = [];

//   if (routers["OPENED"]?.["<"] !== "OPENED") {
//     assertions.push("< should return OPENED");
//   }

//   if (routers["OPENED"]?.["/"] !== "CLOSED") {
//     assertions.push("/ should return CLOSED");
//   }

//   if (routers["OPENED"]?.[" "] !== "CONTENT") {
//     assertions.push("space should return CONTENT");
//   }

//   if (routers["OPENED"]?.["DEFAULT"] !== "OPENED_VALID") {
//     assertions.push("space should return OPENED_VALID");
//   }

//   return assertions;
// };

// const openedNodeValidReducesCorrectState = () => {
//   const assertions: string[] = [];

//   if (routers["OPENED_VALID"]?.["<"] !== "OPENED") {
//     assertions.push("< should return OPENED");
//   }
//   if (routers["OPENED_VALID"]?.["/"] !== "INDEPENDENT_VALID") {
//     assertions.push("/ should return INDEPENDENT_VALID");
//   }
//   if (routers["OPENED_VALID"]?.[">"] !== "OPENED_FOUND") {
//     assertions.push("> should return OPENED_FOUND");
//   }
//   if (routers["OPENED_VALID"]?.['"'] !== "ATTRIBUTE") {
//     assertions.push("> should return ATTRIBUTE");
//   }
//   if (routers["OPENED_VALID"]?.["DEFAULT"] !== "OPENED_VALID") {
//     assertions.push("space should return OPENED_VALID");
//   }

//   return assertions;
// };

// const attributeReducesCorrectState = () => {
//   const assertions: string[] = [];

//   if (routers["ATTRIBUTE"]?.["\\"] !== "ATTRIBUTE_ESC_CHAR") {
//     assertions.push("\\ should return ATTRIBUTE_ESC_CHAR");
//   }
//   if (routers["ATTRIBUTE"]?.['"'] !== "OPENED_VALID") {
//     assertions.push('" should return OPENED_VALID');
//   }

//   return assertions;
// };

// const attributeEscCharReducesCorrectState = () => {
//   const assertions: string[] = [];

//   if (routers["ATTRIBUTE_ESC_CHAR"]?.["DEFAULT"] !== "ATTRIBUTE") {
//     assertions.push("DEFAULT should return ATTRIBUTE");
//   }

//   return assertions;
// };

// const independentNodeValidReducesCorrectState = () => {
//   const assertions: string[] = [];

//   if (routers["INDEPENDENT_VALID"]?.["<"] !== "OPENED") {
//     assertions.push("< should return OPENED");
//   }
//   if (routers["INDEPENDENT_VALID"]?.["DEFAULT"] !== "INDEPENDENT_VALID") {
//     assertions.push("space should return INDEPENDENT_VALID");
//   }

//   return assertions;
// };

// const closedNodeReducesCorrectState = () => {
//   const assertions: string[] = [];

//   if (routers["CLOSED"]?.["<"] !== "OPENED") {
//     assertions.push("< should return OPENED");
//   }
//   if (routers["CLOSED"]?.["DEFAULT"] !== "CLOSED_VALID") {
//     assertions.push("space should return CLOSED_VALID");
//   }
//   if (routers["CLOSED"]?.[" "] !== "CONTENT") {
//     assertions.push("space should return CONTENT");
//   }

//   return assertions;
// };

// const closedNodeValidReducesCorrectState = () => {
//   const assertions: string[] = [];

//   if (routers["CLOSED_VALID"]?.["<"] !== "OPENED") {
//     assertions.push("< should return OPENED");
//   }
//   if (routers["CLOSED_VALID"]?.[">"] !== "CLOSED_FOUND") {
//     assertions.push("> should return CLOSED_FOUND");
//   }
//   if (routers["CLOSED_VALID"]?.["DEFAULT"] !== "CLOSED_VALID") {
//     assertions.push("space should return CLOSED_VALID");
//   }

//   return assertions;
// };

const tests = [
  notFoundReducesCorrectState,
  // openedNodeReducesCorrectState,
  // openedNodeValidReducesCorrectState,
  // attributeEscCharReducesCorrectState,
  // attributeReducesCorrectState,
  // independentNodeValidReducesCorrectState,
  // closedNodeReducesCorrectState,
  // closedNodeValidReducesCorrectState,
];

const unitTestSkeletonRouters = {
  title,
  tests,
  runTestsAsynchronously,
};

export { unitTestSkeletonRouters };
