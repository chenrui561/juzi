var app = getApp();
// pages/search/search.js
Page({
  data:{
    focus:true,
    hotKeyShow:true,
    historyKeyShow:true,
    searchValue:'',
    page:1,
    more: '下拉加载更多',
    more_id:0,//1表示没有找到
    productData:[],
    historyKeyList:[],
    user_lei:'',
    diqu_info_id: 0,//地区默认为武汉
    yy:0,//1为来自预约入口
    pick: ['优惠','机构','医生'],
    pick_id:'0',
    type_id:2,//2为进来选优惠，3为店铺，4为机构
    hotKeyList:[]
  },
  onLoad:function(options){
    var that = this;
    this.setData({
      user_lei: wx.getStorageSync('user_lei'),
      type_id: options.type_id,
      diqu_info_id: options.diqu_info_id
    })
   /* if (options.type_id == 3){//店铺
      this.setData({
        pick_id:1
      })
      console.log(this.data.pick_id)
    }*/
    if (options.type_id == 4) {//机构
      this.setData({
        pick_id: 1
      })
    }
    if (options.type_id == 5) {//医生
      this.setData({
        pick_id: 2
      })
    }
    if(options.yy == 1){//如果来自预约界面
      this.setData({
        yy: 1
      })
      this.searchProductData();
    }else{
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=search_info',
      method:'post',
      data: {
        user_id: wx.getStorageSync('id'),
        diqu_info_id: this.data.diqu_info_id
        },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var remen = res.data.remen;
        var history = res.data.lishi;

        that.setData({
          historyKeyList:history,
          hotKeyList:remen,
        });
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
    }
  },
  pick:function(e){

    this.setData({
      pick_id: e.detail.value, //0优惠，1店铺，2机构
      productData: []
    })
    this.searchProductData();
  },
  onReachBottom:function(){
    var that = this;
    var content = that.data.searchValue;
    var pick_id = this.data.pick_id;
      //下拉加载更多多...
      this.setData({
        page:(this.data.page+1)
      })
      
      //this.searchProductData();
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_search',
      method: 'post',
      data: {
        content: that.data.searchValue,
        user_id: wx.getStorageSync('id'),
        page: that.data.page,
        pick_id: pick_id,
        diqu_info_id: this.data.diqu_info_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        var data = res.data.goods_list;
        var state = res.data.state;
        if (state == 3) {//没有数据
          that.setData({
            more: '没有更多了',
          });
          wx.showToast({
            title: '搜索关键字？',
            duration: 2000
          });
        } 
        if (state == 2) {//没有数据
          that.setData({
            more: '没有更多了',
          });
          wx.showToast({
            title: '没有更多了',
            duration: 2000
          });
        } 
        if (state == 1) {
          that.setData({
            productData: that.data.productData.concat(data),
            //productData: data
          });
        }

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  
  },
  doKeySearch:function(e){
    var key = e.currentTarget.dataset.key;
    this.setData({
      searchValue: key,
       hotKeyShow:false,
       historyKeyShow:false,
    });

    this.data.productData.length = 0;
    this.searchProductData();
  },
  doSearch:function(){
    var searchKey = this.data.searchValue;

    this.setData({
      hotKeyShow:false,
      historyKeyShow:false,
    })
    
    this.data.productData.length = 0;
    this.searchProductData();

    this.getOrSetSearchHistory(searchKey);
  },
  getOrSetSearchHistory:function(key){
    var that = this;
    wx.getStorage({
      key: 'historyKeyList',
      success: function(res) {
          console.log(res.data);

          //console.log(res.data.indexOf(key))
          if(res.data.indexOf(key) >= 0){
            return;
          }

          res.data.push(key);
          wx.setStorage({
            key:"historyKeyList",
            data:res.data,
          });

          that.setData({
            historyKeyList:res.data
          });
      }
    });
  },
  searchValueInput:function(e){
    var value = e.detail.value;
    this.setData({
      searchValue:value,
    });
    if (value == ''){//全删掉
      this.setData({
        productData: [],
        more_id:0
      });
    }
    if(!value && this.data.productData.length == 0){
      this.setData({
        hotKeyShow:true,
        historyKeyShow:true,
      });
    }
  },
  searchProductData:function(){
    var that = this;
    var pick_id = this.data.pick_id;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_search',
      method:'post',
      data: {
        content:that.data.searchValue,
        user_id: wx.getStorageSync('id'),
        page:1,
        pick_id: pick_id,
        diqu_info_id: this.data.diqu_info_id
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {   
        var data = res.data.goods_list;
        var state = res.data.state;

        if (state == 2){
          that.setData({
            more: '没有找到相关内容',
            more_id:1
          });
          wx.showToast({
            title: '没有找到！',
            duration: 2000
          });
        } 
        if (state == 1){
          that.setData({
            productData: data,
            //productData: data
          });
        }
        
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

});