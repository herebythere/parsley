import { Hooks } from "../type_flyweight/hooks";
import { Template } from "../type_flyweight/template";
import { RenderStructure } from "../type_flyweight/render";

import { buildIntegrals } from "./build_integrals/build_integrals";
import { buildSkeleton } from "./build_skeleton/build_skeleton";
import { buildRender } from "./build_render/build_render";

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
