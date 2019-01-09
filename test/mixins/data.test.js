import { describe } from "../../utils/we-tdd";
import { expect } from "../../utils/chai";
export default {
  mixins: [
    {
      data: {
        mixinData: "1",
        motto: "world",
        _m1: true
      }
    },
    {
      data: {
        mixinData: "2",
        _m2: true
      }
    },{
      hahah:'1'
    }
  ],
  test() {
    describe("Mixin Data", it => {
      it("顺序", function() {
        expect(this.pageCtx.data.mixinData).to.equal("2");
      });
      it("赋值", function() {
        expect(this.pageCtx.data._m1).to.equal(true);
        expect(this.pageCtx.data._m2).to.equal(true);
      });
      it("保持Page的值", function() {
        expect(this.pageCtx.data.motto).to.equal("Hello");
      });
    });
  }
};
