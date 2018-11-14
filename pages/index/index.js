var app = getApp();
let col1H = 0;
let col2H = 0;
Page({
  data: {
    imgUrls: [],
    uid: 0,
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
    page1: 1,//首页的下拉加载
    page2: 2,//第二页-找优惠的下拉加载
    page3: 2,//第三页-找机构的下拉加载
    page4: 2,//第四页-找医生的下拉加载
    index2_one: 1,//用于判断第二页的找优惠按钮是否第一次加载
    index3_one: 1,//用于判断第三页的找优惠按钮是否第一次加载
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
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    shaidan:[],
    shouquan:999,
    zhuanpan_off:0,
    zhuanpan_on:0,
    fenxiang:'',
    z_index:'1',
    head_on:'',//固定头部
    scrollH: 0,//瀑布流开始
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],//瀑布流结束
    jigou:[],
    userInfo: {},//我的开始
    u_info: {},
    cart_num: '',
    user_money: '',
    b_count: '',
    b_user_name: '',
    mobile_phone: '',
    none_1:'',
    none_2: '',
    on_cor1:'on_cor'
  },
  
  

  bindGetUserInfo: function (e) {
    var that = this;
   
    if (e.detail.userInfo) {
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo,
          loadingHidden: true
        })
      });
      //用户按了允许授权按钮
      wx.showModal({
        content: "授权成功，立即绑定手机号，享受桔子医美的层层优惠吧！",
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

      })
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
 
    wx.stopPullDownRefresh();//解决回弹问题
    
  },
