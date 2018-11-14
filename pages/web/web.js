// pages/web/web.js
var app = getApp();
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    anran_id: 0,
    web_type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var web_type = options.web_type
    var kuaidi = options.kuaidi
    var jm_id = ((app.d.anran_id)*33+254)*22 
    that.setData({
      web_type: web_type,
      anran_id: jm_id,
      kuaidi:kuaidi
    })
    //console.log(web_type);
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