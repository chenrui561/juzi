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
    pl_input_height: 121,//默认的评论输入框的高度，初始高度为91-41=50，字数每增长提高25px
    pl_page: 1,//评论页数
    pl_count: '',
    pl_all: [],
    anli_info: [],
    my_huida:[],//我的回答的基本信息
    title_info:'',
    huida_list:[],
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
      user_id: wx.getStorageSync('id'),
      HeadUrl: wx.getStorageSync('HeadUrl')
    });
    /*获取设备型号 */
    wx.getSystemInfo({
      success: function (res) {
        //model中包含着设备信息
        console.log(res.model)
        var model = res.model
        if (model.search('iPhone X') != -1) {
          app.globalData.isIpx = true;
          that.setData({
            padding_bottom: '7%'
          })
        } else {
          app.globalData.isIpx = false;
          that.setData({
            padding_bottom: '2%'
          })
        }
      }
    })
  },
  /* 加载回答的基本信息*/
  loading_huida: function () {
    var that = this;
    var aid = this.data.aid;
    var wid = this.data.wid;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=load_zhihu_wenti_huida_list',
      method: 'post',
      data: {
        id: aid,
        wid: wid,
        uid: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if (res.data.title.length > 0) {
          var title = res.data.title[0].title;
          var huida_info = res.data.huida_info;
          that.setData({
            title: title,
            title_info:res.data.title[0].info,
            hd_count: res.data.hd_count,
            huida_list: res.data.huida_list,
          })
          wx.setNavigationBarTitle({
            title: that.data.title
          })
        }
        if (res.data.huida_list.length > 0){
          that.setData({
            huida_list: res.data.huida_list,
          })
        }
        if (res.data.huida_info.length > 0){
          that.setData({
            my_huida: res.data.huida_info,
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
  },


  yaoqing_user: function (id) {//加载邀请人列表
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=yaoqing_user_huida',
      method: 'post',
      data: {
        id: id,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

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