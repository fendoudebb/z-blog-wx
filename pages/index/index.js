//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    posts: [],
    currentPage: 1,
    totalPage: 1,
    topTipsMsg: '',
    topTipsType: 'error',
    loading: false,
    noMoreData: false,
    showtab: 0, //顶部选项卡索引
    tabnav: {
      tabnum: 5,
      tabitem: ["全部", "小程序", "Java", "Linux", "Redis", "Android", "PHP", "Nginx", "MySQL", "PostgreSQL", "面试", "算法"]
    }
  },
  setTab: function(e) {
    var that = this
    const edata = e.currentTarget.dataset;
    that.setData({
      posts: [],
      noMoreData: false
    })
    this.getPostInfo(edata.tabindex, 1)
  },
  onLoad: function() {
    this.getPostInfo(0, 1);
  },
  onReady: function() {

  },

  //下拉刷新
  onPullDownRefresh: function() {
    // wx.showNavigationBarLoading() //在标题栏中显示加载
    // wx.showLoading({
    //   title: '刷新中',
    // });
    // //模拟加载
    // setTimeout(function() {
    //   // complete
    //   wx.hideLoading()
    //   wx.hideNavigationBarLoading() //完成停止加载
    //   wx.stopPullDownRefresh() //停止下拉刷新
    // }, 1500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    if (that.data.noMoreData) {
      if (that.data.loading) {
        that.setData({
          loading: false,
        })
      }
      return
    }
    that.setData({
      loading: true,
    })

    wx.request({
      url: app.globalData.urlPrefix + '/m/index',
      data: {
        topic: that.data.showtab == 0 ? '' : that.data.tabnav.tabitem[that.data.showtab],
        page: that.data.currentPage + 1,
        size: 10
      },
      method: 'GET',
      responseType: 'text',
      success(res) {
        //console.log(res.data);
        if (res.data.code !== 0) {
          that.setData({
            loading: false,
            topTipsType: 'error',
            topTipsMsg: '请求出错，请联系管理员',
          })
          return
        }
        var posts = res.data.data.posts;
        var currentPage = res.data.data.currentPage;
        var totalPage = res.data.data.totalPage;

        that.setData({
          posts: that.data.posts.concat(posts),
          currentPage: currentPage,
          totalPage: totalPage,
          noMoreData: currentPage >= totalPage,
          loading: false,
        })
      },
      fail(reason) {
        console.log(reason)
        that.setData({
          loading: false,
          topTipsType: 'error',
          topTipsMsg: '服务器忙，请稍后再试',
        })
      },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  getPostInfo: function(showtab, page) {
    var that = this //很重要，一定要写
    that.setData({
      showtab: showtab,
    })
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: app.globalData.urlPrefix + '/m/index',
      data: {
        topic: that.data.showtab == 0 ? '' : that.data.tabnav.tabitem[showtab],
        page: page,
        size: 10
      },
      method: 'GET',
      responseType: 'text',
      success(res) {
        //console.log(res.data);
        if (res.data.code !== 0) {
          that.setData({
            topTipsType: 'error',
            topTipsMsg: '请求出错，请联系管理员',
          }, function() {
            wx.hideLoading()
          })
          return
        }
        var posts = res.data.data.posts;
        var currentPage = res.data.data.currentPage;
        var totalPage = res.data.data.totalPage;

        that.setData({ //循环完后，再对list进行赋值
          posts: posts,
          currentPage: currentPage,
          totalPage: totalPage,
          noMoreData: currentPage >= totalPage
        }, function() {
          wx.hideLoading()
        })
      },
      fail(reason) {
        console.log(reason)
        that.setData({
          topTipsType: 'error',
          topTipsMsg: '服务器忙，请稍后再试',
        }, function() {
          wx.hideLoading()
        })
      },
    })
  },

  navToTopic: function(e) {
    var topic = e.currentTarget.dataset.topic
    wx.navigateTo({
      url: '/pages/topic/topic?from=index&topic=' + topic,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  }

  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
})