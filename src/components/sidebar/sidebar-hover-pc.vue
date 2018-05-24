<template>
  <div 
    @mouseover.stop="thumpOver" 
    @mouseout.stop="thumpOut" 
    class="sidebar-thump">

    <i style="font-size: 20px;" class="fa fa-bars menu-bars"></i>
    <span>&nbsp;菜单</span>

    <div class="sidebar-wrap">

      <!-- 1级 -->
      <div
        class="sidebar_0" 
        :style="{
          left: level_0_left + 'px'
        }"
        @mouseover.stop="sideOut(0); inSide = true;">
        <div v-scroll class="side_content" style="height: 100%;">
          <div 
            class="sidebar-item" 
            v-for="sideLevel_0 in this.side"
            :key="'level-0-'+sideLevel_0.id"
            @mouseover.stop="sideOver(0, sideLevel_0)"
            :class="{
              hold: sideIndex.id_0 == sideLevel_0.id,
              pointer: sideLevel_0._child.length == 0,
            }">
            <span @click="go(sideLevel_0)">
              {{sideLevel_0.name}}
              <i v-if="sideLevel_0._child.length != 0" class="fa fa-chevron-right icon"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- 2级 -->
      <div
        class="sidebar_1" 
        :style="{
          left: level_1_left + 'px'
        }"
        @mouseover.stop="sideOut(1); inSide = true;">
        <div class="sideTitle">{{sideName[0]}}</div>
        <div v-scroll class="side_content">
          <div 
            class="sidebar-item" 
            v-for="sideLevel_1 in levelComputed_2" 
            @mouseover.stop="sideOver(1, sideLevel_1)"
            :key="'level-1-'+sideLevel_1.id"
            :class="{
              hold: sideIndex.id_1 == sideLevel_1.id,
              pointer: sideLevel_1._child.length == 0,
            }">
            <span @click="go(sideLevel_1)">
              {{sideLevel_1.name}}
              <i v-if="sideLevel_1._child.length != 0" class="fa fa-chevron-right icon"></i>
            </span>
          </div>
        </div>
      </div>

      <!-- 3级 -->
      <div 
        v-scroll 
        class="sidebar_2" 
        :style="{
          left: level_2_left + 'px'
        }"
        @mouseover.stop="sideOut(2); inSide = true;">
        <div class="sideTitle">{{sideName[1]}}</div>
        <div v-scroll class="side_content">
          <div 
            class="sidebar-item" 
            v-for="sideLevel_2 in levelComputed_3" 
            @mouseover.stop="sideOver(2, sideLevel_2)"
            :key="'level-2-'+sideLevel_2.id"
            :class="{
              hold: sideIndex.id_2 == sideLevel_2.id,
              pointer: sideLevel_2._child.length == 0,
            }">
            <span @click="go(sideLevel_2)">
              {{sideLevel_2.name}}
              <i v-if="sideLevel_2._child.length != 0" class="fa fa-chevron-right icon"></i>
            </span>
          </div>
        </div>
      </div>
      
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //侧边栏数据
      side: [],
      //三个侧边栏选中的id
      sideIndex: {
        id_0: '',
        id_1: '',
        id_2: '',
      },
      //是否显示侧边栏
      inSide: false,
      //是否强制侧边栏归位
      forceSideBarReset: false,

    };
  },
  computed: {
    //2级菜单数据
    levelComputed_2(){
      if(this.sideIndex.id_0 == '') return [];
      for(let i=0; i<this.side.length; i++){
        if(this.side[i].id == this.sideIndex.id_0){
          return this.side[i]._child;
        }
      };
      return []
    },
    //3级菜单数据
    levelComputed_3(){
      if(this.sideIndex.id_0 == '' || this.sideIndex.id_1 == '') return [];
      let s1 = [];
      for(let i=0; i<this.side.length; i++){
        if(this.side[i].id == this.sideIndex.id_0){
          s1 = this.side[i]._child;
          break ;
        }
      };
      for(let i=0; i<s1.length; i++){
        if(s1[i].id == this.sideIndex.id_1){
          return s1[i]._child;
        }
      };
      return []
    },
    
    //1级left
    level_0_left(){
      if(!this.inSide || this.forceSideBarReset){
        return -260;
      }else{
        return 0;
      }
    },
    //2级left
    level_1_left(){
      if(!this.inSide || this.forceSideBarReset){
        return -260
      }
      if(this.sideIndex.id_0 == '' || this.levelComputed_2.length == 0) return -260;
      return 260;
    },
    //3级left
    level_2_left(){
      if(!this.inSide || this.forceSideBarReset){
        return -260
      }
      if(this.levelComputed_2.length == 0 && this.levelComputed_3.length == 0){
        return -260
      }
      if(this.levelComputed_2.length != 0 && this.levelComputed_3.length == 0){
        return 260
      }
      if(this.levelComputed_2.length != 0 && this.levelComputed_3.length != 0){
        return 2*260
      }
    },

    //根据sideIndex得到选中的名称
    sideName(){
      let side_2_name = '';
      let side_3_name = '';
      for(let i=0; i<this.side.length; i++){
        if(this.side[i].id == this.sideIndex.id_0){
          side_2_name = this.side[i].name;
          for(let j=0; j<this.side[i]._child.length; j++){
            if(this.side[i]._child[j].id == this.sideIndex.id_1){
              side_3_name = this.side[i]._child[j].name;
              break ;
            }
          }
          break ;
        }
      }
      return [side_2_name, side_3_name];
    },

  },
  mounted(){
    
  },
  watch: {
    //获取菜单
    '$store.state.menu'(){
      this.side = this.utils.cleanData(this.$store.state.menu);
    }
  },
  methods: {
    //菜单项移入
    sideOver(level, item){
      if(this.overTimer){
        clearTimeout(this.overTimer);
      };
      if(this.thumpOutTimer){
        clearTimeout(this.thumpOutTimer)
      };
      this.inSide = true;
      this.overTimer = setTimeout(()=>{
        if(level == 0){
          this.$set(this.sideIndex, 'id_0', item.id)
          this.$set(this.sideIndex, 'id_1', '')
          this.$set(this.sideIndex, 'id_2', '')
        };
        if(level == 1){
          this.$set(this.sideIndex, 'id_1', item.id)
          this.$set(this.sideIndex, 'id_2', '')
        };
        if(level == 2){
          this.$set(this.sideIndex, 'id_2', item.id)
        };
      }, 300);

    },
    //菜单项移出
    sideOut(level){
      if(this.outTimer){
        clearTimeout(this.outTimer);
      };
      if(this.thumpOutTimer){
        clearTimeout(this.thumpOutTimer)
      };
      this.inSide = false;
      this.outTimer = setTimeout(()=>{
        if(level == 0){
          this.$set(this.sideIndex, 'id_0', '')
          this.$set(this.sideIndex, 'id_1', '')
          this.$set(this.sideIndex, 'id_2', '')
        };
        if(level == 1){
          this.$set(this.sideIndex, 'id_1', '')
          this.$set(this.sideIndex, 'id_2', '')
        };
        if(level == 2){
          this.$set(this.sideIndex, 'id_2', '')
        };
      }, 300);
    },
    //移入thump
    thumpOver(){
      if(this.overTimer){
        clearTimeout(this.overTimer);
      };
      if(this.thumpOutTimer){
        clearTimeout(this.thumpOutTimer)
      };
      this.inSide = true;
      this.$set(this.sideIndex, 'id_0', '')
      this.$set(this.sideIndex, 'id_1', '')
      this.$set(this.sideIndex, 'id_2', '')
    },
    //移出
    thumpOut(){
      if(this.overTimer){
        clearTimeout(this.overTimer);
      };
      if(this.thumpOutTimer){
        clearTimeout(this.thumpOutTimer)
      };
      this.thumpOutTimer = setTimeout(()=>{
        this.inSide = false;
      }, 300);
    },
    //跳转
    go(item){
      if(item._child.length == 0){
        //可以跳转
        this.forceSideBarReset = true;
        this.inSide = false;
        if(this.forceSideBarResetTimer) clearTimeout(this.forceSideBarResetTimer);
        this.forceSideBarResetTimer = setTimeout(()=>{
          this.$nextTick(()=>{
            this.forceSideBarReset = false;
          })
        }, 500);
        //保存历史记录
        let fullMenu = this.$store.getters.fullMenu;
        for(let i=0; i<fullMenu.length; i++){
          if(fullMenu[i].id == item.id){
            this.$store.dispatch('saveSearchHistory', fullMenu[i])
            break ;
          }
        };
        //路由跳转
        this.$store.dispatch('menuClick', item)
      };
    },

  }
};
</script>

