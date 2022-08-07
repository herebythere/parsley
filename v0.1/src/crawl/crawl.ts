// crawl(graph, template, prevState) {}

import { Template } from "../type_flyweight/template.ts";
import { CrawlResults, Atom } from "../type_flyweight/crawl.ts";

import { routers } from "../router/router.ts";
import { createFromTemplate, create, incrementOrigin, copy, getChar, create as copyPos } from "../text_vector/text_vector.ts";
// import {  } from "../text_position/text_position.ts";
import { Vector } from "../type_flyweight/text_vector.ts";
import { Position } from "../type_flyweight/text_vector.ts";

const partMap = new Map([
    ["TEXT_COMMENT", "COMMENT"],
    ["TEXT", "TEXT"],
    ["0_TAGNAME", "NODE"],
    ["ATTRIBUTE", "ATTRIBUTE"],
    ["0_ATTRIBUTE_VALUE", "ATTRIBUTE_VALUE"],
    ["0_TAGNAME_CLOSE", "POP_NODE_NAMED"],
    ["C_INDEPENDENT_NODE", "POP_NODE"],
]);

const injectionMap = new Map([
    ["0_TAGNAME", "ATTRIBUTE_INJECTION_MAP"],
    ["SPACE_NODE", "ATTRIBUTE_INJECTION_MAP"],
    ["ATTRIBUTE_DECLARATION", "ATTRIBUTE_INJECTION"],
    ["C_NODE", "DESCENDANT_INJECTION"],
    ["C_INDEPENDENT_NODE", "DESCENDANT_INJECTION"],
    ["TEXT", "DESCENDANT_INJECTION"]

]);

interface NodeStep {
    type: 'build';
    state: string;
    vector: Vector;
}

interface InjectionStep {
    type: 'injection';
    state: string;
    index: number;
}

type BuildStep = NodeStep | InjectionStep;

interface ResultsBuilderInterface {
    push(buildStep: BuildStep): void;
    // done(): void;
}

interface DeltaCrawl {
    prevPos: Position;
    origin: Position;
    prevState: string;
    state: string;
    vector: Vector;
}

class ResultsBuilder implements ResultsBuilderInterface {
    builderStack: BuildStep[] = [];

    push(buildStep: BuildStep) {
        // console.log("state:", state);
        this.builderStack.push(buildStep);
    }
}

function deltaCrawl<N, A>(
    template: Template<N, A>,
    builder: ResultsBuilderInterface,
    delta: DeltaCrawl,
) {
    const vec = delta.vector;
    const char = getChar(template, vec.origin);
    if (char === undefined) return;

    delta.prevState = delta.state;
    delta.state = routers[delta.prevState]?.[char];
    if (delta.state === undefined) {
        delta.state = routers[delta.prevState]?.["DEFAULT"];
    }

    const state = partMap.get(delta.prevState);

    // build
    if (delta.prevState !== delta.state) {
        const origin = { ...delta.origin };
        const target = { ...delta.prevPos };

        builder.push({ type: 'build', state: delta.prevState, vector: { origin, target } });

        delta.origin.x = vec.origin.x;
        delta.origin.y = vec.origin.y;
    };

    // injections
    if (delta.prevPos.x < vec.origin.x) {
        const injection = injectionMap.get(delta.prevState);
        if (state === "TEXT") {
            builder.push({type: 'build', state: "TEXT", vector: {origin: {...delta.origin}, target: {...delta.prevPos}}});

            delta.prevState = delta.state;
            delta.origin.x = vec.origin.x;
            delta.origin.y = vec.origin.y;
        }

        if (injection) {
            builder.push({type: 'injection', state: injection, index: delta.prevPos.x});
        }
    }

    delta.prevPos.x = vec.origin.x;
    delta.prevPos.y = vec.origin.y;
}

function crawl<N, A>(
    template: Template<N, A>,
    builder: ResultsBuilderInterface,
    delta: DeltaCrawl,
) {
    do {deltaCrawl(template, builder, delta);}
    while (incrementOrigin(template, delta.vector));
};

export type { DeltaCrawl }

export { crawl, ResultsBuilder }