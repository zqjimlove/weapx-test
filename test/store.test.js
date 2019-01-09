import { describe } from "../utils/we-tdd";
import { expect } from "../utils/chai";
import { createStore } from "../weapx/weapx";

import { autorun, observable } from "../weapx/libs/mobx";

let mapToDataTimes = 0;
let todosId = 0;

const store = createStore({
  name: "test",
  state: {
    todos: [],
    today: {
      a: 1
    }
  },
  getter: {
    count() {
      return this.todos.length;
    },
    todayA() {
      return this.today.a;
    }
  },
  actions: {
    appendTodos() {
      this.todos.push({
        id: ++todosId
      });
    },
    resetToDay(a) {
      this.today.a = a;
    }
  },
  methods: {
    pushTodo() {
      this.todos.push({
        id: ++todosId
      });
    }
  }
});

createStore({
  name: "test2",
  state: {
    data: {}
  },
  actions: {
    setDataHi() {
      this.data.hi = "hello weapx";
    }
  }
});

export default {
  mixins: [
    {
      storeMapData: {
        todosCount: store => store.test.count,
        today: store => store.test.todayA
      },
      lifecycle: {
        // onPageDidUpdate() {
        //   mapToDataTimes++;
        // }
      }
    }
  ],
  test() {
    describe("Test Store", it => {
      it("store初始化", function() {
        const { pageCtx } = this;
        const testStore = pageCtx.$store.test;
        expect(pageCtx.$store).not.to.be.undefined;
        expect(pageCtx.$store.test).not.to.be.undefined;
      });
      it("store更新", function() {
        const { pageCtx } = this;
        expect(pageCtx.$store.test.count).to.be.equal(0);
        pageCtx.$store.test.appendTodos();
        expect(pageCtx.$store.test.count).to.be.equal(1);
      });
      it("store禁止直接修改state", function() {
        const { pageCtx } = this;
        function _u() {
          pageCtx.$store.test.todos.push({});
        }
        expect(_u).to.throw();
      });
      it("storeMapData更新", function(done) {
        const { pageCtx } = this;
        const prev = pageCtx.data.todosCount;
        pageCtx.$store.test.appendTodos();

        pageCtx.$store.test.resetToDay(20);

        pageCtx.setState(
          {
            _: 0
          },
          () => {
            expect(prev).not.to.be.equal(pageCtx.data.todosCount);
            expect(pageCtx.data.todosCount > prev).to.be.true;
            expect(pageCtx.data.today).to.be.equal(20);
            done();
          }
        );
      });
      it("storeMapData污染日志", function(done) {
        const { pageCtx } = this;
        //多次delay为了避免被其他的setData影响
        this.delay(() => {
          const currentTimes = mapToDataTimes;
          pageCtx.$store.test2.setDataHi();
          this.delay(() => {
            expect(currentTimes).to.be.equal(mapToDataTimes);
            done();
          }, 500);
        }, 500);
      });
    });
  }
};
