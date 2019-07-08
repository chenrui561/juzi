// pages/product/lilshi.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_user: [],
    anyone_id:0,//默认为0，即看缓存id的成员
    page_1:1,//线上分页
    page_2:1,//线下分页
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
    if (options.anyone_id){
      this.setData({
        anyone_id: options.anyone_id,
      });
    }
    this.loading();
  },

loading:function(){
  var team_type = this.data.team_type //类型，1为线上，2为线下
  if (team_type == 1) {//加载线上数据
    wx.showLoading();//加载动画
    //更改头部标题
    wx.setNavigationBarTitle({
      title: '我的推荐',
      success: function () {
      },
    });
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_team_user2',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        anyone_id: this.data.anyone_id,//从管理中心过来查看别人的下级情况
        page_1: this.data.page_1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 

        var goods_user = res.data;
        var page_1 = that.data.page_1

        that.setData({
          goods_user: goods_user,
          page_1: page_1 + 1
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
    wx.request({

      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_team_user',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        anyone_id: this.data.anyone_id,//从管理中心过来查看别人的下级情况
        page_2: this.data.page_2
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 

        var goods_user = res.data;
        var page_2 = that.data.page_2

        that.setData({
          goods_user: goods_user,
          page_2: page_2 + 1
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
    this.loading();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})