<template>
<div class="count-down-wrapper">
  <div class="count-down" v-if="BGColor">
    <span :style="{backgroundColor: BGColor, color: color}">{{date.hour}}</span>:
    <span :style="{backgroundColor: BGColor, color: color}">{{date.minutes}}</span>:
    <span :style="{backgroundColor: BGColor, color: color}">{{date.seconds}}</span>.
    <span :style="{backgroundColor: BGColor, color: color}">{{millisecond}}</span>
  </div>
  <p v-if="!BGColor" :style="{color: color}">{{date.hour}}:{{date.minutes}}:{{date.seconds}}.{{millisecond}}</p>
</div>
</template>

<script>
  export default {
    props: {
      time: {
        type: [Number, String],
        default: 0
      },
      BGColor: {
        type: String,
        default: ''
      },
      color: {
        type: String,
        default: '#333'
      }
    },
    data () {
      return {
        date: {
          hour: '00',
          minutes: '00',
          seconds: '00'
        },
        millisecond: 0
      }
    },
    computed: {
    },
    created () {
    },
    mounted () {
      // console.log(this.time)
    },
    methods: {
      computeTime(time) {
        // let msec = time * 1000
        let hour = Math.floor(time / 60 / 60)
        let minutes = Math.floor(time / 60 % 60)
        let seconds = Math.floor(time % 60)
        this.date = {
          hour: hour >= 10 ? hour : '0' + hour,
          minutes: minutes >= 10 ? minutes : '0' + minutes,
          seconds: seconds >= 10 ? seconds : '0' + seconds
        }
        // console.log(`${date.hour}:${date.minutes}:${date.seconds}`)
      },
      startCounntDown () {
        let time = this.time | 0
        if (time > 0 && !this.first) {
          this.first = true
          this.computeTime(time)
          this.millisecondCount()
          this.timer = setInterval(() => {
            if (time > 0) {
              --time
              this.computeTime(time)
            } else {
              this.restore()()
            }
          }, 1000)
        } else {
          this.restore()
          this.$emit('end')
        }
      },
      millisecondCount () {
        this.msecTimer = setInterval(() => {
          if (this.millisecond <= 0) {
            this.millisecond = 9
          } else {
            --this.millisecond
          }
        }, 100)
      },
      restore() {
        if (this.timer || this.msecTimer) {
          clearInterval(this.timer)
          clearInterval(this.msecTimer)
          this.timer = null
          this.msecTimer = null
        }
        this.first = false
        this.millisecond = 0
        this.date = {
          hour: '00',
          minutes: '00',
          seconds: '00'
        }
      }
    },
    beforeDestroy () {
      this.restore()
    },
    watch: {
      time: {
        handler (val) {this.restore()
          if (val) {
            this.startCounntDown()
          }
        },
        immediate: true
      }
    }
  }
</script>

<style scoped lang="less">
.count-down-wrapper {
  display: inline-block;
  .count-down {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    text-align: center;
    span {
      width: 44px;
      line-height: 36px;
      display: inline-block;
      color: #333;
      font-size: 26px;
      background: #fff;
      border-radius: 5px;
      margin: 0 10px;
    }
  }
  p {
    font-size: 26px;
  }
}

</style>
