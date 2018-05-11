<template>
  <div class="top clearfix">

    <div v-if="$store.state.sidebarType == 'hover'" class="nav nowrap">
      &nbsp;
    </div>

    <!-- logo -->
    <div class="logo">
      <img :src="require('./logo.svg')" alt="logo">
      <span>&nbsp;向日癸XXX</span>
    </div>

    <!-- 右侧 -->
    <div class="set clearfix" :class="{'notHover': $store.state.sidebarType != 'hover'}" >
      <transition name="el-fade-in-linear">
        <span v-show="!showSearch" class="set-user">
          <i class="fa fa-user-circle-o" aria-hidden="true"></i>&nbsp;&nbsp;用户
        </span>
      </transition>
      <transition name="el-fade-in-linear">
        <span v-show="!showSearch" @click="showSearchFn" class="search">
          <i class="el-icon-search"></i>
        </span>
      </transition>
    </div>

    <!-- 搜索遮盖框 -->
    <transition name="fade-mark">
      <div v-show="showSearch" @click.stop="hideSearchFn" class="search-wrap">
        <div @click.stop class="searchInp">
          <i class="el-icon-search icon-1"></i>
          <input 
            v-model="keys"
            ref="searchInput" 
            autofocus 
            placeholder="请输入查询菜单的关键词" 
            type="text" />
          <i @click.stop="hideSearchFn" class="el-icon-close icon-2"></i>
          <div class="search-result" v-scroll>

            <!-- 历史记录 -->
            <template v-if="searchData2.history == true">
              <div class="no-see" v-if="$store.state.historySearch.length == 0">
                暂无浏览记录&nbsp;<i class="fa fa-frown-o" aria-hidden="true"></i>
              </div>
              <template v-else>
                <div class="his">最近浏览：</div>
                <div 
                  v-for="d in searchData2.d" 
                  :key="d.id" 
                  @click="searchClick(d)"
                  :title="d._fullPathName.split('#_#').join(' > ')" 
                  class="search-item nowrap">
                  {{d._fullPathName.split('#_#').join(' > ')}}
                </div>
              </template>
            </template>

            <!-- 关键词 -->
            <template v-else>
              <div 
                v-for="d in searchData2.d" 
                :key="d.data.id"
                @click="searchClick(d.data)"
                :title="d.data._fullPathName.split('#_#').join(' > ')" 
                class="search-item nowrap">
                <span v-html="d.html"></span>
              </div>
              <div class="noRes" v-if="searchData2.d.length == 0">
                没有搜索到结果
              </div>
            </template>
            
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>
import localforage from 'localforage'

export default {
  data(){
    return {
      //显示搜索框
      showSearch: false,
      //所有的菜单搜索数据
      searchData: [],
      //搜索框的关键词
      keys: '',

    }
  },
  watch: {
    '$store.state.menu'(){
      //将菜单层次序列化和扁平化
      this.searchData = this.$store.getters.fullMenu;
    },
  },
  created(){
    this.getSearchHistory();
  },
  computed: {
    //过滤搜索关键词
    searchData2(){
      let activeColor = '#ff8400';
      let defaultColor = '#8f8f8f';
      let keys = (this.keys+'').trim();
      let res = [];
      if(!this.keys || keys == ''){
        //无关键词搜索，就是历史记录
        return {
          history: true,
          d: this.$store.state.historySearch || [],
        };
      }else{
        // 关键词过滤
        for(let i=0; i<this.searchData.length; i++){
          let keyData = this.searchData[i];
          let s3 = this.searchData[i]._fullPathName.split('#_#').join(' > ');
          if(s3.indexOf(keys) > -1){
            let s4 = s3.split(keys);
            let s5 = [];
            for(let j=0; j<s4.length; j++){
              s5[j] = `<span style='color: ${defaultColor}'>${s4[j]}</span>`;
            };
            let str = '';
            for(let j=0; j<s5.length; j++){
              if(s5.length - 1 != j){
                str += (s5[j]+`<span style='color: ${activeColor}'>${keys}</span>`)
              }else{
                str += s5[j];
              }
            }
            res.push({
              data: keyData,
              html: str
            });
          };
        };
        return {
          history: false,
          d: res,
        };
      };
    },

  },
  methods: {
    //获取历史记录
    getSearchHistory(){
      this.$store.dispatch('getSearchHistory');
    },
    //点击搜索下拉的某项（并保存记录）
    searchClick(data){
      this.$store.dispatch('saveSearchHistory', data);
      this.$store.dispatch('menuClick', data);
      this.showSearch = false;
    },
    //点击显示搜索框
    showSearchFn(){
      this.showSearch = true;
      this.keys = '';
      this.$nextTick(()=>{
        this.$refs.searchInput.focus();
      });
    },
    //点击隐藏搜索框
    hideSearchFn(){
      this.showSearch = false;
    },

  },
  beforeDestroy(){

  },

}
</script>

