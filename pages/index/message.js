// pages/index/message.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    searchValue:'',//搜索的内容
    search_states:0,//0为正常，1为显示搜索
    search:0,
    more:'下拉加载更多',
    page:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /*输入搜索内容 */
  searchValueInput: function (e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    });
    if (value == '') {//全删掉
      console.log('全删')
      this.loading();
    }
  },
  /*开始搜索 */
  doSearch:function(e){
    this.loading();
  },
  loading:function(e){
    var that = this;
    var page = this.data.page;
    var value = this.data.searchValue;//搜索的关键词
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=message_list',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
        searchValue: this.data.searchValue,
        page:1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({//来判断是否开启搜索
          search: res.data.search
        })
        if (that.data.searchValue == ''){//如果没有搜索
          that.setData({
            list: res.data.list,
            search_states:0,
            page: 1
          })
          console.log('没有搜')
        }else{//有搜索
          let search_info = res.data.list.map(function (res) {
            return { key: value, name: res.info }
          })
          that.setData({
            search_info,
            search_states: 1,
            page: 1,
            list: res.data.list
          })
        }
        
        
        if (res.data.count_message > 0) {
          wx.showTabBarRedDot({//展示消息的红点
            index: 2
          })
        } else {
          wx.hideTabBarRedDot({
            index: 2
          })
        }
        if (res.data.list.length == 0){
          that.setData({
            more:'没有更多了'
          })
        }
        wx.hideLoading()//关闭加载动画
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
        wx.hideLoading()//关闭加载动画
      }
    });
  },
  onclick:function(e){
    var that = this;
    var hid = e.currentTarget.dataset.hid;
    var type = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    if (type == 1 || type == 2 || type == 3 ){//如果是赞,评论/回复
      wx.navigateTo({
        url: '/pages/zhihu/zhihu?aid=' + hid
      })
    }
    if(type == 4){//如果是关注
      wx.navigateTo({
        url: '/pages/zhihu/zhihu_guanzhu'
      })
    }
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=message_du',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
        id: id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if (res.data.count_message == 0){
          wx.hideTabBarRedDot({
            index: 2
          })
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  all_du: function (e) {
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=message_all_du',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.loading();
        if (res.data.count_message == 0) {
          wx.hideTabBarRedDot({
            index: 2
          })
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loading();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loading();
    wx.stopPullDownRefresh();//解决回弹问题
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      var that = this;
      var page = this.data.page;
      wx.showLoading();//加载动画 
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=message_list',
        method: 'post',
        data: {
          user_id: wx.getStorageSync('id'),
          searchValue: this.data.searchValue,
          page: page + 1
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if(res.data.states == 1){
            if (that.data.searchValue == '') {//如果没有搜索
              that.setData({
                list: that.data.list.concat(res.data.list),
                search_states: 0,
                page: page + 1
              })
              console.log('没有搜')
            } else {//有搜索
              let search_info = res.data.list.map(function (res) {
                return { key: value, name: res.info }
              })
              that.setData({
                search_info,
                search_states: 1,
                page: page + 1,
                list: that.data.list.concat(res.data.list)
              })
            }
           /* that.setData({
              list: that.data.list.concat(res.data.list),
              page: page + 1
            })*/
            
          }else{
            wx.showToast({
              title: '没有更多了',
              duration: 2000
            });
              that.setData({
                more: '没有更多了'
              })
            
          }

      
          wx.hideLoading()//关闭加载动画
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
          wx.hideLoading()//关闭加载动画
        }
      });
  }

  
})