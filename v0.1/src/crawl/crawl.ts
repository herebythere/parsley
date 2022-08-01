// crawl(graph, template, prevState) {}

import { Template } from "../type_flyweight/template.ts";
import {CrawlResults} from "../type_flyweight/crawl.ts"

import {routers} from "../router/routers.ts";
import {hasOriginEclipsedTaraget, createFromTemplate, create, incrementOrigin} from "../text_vector/text_vector.ts";
import {getChar} from "../text_position/text_position.ts";


const INITIAL = "INITIAL";

// states for injuections
//  attribute map
//  explicit attributes
//  children
// states for attributes
//  implicit
//  explicit
//  attribute map {...pop}
//

// 
// 
//
// node stack
// open
// tag name
// attribute
// attribute injection
// attribute

// Flush node queue
//
// C_NODE
// C_INDEPENDENT_NODE
//

// TEXT

// crawl returns
// { template, last result } ?
// 

// or a kind of file load / file save

// return 

function crawl<N, A>(template: Template<N, A>) {
    const templateVector = createFromTemplate(template);
    
    let prevPosition = {...templateVector.origin};
    let lastChangeOrigin = {...templateVector.origin};
    let prevState = INITIAL;
    let currState = INITIAL;

    console.log("vector:", templateVector);
    
    while(!hasOriginEclipsedTaraget(templateVector)) {
        if (template.templateArray[templateVector.origin.x] === ""){
            console.log("skipping!");
            incrementOrigin(template, templateVector);
            continue;
        };
        const char = getChar(template, templateVector.origin);
        if (char === undefined) return;
        
        prevState = currState;
        currState = routers[prevState]?.[char];
        if (currState === undefined) {
            currState = routers[prevState]?.["DEFAULT"];
        }

        if (prevState !== currState) {
            console.log("*** STATE_CHANGE ***", prevState, lastChangeOrigin, prevPosition);
            lastChangeOrigin = {...templateVector.origin};
        }
 
        // incrememnt ++
        prevPosition = {...templateVector.origin};
        incrementOrigin(template, templateVector);
    }

    // REPEAT

    const char = getChar(template, templateVector.origin);
    if (char === undefined) return;

    prevState = currState;
    currState = routers[prevState]?.[char];
    if (currState === undefined) {
        currState = routers[prevState]?.["DEFAULT"];
    }

    if (prevState !== currState) {
        console.log("*** STATE_CHANGE ***", prevState, lastChangeOrigin, prevPosition);
        lastChangeOrigin = {...templateVector.origin};
    }

    console.log("*** FINAL STATE_CHANGE ***", currState, prevPosition, templateVector.origin);
}

export { crawl }