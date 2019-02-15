// pages/user/team-shouyi.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tixian_info: [],
    user_info: [],
    cash:'',
    bishu:'',
    id:1
  },
  cash:function(){
  var that = this;
    wx.request({

      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_tixian_shenhe_jia',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var tixian_info = res.data.tixian_info;
        that.setData({
          tixian_info: tixian_info,
          tixian_info_list: tixian_info.comments
        });
        console.log(tixian_info.comments);
        wx.hideLoading()//关闭加载动画
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id == 2){
      //更改头部标题
      wx.setNavigationBarTitle({
        title: '桔子放心美记录',
        success: function () {
        },
      });
      this.setData({
        id:options.id
      })
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
    this.cash();
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