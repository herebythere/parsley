#!/bin/bash

deno cache --reload ./src/parsley.ts

deno bundle --config ./tsconfig.json ./src/parsley.ts ./esmodules/parsley.js 
deno bundle --config ./tsconfig.json ./src/parsley.test.ts ./esmodules/parsley.test.js 