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
    productData:[],
    zhihu_search:[0],
    historyKeyList:[],
    user_lei:'',
    zhihu_title:'',
    searchResultDatas:[],
    hotKeyList:[]
  },
  onLoad:function(options){
    var that = this;
    this.setData({
      user_lei: wx.getStorageSync('user_lei')
    })
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=search_info',
      method:'post',
      data: {
        user_id: wx.getStorageSync('id'),
        type_id: 2 //2为搜索知乎问答
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
  },
  onReachBottom:function(){
    var that = this;
    var content = that.data.searchValue;
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
        type_id: 2 //2为搜索知乎
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
          let searchData = res.data.goods_list.map(function (res) {
            return { key: value, name: res.title }
          })
          let jianjie = res.data.goods_list.map(function (res) {
            return { key: value, name: res.jianjie }
          })
          that.setData({
            searchData,
            jianjie,
            searchResultDatas: that.data.searchResultDatas.concat(res.data.goods_list)
          })
        
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
    if (!searchKey) {
        this.setData({
            focus: true,
            hotKeyShow:true,
            historyKeyShow:true,
        });
        return;
    };

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
    if(!value && this.data.productData.length == 0){
      this.setData({
        hotKeyShow:true,
        historyKeyShow:true,
      });
    }
  },
  searchProductData:function(){
    var that = this;
    let value = this.data.searchValue;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_search',
      method:'post',
      data: {
        content:that.data.searchValue,
        user_id: wx.getStorageSync('id'),
        page:1,
        type_id: 2 //2为搜索知乎
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {   
        var data = res.data.goods_list;
        var state = res.data.state;
        if (state == 3) {
          that.setData({
            more: '没有找到相关内容',
          });
          wx.showToast({
            title: '搜索关键字？',
            duration: 2000
          });
        }
        if (state == 2){
          that.setData({
            more: '没有找到相关内容',
          });
          wx.showToast({
            title: '没有找到！',
            duration: 2000
          });
          that.setData({
            zhihu_search: res.data.goods_list,
            //productData: data
          });
        } 
        if (state == 1){
           
         let searchData = res.data.goods_list.map(function (res) {
           return { key: value, name: res.title }
          })
          let jianjie = res.data.goods_list.map(function (res) {
            return { key: value, name: res.jianjie }
          })
          that.setData({
            searchData,
            jianjie,
            searchResultDatas: res.data.goods_list
          })
          console.log(jianjie);
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