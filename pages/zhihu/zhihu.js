// pages/question-ask/anli.js
var app = getApp();

//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noscroll:'',
    pl_input_height:121,//默认的评论输入框的高度，初始高度为91-41=50，字数每增长提高25px
    pl_page:1,//评论页数
    pl_count:'',
    pl_all:[],
    hf:[],
    anli_info: [],
    huifu_id:0,//回复id，0表示给答案作者发评论，如果大于0表示在评论中回复其他用户
    huifu_name:'',
    input_value:'',//评论输入的内容
    zan: '',
    zan_count:'',
    hd_count:'',
    guanzhu_off: 0,
    aid: '',//答案的id
    uid: '',//案例人id
    wid:'',//问题id，存在是表示这是一个没有人回答的问题，同时也要检测自己有没有写过草稿
    HeadUrl: '',
    pl: [],
    padding_bottom:'2%',
    title:'',
    shoucang:'',//收藏状态，0为没有收藏，1为收藏
    zan_off:0,//点赞开关，防止重复点击，1为不可点击
    fandui_off: 0,// 反对开关，防止重复点击
    my_huida:'',//我的回答的id
    my_huida_caogao:'',//我的回答是否是草稿状态，1为是，0不是
    pl_count: 0,
    next:'',//下一条回答
    shenhe: 0,//默认审核为，0，1为可审核状态
    user_id:'',
    bd_id:0,//绑定id
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

  // 弹出层
  takeCoupon: function (e) {
    this.setData({
      LayerBoxHeight: '100%',
      noscroll:'noscroll'//关闭背景滑动
    })
    if(e.currentTarget.dataset.id == 1){
      this.setData({
        focus:true
      })
    }
    this.load_pl();//加载评论
    this.createMaskShowAnim();
    this.createContentShowAnim();
  },
  // 关闭弹出层
  takeCouponClose: function () {
    this.setData({
      'LayerBoxHeight': '0',
      noscroll: ''//开启背景滑动
    })
    this.createMaskHideAnim();
    this.createContentHideAnim();
  },
