// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
import { promisify } from '../../utils/promise.util'
import { $init, $digest } from '../../utils/common.util'
//import { createQuestion } from '../../services/question.service'
import config from '../../config'
const wxUploadFile = promisify(wx.uploadFile)
//var common = require("../../utils/common.js");
Page({  
  data: {  
    winWidth: 900,  
    winHeight: 0,  
    // tab切换  
    currentTab: 0,  
    isStatus:'pay',//10待付款，20待发货，30待收货 40、50已完成
    page:0,
    refundpage:0,
    orderList0:[],
    orderList1:[],
    orderList2:[],
    orderList3:[],
    orderList4:[],
  },  
  chooseImage(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images_one = res.tempFilePaths;
        this.data.images_one = images_one.length <= 1 ? images_one : images_one.slice(0, 1)
        $digest(this)
        this.setData({
          images_one: res.tempFilePaths
        })
        //console.log(images_one)
        that.up_logo(e.currentTarget.dataset.idx);
        console.log('测试')
      }
    })
  },
  /*上传logo*/
  up_logo: function (key) {
    var that = this;
    const arr = []
    var id = that.data.brand_id;
    var order_type = this.data.currentTab;
    for (let path of this.data.images_one) {
      arr.push(wxUploadFile({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save_brand_img',
        filePath: path,
        name: 'file',
        formData: {
          user_id: wx.getStorageSync('id'),
          brand_id: id,
          order_type: order_type
        },
      }))

    }

    wx.showLoading({
      title: '正在创建...',
      mask: true
    })

    Promise.all(arr).then(res => {
      var that = this;
      wx.showToast({
        title: '上传成功！',
        duration: 2000
      });
      this.loadOrderList();
      wx.hideLoading()
    }).catch(err => {
      console.log(">>>> upload images error:", err)
    })
  },

  big_img: function (e) {//单张大图的方法
    var img = e.target.dataset.img
    var url = img.split();
    wx.previewImage({
      current: img,
      urls: url
    })
    console.log(url);
  },
  onLoad: function(options) { 
    $init(this)
    this.initSystemInfo(); 
    this.setData({
      currentTab: parseInt(options.currentTab),
      isStatus:options.otype,
      brand_id: options.brand_id
    });
      this.loadOrderList();
    
  },  
  initSystemInfo: function () {
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
  getOrderStatus:function(){
    return this.data.currentTab == 0 ? 1 : this.data.currentTab == 2 ?2 :this.data.currentTab == 3 ? 3:0;
  },

  loadOrderList: function(){
    wx.showLoading();//加载动画
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?c=indem&a=xcx_jigou_img',
      method:'post',
      data: {
        uid: wx.getStorageSync('id'),
        brand_id:that.data.brand_id,
        order_type: that.data.currentTab,
        page:that.data.page,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
        wx.hideLoading()//关闭加载动画
        var status = res.data.status;
        var list = res.data.info;
        that.setData({
          guanli: res.data.guanli,
          user_lei: res.data.user_lei,
          ys: res.data.ys,
        });
        switch (that.data.currentTab) {
          case 0:
            that.setData({
              orderList0: list,
            });
            break;
          case 1:
            that.setData({
              orderList1: list,
            });
            break;
          case 2:
            that.setData({
              orderList2: list,
            });
            break;
          case 3:
            that.setData({
              orderList3: list,
            });
            break;
          case 4:
            that.setData({
              orderList4: list,
            });
            break;
        }
      
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },


  
  bindChange: function(e) {  
    var that = this;  
    that.setData( { currentTab: e.detail.current });  
  },  
  swichNav: function(e) {  
    var that = this;  
    if( that.data.currentTab === e.target.dataset.current ) {  
      return false;  
    } else { 
      var current = e.target.dataset.current;
      that.setData({
        currentTab: parseInt(current),
        isStatus: e.target.dataset.otype,
      });

      //没有数据就进行加载
      switch(that.data.currentTab){
          case 0:
            !that.data.orderList0.length && that.loadOrderList();
            break;
          case 1:
            !that.data.orderList1.length && that.loadOrderList();
            break;  
          case 2:
            !that.data.orderList2.length && that.loadOrderList();
            break;
          case 3:
            !that.data.orderList3.length && that.loadOrderList();
            break;
          case 4:
          !that.data.orderList4.length && that.loadOrderList();
            break;
        }
    };
  },

})