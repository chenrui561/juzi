var app = getApp();
// pages/order/downline.js
var util = require('../../utils/util.js');
Page({
  data:{
    itemData:{},
    userId:0,
    user_id: 0,//卖的人ID
    paytype:'weixin',//0线下1微信
    remark:'',
    cartId:0,//判断是否是一键购物
    tuan_sn: 1,//判断是否是从拼团入口进来的，tuan_sn为团长的sn，团长是没有这个参数的，如果是团长，那就是1咯
    re_tuan_sn:'',//下单之后返回的订单sn
    tuanid:0,//入口判断，如果是1表示来自团长入口，如果是2，表示来自团员入口
    addrId:0,//收货地址//测试--
    btnDisabled:false,
    productData:[],
    address:[],
    user_bonus:[],
    tid:0,
    total:0,
    vprice:0,
    vid:0,
    sid: 10,//进来默认选择的是快递方式，ID为10
    youhui:0,
    ship_fee:0,
    moren_fee:'',
    addemt:1,
    goods_info:[],
    vou:[],
    g_id:'',//购物车的自增id，用于拼团商品判断
    tuan_price:'',
    goods_id:'',
    region:[],
    yue:0,
    pay_yue:'',//动态的余额支付金额
    on_pay_yue:0,//最终确认的余额支付金额
    manjian:'',
    date: '2016-09-01',
    input:false //默认余额的输入状态

  },
  onLoad:function(options){
    var uid = app.d.userId;
    var cart_goods_id = options.cartId
    var g_id = options.g_id
    var date = util.formatTime(new Date());
    this.setData({
      cartId: options.cartId,
      userId: uid,
      user_id: options.user_id,
      tuan_sn: options.tuan_sn,
      tuanid: options.tuanid,
      g_id: options.g_id,
      tid: options.tid,
      date: date
    });

    this.loadProductDetail();
  },
  
  loadProductDetail:function(){
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_checkout',
      method:'post',
      data: {
        anran_id: wx.getStorageSync('id'),//取得缓存里面的id而不是app.js的id
        cartId: that.data.cartId,
        tuan_sn: that.data.tuan_sn,
        g_id: that.data.g_id,
        tid:that.data.tid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        
        //that.initProductData(res.data);
        var goods_info = res.data.cart_goods;
        var consignee_list = res.data.consignee_list;
        var user_bonus = res.data.user_bonus;
        var moren_fee = res.data.moren_fee;
        var total = res.data.total.goods_price_formated;
     
        that.setData({
          goods_info: goods_info,
          address: consignee_list,
          user_bonus: user_bonus,
          moren_fee: moren_fee,
          total: moren_fee,
          zprice: res.data.total.goods_price_formated,
          tuan_price: res.data.tuan_price,
          goods_id: goods_info[0].goods_id,
          region: res.data.region,
          yue: res.data.yue,
        });
        console.log(that.data.address);
        //endInitData
      },
    });
  },

  remarkInput:function(e){
    this.setData({
      remark: e.detail.value,
    })
  },

 //选择优惠券
 
  getvou:function(e){
    var vid = e.currentTarget.dataset.id;
    var price = e.currentTarget.dataset.price;
    var zprice = this.data.zprice;
    var youhui = this.data.youhui;
    var ship_fee = this.data.ship_fee;
    
      var cprice = parseFloat(zprice) - parseFloat(price) + parseFloat(ship_fee);
    console.log('总价' + zprice + '优惠券' + price + '快递费' + ship_fee )
    this.setData({
      vid: vid,
      youhui: price,
      total: cprice
    })
  }, 
  // 使用余额

  checkboxChange: function (e) {
    if (e.detail.value[0] == undefined){
      var surplus = 0;
    }else{
      var surplus = e.detail.value[0];
    }
    var on_pay_yue = this.data.on_pay_yue;
    if (surplus == 0){//选中
      this.setData({
        input: false,
        on_pay_yue: surplus
      })
    }else{//未选中
      this.setData({
        input: true,
        on_pay_yue: surplus
      })
    }
    
      }, 
  //输入框输入后，修改勾选的value
  yue_input: function (e) {
    var that = this;
    var pay_yue = e.detail.value;
    this.setData({
      pay_yue: pay_yue,
    })
    //console.log(pay_yue);
  }, 
  //日期选择器
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  //选择快递方式

  getship: function (e) {
    var sid = e.currentTarget.dataset.id;
    var price = e.currentTarget.dataset.price;
    var zprice = this.data.zprice;
    var youhui = this.data.youhui;
    var ship_fee = this.data.ship_fee;
    var cprice = parseFloat(zprice) - parseFloat(youhui) + parseFloat(price);
    this.setData({
      sid: sid,
      ship_fee: price,
      total: cprice
    })
  }, 

