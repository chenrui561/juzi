// pages/product/lilshi.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_user: [],
    team_type:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var team_type = options.team_type //类型，1为线上，2为线下
    this.setData({
      team_type: team_type,
    });
    if (team_type == 1){//加载线上数据
      wx.showLoading();//加载动画
      var that = this;
      var goods_id = options.id;
      wx.request({

        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_team_user2',
        method: 'post',
        data: {
          id: wx.getStorageSync('id'),
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 

          var goods_user = res.data;


          that.setData({
            goods_user: goods_user,

          });
          wx.hideLoading()//关闭加载动画
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        },
      });
    }
    if (team_type == 2) {//加载线下数据
    wx.showLoading();//加载动画
    var that = this;
    var goods_id = options.id;
    wx.request({

      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_team_user',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 

        var goods_user = res.data;


        that.setData({
          goods_user: goods_user,

        });
        wx.hideLoading()//关闭加载动画
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
    }

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