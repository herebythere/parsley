// brian taylor vann
// builder

import type { Hooks } from "../type_flyweight/hooks.ts";
import type { Template } from "../type_flyweight/template.ts";
import type { RenderStructure } from "../type_flyweight/render.ts";

import { buildIntegrals } from "./build_integrals/build_integrals.ts";
import { buildSkeleton } from "./build_skeleton/build_skeleton.ts";
import { buildRender } from "./build_render/build_render.ts";

type BuildRenderStructure = <N, A>(
  hooks: Hooks<N, A>,
  template: Template<N, A>
) => RenderStructure<N, A>;

const buildRenderStructure: BuildRenderStructure = (hooks, template) => {
  const skeleton = buildSkeleton(template);
  const integrals = buildIntegrals({ template, skeleton });
  const render = buildRender({
    hooks: hooks,
    template,
    integrals,
  });

  return render;
};

export { buildRenderStructure };
