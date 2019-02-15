var app = getApp();
// pages/user/shoucang.js
Page({
  data: {
    page: 1,
    productData: [],
  },
  onLoad: function (options) {
    this.loadProductData();
  },
  onShow: function () {
    // 页面显示
 
  },

  removeFavorites: function (e) {
    var that = this;
    var goodsid = e.currentTarget.dataset.goodsid;

    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function (res) {

        res.confirm && wx.request({
          url: app.d.anranUrl + '/index.php?m=default&c=indem&a=del_my_anli',
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
            if (data == 1) {
              wx.showToast({
                title: '删除成功',
                duration: 2000,
              });
              that.loadProductData();
            }
           
          },
        });

      }
    });
  },
  loadProductData: function () {
    var that = this;
    var page = this.data.page;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_my_anli_list',
      method: 'post',
      data: {
        anran_id: wx.getStorageSync('id'),
        page: page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        //--init data
        var data = res.data;
        //that.initProductData(data);

        that.setData({
          productData: that.data.productData.concat(data),
          page:page + 1
        });
        //endInitData
      },
    });
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadProductData();
  }
});