// pages/zhihu/zhihu_guanzhu.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    guanzhu_list:[],
    guanzhu_off:1,
    type_id:1,//1为我关注的人，2为关注我的人
    currentTab:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.guanzhu_list();
  },
change:function(e){
  this.setData({
    type_id:1,
    currentTab:0
  })
  this.guanzhu_list();
},
change2: function (e) {
    this.setData({
      type_id: 2,
      currentTab: 1
    })
  this.guanzhu_list();
  },
guanzhu_list:function(e){
  var that = this;
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=guanzhu_list',
    method: 'post',
    data: {
      user_id: wx.getStorageSync('id'),
      type_id:this.data.type_id
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      that.setData({
        guanzhu_list: res.data.list,
      })
      //endInitData
      //wx.hideLoading()//关闭加载动画
    },
    fail: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    },
  });
},
  guanzhu: function (e) {
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=guanzhu',
      method: 'post',
      data: {
        bid: e.currentTarget.dataset.id,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '关注成功',
          duration: 2000
        });
        that.guanzhu_list();
        //endInitData
        //wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
  del_guanzhu: function (e) {
    var that = this;
    var uid = that.data.uid
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=del_guanzhu',
      method: 'post',
      data: {
        bid: e.currentTarget.dataset.id,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '取消关注',
          duration: 2000
        });
        that.guanzhu_list();
        //endInitData
        //wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
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

  }
})