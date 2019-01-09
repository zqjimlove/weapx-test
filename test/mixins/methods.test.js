import { describe } from "../../utils/we-tdd";
import { expect } from "../../utils/chai";
export default {
  mixins: [
    {
      methods: {
        mixinTest() {
          return 1;
        },
        checkMixinMethodsThis() {
          this["checkMixinMethodsThis"] = true;
        }
      }
    },
    {
      methods: {
        mixinTest() {
          return 2;
        }
      }
    }
  ],
  test() {
    describe("Mixin Methods", it => {
      it("顺序&赋值", function() {
        expect(this.pageCtx.mixinTest()).to.equal(2);
      });

      it("作用域", function() {
        this.pageCtx.checkMixinMethodsThis();
        expect(this.pageCtx["checkMixinMethodsThis"]).to.equal(true);
        expect(this.pageCtx.data.__webviewId__, "检查Page的webviewId是否存在")
          .not.to.be.undefined;
      });
    });
  }
};
