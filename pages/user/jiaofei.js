// pages/user/team-shouyi.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_user: [],
    user_info: [],
    id:'',//类型
    type:'',//1为南京，区分每个地方的人
    page:2,
    pick: ['全部', '南京', '鄂州'],
    pick_id:0,
    states: ['全部', '未申请', '已申请', '已联系', '无意向', '待跟进', '有意向', '已缴费'],
    leixing: ['全部', '未分类', 'A类', 'B类', 'C类',],
    leixing_id: 0,//0为全部，以此递增
    states_id:0,
    order_id:'',
    next_gj_time_start:'0',
    next_gj_time_end:'0',
    phone:0,
    more:'下拉加载更多',
    youke:0,
    jia:0,//为1就是假
    gj_time:0,//0为不按照跟进时间来排列，1为按跟进时间倒序
    info:'',
    shi:'',
    count:''
  },
  next_gj_time_start: function (e) {
    this.setData({
      next_gj_time_start: e.detail.value
    })
    if (this.data.id == 3) {
      this.loading();
    }
    if (this.data.id == 4) {
      this.all_zhike();
    }

  },
  next_gj_time_end: function (e) {
    this.setData({
      next_gj_time_end: e.detail.value
    })
    if (this.data.id == 3) {
      this.loading();
    }
    if (this.data.id == 4) {
      this.all_zhike();
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading();//加载动画
    var that = this;
    if (options.type > 0){
      this.setData({
        id: options.id,
        type: options.type,
        shi: options.shi,
        order_id: options.order_id
      })
    }else{
      this.setData({
        id: options.id,
        order_id: options.order_id
      })
    }
    if(options.jia == 1){
      this.setData({
        jia: options.jia,
      })
    }
    if (options.order_id > 0){//表示来自订单修改渠道联系人
      wx.setNavigationBarTitle({
        title: '请选择报备人'//页面标题为路由参数
      })
    }


    if(options.id == 1){//来自缴费提醒
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=jiaofei_list',
        method: 'post',
        data: {
          id: wx.getStorageSync('id'),
          jia:that.data.jia
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
          that.setData({
            user_id: wx.getStorageSync('id'),
            goods_user: goods_user,

          });
          wx.hideLoading()//关闭加载动画
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        },
      });
    }
    if (options.id == 2) {//来自预约报备信息


    }
    if (options.id == 3) {//获取渠道用户信息
    var that = this;
    var page = this.data.page;
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=qudao_user_info',
        method: 'post',
        data: {
          page:1,
          user_id: wx.getStorageSync('id'),
          leixing_id: this.data.leixing_id,
          gj_time: this.data.gj_time,
          type:that.data.type
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
          that.setData({
            goods_user: goods_user,
            page: 1
          });
          wx.hideLoading()//关闭加载动画
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        },
      });

    }
    if (options.id == 4) {//获取直客信息
      var that = this;
      var page = this.data.page;
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhike_user_info',
        method: 'post',
        data: {
          page: 1,
          user_id: wx.getStorageSync('id'),
          phone: this.data.phone,
          youke: this.data.youke,
          gj_time: this.data.gj_time,
          states_id: this.data.states_id,
          pick_id: this.data.pick_id,
          leixing_id:this.data.leixing_id,
          info: this.data.info,
          type: that.data.type
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
          that.setData({
            goods_user: goods_user,
            count:res.data.count,
            page:1
          });
          wx.hideLoading()//关闭加载动画
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        },
      });
    }
    if (options.id == 5) {//获取申请招商的直客信息
      var that = this;
      var page = this.data.page;
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhike_user_info2',
        method: 'post',
        data: {
          page: 1,
          user_id: wx.getStorageSync('id'),
          type: that.data.type
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
          that.setData({
            goods_user: goods_user,
            count: res.data.count,
            page:1
          });
          wx.hideLoading()//关闭加载动画
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        },
      });
    }
    if (options.id == 6 || options.id == 7 || options.id == 8 ) {//获取全部的用户信息
      var that = this;
      var page = this.data.page;
      this.setData({
        change_id: options.change_id
      })
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=all_user_list',
        method: 'post',
        data: {
          page: 1,
          user_id: wx.getStorageSync('id'),
          type: that.data.type
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
          that.setData({
            goods_user_all: goods_user,
            count: res.data.count,
            page:  1
          });
          wx.hideLoading()//关闭加载动画
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        },
      });
    }
  },
all_zhike:function(){
  var that = this;
  var page = this.data.page;
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhike_user_info',
    method: 'post',
    data: {
      page: 1,
      user_id: wx.getStorageSync('id'),
      phone: this.data.phone,
      youke: this.data.youke,
      gj_time: this.data.gj_time,
      states_id: this.data.states_id,
      pick_id: this.data.pick_id,
      leixing_id: this.data.leixing_id,
      info: this.data.info,
      next_gj_time_start: that.data.next_gj_time_start,
      next_gj_time_end: that.data.next_gj_time_end,
      type: that.data.type
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      //--init data 
      var goods_user = res.data.goods_user;
      var user_info = res.data.user_info;
      that.setData({
        goods_user: goods_user,
        count: res.data.count,
        page:1
      });
      wx.hideLoading()//关闭加载动画
    },
    error: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000,
      });
    },
  });

},

