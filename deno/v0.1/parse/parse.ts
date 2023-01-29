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
  const prevOrigin = { x: 0, y: 0 };
  const prevTarget = { x: 0, y: 0 };
  
  // iterate across text
  do {
    const char = getChar(template, origin);
    if (char === undefined) {
      builder.push({
        type: "ERROR",
        state: currState,
        vector: create(origin, origin),
      });
      return;
    }
 
    // skip empty strings or state swap
    if (char !== "") {
      prevState = currState;
      const route = routes[prevState];
      if (route) {
         currState = route[char] ?? route["DEFAULT"];
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
        vector: create(prevOrigin, prevTarget),
      });

      prevOrigin.x = origin.x;
      prevOrigin.y = origin.y;
    }

    // inject
    if (prevTarget.x < origin.x) {
      if (prevState === "TEXT") {
        builder.push({
          type: "BUILD",
          state: "TEXT",
          vector: create(prevOrigin, prevTarget),
        });

        prevState = currState;
        prevOrigin.x = origin.x;
        prevOrigin.y = origin.y;
      }
      const state = injectionMap.get(prevState);
      if (state) {
        builder.push({ type: "INJECT", index: prevTarget.x, state });
      } else {
        builder.push({
          type: "ERROR",
          state: prevState,
          vector: create(origin, origin),
        });
      }
    }

    // set previous
    prevTarget.x = origin.x;
    prevTarget.y = origin.y;
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
