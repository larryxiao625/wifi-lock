//app.js
App({
  globalData:{

  },
  onLaunch: function (options) {
    this.globalData.sysinfo = wx.getSystemInfoSync();
    wx.cloud.init({
      env: "clock-saek9"
    });
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: 'junye-sign-0bhda',
        traceUser: true,
      })
      wx.cloud.callFunction(
        {
          name: "login",
          data: {},
          success: res => {
            console.log("login调用成功" + res.result.openid),
              this.globalData.openid = res.result.openid
          }
        }
      )

    }
  },
  getModel: function () {
    return this.globalData.sysinfo["model"]
  },
  getVersion: function () {
    return this.globalData.sysinfo["version"]
  },
  getSystem: function () {
    return this.globalData.sysinfo["system"]
  },
  getPlatform: function () {
    return this.globalData.sysinfo["platform"]
  },
  getSDKVersion: function () {
    return this.globalData.sysinfo["SDKVersion"]
  },
  getWindowWidth: function () {
    return this.globalData.sysinfo["windowWidth"]
  },
  getWindowHeight: function () {
    return this.globalData.sysinfo["windowHeight"]
  }
})