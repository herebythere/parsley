#!/bin/bash

current_dir=`dirname $0`

target_pathname=$current_dir/test-parsley.ts

# deno run --reload --allow-read $target_pathname --file ./mod.test.ts
deno run --allow-read $target_pathname --file ./mod.test.ts
