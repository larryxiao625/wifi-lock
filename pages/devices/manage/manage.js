Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[],
    hiddenmodalput: true,
    selectNum: 0,
    setPwd: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that=this;
    wx.request({
      url: 'https://www.happydoudou.xyz/public/index.php/user/getAllUsers',
      success: res=>{
        console.log(res.data);
        that.setData({
          user: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  editUserInfo: function(event){
    var that=this;
    console.log(event);
    that.setData({
      hiddenmodalput:false,
      selectNum: event.target.dataset.name.id-1
    });
    // changePwd(event.dataset.name.name,event.dataset.name.pwd,event.dataset.name.id-1,this);
  },
  pwd: function(e){
    console.log(e);
    this.setData({
      setPwd:e.detail.value
    })
  },
  confirm: function(event){
    var user = this.data.user;
    var that=this;
    user[this.data.selectNum].pwd = this.data.setPwd;
    console.log(this.data.user);
    console.log(this.data.user[this.data.selectNum].name);
    wx.request({
      url: 'https://www.happydoudou.xyz/public/index.php/user/changePwd',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        name: this.data.user[this.data.selectNum].name,
        pwd: this.data.setPwd
      },
      success: res => {
        console.log(res);
        that.setData({
          user: user,
          hiddenmodalput: true
        })
        wx.showToast({
          title: '修改成功',
        })
      },
    })
  },
  deleteUser:function(){
    var user = this.data.user;
    console.log(user);
    var that=this;
    wx.request({
      url: 'https://www.happydoudou.xyz/public/index.php/user/del',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        name: this.data.user[this.data.selectNum].name,
      },
      success:res=>{
        console.log(res);
        user.splice(that.data.selectNum,1);
        that.setData({
          user: user,
          hiddenmodalput:true
        })
      }
    })
  },
  cancel: function(){
    this.setData({
      hiddenmodalput:true
    })
  }
})