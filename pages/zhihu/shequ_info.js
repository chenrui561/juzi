// pages/question-ask/anli.js
var app = getApp();

//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noscroll: '',
    pl_input_height: 121,//默认的评论输入框的高度，初始高度为91-41=50，字数每增长提高25px
    pl_page: 1,//评论页数
    page_ht:1,//回帖的page
    pl_count: '',
    pl_all: [],
    h_input:0,//0为跳转到回帖，1为直接回复
    hf: [],
    huifu_sid:0,
    lou:1,
    pick:['正序','倒序'],
    paixu:0,//0为正序，1为倒序
    list:[],
    list_ls: [],//临时
    anli_info: [],
    huifu_id: 0,//回复id，0表示给答案作者发评论，如果大于0表示在评论中回复其他用户
    huifu_name: '',
    input_value: '',//评论输入的内容
    zan: '',
    zan_count: '',
    hd_count: '',
    guanzhu_off: 0,
    sid: '',//社区帖子id
    uid: '',//案例人id
    wid: '',//问题id，存在是表示这是一个没有人回答的问题，同时也要检测自己有没有写过草稿
    HeadUrl: '',
    pl: [],
    padding_bottom: '2%',
    title: '',
    shoucang: '',//收藏状态，0为没有收藏，1为收藏
    zan_off: 0,//点赞开关，防止重复点击，1为不可点击
    fandui_off: 0,// 反对开关，防止重复点击
    my_huida: '',//我的回答的id
    my_huida_caogao: '',//我的回答是否是草稿状态，1为是，0不是
    pl_count: 0,
    next: '',//下一条回答
    shenhe: 0,//默认审核为，0，1为可审核状态
    user_id: '',
    more:'下拉加载',
    bd_id: 0,//绑定id
  },

  panduan: function () {
    if (this.data.phone == '') {
      wx.showToast({
        title: ' 请先绑定手机号！',
        icon: 'none',
        duration: 1500
      });
      setTimeout(function () {
        wx.navigateTo({
          url: '../user/bd'
        });//要延时执行的代码
      }, 1500)
      return;
    }
  },
/*排序*/
pick:function(e){
  if(this.data.paixu == 0){
    this.setData({
      paixu: 1
    })
  }else{
    this.setData({
      paixu: 0
    })
  }
  this.load_huifu();
},  
/*回复楼层 */
huifu_lou:function(e){
  this.setData({
    huifu_lou:e.currentTarget.dataset.lou,
    huifu_sid: e.currentTarget.dataset.sid,
    h_input:1
  })
  console.log(e)
},
  /*取消回复楼层 */
  off_huifu_lou: function (e) {
    this.setData({
      h_input: 0
    })
  },
  /*发送回复 */
  send_huifu:function(e){
    var that = this;
    wx.showModal({//弹窗
      content: "确认提交回复？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消
          console.log(88);
        }
        if (res.confirm) {
          wx.showLoading();//加载动画 
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=send_huifu',
            method: 'post',
            data: {
              sid: that.data.huifu_sid,
              huifu:e.detail.value,
              uid: wx.getStorageSync('id'),
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {

              that.load_huifu();
              //endInitData
              wx.hideLoading()//关闭加载动画
            },
            fail: function (e) {
              wx.showToast({
                title: '网络异常！',
                duration: 2000
              });
            },
          });
        }
      }
    })
  },
  /*置顶 */
