<template>
  <div style="width: 100%;">
      <button style="padding: 6px; border: 1px solid #666;" @click="getTable">获取表格信息21</button>
      <button style="padding: 6px; border: 1px solid #666;" @click="checkedRows">获取选中的行</button>
      <button style="padding: 6px; border: 1px solid #666;" @click="add">增加一行</button>
      <button style="padding: 6px; border: 1px solid #666;" title="第一列设置了required=true" @click="checkRequired">对required=true检查</button>
      <button style="padding: 6px; border: 1px solid #666;" @click="reset">doReset</button>
      注意：表格宽高是撑满父容器的
      <div style="width: 100%; height: 540px; margin-top: 14px;">
        <database
          ref="database"
          :scrollSpeed="scrollSpeed"
          :colData="colData"
          :rowData="rowData"
          :colRelation="colRelation"
          :entry="entry"
          :showCheckBoxAndIndex="showCheckBoxAndIndex"
          :showOperate="showOperate"
          :operateItem="operateItem"
          :onlyShowIndex="onlyShowIndex"
          :onlyShowCheckBox="onlyShowCheckBox"
          :showPrompt="showPrompt"
          :showStatus="showStatus"
          :option_limit="option_limit"
          :searchDelayTime="searchDelayTime"
          :showOptionPage="showOptionPage"
          @selectChange="selectChange"
          @dateChange="dateChange"
          @saveLine="saveLine"
          @removeLine="removeLine"
        >
        </database>
      </div>
  </div>
</template>

