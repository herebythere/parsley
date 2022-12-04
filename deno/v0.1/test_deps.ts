// brian talor vann
//
// test deps:
// - jackrabbit

/*
  jackrabbit cli

  An example of how to make a cli for other projects.

  Developers should have control over:
  	- imports
  	- logs (callbacks)
  	- how tests are run
*/
export type { ImporterInterface } from "https://raw.githubusercontent.com/herebythere/jackrabbit/main/deno/v0.1/core/mod.ts";

export {
  Config,
  Logger,
  run,
} from "https://raw.githubusercontent.com/herebythere/jackrabbit/main/deno/v0.1/cli/mod.ts";

export { samestuff } from "https://raw.githubusercontent.com/herebythere/jackrabbit/main/deno/v0.1/core/utils/samestuff.ts";
