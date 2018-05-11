<template>
  <div class="top clearfix">

    <div class="logo">
      <img :src="require('./logo.svg')" alt="logo">
      <span>向日癸XXX</span>
    </div>

    <div class="nav clearfix">
      <img v-show="!showMenu" :src="require('./user.svg')" alt="user">
      <span @click="showMenu = !showMenu" class="bars" :class="{active: showMenu}">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </div>
    
    <transition name="fade">
      <div v-scroll class="menu" v-show="showMenu">
        <!-- 1级 -->
        <div v-for="side_1 in side" :key="side_1.id" class="menu-item level_1">
          <span @click="menuTextClick(side_1, 1)" class="menu-text nowrap">
            {{side_1.name}}
            <img 
              :src="require('./arrow-bottom.svg')"
              v-if="side_1._child.length != 0" 
              class="arrow-icon" 
              :class="{
                'arrowRotate': showLevel_2_id == side_1.id
              }"
              alt="arrow" />
          </span>

          <!-- 2级 -->
          <el-collapse-transition>
            <div v-if="side_1._child.length != 0 && showLevel_2_id == side_1.id">
              <div v-for="side_2 in side_1._child" :key="side_2.id" class="menu-item level_2">
                <span @click="menuTextClick(side_2, 2)" class="menu-text nowrap">
                  {{side_2.name}}
                  <img 
                    :src="require('./arrow-bottom.svg')"
                    v-if="side_2._child.length != 0" 
                    class="arrow-icon" 
                    :class="{
                      'arrowRotate': showLevel_3_id == side_2.id
                    }"
                    alt="arrow" />
                </span>

                <!-- 3级 -->
                <el-collapse-transition>
                  <div v-if="side_2._child.length != 0 && showLevel_3_id == side_2.id">
                    <div v-for="side_3 in side_2._child" :key="side_3.id" class="menu-item level_3">
                      <span @click="menuTextClick(side_3, 3)" class="menu-text nowrap">
                        {{side_3.name}}
                      </span>
                    </div>
                  </div>
                </el-collapse-transition>
                
              </div>
            </div>
          </el-collapse-transition>
          
        </div>
      </div>
    </transition>

  </div>
</template>

<script>

export default {
  data(){
    return {
      side: [],
      //是否显示menu菜单
      showMenu: false,
      //显示哪个2级
      showLevel_2_id: '',
      //显示哪个3级
      showLevel_3_id: '',

    }
  },
  created(){
    
  },
  watch: {
    //获取菜单
    '$store.state.menu'(){
      this.side = this.utils.cleanData(this.$store.state.menu);
    },

  },
  methods: {
    //点击菜单项
    menuTextClick(item, levelNumber){
      if(levelNumber == 3 || item._child.length == 0){
        //直接跳转，菜单全部收起
        this.$store.dispatch('menuClick', item);
        this.showMenu = false;
        return ;
      };
      //展开/收起-2级子级
      if(levelNumber == 1){
        if(this.showLevel_2_id == ''){
          this.showLevel_2_id = item.id;
        }else if(this.showLevel_2_id == item.id){
          this.showLevel_2_id = '';
        }else{
          this.showLevel_2_id = item.id;
        }
        this.showLevel_3_id = '';
      };
      if(levelNumber == 2){
        if(this.showLevel_3_id == ''){
          this.showLevel_3_id = item.id;
        }else if(this.showLevel_3_id == item.id){
          this.showLevel_3_id = '';
        }else{
          this.showLevel_3_id = item.id;
        }
      }
    },

  },
}
</script>

<style lang="less" scoped>
@height: 50px;
@bgColor: #333;
@activeColor: #00a4ff;
@menuTextHeight: 44px;

.top{
  position: relative;
  height: @height;
  width: 100%;
  background-color: @bgColor;
  padding-left: 14px;
  padding-right: 14px;
  .logo{
    height: @height;
    float: left;
    width: 200px;
    height: 100%;
    display: flex;
    align-items: center;
    color: #fff;
  }
  .nav{
    height: @height;
    float: right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 120px;
    img{
      height: 32px;
      margin-right: 16px;
    }
    .bars{
      width: 24px;
      height: 24px;
      background: transparent;
      cursor: pointer;
      display: flex;
      justify-content: space-around;
      flex-direction: column;

      span{
        width: 100%;
        height: 3px;
        background: #fff;
        border-radius: 3px;
        transition: all .3s;
        &:nth-of-type(1){
          transform-origin: left top;
        }
        &:nth-of-type(3){
          transform-origin: left bottom;
        }
      }

      &.active{
        span:nth-of-type(1){
          transform: rotate(45deg);
        }
        span:nth-of-type(2){
          opacity: 0;
        }
        span:nth-of-type(3){
          transform: rotate(-45deg);
        }
      }

    }
  }

  .menu{
    position: absolute;
    top: @height;    
    z-index: 999;
    left: 0px;
    width: 100%;
    height: calc(~"100vh - @{height}");
    background: #16171a;
    border-top: 1px solid #2b2b2b;

    .menu-item{
      position: relative;
    }
    .menu-text{
      display: block;
      color: #fff;
      height: @menuTextHeight;
      line-height: @menuTextHeight;
      padding-left: 12px;
      padding-right: 36px;
      border-top: 1px solid #2b2b2b;
      position: relative;
      .arrow-icon{
        position: absolute;
        right: 20px;
        top: 15px;
        height: 14px;
        width: 20px;
        color: #fff;
        transition: transform .4s;
        &.arrowRotate{
          transform: rotate(180deg);
        }
      }
    }

    .level_1{
      background: #16171a;
      .menu-text{
        text-indent: 0px;
      }
    }
    .level_2{
      background: #202124;
      .menu-text{
        text-indent: 18px;
      }
    }
    .level_3{
      background: #27282b;
      .menu-text{
        text-indent: 36px;
      }
    }

  }
  
}

.fade-enter-active,
.fade-leave-active {
  transition: all .3s ease;
}
.fade-enter, .fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

</style>
