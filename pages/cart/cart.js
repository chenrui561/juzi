var app = getApp();
// pages/cart/cart.js
Page({
  data:{
    page:1,
    minusStatuses: ['disabled', 'disabled', 'normal', 'normal', 'disabled'],
    total: 0,
    total_number:'',
    carts: []
  },

bindMinus: function(e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index].goods_number;
    var rec_id = that.data.carts[index].rec_id;
    // 如果只有1件了，就不允许再减了
    if (num > 1) {
      num --;
    }
    console.log(num);
    var cart_id = e.currentTarget.dataset.cartid;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_ajax_update_cart',
      method:'post',
      data: {
        rec_id: rec_id,
        goods_number:num,
        anran_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.error;
        var goods_number = res.data.goods_number
        if(status==0){//安然海淘的返回是0为成功
          // 只有大于一件的时候，才能normal状态，否则disable状态
          var minusStatus = num <= 1 ? 'disabled' : 'normal';
          // 购物车数据
          var carts = that.data.carts;
          carts[index].goods_number = goods_number;//修改点击加号之后的效果
          // 按钮可用状态
          var minusStatuses = that.data.minusStatuses;
          minusStatuses[index] = minusStatus;
          // 将数值与状态写回
          that.setData({
            minusStatuses: minusStatuses
          });
         
          that.loadProductData();
        }else{
          wx.showToast({
            title: '库存不足！',
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

bindPlus: function(e) {//点击加号
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var num = that.data.carts[index].goods_number;
    var rec_id = that.data.carts[index].rec_id;
    // 自增
    num ++;
    //console.log(num);
    var cart_id = e.currentTarget.dataset.cartid;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_ajax_update_cart',
      method:'post',
      data: {
        rec_id: rec_id,
        goods_number: num,
        anran_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.error;
        var goods_number = res.data.goods_number
        if(status==0){
          // 只有大于一件的时候，才能normal状态，否则disable状态
          var minusStatus = num <= 1 ? 'disabled' : 'normal';
          // 购物车数据
          var carts = that.data.carts;
          
          carts[index].goods_number = goods_number;//修改点击加号之后的效果
          // 按钮可用状态
          var minusStatuses = that.data.minusStatuses;
          minusStatuses[index] = minusStatus;
          // 将数值与状态写回
          that.setData({
            minusStatuses: minusStatuses
            
          });
      
          that.loadProductData();
        }else{
          wx.showToast({
            title: '库存不足！',
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

bindCheckbox: function(e) {
  var that = this;
  /*绑定点击事件，将checkbox样式改变为选中与非选中*/
  //拿到下标值，以在carts作遍历指示用
  var index = parseInt(e.currentTarget.dataset.index);
  //原始的icon状态
  var selected = this.data.carts[index].selected;
  var carts = this.data.carts;
  var rec_id = e.currentTarget.dataset.recid;
  // 对勾选状态取反
  carts[index].selected = !selected;
  // 写回经点击修改后的数组

/*点击选中状态 */
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_cart_onclick',
    method: 'get',
    data: {
      rec_id: rec_id
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      that.loadProductData();
      console.log(999);
      //carts[index].is_onclick = 1;
    },
  });
  
 
},

bindSelectAll: function() {
   // 环境中目前已选状态
   var selectedAllStatus = this.data.selectedAllStatus;
   // 取反操作
   selectedAllStatus = !selectedAllStatus;
   // 购物车数据，关键是处理selected值
   var carts = this.data.carts;
   // 遍历
   for (var i = 0; i < carts.length; i++) {
     carts[i].selected = selectedAllStatus;
   }
   this.setData({
     selectedAllStatus: selectedAllStatus,
     carts: carts
   });

 },

bindCheckout: function() {
  var total_number = this.data.total_number;
  if (total_number == 0){
     wx.showToast({
       title: '请选择要结算的商品！',
       duration: 2000
     });
     return false;
   }
   //存回data
   wx.navigateTo({
     url: '../order/pay?cartId',
   })
 },

 bindToastChange: function() {
   this.setData({
     toastHidden: true
   });
 },


onLoad:function(options){
    //this.loadProductData();
    
},

onShow:function(){
  this.loadProductData();
},

removeShopCard:function(e){
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index);
    var cardId = e.currentTarget.dataset.cartid;
    
    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {
        res.confirm && wx.request({
          url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_drop_goods',
          method:'post',
          data: {
            rec_id: cardId,
            anran_id: wx.getStorageSync('id')
          },
          header: {
            'Content-Type':  'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var data = res.data;
            if(data == 1){
              //that.data.productData.length =0;
              that.loadProductData();
            }else{
              wx.showToast({
                title: '操作失败！',
                duration: 2000
              });
            }
          },
        });
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

// 数据案例
  loadProductData:function(){
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_get_cart',
      method:'post',
      data: {
        anran_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data
        var cart = res.data.goods_list;
        var total = res.data.total
        that.setData({
          carts:cart,
          total: total.xz_price,
          total_number: total.onclick_num
        });
        //endInitData
      },
    });
  },

})