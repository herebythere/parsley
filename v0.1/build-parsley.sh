#!/bin/bash

curr_dir=`dirname $0`
ts_config=$curr_dir/tsconfig.json

parsley=$curr_dir/src/parsley.ts
parsley_test=$curr_dir/src/parsley.test.ts

parsley_es=$curr_dir/esmodules/parsley.js
parsley_test_es=$curr_dir/esmodules/parsley.test.js

# deno cache --reload ./src/parsley.ts

deno bundle --config $ts_config $parsley $parsley_es 
deno bundle --config $ts_config $parsley_test $parsley_test_es 