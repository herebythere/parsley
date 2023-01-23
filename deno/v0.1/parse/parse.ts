import type { BuilderInterface, Delta } from "../type_flyweight/parse.ts";
import type { Template } from "../type_flyweight/template.ts";

import { routes } from "./routes.ts";
import {
  create,
  getChar,
  incrementOrigin,
} from "../text_vector/text_vector.ts";

const injectionMap = new Map([
  ["TAGNAME", "ATTRIBUTE_INJECTION_MAP"],
  ["SPACE_NODE", "ATTRIBUTE_INJECTION_MAP"],
  ["ATTRIBUTE_DECLARATION", "ATTRIBUTE_INJECTION"],
  ["CLOSE_NODE", "DESCENDANT_INJECTION"],
  ["CLOSE_INDEPENDENT_NODE", "DESCENDANT_INJECTION"],
  ["TEXT", "DESCENDANT_INJECTION"],
]);

// previous state
function parse<N, A>(
  template: Template<N, A>,
  builder: BuilderInterface,
  // previous state
  delta: Delta,
) {
  // iterate across text
  do {
    const char = getChar(template, delta.vector.origin);
    if (char === undefined) return;

    // state swap
    delta.prevState = delta.state;
    delta.state = routes[delta.prevState]?.[char];
    if (delta.state === undefined) {
      delta.state = routes[delta.prevState]?.["DEFAULT"] ?? "ERROR";
    }
    if (delta.state === "ERROR") return;

    // build
    if (delta.prevState !== delta.state) {
      const vector = create(delta.origin, delta.prevPos);
      builder.push({ type: "BUILD", state: delta.prevState, vector });

      delta.origin.x = delta.vector.origin.x;
      delta.origin.y = delta.vector.origin.y;
    }

    // inject
    if (delta.prevPos.x < delta.vector.origin.x) {
      if (delta.prevState === "TEXT") {
        const vector = create(delta.origin, delta.prevPos);
        builder.push({ type: "BUILD", state: "TEXT", vector });

        delta.prevState = delta.state;
        delta.origin.x = delta.vector.origin.x;
        delta.origin.y = delta.vector.origin.y;
      }

      const state = injectionMap.get(delta.prevState);
      if (state) {
        builder.push({ type: "INJECT", index: delta.prevPos.x, state });
      }
    }

    // set previous
    delta.prevPos.x = delta.vector.origin.x;
    delta.prevPos.y = delta.vector.origin.y;
  } while (delta.state !== "ERROR" && incrementOrigin(template, delta.vector));

  // get tail end
  if (delta.prevState === delta.state || delta.state === "ERROR") return;

  const vector = create(delta.origin, delta.origin);

  builder.push({
    type: "BUILD",
    state: delta.state,
    vector,
  });
}

export { parse };
