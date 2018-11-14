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
    images: []
  },

  onLoad(options) {
    $init(this)
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
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = this.data.images.concat(res.tempFilePaths)
        this.data.images = images.length <= 9 ? images : images.slice(0, 9)
        $digest(this)
        console.log(images[0])
       
      }
    })
  },

  removeImage(e) {
    const idx = e.target.dataset.idx
    this.data.images.splice(idx, 1)
    $digest(this)
  },

  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images

    wx.previewImage({
      current: images[idx],
      urls: images,
    })
  },

  submitForm(e) {
    const content = this.data.content
    var that = this;
    console.log(content)
/*先创建一个晒单 */
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=add_shaidan2',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),
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
 console.log(id);
  if (content) {
    const arr = []
    var key = 1;
    for (let path of this.data.images) {
      arr.push(wxUploadFile({
        url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save3',
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

}











})