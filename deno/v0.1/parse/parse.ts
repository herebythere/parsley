import type { BuilderInterface, Delta } from "../type_flyweight/parse.ts";
import type { Template } from "../type_flyweight/template.ts";

import { routes } from "./routes.ts";
import {
  create,
  getChar,
  incrementOrigin,
} from "../text_vector/text_vector.ts";

const injectionMap = new Map([
	["ATTRIBUTE_DECLARATION", "ATTRIBUTE_INJECTION"],
	["CLOSE_INDEPENDENT_NODE", "DESCENDANT_INJECTION"],
	["CLOSE_NODE", "DESCENDANT_INJECTION"],
	["INITIAL", "DESCENDANT_INJECTION"],
	["NODE_SPACE", "ATTRIBUTE_INJECTION_MAP"],
	["TAGNAME", "ATTRIBUTE_INJECTION_MAP"],
	["TEXT", "DESCENDANT_INJECTION"],
]);

// special case "" empty string between injections
// just do ptrevious state

// previous state
function parse<I>(
  template: Template<I>,
  builder: BuilderInterface,
  // previous state
  delta: Delta,
) {
  // iterate across text
  do {
  	console.log("getChar", delta.vector.origin);
    const char = getChar(template, delta.vector.origin);
    // if (char === undefined) continue;
    if (char === undefined) return;
    
		if (char !== "") {
		  // state swap
		  delta.prevState = delta.state;
		  delta.state = routes[delta.prevState]?.[char];
		  if (delta.state === undefined) {
		    delta.state = routes[delta.prevState]?.["DEFAULT"] ?? "ERROR";
		  }
		  if (delta.state === "ERROR") return;
    }
    
    // build
    if (delta.prevState !== delta.state) {
      const vector = create(delta.origin, delta.prevPos);
      builder.push({ type: "BUILD", state: delta.prevState, vector });

      delta.origin.x = delta.vector.origin.x;
      delta.origin.y = delta.vector.origin.y;
    }

    // inject
    if (delta.prevPos.x < delta.vector.origin.x) {
    	console.log("made it to injections!");
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

	console.log("doing something at the end!");
	console.log(delta);
	// this could be an injection state
  const vector = create(delta.origin, delta.origin);

  builder.push({
    type: "BUILD",
    state: delta.state,
    vector,
  });
}

export { parse };
