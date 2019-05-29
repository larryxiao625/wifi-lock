// pages/login/login.js
Page({

  /**
   * Page initial data
   */
  data: {
    isScuess: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hasUserInfo: false,
    userInfo: {},
    name: "用户名",
    stuId: "密码"
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    var app=getApp();
    wx.request({
      url:"",
      header:{
        'content-type': 'form-data'
      },
      data:{
        openid:app.globalData.openid
      },
      success:res=>{
        if(res==0){
          wx.switchTab({
            url: 'pages/devices/index/index',
          })
        }else{

        }
      }
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  bindButtonTap: function(){
    
  }
})