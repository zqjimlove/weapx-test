import { describe } from "../utils/we-tdd";
import { expect } from "../utils/chai";

let __startTest = false;
let __startTestRepeatSetSameValueTest = false;
let pageUpdated = false;
let sameValueTestPageDidUpdateFlag = false;

export default {
  mixins: [
    {
      data: {
        _setText: {
          a: {
            a1: "a1"
          },
          b: {
            b1: "b1"
          }
        },
        arrayTest: [
          {
            a: "1"
          }
        ],
        sameValueTestFlag: 1
      },
      methods: {
        shouldPageUpdate(update) {
          return !(update.testDataQueueStopUpdate === true);
        }
      },
      lifecycle: {
        onPageDidUpdate() {
          if (__startTest) {
            pageUpdated = true;
          }
          if (__startTestRepeatSetSameValueTest) {
            sameValueTestPageDidUpdateFlag = true;
          }
        }
      }
    }
  ],
  test() {
    describe("Set Data Queue", it => {
      __startTest = true;
      it("基础", function(done) {
        const { pageCtx } = this;
        const callbackMap = {};

        pageCtx.setState(
          {
            "_setText.a": {
              a1: "a3"
            },
            "arrayTest[0].a": 2
          },
          () => {
            callbackMap[1] = true;
          }
        );
        pageCtx.setState(
          {
            "_setText.a.a1": "a2"
          },
          () => {
            callbackMap[2] = true;
          }
        );
        pageCtx.setState(
          {
            _setText: {
              b: {
                b1: "b2"
              }
            }
          },
          () => {
            callbackMap[3] = true;
          }
        );
        expect(callbackMap[1]).to.be.undefined;
        expect(callbackMap[2]).to.be.undefined;
        expect(callbackMap[3]).to.be.undefined;
        this.delay(() => {
          expect(callbackMap[1]).to.be.true;
          expect(callbackMap[2]).to.be.true;
          expect(callbackMap[3]).to.be.true;
          expect(pageCtx.data._setText).to.be.a("Object");
          expect(pageCtx.data._setText.a).to.be.undefined;
          expect(pageCtx.data._setText.b.b1).to.be.equal("b2");
          done();
        }, 100);
      });

      it("不可立即获取data", function() {
        this.pageCtx.setState({
          testDataQueue: true
        });
        expect(this.pageCtx.data.testDataQueue).to.be.undefined;
        expect(pageUpdated).to.be.false;
      });

      it("setState回调", function(done) {
        this.pageCtx.setState(
          {
            testDataQueueCallBack: true
          },
          () => {
            expect(this.pageCtx.data.testDataQueueCallBack).to.be.true;
            done();
          }
        );
      });

      it("延迟更新页面", function(done) {
        this.pageCtx.setState({
          testDataQueueDelayUpdate: true
        });
        expect(pageUpdated).to.be.false;
        this.delay(() => {
          expect(pageUpdated).to.be.true;
          done();
        }, 100);
      });

      it("setState阻止更新", function(done) {
        const { pageCtx } = this;
        this.delay(() => {
          pageCtx.setState({
            testDataQueueShouldUpdateFlag: 1,
            testDataQueueStopUpdate: true
          });

          const c1Prm = new Promise((resolve, reject) => {
            this.delay(() => {
              expect(pageCtx.data.testDataQueueStopUpdate).to.be.undefined;
              expect(pageCtx.data.testDataQueueShouldUpdateFlag).to.be
                .undefined;
              pageCtx.setState(
                {
                  testDataQueueStopUpdate: false
                },
                () => {
                  resolve();
                }
              );
            }, 100);
          });

          c1Prm
            .then(() => {
              return new Promise((resolve, reject) => {
                try {
                  expect(
                    pageCtx.data.testDataQueueStopUpdate,
                    "testDataQueueStopUpdate"
                  ).to.be.false;
                  expect(
                    pageCtx.data.testDataQueueShouldUpdateFlag
                  ).to.be.equal(1);
                  resolve();
                } catch (e) {
                  reject(e);
                }
              });
            })
            .then(done);
        }, 500);
      });

      it("setState 重复值不刷新", function(done) {
        const { pageCtx } = this;
        this.delay(() => {
          __startTestRepeatSetSameValueTest = true;
          pageCtx.setState(
            {
              sameValueTestFlag: 1
            },
            () => {
              __startTestRepeatSetSameValueTest = false;
              pageCtx.setState(
                {
                  sameValueTestFlag: 2
                },
                () => {
                  expect(sameValueTestPageDidUpdateFlag).to.be.false;
                  expect(pageCtx.data.sameValueTestFlag).to.be.equal(2);
                  done();
                }
              );
            }
          );
        }, 300);
      });
      
    });
  }
};
