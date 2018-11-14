var app = getApp();
// pages/user/shoucang.js
Page({
  data:{
    page:1,
    productData:[],
  },
  onLoad:function(options){
    this.loadProductData();
  },
  onShow:function(){
    // 页面显示
    this.loadProductData();
  },
  
  removeFavorites:function(e){
    var that = this;
    var goodsid = e.currentTarget.dataset.goodsid;

    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function(res) {

        res.confirm && wx.request({
          url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_add_collection',
          method: 'post',
          data: {
            goods_id: goodsid,
            anran_id: wx.getStorageSync('id')
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            //--init data
            var data = res.data.state;
            if (data == 2) {
              wx.showToast({
                title: '取消成功',
                duration: 2000,
              });
              that.loadProductData();
            }
            if (data == 4) {
              wx.showToast({
                title: '收藏成功',
                duration: 2000,
              });
            }
          },
        });

      }
    });
  },
  loadProductData:function(){
    var that = this;

    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_collection_list',
      method:'post',
      data: {
        anran_id: wx.getStorageSync('id'),
        pageindex: 1,
        pagesize:100,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        //--init data
        var data = res.data;
        //that.initProductData(data);

        that.setData({
          productData: data,
        });
        //endInitData
      },
    });
  },
 
});