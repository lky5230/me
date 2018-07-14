<template>
  <div class="home">
    <!-- 顶部 -->
    <div class="mdui-appbar mdui-appbar-fixed mdui-shadow-2">
      <div class="mdui-toolbar mdui-color-teal-600">
        <a 
          href="javascript:;" 
          mdui-drawer="{target: '#left-drawer', swipe: true}"
          class="mdui-btn mdui-btn-icon mdui-ripple mdui-ripple-white">
          <i class="mdui-icon material-icons">menu</i>
        </a>
        <span class="mdui-typo-title">Title</span>
        <div class="mdui-toolbar-spacer"></div>
        
        <div class="account-wrap">
          <button @click.stop="accountShow = !accountShow; searchShow = false;" class="mdui-textfield-icon mdui-btn mdui-btn-icon">
            <i class="mdui-icon material-icons">account_circle</i>
          </button>
          <!-- 账户选项下拉 -->
          <transition name="search-list">
            <div v-show="accountShow" class="search-list search-list-account">
              <div class="search-list-item search-list-item-account">账户设置</div>
              <div @click.stop="accountQuit" class="search-list-item search-list-item-account">
                退出登录
                <i class="mdui-icon material-icons account-quit">keyboard_arrow_right</i>
              </div>
            </div>
          </transition>
        </div>
        
        <!-- 搜索 -->
        <div class="mdui-textfield mdui-textfield-expandable">
          <button @click="searchShow = true" class="mdui-textfield-icon mdui-btn mdui-btn-icon">
            <i class="mdui-icon material-icons">search</i>
          </button>
          <input 
            :value="searchKeys" 
            class="mdui-textfield-input" 
            type="text"
            @click.stop
            @input="textfieldinput"
            @focus="textfieldfocus"
            placeholder="搜索"/>
          <button @click="textfieldClose" class="mdui-textfield-close mdui-btn mdui-btn-icon">
            <i class="mdui-icon material-icons">close</i>
          </button>
        </div>
        
      </div>
      <!-- 搜索列表 -->
      <transition name="search-list">
        <div v-show="searchShow && searchKeys" class="search-list">
          <template v-if="searchData2.length != 0" >
            <div 
              class="search-list-item"
              @click.stop="goPage(flatMenuItem)"
              v-for="flatMenuItem in searchData2" 
              :key="flatMenuItem.id">
              <span v-html="flatMenuItem.html"></span>
            </div>
          </template>
          <div class="search-list-no" v-else>未搜索到结果</div>
        </div>
      </transition>
    </div>
    <!-- 左侧抽屉 -->
    <div class="mdui-drawer mdui-color-white" id="left-drawer">
      <collapse-side :menu="menu" :wrap="true" />
    </div>
    
    <div class="content">
      
      <el-breadcrumb separator="/" class="separator-w">
        <i class="mdui-icon material-icons mdui-text-color-teal-700 separator-home">home</i>
        <el-breadcrumb-item 
          v-for="(item, pIndex) in cureentPage" 
          :key="item + '-' + pIndex">
          {{item}}
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="divider-breadcrumb"></div>
      

      <div class="main">
        <router-view />
      </div>
      
    </div>

  </div>
</template>

