var app = getApp();

Page({
  data: {
    imgUrls: [],
    tid:'',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    productData: [],
    haoyou:[],
    goods_list:[],
    goods_id: '',
    proCat:[],
    page: 2,
    index: 2,
    brand:[],
    // 滑动
    imgUrl: [],
    kbs:[],
    lastcat:[],
    course:[],
    shaidan:[],
    test:"",
    xiala:0,
    winHeight: "624",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    expertList: [{ //假数据
      img: "avatar.png",
      name: "欢顔",
      tag: "知名情感博主",
      answer: 134,
      listen: 2234
    }],
    image_photo:[],
    userInfo: {},
    user_id:'',
    st:''
  },


//点击加载更多
getMore:function(e){
  var that = this;
  var page = that.data.page;
  
},

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  big_img(e) {//点击显示大图
    const bigimg = e.target.dataset.bigimg
    const current = e.target.dataset.img
    console.log(current);
    console.log(bigimg);
    wx.previewImage({
      current: current,
      urls: bigimg
    })
  },
  remove_shaidan(e) {//删除自己的晒单
    var that = this;
    var sdid = e.target.dataset.sdid;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_de_sd_info',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        sdid: sdid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        
        that.xiala();
        //endInitData
       // wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  dianzan(e) {//点赞
    var that = this;
    var sdid = e.target.dataset.sdid;
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=dianzan',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        sdid: sdid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        that.xiala();
        //endInitData
        // wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },
  dianzan2(e) {//点赞
    wx.showToast({
      title: '已经赞过了',
      duration: 2000
    });
  },
 onShow:function(){
   let pages = getCurrentPages();
   let currPage = pages[pages.length - 1];
   if (currPage.data.xiala == 1) {
    this.xiala();
   }
   
 },


  onLoad: function (options) {//加载页面的时候，把tid写入页面
   

    wx.showLoading();//加载动画
    var that = this;
    var userid = wx.getStorageSync('id');

    that.setData({
      user_id: userid,
    });
  //加载晒单
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=get_shaidan3',
      method: 'post',
      data: { 
        id: wx.getStorageSync('id'),
        page:1
         },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shaidan = res.data.comments;
        var st = res.data.st;
        that.setData({
          shaidan: shaidan,
          st: st
        });
        //endInitData
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

    

    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        console.log(clientHeight)
        that.setData({
          winHeight: clientHeight
        });
      }
    });
  },
  xiala: function (e) {
    var that = this;

    wx.showLoading();//加载动画
    //加载晒单
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=get_shaidan3',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        page: 1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shaidan = res.data.comments;
        that.setData({
          shaidan: shaidan,
        });
        //endInitData
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },

  //滑动加载更多
  onReachBottom: function (e) {
    var that = this;
    var page = that.data.page;
console.log(998);
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=get_shaidan3',
      method: 'post',
      data: {
        id: wx.getStorageSync('id'),
        page: page
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shaidan = res.data.comments;
        if (shaidan == '') {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        that.setData({
          page: page + 1,
          shaidan: that.data.shaidan.concat(shaidan)
        });
        //endInitData
        
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

  },
 
  // 弹窗
  setModalStatus: function (e) {
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })

    this.animation = animation
    animation.translateY(300).step();

    this.setData({
      animationData: animation.export()
    })

    if (e.currentTarget.dataset.status == 1) {

      this.setData(
        {
          showModalStatus: true
        }
      );
    }
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation
      })
      if (e.currentTarget.dataset.status == 0) {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
  },

  // 上传图片

  choice: function () {
    var that = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        that.setData({
          textHidden: true,
          image_photo: tempFilePaths,
          photoHidden: false
        })
      }
    })
  },

  /**
       * 页面相关事件处理函数--监听用户下拉动作--下拉刷新
       */
  onPullDownRefresh: function () {
   this.xiala();
    wx.stopPullDownRefresh();//解决回弹问题

  },
 

 footerTap: app.footerTap
});