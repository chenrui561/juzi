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
    goods_id: [],
    images: [],
    images2: [],
    type_id: 0,
    off: 1,
    hid:'',
    yiyuan: ['美国', '中国', '巴西', '日本'],
    yiyuan_index: '',//医院序号
    yiyuan_id: [],//医院对应的ID
    xiangmu: [],
    xiangmu_id: '',//项目序号
    xiangmu_index: 9999, //项目id
    new_goods_id_1: 0,//新增多个项目，最多五个，项目id
    new_goods_id_2: 0,
    new_goods_id_3: 0,
    new_goods_id_4: 0,
    new_goods_id_5: 0,
    new_goods_info_1: [],//第一个项目展示
    new_goods_info_2: [],
    new_goods_info_3: [],
    new_goods_info_4: [],
    new_goods_info_5: [],
    new_goods_id: 0,//选择项目页面返回获得的值
    anli_info: [],
    update_time:'',//最后一次修改时间
    input_content:'',//输入的内容传进来
    change_content_key:-1,//点击修改的时候，第几个数组要改
    content_key:0,//数组的key
    content_info:[], //最后提交的图文数组
    box:'',//预览的临时字符串
    type_box:'',//最后提交的类型id字符串
    content_r:''//最后提交的字符串
  },

  onLoad(options) {
    $init(this)
    var that = this;
    if (options.wid > 0) {
      this.setData({
        wid: options.wid, //写入问题id
        hid: options.hid
      })
      wx.setNavigationBarTitle({
        title: options.title
      })
    }
    if (options.hid > 0){
      this.caogao(options.hid);
    }
  },
