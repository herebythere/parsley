import type { BuilderInterface } from "../type_flyweight/parse.ts";
import type { Position } from "../type_flyweight/text_vector.ts";

import { ATTRIBUTE_VALUE,ATTRIBUTE_DECLARATION,INDEPENDENT_NODE_CLOSED,NODE_CLOSED, NODE_SPACE, TAGNAME,ATTRIBUTE_INJECTION,ATTRIBUTE_INJECTION_MAP,DESCENDANT_INJECTION, ERROR, TEXT, BUILD, INJECT, INITIAL } from "../type_flyweight/constants.ts";
import { routes } from "./routes.ts";
import { create, getChar, increment } from "../text_vector/text_vector.ts";

const DEFAULT = "DEFAULT";
const EMPTY = "";

const injectionMap = new Map([
  [ATTRIBUTE_DECLARATION, ATTRIBUTE_INJECTION],
  [ATTRIBUTE_VALUE, ATTRIBUTE_INJECTION],
  [INDEPENDENT_NODE_CLOSED, DESCENDANT_INJECTION],
  [NODE_CLOSED, DESCENDANT_INJECTION],
  [INITIAL, DESCENDANT_INJECTION],
  [NODE_SPACE, ATTRIBUTE_INJECTION_MAP],
  [TAGNAME, ATTRIBUTE_INJECTION_MAP],
  [TEXT, DESCENDANT_INJECTION],
]);

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
    // skip empty strings or state swap
    const char = getChar(template, origin);
    if (char !== undefined && char !== EMPTY) {
      prevState = currState;
      const route = routes[prevState];
      if (route) {
        currState = route[char] ?? route[DEFAULT];
      }
    }

    // build
    if (prevState !== currState) {
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
      if (prevState === TEXT || prevState === ATTRIBUTE_VALUE) {
        builder.push({
          type: BUILD,
          state: prevState,
          vector: create(prevOrigin, prevTarget),
        });

        prevOrigin.x = origin.x;
        prevOrigin.y = origin.y;
      }
      const state = injectionMap.get(prevState);
      if (state === undefined) {
        currState = ERROR;
      } else {
        builder.push({ type: INJECT, index: prevTarget.x, state });
      }
    }

    // set previous
    prevTarget.x = origin.x;
    prevTarget.y = origin.y;
  } while (increment(template, origin) && currState !== ERROR);

  // get tail end
  if (prevState === currState) return;
  if (currState === ERROR) {
    builder.push({
      type: ERROR,
      vector: create(origin, origin),
    });
    return;
  }

  builder.push({
    type: BUILD,
    state: currState,
    vector: create(origin, origin),
  });
}

export { parse };