//微信支付
  createProductOrderByWX:function(e){
    var that = this;
    var address = that.data.address;
      this.setData({
        paytype: 'weixin',
        btnDisabled: true,//禁用按钮
      });
      wx.showLoading();//加载动画
      this.createProductOrder();
  },


  //确认订单
  createProductOrder:function(){
    

    //创建订单
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_done',
      method:'post',
      data: {
        anran_id: wx.getStorageSync('id'),//用户自己的ID，从缓存去取
        shipping_id: that.data.sid,//配送方式
        remark: that.data.remark,//用户备注
        price: that.data.total,//商品总价
        bonus_id: that.data.vid,//优惠券ID
        tuanid: that.data.tuanid,//入口判断，如果是0，表示普通商品，如果是1，表示团长入口，2表示团员入口
        tuan_sn: that.data.tuan_sn, // tuan_sn存在就是团长的订单sn，如果不存在，这里就是0，表示来自团长
        surplus: that.data.on_pay_yue,
        tid:that.data.tid,
        dy_time: that.data.date
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        var data = res.data;
        if(data.status == 1){
          that.setData({// 写入返回的sn
            re_tuan_sn: data.tuan_sn
          });
          //创建订单成功
          if(data.arr.pay_type == 'cash'){
              wx.showToast({
                 title:"请自行联系商家进行发货!",
                 duration:3000
              });
              return false;
          }
          if(data.arr.pay_type == 'weixin'){
            //微信支付
            that.wxpay(data.arr);
          }
        } else if (data.status == 5) {
          wx.showToast({
            title: "拼团已过期！",
            duration: 2500
          });
        }else if (data.status == 7) {
          wx.showToast({
            title: "仅限新人哟",
            duration: 2500
          });
        }else if (data.status == 8) {
          wx.showToast({
            title: "限购一个哟",
            duration: 2500
          });
        }else if (data.status == 9){
          wx.showToast({
            title: "请填写收货地址!",
            duration: 2500
          });
        }else{
          wx.showToast({
            title:"下单失败!",
            duration:2500
          });
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:createProductOrder',
          duration: 2000
        });
      }
    });
  },
  
  //调起微信支付
  wxpay: function(order){
    
    var that = this;
    var tuanid = that.data.tuanid;
    var goods_id = that.data.goods_id;
    if (tuanid == 2){//判断当前用户是不是团长，1是团长2是团员

      var re_tuan_sn = that.data.tuan_sn;//为团长的sn
    }
    if (tuanid == 1){//团长就调自己的sn
      var re_tuan_sn = that.data.re_tuan_sn;//为回调的自己的sn
    }
    
      wx.request({
        url: app.d.ceshiUrl + '/Api/Wxpay/wxpay',
        data: {
          order_id:order.order_id,
          log_id: order.log_id,
          anran_id: wx.getStorageSync('id'),
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
          'Content-Type':  'application/x-www-form-urlencoded'
        }, // 设置请求的 header
        success: function(res){
          
          wx.hideLoading()//关闭加载动画
          if(res.data.status==1){
            console.log(res)
            var order=res.data.arr;
            
            wx.requestPayment({
              timeStamp: order.timeStamp,
              nonceStr: order.nonceStr,
              package: order.package,
              signType: 'MD5',
              paySign: order.paySign,
              success: function(res){
           
                wx.showToast({
                  title:"支付成功!",
                  duration:2000,
                });
                if (tuanid > 0){//表示来自拼团商品，
                  wx.navigateTo({//支付完成后跳转拼团页面
                    url: '../product/detail?productId=' + goods_id + '&tuan=' + re_tuan_sn,
                  });

                }else{
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../user/dingdan?currentTab=1&otype=deliver',
                    });
                  }, 2500);
                }
                
              },
              fail: function(res) {
                wx.showToast({
                  title:res,
                  duration:3000
                });
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../user/dingdan?currentTab=0&otype=pay',
                  });
                }, 200);
              }
            })
          }else{
            wx.showToast({
              title: res.data.err,
              duration: 2000
            });
          }
        },
        fail: function() {
          // fail
          wx.showToast({
            title: '网络异常！err:wxpay',
            duration: 2000
          });
        }
      })
  },


});