caogao:function(hid){
  /*加载草稿 */
  var that = this;
  wx.request({
    url: app.d.anranUrl + '/index.php?m=default&c=indem&a=caogao_info',
    method: 'post',
    data: {
      user_id: wx.getStorageSync('id'),//用户id
      hid: hid,//草稿id
    },
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(res)
      var a = res.data.huida[0].caogao_type.split(",");
      var b = res.data.huida[0].caogao.split("|");
      console.log(a);
      console.log(b);
      wx.setNavigationBarTitle({
        title: res.data.title
      })
      if (res.data.huida.length > 0) {
        that.setData({//设置最后一次保存时间
          update_time: res.data.huida[0].update_time
        })
      }
      for (let i = 0; i < a.length; ++i) {
        var obj = {};
        obj.type = a[i];//表示是文本
        obj.con = b[i];
        let content_info = that.data.content_info;
        content_info.push(obj);
        that.setData({ content_info })//提交数组*/
      }
      /* var obj = {};
       obj.type = 0;//表示是文本
       obj.con = this.data.input_content;
       let content_info = this.data.content_info;
       content_info.push(obj);

       this.setData({ content_info })//提交数组*/
    },
    fail: function (e) {
      wx.showToast({
        title: '网络异常！',
        duration: 2000
      });
    },
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
    this.setData({
      input_content: e.detail.value
    })
  },
/*处理最后的box内容，并提交到草稿 */
  box: function (tijiao) {//处理提交
    let content_info = this.data.content_info;
    /*处理最后提交的box */
    var box = this.data.box;//临时文件
    this.setData({//先清空box数据和循环数据
      box: '',
    })
    console.log('测试清空box' + box);
    for (let i = 0; i < content_info.length; ++i) {
      var abc = this.data.content_info[i].con;//循环提交的内容
      var type_id = this.data.content_info[i].type;//对应的类型，0为文本，1为img
      var content_r = this.data.content_r;//弃用
      var box = this.data.box;//最后提交的字符串
      var type_box = this.data.type_box;//最后提交的类型id
      if (i == 0) {//第一次循环,不要逗号
        var box2 = abc;
        var type_box2 = type_id;
      } else {//后面的加上逗号作为分隔符
        var box2 = box + '|' + abc;
        var type_box2 = type_box + ',' + type_id
      }
      this.setData({//临时文件中放入循环数据
        box: box2,
        type_box:type_box2
      })
      console.log('测试abc' + abc);
    }
    console.log('box:' + box);
    /*提交回答 */
    wx.request({
      url: app.d.anranUrl + '/index.php?m=default&c=indem&a=add_zhihu_huida',
      method: 'post',
      data: {
        user_id: wx.getStorageSync('id'),//用户id
        tijiao:tijiao,
        wid: this.data.wid,//问题id
        content: this.data.box,//问题的内容
        type_box: this.data.type_box//每条内容对应的typeid（类型）
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.data.states == 1) {
          if(tijiao == 1){
            wx.showToast({
              title: '提交成功！',
              duration: 1000
            });
            setTimeout(function () {//延时1秒返回
              wx.navigateBack()
            }, 1000)
            
          }else{
            wx.showToast({
              title: '草稿保存成功！',
              duration: 1000
            });
          }
          
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
/*提交预览 */
  test: function (tijiao){//
  var that = this;
    var input = this.data.input_content;//文本框里的文字
    if(input == '' && tijiao != 1){//如果文本框没有文字
      wx.showToast({
        title: '您还没有输入文字！',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var key = this.data.content_key;//数组的key
    var content_r = this.data.content_r;
    var obj = {};
    obj.type = 0;//表示是文本
    obj.con = this.data.input_content;
    let content_info = this.data.content_info;
    content_info.push(obj);

    this.setData({content_info})//提交数组
    this.setData({ //提交之后把input变空
      input_content:''
      })
    if (tijiao == 1){
      this.box(tijiao);
    }else{
      this.box();
    }
    
  },
  /*加黑 */
  jiahei: function () {//加黑
    var that = this;
    var input = this.data.input_content;//文本框里的文字
    if (input == '') {//如果文本框没有文字
      wx.showToast({
        title: '您还没有输入文字！',
        icon: 'none',
        duration: 2000
      });
      return false;
    }
    var key = this.data.content_key;//数组的key
    var content_r = this.data.content_r;
    var obj = {};
    obj.type = 2;//表示是加黑文本
    obj.con = this.data.input_content;
    let content_info = this.data.content_info;
    content_info.push(obj);

    this.setData({ content_info })
    this.setData({
      input_content: ''
    })
   this.box();//处理提交内容

  },
  /*分隔符 */
  fenge: function () {//加黑
    var that = this;
    var input = this.data.input_content;//文本框里的文字
    var key = this.data.content_key;//数组的key
    var content_r = this.data.content_r;
    var obj = {};
    obj.type = 3;//表示是分隔符
    obj.con = '分隔符';
    let content_info = this.data.content_info;
    content_info.push(obj);

    this.setData({ content_info })
    this.setData({
      input_content: ''
    })
    this.box();//处理提交内容

  },
  test2:function(){
    console.log(this.data.box);
    console.log(this.data.type_box);
    console.log(this.data.content_info);
  },
  chooseImage(e) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const images = res.tempFilePaths;
        this.data.images = images.length <= 1 ? images : images.slice(0, 1)
        $digest(this)
        console.log(images)
        that.up_img();
      }
    })
  },
  change_input:function(e){//修改预览的图文内容
    var change_content_key = e.currentTarget.dataset.idx;//获取第几个
    this.setData({//把这个地方变成可以 编辑的状态
      change_content_key: change_content_key
    })
  },
  change_over:function(e){//光标移出时，修改数组中的值
    var idx = e.currentTarget.dataset.idx;//第几个数组
    var content_info = this.data.content_info;
    var content_i = 'content_info['+idx+'].con';
    var change_content_key = this.data.change_content_key;
    this.setData({
      [content_i]: e.detail.value,
      change_content_key:-1
    })
    console.log(content_info);
  },
  del_img: function (e) {//删除图片
    var idx = e.currentTarget.dataset.idx;//第几个数组
    var content_info = this.data.content_info;
    var content_i = 'content_info[' + idx + '].con';
    var change_content_key = this.data.change_content_key;
    this.setData({
      [content_i]: '',
      change_content_key: -1
    })
    console.log(content_info);
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

  tijiao: function(e) {
    
    this.test(1);//提交

  },

  up_img: function (id) {//上传图片
    const content = this.data.content
    var that = this;
    //this.test();
    console.log(123);
      const arr = []
      var key = 1;
      var key2 = 1;
      for (let path of this.data.images) {
        arr.push(wxUploadFile({
          url: app.d.anranUrl + '/index.php?m=default&c=indem&a=save_cao',
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
        var that = this;
        console.log(res[0].data)
        var obj = {};
        obj.type = 1;
        obj.con = res[0].data;
        let content_info = this.data.content_info;
        content_info.push(obj);
        that.setData({content_info})
        this.box();//处理提交内容
        wx.hideLoading()



      }).catch(err => {
        console.log(">>>> upload images error:", err)
      })
    

  },

  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
  },


})