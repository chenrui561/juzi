// pages/user/tixian_info.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    input_mobile:'',
    id:'',
    log_id:'',
    user_id:'',
    guanlian_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();//加载动画
    var that = this;
    this.setData({
      log_id: options.log_id,
      id:options.id,
      user_id:options.user_id
    })
    if (options.id > 0){
      this.load();
   } 
    if (options.user_id > 0){
      this.qianbao();
  }

  },
  load:function(){
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_tixian_info2',
      method: 'post',
      data: {
        id: that.data.id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var goods_user = res.data.goods_user[0];
        that.setData({
          goods_user: goods_user,
          id: goods_user.id,
          guanlian_id: goods_user.guanlian_id
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
qianbao:function(e){
  var that = this;
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_shouyi_liushui',
    method: 'post',
    data: {
      id: that.data.user_id,
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      //--init data 
      var goods_user = res.data.goods_user;
      that.setData({
        goods_user2: goods_user,
        user_info: res.data.user_info[0]
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
no_z:function(){
  wx.showLoading();//加载动画
  var that = this;
  var id = this.data.id;
  var guanlian_id = this.data.guanlian_id;
  var input_mobile = this.data.input_mobile;
  if (input_mobile == ''){
    wx.showToast({
      title: '请输入拒绝原因',
      duration: 2000
    });
return
  }
  wx.request({

    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=no_z',
    method: 'post',
    data: {
      id: id,
      guanlian_id: guanlian_id,
      info: input_mobile
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      wx.navigateBack({
      })
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
  ok_z: function () {
    wx.showLoading();//加载动画
    var that = this;
    var id = this.data.id;
    var guanlian_id = this.data.guanlian_id;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=ok_z',
      method: 'post',
      data: {
        id: id,
        guanlian_id: guanlian_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.navigateBack({
        })
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
  input_mobile: function (e) {
    this.setData({
      input_mobile: e.detail.value
    })

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