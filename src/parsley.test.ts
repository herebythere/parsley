// brian taylor vann
// parsley test

import { unitTestAttributeCrawl } from "./builders/attribute_crawl/attribute_crawl.test";
import { unitTestBuildIntegrals } from "./builders/build_integrals/build_integrals.test";
import { unitTestBuildRender } from "./builders/build_render/build_render.test";
import { unitTestBuildSkeleton } from "./builders/build_skeleton/build_skeleton.test";
import { unitTestContext } from "./chunk/chunk.test";
import { unitTestSkeletonCrawl } from "./builders/skeleton_crawl/skeleton_crawl.test";
import { unitTestSkeletonRouters } from "./builders/skeleton_routers/skeleton_routers.test";
import { unitTestTagNameCrawl } from "./builders/tag_name_crawl/tag_name_crawl.test";
import { unitTestTestHooks } from "./test_hooks/test_hooks.test";
import { unitTestTextPosition } from "./text_position/text_position.test";
import { unitTestTextVector } from "./text_vector/text_vector.test";

const tests = [
  unitTestAttributeCrawl,
  unitTestBuildIntegrals,
  unitTestBuildRender,
  unitTestBuildSkeleton,
  unitTestContext,
  unitTestSkeletonCrawl,
  unitTestSkeletonRouters,
  unitTestTagNameCrawl,
  unitTestTestHooks,
  unitTestTextPosition,
  unitTestTextVector,
];

export { tests };