<style lang="less" scoped>
@height: 50px;
@activeColor: #00a4ff;
@logoWidth: 220px;
@navWidth: 90px;
.top{
  height: @height;
  width: 100%;
  background-color: #f2f2f2;
  color: rgb(73, 73, 73);
  display: flex;
  align-items: center;
  font-size: 14px;
  border-bottom: 1px solid #ddd;
  position: relative;
  .nav,.set{
    height: @height;
    line-height: @height;
  }
  .nav{
    width: @navWidth;
    padding-left: 12px;
    flex: none;
  }
  .logo{
    width: @logoWidth;
    padding-left: 10px;
    padding-right: 10px;
    flex: none;
    display: flex;
    align-items: center;
    span{
      display: inline-block;
      padding-left: 12px;
      font-size: 18px;
      color: #d4237a;
    }
  }
  .set{
    flex: none;
    width: calc(~"100% - @{logoWidth} - @{navWidth}");
    padding-right: 16px;
    &.notHover{
      width: calc(~"100% - @{logoWidth}");
    }
    .set-user{
      height: @height;
      line-height: @height;
      float: right;
      padding-left: 12px;
    }
    .search{
      float: right;
      height: @height;
      line-height: @height;
      margin-right: 20px;
      font-size: 16px;
      cursor: pointer;
      &:hover{
        color: @activeColor;
      }
    }
  }
  .search-wrap{
    position: absolute;
    z-index: 10999;
    top: @height;
    left: 0px;
    width: 100%;
    height: calc(~"100vh - @{height}");
    background: rgba(0, 0, 0, .03);
    .searchInp{
      position: absolute;
      width: calc(~"100% - 2*@{logoWidth} - 2*@{navWidth} - 10px");
      max-width: 600px;
      min-width: 300px;
      top: -@height;
      left: 50%;
      height: @height;
      transform: translateX(-50%);
      input{
        width: 100%;
        height: 30px;
        margin-top: 10px;
        border: none;
        outline: none;
        background: transparent;
        color: #666;
        font-size: 14px;
        text-indent: 28px;
        transition: all .3s;
      }
      .search-result{
        position: absolute;
        top: 100%;
        left: 0px;
        width: 100%;
        background: #fff;
        max-height: 280px;
        border: 1px solid #ddd;
        border-top: none;
        padding-top: 10px;
        padding-bottom: 10px;
        box-shadow: 0px 4px 8px #e8e8e8;
        .search-item {
          color: #8f8f8f;
          cursor: pointer;
          padding: 10px;
          &:hover{
            color: @activeColor;
            background: #f7f7f7;
          }
        }
        .his{
          font-size: 12px;
          color: @activeColor;
          margin-left: 10px;
          margin-bottom: 6px;
          margin-right: 10px;
        }
        .noRes{
          height: 32px;
          line-height: 32px;
          text-align: center;
          color: #8f8f8f;
        }
        .no-see{
          padding: 8px;
          color: #999;
          text-align: center;
        }
      }
      .icon-1,
      .icon-2{
        position: absolute;
        width: 16px;
        height: 16px;
        font-size: 16px;
        top: (@height - 16px)/2;
      }
      .icon-1{
        left: 5px;
      }
      .icon-2{
        right: 0px;
        cursor: pointer;
        &:hover{
          color: @activeColor;
        }
      }
    }
  }
}
.fade-mark-enter-active {
  transition: all .4s ease;
}
.fade-mark-leave-active{
  transition: all .12s ease;
}
.fade-mark-enter, .fade-mark-leave-to {
  opacity: 0;
}

</style>
