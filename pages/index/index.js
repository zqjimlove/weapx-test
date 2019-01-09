//index.js
//获取应用实例
import tddTest from "../../test/index";
const app = getApp();
const tddMixins = tddTest();
import { describe, setPageCtx } from "../../utils/we-tdd";
Page({
  mixins: tddMixins,
  data: {
    motto: "Hello"
  },
  onLoad() {
    setPageCtx(this);
    this.mixinsLifeCycleNativeOnLoadFlag = true;
  }
});
