var app = getApp()
Page({
  data: {
    current: 0,
    shopList: [],
    get_more:'',
    more:'下拉加载更多',
    ptype:'',
    title:'宠物美容学校',
    page:2,
    catId:0,
    type_id:'',
    brandId: 0
  },
showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
 },
hideModal: function () {
  // 隐藏遮罩层
  var animation = wx.createAnimation({
   duration: 200,
   timingFunction: "linear",
   delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
   animationData: animation.export(),
  })
  setTimeout(function () {
   animation.translateY(0).step()
   this.setData({
    animationData: animation.export(),
    showModalStatus: false
   })
  }.bind(this), 200)
},

//点击加载更多
/*getMore:function(e){
  var that = this;
  var page = that.data.page;
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_async_goods_list',
      method:'post',
      data: {
        page:page,
        cat_id:that.data.catId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {  
        var prolist = res.data;
        if(prolist==''){
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        that.setData({
          page: page+1,
          shopList:that.data.shopList.concat(prolist)
        });
        
        //endInitData
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
},*/
//下拉加载更多
  onReachBottom: function (e) {
  var that = this;
  var page = that.data.page;
    var type_id = that.data.type_id;
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_async_goods_list',
    method: 'post',
    data: {
      page: page,
      type_id: type_id,
      cat_id: that.data.catId
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      var prolist = res.data;
      if (prolist == '') {
        that.setData({
          more: '没有更多了'
        });
        wx.showToast({
          title: '没有更多数据！',
          duration: 2000
        });

        return false;
      }
      //that.initProductData(data);
      that.setData({
        page: page + 1,
        shopList: that.data.shopList.concat(prolist)
      });
      //endInitData
    },
    fail: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    }
  })
},
onLoad: function (options) {
  var objectId = options.title;
  var type_id = options.type;
  //更改头部标题
  wx.setNavigationBarTitle({
      title: objectId,
      success: function() {
      },
    });

    //页面初始化 options为页面跳转所带来的参数
    var cat_id = options.cat_id;
    var ptype = options.ptype;
    var brandId = options.brandId;
    var type_id = options.type_id;
    var that = this;
    var page = that.data.page;
    that.setData({
      ptype: ptype,
      catId: cat_id,
      type_id: type_id,
      brandId: brandId
    })
    //ajax请求数据
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_async_goods_list',
      method:'post',
      data: {
        type_id: type_id,
        page:1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shoplist = res.data;
        that.setData({
          shopList: shoplist
        })
      },
      error: function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
   

  },
  //详情页跳转
  lookdetail: function (e) {
    console.log(e)
    var lookid = e.currentTarget.dataset;
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: "../index/detail?id=" + lookid.id
    })
  },
  switchSlider: function (e) {
    this.setData({
      current: e.target.dataset.index
    })
  },
  changeSlider: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }

})
