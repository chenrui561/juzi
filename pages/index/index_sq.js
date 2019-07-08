var app = getApp();
let col1H = 0;
let col2H = 0;
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk;
Page({
  data: {
    imgUrls: [],
    uid: 0,
    user_lei:0,
    pick:['回复时间排序','发帖时间排序'],
    gonggao:[],
    shequ_pick:0,//默认为0，按回复时间排序，1为按发帖时间排序
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    productData: [],
    haoyou:[],
    kongzhi:0,//控制是否显示会员社区,0为不显示
    goods_list: [],
    count_goods_list:[],
    proCat:[],
    zhihu_index:[],//知乎首页
    zhihu_nobody:[],
    f_fenxiang:0,
    page:1,
    sq_page:1,
    jinghua:0,//默认为0，看全部，为1，就是只看精华
    index: 2,
    brand:[],
    xzzzp: [],
    ms_goods:[],
    tjhw:[],
    laba:[],
    djdzm: [],
    index_page:[1,2,3,4],//每个tab的页码数
    // 滑动
    imgUrl: [],
    kbs:[],
    lastcat:[],
    course:[],
    index_tui:[],//首页的推荐商品
    test:"",
    winHeight: "",//窗口高度
    banner_height:127,
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    shaidan:[],
    shouquan:999,
    zhuanpan_off:0,
    zhuanpan_on:0,
    fenxiang:'',
    huodong_img:0,
    huodong_info:[],
    z_index:'1',//
    head_on:'',//固定头部
    images: [],
    jigou:[],
    yisheng:[],
    cart_num: '',
    user_money: '',
    b_count: '',
    b_user_name: '',
    mobile_phone: '',
    more:'下拉加载中',
    on_cor3:'on_cor',//初始tab状态
    qr_img:'',
    shequ:[],
    shoucang:0,//我的收藏，1为查看我的收藏帖子
    page_tab:1 ,//下拉刷新默认显示首页
    load_ing:0,//加载中状态，一旦处于加载中状态，就不开启新的请求。1为加载中，0为可以加载
    new_page:2//新方法下的页数，新方法采用替换式,1为首页，2为找优惠，3找机构，4找医生
  },
  
  formid:function(e){
    let formId = e.detail.formId;
    console.log('form发生了submit事件，推送码为：', formId)
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=formid',
      method: 'post',
      data: {
        formid: formId,
        id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
      },
      fail: function (e) {
      },
    })
  },

  bindGetUserInfo: function (e) {
    var that = this;
    if (e.detail.userInfo) {
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo,
          shouquan: 1,
          loadingHidden: true
        })
      });
      //用户按了允许授权按钮
     /* wx.showModal({
        content: "授权成功，立即绑定手机号，享受桔子放心美的层层优惠吧！",
        showCancel: '不了',
        confirmText: '去绑定',
        success: function (res) {
          if (res.cancel) {//点击了取消，去首页
            that.setData({
              shouquan: 1,
            })

          }
          if (res.confirm) {//点击了确定，去绑定
            that.setData({//也要消掉弹窗，因为已经确认了授权了
              shouquan: 1,
            })
            wx.navigateTo({
              url: '../user/bd',
            })
          }

        }

      })*/
    } 
  },
/*只看精华 */
  jinghua:function(e){
    if(this.data.jinghua == 0){
      this.setData({
        jinghua: 1
      })
    }else if (this.data.jinghua == 1) {
      this.setData({
        jinghua: 0
      })
    }
    this.one_shequ();
  },
  /*我的收藏 */
  shoucang: function (e) {
    if (this.data.shoucang == 0) {
      this.setData({
        shoucang: 1
      })
    } else if (this.data.shoucang == 1) {
      this.setData({
        shoucang: 0
      })
    }
    this.one_shequ();
  },
/*选择排序 */
  pick:function(e){
    this.setData({
      shequ_pick: e.detail.value
    })
    this.one_shequ();
  },
