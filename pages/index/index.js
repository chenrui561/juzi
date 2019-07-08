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
    adcode:'',//行政区域代码
    goods_list: [],
    count_goods_list:[],
    proCat:[],
    f_fenxiang:0,
    page1: 1,//首页的下拉加载
    page2: 2,//第二页-找优惠的下拉加载
    page3: 2,//第三页-找机构的下拉加载
    page4: 2,//第四页-找医生的下拉加载
    index2_one: 1,//用于判断第二页的找优惠按钮是否第一次加载
    index3_one: 1,//用于判断第三页的找机构按钮是否第一次加载
    index4_one: 1,//用于判断第三页的找机构按钮是否第一次加载
    index5_one: 1,//用于判断第三页的找机构按钮是否第一次加载
    index: 2,
    top:1,//是否显示找优惠的头部
    brand:[],
    xzzzp: [],
    ms_goods:[],
    tjhw:[],
    laba:[],
    djdzm: [],
    index_page:[1,2,3,4],//每个tab的页码数
    // 滑动
    imgUrl: [],
    pick:[],
    pick_id:-1,//默认pick——id为0，大于0就以pick 为主的位置来加载
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
    dianpu:[],
    yisheng:[],
    yisheng_off:0,
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
    fenlei:1,//分类
    paixu:1,//排序
    category_list:[],//项目分类
    category_list1: [],//项目分类
    category_list2: [],//项目分类
    category_list3: [],//项目分类
    category_list4: [],//项目分类
    page_tab:1 ,//下拉刷新默认显示首页
    load_ing:0,//加载中状态，一旦处于加载中状态，就不开启新的请求。1为加载中，0为可以加载
    new_page:2//新方法下的页数，新方法采用替换式,1为首页，2为找优惠，3找机构，4找医生
  },

  fenlei:function(e){
      this.setData({
        fenlei: e.target.dataset.fenlei
      })
    this.youhui();
  },
  paixu: function (e) {
    this.setData({
      paixu: e.target.dataset.paixu
    })
    this.youhui();
  },
