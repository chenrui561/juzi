// pages/question-ask/anli.js
var app = getApp();

//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noscroll: '',
    type_id:0,//1为我的创作，2为我的赞同
    pl_input_height: 121,//默认的评论输入框的高度，初始高度为91-41=50，字数每增长提高25px
    pl_page: 1,//评论页数
    pl_count: '',
    pl_all: [],
    anli_info: [],
    my_huida: [],//我的回答的基本信息
    title_info: '',
    huida_list: [],
    wenti:[],
    aid: '',//答案的id
    uid: '',//案例人id
    wid: '',//问题id，存在是表示这是一个没有人回答的问题，同时也要检测自己有没有写过草稿
    HeadUrl: '',
    pl: [],
    padding_bottom: '2%',
    title: '',
    pl_count: 0,
    user_id: ''
  },





  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var aid = options.aid;
    var wid = options.wid;
    var that = this;
    that.setData({
      aid: aid,
      wid: wid,
      type_id:options.type_id,
      user_id: wx.getStorageSync('id'),
      HeadUrl: wx.getStorageSync('HeadUrl')
    });
  },
  /* 加载回答的基本信息*/
  loading_huida: function () {
    var that = this;
    var aid = this.data.aid;
    var wid = this.data.wid;
    var type_id = this.data.type_id;
    if (type_id == 1){
      wx.showLoading();//加载动画 
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=load_myzhihu_huida_list',
        method: 'post',
        data: {
          uid: wx.getStorageSync('id')
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

          if (res.data.huida_list.length > 0) {
            that.setData({
              huida_list: res.data.huida_list,
              wenti:res.data.wenti,
              hd_count: res.data.hd_count
            })
            wx.setNavigationBarTitle({
              title: '我的创作'
            })
          }
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
    }

    if (type_id == 2) {//加载我的赞同
      wx.showLoading();//加载动画 
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=load_myzhihu_zantong_list',
        method: 'post',
        data: {
          uid: wx.getStorageSync('id')
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (res.data.huida_list.length > 0) {
            that.setData({
              huida_list: res.data.huida_list,
              hd_count: res.data.hd_count
            })
            wx.setNavigationBarTitle({
              title: '我的赞同'
            })
          }
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
    this.loading_huida();
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