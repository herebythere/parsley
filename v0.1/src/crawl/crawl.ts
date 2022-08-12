import type { DeltaCrawl, BuildStep, BuilderInterface } from "../type_flyweight/crawl.ts";

import { Template } from "../type_flyweight/template.ts";
import { routers } from "../router/router.ts";
import { incrementOrigin, getChar } from "../text_vector/text_vector.ts";

const injectionMap = new Map([
    ["TAGNAME", "ATTRIBUTE_INJECTION_MAP"],
    ["SPACE_NODE", "ATTRIBUTE_INJECTION_MAP"],
    ["ATTRIBUTE_DECLARATION", "ATTRIBUTE_INJECTION"],
    ["C_NODE", "DESCENDANT_INJECTION"],
    ["C_INDEPENDENT_NODE", "DESCENDANT_INJECTION"],
    ["TEXT", "DESCENDANT_INJECTION"]

]);

function deltaCrawl<N, A>(
    template: Template<N, A>,
    builder: BuilderInterface,
    delta: DeltaCrawl,
) {
    const vec = delta.vector;
    const char = getChar(template, vec.origin);
    if (char === undefined) return;

    // state swap, could be cleaner
    delta.prevState = delta.state;
    delta.state = routers[delta.prevState]?.[char];
    if (delta.state === undefined) {
        delta.state = routers[delta.prevState]?.["DEFAULT"] ?? "ERROR";
    }

    // build
    if (delta.prevState !== delta.state) {
        const vector = {
            origin: { ...delta.origin },
            target: { ...delta.prevPos },
        };
        builder.push({ type: 'build', state: delta.prevState, vector });

        delta.origin.x = vec.origin.x;
        delta.origin.y = vec.origin.y;
    };

    // injections
    if (delta.prevPos.x < vec.origin.x) {
        const state = injectionMap.get(delta.prevState);
        if (delta.prevState === "TEXT") {
            const vector = { 
                origin: { ...delta.origin },
                target: { ...delta.prevPos }
            };

            builder.push({ type: 'build', state: "TEXT", vector });

            delta.prevState = delta.state;
            delta.origin.x = vec.origin.x;
            delta.origin.y = vec.origin.y;
        }

        if (state) {
            builder.push({ type: 'injection', index: delta.prevPos.x, state });
        }
    }

    delta.prevPos.x = vec.origin.x;
    delta.prevPos.y = vec.origin.y;
}

function crawl<N, A>(
    template: Template<N, A>,
    builder: BuilderInterface,
    delta: DeltaCrawl,
) {
    do { deltaCrawl(template, builder, delta); }
    while (incrementOrigin(template, delta.vector));

    if (delta.prevState === delta.state) return;

    builder.push({ 
        type: 'build',
        state: delta.state,
        vector: {
            origin: { ...delta.vector.origin },
            target: { ...delta.vector.origin },
        },
    });
};

export type { DeltaCrawl }

export { crawl }