pick:function(e){
  this.setData({
    pick_id: e.detail.value, //0武汉，1咸宁，2机构
    city: this.data.pick[e.detail.value]
  })
  if (this.data.new_page == 2){//加载找优惠
    this.youhui();
  }
  if (this.data.new_page == 3) {//加载找店铺
    this.dianpu();
  }
  if (this.data.new_page == 4) {//加载找机构
    this.jigou();
  }
  if (this.data.new_page == 5) {//加载找医生
    this.yisheng();
  }
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

      that.setData({//也要消掉弹窗，因为已经确认了授权了
        shouquan: 1,
      })
      //用户按了允许授权按钮
     /* wx.showModal({
        content: "授权成功，立即绑定手机号，享受桔子放心美的层层优惠吧！",
        showCancel: '不了',
        confirmText: '去绑定',
        success: function (res) {
         

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

  getUserLocation: function () {
    let vm = this;
    wx.getSetting({
      success: (res) => {
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
  formid: function (e) {
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
          longitude: longitude,
          adcode: res.result.ad_info.adcode
        })
        vm.youhui();
        vm.jiazai();
        // vm.distance(res.result.location.lat, res.result.location.lat, 39.928722, 116.393853)
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },

  //  第二页找优惠的下拉点击加载更多
  index2_jiazai: function (e) {
    var that = this;
    var page2 = that.data.page2;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    var fenlei = this.data.fenlei;
    var paixu = this.data.paixu;
    var pick_id = this.data.pick_id;
    wx.showLoading();//加载动画
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_xzzzp',
      method: 'post',
      data: {
        page: page2 + 1,//当前tab看到第几页了
        latitude: latitude,
        longitude: longitude,
        fenlei: fenlei,
        paixu: paixu,
        user_id: wx.getStorageSync('id'),
        pick: pick_id,
        adcode: that.data.adcode
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
          zhuanpan_on: res.data.zhuanpan,  //转盘
          huodong_img: res.data.huodong, //活动开关
          huodong_info: res.data.huodong_info,
          imgUrls: res.data.banner,
          diqu_info_id: res.data.diqu_info_id,
          fenxiang: res.data.fenxiang,
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
    var page_tab = this.data.page_tab;//底部tab
    var new_page = this.data.new_page;//头部tab
    var cat_id = this.data.cat_id;//分类id
    var page1 = this.data.page1;
    var load_ing = this.data.load_ing;
    var that = this;
      if (new_page == 4) {//头部tab为2时，重新加载找机构
        this.jigou()//加载找机构列表
      } else if (new_page == 5) {//头部tab为5时，重新加载找医生
        this.yisheng()//加载找医生列表
      } 
    qqmapsdk = new QQMapWX({
      key: 'GXRBZ-77QHI-KHGGT-57UYR-UEED7-F3FLX' //自己的key秘钥 http://lbs.qq.com/console/mykey.html 在这个网址申请
    });
    this.getUserLocation();
    wx.stopPullDownRefresh();//解决回弹问题
    
  },
  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {
    var new_page = this.data.new_page;
    var page_tab = this.data.page_tab;
    var cat_id = this.data.cat_id;
    if (new_page == 2){//表示第一页即首页
      
      this.index2_jiazai();
    }
    if (new_page == 3) {//表示找店铺

     // this.index2_jiazai();
    }
    if (new_page == 4) {//表示找机构

      this.jigou_xiala();
    }
    if (new_page == 5) {//表示找医生
     this.yisheng_xiala();
      //this.index2_jiazai();
    }
  },

/*首页-日记头部点击切换分类，直接刷新分类日记即可 */
r_change:function(e){
  var cat_id = this.data.cat_id;
    this.setData({
      cat_id: e.target.dataset.catid,//选中的状态
      col1: [],
      col2: [],
      page1: 1
      //new_page: 1 //新方法的头部第一页
    })
 /* wx.pageScrollTo({//回到顶部
    scrollTop: 0
  })*/

},

  /*商城页头部点击切换 */
  indexChange: function (e) {
    if (e.target.dataset.current == 2) {//需要判断第一次加载
      var index2_one = this.data.index2_one //取到找优惠的加载次数
        this.youhui()//加载找优惠列表
        this.setData({
          z_index: 2,
          page: 1,
          index2_one: index2_one + 1,
          new_page: 2 //新方法的头部第二页
        })
    }
    if (e.target.dataset.current == 3) {
      var index3_one = this.data.index3_one //取到找机构的加载次数
      this.setData({
        z_index: 3,
        page: 1,
        index3_one: index3_one + 1,
        new_page: 3 //新方法的头部第一页
      })
        this.dianpu()//加载找店铺列表
    }
    if (e.target.dataset.current == 4) {//找机构
      var index4_one = this.data.index4_one //取到找机构的加载次数
      this.setData({
        z_index: 4,
        index4_one: index4_one + 1,
        page:1,
        new_page: 4 //新方法的头部第一页
      })
        this.jigou()//加载找jigou列表
    }
    if (e.target.dataset.current == 5) {//找医生
      var index5_one = this.data.index5_one //取到找医生的加载次数
      this.setData({
        z_index: 5,
        page: 1,
        index5_one: index5_one + 1,
        new_page: 5 //新方法的头部第一页
      })
        this.yisheng()//加载找jigou列表
    }
  },

  onLoad: function (options) {//
    //console.log(wx.getSystemInfoSync().windowWidth * 254/750);
   
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
    //判断缓存里面有没有取到用户id
    if (anran_id == ''){//如果缓存里面没有id，那就弹授权
      that.setData({
        shouquan: 0,
      });
    }
    /*app.getOpenid().then(function (openid) {
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
    });*/
    this.jiazai();
    this.youhui();
  //  wx.setStorageSync('user_lei', res.data.user_info.user_lei)//把自己的用户类型写入缓存
    this.setData({
      banner_height: wx.getSystemInfoSync().windowWidth * 254 / 750,
      user_lei: wx.getStorageSync('user_lei')
    })
  },
 youhui:function(){//优惠的第一屏加载
   var that = this;
   var latitude = this.data.latitude;
   var longitude = this.data.longitude;
   var fenlei = this.data.fenlei;
   var paixu = this.data.paixu;
   var pick_id = this.data.pick_id;
   wx.showLoading();//加载动画
   wx.request({//加载首页推荐商品
     url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_xzzzp',
     method: 'post',
     data: {
       page: 1,
       latitude: latitude,
       longitude: longitude,
       fenlei:fenlei,
       paixu:paixu,
       user_id: wx.getStorageSync('id'),
       pick:pick_id,
       adcode: that.data.adcode
     },
     header: {
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     success: function (res) {
       var xzzzp = res.data.xzzzp;
       that.setData({
         xzzzp: xzzzp,
         page2:1,
         zhuanpan_on: res.data.zhuanpan,  //转盘
         huodong_img: res.data.huodong, //活动开关
         huodong_info:res.data.huodong_info,
         imgUrls: res.data.banner,
         diqu_info_id: res.data.diqu_info_id,
         fenxiang: res.data.fenxiang
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
   })
 },
  jigou: function () {//机构的第一屏加载
    var that = this;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    wx.showLoading();//加载动画
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_jigou',
      method: 'post',
      data: {
        page: 1,
        user_id: wx.getStorageSync('id'),
        latitude: latitude,//维度
        longitude: longitude,//经度
        pick_id:this.data.pick_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var jigou = res.data.jigou;
        that.setData({
          jigou: jigou,
          page:1,
          diqu_info_id: res.data.diqu_info_id,
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
    })
  },
  jigou_xiala: function () {//机构的第一屏加载
    var that = this;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    wx.showLoading();//加载动画
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_jigou',
      method: 'post',
      data: {
        page: that.data.page + 1,
        user_id: wx.getStorageSync('id'),
        latitude: latitude,//维度
        longitude: longitude,//经度
        pick_id: this.data.pick_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var jigou = res.data.jigou;
        if (res.data.jigou.length == 0){
          that.setData({
            jigou: that.data.jigou.concat(jigou),
          });
        }
        that.setData({
          jigou: that.data.jigou.concat(jigou),
          page:that.data.page + 1,
          diqu_info_id: res.data.diqu_info_id,
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
    })
  },
  dianpu: function () {//机构的第一屏加载
    var that = this;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    wx.showLoading();//加载动画
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_dianpu',
      method: 'post',
      data: {
        page: 1,
        user_id: wx.getStorageSync('id'),
        latitude: latitude,
        longitude: longitude,
        pick_id:that.data.pick_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var jigou = res.data.jigou;
        that.setData({
          dianpu: jigou,

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
    })
  },
  yisheng_xiala: function () {//医生的加载
    var that = this;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    wx.showLoading();//加载动画
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_yisheng',
      method: 'post',
      data: {
        page: that.data.page + 1,
        user_id: wx.getStorageSync('id'),
        latitude: latitude,
        longitude: longitude,
        pick_id: that.data.pick_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var yisheng = res.data.yisheng;
        that.setData({
          yisheng: that.data.yisheng.concat(yisheng),
          page: that.data.page + 1
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
    })
  },
  yisheng: function () {//医生的加载
    var that = this;
    var latitude = this.data.latitude;
    var longitude = this.data.longitude;
    wx.showLoading();//加载动画
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_yisheng',
      method: 'post',
      data: {
        page: 1,
        user_id: wx.getStorageSync('id'),
        latitude: latitude,
        longitude: longitude,
        pick_id: that.data.pick_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var yisheng = res.data.yisheng;
        that.setData({
          yisheng: yisheng,
          page: 1
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
    })
  },
  jiazai: function(){//首页的第一屏加载
    var that = this;
    wx.showLoading();//加载动画 
      wx.request({//加载首页基础信息
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_index',
        method: 'post',
        data: {
          user_lei: wx.getStorageSync('user_lei'),
          user_id: wx.getStorageSync('id'),
          
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
          if(res.data.shouquan_ctrl == 1){
              that.setData({
                shouquan:0
              })
          }
          wx.setStorageSync('ctrl', res.data.ctrl)//把自己的id写入缓存
          wx.setStorageSync('user_lei', res.data.user_lei)//把自己的id写入缓存
          that.setData({
            djdzm: djdzm,
            laba: laba,
            ms_goods: ms_goods,
            tjhw: tjhw,
            category_list: res.data.category_list,
            category_list1: res.data.category_list1,
            category_list2: res.data.category_list2,
            category_list3: res.data.category_list3,
            category_list4: res.data.category_list4,
            //imgUrls: banner,
            user_lei:res.data.user_lei,
            libao:res.data.libao,
            pick:res.data.pick,
            top: res.data.top,
            yisheng_off: res.data.yisheng_off
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

/*浮动分享弹出层 */
f_fenxiang:function(e){
  let that = this;
  let djs = 60;

  setTimeout(function () {//延时10秒关闭弹出层
   
    that.setData({
      f_fenxiang: 1,
    });
  }, 10000)

},






  onShow: function () {
    
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
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },

});