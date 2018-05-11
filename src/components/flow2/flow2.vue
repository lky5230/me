<template>
  <div class="flow">
    <!-- 工具栏 -->
    <div class="tool clearfix">
        <!-- 撤销 -->
        <span @click="recordChange('back')" title="撤销" class="tool-item fl">
            <svg class="tool-item-svg" aria-hidden="true">
                <use :xlink:href="'#'+iconfont1[2]"></use>
            </svg>
        </span>
        <!-- 还原 -->
        <span @click="recordChange('forward')" title="还原" class="tool-item fl">
            <svg class="tool-item-svg" aria-hidden="true">
                <use :xlink:href="'#'+iconfont1[5]"></use>
            </svg>
        </span>
        <!-- 删除 -->
        <span @click="deleteMap" title="删除" class="tool-item fl" style="margin-left: 32px;">
            <svg class="tool-item-svg" aria-hidden="true">
                <use :xlink:href="'#'+iconfont2[42]"></use>
            </svg>
        </span>
        <!-- 保存 -->
        <span @click="save" title="保存" class="tool-item fl">
            <svg class="tool-item-svg" aria-hidden="true">
                <use :xlink:href="'#'+iconfont2[43]"></use>
            </svg>
        </span>
        <i class="show-scale-text">比例：{{(scale*100).toFixed(2) + '%'}}</i>
        

        <!-- 画线 -->
        <span @click="sketchLine = !sketchLine" title="画线" class="tool-item fr">
            <svg class="tool-item-svg" aria-hidden="true">
                <use :xlink:href="'#'+iconfont1[68]"></use>
            </svg>
        </span>

    </div>

    <div class="main">

        <!-- 侧边栏 -->
        <div class="side">

            <div class="side-item">
                <div @click="sideItemShow1 = !sideItemShow1" class="side-item-title">
                    基本 
                    <i v-show="!sideItemShow1" class="fa fa-angle-right"></i>
                    <i v-show="sideItemShow1" class="fa fa-angle-down"></i>
                </div>
                <div v-show="sideItemShow1" class="side-item-content">
                    <span
                        v-for="ifont in [
                            iconfont1[76],
                            iconfont1[75],
                            iconfont1[74],
                            iconfont1[73],
                            iconfont1[72],
                            iconfont1[71],
                            iconfont1[70],
                            iconfont1[69], 
                            iconfont2[13]
                        ]"
                        :key="ifont"
                        @dragstart="sideDragStart(ifont)"
                        @dragover.prevent
                        @drag.prevent="sideDrag($event)"
                        draggable="true"
                        style="display: inline-block;">
                        <svg width="40" height="40">
                            <g>
                                <use 
                                    :x="0" 
                                    :y="0"
                                    width="30"
                                    height="30"
                                    :xlink:href="'#'+ifont">
                                </use>
                            </g>
                        </svg>
                    </span>
                </div>
            </div>
            <div class="side-item">
                <div @click="sideItemShow2 = !sideItemShow2" class="side-item-title">
                    其他
                    <i v-show="!sideItemShow2" class="fa fa-angle-right"></i>
                    <i v-show="sideItemShow2" class="fa fa-angle-down"></i>
                </div>
                <div style="max-height: 200px; overflow: auto;" v-show="sideItemShow2" class="side-item-content">
                    <span
                        v-for="ifont in allIcon"
                        :key="ifont"
                        @dragstart="sideDragStart(ifont)"
                        @dragover.prevent
                        @drag.prevent="sideDrag($event)"
                        draggable="true"
                        style="display: inline-block;">
                        <svg width="40" height="40">
                            <g>
                                <use 
                                    :x="0" 
                                    :y="0"
                                    width="30"
                                    height="30"
                                    :xlink:href="'#'+ifont">
                                </use>
                            </g>
                        </svg>
                    </span>
                </div>
            </div>

            <div class="side-item">
                <div @click="sideItemShow3 = !sideItemShow3" class="side-item-title">
                    选中元素
                    <i v-show="!sideItemShow3" class="fa fa-angle-right"></i>
                    <i v-show="sideItemShow3" class="fa fa-angle-down"></i>
                </div>
                <div style="height: 200px; overflow: auto;" v-show="sideItemShow3" class="side-item-content">
                    <!-- 图形编辑 -->
                    <template v-if="selectedObj.type == 'flowData'">
                        <label class="edit-block">
                            <span class="edit-block-1">
                                ID
                            </span>
                            <span class="edit-block-2">
                                {{selectedObj.id}}
                            </span>
                        </label>
                        <label class="edit-block">
                            <span class="edit-block-1">
                                图形
                            </span>
                            <span class="edit-block-2">
                                <select 
                                    :value="getById(selectedObj.id).icon" 
                                    @change="inputValue($event, 'flowData', 'icon')">
                                    <option 
                                        :key="'iconItem'+iconItem"
                                        v-for="iconItem in allIcon" 
                                        :value="iconItem">
                                        {{iconItem}}
                                    </option>
                                </select>
                            </span>
                        </label>
                        <label class="edit-block">
                            <span class="edit-block-1">
                                颜色
                            </span>
                            <span class="edit-block-2">
                                <input type="color" @change="inputValue($event, 'flowData', 'fill')" style="width: 40px" :value="selectedObj.fill" />
                            </span>
                        </label>   
                        <label class="edit-block">
                            <span class="edit-block-1">
                                宽度
                            </span>
                            <span class="edit-block-2">
                                <input 
                                    type="number" 
                                    @input="inputValue($event, 'flowData', 'width')"
                                    :value="selectedObj.width" />
                            </span>
                        </label>
                        <label class="edit-block">
                            <span class="edit-block-1">
                                高度
                            </span>
                            <span class="edit-block-2">
                                <input 
                                    type="number" 
                                    @input="inputValue($event, 'flowData', 'height')"
                                    :value="selectedObj.height" />
                            </span>
                        </label>

                    </template>

                    <!-- 线条编辑 -->
                    <template v-else-if="selectedObj.type == 'lineData'">
                        <label class="edit-block">
                            <span class="edit-block-1">
                                ID
                            </span>
                            <span class="edit-block-2">
                                {{selectedObj.id}}
                            </span>
                        </label>
                        <label class="edit-block">
                            <span class="edit-block-1">
                                颜色
                            </span>
                            <span class="edit-block-2">
                                <input type="color" @change="inputValue($event, 'lineData', 'stroke')" style="width: 40px" :value="selectedObj.stroke" />
                            </span>
                        </label>   
                        <label class="edit-block">
                            <span class="edit-block-1">
                                虚线
                            </span>
                            <input 
                            style="display: inline-block; width: 16px;" 
                            type="checkbox" 
                            :checked="getById(selectedObj.id).dash"
                            @change="changeCheck($event, 'lineData', 'dash')" />
                        </label>      
                        <label class="edit-block">
                            <span class="edit-block-1">
                                线宽
                            </span>
                            <span class="edit-block-2">
                                <input type="number" @input="inputValue($event, 'lineData', 'strokeWidth')" :value="selectedObj.strokeWidth" />
                            </span>
                        </label>         
                    </template>

                    <!-- 文本编辑 -->
                    <template v-else-if="selectedObj.type == 'textData'">
                        <label class="edit-block">
                            <span class="edit-block-1">
                                ID
                            </span>
                            <span class="edit-block-2">
                                {{selectedObj.id}}
                            </span>
                        </label>
                        <label class="edit-block">
                            <span class="edit-block-1">
                                颜色
                            </span>
                            <span class="edit-block-2">
                                <input type="color" @change="inputValue($event, 'textData', 'fill')" style="width: 40px" :value="selectedObj.fill" />
                            </span>
                        </label>   
                        <div class="edit-block" style="display: flex;">
                            <span class="edit-block-1">
                                文本
                            </span>
                            <div class="edit-block-2">
                                <i 
                                    v-show="selectedObj.tspan.length == 0"
                                    @click="textClick('add', 0)" 
                                    class="fa fa-plus">
                                </i>
                                <div 
                                    v-for="(text, textIndex) in selectedObj.tspan" 
                                    :key="'text' + textIndex"
                                    style="position: relative; margin-bottom: 6px;">
                                    <input
                                        @input="textEdit($event, textIndex)"
                                        type="text" 
                                        :value="text" />
                                    <i 
                                        @click="textClick('add', textIndex)" 
                                        class="fa fa-plus edit-block-fa-1">
                                    </i>
                                    <i 
                                        @click="textClick('remove', textIndex)" 
                                        class="fa fa-minus edit-block-fa-2">
                                    </i>
                                </div>
                            </div>
                        </div>               
                    </template>

                    <template v-else>
                        <i v-if="selected.length <= 1" class="innfo">请选择1个图形或文本</i>            
                        <i v-else class="innfo">已选中多个</i>            
                    </template>
                </div>
            </div>

            <div class="side-item">
                <div @click="sideItemShow4 = !sideItemShow4" class="side-item-title">
                    页面元素
                    <i v-show="!sideItemShow4" class="fa fa-angle-right"></i>
                    <i v-show="sideItemShow4" class="fa fa-angle-down"></i>
                </div>
                <div v-show="sideItemShow4" class="side-item-content">
                    <div 
                        class="allData-item" 
                        :class="{
                            active: isInSelected(ad.id)
                        }"
                        @click="selected = selectMap(ad.id, {unique: true})"
                        v-for="(ad, adIndex) in allData" 
                        :key="ad.id+adIndex">
                        <i :class="[ad.icon]"></i>
                        <span>{{ad.desc}}</span>
                        <i 
                            style="color: red; margin-right: 4px; margin-left: 4px;" 
                            v-show="ad.problem != ''" 
                            class="fa fa-exclamation">
                        </i>
                        <span v-show="ad.problem != ''">
                            问题：{{ad.problem}}
                        </span>
                    </div>
                </div>
            </div>

        </div>

        <!-- 主体画域 -->
        <div 
            class="draw-content" 
            ref="container"
            @mousedown="containerDown" 
            @mousewheel.stop.prevent="containerWheel"

            @mousemove="containerMove" 
            @click="containerClick"

            @dragover.prevent
            @drop.prevent="containerDrop">

            <transition name="fade">
                <div v-show="sketchLine" class="sketchLinng">
                    <span
                        v-if="sketchData.length > 1" 
                        @click="confirmSketchLine" 
                        class="confirm">
                        完成
                    </span>
                    <span class="info">线条绘制中...</span>
                </div>
            </transition>
            

            <svg width="100%" height="100%">

                <defs>
                    <filter id="f4" x="0" y="0" width="200%" height="200%">
                        <feOffset result="offOut" in="SourceAlpha" dx="20" dy="20" />
                        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="10" />
                        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                    </filter>
                </defs>

                <g :transform="'translate('+translateX+' '+translateY+') scale('+scale+')'">

                    <!-- iconfont1 图标集合展示 [不能删除！] -->
                    <!-- <g v-for="(ifont, ifontIndex) in iconfont1" :key="ifont">
                        <use 
                            :x="ifontIndex*30 + 30" 
                            :y="160"
                            width="160"
                            height="30"
                            :xlink:href="'#'+ifont">
                        </use>
                        <text 
                            :x="ifontIndex*30 + 100" 
                            width="25"
                            :y="200">
                            {{ifontIndex}}
                        </text>
                    </g> -->
                    <!-- iconfont2 图标集合展示 [不能删除！] -->
                    <!-- <g v-for="(ifont, ifontIndex) in iconfont2" :key="ifont">
                        <use 
                            :x="ifontIndex*30 + 30" 
                            :y="220"
                            width="160"
                            height="30"
                            :xlink:href="'#'+ifont">
                        </use>
                        <text 
                            :x="ifontIndex*30 + 100" 
                            width="25"
                            :y="260">
                            {{ifontIndex}}
                        </text>
                    </g> -->

                    <!-- 渲染 flowData -->
                    <g 
                        v-for="flowDataItem in flowData"
                        :key="flowDataItem.id">
                        <use
                            :x="flowDataItem.x" 
                            :y="flowDataItem.y"
                            :width="flowDataItem.width"
                            :height="flowDataItem.height"
                            :fill="flowDataItem.fill"
                            :filter="selectMap(flowDataItem.id, {onlyCheck: true})? 'url(#f4)': ''"
                            :xlink:href=" '#' + flowDataItem.icon">
                        </use>
                        <rect
                            :x="+flowDataItem.x" 
                            :y="+flowDataItem.y"
                            :width="+flowDataItem.width"
                            :height="+flowDataItem.height"
                            @mousedown.stop="flowMouseDown($event, flowDataItem)" 
                            stroke="#999"
                            stroke-width="0"
                            fill="rgba(0, 0, 0, 0)"
                            style="cursor: move;">
                            <!-- crosshair -->
                        </rect>
                    </g>

                    <!-- 渲染 lineData -->
                    <g 
                        v-for="computeLineDataItem in computeLineData" 
                        :key="computeLineDataItem.id">
                        <path 
                            :d="computeLineDataItem._path" 
                            :stroke="computeLineDataItem.stroke" 
                            :stroke-width="computeLineDataItem.strokeWidth"
                            :stroke-dasharray="'10 ' + (computeLineDataItem.dash? 10: 0)"
                            @mousedown.stop="lineMouseDown($event, computeLineDataItem)" 
                            :filter="selectMap(computeLineDataItem.id, {onlyCheck: true})? 'url(#f4)': ''"
                            fill="none" 
                            style="cursor: move;" />
                    </g>

                    <!-- 渲染 textData -->
                    <g 
                        v-for="textDataItem in textData" 
                        :key="textDataItem.id">
                        <text 
                            :x="textDataItem.x" 
                            :y="textDataItem.y" 
                            :fill="textDataItem.fill"
                            :filter="selectMap(textDataItem.id, {onlyCheck: true})? 'url(#f4)': ''"
                            @mousedown.stop="textMouseDown($event, textDataItem)"
                            style="cursor: move;" >
                                <tspan 
                                    v-for="(t, tIndex) in textDataItem.tspan" 
                                    :x="textDataItem.x" 
                                    :y="+textDataItem.y + 14*(tIndex+1)"
                                    :key="tIndex">
                                    {{t}}
                                </tspan>
                        </text>
                    </g>

                    <!-- 素描线条 -->
                    <g>
                        <path 
                            :d="computeSketchData + computeSketchEnd"
                            stroke="#bbb" 
                            stroke-dasharray="10 10"
                            stroke-width="2"
                            fill="none" />
                    </g>

                    


                </g>
            </svg>
        </div>

    </div>
  </div>
