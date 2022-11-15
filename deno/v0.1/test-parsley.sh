#!/bin/bash

current_dir=`pwd`
echo $current_dir
test_file=$current_dir/../../es/v0.1/parsley.test.js


deno_jackrabbit_cli --file $test_file
