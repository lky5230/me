<template>
  <div class="main">

    <!-- pc端-顶部 -->
    <div class="pc-top">
      <header-pc></header-pc>
    </div>

    <!-- 手机端-顶部 -->
    <div class="phone-top">
      <header-phone></header-phone>
    </div>
    
    <div class="clearfix" style="height: calc(100vh - 52px);">

      <!-- 1、固定型-pc侧边栏 -->
      <div 
        v-if="$store.state.sidebarType == 'left'" 
        class="left-sidebar fl"
        :style="{
          'width': $store.state.isExpand? '64px': '260px',
        }">
        <sidebar-left-pc />
      </div>

      <!-- 页面 -->
      <div 
        class="right-page fr" 
        :class="{
          'leftType': $store.state.sidebarType == 'left',
          'collapse': $store.state.isExpand
        }">
        <router-view />
      </div>

    </div>

    <!-- 2、悬浮型-pc侧边栏 -->
    <div v-if="$store.state.sidebarType == 'hover'" class="pc-sidebar"> 
      <sidebar-hover-pc />
    </div>
      
  </div>
</template>

<script>
import headerPc from "@/components/header/header-pc.vue";
import headerPhone from "@/components/header/header-phone.vue";
import sidebarHoverPc from "@/components/sidebar/sidebar-hover-pc.vue";
import sidebarLeftPc from "@/components/sidebar/sidebar-left-pc.vue";

export default {
  components: { headerPc, headerPhone, sidebarHoverPc, sidebarLeftPc },
  created(){
    //获取菜单
    this.getMenu();
    
  },
  methods: {
    getMenu(){
      this.$http.get("/menu.json").then(res => {
        let data = res.data.data.result;
        this.$store.commit('getMenu', data);
      }).catch(err=>{

      });
    },

  },
};
</script>

<style lang="less" scoped>
@color: red;
@w1: 260px;
@w2: 64px;
.main{
  height: 100vh;
}
.left-sidebar{
  height: 100%;
}
.right-page{
  // 重要！
  overflow: auto; 

  width: 100%;
  height: 100%; 
  padding: 10px;
  //为了让less解析正确！
  &.leftType{
    width : calc(~"100% - @{w1}");
  }
  &.leftType.collapse{
    width : calc(~"100% - @{w2}");
  }
}

// phone
@media screen and (max-width: 820px) {
    .pc-sidebar,
    .pc-top {
      display: none;
    }
    .phone-top{
      display: block;
    }
    .left-sidebar{
      display: none;
    }
    .right-page{
      &.leftType{
        width: calc(100%);
      }
      &.leftType.collapse{
        width: calc(100%);
      }
      width: calc(100%);
    }
}
//pc
@media screen and (min-width: 820px) {
    .pc-sidebar,
    .pc-top{
      display: block;
    }
    .phone-top{
      display: none;
    }
}
</style>