<style lang="less" scoped>
@width: 260px;
@headerHeight: 50px;
@navWidth: 70px;
@activeColor: #00a4ff;

.sidebar-thump{
  position: absolute;
  z-index: 1001;
  left: 0px;
  top: 0px;
  height: @headerHeight;
  background: transparent;
  width: @navWidth;
  font-size: 14px;
  padding-left: 12px;
  flex: none;
  transition: color .15s;
  display: flex;
  align-items: center;
  color: #efefef;
  .menu-bars{
    transition: transform .3s;
  }
  .sideTitle{
    color: #999;
    height: 42px;
    line-height: 42px;
    border-right: 1px solid #ddd;
    text-align: center;
  }
  .side_content{
    height: calc(~"100% - 42px");
    width: 100%;
    border-right: 1px solid #ddd;
    position: relative;
    .icon{
      position: absolute;
      right: 20px;
      top: 12px;
      font-size: 12px;
    }
  }
  .sidebar-wrap {
    position: absolute;
    z-index: 1001;
    transition: all .25s;
    top: @headerHeight;
    background: #f7f8fa;
    left: 0px;
    opacity: 1;
    .sidebar_0,
    .sidebar_1,
    .sidebar_2{
      width: @width;
      height: calc(~"100vh - @{headerHeight}");
      position: absolute;
      top: 0px;
      left: 0px;
      color: #333;
      font-size: 14px;
      background: #f7f8fa;
      transition: all .2s .05s;
    }
    .sidebar_0{
      z-index: 999;
    }
    .sidebar_1{
      z-index: 998;
    }
    .sidebar_2{
      z-index: 997;
    }
  }

  .sidebar-item{
    position: relative;
    height: 36px;
    span{
      display: block;
      width: calc(~"100% - 9px");
      height: 36px;
      padding-left: 16px;
      padding-right: 30px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      line-height: 36px;
    }
    &:hover span{
      color: @activeColor;
      background: #f1f2f4;
    }
    &.hold{
      color: @activeColor;
    }
    &.pointer{
      cursor: pointer;
    }
  }

  &:hover{
    cursor: default;
    color: @activeColor;
    .menu-bars{
      
    }
  }

}

</style>
