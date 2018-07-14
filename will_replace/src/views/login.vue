<template>
    <div class="login">
        <div class="wrap">
            <div class="login-wrap">
                <img src="../assets/logo.png" alt="">
                <input style="display:none" />
                <div 
                    class="mdui-textfield mdui-textfield-floating-label">
                    <label class="mdui-textfield-label">账号</label>
                    <input 
                        class="mdui-textfield-input" 
                        autocomplete="off" 
                        type="text" 
                        v-model="user" />
                </div>
                <div 
                    class="mdui-textfield mdui-textfield-floating-label">
                    <label class="mdui-textfield-label">密码</label>
                    <input 
                        class="mdui-textfield-input" 
                        autocomplete="off" 
                        type="password" 
                        v-model="pass" />
                </div>
                <el-button 
                    @click="loginFn" 
                    :loading="loginLoadng" 
                    class="mdui-ripple login-btn mdui-shadow-3 mdui-hoverable">登录
                </el-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'login',
    data(){
        return {
            user: '',
            pass: '',
            loginLoadng: false,
        }
    },
    mounted(){
        document.title = process.env.VUE_APP_NAME + ' - ' + '登录';
    },
    methods: {
        loginFn(){
            this.loginLoadng = true;
            this.$router.push('/')
        },
        
    },
}
</script>

<style lang="less" scoped>
.login{
  position: fixed;
  left: 0px;
  top: 0px;
  z-index: 2000;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: #26a69a;
  .wrap{
    height: 100%;
    min-height: 500px;
    display: flex;
    justify-content: center;
    align-items: center;
    .login-wrap{
        width: 340px;
        height: 380px;
        padding: 15px;
        background: #fff;
        border-radius: 3px;
        position: relative;
        img{
            display: block;
            margin: 0 auto;
            width: 80px;
        }
        .login-btn{
            background: #26a69a;
            font-size: 14px;
            color: #fff;
            position: absolute;
            bottom: 20px;
            left: 20px;
            width: calc(100% - 40px);
            border: none;
        }
    }
  }
}
</style>
