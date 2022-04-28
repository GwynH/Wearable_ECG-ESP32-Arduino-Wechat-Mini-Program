const app = getApp()
var width = 0;
var height = 0;

var hLineNum = 0;
var vLineNum = 0;
var x_start = 0;
var grid_width = 5;
var timeId = null;
var _receiveText = 0;
var __receiveText = 0;
var ___receiveText = 0;
var ____receiveText = 0;
var arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var arrCount = 0;
// var arr = [122, 122, 122, 122, -122, -122, -122, -122, -122, -122, -122, -122, -122, -122, 122, 122, 122, 123, 125, 127, 130, 133, 135, 137, 138, 139, 140, 140, 139, 138, 136, 134, 130, 127, 125, 124, 123, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 121, 119, 116, 113, 111, 132, 151, 171, 190, 210, 229, 210, 190, 171, 151, 132, 112, 114, 117, 120, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 123, 124, 124, 126, 128, 131, 133, 134, 136, 140, 143, 144, 146, 149, 150, 152, 153, 153, 154, 155, 156, 157, 156, 155, 153, 153, 152, 150, 149, 146, 145, 142, 138, 135, 133, 129, 127, 124, 123, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122, 122]

Page({
  /**
   * 页面的初始数据
   */
  data: {
    inputText: 'mmmmmmmmnnnnnnnnll12345',
    receiveText: '',
    name: '',
    connectedDeviceId: '',
    services: {},
    characteristics: {},
    connected: true,

    showing: false,
    ULP: false,
    ULP_LP: "red",
    ECG: null,
    HR: 0,
  },
  bindInput: function (e) {
    this.setData({
      inputText: e.detail.value
    })
    console.log(e.detail.value)
  },
  Send: function () {
    var that = this
    if (that.data.connected) {
      var buffer = new ArrayBuffer(that.data.inputText.length)
      var dataView = new Uint8Array(buffer)
      for (var i = 0; i < that.data.inputText.length; i++) {
        dataView[i] = that.data.inputText.charCodeAt(i)
      }

      wx.writeBLECharacteristicValue({
        deviceId: that.data.connectedDeviceId,
        serviceId: that.data.services[0].uuid,
        characteristicId: that.data.characteristics[1].uuid,
        value: buffer,
        success: function (res) {
          console.log('发送指令成功:' + res.errMsg)
          wx.showModal({
            title: '数据发送成功',
            content: ''
          })
        },
        fail: function (res) {
          // fail
          //console.log(that.data.services)
          console.log('message发送失败:' + res.errMsg)
          wx.showToast({
            title: '数据发送失败，请稍后重试',
            icon: 'none'
          })
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '蓝牙已断开',
        showCancel: false,
        success: function (res) {
          that.setData({
            searching: false
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    const mtu = 32;
    console.log(options)
    that.setData({
      name: options.name,
      connectedDeviceId: options.connectedDeviceId
    })
    clearTimeout(timeId)
    arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    // MTUSET
    wx.setBLEMTU({
        deviceId: that.data.connectedDeviceId,
        mtu,
        success: (res) => {
          console.log("setBLEMTU success>>", res)
        },
        fail: (res) => {
          console.log("setBLEMTU fail>>", res)
        }
      }),
      wx.getBLEDeviceServices({
        deviceId: that.data.connectedDeviceId,
        success: function (res) {
          console.log(res.services)
          that.setData({
            services: res.services
          })
          wx.getBLEDeviceCharacteristics({
            deviceId: options.connectedDeviceId,
            serviceId: res.services[0].uuid,
            success: function (res) {
              console.log(res.characteristics)
              that.setData({
                characteristics: res.characteristics
              })
              wx.notifyBLECharacteristicValueChange({
                state: true,
                deviceId: options.connectedDeviceId,
                serviceId: that.data.services[0].uuid,
                characteristicId: that.data.characteristics[0].uuid,
                success: function (res) {
                  console.log('启用notify成功：' + that.data.characteristics[0].uuid)
                  console.log(JSON.stringify(res));
                  that.onBLECharacteristicValueChange();
                },
                fail: function () {
                  console.log('开启notify失败' + that.characteristicId)
                }
              })
            }
          })
        }
      })
    wx.onBLEConnectionStateChange(function (res) {
      console.log(res.connected)
      that.setData({
        connected: res.connected,
        ULP: res.connected,
        ULP_LP: res.connected ? "chartreuse" : "red",
      })
    })

    // // 背景
    // const query = wx.createSelectorQuery()
    // query.select('#ECGbackground')
    //   .fields({
    //     node: true,
    //     size: true
    //   })
    //   .exec((res) => {
    //     const canvas = res[0].node
    //     const BGctx = canvas.getContext('2d')
    //     const c_interval = 20

    //     const dpr = wx.getSystemInfoSync().pixelRatio
    //     canvas.width = res[0].width * dpr
    //     canvas.height = res[0].height * dpr
    //     BGctx.scale(dpr, dpr)

    //     BGctx.beginPath()
    //     BGctx.clearRect(0, 0, canvas.width, canvas.height)
    //     BGctx.strokeStyle = 'rgba(129, 200, 129, 0.2)'
    //     BGctx.lineWidth = 2
    //     BGctx.setLineDash([19, 2], 5)
    //     for (var i = 0; i < canvas.height / c_interval - 1; i++) {
    //       BGctx.strokeRect(0, 0, 360, i * c_interval)
    //       BGctx.strokeRect(0, 0, i * c_interval, 200)
    //     }
    //     BGctx.stroke()
    //     // 清边边
    //     BGctx.clearRect(0, 0, 360, 1)
    //     BGctx.clearRect(0, 199, 360, 200)
    //     BGctx.clearRect(0, 0, 1, 200)
    //     BGctx.clearRect(359, 0, 360, 200)
    //     console.log("Background of ECG Over.")
    //   })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("ECG Ready.")
  },

  onStart(res) {
    if (!this.data.showing) {
      console.log("ECG Start.")
      this.setData({
        showing: true
      })
      this.onRun()
    } else {
      console.log("ECG Stop.")
      this.setData({
        showing: false
      })
      clearTimeout(timeId)
    }
  },

  onRun() {
    // 通过 SelectorQuery 获取 Canvas 节点
    const query = wx.createSelectorQuery()
    query.select('#ECGshow')
      .fields({
        node: true,
        size: true
      })
      .exec((res) => {

        width = res[0].width
        height = res[0].height
        const canvas = res[0].node
        const lineCtx = canvas.getContext('2d')

        console.log("Running Now.")

        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        lineCtx.scale(dpr, dpr)

        class WaveView {
          currentX = 0;
          currentY = 0;
          lastX = 0;
          lastY = 0;
          // 每次画几个点
          step = 10;
          // Y值最大值
          yMax = 400;
          // 每个波形的高度
          itemHeight = 125;
          // 橡皮檫宽度
          clearGap = 15;
          y_offset = 0;
          // 队列
          queue = [];
          strokeStyle = "#0f0";

          /**
           * @param frameSize 1秒多少个点
           * @param yMax
           * @param y_offset y偏移
           * @param step 每次画几个点
           * @param speedRatio 扫纸速度，默认 25mm/s (1秒25个小格子 每个小格子0.04s)。 0.5表示扫纸速度为 12.5mm/s。2表示扫纸速度为 50mm/s。
           * @param strokeStyle 线的样式
           */
          constructor(frameSize, yMax, y_offset, step, speedRatio, strokeStyle) {
            this.frameSize = frameSize;
            this.yMax = yMax;
            this.lastY = this.itemHeight / 2;
            this.y_offset = y_offset;
            this.step = step;
            this.speedRatio = speedRatio;
            this.strokeStyle = strokeStyle;
            this.drawInterval = Math.floor((1 / this.frameSize) * 750 * this.step); // 绘制时间间隔
          }

          draw = () => {
            lineCtx.beginPath();
            lineCtx.strokeStyle = this.strokeStyle;
            if (this.lastX === 0) {
              lineCtx.clearRect(x_start - 5, this.y_offset - 70, this.clearGap, this.itemHeight + 70);
            } else {
              lineCtx.clearRect(x_start + this.lastX, this.y_offset - 70, this.clearGap, this.itemHeight + 70);
            }

            for (let i = 0; i < this.step; i++) {
              if (this.queue.length === 0) {
                this.currentY = this.itemHeight / 2;
              } else {
                this.currentY = (-1.0 * this.queue.shift()) / this.yMax * this.itemHeight + this.itemHeight;
              }

              if (this.currentY > this.itemHeight) {
                this.currentY = this.itemHeight;
              }

              lineCtx.moveTo(x_start + this.lastX, this.y_offset + this.lastY - 13);
              lineCtx.lineTo(x_start + this.currentX, this.y_offset + this.currentY - 13);

              this.lastX = this.currentX;
              this.lastY = this.currentY;

              this.currentX += (grid_width * 25 * this.speedRatio) / this.frameSize;
              if (x_start + this.currentX >= width) {
                this.currentX = 0;
                this.lastX = 0;
              }
            }

            lineCtx.lineWidth = 2;
            lineCtx.stroke();
          }

          loop = () => {
            this.draw();
            timeId = setTimeout(this.loop, this.drawInterval)

            this.addData(arr)
            console.log("进来了")
          }
          addData = (arr) => {
            for (let i = 0; i < arr.length; i++) {
              this.queue.push(arr[i]);
            }
          }
        }


        let ecgWave = new WaveView(250, 250, 0, 10, 1, '#00ff00');

        let respWave = new WaveView(200, 250, 50, 10, 1.2, '#00ff00');

        let spo2Wave = new WaveView(100, 250, 200, 10, 1, '#00F5FF');


        // ecgWave.loop();

        respWave.loop();

        // spo2Wave.loop();
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},

  // 接收
  onBLECharacteristicValueChange: function () {
    var that = this;
    wx.onBLECharacteristicValueChange(function (res) {
      var receiveText = app.buf2string(res.value);
      if (receiveText != ____receiveText) {
        console.log('监听低功耗蓝牙设备的特征值变化事件成功');
        _receiveText = receiveText;
        __receiveText = _receiveText;
        ___receiveText = __receiveText;
        ____receiveText = ___receiveText;

        var _HR = that.data.HR;
        var HR = Math.abs(receiveText % 1000);
        var ECG = Math.floor(receiveText / (HR > 100 ? 10000 : 1000)) - 1;
        var ULP = (HR > 5) ? true : false;
        console.log(app.buf2string(res.value));
        console.log(HR);
        console.log(ECG);
        ECG = (HR > 10) ? ECG : null
        HR = (HR > 10) ? HR : _HR;

        if ((ECG != null) & ULP) {
          for (var i = 0; i < 2; i++) {
            if (arrCount & ((1 - ECG) / 200) - arr[arrCount - 1] > 80)
              arr[arrCount] = ((1 - ECG) / 200 + arr[arrCount - 1]*2) / 3;
            else
              arr[arrCount] = (1 - ECG) / 200;
            arrCount = ((arrCount > 250) ? 0 : arrCount + 1);
          }
        }
        that.setData({
          receiveText: receiveText,
          HR: HR,
          ECG: ECG,
          ULP: ULP,
          ULP_LP: ULP ? "chartreuse" : "red",
        })
      }
    })
  },
})