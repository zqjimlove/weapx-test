let testList = [];
let pageCtx;
let pendingIt = 0;
let renderTimer;

let itId = 0;

let currentIt;

class It {
  static DONE = "done";
  static IDEL = "idel";
  static PEDDING = "pedding";
  constructor(desc, itemDesc, itemTestFn, timeout = 5000) {
    this.desc = desc;
    this.itemDesc = itemDesc;
    this.itemTestFn = itemTestFn;
    this.timeout = timeout;
    this.pageCtx = pageCtx;
    this.status = It.IDEL;
    this.__id = ++itId;
    this.sync = true;
    this.execute();
  }
  execute() {
    this.status = It.PEDDING;
    const paramsLen = this.itemTestFn.length;
    if (paramsLen) {
      this.sync = false;
      this._asyncExecute();
    } else {
      this._syncExecute();
    }
  }
  _syncExecute() {
    const { itemTestFn } = this;
    try {
      itemTestFn.bind(this)();
      this.success();
    } catch (e) {
      this.fail(e);
    } finally {
      this.status = It.DONe;
    }
  }
  _asyncExecute() {
    const { itemTestFn, desc, itemDesc } = this;
    this.pedding();

    this._asyncTimeoutTimer = setTimeout(() => {
      this.fail({ message: `${desc}#${itemDesc}:超时` });
    }, this.timeout);

    const done = () => {
      if (this.status === It.DONe) return;
      clearTimeout(this._asyncTimeoutTimer);
      this.success();
    };

    try {
      itemTestFn.bind(this)(done);
    } catch (e) {
      this.fail(e);
    }
  }
  delay(exceute, delay) {
    setTimeout(() => {
      try {
        exceute();
      } catch (e) {
        this.fail(e);
      }
    }, delay);
  }
  success() {
    this._done();
    this._pushInTasksList(1);
  }
  fail(e) {
    console.error(e.message);
    this._done();
    this._pushInTasksList(-1);
  }
  _done() {
    if (!this.sync) {
      this.unpedding();
      clearTimeout(this._asyncTimeoutTimer);
    }
    this.status = It.DONe;
  }
  pedding() {
    this._pushInTasksList(0);
    pendingIt++;
  }
  unpedding() {
    testList = testList.filter(test => {
      return test.id !== this.__id;
    });
    pendingIt--;
  }
  _pushInTasksList(status) {
    renderTimer && clearTimeout(renderTimer);
    const { desc, itemDesc, __id } = this;
    testList.push({
      id: __id,
      desc,
      itemDesc,
      status
    });
    renderTimer = setTimeout(() => {
      let list = testList.concat();

      list = list.sort(function(a, b) {
        if (a.status < 1 || b.status < 1) {
          return a.status - b.status;
        }
        return b.id - a.id;
      });
      pageCtx.setData({
        testList: list
      });
    });
  }
}

export function describe(desc, describeFn) {
  const itF = function(itemdesc, itemTestFn, timeout = 5000) {
    const it = new It(desc, itemdesc, itemTestFn, timeout);
  };
  describeFn(itF);
}

export function setPageCtx(ctx) {
  pageCtx = ctx;
}
