import type { BuilderInterface } from "../type_flyweight/parse.ts";
import type { Position } from "../type_flyweight/text_vector.ts";

import {
  ATTRIBUTE_DECLARATION,
  ATTRIBUTE_DECLARATION_CLOSE,
  ATTRIBUTE_INJECTION,
  ATTRIBUTE_MAP_INJECTION,
  ATTRIBUTE_VALUE,
  BUILD,
  CLOSE_NODE_CLOSED,
  DEFAULT,
  DESCENDANT_INJECTION,
  ERROR,
  INDEPENDENT_NODE_CLOSED,
  INITIAL,
  INJECT,
  NODE_CLOSED,
  NODE_SPACE,
  TAGNAME,
  TEXT,
} from "../type_flyweight/constants.ts";
import { routes } from "./routes.ts";
import { create, getChar, increment } from "../text_vector/text_vector.ts";

const injectionMap = new Map([
  // attributes
  [ATTRIBUTE_DECLARATION, ATTRIBUTE_INJECTION],
  [ATTRIBUTE_VALUE, ATTRIBUTE_INJECTION],
  // attribute maps
  [NODE_SPACE, ATTRIBUTE_MAP_INJECTION],
  [ATTRIBUTE_DECLARATION_CLOSE, ATTRIBUTE_MAP_INJECTION],
  [TAGNAME, ATTRIBUTE_MAP_INJECTION],
  // descendants
  [CLOSE_NODE_CLOSED, DESCENDANT_INJECTION],
  [INDEPENDENT_NODE_CLOSED, DESCENDANT_INJECTION],
  [INITIAL, DESCENDANT_INJECTION],
  [NODE_CLOSED, DESCENDANT_INJECTION],
  [TEXT, DESCENDANT_INJECTION],
]);

function parse(
  template: Readonly<string[]>,
  builder: BuilderInterface,
  prev: string = INITIAL,
) {
  let prevState: string = prev;
  let currState: string = prev;

  const origin = { x: 0, y: 0 };
  const prevOrigin = { x: 0, y: 0 };
  const prevTarget = { x: 0, y: 0 };

  // iterate across text
  do {
    // state swap
    const char = getChar(template, origin);
    //console.log("char:", char)
    if (char !== undefined) {
      prevState = currState;

      let route = routes.get(prevState);
      if (route) {
        currState = route.get(char) ?? route.get(DEFAULT) ?? ERROR;
      }
    }

    // build
    if (prevState !== currState || prevTarget.x < origin.x) {
      // if injection state change preious state
      builder.push({
        type: BUILD,
        state: prevState,
        vector: create(prevOrigin, prevTarget),
      });

      prevOrigin.x = origin.x;
      prevOrigin.y = origin.y;
    }

    // inject
    if (prevTarget.x < origin.x) {
      const state = injectionMap.get(prevState);
      if (state !== undefined) {
        builder.push({ type: INJECT, index: prevTarget.x, state });
      }
    }

    // set previous
    prevTarget.x = origin.x;
    prevTarget.y = origin.y;
  } while (increment(template, origin) && currState !== ERROR);

  // get tail end
  builder.push({
    type: BUILD,
    state: currState,
    vector: create(origin, origin),
  });
}

export { parse };
