// pages/question-ask/anli.js
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    anli_info:[],
    zan:'',
    zan_off:0,
    guanzhu_off:0,
    aid:'',//案例的id
    uid:'',//案例人id
    HeadUrl:'',
    pl:[],
    searchValue:'',//评论输入的信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var aid = options.aid;
    var uid = options.uid;
    var that = this;
    that.setData({
      aid: aid,
      uid: uid,
      HeadUrl: wx.getStorageSync('HeadUrl')
    });
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=anli_info',
      method: 'post',
      data: {
        aid: aid,
        uid: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var anli_info = res.data.anli_info[0];
        var content = res.data.anli_info[0].content;
     
        WxParse.wxParse('content', 'html', content, that, 3);
        that.setData({
          anli_info: anli_info,
          zan: anli_info.zan,
          zan_off: anli_info.zan_off,
          guanzhu_off: anli_info.guanzhu_off,
          pl:res.data.pl
        });

        //endInitData
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

zan:function(e){
  var that = this;
  var aid = that.data.aid
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=dianzan',
    method: 'post',
    data: {
      aid: aid,
      user_id: wx.getStorageSync('id')
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var zan = that.data.zan;
      wx.showToast({
        title: '点赞成功',
        duration: 2000
      });
      that.setData({
        zan: parseInt(zan) + 1,
        zan_off:1
      });
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
    var uid = that.data.uid
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=guanzhu',
      method: 'post',
      data: {
        bid: uid,
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
        that.setData({
          guanzhu_off: 1
        });
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
        bid: uid,
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
        that.setData({
          guanzhu_off: 0
        });
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
  searchValueInput: function (e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    });
    if (!value && this.data.productData.length == 0) {
      this.setData({
        hotKeyShow: true,
        historyKeyShow: true,
      });
    }
  },
  dopl:function(e){
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_pl_input',
      method: 'post',
      data: {
        content: that.data.searchValue,
        user_id: wx.getStorageSync('id'),//提交人信息
        aid:that.data.aid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showLoading();//加载动画 
        wx.request({
          url: app.d.anranUrl + '/index.php?m=default&c=indem&a=anli_info',
          method: 'post',
          data: {
            aid: that.data.aid,
            uid: wx.getStorageSync('id')
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            var anli_info = res.data.anli_info[0];
            var content = res.data.anli_info[0].content;
            WxParse.wxParse('content', 'html', content, that, 3);
            that.setData({
              anli_info: anli_info,
              zan: anli_info.zan,
              zan_off: anli_info.zan_off,
              guanzhu_off: anli_info.guanzhu_off,
              pl: res.data.pl
            });

            //endInitData
            wx.hideLoading()//关闭加载动画
          },
          fail: function (e) {
            wx.showToast({
              title: '网络异常！',
              duration: 2000
            });
          },
        });

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