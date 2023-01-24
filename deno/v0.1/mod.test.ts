// brian taylor vann
// parsley test

import { unitTestTextVector } from "./text_vector/text_vector.test.ts";
import { unitTestParse } from "./parse/parse.test.ts";

const testCollections = [
  unitTestTextVector,
  // unitTestParse,
];

export { testCollections };
