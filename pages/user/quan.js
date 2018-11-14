// pages/user/quan.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bonus_list:[],
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=youhuiquan',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        page:1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          bonus_list: res.data.bonus
        });
        console.log(res.data)
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
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
    var that = this;
    var page = this.data.page;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=youhuiquan',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        page: page++
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          bonus_list: that.data.bonus_list.concat(res.data.bonus),
          page:page + 1
        });
        console.log(res.data)
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})