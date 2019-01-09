import mixinsDataTest from "./mixins/data.test";

const tests = [
  require("./mixins/data.test"),
  require("./mixins/methods.test"),
  require("./mixins/lifecycle.test"),
  require("./store.test"),
  require("./setDataQueue.test")
];

export default function() {
  const mixins = [];
  const testFns = [];

  tests.forEach(testReq => {
    const test = testReq.default;
    mixins.push(...(test.mixins || []));
    testFns.push(test.test);
  });

  return [
    {
      lifecycle: {
        onReadyAfter() {
          testFns.forEach(fn => {
            fn.bind(this)();
          });
        }
      }
    },
    ...mixins
  ];
}