<script>
// import database from './database'
function stationListUrl(){
  return '/select.json'
}
export default {
  data(){
    return {
      //滚动条的一次滚动几行
      scrollSpeed: 1,
      //列数据
      colData: [
          {
          title: "多选",
          props: "a1",
          width: 150,
          icon: '',
          sort: true,
          //是否隐藏该列
          // hide: true,
          fixed: true
          },
          {
          title: "单选",
          width: 100,
          props: "a2",
          icon: 'number',
          },
          {
          title: "sync单选",
          width: 130,
          props: "a3",
          //是否隐藏该列
          // hide: true,
          icon: 'select',
          },
          {
          title: "sync多选",
          width: 140,
          props: "a4",
          icon: 'mul_select',
          // fixed: true
          },
          {
          title: "日期",
          width: 140,
          icon: 'date',
          props: "a5"
          },
          {
          title: "时间",
          width: 140,
          icon: 'time',
          props: "a6"
          },
          {
          title: "日期时间X",
          width: 240,
          icon: 'date',
          sort: true,
          props: "a7"
          },
          {
          title: "编辑数字",
          width: 140,
          props: "a8"
          },
          {
          title: "编辑文字",
          width: 200,
          props: "a9"
          },
          {
          title: "标题10",
          width: 140,
          props: "a10"
          },
          {
          title: "标题11",
          width: 140,
          props: "a11"
          },
          {
          title: "标题12",
          width: 140,
          props: "a12"
          },
          {
          title: "标题13",
          width: 140,
          props: "a13"
          },
          {
          title: "标题14",
          width: 140,
          props: "a14"
          },
          {
          title: "标题15",
          width: 140,
          props: "a15"
          },
          {
          title: "标题16",
          width: 140,
          props: "a16"
          },
          {
          title: "标题17",
          width: 140,
          props: "a17"
          },
          {
          title: "标题18",
          width: 140,
          props: "a18"
          },
          {
          title: "标题19",
          width: 140,
          props: "a19"
          },
          {
          title: "标题20",
          width: 140,
          props: "a20"
          },
          {
          title: "标题21",
          width: 140,
          props: "a21"
          },
          {
          title: "标题22",
          width: 140,
          props: "a22"
          },
          {
          title: "标题23",
          width: 140,
          props: "a23"
          },
          {
          title: "标题24",
          width: 140,
          props: "a24"
          },
          {
          title: "标题25",
          width: 140,
          props: "a25"
          },
          {
          title: "标题26",
          width: 140,
          props: "a26"
          },
          {
          title: "标题27",
          width: 140,
          props: "a27"
          },
          {
          title: "标题28",
          width: 140,
          props: "a28"
          },
          {
          title: "标题29",
          width: 140,
          props: "a29"
          },
          {
          title: "标题30",
          width: 140,
          props: "a30"
          },
          {
          title: "标题31",
          width: 140,
          props: "a31"
          },
          {
          title: "标题32",
          width: 140,
          props: "a32"
          },
          {
          title: "标题33",
          width: 140,
          props: "a33"
          },
          {
          title: "标题34",
          width: 140,
          props: "a34"
          },
          {
          title: "标题35",
          width: 140,
          props: "a35"
          },
          {
          title: "标题36",
          width: 140,
          props: "a36"
          },
          {
          title: "标题37",
          width: 140,
          props: "a37"
          },
          {
          title: "标题38",
          width: 140,
          props: "a38"
          },
          {
          title: "标题39",
          width: 140,
          props: "a39"
          },
          {
          title: "这是标准的最后一列！",
          props: "a40"
          }
      ],
      //多级表头关系数组
      colRelation: [
        {
          title: '4-1',
          level: 4,
          indexStart: 2,
          indexEnd: 6,
        },
        {
          title: '4-2',
          level: 4,
          indexStart: 6,
          indexEnd: 16,
        },{
          title: '4-3',
          level: 4,
          indexStart: 16,
          indexEnd: 29,
        },{
          title: '4-4',
          level: 4,
          indexStart: 29,
          indexEnd: 39,
        },

        {
          title: '3-1',
          level: 3,
          indexStart: 3,
          indexEnd: 6,
        },{
          title: '3-2',
          level: 3,
          indexStart: 7,
          indexEnd: 22,
        },{
          title: '3-3',
          level: 3,
          indexStart: 25,
          indexEnd: 33,
        },{
          title: '3-4',
          level: 3,
          indexStart: 34,
          indexEnd: 37,
        },

        {
          title: '2-1',
          level: 2,
          indexStart: 3,
          indexEnd: 5,
        },{
          title: '2-2',
          level: 2,
          indexStart: 5,
          indexEnd: 6,
        },
      ],
      //增加行的数据格式
      entry: false,
      //行数据
      rowData: [],
      //文本溢出时是否出现提示框
      showPrompt: true,

      //是否显示复选框
      showCheckBoxAndIndex: true,
      //是否只要索引，不要复选框
      onlyShowIndex: false,
      //是否只出现复选框，不要索引
      onlyShowCheckBox: true,
      //是否显示操作列
      showOperate: true,
      //操作列的项
      operateItem: {
        save: true,
        add: true,
        remove: true,
        up: true,
        down: true,
      },
      //是否显示状态标色列
      showStatus: true,

      //option每页限制
      option_limit: 10,
      //option输入的延迟
      searchDelayTime: 500,
      //option下拉是否分页
      showOptionPage: true,


    }
  },
  created(){
    /***假数据***/
    let r = [];
    for (let i = 0; i < 200; i++) {
      r.push({
        checked: i == 6||i==3||i==2? true: false, //有复选框时，表示是否初始化选中
        noCheckAble: i == 1 || i == 2? true: false, //true表示复选框不可用
        a1: {
          type: "opt_mul_select",
          option: [{id: 1, name: 'name1'},{id: 2, name: 'name2'},{id: 3, name: 'name3'}],
          value: ['name1', 'name2'],
          id: [1,2],
          required: true,
        },
        a2: {
          type: "opt_select",
          option: [{id: 0, name: 'name0'},{id: 2, name: 'name2'},{id: 3, name: 'name3'}],
          
          value: 'name0',
          id: 0,
          required: true,
        },
        a3: {
          type: "select",
          url: stationListUrl(),
          dataPos: 'data.result',
          dataTotal: 'data.total',
          
          value: '',
          // required: true,
          id: ''
        },
        a4: {
          type: "mul_select",
          url: stationListUrl(),
          
          dataPos: 'data.result',
          dataTotal: 'data.total',
          value: [],
          id: []
        },
        a5: {
          type: "date",
          value: '2018-03-03',
        },
        a6: {
          type: "time",
          value: '08:02:33'
        },
        a7: {
          type: "datetime",
          required: true,
          value: '2012-02-27 08:02:33'
        },
        a8: {
          type: "number",
          value: 121,
          style: {
            color: '#000',
            background: '#ffd0d0'
          },
        },
        a9: {
          type: "edit",
          value: i + "-" + 9,
          id: i
        },
        a10: {
          type: "normal",
          value: i + "-" + 10,
          id: i
        },
        a11: {
          type: "normal",
          value: i + "-" + 11,
          id: i
        },
        a12: {
          type: "normal",
          value: i + "-" + 12,
          id: i
        },
        a13: {
          type: "normal",
          value: i + "-" + 13,
          id: i
        },
        a14: {
          type: "normal",
          value: i + "-" + 14,
          id: i
        },
        a15: {
          type: "normal",
          value: i + "-" + 15,
          id: i
        },
        a16: {
          type: "normal",
          value: i + "-" + 16,
          id: i
        },
        a17: {
          type: "normal",
          value: i + "-" + 17,
          id: i
        },
        a18: {
          type: "normal",
          value: i + "-" + 18,
          id: i
        },
        a19: {
          type: "normal",
          value: i + "-" + 19,
          id: i
        },
        a20: {
          type: "edit",
          value: i + "-" + 20
        },
        a21: {
          type: "normal",
          value: i + "-" + 21,
          id: i
        },
        a22: {
          type: "normal",
          value: i + "-" + 22,
          id: i
        },
        a23: {
          type: "normal",
          value: i + "-" + 23,
          id: i
        },
        a24: {
          type: "normal",
          value: i + "-" + 24,
          id: i
        },
        a25: {
          type: "normal",
          value: i + "-" + 25,
          id: i
        },
        a26: {
          type: "normal",
          value: i + "-" + 26,
          id: i
        },
        a27: {
          type: "normal",
          value: i + "-" + 27,
          id: i
        },
        a28: {
          type: "normal",
          value: i + "-" + 28,
          id: i
        },
        a29: {
          type: "normal",
          value: i + "-" + 29,
          id: i
        },
        a30: {
          type: "normal",
          value: 30,
        },
        a31: {
          type: "normal",
          value: i + "-" + 31,
          id: i
        },
        a32: {
          type: "normal",
          value: i + "-" + 32,
          id: i
        },
        a33: {
          type: "normal",
          value: i + "-" + 33,
          id: i
        },
        a34: {
          type: "normal",
          value: i + "-" + 34,
          id: i
        },
        a35: {
          type: "normal",
          value: i + "-" + 35,
          id: i
        },
        a36: {
          type: "normal",
          value: i + "-" + 36,
          id: i
        },
        a37: {
          type: "normal",
          value: i + "-" + 37,
          id: i
        },
        a38: {
          type: "normal",
          value: i + "-" + 38,
          id: i
        },
        a39: {
          type: "edit",
          value: i + "-" + 39,
          id: i
        },
        a40: {
          type: "date",
          value: '2018-03-03',
        },
      });
    }
    setTimeout(()=>{
      this.rowData = r;
      this.$refs.database.doReset(true);
    }, 2000)
    
    let i = 0;
    this.entry = {
        checked: i == 6||i==3||i==2? true: false, //有复选框时，表示是否初始化选中
        noCheckAble: i == 1 || i == 2? true: false, //true表示复选框不可用
        a1: {
          type: "opt_mul_select",
          option: [{id: 1, name: 'name1'},{id: 2, name: 'name2'},{id: 3, name: 'name3'}],
          value: ['name2'],
          id: [2],
          required: true,
        },
        a2: {
          type: "opt_select",
          option: [{id: 0, name: 'name0'},{id: 2, name: 'name2'},{id: 3, name: 'name3'}],
          
          value: 'name0',
          id: 0,
          required: true,
        },
        a3: {
          type: "select",
          url: '',
          dataPos: 'data.result',
          dataTotal: 'data.total',
          
          value: '',
          required: true,
          id: ''
        },
        a4: {
          type: "mul_select",
          url: '',
          
          dataPos: 'data.result',
          dataTotal: 'data.total',
          value: [],
          id: []
        },
        a5: {
          type: "date",
          value: '2018-03-03',
        },
        a6: {
          type: "time",
          value: '08:02:33'
        },
        a7: {
          type: "datetime",
          value: '2012-02-27 08:02:33'
        },
        a8: {
          type: "number",
          value: 121,
          style: {
            color: '#000',
            background: '#ffd0d0'
          },
        },
        a9: {
          type: "edit",
          value: i + "-" + 9,
          id: i
        },
        a10: {
          type: "normal",
          value: i + "-" + 10,
          id: i
        },
        a11: {
          type: "normal",
          value: i + "-" + 11,
          id: i
        },
        a12: {
          type: "normal",
          value: i + "-" + 12,
          id: i
        },
        a13: {
          type: "normal",
          value: i + "-" + 13,
          id: i
        },
        a14: {
          type: "normal",
          value: i + "-" + 14,
          id: i
        },
        a15: {
          type: "normal",
          value: i + "-" + 15,
          id: i
        },
        a16: {
          type: "normal",
          value: i + "-" + 16,
          id: i
        },
        a17: {
          type: "normal",
          value: i + "-" + 17,
          id: i
        },
        a18: {
          type: "normal",
          value: i + "-" + 18,
          id: i
        },
        a19: {
          type: "normal",
          value: i + "-" + 19,
          id: i
        },
        a20: {
          type: "normal",
          value: i + "-" + 20,
          id: i
        },
        a21: {
          type: "normal",
          value: i + "-" + 21,
          id: i
        },
        a22: {
          type: "normal",
          value: i + "-" + 22,
          id: i
        },
        a23: {
          type: "normal",
          value: i + "-" + 23,
          id: i
        },
        a24: {
          type: "normal",
          value: i + "-" + 24,
          id: i
        },
        a25: {
          type: "normal",
          value: i + "-" + 25,
          id: i
        },
        a26: {
          type: "normal",
          value: i + "-" + 26,
          id: i
        },
        a27: {
          type: "normal",
          value: i + "-" + 27,
          id: i
        },
        a28: {
          type: "normal",
          value: i + "-" + 28,
          id: i
        },
        a29: {
          type: "normal",
          value: i + "-" + 29,
          id: i
        },
        a30: {
          type: "normal",
          value: i + "-" + 30,
          id: i
        },
        a31: {
          type: "normal",
          value: i + "-" + 31,
          id: i
        },
        a32: {
          type: "normal",
          value: i + "-" + 32,
          id: i
        },
        a33: {
          type: "normal",
          value: i + "-" + 33,
          id: i
        },
        a34: {
          type: "normal",
          value: i + "-" + 34,
          id: i
        },
        a35: {
          type: "normal",
          value: i + "-" + 35,
          id: i
        },
        a36: {
          type: "normal",
          value: i + "-" + 36,
          id: i
        },
        a37: {
          type: "normal",
          value: i + "-" + 37,
          id: i
        },
        a38: {
          type: "normal",
          value: i + "-" + 38,
          id: i
        },
        a39: {
          type: "normal",
          value: i + "-" + 39,
          id: i
        },
        a40: {
          type: "normal",
          value: i + "-" + 40,
          id: i
        }
      };
    /***假数据***/
  },
  watch: {
    '$store.state.isExpand'(){
      this.$nextTick(()=>{
        this.doLayout();
      });
    },

  },
  methods: {
    //下拉框切换触发
    selectChange(e){
      console.log(e)
    },
    //日期切换
    dateChange(e){
      console.log(e)
    },
    //获取表格行信息
    getTable(){
      let rows = this.$refs.database.getTable();
      console.log(rows)
    },
    //获取被选中行
    checkedRows(){
      let rows = this.$refs.database.checkedRows();
      console.log(rows)
    },
    //增加一行
    add(){
      this.$refs.database.addLine();
    },
    //调整布局
    doLayout(){
      this.$refs.database.doLayout();
    },
    //required检查
    checkRequired(){
      let msg = this.$refs.database.checkRequired();
      console.log(msg)
    },
    //重置表格数据
    reset(){
      this.$refs.database.doReset(true)
    },


    //单行保存时
    saveLine(e){
      console.log(e)
      if(e.status == 'checkSuccess'){
        setTimeout(()=>{
          /*
          * 成功后 getTable
          * 然后通过 _rowid找到对应项
          * 进行 _add、_modify、_error或id字段的修改
          * 再执行complate回调，关闭loading
          */
          e.complate()
        }, 4500)
      }
    },
    //单行删除时
    removeLine(e){
      setTimeout(()=>{
          //成功执行 success，失败执行 faild
          e.success()
        }, 4500)
    },


  },
  // components: {database}
}
</script>

<style scoped>

</style>
