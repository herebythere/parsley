'use strict';

// brian taylor vann
// parsley test
Object.defineProperty(exports, "__esModule", { value: true });
exports.tests = void 0;
const attribute_crawl_test_1 = require("./builders/attribute_crawl/attribute_crawl.test");
const build_integrals_test_1 = require("./builders/build_integrals/build_integrals.test");
const build_render_test_1 = require("./builders/build_render/build_render.test");
const build_skeleton_test_1 = require("./builders/build_skeleton/build_skeleton.test");
const chunk_test_1 = require("./chunk/chunk.test");
const skeleton_crawl_test_1 = require("./builders/skeleton_crawl/skeleton_crawl.test");
const skeleton_routers_test_1 = require("./builders/skeleton_routers/skeleton_routers.test");
const tag_name_crawl_test_1 = require("./builders/tag_name_crawl/tag_name_crawl.test");
const test_hooks_test_1 = require("./test_hooks/test_hooks.test");
const text_position_test_1 = require("./text_position/text_position.test");
const text_vector_test_1 = require("./text_vector/text_vector.test");
const tests = [
    attribute_crawl_test_1.unitTestAttributeCrawl,
    build_integrals_test_1.unitTestBuildIntegrals,
    build_render_test_1.unitTestBuildRender,
    build_skeleton_test_1.unitTestBuildSkeleton,
    chunk_test_1.unitTestContext,
    skeleton_crawl_test_1.unitTestSkeletonCrawl,
    skeleton_routers_test_1.unitTestSkeletonRouters,
    tag_name_crawl_test_1.unitTestTagNameCrawl,
    test_hooks_test_1.unitTestTestHooks,
    text_position_test_1.unitTestTextPosition,
    text_vector_test_1.unitTestTextVector,
];
exports.tests = tests;
