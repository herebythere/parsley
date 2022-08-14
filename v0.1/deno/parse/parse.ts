import type { Delta, BuilderInterface } from "../type_flyweight/crawl.ts";
import type { Template } from "../type_flyweight/template.ts";

import { routers } from "./router.ts";
import { incrementOrigin, getChar, create, getText } from "../text_vector/text_vector.ts";

const injectionMap = new Map([
    ["TAGNAME", "ATTRIBUTE_INJECTION_MAP"],
    ["SPACE_NODE", "ATTRIBUTE_INJECTION_MAP"],
    ["ATTRIBUTE_DECLARATION", "ATTRIBUTE_INJECTION"],
    ["CLOSE_NODE", "DESCENDANT_INJECTION"],
    ["CLOSE_INDEPENDENT_NODE", "DESCENDANT_INJECTION"],
    ["TEXT", "DESCENDANT_INJECTION"],
]);

function crawl<N, A>(
    template: Template<N, A>,
    builder: BuilderInterface,
    delta: Delta,
) {
    // iterate across text
    do {
        const char = getChar(template, delta.vector.origin);
        if (char === undefined) return;

        // state swap
        delta.prevState = delta.state;
        delta.state = routers[delta.prevState]?.[char];
        if (delta.state === undefined) {
            delta.state = routers[delta.prevState]?.["DEFAULT"] ?? "ERROR";
        }

        // build
        if (delta.prevState !== delta.state) {
            const vector = create(delta.origin, delta.prevPos);
            const value = getText(template, vector);
            builder.push({ type: 'build', state: delta.prevState, value, vector });

            delta.origin.x = delta.vector.origin.x;
            delta.origin.y = delta.vector.origin.y;
        };

        // inject
        if (delta.prevPos.x < delta.vector.origin.x) {
            if (delta.prevState === "TEXT") {
                const vector = create(delta.origin, delta.prevPos);
                const value = getText(template, vector);
                builder.push({ type: 'build', state: "TEXT", value, vector });

                delta.prevState = delta.state;
                delta.origin.x = delta.vector.origin.x;
                delta.origin.y = delta.vector.origin.y;
            }

            const state = injectionMap.get(delta.prevState);
            if (state) {
                builder.push({ type: 'inject', index: delta.prevPos.x, state });
            }
        }

        // set previous
        delta.prevPos.x = delta.vector.origin.x;
        delta.prevPos.y = delta.vector.origin.y;
    }
    while (delta.state !== "ERROR" && incrementOrigin(template, delta.vector));

    // get tail end
    if (delta.state === "ERROR" || delta.prevState === delta.state) return;

    const vector = create(delta.origin, delta.origin);
    const value = getText(template, vector);
    builder.push({
        type: 'build',
        state: delta.state,
        value,
        vector,
    });
};

export type { Delta }

export { crawl }