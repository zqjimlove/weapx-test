import { describe } from "../../utils/we-tdd";
import { expect } from "../../utils/chai";

const PAGE_LIFE_CYCLE = [
  "onLoad",
  "onReady",
  "onShow"
  // "onHide",
  // "onUnload",
  // "onPageWillUpdate",
  // "onPageDidUpdate"
];

const EXT_LIFECYCLE = ["onPageWillUpdate", "onPageDidUpdate"];

const getLifeCycleExtendKyes = key => {
  return [`${key}Before`, key, `${key}After`];
};

const allLifeMixinCache = {};

const genMixinsAllLifeCycleFunction = () => {
  const ret = {};
  PAGE_LIFE_CYCLE.forEach(life => {
    ret[life] = () => {
      allLifeMixinCache[life] = (allLifeMixinCache[life] || 0) + 1;
    };

    getLifeCycleExtendKyes(life).forEach(extLife => {
      ret[extLife] = () => {
        allLifeMixinCache[extLife] = (allLifeMixinCache[extLife] || 0) + 1;
      };
    });
  });
  EXT_LIFECYCLE.forEach(life => {
    ret[life] = () => {
      allLifeMixinCache[life] = (allLifeMixinCache[life] || 0) + 1;
    };
  });
  return ret;
};
export default {
  mixins: [
    {
      lifecycle: genMixinsAllLifeCycleFunction()
    },
    {
      lifecycle: genMixinsAllLifeCycleFunction()
    },
    {
      lifecycle: {
        onLoad() {
          this["mixinLifeCyclyCheckFirstSort"] = true;
          this["mixinLifeCyclyCheckSort"] = false;
          this["mixinsLifeCycleNativeOnLoadFlag"] = false;
        }
      }
    },
    {
      lifecycle: {
        onLoad() {
          this["mixinLifeCyclyCheckSort"] = true;
        }
      }
    }
  ],
  test() {
    describe("Mixin LifeCycle", it => {
      it("混入生命周期", function(done) {
        PAGE_LIFE_CYCLE.forEach(life => {
          expect(allLifeMixinCache[life]).to.be.a(
            "Number",
            `${life} 生命周期错误`
          );
          getLifeCycleExtendKyes(life).forEach(extLife => {
            expect(allLifeMixinCache[extLife]).to.be.a(
              "Number",
              `${extLife} 生命周期错误`
            );
          });
        });
        //setdata为了检查pageDidUpdate\pageWillUpdate
        this.pageCtx.setState(
          {
            test: 1
          },
          () => {
            // 由于setState后先执行回调再执行onPageDidUpdate，所以需要一个延迟操作。
            this.delay(() => {
              EXT_LIFECYCLE.forEach(life => {
                expect(allLifeMixinCache[life]).to.be.a(
                  "Number",
                  `${life} 生命周期错误`
                );
              });
              done();
            });
          }
        );
      });

      it("多次执行", function() {
        PAGE_LIFE_CYCLE.forEach(life => {
          expect(allLifeMixinCache[life]).to.be.equal(2);
        });
      });

      it("混入顺序", function() {
        expect(this.pageCtx["mixinLifeCyclyCheckSort"]).to.be.false;
        expect(this.pageCtx["mixinLifeCyclyCheckFirstSort"]).to.be.true;
        expect(this.pageCtx["mixinsLifeCycleNativeOnLoadFlag"]).to.be.false;
      });
    });
  }
};
