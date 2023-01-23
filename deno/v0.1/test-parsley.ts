import type { ImporterInterface } from "./test_deps.ts";

import { Config, Logger, run } from "./test_deps.ts";

class Importer implements ImporterInterface {
  async load(filename: string): Promise<Collection[]> {
    const { testCollections } = await import(filename);
    return testCollections;
  }
}

const config = new Config(Deno.args);
const importer = new Importer();
const logger = new Logger(config);

run(config, importer, logger);