/*判断手机 */
phone:function(){
  if(this.data.phone == 1){
    this.setData({
      phone: 0
    })
    this.all_zhike();
  }else if (this.data.phone == 0) {
    this.setData({
      phone: 1
    })
    this.all_zhike();
  }
},
  /*判断游客 */
  youke: function () {
    if (this.data.youke == 1) {
      this.setData({
        youke: 0
      })
      this.all_zhike();
    } else if (this.data.youke == 0) {
      this.setData({
        youke: 1
      })
      this.all_zhike();
    }
  },
  /*按跟进时间倒叙排列 */
  gj_time: function () {
    if (this.data.gj_time == 1) {
      this.setData({
        gj_time: 0
      })
      this.all_zhike();
    } else if (this.data.gj_time == 0) {
      this.setData({
        gj_time: 1
      })
      this.all_zhike();
    }
  },
  /*按跟进时间倒叙排列 */
  gj_time2: function () {
    if (this.data.gj_time == 1) {
      this.setData({
        gj_time: 0
      })
      this.loading();
    } else if (this.data.gj_time == 0) {
      this.setData({
        gj_time: 1
      })
      this.loading();
    }
  },
  /*判断位置 */
  pick: function (e) {
    var pick_id = e.detail.value;
    this.setData({
      pick_id: e.detail.value
    })
    this.all_zhike();
  },
  /*判断状态 */
  states: function (e) {
    var states_id = e.detail.value;
    this.setData({
      states_id: e.detail.value
    })
    this.all_zhike();
  },
  /*判断类型 */
  leixing: function (e) {
    var leixing_id = e.detail.value ;
    this.setData({
      leixing_id: e.detail.value
    })
    if(this.data.id == 3){
      this.loading();
    }
    if (this.data.id == 4) {
      this.all_zhike();
    }
    
  },
  order_change:function(e){//修改报备人
    var that = this;
  if(this.data.order_id > 0){
    wx.showModal({
      content: "是否确认修改",
      showCancel: '不了',
      confirmText: '确认',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=order_change',
            method: 'post',
            data: {
              user_id: e.currentTarget.dataset.id,
              order_id: that.data.order_id
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              //--init data 
              wx.navigateBack({});//返回
              wx.hideLoading()//关闭加载动画
            },
            error: function (e) {
              wx.showToast({
                title: '网络异常！',
                duration: 2000,
              });
            },
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
       

      }

    })
    
  }else{
    console.log(22);
  }
  
  
  },
  goto:function(e){//进别人的号
    var that = this;
    if (this.data.id == 6) {
      wx.showModal({
        content: "确认进入别人的号？",
        showCancel: true,
        confirmText: '确认',
        success: function (res) {
          if (res.confirm) {
            wx.setStorageSync('id', e.currentTarget.dataset.id);
            wx.reLaunch({
              url: '../index/index'
            })
          } else {
            console.log(22);
          }
        }
      })
    }
    if (this.data.id == 7) {
      wx.showModal({
        content: "确认变更邀请人？",
        showCancel: true,
        confirmText: '确认',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.d.anranUrl + '/index.php?m=default&c=indem&a=yaoqing_change',
              method: 'post',
              data: {
                user_id: wx.getStorageSync('id'),
                change_id: that.data.change_id,
                yaoqing_id: e.currentTarget.dataset.id
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                //--init data 
                wx.navigateBack({});//返回
                wx.hideLoading()//关闭加载动画
              },
              error: function (e) {
                wx.showToast({
                  title: '网络异常！',
                  duration: 2000,
                });
              },
            });
          } else {
            console.log(22);
          }
        }
      })
    }
    if (this.data.id == 8) {
      wx.showModal({
        content: "确认变更上级？",
        showCancel: true,
        confirmText: '确认',
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.d.anranUrl + '/index.php?m=default&c=indem&a=qudao_change',
              method: 'post',
              data: {
                user_id: wx.getStorageSync('id'),
                change_id: that.data.change_id,
                yaoqing_id: e.currentTarget.dataset.id
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                //--init data 
                wx.navigateBack({});//返回
                wx.hideLoading()//关闭加载动画
              },
              error: function (e) {
                wx.showToast({
                  title: '网络异常！',
                  duration: 2000,
                });
              },
            });
          } else {
            console.log(22);
          }
        }
      })
    }
  },
  searchValueInput:function(e){
    this.setData({
      info: e.detail.value
    })
  },
  doSearch:function(e){
    this.loading();
  },
  doSearch2: function (e) {
    this.search_zhike();
  },
  doSearch3: function (e) {
    this.search_all();
  },
  search_all: function (e) {
    var that = this;
    var page = this.data.page;
    if (this.data.info == '') {
      wx.showToast({
        title: '搜索不能为空',
        icon: 'none',
        duration: 2000,
      });
      return;
    }
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=all_user_list',
      method: 'post',
      data: {
        page: 1,
        user_id: wx.getStorageSync('id'),
        info: this.data.info,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var goods_user = res.data.goods_user;
        var user_info = res.data.user_info;
        that.setData({
          goods_user_all: goods_user,
          count: res.data.count,
          page: 1
        });
        wx.hideLoading()//关闭加载动画
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },
 search_zhike:function(e){
   var that = this;
   var page = this.data.page;
   if(this.data.info == ''){
     wx.showToast({
       title: '搜索不能为空',
       icon:'none',
       duration: 2000,
     });
     return;
   }
   wx.request({
     url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhike_user_info',
     method: 'post',
     data: {
       page: 1,
       user_id: wx.getStorageSync('id'),
       phone: this.data.phone,
       youke: this.data.youke,
       gj_time: this.data.gj_time,
       states_id: this.data.states_id,
       pick_id: this.data.pick_id,
       leixing_id: this.data.leixing_id,
       info: this.data.info,
       next_gj_time_start: that.data.next_gj_time_start,
       next_gj_time_end: that.data.next_gj_time_end,
       type: that.data.type
     },
     header: {
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     success: function (res) {
       //--init data 
       var goods_user = res.data.goods_user;
       var user_info = res.data.user_info;
       that.setData({
         goods_user: goods_user,
         count: res.data.count,
         page:1
       });
       wx.hideLoading()//关闭加载动画
     },
     error: function (e) {
       wx.showToast({
         title: '网络异常！',
         duration: 2000,
       });
     },
   });
 } ,
loading:function(e){
  var that = this;
  var page = this.data.page;
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=qudao_user_info',
    method: 'post',
    data: {
      page: 1,
      user_id: wx.getStorageSync('id'),
      gj_time: this.data.gj_time,
      leixing_id: this.data.leixing_id,
      type: that.data.type,
      next_gj_time_start: that.data.next_gj_time_start,
      next_gj_time_end: that.data.next_gj_time_end,
      info:this.data.info
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      //--init data 
      var goods_user = res.data.goods_user;
      var user_info = res.data.user_info;
      that.setData({
        goods_user: goods_user,
        page:1
      });
      wx.hideLoading()//关闭加载动画
    },
    error: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000,
      });
    },
  });
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var id = this.data.id;
    var that = this;

    if (id == 3) {//获取渠道信息
      var page = this.data.page;
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=qudao_user_info',
        method: 'post',
        data: {
          page: page + 1,
          user_id: wx.getStorageSync('id'),
          leixing_id: this.data.leixing_id,
          gj_time: this.data.gj_time,
          type: that.data.type,
          next_gj_time_start: that.data.next_gj_time_start,
          next_gj_time_end: that.data.next_gj_time_end,
          info: this.data.info
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
          if (res.data.count == 0){
            that.setData({
              more:'没有更多了'
            });
          }else{
            that.setData({
              goods_user: that.data.goods_user.concat(goods_user),
              page: page + 1,
            });
          }
          

          wx.hideLoading()//关闭加载动画
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        },
      });
    }
    if (id == 4) {//获取直客信息
      var that = this;
      var page = this.data.page;
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhike_user_info',
        method: 'post',
        data: {
          page: page + 1,
          user_id: wx.getStorageSync('id'),
          phone: this.data.phone,
          youke: this.data.youke,
          gj_time: this.data.gj_time,
          states_id: this.data.states_id,
          leixing_id: this.data.leixing_id,
          pick_id: this.data.pick_id,
          next_gj_time_start: that.data.next_gj_time_start,
          next_gj_time_end: that.data.next_gj_time_end,
          info: this.data.info,
          type: that.data.type
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
          that.setData({
            goods_user: that.data.goods_user.concat(goods_user),
            page: page + 1
          });
          wx.hideLoading()//关闭加载动画
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        },
      });
    }
    if (id == 5) {//获取申请招商的直客信息
      var that = this;
      var page = this.data.page;
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhike_user_info2',
        method: 'post',
        data: {
          page: page + 1,
          user_id: wx.getStorageSync('id'),
          type: that.data.type
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
          that.setData({
            goods_user: that.data.goods_user.concat(goods_user),
            page: page + 1
          });
          wx.hideLoading()//关闭加载动画
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        },
      });
    }
    if (id == 6 || id == 7 || id == 8) {//获取申请招商的直客信息
      var that = this;
      var page = this.data.page;
      wx.request({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=all_user_list',
        method: 'post',
        data: {
          page: page + 1,
          user_id: wx.getStorageSync('id'),
          type: that.data.type
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          //--init data 
          var goods_user = res.data.goods_user;
          var user_info = res.data.user_info;
          that.setData({
            goods_user_all: that.data.goods_user_all.concat(goods_user),
            count: res.data.count,
            page: page + 1
          });
          wx.hideLoading()//关闭加载动画
        },
        error: function (e) {
          wx.showToast({
            title: '网络异常！',
            duration: 2000,
          });
        },
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})