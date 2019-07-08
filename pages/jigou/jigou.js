// pages/jigou/jigou.js
var app = getApp();
import { promisify } from '../../utils/promise.util'
import { $init, $digest } from '../../utils/common.util'
//import { createQuestion } from '../../services/question.service'
import config from '../../config'
const wxUploadFile = promisify(wx.uploadFile)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jigou_info:[],
    xiangmu_list:[],
    images_one:[],//logo
    brand_logo:'',//上传成功之后临时logo
    img01:'',//临时营业执照
    img02: '',//临时门店招牌
    img03: '',//环境1
    img04: '',//环境2
    user_lei:'',
    limit:4,//首页加载优惠项目的限制
    user_id:'',
    top:0,
    jigou_id:'',
    ys:0,//判断是否是医生
    page:1,
    z_index:1,
    mode:0,//默认为0，即为主页模式，1为tab模式
    text_long:0,
    youhui_top:290,
    latitude: 0,
    longitude: 0,
    yishi_top:950,
    pj_top:1250,
    currentTab:0,
    url:'/images/lz_load.jpg',
    jigou_xiangmu_count:'',
    bianji: 0,//编辑店铺的状态，默认是0，非编辑状态，1为编辑状态
    jianjie_input:'',//输入的简介，点击结束编辑提交
    address_input:'',//输入的地址，结束提交
  },
/*地图导航 */
ditu:function(e){
  var that = this;
  wx.getLocation({
    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    success: function (res) {
      var latitude = parseFloat(that.data.latitude);
      var longitude = parseFloat(that.data.longitude);
      var name = that.data.jigou_info.brand_name
      wx.openLocation({
        latitude,
        longitude,
        name: name,
        scale: 18
      })
    }
  })


  
},
  bindload:function(e){
    console.log(e.currentTarget.dataset.img);
    this.setData({
      url: e.currentTarget.dataset.img
    })
  },
  text_long:function(e){
    if(e.currentTarget.dataset.id == 1){
      this.setData({
        text_long: 0
      })
      console.log(999);
    }else{
      this.setData({
        text_long: 1
      })
      console.log(888);
    }
    
    
  },
  bindscroll: function (e) {
   // let query = wx.createSelectorQuery()
   if(this.data.mode == 0){//主页模式
     var youhui_top = this.data.youhui_top;
     var yishi_top = this.data.yishi_top;
     var pj_top = this.data.pj_top;
     if (e.detail.scrollTop < youhui_top) {//
       this.setData({
         top: 0,
       })
     }
     if (e.detail.scrollTop > youhui_top && e.detail.scrollTop < yishi_top) {//300px显示为优惠
       this.setData({
         top: 1,
         z_index: 2
       })
     }
     if (e.detail.scrollTop > yishi_top && e.detail.scrollTop < pj_top) {//显示为医师
       this.setData({
         top: 1,
         z_index: 3
       })
     }
     if (e.detail.scrollTop > pj_top) {//显示为评价
       this.setData({
         top: 1,
         z_index: 4
       })
     }

   }
    
    
   /* query.select('#yishi').boundingClientRect((rect) => {
      let top = rect.top//医生板块到头部的距离
      if(top < 60){
        this.setData({
          top:1,
          z_index:2
        })
      }else{
        
      }
      //console.log('优惠' + top);
    }).exec()*/
   
    
   


    console.log(e.detail.scrollTop);
  },
  scroll:function(e){
    this.setData({
      top:1
    })
    console.log(1);
  },
  indexChange:function(e){
    var youhui_top = this.data.youhui_top;
    var yishi_top = this.data.yishi_top;
    var pj_top = this.data.pj_top;
    
    console.log(e);
    this.setData({
      z_index: e.currentTarget.dataset.current
    })
    if (e.currentTarget.dataset.current == 1) {
      this.setData({
        s_top: 0,
        top: 0
      })
    }
    if (e.currentTarget.dataset.current == 2){
      this.setData({
        s_top: youhui_top,
        top: 1
      })
    }
    if (e.currentTarget.dataset.current == 3) {
      this.setData({
        s_top: yishi_top,
        top: 1
      })
    }
    if (e.currentTarget.dataset.current == 4) {
      this.setData({
        s_top: pj_top,
        top: 1
      })
    }
  },

  bianji: function () {//开启编辑
    this.setData({
      bianji: 1
    })
  },
  bianji2: function () {//结束编辑
    this.setData({
      bianji: 0
    })
    var that = this;
    wx.request({//修改店铺信息
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_change_jigou_info',
      method: 'post',
      data: {
        jigou_id: this.data.jigou_id,
        jianjie_input: this.data.jianjie_input,
        address_input: this.data.address_input,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.status == 1){
          wx.showToast({
            title: '修改成功',
            duration: 2000
          });
        }
        that.loading();
      },
      fail: function (e) {
        wx.showToast({
          title: '提交失败！',
          duration: 2000
        });
      },
    });
  },
  chooseImage(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images_one = res.tempFilePaths;
        this.data.images_one = images_one.length <= 1 ? images_one : images_one.slice(0, 1)
        $digest(this)
        this.setData({
          images_one: res.tempFilePaths
        })
        //console.log(images_one)
        that.up_logo(e.currentTarget.dataset.idx);
        console.log('测试')
      }
    })
  },