</template>

<script>
import './iconfont1.js'
import './iconfont2.js'
/*  
    图层
    贝塞尔曲线绘制
*/


export default {
    name: 'FLOW2',
    props: {

    },
    data(){
        return {
            //预制图标1
            iconfont1: [
                'icon-expand',
                'icon-narrow',
                "icon-undo",
                "icon-search",
                "icon-rcslogo" ,
                "icon-redo",
                "icon-down-arrow",
                "icon-up-arrow", 
                "icon-remove", 
                "icon-suofang",
                "icon-fangda",
                "icon-lianjie",
                "icon-xingxing",
                "icon-sousuo",
                "icon-jiesuo",
                "icon-suodingmima",
                "icon-shanchu",
                "icon-yonghu" ,
                "icon-bianji" ,
                "icon-tianjiayonghu",
                "icon-shezhi",
                "icon-sheding",
                "icon-yonghuzu",
                "icon-wenjian",
                "icon-chazhaowenjian",
                "icon-wenjianjia",
                "icon-jisuanqi",
                "icon-wenjianliebiao",
                "icon-shoucang",
                "icon-fenxiang",
                "icon-qichemada",
                "icon-qichexuanfu",
                "icon-panshizhidongqi",
                "icon-fangxiangpan",
                "icon-dianji",
                "icon-lihe",
                "icon-yazhujian",
                "icon-straight" ,
                "icon-standard-service",
                "icon-firewall",
                "icon-firewall-fire",
                "icon-server",
                "icon-unknown-device",
                "icon-layer-three-switch",
                "icon-hubs" ,
                "icon-switch",
                "icon-router",
                "icon-database",
                "icon-business-services",
                "icon-building",
                "icon-host-hardware",
                "icon-network-server",
                "icon-printer",
                "icon-gun-camera",
                "icon-dome-camera",
                "icon-monitor",
                "icon-middleware",
                "icon-virtual-device",
                "icon-network",
                "icon-jiagongzh,ongxin",
                "icon-kongjianhanbi",
                "icon-gongchang",
                "icon-gongchang1",
                "icon-chechuangjiqiren",
                "icon-duidaoyi",
                "icon-kongzhizhongxin",
                "icon-kongzhizhongxin-copy",
                "icon-jiqishebei",
                "icon-zhexianjiantou1",
                "icon-process",
                "icon-decision",
                "icon-document",
                "icon-data",
                "icon-manualInput",
                "icon-terminator",
                "icon-storeData",
                "icon-start",
            ],
            //预制图标2
            iconfont2: [
                "icon-chexiao",
                "icon-48",
                "icon-185024computerimac",
                "icon-185039earthglobestreamline",
                "icon-jiedianziliucheng",
                "icon-hulianwang",
                "icon-rect",
                "icon-lingxing",
                "icon-yuanjiao-rect",
                "icon-circle",
                "icon-tuoyuanxingdeoval33",
                "icon-yidonghulianwang",
                "icon-huaxuegongye",
                "icon-wenben",
                "icon-gongyesheshi",
                "icon-bangongdalou",
                "icon-guozi",
                "icon-yibiaopan",
                "icon-wo",
                "icon-cailiaojinchang",
                "icon-gaikuang",
                "icon-jishuziliao",
                "icon-tuzhiguanli",
                "icon-shigongjilu",
                "icon-quanjingguanli",
                "icon-shigongjiaodi",
                "icon-tuzhitaizhang",
                "icon-wentiguanli",
                "icon-wentitongji",
                "icon-KPIweihu",
                "icon-daibanshixiang",
                "icon-fenxianggongchengzhiliangjianyanjilu",
                "icon-gongchengbaoyan",
                "icon-jianyanpifenxianggongchengbaoyan",
                "icon-liuchengweituo",
                "icon-huanshigong",
                "icon-qianshourenwu",
                "icon-yanshoujilu",
                "icon-weituowode",
                "icon-zonghefenxi",
                "icon-chanpin",
                "icon-wuliuC",
                "icon-ziyuan",
                "icon-baocun",
                "icon-dalou",
                "icon-feiji",
                "icon-gongjiaoche",
                "icon-qiache",
                "icon-shangdian",
                "icon-zhuye",
                "icon-zhuyi"
            ],
            //侧边栏展开搜索
            sideItemShow1: true,
            sideItemShow2: true,
            sideItemShow3: true,
            sideItemShow4: true,

            //平移、缩放
            translateX: 0,
            translateY: 0,
            scale: 1,

            //实时记录集合
            record: [],
            //目前的记录索引
            recordIndex: 0,

            //键盘按下了哪些键
            ctrl: false,
            shift: false,
            key_Z: false,
            key_Y: false,
            key_C: false,
            key_V: false,
            del: false,
            up: false,
            down: false,
            left: false,

            //正在从侧边栏拖拽的元素
            sideDragIcon: '',
            //是否处于描线状态中
            sketchLine: false,

            //主体处于正在拖拽状态时的clientX、clientY数值
            dragMoveX: 0,
            dragMoveY: 0,

            //选中的元素集合（图形、线条、文本），若只有一个元素则可以进行（编辑、拖动）等操作
            selected: [],
            //粘贴板
            clipboard: [],

            //描线数据
            sketchData: [],
            //描线终点数据
            sketchEnd: [],

            //1、图形数据
            flowData: [
                {
                    id: 'flowData-1525648573',
                    type: 'flowData',
                    icon: 'icon-lianjie',
                    fill: "#0000ff",
                    x: 10,
                    y: 10,
                    width: 100,
                    height: 100,
                },
                {
                    id: 'flowData-1525648574',
                    type: 'flowData',
                    icon: 'icon-tuzhitaizhang',
                    fill: "#f00f00",
                    x: 120,
                    y: 410,
                    width: 100,
                    height: 100,
                }
            ],
            //2、线条数据
            lineData: [
                {
                    id: 'lineData-1525648574',
                    type: 'lineData',
                    stroke: "#ff0000",
                    strokeWidth: 2,
                    dash: false,
                    d: [
                        {
                            action: 'M',
                            data: [110, 60]
                        },
                        {
                            action: 'L',
                            data: [170, 60]
                        },
                        {
                            action: 'L',
                            data: [170, 410]
                        }
                    ]
                }
            ],
            //3、文本数据
            textData: [
                {
                    id: 'textData-1525648573',
                    type: 'textData',
                    tspan: ['文本测试数据2', '文本测试数据3'],
                    x: 30,
                    y: 320,
                    fill: "#ff0000",
                },
            ],
 
        }
    },

    computed: {
        //所有的图标
        allIcon(){
            return [...this.iconfont1, ...this.iconfont2];
        },
        //所有图形、线条、文本-作为图层
        allData(){
            let res = [];
            for(let i=0; i<this.flowData.length; i++){
                let problem = ''
                if(this.flowData[i].width <= 0){
                    problem += '宽度小于0！'
                }
                if(this.flowData[i].height <= 0){
                    problem += '高度小于0！'
                }
                res.push({
                    type: 'flowData',
                    icon: 'fa fa-picture-o',
                    id: this.flowData[i].id,
                    desc: 'flow  ',
                    problem: problem
                })
            }
            for(let i=0; i<this.lineData.length; i++){
                let problem = ''
                if(this.lineData[i].strokeWidth <= 0){
                    problem += '线宽小于0！'
                }
                res.push({
                    type: 'lineData',
                    icon: 'fa fa-link',
                    id: this.lineData[i].id,
                    desc: 'line  ',
                    problem: problem
                })
            }
            for(let i=0; i<this.textData.length; i++){
                let problem = ''
                if(this.textData[i].tspan.every(item => (item+'').trim() == '')){
                    problem += 'tspan 均为空！'
                }
                res.push({
                    type: 'textData',
                    icon: 'fa fa-file-text-o',
                    id: this.textData[i].id,
                    desc: 'text  ',
                    problem: problem
                })
            }
            return res;
        },
        //整理-线条数据格式
        computeLineData(){
            let data = this.jsonClone(this.lineData);
            for(let i=0; i<data.length; i++){
                let d = this.jsonClone(data[i].d);
                let path = '';
                for(let j=0; j<d.length; j++){
                    path += d[j].action + d[j].data.join(' ');
                }
                data[i]._path = path;
            }
            return data;
        },
        //整理-描线数据格式
        computeSketchData(){
            let sketchData = this.jsonClone(this.sketchData);
            let d = '';
            for(let i=0; i<sketchData.length; i++){
                if(i==0){
                    d += `M${sketchData[i][0]} ${sketchData[i][1]}`;
                }else{
                    d += `L${sketchData[i][0]} ${sketchData[i][1]}`;
                }
            }
            return d;
        },
        //整理-描线终点数据格式
        computeSketchEnd(){
            if(this.sketchEnd.length <= 1){
                return '';
            }
            return `L${this.sketchEnd[0]} ${this.sketchEnd[1]}`;
        },
        //单个选中的元素，用于编辑
        selectedObj(){
            if(this.selected.length == 1){
                let flowData = this.jsonClone(this.flowData);
                let lineData = this.jsonClone(this.lineData);
                let textData = this.jsonClone(this.textData);
                let selectedId = this.selected[0]
                //图形
                for(let j=0; j<flowData.length; j++){
                    if(flowData[j].id == selectedId){
                        let _flow = this.jsonClone(flowData[j]);
                        return {
                            id: _flow.id,
                            type: "flowData",
                            fill: _flow.fill,
                            icon: _flow.icon,
                            width: _flow.width,
                            height: _flow.height,
                        }
                    }
                }
                //线条
                for(let j=0; j<lineData.length; j++){
                    if(lineData[j].id == selectedId){
                        let _line = this.jsonClone(lineData[j]);
                        return {
                            id: _line.id,
                            type: "lineData",
                            stroke: _line.stroke,
                            strokeWidth: _line.strokeWidth,
                        }
                    }
                }
                //文本
                for(let j=0; j<textData.length; j++){
                    if(textData[j].id == selectedId){
                        let _text = this.jsonClone(textData[j]);
                        return {
                            id: _text.id,
                            type: 'textData',
                            fill: _text.fill,
                            tspan: _text.tspan,
                        }
                    }
                }
            }
            return false;
        },
    },

    watch: {
        
    },

    created(){
        this.initRecord();
    },

    mounted(){
        document.addEventListener('keydown', this.docKeyDown);
        document.addEventListener('keyup', this.docKeyUp);
    },

    methods: {
        print(m){
            console.log(m)
        },
        //初始化记录
        initRecord(){
            this.record.push({
                flowData: this.jsonClone(this.flowData),
                lineData: this.jsonClone(this.lineData),
                textData: this.jsonClone(this.textData),
                _t: Date.now(),
            });
            this.recordIndex = this.record.length - 1;
        },
        //增加一个记录
        recordAdd(){
            let record = this.jsonClone(this.record);
            if(this.recordIndex != record.length - 1){
                //表示经过了回退，那么再增加记录时，需要清除回退过的记录
                record = this.jsonClone(record.slice(0, this.recordIndex + 1));
            };
            record.push({
                flowData: this.flowData,
                lineData: this.lineData,
                textData: this.textData,
                _t: Date.now()
            });
            this.record = record;
            this.recordIndex = this.record.length - 1;
        },
        //撤销、还原记录
        recordChange(type){
            let record = this.jsonClone(this.record);
            this.selected = [];

            if(type == 'back'){
                this.recordIndex = Math.max(this.recordIndex - 1, 0);
                this.flowData = record[this.recordIndex].flowData;
                this.lineData = record[this.recordIndex].lineData;
                this.textData = record[this.recordIndex].textData;
            }
            if(type == 'forward'){
                this.recordIndex = Math.min(this.recordIndex + 1, record.length - 1);
                this.flowData = record[this.recordIndex].flowData;
                this.lineData = record[this.recordIndex].lineData;
                this.textData = record[this.recordIndex].textData;
            }
        },

        //容器缩放
        containerWheel(e){
            let vm = this;
            if (e.wheelDelta) {
                if (e.wheelDelta > 0) {
                    //向上
                    scale(0.1);
                }
                if (e.wheelDelta < 0) {
                    //向下
                    scale(-0.1);
                }
            } else if (e.detail) {
                if (e.detail > 0) {
                    //向上
                    scale(0.1);
                }
                if (e.detail < 0) {
                    //向下
                    scale(-0.1);
                }
            };
            function scale(num){
                let s = vm.scale;
                s += num;
                s = Math.max(0.1, s);
                vm.scale = s;
            }
        },
        //容器平移
        containerDown(e){
            e.preventDefault();
            this.selected = [];
            let vm = this;
            let startX = e.clientX;
            let startY = e.clientY;
            let x = vm.translateX;
            let y = vm.translateY;
            
            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);
            function mousemove(ev){
                let disX = ev.clientX - startX;
                let disY = ev.clientY - startY;
                vm.translateY = y + disY;
                vm.translateX = x + disX;
            };
            function mouseup(){
                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            };
        },

        //根据两个坐标，生成棱角坐标
        getRecCoods(x0, y0, x1, y1){
            let dy = Math.abs(y1 - y0);
            let dx = Math.abs(x1 - x0);
            if(dy < dx){
                return [x0, y1];
            }else{
                return [x1, y0];
            }
        },
        //容器点击
        containerClick(e){
            if(this.sketchLine){
                //1、描线状态中
                let bounding = this.$refs.container.getBoundingClientRect();
                let x = (e.clientX - bounding.x- this.translateX) / this.scale;
                let y = (e.clientY - bounding.y- this.translateY) / this.scale;
                //按住了shift键
                if(this.shift){
                    let sketchData = this.jsonClone(this.sketchData);
                    let skeLen = sketchData.length - 1;
                    let endCoods = this.getRecCoods(
                        x, 
                        y, 
                        sketchData[skeLen][0], 
                        sketchData[skeLen][1]
                    );
                    this.sketchData.push([endCoods[0], endCoods[1]]);
                }
                //没有按住shift键
                else{
                    this.sketchData.push([x, y]);
                };
            }else{
                //2、非描线状态

            }
        },
        //容器mousemove
        containerMove(e){
            if(this.sketchLine){
                //1、描线状态中
                if(this.sketchData.length == 0){
                    this.sketchEnd = [];
                }else{
                    let bounding = this.$refs.container.getBoundingClientRect();
                    let x = (e.clientX - bounding.x- this.translateX) / this.scale;
                    let y = (e.clientY - bounding.y- this.translateY) / this.scale;
                    //按住了shift键
                    if(this.shift){
                        let sketchData = this.jsonClone(this.sketchData);
                        let skeLen = sketchData.length - 1;
                        let endCoods = this.getRecCoods(
                            x, 
                            y, 
                            sketchData[skeLen][0], 
                            sketchData[skeLen][1]
                        );
                        this.sketchEnd = [endCoods[0], endCoods[1]];
                    }
                    //没有按住shift键
                    else{
                        this.sketchEnd = [x, y];
                    };
                }
            }else{
                //2、非描线状态

            }
        },
        //完成描线（加入到lineData中）
        confirmSketchLine(){
            let d = []
            if(this.sketchData.length > 1){
                for(let i=0; i<this.sketchData.length; i++){
                    if(i == 0){
                        d.push({
                            action: 'M',
                            data: [this.sketchData[0][0], this.sketchData[0][1]],
                        })
                    }else{
                        d.push({
                            action: 'L',
                            data: [this.sketchData[i][0], this.sketchData[i][1]],
                        })
                    }
                };
                let line = this.jsonClone({
                    id: 'lineData-' + Date.now(),
                    type: 'lineData',
                    stroke: '#afafaf',
                    strokeWidth: 4,
                    d: d,
                });
                this.lineData.push(line);
            };
            this.sketchData = [];
            this.sketchEnd = [];
            this.sketchLine = false;
            this.recordAdd();
        },

        //侧边栏-开始拖拽元素
        sideDragStart(icon){
            this.sideDragIcon = icon;
        },
        //侧边栏-持续拖拽元素中
        sideDrag(e){
            this.dragMoveX = e.clientX;
            this.dragMoveY = e.clientY;
        },
        //主体接受侧边栏拖拽元素drop
        containerDrop(){
            let bounding = this.$refs.container.getBoundingClientRect();
            if(this.sideDragIcon){
                if(this.sideDragIcon == 'icon-wenben'){
                    //侧边栏-文本
                    this.textData.push({
                        id: 'textData-' + Date.now(),
                        type: 'textData',
                        tspan: ['自定义文本'],
                        x: (this.dragMoveX - bounding.x- this.translateX) / this.scale,
                        y: (this.dragMoveY - bounding.y - this.translateY) / this.scale,
                        width: 100,
                        height: 100,
                        fill: "#999999",
                    });
                }else{
                    //侧边栏-图形
                    this.flowData.push({
                        id: 'flowData-' + Date.now(), 
                        type: 'flowData',
                        icon: this.sideDragIcon,
                        x: (this.dragMoveX - bounding.x- this.translateX) / this.scale,
                        y: (this.dragMoveY - bounding.y - this.translateY) / this.scale,
                        width: 100,
                        height: 100,
                        fill: "#999999",
                    });
                }
                this.sideDragIcon = '';
                this.recordAdd();
            };
        },

        // 选中元素集合（1、保持唯一，2、存在就删除，没有就添加，3、只检查id是否已存在）
        selectMap(id, {unique = false, async = false, onlyCheck = false} = {}){
            let selected = this.jsonClone(this.selected);
            //保持唯一
            if(unique == true){
                return [id];
            };
            //存在就删除，没有就添加
            if(async == true){
                let have = false;
                for(let i=0; i<selected.length; i++){
                    if(selected[i] == id){
                        selected.splice(i, 1);
                        have = true;
                        break ;
                    }
                }
                if(!have){
                    selected.push(id);
                }
                return selected;
            };
            //只检查id是否已存在
            if(onlyCheck == true){
                for(let i=0; i<selected.length; i++){
                    if(selected[i] == id){
                        return true;
                    }
                }
                return false;
            };
        },
        // 看id是否在selected中
        isInSelected(id){
            for(let i=0; i<this.selected.length; i++){
                if(this.selected[i] == id){
                    return true;
                };
            };
            return false;
        },

        //拖拽-图形
        flowMouseDown(e, flow){
            e.preventDefault();
            if(this.ctrl){
                this.selected = this.selectMap(flow.id, {async: true});
            }else{
                this.selected = this.selectMap(flow.id, {unique: true});
            };
            let vm = this;
            let startX = e.clientX;
            let startY = e.clientY;
            let flowX = flow.x;
            let flowY = flow.y;
            let flowData = vm.jsonClone(vm.flowData);
            

            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);

            function mousemove(ev){
                let disX = ev.clientX - startX;
                let disY = ev.clientY - startY;
                for(let i=0; i<flowData.length; i++){
                    if(flowData[i].id == flow.id){
                        flowData[i].x = (flowX + disX / vm.scale);
                        flowData[i].y = (flowY + disY / vm.scale);
                        break ;
                    }
                }
                vm.flowData = flowData;
            };
            function mouseup(){
                vm.recordAdd();
                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            };
        },
        //拖拽-线条
        lineMouseDown(e, line){
            e.preventDefault();
            if(this.ctrl){
                this.selected = this.selectMap(line.id, {async: true});
            }else{
                this.selected = this.selectMap(line.id, {unique: true});
            }
            let vm = this;
            let startX = e.clientX;
            let startY = e.clientY;

            let lineData = vm.jsonClone(vm.lineData);
            let lineData2 = vm.jsonClone(vm.lineData);

            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);

            function mousemove(ev){
                let disX = ev.clientX - startX;
                let disY = ev.clientY - startY;
                for(let i=0; i<lineData.length; i++){
                    if(lineData[i].id == line.id){
                        for(let j=0; j<lineData[i].d.length; j++){
                            if(lineData[i].d[j].data && lineData[i].d[j].data.length != 0){
                                for(let k=0; k<lineData[i].d[j].data.length; k++){
                                    if(k%2 == 0){
                                        lineData[i].d[j].data[k] = +lineData2[i].d[j].data[k] + +disX/vm.scale;
                                    }else{
                                        lineData[i].d[j].data[k] = +lineData2[i].d[j].data[k] + +disY/vm.scale;
                                    }
                                }
                            }
                        }
                        break ;
                    }
                }
                vm.lineData = vm.jsonClone(lineData);
            };
            function mouseup(){
                vm.recordAdd();
                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            };
        },
        //拖拽-文本
        textMouseDown(e, text){
            e.preventDefault();
            if(this.ctrl){
                this.selected = this.selectMap(text.id, {async: true});
            }else{
                this.selected = this.selectMap(text.id, {unique: true});
            }
            let vm = this;
            let startX = e.clientX;
            let startY = e.clientY;
            let textX = text.x;
            let textY = text.y;
            let textData = vm.jsonClone(vm.textData);

            window.addEventListener('mousemove', mousemove);
            window.addEventListener('mouseup', mouseup);

            function mousemove(ev){
                let disX = ev.clientX - startX;
                let disY = ev.clientY - startY;
                for(let i=0; i<textData.length; i++){
                    if(textData[i].id == text.id){
                        textData[i].x = (textX + disX / vm.scale);
                        textData[i].y = (textY + disY / vm.scale);
                        break ;
                    }
                }
                vm.textData = textData;
            };
            function mouseup(){
                vm.recordAdd();
                window.removeEventListener('mousemove', mousemove);
                window.removeEventListener('mouseup', mouseup);
            };
        },


        //删除选中项
        deleteMap(){
            let flowData = this.jsonClone(this.flowData);
            let lineData = this.jsonClone(this.lineData);
            let textData = this.jsonClone(this.textData);

            for(let i=0; i<this.selected.length; i++){

                let _deleteCur = false;

                for(let j=0; j<flowData.length; j++){
                    if(flowData[j].id == this.selected[i]){
                        flowData.splice(j, 1);
                        _deleteCur = true;
                        break ;
                    }
                }

                if(_deleteCur) continue ;

                for(let j=0; j<lineData.length; j++){
                    if(lineData[j].id == this.selected[i]){
                        lineData.splice(j, 1);
                        _deleteCur = true;
                        break ;
                    }
                }

                if(_deleteCur) continue ;

                for(let j=0; j<textData.length; j++){
                    if(textData[j].id == this.selected[i]){
                        textData.splice(j, 1);
                        _deleteCur = true;
                        break ;
                    }
                }

            };
            this.flowData = flowData;
            this.lineData = lineData;
            this.textData = textData;
            this.selected = [];
            this.recordAdd();
        },
        //复制、粘贴选中的元素
        copyOrPasteSelectMap(type){
            let selected = this.jsonClone(this.selected);
            if(selected.length == 0) return ;

            if(type == 'copy'){
                this.clipboard = selected;
            }

            if(type == 'paste'){
                let flowData = this.jsonClone(this.flowData);
                let lineData = this.jsonClone(this.lineData);
                let textData = this.jsonClone(this.textData);
                let selected = this.jsonClone(this.clipboard);

                for(let i=0; i<selected.length; i++){
                    //图形
                    let _findCur = false;
                    for(let j=0; j<flowData.length; j++){
                        if(flowData[j].id == selected[i]){
                            let _flow = this.jsonClone(flowData[j]);
                            _flow.id = 'flowData-' + Date.now() + '' + i;
                            _flow.x = _flow.x + 20;
                            _flow.y = _flow.y + 20;
                            flowData.push(_flow);
                            _findCur = true;
                            break ;
                        }
                    }
                    if(_findCur) continue ;
                    //线条
                    for(let j=0; j<lineData.length; j++){
                        if(lineData[j].id == selected[i]){
                            let _line = this.jsonClone(lineData[j]);
                            _line.id = 'lineData-' + Date.now() + '' + i;
                            let ddd = this.jsonClone(_line.d)
                            for(let m=0; m<ddd.length; m++){
                                for(let n=0; n<ddd[m].data.length; n++){
                                    ddd[m].data[n] = ddd[m].data[n] + 20;
                                }
                            }
                            _line.d = ddd;
                            lineData.push(_line);
                            _findCur = true;
                            break ;
                        }
                    }
                    //文本
                    if(_findCur) continue ;
                    for(let j=0; j<textData.length; j++){
                        if(textData[j].id == selected[i]){
                            let _text = this.jsonClone(textData[j]);
                            _text.id = 'textData-' + Date.now() + '' + i;
                            _text.x = _text.x + 20;
                            _text.y = _text.y + 20;
                            textData.push(_text);
                            _findCur = true;
                            break ;
                        }
                    }
                };
                this.flowData = flowData;
                this.lineData = lineData;
                this.textData = textData;
                this.recordAdd();
            }

        },

        //保存
        save(){
            this.$emit('save', {
                flowData: this.flowData,
                lineData: this.lineData,
                textData: this.textData,
            })
        },
        
        //根据id获取相应（图形、线条、文本）数据
        getById(id){
            let flowData = this.jsonClone(this.flowData);
            let lineData = this.jsonClone(this.lineData);
            let textData = this.jsonClone(this.textData);
            //图形
            for(let j=0; j<flowData.length; j++){
                if(flowData[j].id == id){
                    return flowData[j];
                }
            }
            //线条
            for(let j=0; j<lineData.length; j++){
                if(lineData[j].id == id){
                    return lineData[j];
                }
            }
            //文本
            for(let j=0; j<textData.length; j++){
                if(textData[j].id == id){
                    return textData[j];
                }
            }
        },
        //根据id修改属性
        modifyById(id, attr, val){
            let flowData = this.jsonClone(this.flowData);
            let lineData = this.jsonClone(this.lineData);
            let textData = this.jsonClone(this.textData);
            val = this.jsonClone(val);
            //图形
            for(let j=0; j<flowData.length; j++){
                if(flowData[j].id == id){
                    flowData[j][attr] = val;
                    this.flowData = flowData;
                    return ;
                }
            }
            //线条
            for(let j=0; j<lineData.length; j++){
                if(lineData[j].id == id){
                    lineData[j][attr] = val;
                    this.lineData = lineData;
                    return ;
                }
            }
            //文本
            for(let j=0; j<textData.length; j++){
                if(textData[j].id == id){
                    textData[j][attr] = val;
                    this.textData = textData;
                    return ;
                }
            }
        },
        //对选中的图形、文本进行部分属性修改
        inputValue(e, type, attr){
            let val = e.target.value;
            this.modifyById(this.selectedObj.id, attr, val);
        },
        //lineData切换虚实样式
        changeCheck(e, type, attr){
            let val = e.target.checked;
            this.modifyById(this.selectedObj.id, attr, val);
        },
        //textData文本的内容进行编辑
        textEdit(e, index){
            let id = this.selectedObj.id
            let textData = this.jsonClone(this.textData);
            for(let i=0; i<textData.length; i++){
                if(textData[i].id == id){
                    textData[i].tspan[index] = e.target.value;
                    break ;
                }
            }
            this.textData = textData;
        },
        //textData增加、删除某个文本行
        textClick(type, index){
            let id = this.selectedObj.id
            let textData = this.jsonClone(this.textData);
            for(let i=0; i<textData.length; i++){
                if(textData[i].id == id){
                    if(type == 'add'){
                        textData[i].tspan.splice(+index + 1, 0, '')
                    }
                    if(type == 'remove'){
                        textData[i].tspan.splice(+index, 1)
                    }
                    break ;
                }
            }
            this.textData = textData;
            this.recordAdd();
        },

        /*
        * 【键盘按下、松开】
        */
        docKeyDown(e){
            //ctrl键
            if(e.ctrlKey){
                this.ctrl = true;
            }

            //shift键
            if(e.shiftKey){
                this.shift = true;
            }

            //delete删除键
            if(e.keyCode == 46){
                this.del = true;
                this.deleteMap();
            }

            //Z键
            if(e.keyCode == 90){
                this.key_Z = true;
            }
            //Y键
            if(e.keyCode == 89){
                this.key_Y = true;
            }
            //C键
            if(e.keyCode == 67){
                this.key_C = true;
            }
            //V键
            if(e.keyCode == 86){
                this.key_V = true;
            }

            //上
            if(e.keyCode == 38){
                this.up = true;
            }
            //下
            if(e.keyCode == 40){
                this.down = true;
            }
            //左
            if(e.keyCode == 37){
                this.left = true;
            }
            //右
            if(e.keyCode == 39){
                this.right = true;
            }

            //ctrl+Z 撤销
            if(this.key_Z && this.ctrl){
                this.recordChange('back');
            }
            //ctrl+Y 还原
            if(this.key_Y && this.ctrl){
                this.recordChange('forward');
            }

            //ctrl+C 复制
            if(this.key_C && this.ctrl){
                this.copyOrPasteSelectMap('copy');
            }
            //ctrl+V 粘贴
            if(this.key_V && this.ctrl){
                this.copyOrPasteSelectMap('paste');
            }
        },
        docKeyUp(){
            this.ctrl = false;
            this.shift = false;
            this.key_Z = false;
            this.key_Y = false;
            this.key_C = false;
            this.key_V = false;
            this.del = false;
            this.up = false;
            this.down = false;
            this.left = false;
        },

        //拷贝对象
        jsonClone(obj){
            return JSON.parse(JSON.stringify(obj))
        },
        deepClone(data) {
            let t = type(data), o, i, ni;
            if(t === 'array') {
                o = [];
            }else if( t === 'object') {
                o = {};
            }else {
                return data;
            }
            if(t === 'array') {
                for (i = 0, ni = data.length; i < ni; i++) {
                o.push(this.deepClone(data[i]));
                }
                return o;
            }else if( t === 'object') {
                for( i in data) {
                o[i] = this.deepClone(data[i]);
                }
                return o;
            }
            function type(obj) {
                let toString = Object.prototype.toString;
                let map = {
                '[object Boolean]'  : 'boolean', 
                '[object Number]'   : 'number', 
                '[object String]'   : 'string', 
                '[object Function]' : 'function', 
                '[object Array]'    : 'array', 
                '[object Date]'     : 'date', 
                '[object RegExp]'   : 'regExp', 
                '[object Undefined]': 'undefined',
                '[object Null]'     : 'null', 
                '[object Object]'   : 'object'
                };
                return map[toString.call(obj)];
            }
        },
    },

    beforeDestroy(){
        document.removeEventListener('keydown', this.docKeyDown);
        document.removeEventListener('keyup', this.docKeyUp); 
    },

}
</script>

