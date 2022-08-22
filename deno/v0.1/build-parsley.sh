#!/bin/bash

curr_dir=`dirname $0`
ts_config=$curr_dir/tsconfig.json

parsley=$curr_dir/deno/parsley.ts
parsley_test=$curr_dir/deno/parsley.test.ts

parsley_es=$curr_dir/../../es/v0.1/parsley.js
parsley_test_es=$curr_dir/../../es/v0.1parsley.test.js

# deno cache --reload ./deno/parsley.ts

deno bundle --config $ts_config $parsley $parsley_es 
deno bundle --config $ts_config $parsley_test $parsley_test_es 