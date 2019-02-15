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
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 500,
    circular: true,
    productData: [],
    haoyou:[],
    goods_list: [],
    count_goods_list:[],
    proCat:[],
    zhihu_index:[],//知乎首页
    zhihu_nobody:[],
    f_fenxiang:0,
    page1: 1,//首页的下拉加载
    page2: 2,//第二页-找优惠的下拉加载
    page3: 2,//第三页-找机构的下拉加载
    page4: 2,//第四页-找医生的下拉加载
    index2_one: 1,//用于判断第二页的找优惠按钮是否第一次加载
    index3_one: 1,//用于判断第三页的找机构按钮是否第一次加载
    index4_one: 1,//用于判断第三页的找机构按钮是否第一次加载
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
    z_index:'2',//原第一页去掉了，现在的第二页就是第一页了
    cat_id: '1',//首页-日记的选中状态，也是cat_id
    head_on:'',//固定头部
    scrollH: 0,//瀑布流开始
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],//瀑布流结束
    jigou:[],
    yisheng:[],
    userInfo: {},//我的开始
    u_info: {},
    cart_num: '',
    user_money: '',
    b_count: '',
    b_user_name: '',
    mobile_phone: '',
    more:'下拉加载中',
    none_1:'none',//初始状态，日记
    none_2: 'none',//初始状态，我的
    none_3: '',//初始状态，商城
    none_4: 'none',
    on_cor3:'on_cor',//初始tab状态
    qr_img:'',
    province: '',//地理位置
    city: '',//地理位置
    latitude: '',//地理位置
    longitude: '',//地理位置
    category_list:[],//项目分类
    category_list1: [],//项目分类
    category_list2: [],//项目分类
    category_list3: [],//项目分类
    category_list4: [],//项目分类
    page_tab:1 ,//下拉刷新默认显示首页
    load_ing:0,//加载中状态，一旦处于加载中状态，就不开启新的请求。1为加载中，0为可以加载
    new_page:2//新方法下的页数，新方法采用替换式,1为首页，2为找优惠，3找机构，4找医生
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