<script>
import collapseSide from '@/views/collapseSide'
export default {
  name: 'home',
  data(){
    return {
      menu: [],
      flatMenu: [],
      searchKeys: '',
      searchShow: false,
      accountShow: false,
    }
  },
  created(){
    this.getMenu();
    this.pagePosition()
  },
  mounted(){
    document.addEventListener('click', ()=>{
      this.searchShow = false;
      this.accountShow = false;
    })
  },
  watch: {
    '$route'(to, from){
      this.$nextTick(()=>{
        this.pagePosition(to);
      })
    },
  },
  computed: {
    //过滤搜索关键词
    searchData2(){
      let activeColor = '#ff8400';
      let defaultColor = '#666';
      let searchKeys = (this.searchKeys+'').trim();
      let res = [];
      if(!this.searchKeys || searchKeys == ''){
        //无关键词搜索
        return []
      }else{
        // 关键词过滤
        for(let i=0; i<this.flatMenu.length; i++){
          let keyData = this.flatMenu[i];
          let s3 = this.flatMenu[i]._fullPathName.split('#_#').join(' / ');
          if(s3.indexOf(searchKeys) > -1){
            let s4 = s3.split(searchKeys);
            let s5 = [];
            for(let j=0; j<s4.length; j++){
              s5[j] = `<span style='color: ${defaultColor}'>${s4[j]}</span>`;
            };
            let str = '';
            for(let j=0; j<s5.length; j++){
              if(s5.length - 1 != j){
                str += (s5[j]+`<span style='color: ${activeColor}'>${searchKeys}</span>`)
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
        
        return res;
      };
    },
    //面包渣
    cureentPage(){
      let cur = this.$store.state.cureentPage;
      if(!cur.id){
        return ['首页'];
      };
      for(let i=0; i<this.flatMenu.length; i++){
        if(this.flatMenu[i].id == cur.id){
          return this.flatMenu[i]._fullPathName.split('#_#');
        };
      };
    },
  },
  methods: {
    //获取-侧边栏数据
    getMenu(){
      this.$axios.get('/menu.json').then(res=>{
        //菜单-层级化（用于侧边栏）
        let menu = this.$utils.cleanData(res.data, {id: 'id', parentid: 'parentid'});
        //菜单-扁平化（可用于搜索）
        let flatMenu = this.$utils.flattenedCleanData(menu);
        this.menu = menu;
        this.flatMenu = flatMenu;
        this.$store.commit('getMenu', {
          deepMenu: menu,
          expandMenu: flatMenu,
        });
        this.pagePosition(this.$router.currentRoute)
      });
    },
    //搜索相关
    textfieldClose(){
      this.searchShow = false;
      this.searchKeys = '';
    },
    textfieldinput(e){
      this.searchKeys = e.target.value;
      if(this.searchKeys){
        this.searchShow = true;
      }else{
        this.searchShow = false;
      }
    },
    textfieldfocus(){
      this.accountShow = false;
      if(this.searchKeys){
        this.searchShow = true;
      }else{
        this.searchShow = false;
      }
    },
    //点击跳转
    goPage(item){
      this.$store.dispatch('goPage', item.data);
      this.searchShow = false;
    },
    //动态-标题+面包渣
    pagePosition(to){
      if(this.menu.length == 0 || to == undefined) return ;
      if(to.path == '/'){
        document.title = process.env.VUE_APP_NAME + ' - ' + '首页';
        this.$store.commit('changeCurrentPage', {});
        return ;
      };
      for(let i=0; i<this.flatMenu.length; i++){
        if(this.flatMenu[i].url == to.path){
          this.$store.commit('changeCurrentPage', this.flatMenu[i]);
          document.title = process.env.VUE_APP_NAME + ' - ' + this.flatMenu[i].name;
          return ;
        }
      };
    },
    //退出账户
    accountQuit(){
      this.accountShow = false;
      this.$router.push('/login');
    },

  },
  components: {collapseSide}
}
</script>

<style lang="less" scoped>
.mdui-textfield-expandable{
  position: relative;
}
.mdui-textfield-expandable.mdui-textfield-expanded{
  width: 250px;
}
.mdui-textfield-input{
  color: #fff;
  border-bottom: 1px solid #fff;
}
.search-list{
  position: absolute;
  right: 15px;
  top: 48px;
  background: #ffffff;
  border: 1px solid #eaeaea;
  max-height: 300px;
  width: 216px;
  border-radius: 2px;
  z-index: 2224;
  overflow-y: auto;
  padding-top: 6px;
  padding-bottom: 6px;
}
.search-list-account{
  overflow-y: inherit;
  height: auto;
  max-height: auto;
  width: 110px;
  position: absolute;
  right: -24px;
  top: 50px;
  .account-quit{
    position: absolute;
    font-size: 14px;
    top: 10px;
    color: #666;
    right: 14px;
  }
}
.search-list-item-account{
  color: rgba(0, 0, 0, .87);
  position: relative;
}
.mdui-toolbar > .account-wrap{
  overflow: inherit;
}
.search-list-item{
  padding: 10px 12px;
  font-size: 12px;
  line-height: 1.2;
  cursor: pointer;
  background: #fff;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  &:hover{
    background: #efefef;
    overflow: inherit;
    white-space: inherit;
    text-overflow: inherit;
  }
}
.account-wrap{
  position: relative;
}
.search-list-no{
  text-align: center;
  color: #999;
  font-size: 13px;
}
.separator-w{
  padding-left: 20px;
  position: relative;
  .separator-home{
    position: absolute;
    left: 0px;
    top: 0px;
    font-size: 14px;
  }
}
#left-drawer{
  box-shadow: none;
  border-right: 1px solid #f0f0f0;
}
.content{
  padding: 10px;
  box-sizing: border-box;
}
.divider-breadcrumb{
  margin-top: 10px;
  margin-bottom: 10px;
}

.main{

}



.search-list-enter-active,
.search-list-leave-active{
  transition: all .18s;
  transform-origin: top center;
}
.search-list-enter{
  height: 0px;
  opacity: 0;
}
.search-list-leave-to{
  height: 0px;
  opacity: 0;
}
</style>

