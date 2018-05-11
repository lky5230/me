<template>
<div ref="loginWrap" class="login-wrap">
    <div class="login">

        <div class="logo">
            <img class="logo-img2" :src="require('./logo2.png')" alt="logo">
            <transition appear name="logo">
                <img class="logo-img" :src="require('./logo.png')" alt="logo">
            </transition>
        </div>

        <div class="loginForm">
            <div class="inp-warp">
                <img :src="require('./user.svg')" alt="user">
                <input :disabled="loading" :class="{disabled: loading}" v-model="user" placeholder="用户名" type="text" />
            </div>
            <div class="inp-warp">
                <img :src="require('./pass.svg')" alt="pass">
                <input :disabled="loading" :class="{disabled: loading}" v-model="pass" placeholder="密码" type="password" />
            </div>
            <div class="zinan"><span>新手指南</span></div>
            <button :class="{'loading': loading}" @click="loginFn">
                <div v-show="loading" class="loading-dot">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                </div>
                <transition name="login">
                    <span v-show="!loading">Login</span>
                </transition>
            </button>
        </div>

        <div class="title">
            Used For <br /> Mountain Lion
        </div>

    </div>

</div>
</template>

<script>

export default {
  components: { },
  name: 'login',
  data() {
    return {
      //用户名、密码
      user: '',
      pass: '',
      //登录状态
      loading: false,
      
    };
  },
  methods: {
    docMove(e){
        
    },
    dockeydown(e){
        if(e.keyCode == 13 && this.loading == false){
            this.loginFn();
        };
    },
    loginFn(){
        if(this.loading == true) return ;
        this.loading = true;
        // 执行登录
        setTimeout(()=>{
            this.loading = false
        }, 3000)
    },

  },
  mounted() {
      document.addEventListener('mousemove', this.docMove)
      document.addEventListener('keydown', this.dockeydown)
  },
  beforeDestroy(){
    document.removeEventListener('mousemove', this.docMove)
    document.removeEventListener('keydown', this.dockeydown)
  }
};
</script>

<style lang="less" scoped>
@height: 40px;
@borderColor: #cecece;
.login-wrap {
  min-height: 570px;
  height: 100vh;
  background: #333;
  background-image: url(./bg1.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0px 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  .inp-warp{
      position: relative;
      img{
          position: absolute;
          height: 20px;
          top: 10px;
          left: 10px;
      }
  }
  .login {
    width: 90%;
    max-width: 376px;
    position: relative;
    top: -40px;
    .loginForm {
      padding: 30px;
      background: #fff;
      border-radius: 2px;
      border: 2px solid @borderColor;
      position: relative;
      input,
      button {
        display: block;
        width: 100%;
        height: @height;
        outline: none;
        border-radius: 2px;
        background: #f6f6f6;
        border: 2px solid @borderColor;
        color: #a8a8a8;
        font-size: 15px;
        text-indent: 40px;
        margin-top: 20px;
      }
      input.disabled{
          color: #b0b0b0 !important; 
      }
      button {
        text-indent: 0px;
        text-align: center;
        background: #00a4ff;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        border: none;
        color: #fff;
        .loading-dot{
            position: absolute;
            left: 0px;
            top: 0px;
            width: 100%;
            height: @height;
            overflow: hidden;
            i{
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: #fff;
                position: absolute;
                left: -10px;
                top: 50%;
                transform: translateY(-50%);
                animation: dot 2.2s cubic-bezier(0.030, 0.615, 0.995, 0.415) both infinite;
                &:nth-of-type(1){
                    animation-delay: 0s;
                }
                &:nth-of-type(2){
                    animation-delay: 0.12s;
                }
                &:nth-of-type(3){
                    animation-delay: 0.24s;
                }
                &:nth-of-type(4){
                    animation-delay: 0.36s;
                }
            }
        }
        &.loading{
            background: #58c5ff;
            cursor: default;
        }
        &:not(.loading):hover {
          background: #58c5ff;
        }
      }
      &:after {
        position: absolute;
        content: " ";
        width: 0;
        height: 0;
        border-width: 10px;
        border-style: solid;
        left: 50%;
        top: -21px;
        transform: translateX(-50%);
        border-color: transparent transparent @borderColor
          transparent;
      }
      .zinan {
        margin-top: 20px;
        span{
            color: #00a4ff;
            text-decoration: underline;
            font-size: 12px;
            cursor: pointer;
        }
      }
    }
    .title {
      padding: 20px;
      color: #fff;
      font-size: 20px;
      line-height: 1.5;
      text-align: center;
    }
    .logo{
        margin-bottom: 10px;
        width: 100%;
        position: relative;
        animation: logoW 9s 4s infinite alternate forwards;
        .logo-img{
            display: block;
            margin: 0 auto;
            height: 40px;
        }
        .logo-img2{
            position: absolute;
            height: 20px;
            left: calc(~"100% + 60px");
            top: -300px;
            opacity: 0;
            animation: logo2 1.2s .6s ease-out forwards;
        }
    }
  }
  .bg1 {
    width: 120%;
    transform: translateX(-200px) translateY(-200px);
    position: absolute;
    transition: all 0s;
  }
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-transition-delay: 99999s;
  -webkit-transition: color 99999s ease-out, background-color 99999s ease-out;
}
// btn登录loading
.login-enter-active,
.login-leave-active {
  transition: all .5s ease;
}
.login-enter, .login-leave-to {
  opacity: 0;
  font-size: 0px;
}
// logo图标
.logo-enter-active {
  transition: all 1s ease-in-out;
}
.logo-enter {
  transform: translateY(-10px);
  opacity: 0;
}
@keyframes logo2 {
    10%{
        opacity: 1;
    }
    100%{
        left: calc(~"50% - 30px");
        opacity: 1;
        transform: rotate(720deg);
        top: -16px;
    }
}
@keyframes dot {
    0%, 10%{
        left: -6px;
    }
    90%, 100%{
        left: calc(~"100% + 6px");
    }
}
@keyframes logoW {
    0%, 40%{
        transform: rotateY(0deg);
    }
    60%, 100%{
        transform: rotateY(180deg);
    }
}

</style>


