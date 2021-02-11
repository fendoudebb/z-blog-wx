// pages/post/post.js
const app = getApp()

// var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: '',
    postId: '',
    loading: true,
    topTipsType: 'success',
    topTipsMsg: '',
    post: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let st = new Date().getTime();
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    that.setData({
      from: options.from,
      postId: options.postId,
    }, function() {
      wx.getStorage({
        key: 'post-json-' + that.data.postId,
        success: function (res) {
          console.log("success-----------------")
          console.log(res)
          var post = JSON.parse(res.data)

          let et = new Date().getTime();
          console.log('wx.getStorage执行时间： ' + (et - st) + '毫秒');
          // WxParse.wxParse('article', 'html', post.contentHtml, that, 5);
          let et33 = new Date().getTime();
          console.log('wxParse执行时间： ' + (et33 - et) + '毫秒');

          that.setData({
            postId: post.postId,
            post: post,
            loading: false
          }, function () {
            let et1 = new Date().getTime();
            wx.hideLoading()
            console.log('setData执行时间： ' + (et1 - et) + '毫秒');
          })
        },
        fail: function(res) {
          console.log(res.errMsg)
          wx.request({
            url: app.globalData.urlPrefix + '/m/p/' + that.data.postId,
            method: 'GET',
            responseType: 'text',
            success(res) {
              if (res.data.code !== 0) {
                that.setData({
                  loading: false,
                  topTipsType: 'error',
                  topTipsMsg: '请求出错，请稍后再试~',
                }, function () {
                  wx.hideLoading()
                })
                return
              }
              let et = new Date().getTime();
              console.log('wx.request执行时间： ' + (et - st) + '毫秒');
              // WxParse.wxParse('article', 'html', res.data.data.post.contentHtml, that, 5);
              let et2 = new Date().getTime();
              console.log('wxParse执行时间： ' + (et2 - et) + '毫秒');
              var post = res.data.data.post
              wx.setStorage({
                key: 'post-json-' + that.data.postId,
                data: JSON.stringify(post),
              })
              wx.setStorage({
                key: 'post-date-' + that.data.postId,
                data: new Date(),
              })
              that.setData({
                postId: post.postId,
                post: post,
                loading: false
              }, function () {
                let et1 = new Date().getTime();
                wx.hideLoading()
                console.log('setData执行时间： ' + (et1 - et) + '毫秒');
              })
            },
            fail(reason) {
              console.log(reason)
              that.setData({
                loading: false,
                topTipsType: 'error',
                topTipsMsg: '服务器忙，请稍后再试',
              }, function () {
                wx.hideLoading()
              })
            }
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    console.log("enter post#" + that.data.postId + " from#" + that.data.from)
    wx.reportAnalytics('enter_post', {
      from: that.data.from,
      postid: that.data.postId,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this
    if (res.from === 'button') {
      // 通过按钮触发
      var data = res.target.dataset
      return {
        title: data.title,
        path: '/pages/post/post?from=share-btn&postId=' + data.postId,
        imageUrl: '',
        success: function(res) {
          // 转发成功
          console.log('转发成功')
        },
        fail: function(res) {
          // 转发失败
          console.log('转发失败')
        }
      }
    }
    //通过右上角菜单触发
    return {
      title: that.data.title,
      path: "/pages/post/post?from=share-menu&postId=" + that.data.postId,
      imageUrl: ''
    };
  },

  handleContact: function(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },

  bindLoad: function(e) {
    var status = e.detail.status;
    var errMsg = e.detail.errMsg;
    console.log("official-account bind load#status=" + status + ", errMsg=" + errMsg)
  },

  bindError: function(e) {
    var status = e.detail.status;
    var errMsg = e.detail.errMsg;
    console.log("official-account bind error#status=" + status + ", errMsg=" + errMsg)
  },

  navToTopic: function (e) {
    var topic = e.currentTarget.dataset.topic
    wx.navigateTo({
      url: '/pages/topic/topic?from=topic&topic=' + topic,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },


})