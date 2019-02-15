//index.js  
//获取应用实例  
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({
  firstIndex: -1,
  data:{
    bannerApp:true,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0, //tab切换  
    productId:0,
    jb_price:'',
    is_on_sale:'',
    itemData:{},
    bannerItem:[],
    title:'',
    goods_img:'',
    price: '',
    goods_number:'' ,
    goods_desc:'',
    goods_id:'',
    market_price:'',
    count_goods_user:'',
    is_best:'0',
    buynum:1,
    bd_id:0,
    tid:0,
    t_user:[],
    wenhao:'',
    // 产品图片轮播
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //准备数据
    //数据结构：以一组一组来进行设定
    shoucang:'收藏',
    none_off:'',
    none_on:'none',
    shouquan: 999,
    is_promote:0,
    phone:0,
    user_lei:0,
    zixun:1  //0就是显示咨询提示，1不显示
  },
  bindGetUserInfo: function (e) {
    var that = this;

    if (e.detail.userInfo) {
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据
        that.setData({
          userInfo: userInfo,
          loadingHidden: true,
          shouquan: 1,
        })

      });
      //用户按了允许授权按钮
      
    } else {
      wx.showModal({
        content: "您已拒绝授权",
        showCancel: false,
        confirmText: '知道了',
        success: function (res) {
          that.setData({
            showModal2: false
          });
        }
      })
    }
  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
  var that = this;
    this.loadProductDetail();
    this.car_count();
    setTimeout(function () {//延时1秒弹出
      that.setData({
      zixun:0
    })
    }, 1000)
   setTimeout(function () {//延时5秒关闭弹出
      that.setData({
        zixun: 1,
      });
    }, 5000)
  },

 
  // 传值
  onLoad: function (option) {    
    wx.showLoading();//加载动画
    var bd_id = option.id;//获取转发时携带的转发用户的id
    var tid = option.tid;//获取单独推荐商品的用户的ID
    var anran_id = wx.getStorageSync('id');//去取缓存里面的id，因为第二次调用的时候，app.js没执行，只能去缓存拿id
    var that = this;
    var c_tuan = that.data.c_tuan
    
    //判断是否是转发打开，如果是就执行绑定推荐方法
    if (bd_id > 0) {
      //将转发过来的ID，放入缓存中
      wx.setStorageSync('bd_id', bd_id)//把转发的人id写入缓存
      that.setData({
        bd_id: bd_id
      });
    } 
//判断该商品是否有人推荐的
    if (tid > 0) {
      var that = this;
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_get_user_info',
        method: 'post',
        data: {
          id: tid
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {

          that.setData({
            t_user: res.data[0],
          });
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        },
      });
      //将tid写入当前页
      that.setData({
        tid: tid
      });
    } 
    this.initNavHeight();
    

    var that = this;
    that.setData({
      productId: option.productId,
      nick_name: wx.getStorageSync('NickName'),
      head_img: wx.getStorageSync('HeadUrl'),
    });

    var hx_id = wx.getStorageSync('id')//从缓存中获取用户id
     if (hx_id > 0){}else {//判断是否已经登录
        app.getOpenid().then(function (openid) {

            
              if (openid == 66){
                that.setData({
                  shouquan: 999
                });
              } 
              if (openid == 88) {
                that.setData({
                  shouquan: 0
                });
              } 

            });
    }
    
  },
/*购物车数量 */
car_count:function(){
  var that = this;
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_count_cart',
    method: 'post',
    data: {
      user_id: wx.getStorageSync('id')
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var count_car = res.data.count_car;
      that.setData({
        count_car: count_car,
      });
      wx.hideLoading()//关闭加载动画
    },
    error: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000,
      });
    },
  });
},
// 商品详情数据获取
  loadProductDetail:function(){
    
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_goods_info',
      method:'post',
      data: {
        pro_id: that.data.productId,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
          var pro = res.data.goods;
          var phone = res.data.user_info;
          var content = pro.goods_desc;
          var count_goods_user = res.data.count_goods_user; 
          //that.initProductData(data);
          WxParse.wxParse('content', 'html', content, that, 3);
          that.setData({
            itemData:pro,
            phone: phone,
            shoucang: res.data.cc,
            none_off:res.data.none_off,
            none_on: res.data.none_on,
            title: pro.goods_name,
            goods_img: pro.goods_img,
            jb_price: pro.shop_price,//没有属性的时候的价格
            price: pro.shop_price,//可能会变的有属性的价格
            is_best: pro.is_best,
            market_price:pro.market_price,
            goods_id: pro.goods_id,
            goods_number: pro.goods_number,
            goods_desc:pro.goods_desc,
            is_on_sale: pro.is_on_sale,
            is_promote: pro.is_promote,
            user_lei: res.data.user_lei
          });
        var query = wx.createSelectorQuery();
        query.select('.wxParse').boundingClientRect()
        query.exec((res) => {
          var listHeight = res[0].height; // 获取list高度
          that.setData({
            listHeight: listHeight
          });
          console.log(listHeight)
        })
        
        wx.hideLoading()//关闭加载动画

      },
      error:function(e){
        wx.showToast({
          title:'网络异常！',
          duration:2000,
        });
      },
    });

    
  },

  

