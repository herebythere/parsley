#!/bin/bash

curr_dir=`dirname $0`

parsley=$curr_dir/mod.ts
parsley_test=$curr_dir/mod.test.ts

es_dir=$curr_dir/../../es/v0.1
es_pathname=$es_dir/parsley.js
es_test_parsley=$es_dir/parsley.test.js

deno bundle $parsley $es_pathname 
deno bundle $parsley_test $es_test_parsley

deno fmt $current_dir
deno fmt $es_dir