<style scoped>
.icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}
.fade-enter-active,
.fade-leave-active {
  transition: all .3s ease;
}
.fade-enter, .fade-leave-to {
  transform: translateY(4px);
  opacity: 0;
}
*{
    box-sizing: border-box !important;
}
.nowrap{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.fr{
    float: right;
}
.fl{
    float: left;
}
.clearfix:before,
.clearfix:after{
    display: table;
    content: " ";
}
.clearfix:after{
    clear: both;
}

.flow{
    border: 1px solid #ddd;
    height: 100%;
    width: 100%;
}
.tool{
    height: 32px;
    background: #999;
}
.tool-item{
    margin-left: 4px;
    margin-right: 4px;
    text-align: center;
    width: 32px;
    height: 32px;
    cursor: pointer;
}
.tool-item-svg{
    width: 20px;
    height: 20px;
    fill: #fff;
    margin: 6px;
}
.tool-item:hover{
    background: #565656;
}
.show-scale-text{
    margin-left: 4px;
    margin-right: 4px;
    text-align: center;
    height: 32px;
    line-height: 32px;
    color: #e3e3e3;
    float: left;
    font-size: 12px;
}
.main{
    height: calc(100% - 32px);
    display: flex;
}
.side{
    flex: none;
    width: 220px;
    background: #f6f6f6;
    overflow: auto;
    border-right: 1px solid #ddd; 
}
.side-item{
    margin-top: 4px;
}
.side-item-title{
    text-align: center;
    height: 24px;
    line-height: 24px;
    background: #1597d7;
    color: #fff;
    font-size: 12px;
    cursor: default;
}
.side-item-title:hover{
    background: #28acee;
}
.side-item-title .fa{
    float: right;
    font-size: 16px;
    margin-top: 4px;
    margin-right: 12px;
}
.side-item-content .edit-block{
    display: block;
    margin: 8px;
}
.side-item-content .innfo{
    display: block;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #898989;
    font-size: 12px;
}
.side-item-content .edit-block input,
.side-item-content .edit-block select{
    width: 100%;
    display: block;
}
.side-item-content .edit-block-1{
    display: inline-block;
    width: 50px;
}
.side-item-content .edit-block-2{
    display: inline-block;
    position: relative;
    width: 106px;
    font-size: 12px;
}
.allData-item{
    padding: 8px;
    font-size: 12px;
    border-bottom: 1px solid #aaa;
}
.allData-item.active{
    background: #99c7de;
    color: #fff;
    border-bottom: 1px solid #eee;
}
.edit-block-fa-1,
.edit-block-fa-2{
    position: absolute;
    font-size: 14px;
    color: #6f6f6f;
    right: -14px;
}
.edit-block-fa-1:hover,
.edit-block-fa-2:hover{
    color: #49c2ff;
}
.edit-block-fa-1{
    top: -2px;
}
.edit-block-fa-2{
    top: 12px;
}
.draw-content{
    flex: auto;
    width: auto;
    background: url(./bg.png);
    position: relative;
}
.sketchLinng{
    width: 180px;
    height: 32px;
    position: absolute;
    border-radius: 6px;
    left: 50%;
    top: 2px;
    transform: translateX(-50%);
    background: #666;
    display: flex;
    align-items: center;
    justify-content: center;
}
.sketchLinng span{
    display: inline-block;
    height: 22px;
    line-height: 22px;
    
}
.sketchLinng .info{
    color: #e6e6e6;
    font-size: 12px;
    padding-left: 12px;
    padding-right: 12px;
}
.sketchLinng .confirm{
    background: rgb(7, 191, 18);
    color: #ffffff;
    padding-left: 8px;
    padding-right: 8px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
}
.sketchLinng .confirm:hover{
    background: rgb(18, 216, 31);
}
</style>
