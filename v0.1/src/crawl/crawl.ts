// crawl(graph, template, prevState) {}

import { Template } from "../type_flyweight/template.ts";
import {CrawlResults} from "../type_flyweight/crawl"

import {routers} from "../crawl/crawl.ts";
import {createFromTemplate} from "../text_vector/text_vector.ts";


// generative way could be somethinglike
// load file
// line / chunk
// convert to segment
// reference to last chunk
// crawl
//
// write steps
// carry onver

// prev pos
// curr pos

// increment origin

// have a push pop sieve

// push starts with 0 || CONFIRMED

// pop starts with CONFIRMED

// lets see if theres some kind of pattern to find


// somehting to "get text"

// atom is created maybe

// integral from atom

// something to "record integrals"

// 

function crawl<N, A>(template: Template<N, A>, prevCrawl: CrawlResults) {
    // start from previous crawl state
    //
    //



    // [] integrals
    
    // get text vector

    // while vector has not eclipsed
    //   prev position
    //   curr positoin
    //
    //   prev state !== new state
    //     push to integrals
}

export { crawl }