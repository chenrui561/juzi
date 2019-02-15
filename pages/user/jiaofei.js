// pages/user/team-shouyi.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_user: [],
    user_info: [],
    id:'',//类型
    page:1,
    count:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();//加载动画
    var that = this;
    this.setData({
      id:options.id
    })
    if(options.id == 1){//来自缴费提醒
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=jiaofei_list',
        method: 'post',
        data: {
          id: wx.getStorageSync('id'),
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
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
    if (options.id == 2) {//来自预约报备信息


    }
    if (options.id == 3) {//获取渠道用户信息
    var that = this;
    var page = this.data.page;
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=qudao_user_info',
        method: 'post',
        data: {
          page:page
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
          that.setData({
            goods_user: goods_user,
            page: page + 1
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
    if (options.id == 4) {//获取直客信息
      var that = this;
      var page = this.data.page;
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhike_user_info',
        method: 'post',
        data: {
          page: page
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
          that.setData({
            goods_user: goods_user,
            count:res.data.count,
            page: page + 1
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
loading:function(e){
  var that = this;
  var page = this.data.page;
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=qudao_user_info',
    method: 'post',
    data: {
      page: page
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      //--init data 
      var goods_user = res.data.goods_user;
      var user_info = res.data.user_info;
      that.setData({
        goods_user: goods_user,
        page: page + 1
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
    var id = this.data.id;
    if (id == 4) {//获取直客信息
      var that = this;
      var page = this.data.page;
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhike_user_info',
        method: 'post',
        data: {
          page: page
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
          that.setData({
            goods_user: that.data.goods_user.concat(goods_user),
            page: page + 1
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})