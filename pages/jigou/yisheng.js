// pages/jigou/jigou.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jigou_info:[],
    xiangmu_list:[],
    jigou_xiangmu_count:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    var yisheng_id = options.yisheng_id
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_yisheng_info',
      method: 'post',
      data: {
        yisheng_id: yisheng_id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
       
        that.setData({
          yisheng_info: res.data.yisheng_info[0],
          jigou_xiangmu_count: res.data.jigou_xiangmu_count,
          xiangmu_list: res.data.xiangmu_list
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '提交失败！',
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