/*弹出层方法开始 */
  createMaskShowAnim: function() {
      const animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
      });

      this.maskAnim = animation;

      animation.opacity(1).step();
      this.setData({
        animMaskData: animation.export(),
      });
    },
  createMaskHideAnim: function() {
      this.maskAnim.opacity(0).step();
      this.setData({
        animMaskData: this.maskAnim.export(),
      });
    },
  createContentShowAnim: function() {
      const animation = wx.createAnimation({
        duration: 200,
        timingFunction: 'cubic-bezier(.55, 0, .55, .2)',
      });
      this.contentAnim = animation;
      animation.translateY(0).step();
      this.setData({
        animContentData: animation.export(),
      });
    },
  createContentHideAnim: function() {
      this.contentAnim.translateY('100%').step();
      this.setData({
        animContentData: this.contentAnim.export(),
      });
    },
 /*弹出层方法结束 */
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var aid = options.aid;
    var wid = options.wid;
    var that = this;  
    that.setData({
      aid: aid,
      wid:wid,
      user_id: wx.getStorageSync('id'),
      HeadUrl: wx.getStorageSync('HeadUrl')
    });
    //判断是否是转发打开，如果是就执行绑定推荐方法
    var bd_id = options.id;//获取转发时携带的转发用户的id
    if (bd_id > 0) {
      that.setData({
        bd_id: bd_id
      })
      //将转发过来的ID，放入缓存中
      wx.setStorageSync('bd_id', bd_id)//把转发的人id写入缓存
    }
    /*获取设备型号 */
    wx.getSystemInfo({
      success: function (res) {
        //model中包含着设备信息
        console.log(res.model)
        var model = res.model
        if (model.search('iPhone X') != -1) {
          app.globalData.isIpx = true;
          that.setData({
            padding_bottom:'7%'
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
          guanzhu_off: res.data.guanzhu_off,
          pl_count: res.data.huida_info[0].pl,
          pl: res.data.pl,
          wid:res.data.huida_info[0].wid,
          next: res.data.next,
          zan_count: res.data.huida_info[0].zan,
          my_huida: my_huida,
          shoucang: res.data.shoucang_count,
          my_huida_caogao: res.data.my_huida_caogao
        });
      }
      if(res.data.zan != null){//如果有点过赞的话
        that.setData({
          zan: res.data.zan[0],
        })
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
        wx.setNavigationBarTitle({
          title: that.data.title
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
  /*加载评论 */
  load_pl: function (e) {//加载邀请人列表
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=load_zhihu_pl',
      method: 'post',
      data: {
        id: this.data.aid,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          pl_all:res.data.pl,
          hf: res.data.hf,
          pl_count:res.data.count,
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
/*加载底部信息，暂时未启用 */
  zhihu_bottom: function () {//加载邀请人列表
    var that = this;
    var aid = this.data.aid;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhihu_bottom',
      method: 'post',
      data: {
        id: aid,
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
/*点赞 */
  zan: function (e) {
    var that = this;
    var aid = that.data.aid
    if (e.currentTarget.dataset.idx == 1){
      this.setData({//设置为赞为不可点击状态
        zan_off: 1
      })
    }
    if (e.currentTarget.dataset.idx == 2) {
      this.setData({//设置为赞为不可点击状态
        fandui_off: 1
      })
    }
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhihu_zan',
      method: 'post',
      data: {
        aid: aid,
        zan: e.currentTarget.dataset.idx,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var zan = that.data.zan;
        that.setData({
          zan:res.data.zan_info[0]
        })
        if(res.data.states == 1){
          wx.showToast({
            title: '已点赞',
            duration: 2000
          });
        }
        if (res.data.states == 2) {
          wx.showToast({
            title: '取消成功',
            duration: 2000
          });
        }
        if (res.data.states == 3) {
          wx.showToast({
            title: '已反对',
            duration: 2000
          });
        }
        that.setData({
          zan_count: res.data.count
        })
        if (e.currentTarget.dataset.idx == 1) {
          that.setData({//设置为赞为可点击状态
            zan_off: 0
          })
        }
        if (e.currentTarget.dataset.idx == 2) {
          that.setData({//设置为反对为可点击状态
            fandui_off: 0
          })
        }
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
  /*知乎收藏 */
  shoucang: function (e) {
    var that = this;
    var aid = that.data.aid
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhihu_shoucang',
      method: 'post',
      data: {
        hid: aid,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.states == 1){
          wx.showToast({
            title: '收藏成功',
            duration: 2000
          });
        }
        if (res.data.states == 2) {
          wx.showToast({
            title: '取消收藏',
            duration: 2000
          });
        }
        that.setData({
          shoucang: res.data.count
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
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=guanzhu',
      method: 'post',
      data: {
        bid: e.currentTarget.dataset.id,
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
        bid: e.currentTarget.dataset.id,
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
      //根据文字长度动态设置输入框的高度
    var pl_input_height = 121 + parseInt(e.detail.value.length / 20)*25;
      this.setData({
        input_value: e.detail.value,
        hotKeyShow: true,
        historyKeyShow: true,
        pl_input_height: pl_input_height
      });
      console.log(pl_input_height);
  },
  /*点击回复 */
  huifu:function(e){//点击回复
    var huifu_id = e.currentTarget.dataset.huifuid;
    var huifu_name = e.currentTarget.dataset.name;
    this.setData({
      huifu_id: huifu_id,
      huifu_name: huifu_name,
      focus: true
    })
  },
  /*失去评论input焦点 */
  input_out:function(e){
    this.setData({
      huifu_id: 0,
      huifu_name: '',
    })
  },
  /*提交评论 */
  dopl: function (e) {
    var that = this;
    if (that.data.input_value == '') {
      wx.showToast({
        title: '评论不能为空',
        icon: 'none',
        duration: 2000
      });
      return
    }
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhihu_pl_input',
      method: 'post',
      data: {
        content: that.data.input_value,
        huifu_id: that.data.huifu_id,//如果是回复，这里就是回复的id
        user_id: wx.getStorageSync('id'),//提交人信息
        aid: that.data.aid,//答案id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({//提交后把输入框的数据置空
          input_value:''
        })
        that.load_pl();
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
/*删除评论 */
  del_pl:function(e){
    var that = this;
    wx.showModal({
      content: "是否删除评论",
      showCancel: '不了',
      confirmText: '删除',
      success: function (res) {
        wx.showLoading();//加载动画 
        wx.request({
          url: app.d.anranUrl + '/index.php?m=default&c=indem&a=del_zhihu_pl',
          method: 'post',
          data: {
            pid: e.currentTarget.dataset.id,
            user_id: wx.getStorageSync('id'),//提交人信息
            aid: that.data.aid,//答案id
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {

            that.load_pl();
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

    })
    
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
    var abc = wx.getStorageSync('id');
    var title = this.data.title;
    var aid = this.data.aid;
    var wid = this.data.wid;
    return {
      title: title,
      path: '/pages/zhihu/zhihu?aid='+aid+'&wid='+wid+'&id=' + abc,
      success: function (res) {
        // 分享成功

      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})