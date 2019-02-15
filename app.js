// app.js
App({
 
  d: {
    hostUrl: 'https://www.juziyimei.com/xcx/index.php',
    hostImg: 'http://img.ynjmzb.net',
    hostVideo: 'http://zhubaotong-file.oss-cn-beijing.aliyuncs.com',
    userId: "",
    anran_id: "",
    appId:"",
    appKey:"",
    ceshiUrl:'https://www.juziyimei.com/xcx/index.php',
    anranUrl: 'https://www.juziyimei.com/mobile',
  },
  
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    wx.getSetting({
      success: (res) => {
      }
    })
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    //login
    //this.getUserInfo();
    /*检测新版本更新 */
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调

    })

    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })

    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
  },
  
  /*授权成功之后会调用这个getUserInfo方法 */
  getUserInfo:function(cb){
    var that = this
    
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo) 
    }else{
      //调用登录接口
      wx.login({
        success: res => {
          var code = res.code;
          //get wx user simple info
          wx.getUserInfo({//如果没有授权，进不来这个方法
            success: res => {
              that.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              typeof cb == "function" && cb(that.globalData.userInfo);
              //get user sessionKey
              //get sessionKey
            //  if (wx.getStorageSync('id') > 0) {} else {
                that.getUserSessionKey(code);//调下一个方法
            //  }
            }
          });

        }
      });
      
    }
    
  },
  //第一次进入的时候因为app.js会先执行，所以需要回调数据到index.js，以便弹出授权框
  getOpenid: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      //调用登录接口
      wx.login({
        success: res => {
          var code = res.code;

          //get wx user simple info
          wx.getUserInfo({//如果没有授权，进不来这个方法
            success: res => {

              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo);
              //get user sessionKey
              //get sessionKey
              if (wx.getStorageSync('ctrl') == 1){//启用免获取openid登录
                if (wx.getStorageSync('id') > 0) { } else {
                  that.getUserSessionKey(code);//调下一个方法
                }
              }else{
                that.getUserSessionKey(code);//调下一个方法
              }
              

              resolve(66);//回调66，表示授权成功666
            },
            fail: res => {//没有获得授权，那就弹窗提示同意授权   
              
              resolve(88);//表示没有获得授权，弹框88
            }
          });
        }
      });
    });
  }, 
/*回调函数结束 */


  getUserSessionKey:function(code){
    wx.showLoading();//加载动画
    //用户的订单状态
    var that = this;
    wx.request({
      url: that.d.ceshiUrl + '/Api/Login/getsessionkey',
      method:'post',
      data: {
        code: code
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data  
              
        var data = res.data;
        if(data.status==0){
          wx.showToast({
            title: data.err,
            duration: 2000
          });
          return false;
        }

        that.globalData.userInfo['sessionId'] = data.session_key;
        that.globalData.userInfo['openid'] = data.openid;
        that.onLoginUser();
       
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！err:getsessionkeys',
          duration: 2000
        });
      },
    });
  },
 
  onLoginUser:function(){
    var that = this;
    var user = that.globalData.userInfo;
   
    wx.request({
      url: that.d.ceshiUrl + '/Api/Login/authlogin',
      method:'post',
      data: {
        SessionId: user.sessionId,
        gender:user.gender,
        NickName: user.nickName,
        HeadUrl: user.avatarUrl,
        openid:user.openid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data        
       
       
        
        var data = res.data.arr;
       
        var status = res.data.status;
        if(status!=1){
          wx.showToast({
            title: res.data.err,
            duration: 3000
          });
          return false;
        }
  
        that.d.userId = data.ID;
        that.globalData.userInfo['id'] = data.ID;
       that.globalData.userInfo['NickName'] = data.NickName;
        that.globalData.userInfo['HeadUrl'] = data.HeadUrl;
        if(data.bd_info > 0){//表示有绑定app账户
          that.globalData.userInfo['anran_id'] = data.bd_info;//把绑定的安然海淘的用户id写到userinfo里
          that.d.anran_id = data.bd_info;//
          wx.setStorageSync('id', data.bd_info)//把自己的id写入缓存
          wx.setStorageSync('NickName', data.NickName)//NickName
          wx.setStorageSync('HeadUrl', data.HeadUrl)//HeadUrl 
          wx.setStorageSync('choujiang', data.choujiang)//把抽奖券数量写入缓存
        }else{
          that.globalData.userInfo['anran_id'] = data.anran_id;//把安然海淘的用户id写到userinfo里
          that.d.anran_id = data.anran_id;//
          wx.setStorageSync('id', data.anran_id)//把自己的id写入缓存
          //wx.setStorageSync('id', '131')//进别人的号
          wx.setStorageSync('NickName', data.NickName)//NickName
          wx.setStorageSync('HeadUrl', data.HeadUrl)//HeadUrl 
          wx.setStorageSync('choujiang', data.choujiang)//把抽奖券数量写入缓存
        }
       
        /*如果缓存bd_id有数值，就执行绑定方法 */
        var bd_id = wx.getStorageSync('bd_id')
        var anran_id = data.anran_id;
        if(bd_id > 0){
          wx.request({//加载首页推荐商品
            url: that.d.anranUrl + '/index.php?m=default&c=indem&a=bd',
            method: 'post',
            data: {
              bd_id: bd_id,
              anran_id: anran_id
            },
            header: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              var state = res.data.state
              wx.setStorageSync('bd_id', '')//绑定成功后要把缓存的bd_id设置为空
            
            },
            fail: function (e) {
              wx.showToast({
                title: '网络异常！',
                duration: 2000
              });
            },
          });
        }

        var userId = data.ID;
        if (!userId){
          wx.showToast({
            title: '登录失败！',
            duration: 3000
          });
          return false;
        }
        wx.hideLoading()//关闭加载动画
        
        
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！err:authlogin',
          duration: 2000
        });
      },
    });
  },
  
  
  globalData: {
    userInfo: null
  },
 

  onPullDownRefresh: function (){
    wx.stopPullDownRefresh();
  }

});





