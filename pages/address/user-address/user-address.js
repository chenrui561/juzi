// pages/address/user-address/user-address.js
var app = getApp()
Page({
  data: {
    address: [],
    radioindex: '',
    pro_id:0,
    num:0,
    cartId:0,
    g_id:'',
    tuanid:'',
    tuan_sn:'',
  },
  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    var cartId = options.cartId;
    var g_id = options.g_id;
    var tuanid = options.tuanid;
    var tuan_sn = options.tuan_sn;
    
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_address_list',
      data: {
        anran_id: wx.getStorageSync('id'),
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        // success
        var address = res.data;
        console.log(address);
        if (address == '') {
          var address = []
        }
        
        that.setData({
          address: address,
          cartId: cartId,
          tuan_sn: tuan_sn,
          g_id: g_id,
          tuanid: tuanid
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
    
  },

  onReady: function () {
    // 页面渲染完成
  },
  setDefault: function(e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=moren_address_list',
      data: {
        anran_id: wx.getStorageSync('id'),
        id: addrId
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      
      success: function (res) {
        // success
        var status = res.data;
        var cartId = that.data.cartId;
        var g_id = that.data.g_id;
        var tuanid = that.data.tuanid;
        var tuan_sn = that.data.tuan_sn;
        if(status==1){
          if (cartId) {
            wx.redirectTo({
              url: '../../order/pay?cartId=' + cartId + '&g_id=' + g_id + '&tuanid=' + tuanid + '&tuan_sn=' + tuan_sn ,
            });
            return false;
          }

          wx.showToast({
            title: '操作成功！',
            duration: 2000
          });
          
          that.DataonLoad();
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  delAddress: function (e) {
    var that = this;
    var addrId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.anranUrl + '/index.php?m=default&c=indem&a=del_address_list',
          data: {
            anran_id: wx.getStorageSync('id'),
            id:addrId
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {// 设置请求的 header
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          
          success: function (res) {
            // success
            var status = res.data;
            if(status==1){
              that.DataonLoad();
            }else{
              wx.showToast({
                title: '删除失败！',
                duration: 2000
              });
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
      }
    });

  },
  DataonLoad: function () {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_address_list',
      data: {
        anran_id: wx.getStorageSync('id'),
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },

      success: function (res) {
        // success
        var address = res.data;
        console.log(address);
        that.setData({
          address: address
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
    
  },
})