import { promisify } from '../../utils/promise.util'
import { $init, $digest } from '../../utils/common.util'
//import { createQuestion } from '../../services/question.service'
import config from '../../config'

const wxUploadFile = promisify(wx.uploadFile)
var app = getApp()
Page({

  data: {
    titleCount: 0,
    contentCount: 0,
    title: '',
    content: '',
    goods_id:[],
    images: [],
    images2: [],
    yiyuan: ['美国', '中国', '巴西', '日本'],
    yiyuan_index:'',//医院序号
    yiyuan_id:[],//医院对应的ID
    xiangmu:[],
    xiangmu_index:''//项目序号
  },

  onLoad(options) {
    $init(this)
    this.yiyuan_load();

  },
yiyuan_load:function(e){
  var that = this;
  wx.showLoading();//加载动画
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_yiyuan',
    method: 'post',
    data: {
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      that.setData({
        yiyuan: res.data.yiyuan,
        yiyuan_id: res.data.yiyuan_id
      });
      //endInitData
      wx.hideLoading()//关闭加载动画
    },
    fail: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    }
  })
},
  handleTitleInput(e) {
    const value = e.detail.value
    this.data.title = value
    this.data.titleCount = value.length
    $digest(this)
  },

  handleContentInput(e) {
    const value = e.detail.value
    this.data.content = value
    this.data.contentCount = value.length
    $digest(this)
  },

  chooseImage(e) {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        this.data.images = images.length <= 3 ? images : images.slice(0, 3)
        $digest(this)
        console.log(images)
       
      }
    })
  },
  chooseImage2(e) {
    wx.chooseImage({
      count: 3,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images2 = this.data.images2.concat(res.tempFilePaths)
        this.data.images2 = images2.length <= 3 ? images2 : images2.slice(0, 3)
        $digest(this)
        console.log(images2)

      }
    })
  },
  removeImage(e) {
    const idx = e.currentTarget.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.currentTarget.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },

  submitForm(e) {
    const content = this.data.content
    var that = this;
    var xiangmu_index = that.data.xiangmu_index;
    console.log(content)
/*先创建一个晒单 */
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=add_shaidan',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
        goods_id: xiangmu_index,
        content: content
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shaidan = res.data.state;
        var id = res.data.id;
        if (shaidan == 1) {//添加成功
          that.up_img(id);//创建成功之后再上传图片
        }else{
          wx.showToast({
            title: '提交失败！',
            duration: 2000
          });
        }

      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })

    
  },

  up_img: function (id){//上传图片
  const content = this.data.content
    console.log(content);
  if (content) {
    const arr = []
    var key = 1;
    var key2 = 1;
    for (let path of this.data.images) {
      arr.push(wxUploadFile({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save',
        filePath: path,
        name: 'file',
        formData: {
          user_id: wx.getStorageSync('id'),
          content: content,
          id: id,
          key: key++
        },
      }))
    }
    for (let path of this.data.images2) {
      arr.push(wxUploadFile({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save2',
        filePath: path,
        name: 'file',
        formData: {
          user_id: wx.getStorageSync('id'),
          content: content,
          id: id,
          key2: key2++
        },
      }))
    }

    wx.showLoading({
      title: '正在创建...',
      mask: true
    })

    Promise.all(arr).then(res => {
      let pages = getCurrentPages();//当前页面
      let prevPage = pages[pages.length - 2];//上一页面
      prevPage.setData({//直接给上移页面赋值
        xiala: 1
      });
      wx.hideLoading()
      wx.navigateBack()
   
      
    }).catch(err => {
      console.log(">>>> upload images error:", err)
    })
  }

},

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      yiyuan_index: e.detail.value
    })
    var that = this;
    var yiyuan_id = that.data.yiyuan_id[e.detail.value];
    wx.showLoading();//加载动画
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=xcx_xiangmu',
      method: 'post',
      data: {
        yiyuan_id: yiyuan_id
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          xiangmu: res.data.xiangmu,
          goods_id:res.data.goods_id
        });
        //endInitData
        wx.hideLoading()//关闭加载动画
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
  bindPickerChange2: function (e) {//选择项目
    var goods_id = this.data.goods_id;
    console.log('picker发送选择改变，携带值为', goods_id[e.detail.value])
    this.setData({
      xiangmu_index: goods_id[e.detail.value]
    })
  },

})