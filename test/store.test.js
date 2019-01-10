import { describe } from "../utils/we-tdd";
import { expect } from "../utils/chai";
import { createStore, runStore, watchStore } from "../weapx/weapx";
import { autorun, reaction } from "../weapx/libs/mobx";

let mapToDataTimes = 0;
let todosId = 0;
let _mapToDataTimesSwitch = false;

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

const s2 = createStore({
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
        onPageDidUpdate(arg1, arg2) {
          _mapToDataTimesSwitch && mapToDataTimes++;
        }
      }
    }
  ],
  test() {
    describe("Test Store", it => {
      it("runStore,watchStore", function(done) {
        const { pageCtx } = this;
        let runTimes = 0;
        let watchTimes = 0;

        let runer = runStore(() => {
          runTimes++;
          return pageCtx.$store.test.count;
        });

        let watcher = watchStore(
          () => {
            return pageCtx.$store.test.todos.length;
          },
          () => {
            watchTimes++;
          }
        );
        pageCtx.$store.test.appendTodos();
        this.delay(() => {
          expect(watchTimes, "watchTimes").to.be.equal(1);
          expect(runTimes, "runTimes").to.be.equal(2);
          runer();
          watcher();
          done();
        }, 500);
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
        this.delay(() => {
          _mapToDataTimesSwitch = true;
          const currentTimes = mapToDataTimes;
          pageCtx.$store.test2.setDataHi();
          this.delay(() => {
            _mapToDataTimesSwitch = false;
            expect(currentTimes).to.be.equal(mapToDataTimes);
            done();
          }, 100);
        }, 500);
      });
    });
  }
};
