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
    pl_count:0,
    shenhe:0,//默认审核为，0，1为可审核状态
    searchValue:'',//评论输入的信息
  },
  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },
  panduan:function(){
    if(this.data.phone == ''){
      wx.showToast({
        title: ' 请先绑定手机号！',
        icon: 'none',
        duration: 1500
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '../user/bd'
        });//要延时执行的代码
      }, 1500)
      return;
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var aid = options.aid;
    var uid = options.uid;
    var shenhe = options.shenhe;
    var that = this;
    that.setData({
      aid: aid,
      uid: uid,
      shenhe: shenhe,
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
        var phone = res.data.phone;
        WxParse.wxParse('content', 'html', content, that, 3);
        that.setData({
          anli_info: anli_info,
          zan: anli_info.zan,
          zan_off: anli_info.zan_off,
          guanzhu_off: anli_info.guanzhu_off,
          pl:res.data.pl,
          pl_count: res.data.pl_count,
          phone:phone
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
    if (that.data.searchValue == ''){
      wx.showToast({
        title:'评论不能为空',
        icon:'none',
        duration: 2000
      });
      return
    }
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
  shenhe_ok: function () {
    var that = this;
    var page = that.data.page;
    var aid = that.data.aid;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=riji_shenhe',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        aid: aid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '操作成功！',
          duration: 2000
        });

        setTimeout(function () {//延时10秒关闭弹出层
          wx.navigateBack({
          })
        }, 2000)
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
  shenhe_no: function () {
    var that = this;
    var page = that.data.page;
    var aid = that.data.aid;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=riji_shenhe_no',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        aid: aid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '操作成功！',
          duration: 2000
        });

        setTimeout(function () {//延时10秒关闭弹出层
          wx.navigateBack({
          })
        }, 2000)
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