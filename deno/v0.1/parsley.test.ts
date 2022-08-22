// brian taylor vann
// parsley test


// import { unitTestContext } from "./chunk/chunk.test.ts";
// import { unitTestSkeletonCrawl } from "./builders/skeleton_crawl/skeleton_crawl.test.ts";
import { unitTestCrawl } from "./parse/parse.test.ts";

import { unitTestBuildFragment } from "./fragment_builder/fragment.test.ts";
// import { unitTestTagNameCrawl } from "./builders/tag_name_crawl/tag_name_crawl.test.ts";
import { unitTestTestHooks } from "./test_hooks/test_hooks.test.ts";
import { unitTestTextVector } from "./text_vector/text_vector.test.ts";
// import { unitTestStructureBuilder } from "./structure_builder/structure_builder.test.ts";

const tests = [
  // unitTestAttributeCrawl,
  // unitTestBuildIntegrals,
  // unitTestBuildRender,
  // unitTestBuildSkeleton,
  // unitTestContext,
  // unitTestSkeletonCrawl,
  // unitTestCrawl,
  unitTestBuildFragment
  // unitTestTagNameCrawl,
  // unitTestTestHooks,
  // unitTestStructureBuilder,
  // unitTestTextPosition,
  // unitTestTextVector,
];

export { tests };
