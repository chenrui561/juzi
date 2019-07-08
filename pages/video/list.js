// pages/audio/list.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    info: [],
    url:'',
    search: '',
    author:'老汤'
  },
  audioPlayed: function (e) {
    console.log('audio is played')
    wx.showLoading();//加载动画
  },
  audioTimeUpdated: function (e) {
    this.duration = e.detail.duration;
    console.log('啊')
    wx.hideLoading()//关闭加载动画
  },

  timeSliderChanged: function (e) {
    if (!this.duration)
      return;
    console.log('哈哈')
    var time = this.duration * e.detail.value / 100;

    this.setData({
      audioAction: {
        method: 'setCurrentTime',
        data: time
      }
    });
  },
  playbackRateSliderChanged: function (e) {
    this.setData({
      audioAction: {
        method: 'setPlaybackRate',
        data: e.detail.value
      }
    })
  },

  playAudio: function () {
    this.setData({
      audioAction: {
        method: 'play'
      }
    });
  },
  pauseAudio: function () {
    this.setData({
      audioAction: {
        method: 'pause'
      }
    });
  },
  searchValueInput: function (e) {
    console.log(e.detail.value)
    this.setData({
      search: e.detail.value
    })
  },
  doSearch: function (e) {
    this.loading();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.bd_id > 0){
      wx.setStorageSync('bd_id', options.bd_id)
    }
    this.loading();
  },
loading:function(){
  var that = this;
  var search = this.data.search;
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_video_list',
    method: 'post',
    data: {
      page: 1,
      search: search
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      that.setData({
        list: res.data.audio_list
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
    var abc = wx.getStorageSync('id');
    return {
      title:'桔子放心美-操作演示',
      path: '/pages/video/list?bd_id=' + abc,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})