//添加到收藏
  addFavorites:function(e){
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_add_collection',
      method:'post',
      data: {
        anran_id: wx.getStorageSync('id'),
        goods_id: that.data.productId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.state;
        if (data == 2) {
          wx.showToast({
            title: '取消成功',
            duration: 2000,
          });
          that.setData({
            shoucang: '收藏',
            none_off: '',
            none_on: 'none'
          });
        }
        if (data == 4) {
          wx.showToast({
            title: '收藏成功',
            duration: 2000,
          });
          that.setData({
            shoucang: '取消收藏',
            none_off: 'none',
            none_on: ''
          });
        }
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },

  addShopCart:function(e){ //添加到购物车
    var that = this;
    var phone = this.data.phone;
    if (phone == 0){//如果没有检测到手机，就提示绑定
      wx.showToast({
        title: '未绑定手机',
        icon: 'none',
        duration: 1000
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '../user/bd'
        });//要延时执行的代码
      }, 1000)
      return;
      
    }
    wx.showLoading();//加载动画
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_add_cart',
      method:'post',
      data: {
        uid: app.d.userId,
        anran_id: wx.getStorageSync('id'),
        pid: that.data.productId,
        num: that.data.buynum,
        sx_id: that.data.sx_id,
        tid: that.data.tid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {//新添加的商品返回值是购物车id
        // //--init data        
        var data = res.data;
        var cid = that.data.productId;
        var tid = that.data.tid;
        wx.hideLoading()//关闭加载动画
        if(data.status == 1){
          if(data.res == 2){//如果返回值为2就是库存不足
            wx.showToast({
              title: '库存不足！',
              icon: 'success',
              duration: 2000
            });

          }else{
            var ptype = e.currentTarget.dataset.type;
            if(ptype == 'buynow'){//如果是直接购买
              
              wx.navigateTo({
                url: '../order/pay?cartId=' + cid +'&tid=' + tid
              });
              return;
          
            } else if (ptype == 'tuan') {//如果是拼团购买,且来为团长
              wx.redirectTo({
                url: '../order/pay?g_id=' + data.res + '&tuanid=1&tuan_sn=1'
              });
              return;

            } else if (ptype == 'tuan_user') {//如果是拼团购买,且来为团员,把团的sn带到下个页面,支付页面
              wx.redirectTo({
                url: '../order/pay?g_id=' + data.res + '&tuanid=2&tuan_sn=' + that.data.tuan_sn
              });
              return;

            }else{
              that.car_count();
                wx.showToast({
                    title: '加入购物车成功',
                    icon: 'success',
                    duration: 2000
                });
              }    
          } 
        }else{
          wx.hideLoading()//关闭加载动画
          wx.showToast({
                title: data.err,
                duration: 2000
            });
        }
      },
      fail: function() {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  
 
  onShareAppMessage: function () {//
    var that = this;
    var abc = wx.getStorageSync('id');
    var name = wx.getStorageSync('NickName');
    var title = that.data.title;
    var pro_id = that.data.goods_id;
    var tuan_sn = that.data.tuan_sn;
      return {
        title: name + '分享给你' + title,
        path: '/pages/product/detail?productId=' + pro_id + '&id=' + abc,
        success: function (res) {
          // 分享成功
        },
        fail: function (res) {
          // 分享失败
        }
      }
    
    
  },
  bindChange: function (e) {//滑动切换tab 
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  initNavHeight:function(){////获取系统信息
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  bannerClosed:function(){
    this.setData({
      bannerApp:false,
    })
  },
  swichNav: function (e) {//点击tab切换
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
});
