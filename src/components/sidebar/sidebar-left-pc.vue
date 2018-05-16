<template>
  <div class="sidebar-wrap">
    <el-scrollbar :viewStyle="{height: 'calc(100vh - 100px)'}">
      <el-menu 
      :collapse-transition="false" 
      :unique-opened="true" 
      :collapse="$store.state.isExpand" 
      active-text-color="#00a4ff"
      class="menu">
        <!-- 第1层 -->
        <template v-for="sideItem in side">

          <el-menu-item 
            @click.native="$store.dispatch('menuClick', sideItem)" 
            v-if="sideItem._child.length == 0" 
            :key="sideItem.id" 
            :index="sideItem.id+sideItem.name">
            <i class="icon" :class="sideItem.icon || 'el-icon-tickets'"></i>
            <span class="nowrap">{{sideItem.name}}</span>
          </el-menu-item>

          <el-submenu v-else :popper-append-to-body="true" :key="sideItem.id" :index="sideItem.id+sideItem.name">
            <template slot="title">
              <i class="icon" :class="sideItem.icon || 'el-icon-tickets'"></i>
              <span class="nowrap">{{sideItem.name}}</span>
            </template>
            
            <!-- 第2层 -->
            <template v-for="sideItem_2 in sideItem._child">
              <el-menu-item 
                @click.native="$store.dispatch('menuClick', sideItem)" 
                v-if="sideItem_2._child.length == 0" 
                :key="sideItem_2.id" 
                :index="sideItem_2.id+sideItem_2.name">
                <i class="icon" :class="sideItem_2.icon || 'el-icon-tickets'"></i>
                <span class="nowrap">{{sideItem_2.name}}</span>
              </el-menu-item>

              <el-submenu v-else :popper-append-to-body="true" :key="sideItem_2.id" :index="sideItem_2.id+sideItem_2.name">
                <template slot="title">
                  <i class="icon" :class="sideItem_2.icon || 'el-icon-tickets'"></i>
                  <span class="nowrap">{{sideItem_2.name}}</span>
                </template>
                
                <!-- 第3层 -->
                <template v-for="sideItem_3 in sideItem_2._child">
                  <el-menu-item
                    @click.native="$store.dispatch('menuClick', sideItem)"  
                    v-if="sideItem_3._child.length == 0" 
                    :key="sideItem_3.id" 
                    :index="sideItem_3.id+sideItem_3.name">
                    <i class="icon" :class="sideItem_3.icon || 'el-icon-tickets'"></i>
                    <span class="nowrap">{{sideItem_3.name}}</span>
                  </el-menu-item>
                </template>

              </el-submenu>
            </template>

          </el-submenu>

        </template>
        

      </el-menu>
    </el-scrollbar>
    <div class="thump">
      <div class="thump-title" v-show="!$store.state.isExpand">
        create by 向日葵
      </div>
      <i
        @click="$store.commit('setExpand')"
        :style="{
          transform: $store.state.isExpand? 'rotate(180deg)': 'rotate(0deg)',
          width: $store.state.isExpand? '100%': '30px',
        }" 
        class="el-icon-back">
      </i>
    </div>
  </div>
</template>

<script>
import './sidebar.css'
export default {
  data() {
    return {
      side: []
    };
  },
  computed: {},
  watch: {
    //获取菜单
    "$store.state.menu"() {
      this.side = this.utils.cleanData(this.$store.state.menu);
    }
  },
  methods: {}
};
</script>

<style lang="less" scoped>
@activeColor: #00a4ff;
.sidebar-wrap {
  height: 100%;
  position: relative;
  border-right: 1px solid #ddd;
  .menu{
    height: 100%;
    border-right: none;
  }
  .thump{
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 100%;
    border-top: 1px solid #ddd;
    height: 50px;
    line-height: 50px;
    background: transparent;
    color: #b2b2b2;
    .el-icon-back{
      font-size: 18px;
      cursor: pointer;
      position: absolute;
      text-align: center;
      height: 50px;
      line-height: 50px;
      top: 0px;
      right: 0px;
      &:hover{
        color: @activeColor;
      }
    }
    .thump-title{
      height: 50px;
      width: 100%;
      line-height: 50px;
      text-align: left;
      padding: 0px 34px 0px 14px;
      font-size: 14px;
    }
  }
}
.icon{
  width: 20px;
  margin-right: 2px;
  font-size: 16px;
}
</style>
