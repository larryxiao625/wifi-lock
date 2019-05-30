// pages/devices/show/show.js
import Tools from '../../../utils/tools.js';

const Tls = new Tools();
const md5 = require('../../../utils/md5.min.js');
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isAdmin: true,
    hiddenmodalput:true,
    name: "",
    oriDeviceId: "",
    connectedId: "",
    bluetoothMac: "",
    connectedDeviceId: "",
    connected: true,
    serviceId: "",
    qoe: "充足",
    openDoorNum: 0,
    connectBleName: "请连接WIFI",
    code: "",
    name: "",
    lastDate: "",
    turnOff: false,
    setName: "",
    setPwd: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let that = this;
    wx.getConnectedWifi({
      success:res=>{
        that.setData({
          connectBleName: res.wifi.SSID
        })
      }
    })
    setInterval(()=>{
      wx.request({
        url: 'https://www.happydoudou.xyz/public/index.php/lock/getLock',
        success: res => {
          console.log(res);
          that.setData({
            openDoorNum: res.data.length
          })
        }
      })
    },3000)

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


  handleBLEMessage: function (msg) {
    console.log(msg)
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


  settingFinger: function () {
    let that = this
    wx.showToast({
      title: '请输入指纹',
      image: "../../../images/warn.png"
    })
  },

  settingPassword: function () {
    let that = this
    wx.showToast({
      title: '请设置密码',
      image: "../../../images/warn.png"
    })
  },

  settingICCard: function () {
    let that = this
    wx.navigateTo({
      url: '../../../pages/devices/manage/manage',
    })
  },

  bleOpenDoor: function () {
    let that = this
    console.log(getApp().globalData.openid);
    wx.request({
      url: 'https://www.happydoudou.xyz/public/index.php/lock/open',
      data:{
        openid: getApp().globalData.openid
      },
      header:{
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success(res){
        if(res.data==0){
          wx.showToast({
            title: '开锁成功',
          })
        }else{
          wx.showToast({
            title: '开锁失败',
            image: "../../../images/warn.png"
          })
        }
      }
    })
  },

  connectBluetooth: function () {
    wx.redirectTo({
      url: '/pages/bluetooth/index/index?id=' + this.data.oriDeviceId + '&code=' + this.data.code + '&name=' + this.data.name,
    });
  },


  writeArray: function (cmdArray) {
    let that = this
    // 每间隔5s发送一次 
    if(Math.round(new Date().getTime()/1000) - wx.getStorageSync('lastCmdTime') < 5) {
      wx.showToast({
        title: '亲，您操作太快了',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.setStorageSync('lastCmdTime', Math.round(new Date().getTime()/1000))
    let pos = 0;
    let length = cmdArray.length;
    while (length > 0) {
      let tmpCmd;
      if (length > 20) {
        tmpCmd = cmdArray.slice(pos, pos + 20);
        pos += 20;
        length -= 20;
        setTimeout(() => {
          wx.writeBLECharacteristicValue({
            deviceId: wx.getStorageSync('connectedDeviceId'),
            serviceId: wx.getStorageSync('serviceId'),
            characteristicId: wx.getStorageSync('writeCharId'),
            value: tmpCmd.buffer,
            success: function (res) { },
            fail: function (res) {
              if (res.errCode==10006 || res.errCode==0) {
                wx.showToast({
                  title: '云锁WIFI已断开，请按"0#"唤醒WIFI，然后重新连接',
                  icon: 'none',
                  duration: 2000
                })
                that.closeBleConnection()
              } else {
                wx.showToast({
                  title: '指令发送失败',
                  icon: 'none',
                  duration: 2000
                })
              }
              console.log(res)
            }
          })
        }, 100)
      } else {
        tmpCmd = cmdArray.slice(pos, pos + length);
        pos += length;
        length -= length;
        setTimeout(() => {
          wx.writeBLECharacteristicValue({
            deviceId: wx.getStorageSync('connectedDeviceId'),
            serviceId: wx.getStorageSync('serviceId'),
            characteristicId: wx.getStorageSync('writeCharId'),
            value: tmpCmd.buffer,
            success: function (res) {
              wx.showToast({
                title: '指令发送成功',
                icon: 'success',
                duration: 1000
              })
              wx.setStorageSync('lastCmdTime', Math.round(new Date().getTime()/1000))
            },
            fail: function (res) {
              if (res.errCode==10006 || res.errCode==0) {
                wx.showToast({
                  title: '云锁WIFI已断开，请按"0#"唤醒WIFI，然后重新连接',
                  icon: 'none',
                  duration: 2000
                })
                that.closeBleConnection()
              } else {
                wx.showToast({
                  title: '指令发送失败',
                  icon: 'none',
                  duration: 2000
                })
              }
              console.log(res)
            }
          })
        }, 150)
      }
    }
  },
  name: function(name){
    this.setData({
      setName: name.detail.value
    })
  },
  pwd:function(pwd){
    this.setData({
      setPwd: pwd.detail.value
    })
  },
  confirm: function(event){
    var that=this;
    wx.request({
      url: 'https://www.happydoudou.xyz/public/index.php/User/add',
      method: "POST",
      header:{
        'content-type': "application/x-www-form-urlencoded"
      },
      data:{
        name: that.data.setName,
        pwd: that.data.setPwd
      },
      success: res=>{
        wx.showToast({
          title: '添加成功',
        })
      },
      fail: res=>{
        wx.showToast({
          title: '添加失败',
          image: "../../../images/warn.png"
        })
      },
      complete:res=>{
        that.setData({
          hiddenmodalput:true
        })
      }
    })
  },
  closeBleConnection: function () {
    let that = this
  },
  cancel: function(){
    this.setData({
      hiddenmodalput: true
    })
  },
  deleteUser: function(){

  },
  changePassword: function(){
    
  }
})