/*上传logo*/
  up_logo: function (key){
  var that = this;
    const arr = []
  var id = this.data.jigou_id;
  for (let path of this.data.images_one) {
      arr.push(wxUploadFile({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save_logo',
        filePath: path,
        name: 'file',
        formData: {
          user_id: wx.getStorageSync('id'),
          id: id,
          key:key
        },
      }))

    }

    wx.showLoading({
      title: '正在创建...',
      mask: true
    })

    Promise.all(arr).then(res => {
      var that = this;
      if(key == 0){
        that.setData({
          brand_logo: res[0].data
        })
      }
      if (key == 1) {
        that.setData({
          img01: res[0].data
        })
      }
      if (key == 2) {
        that.setData({
          img02: res[0].data
        })
      }
      
      console.log(res[0].data);
      wx.showToast({
        title: '上传成功！',
        duration: 2000
      });
      wx.hideLoading()
    }).catch(err => {
      console.log(">>>> upload images error:", err)
    })
},

change_page_1:function(){
  this.setData({
    page:1
  })
},
  change_page_2: function () {
    this.setData({
      page: 2
    })
  },
  change_page_3: function () {
    this.setData({
      page: 3
    })
  },
  /*简介输入 */
  jianjie_input:function(e){
    this.setData({
      jianjie_input: e.detail.value
    })

  },
  /*地址输入 */
  address_input: function (e) {
    this.setData({
      address_input: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    $init(this)
    var jigou_id = options.jigou_id;
    var ys = options.ys;
    
    this.setData({
      jigou_id: jigou_id,
      ys: ys,
      user_id: wx.getStorageSync('id'),
      user_lei: wx.getStorageSync('user_lei')
    })
    if (ys == 1) {
      wx.setNavigationBarTitle({
        title: '医生主页'
      })
      this.setData({
        page: 2
      })
    }
   this.loading();
  },


//showTop: event.currentTarget.offsetTop  当前元素点击事件获取当前的距离  然后减去滚动的距离即可

  loading:function(){
    var that = this;
    var jigou_id = this.data.jigou_id;
    wx.showLoading();//加载动画
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_jigou_info',
      method: 'post',
      data: {
        jigou_id: jigou_id,
        limit:this.data.limit,
        user_id: wx.getStorageSync('id')
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        that.setData({
          jigou_info: res.data.jigou_info[0],
          jianjie_input: res.data.jigou_info[0].brand_desc,
          address_input: res.data.jigou_info[0].address,
          jigou_xiangmu_count: res.data.jigou_xiangmu_count,
          xiangmu_list: res.data.xiangmu_list,
          pl_info: res.data.pl_info,
          ys_list: res.data.ys_list,
          count:res.data.count,
          latitude: res.data.jigou_info[0].la,
          longitude: res.data.jigou_info[0].lo,
          scxm: res.data.scxm,
          jigou_fen: res.data.jigou_fen,
          count_ys: res.data.count_ys
        });
        wx.hideLoading()//关闭加载动画
        if (res.data.xiangmu_list.length == 1 || res.data.xiangmu_list.length == 2 ){
          that.setData({
           yishi_top:690,
           pj_top:950
          })
        }
        if (res.data.xiangmu_list.length == 0 ) {
          that.setData({
            yishi_top: 390,
            pj_top: 650
          })
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '提交失败！',
          duration: 2000
        });
      },
    });
  },
  hezuo:function(){
    wx.request({//加载首页推荐商品
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=hezuo',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
        brand_id: this.data.jigou_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.showToast({
          title: '申请成功！',
          duration: 2000
        });
        
      },
      fail: function (e) {
        wx.showToast({
          title: '提交失败！',
          duration: 2000
        });
      },
    });
  },
  big_img: function (e) {//单张大图的方法
    var img = e.target.dataset.img
    var img_arr = e.target.dataset.bigimg
    var url = img.split();
    wx.previewImage({
      current: img,
      urls: img_arr
    })
    console.log(e);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})