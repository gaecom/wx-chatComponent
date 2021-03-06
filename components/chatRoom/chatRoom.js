// components/chatRoom/chatRoom.js
const myaudio=wx.createInnerAudioContext();
const recorderManager=wx.getRecorderManager();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    wxsUrl: {
      type: String, //websocket地址
      value: ''
    },
    parameter: {
      type: Object, //需要传的参数
      value: {}
    },
    header: {
      type: Object, //需要传的header参数
      value: {}
    },
    protocols: {
      type: Array, //子协议数组
      value: [],
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [], //会话内容
    inputMsg: '',
    scrollTop: '',
    windowHeight: '',
    inputHeight: '',
    voiceStatus: false, //录音框显示状态
    voiceIng:false,//是否录音中
    addStatus:false,//附件框显示状态
    ps:false,//摄像头状态
  },

  ready: function (options) {
    console.log(options)
    console.log('This is a plugin page!');
    this.setData({
      windowHeight: wx.getSystemInfoSync().windowHeight
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //input框输入
    input: function (e) {
      this.setData({
        inputMsg: e.detail.value
      })
    },

    //发送按钮点击
    sendMsg: function () {
      // let  scrollHeight = wx.getSystemInfoSync().windowHeight;
      if (this.data.inputMsg != '') {
        var v = {
          content: this.data.inputMsg
        }
        this.data.list.push(v);
        this.setData({
          inputMsg: '',
          list: this.data.list,
          scrollTop: this.data.list.length * 1000
        })
      } else {

      }
    },

    inputFocus(e) {
      // console.log('键盘弹起')
      var inputHeight = 0
      if (e.detail.height) {
        inputHeight = e.detail.height;
        this.setData({
          inputHeight: inputHeight,
          addStatus:false
        })
      }
    },
    inputBlur() {
      // console.log('键盘收起');
      this.setData({
        inputHeight: 0
      })
    },

    //录音按钮点击
    voiceClick: function () {
      this.setData({
        voiceStatus: !this.data.voiceStatus,
        inputHeight: 0,
        addStatus: false,
      })
    },

    //加号按钮点击
    addClick: function () {
      this.setData({
        addStatus: !this.data.addStatus,
        inputHeight: 0
      });
      wx.hideKeyboard();
    },

    //开始录音
    record: function (e) {
      console.log("开始了");
      var that = this;

      recorderManager.start({
        audioSource:"auto",
        format:"mp3"
      });
      recorderManager.onStart(function(){
        that.setData({
          voiceIng:true
        })
      })
    },
    //结束录音
    recordEnd: function (e) {
      console.log("结束了");
      var that = this;
      recorderManager.stop();
      recorderManager.onStop(function (res) {
        that.setData({
          voiceIng:false
        })
        var v = {
          voiceMsg: res.tempFilePath,
          duration:res.duration,
          aboutTime:Math.round(res.duration/1000)
        };
        that.data.list.push(v);
        that.setData({
          list: that.data.list,
          scrollTop: that.data.list.length * 1000,
        })
      });
    },

    //列表内容点击
    msgLick: function (e) {
      // console.log(e);
      var that=this;
      var target=e.currentTarget.dataset;
      if (target.voicemsg) {
        myaudio.src=target.voicemsg;
        myaudio.play();
        myaudio.onPlay(function(){
          that.data.list[target.index].start=true;
          that.setData({
            list:that.data.list
          })
        });
        myaudio.onEnded(function(){
          that.data.list[target.index].start=false;
          that.setData({
            list:that.data.list
          })
        })
      }
    },

    //相册点击
    xcClick:function(){
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          // tempFilePath可以作为img标签的src属性显示图片
          const tempFilePaths = res.tempFilePaths
        }
      })
    },

    //拍摄点击
    psClick:function(){
      console.log(111)
      this.setData({
        ps:true
      })
      // const ctx = wx.createCameraContext()
      // ctx.startRecord({
      //   timeoutCallback:function(res){
      //     console.log(res)
      //   },
      //   success: (res) => {
      //     console.log(res)
      //   }
      // })
    },
  }
})