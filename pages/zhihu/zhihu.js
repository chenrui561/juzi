// pages/question-ask/anli.js
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    anli_info: [],
    zan: '',
    zan_off: 0,
    hd_count:'',
    guanzhu_off: 0,
    aid: '',//答案的id
    uid: '',//案例人id
    wid:'',//问题id，存在是表示这是一个没有人回答的问题，同时也要检测自己有没有写过草稿
    HeadUrl: '',
    pl: [],
    title:'',
    my_huida:'',//我的回答的id
    my_huida_caogao:'',//我的回答是否是草稿状态，1为是，0不是
    pl_count: 0,
    shenhe: 0,//默认审核为，0，1为可审核状态
    searchValue: '',//评论输入的信息
  },
  bindButtonTap: function () {
    this.setData({
      focus: true
    })
  },
  panduan: function () {
    if (this.data.phone == '') {
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
    var wid = options.wid;
    var that = this;  
    that.setData({
      aid: aid,
      wid: wid,
      HeadUrl: wx.getStorageSync('HeadUrl')
    });
    
  },
loading_huida:function(){
  var that = this;
  var aid = this.data.aid;
  var wid = this.data.wid;
  wx.showLoading();//加载动画 
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=huida_info',
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

      if (res.data.huida_info != null) {
        var anli_info = res.data.huida_info;
        var content = res.data.huida_info[0].content;
        var my_huida = res.data.my_huida;
        WxParse.wxParse('content', 'html', content, that, 3);
        that.setData({
          anli_info: anli_info,
          zan: anli_info.zan,
          zan_off: anli_info.zan_off,
          guanzhu_off: anli_info.guanzhu_off,
          pl: res.data.pl,
          my_huida: my_huida,
          my_huida_caogao: res.data.my_huida_caogao
        });
      }
      if (res.data.title.length > 0) {
        var title = res.data.title[0].title;
        var my_huida = res.data.my_huida;
        that.setData({
          title: title,
          hd_count: res.data.hd_count,
          my_huida: my_huida,
          my_huida_caogao: res.data.my_huida_caogao
        })
      }
      console.log('案例info' + that.data.anli_info.length)
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
yaoqing_user:function(id){//加载邀请人列表
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
  zan: function (e) {
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
          zan_off: 1
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
    console.log(this.data.searchValue);
  },
  dopl: function (e) {
    var that = this;
    if (that.data.searchValue == '') {
      wx.showToast({
        title: '评论不能为空',
        icon: 'none',
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
        aid: that.data.aid
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