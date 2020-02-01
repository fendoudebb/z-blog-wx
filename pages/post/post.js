// pages/post/post.js
var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    from: '',
    postId: '',
    loading: false,
    topTipsType: 'error',
    topTipsMsg: '',
    title: '',
    postTime: '',
    topics: [],
    pv: 0,
    postWordCount: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      from: options.from,
      postId: options.postId,
      loading: true
    })
    wx.request({
      url: 'https://www.zhangbj.com/m/p/' + that.data.postId,
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data);
        if (res.data.code !== 200) {
          that.setData({
            topTipsType: 'error',
            topTipsMsg: '请求出错，请稍后再试~',
          })
          return
        }

        that.setData({
          title: res.data.data.post.title,
          postTime: res.data.data.post.postTime.$date.$numberLong,
          topics: res.data.data.post.topics,
          pv: res.data.data.post.pv,
          postWordCount: res.data.data.post.postWordCount
        })

        WxParse.wxParse('article', 'html', res.data.data.post.contentHtml, that, 5);

      },
      fail(reason) {
        console.log(reason)
        that.setData({
          topTipsType: 'error',
          topTipsMsg: '服务器忙，请稍后再试',
        })
      },
      complete() {
        that.setData({
          loading: false,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    console.log(that.data.from)
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
  }
})