close_choujiang:function(e){
  var that = this;
  that.setData({
    zhuanpan_off: 0
  });
},
  

  //  第二页找优惠的下拉点击加载更多
  index2_jiazai: function (e) {
    var that = this;
    var page2 = that.data.page2;
    wx.showLoading();//加载动画
    console.log(this.data.page_tab);
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_xzzzp',
      method: 'post',
      data: {
        page: page2,//当前tab看到第几页了

      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var xzzzp = res.data.xzzzp;
        if (xzzzp == '') {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          that.setData({
            more:'没有更多'
          })
          return false;
        }
        that.setData({
          page2: page2 + 1,
          xzzzp: that.data.xzzzp.concat(xzzzp)
        });
        //endInitData
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  /**
     * 页面相关事件处理函数--监听用户下拉动作--下拉刷新
     */
  onPullDownRefresh: function () {
    this.zhihu();
    wx.stopPullDownRefresh();//解决回弹问题
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {

  },



  

  onLoad: function (options) {//
    //console.log(wx.getSystemInfoSync().windowWidth * 254/750);
    console.log('page_tab=' + this.data.page_tab);
    this.setData({
      banner_height: wx.getSystemInfoSync().windowWidth * 254 / 750,
      user_lei: wx.getStorageSync('user_lei')
    })
    qqmapsdk = new QQMapWX({
      key: 'GXRBZ-77QHI-KHGGT-57UYR-UEED7-F3FLX' //自己的key秘钥 http://lbs.qq.com/console/mykey.html 在这个网址申请
    });
    let vm = this;
    vm.getUserLocation();
    var that = this;
    var bd_id = options.id;//获取转发时携带的转发用户的id
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
    if (bd_id > 0){
      //将转发过来的ID，放入缓存中
      wx.setStorageSync('bd_id', bd_id)//把转发的人id写入缓存
      }

    app.getOpenid().then(function (openid) {
      if (openid == 66){
        that.setData({
          shouquan: 999,
        });
      } 
      if (openid == 88) {
        that.setData({
          shouquan: 0
        });
      } 
    });
    this.jiazai();
    
  },

  jiazai: function(){//首页的第一屏加载
    var that = this;
    wx.showLoading();//加载动画 
      wx.request({//加载首页基础信息
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_index',
        method: 'post',
        data: {
          user_lei: wx.getStorageSync('user_lei')
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var djdzm = res.data.djdzm;
          var laba = res.data.laba;
          var ms_goods = res.data.ms_goods;
          var tjhw = res.data.tjhw_num;
          var banner = res.data.banner;
          wx.setStorageSync('ctrl', res.data.ctrl)//把自己的id写入缓存
          that.setData({
            djdzm: djdzm,
            laba: laba,
            ms_goods: ms_goods,
            tjhw: tjhw,
            imgUrls: banner,
            libao:res.data.libao,
            zhihu_index: res.data.zhihu_index,
            zhihu_nobody: res.data.zhihu_nobody
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
  zhihu: function () {//首页的第一屏加载
    var that = this;
    wx.showLoading();//加载动画 
    wx.request({//加载首页基础信息
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_zhihu',
      method: 'post',
      data: {
        user_lei: wx.getStorageSync('user_lei')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.setStorageSync('ctrl', res.data.ctrl)//把自己的id写入缓存
        that.setData({
          zhihu_index: res.data.zhihu_index,
          zhihu_nobody: res.data.zhihu_nobody
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
  shuaxin:function(e){
    wx.reLaunch({//绑定成功之后重新加载小程序，并回到首页
      url: '../index/index',
    })//要延时执行的代码
  },

/*我的信息 */
  loadOrderStatus: function () {
    //获取用户订单数据
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_user_info',
      method: 'post',
      data: {
        anran_id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var status = res.data.status;
        if (status == 1) {

          var u_info = res.data.user_info;
          var cart_info = res.data.cart_goods;
          var b_count = res.data.b_count;
          if(u_info == null){
            that.setData({
              b_user_name: 0,
            });
          }else{
            wx.setStorageSync('user_lei', res.data.user_info.user_lei)//把自己的用户类型写入缓存
            wx.setStorageSync('choujiang', res.data.user_info.choujiang)//判断弹窗是否出现
          that.setData({
            all_money: res.data.all_money,
            count_car: res.data.count_car,
            mobile_phone: u_info.mobile_phone,
            u_info: u_info,
            cart_num: cart_info.total_number,
            user_money: u_info.user_money,
            b_count: b_count,
            b_user_name: res.data.user_name,
            count1: res.data.count1,
            count2: res.data.count2,
            count3: res.data.count3,
            count4: res.data.count4,
          });
          }
        } else {
          wx.showToast({
            title: '非法操作.',
            duration: 2000
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  /*生成二维码 */
  qr: function (e) {
    var that = this;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=testcode',
      method: 'post',
      data: {
        anran_id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          qr_img: res.data.qr_img,
          qr_arr:res.data.qr_arr
        });
        
        wx.previewImage({
          current: res.data.qr_img,
          urls: res.data.qr_arr
        })
        wx.hideLoading()//关闭加载动画
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
        wx.hideLoading()//关闭加载动画
      }
    });
  },
  big_img(e) {//点击显示大图
    const bigimg = e.target.dataset.bigimg
    const current = e.target.dataset.img
    var con = e.target.dataset.con
    wx.previewImage({
      current: current,
      urls: bigimg
    })
  },
  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
      //  console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        }
        else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },
  // 微信获得经纬度
  getLocation: function () {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
       
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },
  // 获取当前地理位置
  getLocal: function (latitude, longitude) {
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        // console.log(JSON.stringify(res));
        let province = res.result.ad_info.province
        let city = res.result.ad_info.city
        vm.setData({
          province: province,
          city: city,
          latitude: latitude,
          longitude: longitude
        })
        console.log(res);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },
  onShow: function () {
    this.zhihu();
  },
  /*分享开始 */
  onShareAppMessage: function () {//
    var abc = wx.getStorageSync('id');
    var name = wx.getStorageSync('NickName');
    return {
      title: name + '邀请你一起来桔子放心美咯',
      path: '/pages/index/index?id=' + abc,
      success: function (res) {
        // 分享成功
      
        wx.showModal({
          title: '分享成功',
          content: '好友授权登录后您可以获得ta的2%~20%消费奖励哦！',
          showCancel: false,
          confirmText: '好的',
          success: function (res) {

          }
        })
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },

});