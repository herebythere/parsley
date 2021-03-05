export default [
  {
    input: "./build/parsley/src/parsley.js",
    output: {
      file: "./esmodules/parsley.js",
      format: "es",
    },
  },
  {
    input: './build/parsley/src/parsley.test.js',
    output: {
      file: './esmodules/parsley.test.js',
      format: "es",
    }
  },
  {
    input: "./build-nodejs/parsley.js",
    output: {
      file: "./nodejs/parsley.js",
      format: "cjs",
    },
  },
  {
    input: './build-nodejs/parsley.test.js',
    output: {
      file: './nodejs/parsley.test.js',
      format: "cjs",
    }
  },
];