ding:function(){
  var that = this;
  wx.showModal({//弹窗
    content: "确认修改？",
    showCancel: true,
    confirmText: '确定',
    success: function (res) {
      if (res.cancel) {//点击了取消
        console.log(88);
      }
      if (res.confirm) {
        that.change_ding()
      }
    }
    })
},
  /* 修改置顶方法*/
  change_ding: function (ding) {
    var that = this;
    var sid = this.data.sid;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=change_ding',
      method: 'post',
      data: {
        sid: sid,
        uid: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        
        that.loading_huida();
        //endInitData
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
  /*置顶 */
  jing: function () {
    var that = this;
    wx.showModal({//弹窗
      content: "确认修改？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消
          console.log(88);
        }
        if (res.confirm) {
          that.change_jing()
        }
      }
    })
  },
  /* 修改置顶方法*/
  change_jing: function (ding) {
    var that = this;
    var sid = this.data.sid;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=change_jing',
      method: 'post',
      data: {
        sid: sid,
        uid: wx.getStorageSync('id'),
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        that.loading_huida();
        //endInitData
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
  /*删除社区帖子*/
  del_shequ_zt: function (e) {
    var that = this;
    var sid = e.currentTarget.dataset.sid;
    var that = this;
    wx.showModal({//弹窗
      content: "确认删除？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消
          console.log(88);
        }
        if (res.confirm) {
          wx.showLoading();//加载动画 
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=del_shequ',
            method: 'post',
            data: {
              sid: sid,
              uid: wx.getStorageSync('id'),
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              /*返回刷新 */
              let pages = getCurrentPages();  // 当前页的数据，可以输出来看看有什么东西
              let prevPage = pages[pages.length - 2];  // 上一页的数据，也可以输出来看看有什么东西
              prevPage.setData({
                sx: 1,
              })
              wx.navigateBack({});

              wx.hideLoading()//关闭加载动画
            },
            fail: function (e) {
              wx.showToast({
                title: '网络异常！',
                duration: 2000
              });
            },
          });
        }
      }
    })
  },
  /*删除社区帖子*/
  del_shequ: function (e) {
    var that = this;
    var sid = e.currentTarget.dataset.sid;
    var that = this;
    wx.showModal({//弹窗
      content: "确认删除？",
      showCancel: true,
      confirmText: '确定',
      success: function (res) {
        if (res.cancel) {//点击了取消
          console.log(88);
        }
        if (res.confirm) {
          wx.showLoading();//加载动画 
          wx.request({
            url: app.d.anranUrl + '/index.php?m=default&c=indem&a=del_shequ',
            method: 'post',
            data: {
              sid: sid,
              uid: wx.getStorageSync('id'),
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              that.load_huifu();
              //endInitData
              wx.hideLoading()//关闭加载动画
            },
            fail: function (e) {
              wx.showToast({
                title: '网络异常！',
                duration: 2000
              });
            },
          }); 
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sid = options.sid;
    var that = this;
    that.setData({
      sid: sid,
      user_id: wx.getStorageSync('id'),
    });
    //判断是否是转发打开，如果是就执行绑定推荐方法
    var bd_id = options.id;//获取转发时携带的转发用户的id
    if (bd_id > 0) {
      that.setData({
        bd_id: bd_id
      })
      //将转发过来的ID，放入缓存中
      wx.setStorageSync('bd_id', bd_id)//把转发的人id写入缓存
    }
    /*获取设备型号 */
    wx.getSystemInfo({
      success: function (res) {
        //model中包含着设备信息
        console.log(res.model)
        var model = res.model
        if (model.search('iPhone X') != -1) {
          app.globalData.isIpx = true;
          that.setData({
            padding_bottom: '7%'
          })
        } else {
          app.globalData.isIpx = false;
          that.setData({
            padding_bottom: '2%'
          })
        }
      }
    })
  },
  /* 加载帖子的基本信息*/
  loading_huida: function () {
    var that = this;
    var sid = this.data.sid;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=shequ_info',
      method: 'post',
      data: {
        sid: sid,
        uid: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          xcx_shequ_info: res.data.xcx_shequ_info,
          guanzhu_off: res.data.guanzhu_off,
          bianji: res.data.bianji,
          guanli: res.data.guanli,
          shoucang: res.data.shoucang,
          tx_img:res.data.tx_img,
          count_hui: res.data.count_hui
        });
        that.html(res.data.xcx_shequ_info.content);
        //endInitData
        if (res.data.count_hui < 11){
          that.setData({
            more:'没有更多了'
          })
        }
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
  /*加载回复 */
  load_huifu: function (e) {//加载邀请人列表
    var that = this;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=load_shequ_huifu',
      method: 'post',
      data: {
        sid: this.data.sid,
        page: 1,
        paixu:that.data.paixu,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.count > 0){
        //第一次列表赋值
        that.setData({
          list_ls: res.data.huifu
        })
        for (let i = 0; i < res.data.huifu.length; i++) {
          WxParse.wxParse('content' + i, 'html', res.data.huifu[i].content, that);
          if (i === res.data.huifu.length - 1) {
            WxParse.wxParseTemArray("list_ls", 'content', res.data.huifu.length, that)
          }
        }
        //根据上述操作，list的原有数据会被清楚，因此下面重新赋值相关的数据即可
       
          let list_ls = that.data.list_ls;
          list_ls.map((item, index, arr) => {
          arr[index][0].huifu_info = res.data.huifu[index];           //对应的时使用WxParse后的结构
          arr[index][0].no = index;

        });
        //重新赋值
        that.setData({
          list: list_ls,
          page_ht: 1
        })
        } else {
         
          that.setData({
            more: '没有更多了'
          })
        }
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
  /*加载回复的下拉更多 */
  load_huifu_more: function (e) {//加载邀请人列表
    var that = this;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=load_shequ_huifu',
      method: 'post',
      data: {
        sid: this.data.sid,
        page: that.data.page_ht + 1,//回帖
        paixu: that.data.paixu,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.count > 0) {
          //第一次列表赋值
          that.setData({
            list_ls: res.data.huifu
          })
          for (let i = 0; i < res.data.huifu.length; i++) {
            WxParse.wxParse('content' + i, 'html', res.data.huifu[i].content, that);
            if (i === res.data.huifu.length - 1) {
              WxParse.wxParseTemArray("list_ls", 'content', res.data.huifu.length, that)
            }
          }
          //根据上述操作，list的原有数据会被清楚，因此下面重新赋值相关的数据即可

          let list_ls = that.data.list_ls;
          list_ls.map((item, index, arr) => {
            arr[index][0].huifu_info = res.data.huifu[index];           //对应的时使用WxParse后的结构
            arr[index][0].no = index;

          });
          //重新赋值
          that.setData({
            list: that.data.list.concat(list_ls),
            page_ht: that.data.page_ht + 1
          })
        }else{
          
          that.setData({
            more:'没有更多了'
          })
        }
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

  /*点赞 */
  zan: function (e) {
    var that = this;
    var aid = that.data.aid
    if (e.currentTarget.dataset.idx == 1) {
      this.setData({//设置为赞为不可点击状态
        zan_off: 1
      })
    }
    if (e.currentTarget.dataset.idx == 2) {
      this.setData({//设置为赞为不可点击状态
        fandui_off: 1
      })
    }
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhihu_zan',
      method: 'post',
      data: {
        aid: aid,
        zan: e.currentTarget.dataset.idx,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var zan = that.data.zan;
        that.setData({
          zan: res.data.zan_info[0]
        })
        if (res.data.states == 1) {
          wx.showToast({
            title: '已点赞',
            duration: 2000
          });
        }
        if (res.data.states == 2) {
          wx.showToast({
            title: '取消成功',
            duration: 2000
          });
        }
        if (res.data.states == 3) {
          wx.showToast({
            title: '已反对',
            duration: 2000
          });
        }
        that.setData({
          zan_count: res.data.count
        })
        if (e.currentTarget.dataset.idx == 1) {
          that.setData({//设置为赞为可点击状态
            zan_off: 0
          })
        }
        if (e.currentTarget.dataset.idx == 2) {
          that.setData({//设置为反对为可点击状态
            fandui_off: 0
          })
        }
        //endInitData
        //wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
  /*知乎收藏 */
  shoucang: function (e) {
    var that = this;
    var aid = that.data.aid
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=zhihu_shoucang',
      method: 'post',
      data: {
        hid: aid,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.states == 1) {
          wx.showToast({
            title: '收藏成功',
            duration: 2000
          });
        }
        if (res.data.states == 2) {
          wx.showToast({
            title: '取消收藏',
            duration: 2000
          });
        }
        that.setData({
          shoucang: res.data.count
        });
        //endInitData
        //wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
  /*知乎收藏 */
  shequ_shoucang: function (e) {
    var that = this;
    var sid = that.data.sid
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=shequ_shoucang',
      method: 'post',
      data: {
        sid: sid,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.states == 1) {
          wx.showToast({
            title: '收藏成功',
            duration: 2000
          });
        }
        if (res.data.states == 2) {
          wx.showToast({
            title: '取消收藏',
            duration: 2000
          });
        }
        that.setData({
          shoucang: res.data.count
        });
        //endInitData
        //wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
  guanzhu: function (e) {
    var that = this;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=guanzhu',
      method: 'post',
      data: {
        bid: e.currentTarget.dataset.id,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '关注成功',
          duration: 2000
        });
        that.setData({
          guanzhu_off: 1
        });
        //endInitData
        //wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
  del_guanzhu: function (e) {
    var that = this;
    var uid = that.data.uid
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=del_guanzhu',
      method: 'post',
      data: {
        bid: e.currentTarget.dataset.id,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '取消关注',
          duration: 2000
        });
        that.setData({
          guanzhu_off: 0
        });
        //endInitData
        //wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },




  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  shenhe_ok: function () {
    var that = this;
    var page = that.data.page;
    var aid = that.data.aid;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=riji_shenhe',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        aid: aid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '操作成功！',
          duration: 2000
        });

        setTimeout(function () {//延时10秒关闭弹出层
          wx.navigateBack({
          })
        }, 2000)
        //endInitData
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });

  },
  shenhe_no: function () {
    var that = this;
    var page = that.data.page;
    var aid = that.data.aid;
    wx.showLoading();//加载动画 
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=riji_shenhe_no',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        aid: aid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '操作成功！',
          duration: 2000
        });

        setTimeout(function () {//延时10秒关闭弹出层
          wx.navigateBack({
          })
        }, 2000)
        //endInitData
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.loading_huida();
    this.load_huifu();
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
    this.load_huifu_more();
  },
  /*富文本 */
  onEditorReady(e) {
    const that = this
    wx.createSelectorQuery().select('#editor').context(function (res) {
      that.editorCtx = res.context
    }).exec()
  },
  html: function (html) {//初始化富文本编辑器内容
    this.editorCtx.setContents({
      html: html,
      fail: (res) => {
        console.log('err')
      },
      success: (res) => {
        console.log(res)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var abc = wx.getStorageSync('id');
    var title = this.data.title;
    var sid = this.data.sid;

    return {
      title: title,
      path: '/pages/zhihu/shequ_info?sid=' + sid + '&wid=' + wid + '&id=' + abc,
      success: function (res) {
        // 分享成功

      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})