/*底部tab的无缝切换 */
tabchange:function(e){

  if (e.currentTarget.dataset.tab == 1) {//如果是第一页
  console.log(1);
    
    this.setData({
      none_1: '',
      none_2: 'none',
      on_cor1: 'on_cor',
      on_cor2: ''
    })
  }
  if (e.currentTarget.dataset.tab == 2) {//如果是第二页
    console.log(2);
    
    var b_user_name = this.data.b_user_name;
    console.log(b_user_name);
    if (b_user_name == 0) {//如果没有获取到姓名，就再获取一次
    var that = this;
      that.loadOrderStatus();
      console.log(b_user_name);
    }
    this.setData({
      none_1: 'none',
      none_2: '',
      on_cor1: '',
      on_cor2: 'on_cor'
    })
  }

},
  /*首页头部点击切换 */
  indexChange: function (e) {
    if (e.target.dataset.current == 1){
      
    this.setData({
      z_index:1,
    })
    }
    if (e.target.dataset.current == 2) {//需要判断第一次加载
      var index2_one = this.data.index2_one //取到找优惠的加载次数
      if (index2_one == 1){//如果是第一次
        this.youhui()//加载找优惠列表
        this.setData({
          z_index: 2,
          index2_one: index2_one + 1
        })
      }else{//如果不是第一次加载，就只切换过来就好
        this.setData({
          z_index: 2,
          index2_one: index2_one + 1
        })
      }
      
      
      
    }
    if (e.target.dataset.current == 3) {
      var index3_one = this.data.index3_one //取到找机构的加载次数
      if (index3_one == 1) {//如果是第一次
        this.jigou()//加载找机构列表
        this.setData({
          z_index: 3,
          index3_one: index3_one + 1
        })
      } else {//如果不是第一次加载，就只切换过来就好
        this.setData({
          z_index: 3,
          index3_one: index3_one + 1
        })
      }
    }
    if (e.target.dataset.current == 4) {
      this.setData({
        z_index: 4,
      })
    }
  },

  onLoad: function (options) {//
    var that = this;
    var bd_id = options.id;//获取转发时携带的转发用户的id
    var anran_id = wx.getStorageSync('id');
    this.loadOrderStatus();
    //判断是否显示抽奖弹窗
    if (wx.getStorageSync('choujiang')){
      var choujiang = wx.getStorageSync('choujiang');//获取缓存中的抽奖券
    }else{
      var choujiang = 0;//获取缓存中的抽奖券
    }
    that.setData({
      zhuanpan_off: choujiang
    });
    console.log('抽奖' + this.data.zhuanpan_off);
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
    this.jiazai()
    /*瀑布流部分开始 */
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;

        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });

        this.loadImages();
      }
    })
  /*瀑布流部分结束 */
    
  },
 youhui:function(){//优惠的第一屏加载
   var that = this;
   wx.showLoading();//加载动画
   wx.request({//加载首页推荐商品
     url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_xzzzp',
     method: 'post',
     data: {
       page: 1,
     },
     header: {
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     success: function (res) {
       var xzzzp = res.data.xzzzp;
       that.setData({
         xzzzp: xzzzp,
         zhuanpan_on: res.data.zhuanpan,  //转盘
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
    wx.showLoading();//加载动画
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_jigou',
      method: 'post',
      data: {
        page: 1,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var jigou = res.data.jigou;
        that.setData({
          jigou: jigou,
          
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
          that.setData({
            djdzm: djdzm,
            laba: laba,
            ms_goods: ms_goods,
            tjhw: tjhw,
            imgUrls: banner
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
/*瀑布流js开始 */
  onImageLoad: function (e) {
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width;         //图片原始宽度
    let oImgH = e.detail.height;        //图片原始高度
    let imgWidth = this.data.imgWidth;  //图片设置的宽度
    let scale = imgWidth / oImgW;        //比例计算
    let imgHeight = oImgH * scale;      //自适应高度

    let images = this.data.images;
    let imageObj = null;

    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id === imageId) {
        imageObj = img;
        break;
      }
    }

    imageObj.height = imgHeight;

    let loadingCount = this.data.loadingCount - 1;
    let col1 = this.data.col1;
    let col2 = this.data.col2;
    
    if (col1H <= col2H) {
      col1H += imgHeight;
      col1.push(imageObj);
    } else {
      col2H += imgHeight;
      col2.push(imageObj);
    }

    let data = {
      loadingCount: loadingCount,
      col1: col1,
      col2: col2
    };

    if (!loadingCount) {
      data.images = [];
    }

    this.setData(data);
  },

  loadImages: function () {
    var that = this;
    var page1 = that.data.page1;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=get_shaidan2',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        page: page1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shaidan = res.data.comments;
        if(shaidan == ''){
          wx.showToast({
            title: '没有更多',
            duration: 2000
          });
        }else{
          that.setData({
            loadingCount: shaidan.length,
            images: shaidan,
            page1: page1 + 1,
          });
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
    /*let images = [
      { pic: "../../images/1.png", height: 0 },
      { pic: "../../images/2.png", height: 0 },
      { pic: "../../images/3.png", height: 0 },
      { pic: "../../images/4.png", height: 0 },
      { pic: "../../images/5.png", height: 0 },
      { pic: "../../images/6.png", height: 0 },
      { pic: "../../images/7.png", height: 0 },
      { pic: "../../images/8.png", height: 0 },
      { pic: "../../images/9.png", height: 0 },
      { pic: "../../images/10.png", height: 0 },
      { pic: "../../images/11.png", height: 0 },
      { pic: "../../images/12.png", height: 0 },
      { pic: "../../images/13.png", height: 0 },
      { pic: "../../images/14.png", height: 0 }
    ];

    let baseId = "img-" + (+new Date());

    for (let i = 0; i < images.length; i++) {
      images[i].id = baseId + "-" + i;
    }

    this.setData({
      loadingCount: images.length,
      images: images
    });*/
  },
/*瀑布流js结束 */

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
          that.setData({
            mobile_phone: u_info.mobile_phone,
            u_info: u_info,
            cart_num: cart_info.total_number,
            user_money: u_info.user_money,
            vip: u_info.vip,
            b_count: b_count,
            b_user_name: res.data.user_name
          });
          console.log(998);
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
  /*分享开始 */
  onShareAppMessage: function () {//
    var abc = wx.getStorageSync('id');
    var name = app.globalData.userInfo.NickName;
    
    return {
      title: name + '邀请你一起来桔子医美咯',
      path: '/pages/index/index?id=' + abc,
      success: function (res) {
        // 分享成功
      
        wx.showModal({
          title: '分享成功',
          content: '好友授权登录后您可以获得他2%~20%的消费奖励哦！',
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