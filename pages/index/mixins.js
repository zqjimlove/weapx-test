let pageWillUpdateKey;
export default [
  {
    data: {
      mixinData: "Mixin data success!",
      motto: "Mixin data fail!"
    },
    methods: {
      mixinMethod() {
        console.log("Mixin methods success!");
      },
      getUserInfo() {
        console.error("Mixin methods Fail!");
      },
      onPageWillUpdate(o, n) {
        pageWillUpdateKey = Object.keys(n)[0];
        console.log("pageWillUpdate keys:", Object.keys(n).join(","));
      },
      onPageDidUpdate(o, n) {
        console.log(
          "pageDidUpdate:",
          o[pageWillUpdateKey] !== n[pageWillUpdateKey]
        );
      }
    },
    lifecycle: {
      onLoadBefore() {
        console.log("onLoad before");
      },
      onLoad() {
        console.log("mixin onLoad");
        this.setData({
          mixinData: ""
        });
        this.setData({
          mixinData: "Mixin data success!!!"
        });
        return new Promise(res => {
          setTimeout(() => {
            console.log("onLoad delay 1s");
            res();
          }, 1000);
        });
      },
      onLoadAfter() {
        console.log("onLoad after");
      }
    }
  }
];
