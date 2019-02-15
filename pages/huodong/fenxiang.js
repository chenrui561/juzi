// pages/huodong/fenxiang.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pyq();
  },
  pyq: function () {
    wx.showLoading();//加载动画
    var that = this;
    var id = wx.getStorageSync('id')
    var url = 'https://www.juziyimei.com/mobile/index.php?m=default&c=indem&a=img_test&id=' + id;
    var img = url.split();
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=testcode2',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.state == 1) {//成功获取到了小程序码之后
          that.setData({
            img_url: url,
            fxfx:res.data.fxfx
          })
        }
        wx.hideLoading()//关闭加载动画
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });



    /*wx.previewImage({
      current: url,
      urls: img
    })*/
  },
  down:function(){
    var img_url = this.data.img_url;
    wx.showLoading();//加载动画
    wx.downloadFile({
      url: img_url,
      success: function (res) {
        var imageFilePath = res.tempFilePath;
        wx.saveImageToPhotosAlbum({
          filePath: imageFilePath,
          success: function (data) {
            wx.hideLoading()//关闭加载动画
            wx.showToast({
              title: "保存成功",
            })
          }, fail: function (res) {
            wx.hideLoading()//关闭加载动画
            wx.showToast({
              title: "保存失败",
            })
          }
        })

      },
    })


  },
  big_img:function(){
    var id = wx.getStorageSync('id');
    var url = 'https://www.juziyimei.com/mobile/index.php?m=default&c=indem&a=img_test&id=' + id;
    var img = url.split();
    wx.previewImage({
      current: url,
      urls: img
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