close_choujiang:function(e){
  var that = this;
  that.setData({
    zhuanpan_off: 0
  });
},
  indexChange:function(e){//头部切换
    if (e.currentTarget.dataset.current == 1){
      this.setData({
        z_index:1
      })
      this.zhihu();
    }
    if (e.currentTarget.dataset.current == 2) {
      this.setData({
        z_index: 2
      })
      this.one_shequ();
    }
    if (e.currentTarget.dataset.current == 3) {
      this.setData({
        z_index: 3
      })
        this.shangxueyuan();
    }
  }, 
  /**
     * 页面相关事件处理函数--监听用户下拉动作--下拉刷新
     */
  onPullDownRefresh: function () {
    var that = this;
    if (this.data.z_index == 1) {//医美问答的下拉
      wx.showLoading();//加载动画 
      wx.request({//加载首页基础信息
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_zhihu',
        method: 'post',
        data: {
          user_lei: wx.getStorageSync('user_lei'),
          user_id: wx.getStorageSync('id'),
          page: 1
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          wx.setStorageSync('ctrl', res.data.ctrl)//把自己的id写入缓存
          if (res.data.zhihu_index != null) {
            that.setData({
              zhihu_index: res.data.zhihu_index,
            });

          }
          if (res.data.zhihu_nobody != null) {
            that.setData({
              zhihu_index: res.data.zhihu_nobody
            });

          }

          if (res.data.zhihu_nobody == null && res.data.zhihu_index == null) {
            wx.showToast({
              title: '没有更多了',
              duration: 2000
            });
            that.setData({
              more: '没有更多'
            })
          }
          that.setData({
            page: 1
          })
          if (res.data.count_message > 0) {
            wx.showTabBarRedDot({//展示消息的红点
              index: 2
            })
          } else {
            wx.hideTabBarRedDot({
              index: 2
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
    if (this.data.z_index == 2) {//社区的下拉
      this.one_shequ();
    }
    if (this.data.z_index == 3) {//商学院的下拉
      this.shangxueyuan();
    }
    wx.stopPullDownRefresh();//解决回弹问题
  },
  one_shequ:function(){
    var that = this;
    wx.showLoading();//加载动画 
    wx.request({//加载首页基础信息
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_shequ',
      method: 'post',
      data: {
        user_lei: wx.getStorageSync('user_lei'),
        user_id: wx.getStorageSync('id'),
        jinghua:that.data.jinghua,
        shoucang: that.data.shoucang,
        shequ_pick: that.data.shequ_pick,
        page: 1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        that.setData({
          shequ: res.data.shequ,
          gonggao: res.data.gonggao,
          kongzhi: res.data.kongzhi,
          sq_page: 2
        })
        if (res.data.shequ.length < 10){
        that.setData({
          more:'没有更多'
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
  /*商学院 */
  shangxueyuan: function () {
    var that = this;
    wx.showLoading();//加载动画 
    wx.request({//加载首页基础信息
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=shangxueyuan',
      method: 'post',
      data: {
        user_lei: wx.getStorageSync('user_lei'),
        user_id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          cdb: res.data.cdb,
          new_man: res.data.new_man,
          anli:res.data.anli
        })
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
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    if (this.data.z_index == 1){//医美问答的下拉
      this.zhihu();
   }
    if (this.data.z_index == 2) {//会员社区的下拉
      this.shequ();
    }
    if (this.data.z_index == 3) {//商学院
      
    }
  },



  

  onLoad: function (options) {//
    //console.log(wx.getSystemInfoSync().windowWidth * 254/750);
    this.setData({
      banner_height: wx.getSystemInfoSync().windowWidth * 254 / 750,
      user_lei: wx.getStorageSync('user_lei')
    })
    var that = this;
    var anran_id = wx.getStorageSync('id');
    var page_tab = options.page_tab;
    var cat_id = this.data.cat_id;//分类id
    
    //判断是否显示抽奖弹窗
    if (wx.getStorageSync('choujiang')){
      var choujiang = wx.getStorageSync('choujiang');//获取缓存中的抽奖券
    }else{
      var choujiang = 0;//获取缓存中的抽奖券
    }
    that.setData({
      zhuanpan_off: choujiang
    });
    //判断是否是转发打开，如果是就执行绑定推荐方法
    var bd_id = options.id;//获取转发时携带的转发用户的id
    if (bd_id > 0){
      //将转发过来的ID，放入缓存中
      wx.setStorageSync('bd_id', bd_id)//把转发的人id写入缓存
      }
    var that = this;
    wx.showLoading();//加载动画 
    wx.request({//判断社区页是否是会员访问
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_shequ_pd',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.kongzhi == 0) {
          //不显示会员
          that.setData({//展示医美问答板块
            z_index: 1
          })
        }
        if (res.data.kongzhi > 0) {
          //显示会员
          that.setData({//展示商学院板块
            z_index: 3
          })
        }
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
    this.zhihu();
    this.shangxueyuan();
  },
  zhihu: function () {//医美问答板块加载
    var that = this;
    wx.showLoading();//加载动画 
    wx.request({//加载首页基础信息
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_zhihu',
      method: 'post',
      data: {
        user_lei: wx.getStorageSync('user_lei'),
        user_id: wx.getStorageSync('id'),
        page:this.data.page
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.setStorageSync('ctrl', res.data.ctrl)//把自己的id写入缓存
        if (res.data.zhihu_index != null){
          that.setData({
            zhihu_index: that.data.zhihu_index.concat(res.data.zhihu_index),
          });
        } 
        if (res.data.zhihu_nobody != null){
          that.setData({
            zhihu_index: that.data.zhihu_index.concat(res.data.zhihu_nobody)
          });
        }
        
        if (res.data.zhihu_nobody == null && res.data.zhihu_index == null){
          wx.showToast({
            title: '没有更多了',
            duration: 2000
          });
          that.setData({
            more: '没有更多'
          })
        }
        that.setData({
          page: that.data.page + 1,
          kongzhi:res.data.kongzhi
        })
        
        if(res.data.count_message > 0){
          wx.showTabBarRedDot({//展示消息的红点
            index: 2
          })
        }else{
          wx.hideTabBarRedDot({
            index:2
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
  shequ: function () {//社区板块加载
    var that = this;
    wx.showLoading();//加载动画 
    wx.request({//加载首页基础信息
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_shequ',
      method: 'post',
      data: {
        user_lei: wx.getStorageSync('user_lei'),
        user_id: wx.getStorageSync('id'),
        jinghua: that.data.jinghua,//判断是不是只看精华帖
        shoucang: that.data.shoucang,//判断是不是只看我的收藏
        shequ_pick: that.data.shequ_pick,//判断排序
        page: this.data.sq_page
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.shequ == null){
          wx.showToast({
            title: '没有更多了',
            duration: 2000
          });
          that.setData({
            more: '没有更多'
          })
       }else{
          that.setData({
            shequ: that.data.shequ.concat(res.data.shequ),
            sq_page: that.data.sq_page + 1
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

  onShow: function () {  
    var that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.sx == 1){
      this.one_shequ();
    }
  },
  /*分享开始 */
  onShareAppMessage: function () {//
    var abc = wx.getStorageSync('id');
    var name = wx.getStorageSync('NickName');
    return {
      title: name + '邀请你一起来桔子放心美咯',
      path: '/pages/index/index?id=' + abc,
      success: function (res) {
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },

});