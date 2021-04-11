// brian taylor vann
// builder

import type { Hooks } from "../type_flyweight/hooks.ts";
import type { Template } from "../type_flyweight/template.ts";
import type { RenderStructure } from "../type_flyweight/render.ts";
import type { Integrals } from "../type_flyweight/integrals.ts";
import { buildIntegrals } from "./build_integrals/build_integrals.ts";
import { buildSkeleton } from "./build_skeleton/build_skeleton.ts";
import { buildRender } from "./build_render/build_render.ts";

type BuildCache = Record<string, Integrals>;

type BuildRenderStructure = <N, A>(
  hooks: Hooks<N, A>,
  template: Template<N, A>
) => RenderStructure<N, A>;

const builds: BuildCache = {};

const buildRenderStructure: BuildRenderStructure = (hooks, template) => {
  // get template as string
  // check get integrals
  const cacheable = template.templateArray.join();

  let integrals = builds[cacheable];
  if (integrals === undefined) {
    const skeleton = buildSkeleton(template);
    integrals = buildIntegrals({ template, skeleton });
    builds[cacheable] = integrals;
  }

  // add integrals to cache if not exists
  const render = buildRender({
    hooks,
    template,
    integrals,
  });

  return render;
};

export { buildRenderStructure };
