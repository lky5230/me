# vue表格组件

- 依赖于[fontawesome](http://www.fontawesome.com.cn/)图标
- 依赖于vue-resource插件

---

###简介：


###用法：

> 1、导入该组件
```
import database from './database.vue'
Vue.components('database', database)
```

> 2、组件整体格式
```
// 注意：表格宽高是撑满父容器的！
<div style="width: 100%; height: calc(100% - 60px)">
    <database
        ref="database"
        :colData="colData"
        :rowData="rowData"
		:colRelation="colRelation"
        :entry="entry"
		:scrollSpeed="scrollSpeed"
	    :showCheckBoxAndIndex="showCheckBoxAndIndex"
	    :onlyShowIndex="onlyShowIndex"
	    :showPrompt="showPrompt"
	    :option_limit="option_limit"
    	:searchDelayTime="searchDelayTime"
    	:showOptionPage="showOptionPage"
        @selectChange="selectChange">
    </database>
</div>
// 注意：其中 colData、rowData 是必须的！
```

> 3、rowData属性

```
// 单元格类型：
number、
select、
mul_select、
opt_select、
opt_mul_select、
edit、
normal、
time、
date、
datetime、
month、
year
// 具体格式注释：
rowData = [{
    checked: i == 0||i==1||i==2? true: false, //有复选框时，他表示是否初始化选中（默认为false）
    a1: {
        type: "time", // 类型

        value: '2012-03-15' // 值（必需）
        required: true, //表示不能为空
        /*对input的个性化*/
        style: {
          background: '#f00',
          color: '#fff'
        }
    },
    a2: {
        type: "number", //数字类型

        min: 0, //数字类型的，表示最小值
        max: 20, //数字类型的，表示最大值
        floatLength: 2, //数字类型的，表示小数位数
        value: 0.2*i, //（必需）
        required: true, //表示不能为空
        /*对input的个性化*/
        style: {
          background: '#f00',
          color: '#fff'
        }
    },
    a3: {
        type: "select", //单选下拉

        url: '/static/select.json', //单选下拉的请求的url（必需），且请求结果格式是[{id: ?, name: ?}, ...]
        dataPos: 'data.result', // 请求结果在res.data.data.result中，默认'data.result'
		    dataTotal: 'data.total', // 当option分页时，表示请求的总数在res.data.data.total中，默认'data.total'
        value: 'name-3',//（必需）
        id: 3, //（必需）
		    required: true, //表示不能为空
    },
    a4: {
        type: "mul_select", //多选下拉
        url: '/static/select.json', //（必需）
        dataPos: 'data.result',
		    dataTotal: 'data.total',
        value: ['name-2', 'name-3', 'name-4'], //多选下拉的值，必须是数组类型（必需）
        id: [2,3,4] //多选下拉的id，必须是数组类型（必需）
    },
    //不需要url请求的多选下拉，注意option字段，和上面区别
    a1: {
      type: "opt_mul_select", 
      option: [{id: 1, name: 'name1'},{id: 2, name: 'name2'},{id: 3, name: 'name3'}],
      value: ['name1', 'name2'],
      id: [1,2],
      required: true,
    },
    //不需要url请求的单选下拉，注意option字段，和上面区别
    a2: {
      type: "opt_select",
      option: [{id: 1, name: 'name1'},{id: 2, name: 'name2'},{id: 3, name: 'name3'}],
      value: '',
      id: '',
      required: true,
    },
    a7: {
        type: "edit", //编辑类型
        value: 'edit',
    },
    a8: {
        type: "normal", //普通类型
        value: 'xxoo',
    },
    a5: {
        type: "date",
        value: '2011-11-11',
    },
    a6: {
        type: "datetime",
        value: '2012-02-02 12:53:04'
    },
}, ...]
```

> 4、colData属性

```
colData: [
    {
        title: "时间", // 该列表头名称
        props: "a1",  // 该列取rowData的项中的哪一项属性来使用，比如取rowData[x].a1则值为'a1'
        width: 120,   // 该列的宽度
        icon: 'time', // 该列的图标class（预先定义time/date/number/select/mul_select/edit值），设为其他值则需要完整传入图标的类名
        fixed: true   //是否属于左侧固定列（注意：固定列均要定义在普通列前面）
    },
    {
        title: "数字编辑",
        width: 120,
        props: "a2",
        icon: 'number',
        fixed: true
    },
    {
        title: "单选",
        width: 130,
        props: "a3",
        icon: 'select',
        // fixed: true
    },
    {
        title: "多选",
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
        title: "日期时间",
        width: 140,
        icon: 'date',
        props: "a6"
    },
    {
        title: "编辑",
        width: 140,
        icon: 'edit',
        props: "a7"
    },
    {
        title: "普通->",
        width: 140,
        props: "a8"
    },
    ...
],
```

> 5、其他属性

```
scrollSpeed：鼠标滚轮时的每次滚动行数（默认2，推荐1~3.5）

:showCheckBoxAndIndex：是否出现index索引和复选框
:onlyShowIndex：是否只出现index索引，不要复选框
showPrompt: 输入框文本溢出时是否出现tooltip提示框（默认true，设为false可提高性能）
:showOptionPage：下拉选择框是否分页（默认true）=== 分页接口会是?limit=&offset=&q=形式，不分页只有?q=
:option_limit：下拉选择每页的分页限制（默认400条）
:searchDelayTime：下拉的搜索输入时等待时间（默认400毫秒）

colRelation: 多级表头关系数组（注意：多级表头定义时子层级要有父层级，不然中间会排版错位）
let colRelation = [
	{
	  title: '层级2-1',  //表头名称
	  level: 2,          //表头层级，原始操作行的层级为1
	  indexStart: 2,     //从第2列开始
	  indexEnd: 6,       //到第6列结束（不填，默认到列尾）
	},
	{
	  title: '层级2-2',
	  level: 2,
	  indexStart: 6,
	  indexEnd: 15,
	},
	{
	  title: '层级3',
	  level: 3,
	  indexStart: 2,
	  indexEnd: 18,
	}
],

entry：表格增加一行时，所需要行格式，和rowData中的项类似

entry = {
    a1: {
        type: "time",
        // value、id 可以通过function返回一个值
        value: function(){
            return Date.now()
        }
    },
    a2: {
        type: "number",
        min: 0,
        max: 20,
        floatLength: 2,
        value: 13123
    },
    a3: {
        type: "select",
        url: '/static/select.json',
        dataPos: 'data.result',
        value: '',
        id: ''
    },
    a4: {
        type: "mul_select",
        url: '/static/select.json',
        dataPos: 'data.result',
        // 注意多选的value、id 必须是数组！
        value: function(){
            return []
        },
        id: function(){
            return []
        }
    },
    a5: {
        type: "date",
        value: ''
    },
    a6: {
        type: "datetime",
        value: ''
    },
    a7: {
        type: "edit",
        value: ''
    },
}
```

> 6、关键组件事件

```
@selectChange="selectChange"  //单选和多选下拉选择一项后，触发该事件，参数是选择后的关键信息

// 当entry被定义后，可以执行该函数触发增加一行
this.$refs.database.addLine();

// 获取组件所有信息
let rows = this.$refs.database.getTable;

// 重新调整表格布局
this.$refs.database.doLayout();

// 对表格进行有效性required验证（true表示验证通过）
let msg = this.$refs.database.checkRequired();

// 获取被复选框勾选的行信息
let checkedRows = this.$refs.database.checkedRows;

// 重置表格（技巧：getTable获取组件所有信息后，处理所得数据，再通过 colData、rowData 重新传入到组件属性，然后进行 doReset 即可更新表格）
this.$refs.database.doReset();

```
