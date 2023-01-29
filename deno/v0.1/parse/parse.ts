import type { BuilderInterface } from "../type_flyweight/parse.ts";
import type { Vector } from "../type_flyweight/text_vector.ts";

import { routes } from "./routes.ts";
import { create, getChar, increment } from "../text_vector/text_vector.ts";

const injectionMap = new Map([
  ["ATTRIBUTE_DECLARATION", "ATTRIBUTE_INJECTION"],
  ["INDEPENDENT_NODE_CLOSED", "DESCENDANT_INJECTION"],
  ["NODE_CLOSED", "DESCENDANT_INJECTION"],
  ["INITIAL", "DESCENDANT_INJECTION"],
  ["NODE_SPACE", "ATTRIBUTE_INJECTION_MAP"],
  ["TAGNAME", "ATTRIBUTE_INJECTION_MAP"],
  ["TEXT", "DESCENDANT_INJECTION"],
]);

const INITIAL = "INITIAL";

function parse(
  template: TemplateStringsArray,
  builder: BuilderInterface,
  prev: string = INITIAL,
) {
  let prevState: string = prev;
  let currState: string = prevState;

  const origin = { x: 0, y: 0 };
  const prevPos = { ...origin };
  const prevOrigin = { ...origin };

  // iterate across text
  do {
    const char = getChar(template, origin);
    if (char === undefined) return;

    // skip empty strings or state swap
    if (char !== "") {
      prevState = currState;
      currState = routes[prevState]?.[char];
      if (currState === undefined) {
        currState = routes[prevState]?.["DEFAULT"] ?? "ERROR";
      }
      if (currState === "ERROR") {
        builder.push({
          type: "ERROR",
          state: prevState,
          vector: create(origin, origin),
        });
        return;
      }
    }

    // build
    if (prevState !== currState) {
      builder.push({
        type: "BUILD",
        state: prevState,
        vector: create(prevOrigin, prevPos),
      });

      prevOrigin.x = origin.x;
      prevOrigin.y = origin.y;
    }

    // inject
    if (prevPos.x < origin.x) {
      if (prevState === "TEXT") {
        builder.push({
          type: "BUILD",
          state: "TEXT",
          vector: create(prevOrigin, prevPos),
        });

        prevState = currState;
        prevOrigin.x = origin.x;
        prevOrigin.y = origin.y;
      }
      const injstate = injectionMap.get(prevState);
      if (injstate) {
        builder.push({ type: "INJECT", index: prevPos.x, state: injstate });
      }
    }

    // set previous
    prevPos.x = origin.x;
    prevPos.y = origin.y;
  } while (increment(template, origin));

  // get tail end
  if (prevState === currState) return;
  builder.push({
    type: "BUILD",
    state: currState,
    vector: create(origin, origin),
  });
}

export { parse };
