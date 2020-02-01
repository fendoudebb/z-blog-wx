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
      tabitem: ["全部", "Java", "Android", "PHP", "Linux", "Nginx", "MySQL", "Redis", "PostgreSQL", "面试", "算法"]
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
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
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    if (that.data.noMoreData) {
      return
    }
    that.setData({
      loading: true,
    })

    wx.request({
      url: 'https://www.zhangbj.com/m/index',
      data: {
        topic: that.data.showtab == 0 ? '' : that.data.tabnav.tabitem[that.data.showtab],
        page: that.data.currentPage + 1,
        size: 10
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        // console.log(res.data);
        if (res.data.code !== 200) {
          that.setData({
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
          noMoreData: currentPage >= totalPage
        })
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
      url: 'https://www.zhangbj.com/m/index',
      data: {
        topic: that.data.showtab == 0 ? '' : that.data.tabnav.tabitem[showtab],
        page: page,
        size: 10
      },
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        // console.log(res.data);
        if (res.data.code !== 200) {
          that.setData({
            topTipsType: 'error',
            topTipsMsg: '请求出错，请联系管理员',
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
        })
      },
      fail(reason) {
        console.log(reason)
        that.setData({
          topTipsType: 'error',
          topTipsMsg: '服务器忙，请稍后再试',
        })
      },
      complete() {
        wx.hideLoading()
      }
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