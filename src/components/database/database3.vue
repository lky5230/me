<template>
  <div 
    ref="wrap"
    @touchstart.stop="
      hover_show = false; 
      option_show = false; 
      dataPicker_show = false; 
      timePicker_show = false;
      operate_show = false;
    "
    :key="reset" 
    class="tbl-wrap tbl-wrap-id-2018-03-26">

    <span ref="textLengtn" style="display: inline-block; position: absolute; z-index: -99; font-size: 13px; background: transparent; opacity: 0;"></span>
    
    <!-- 滚动区域 -->
    <div 
        ref="container" 
        class="container" 
        @mousewheel.stop="mousewheel"
        @touchstart="touchstart"
        @click="navCoods = {}"
        :style="{
            width: width + 'px',
            height: height + 'px',
        }">

        <div class="body">
            <div v-if="row.length == 0" class="no-text">暂无数据</div>
            <!-- //专门撑出滚动条的DOM// -->
            <div 
                class="expand" 
                :style="{
                    width: fullWidth + 'px',
                    height: fullHeight + 'px',
                }">
            </div>

            <!-- //表头// -->
            <div class="sheet-header">

              <!-- 表头-左侧固定 -->
              <div class="sheet-header-left">
                
                <!-- 表头-状态列 -->
                <div 
                  v-if="showStatus"
                  class="tbl-cell check-cell" 
                  :style="{
                    height: colRelMaxLevel*cellHeight + 'px',
                    left: 0 + 'px',
                    width: statusWidth + 'px',
                  }">
                </div>

                <!-- 表头-复选框 -->
                <div 
                  v-if="showCheckBoxAndIndex"
                  class="tbl-cell check-cell"
                  :style="{
                    height: colRelMaxLevel*cellHeight + 'px',
                    left:  (showStatus? statusWidth: 0) + 'px',
                    width: 40 + 'px',
                    'border-left-width': showStatus? '0px': '1px'
                  }"
                  >
                  <!-- 没有行 -->
                  <i key="1" v-show="headerCheckStatus == false" class="fa fa-square-o" style="color: #999"></i>
                  <!-- 全选中 -->
                  <i key="2" v-show="headerCheckStatus == 'all'" @touchstart="headerCheckStatus = 'none'" @click="headerCheckStatus = 'none'" class="fa fa-check-square"></i>
                  <!-- 未选择 -->
                  <i key="3" v-show="headerCheckStatus == 'none'"  @touchstart="headerCheckStatus = 'all'" @click="headerCheckStatus = 'all'" class="fa fa-square-o"></i>
                  <!-- 部分选择 -->
                  <i key="4" v-show="headerCheckStatus == 'some'" @touchstart="headerCheckStatus = 'all'" @click="headerCheckStatus = 'all'" class="fa fa-square"></i>
                </div>
                
                <!-- 表头-操作列 -->
                <div 
                  v-if="showOperate"
                  class="tbl-cell check-cell" 
                  :style="{
                    height: colRelMaxLevel*cellHeight + 'px',
                    left: (showStatus? +statusWidth: 0) + (showCheckBoxAndIndex? 40: 0) + 'px',
                    width: 40 + 'px',
                  }">

                  <i 
                    @click.stop="addLine" 
                    @touchstart.stop="addLine"
                    class="entry-add"
                    v-if="entry"
                    title="向表格末尾增加一行">
                    <i class="fa fa-plus-circle"></i>
                  </i>
                  <i v-else>
                    <i class="fa fa-cog"></i>
                  </i>

                </div>

                <div
                  v-for="colFixHeaderItem in colFixHeader"
                  :key="colFixHeaderItem._colid"
                  class="tbl-cell nowrap" 
                  :class="[geScrollLeftArea > 20? 'needShadow': '']"
                  :style="{
                      height: colRelMaxLevel * cellHeight + 'px',
                      'line-height': colRelMaxLevel * cellHeight + 'px', 
                      left: colFixHeaderItem._left + 'px',
                      width: colFixHeaderItem.width + 'px',
                      'border-right': '1px solid #d8d8d8',
                      display: colFixHeaderItem.hide? 'none': 'block'
                  }">
                  <template v-if="colFixHeaderItem.icon">
                    <i v-if="colFixHeaderItem.icon == 'mul_select'" class="icon fa fa-chevron-circle-down"></i>
                    <i v-else-if="colFixHeaderItem.icon == 'select'" class="icon fa fa-angle-down"></i>
                    <i v-else-if="colFixHeaderItem.icon == 'normal'" class="icon fa fa-info-circle"></i>
                    <i v-else-if="colFixHeaderItem.icon == 'edit'" class="icon fa fa-pencil-square-o"></i>
                    <i v-else-if="colFixHeaderItem.icon == 'number'" class="icon fa fa-hashtag"></i>
                    <i v-else-if="colFixHeaderItem.icon == 'date'" class="icon fa fa-calendar-o"></i>
                    <i v-else-if="colFixHeaderItem.icon == 'time'" class="icon fa fa-clock-o"></i>
                    <i v-else :class="[colFixHeaderItem.icon, 'icon']"></i>
                  </template>&nbsp;
                  {{colFixHeaderItem.title}}

                  <span @click.prevent.stop @mousedown.prevent.stop="dragDown(colFixHeaderItem, $event)" class="drag-pad">&nbsp;</span>

                  <span v-if="colFixHeaderItem.sort" @click.stop="colSort(colFixHeaderItem)" class="sort-wrap">
                    <i :class="{active: colFixHeaderItem._sort == 'desc'}" class="fa fa-sort-desc"></i>
                    <i :class="{active: colFixHeaderItem._sort == 'asc'}" class="fa fa-sort-asc"></i>
                  </span>

                </div>
              </div>

              <!-- 表头-右侧活动列（表头需要x轴动态渲染吗？？？） -->
              <div 
                class="sheet-header-right" 
                :style="{
                  left: colFixHeaderWidth + 'px',
                  transform: 'translate('+ -1*geScrollLeftArea +'px, 0px)'
                }">
                
                <template v-for="colLevel in realCol">
                  <div 
                    v-for="colItem in colLevel" 
                    :key="colItem._colid"
                    class="tbl-cell nowrap" 
                    :style="{
                        height: (colItem._verticalSpace + 1 || 1) * cellHeight + 'px',
                        left: colItem._left - colFixHeaderWidth + 'px',
                        top: colItem._verticalSpace? (colItem._top - colItem._verticalSpace * cellHeight) + 'px': colItem._top + 'px',
                        width: colItem.width + 'px',
                        'line-height': (colItem._verticalSpace + 1 || 1) * cellHeight + 'px',
                        display: colItem.hide? 'none': 'block'
                    }"
                    >
                    <template v-if="colItem.icon">
                      <i v-if="colItem.icon == 'mul_select'" class="icon fa fa-chevron-circle-down"></i>
                      <i v-else-if="colItem.icon == 'select'" class="icon fa fa-angle-down"></i>
                      <i v-else-if="colItem.icon == 'normal'" class="icon fa fa-info-circle"></i>
                      <i v-else-if="colItem.icon == 'edit'" class="icon fa fa-pencil-square-o"></i>
                      <i v-else-if="colItem.icon == 'number'" class="icon fa fa-hashtag"></i>
                      <i v-else-if="colItem.icon == 'date'" class="icon fa fa-calendar-o"></i>
                      <i v-else-if="colItem.icon == 'time'" class="icon fa fa-clock-o"></i>
                      <i v-else :class="[colItem.icon, 'icon']"></i>
                    </template>&nbsp;
                    {{colItem.title}}

                    <span v-if="!colItem._isLevel" @click.prevent.stop @mousedown.prevent.stop="dragDown(colItem, $event)" class="drag-pad">&nbsp;</span>

                    <span v-if="colItem.sort" @click.stop="colSort(colItem)" class="sort-wrap">
                      <i :class="{active: colItem._sort == 'desc'}" class="fa fa-sort-desc"></i>
                      <i :class="{active: colItem._sort == 'asc'}" class="fa fa-sort-asc"></i>
                    </span>

                  </div>
                </template>
              </div>

            </div>

            <!-- //表体// -->
            <div 
                class="sheet-body"
                :style="{
                    transform: 'translate(0px, '+ -1*geScrollTopArea +'px)'
                }">

              <!-- <transition-group name="sheet"> -->
                <!-- (y轴方向的动态渲染) -->
                <div 
                  class="sheet-line"
                  :class="{
                    'actived': rowItem._rowid == sheetLineActived,
                  }"
                  v-if="
                    (rowLine + 1) * cellHeight - geScrollTopArea > -cellHeight
                    &&
                    (rowLine + 1) * cellHeight - geScrollTopArea < height + cellHeight
                  "
                  v-for="(rowItem, rowLine) in row"
                  :key="rowItem._rowid + '-row'"
                  :style="{
                    top: (rowLine + colRelMaxLevel) * cellHeight + 'px',
                  }">

                  <!-- 表体-左侧固定 -->
                  <div class="sheet-body-left">

                    <!-- 表体-状态列 -->
                    <div 
                      v-if="showStatus"
                      class="tbl-cell check-cell"
                      :class="{
                        'status-error': rowItem._error,
                        'status-modify': rowItem._modify,
                        'status-add': rowItem._add,
                      }"
                      :style="{
                        height: cellHeight + 'px',
                        left: 0 + 'px',
                        width: statusWidth + 'px',
                        'border-right-width': '0px',
                      }">
                    </div>

                    <!-- 表体-复选框 -->
                    <template v-if="showCheckBoxAndIndex">
                      <div 
                        v-if="!rowItem.noCheckAble"
                        class="tbl-cell check-cell" 
                        :class="[rowItem._error? 'error': rowItem._modify? 'modify': '', geScrollLeftArea > 20? 'needShadow': '']"
                        :style="{
                          height: cellHeight + 'px',
                          left: (showStatus? +statusWidth: 0) + 'px',
                          width: 40 + 'px',
                        }"
                        :key="rowItem._rowid"
                        @mouseover.stop="$set(lineHover, 'lineHover-'+rowItem._rowid, true)"
                        @mouseout.stop="$set(lineHover, 'lineHover-'+rowItem._rowid, false)"
                        >
                        <template v-if="((lineHover['lineHover-'+rowItem._rowid] || rowItem.checked) && !onlyShowIndex) || isPC == false || onlyShowCheckBox == true">
                          <i @touchstart="checkBox(rowItem)" @click="checkBox(rowItem)" v-show="rowItem.checked" class="fa fa-check-square"></i>
                          <i @touchstart="checkBox(rowItem)" @click="checkBox(rowItem)" v-show="!rowItem.checked" class="fa fa-square-o"></i>
                        </template>
                        <template v-else>
                          <span class="nowrap" style="font-size: 10px">{{rowLine*1+1}}</span>
                        </template>
                      </div>
                      <div 
                        v-else 
                        class="tbl-cell check-cell"
                        :style="{
                          height: cellHeight + 'px',
                          left: (showStatus? +statusWidth: 0) + 'px',
                          width: 40 + 'px',
                          cursor: 'no-drop',
                        }">
                        <i style="cursor: no-drop; opacity: 0.35;" v-show="rowItem.checked" class="fa fa-check-square"></i>
                        <i style="cursor: no-drop; opacity: 0.35;" v-show="!rowItem.checked" class="fa fa-square-o"></i>
                      </div>
                    </template>

                    <!-- 表体-操作列 -->
                    <div 
                      v-if="showOperate"
                      class="tbl-cell check-cell clearfix"
                      :ref="'operate-'+rowItem._rowid"
                      @click.stop
                      @touchstart.stop
                      @touchend.stop
                      :style="{
                        height: cellHeight + 'px',
                        left: (showStatus? +statusWidth: 0) + (showCheckBoxAndIndex? 40: 0) + 'px',
                        width: '40px',
                        position: 'relative',
                      }">
                      
                      <div
                        class="operate-cir"
                        :class="{
                          activeOperate: operate_show && operate_info._rowid == rowItem._rowid
                        }"
                        @click="operateShowFn(rowItem);">
                        <i class="fa fa-list"></i>
                      </div>

                      <!-- loading -->
                      <div 
                        class="operate_loading" 
                        @click.stop
                        v-show="operate_loading['loading' + rowItem._rowid]">
                        <div class="skype-loader">
                          <div 
                            v-for="n in 4"
                            :key="'dot-'+n"
                            class="dot" 
                            :class="{
                              'save': operate_loading['loading-type-'+rowItem._rowid] == 'save',
                              'remove': operate_loading['loading-type-'+rowItem._rowid] == 'remove'
                            }">
                          </div>
                        </div>
                      </div>

                    </div>
                    
                    <div
                      class="tbl-cell" 
                      :class="[geScrollLeftArea > 20? 'needShadow': '']"
                      v-for="col in colFixHeader" 
                      :key="rowItem._rowid + '-' + col._colid"
                      :style="{
                        left: col._left + 'px',
                        width: col.width + 'px',
                        height: cellHeight + 'px',
                        display: col.hide? 'none': 'block'
                      }"
                      :ref="'cell-'+rowItem._rowid+'-'+col._colid"
                      @click.stop
                      @mouseover.stop="cellOver(rowItem, col)"
                      @mouseout="cellOut(rowItem, col)"
                      >
                      
                      <!-- 普通框 -->
                      <div 
                        class="cell"  
                        v-if="rowItem[col.props].type == 'normal'"
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid"
                        :style="[rowItem[col.props].style]"
                        @click.stop="hideOption(); navCoods = {}"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        >
                        <div class="text nowrap">
                            {{rowItem[col.props].value}}
                        </div>
                      </div>

                      <!-- 编辑框 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid" 
                        class="cell" 
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        @click.stop="highlight(rowItem, col)"
                        v-if="rowItem[col.props].type == 'edit'">
                        <input 
                          type="text" 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid"
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :class="{
                            'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                          }"
                          :style="[rowItem[col.props].style]"
                          @focus="hideOption(); highlight(rowItem, col)"
                          @input="
                            selectFullData = null;
                            modifyByRowCol(
                              rowItem._rowid, 
                              col.props, 
                              $event.target.value
                            )
                          "
                        />
                        <i class="fa fa-pencil-square-o edit-close"></i>
                      </div>

                      <!-- 数字输入 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid" 
                        class="cell" 
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        @click.stop="highlight(rowItem, col)"
                        v-if="rowItem[col.props].type == 'number'">
                        <input 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid"
                          type="number" 
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :class="{
                            'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                          }"
                          :style="[rowItem[col.props].style]"
                          @focus="hideOption(); highlight(rowItem, col)"
                          @input="
                            selectFullData = null;
                            modifyByRowCol(
                              rowItem._rowid, 
                              col.props, 
                              $event.target.value
                            );
                          "
                          @blur=" checkNumber(rowItem, col, $event.target.value); "
                        />
                      </div>

                      <!-- 单选框 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid"
                        class="cell"
                        @click.stop="highlight(rowItem, col)"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        v-if="rowItem[col.props].type == 'select'">
                        <input 
                          type="search" 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid"
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :style="[rowItem[col.props].style]"
                          :class="[
                            option_show 
                            && 
                            option_info.row 
                            && 
                            (
                              option_info.row._rowid == rowItem._rowid 
                              && 
                              col._colid == option_info.col._colid
                            )? 
                            'active'
                            : 
                            ''
                            ,
                            {
                              'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                            }
                          ]"
                          readonly
                          @focus="searchFocus(rowItem, col); highlight(rowItem, col)"
                          @blur.stop
                        />
                        <i v-show="(rowItem[col.props].id+'').trim() != ''" @click="selectClose(rowItem, col, 'select')" class="fa fa-times-circle edit-close"></i>

                        <div 
                          @click="hideOption"
                          @touchstart.stop
                          @touchend.stop
                          v-show="option_show || dataPicker_show || timePicker_show" 
                          class="input-mask">
                        </div>

                      </div>

                      <!-- 有option的单选框 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid"
                        class="cell"
                        @click.stop="highlight(rowItem, col)"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        v-if="rowItem[col.props].type == 'opt_select'">
                        <input 
                          type="text"
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid"
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :style="[rowItem[col.props].style]"
                          :class="[
                            option_show 
                            && 
                            option_info.row 
                            && 
                            (
                              option_info.row._rowid == rowItem._rowid 
                              && 
                              col._colid == option_info.col._colid
                            )? 
                            'active'
                            : 
                            ''
                            ,
                            {
                              'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                            }
                          ]"
                          readonly
                          @focus="opt_searchFocus(rowItem, col); highlight(rowItem, col)"
                          @blur.stop
                        />

                        <i v-show="(rowItem[col.props].id+'').trim() != ''" @click="selectClose(rowItem, col, 'opt_select')" class="fa fa-times-circle edit-close"></i>

                        <div 
                          @click="hideOption"
                          @touchstart.stop
                          @touchend.stop
                          v-show="option_show || dataPicker_show || timePicker_show" 
                          class="input-mask">
                        </div>

                      </div>

                      <!-- 有option的multiple多选框 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid"
                        class="cell"
                        @click.stop="highlight(rowItem, col)"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        v-if="rowItem[col.props].type == 'opt_mul_select'">
                        <input 
                          type="text" 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid"
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :style="[rowItem[col.props].style]"
                          :class="[
                            option_show 
                            && 
                            option_info.row 
                            && 
                            (
                              option_info.row._rowid == rowItem._rowid 
                              && 
                              col._colid == option_info.col._colid
                            )? 
                            'active'
                            : 
                            ''
                            ,
                            {
                              'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                            }
                          ]"
                          readonly
                          @focus="opt_searchFocus(rowItem, col, true); highlight(rowItem, col)"
                          @blur.stop
                        />

                        <i v-show="(rowItem[col.props].id+'').trim() != ''" @click="selectClose(rowItem, col, 'opt_mul_select')" class="fa fa-times-circle edit-close"></i>

                        <div 
                          @click="hideOption"
                          @touchstart.stop
                          @touchend.stop
                          v-show="option_show || dataPicker_show || timePicker_show" 
                          class="input-mask">
                        </div>

                      </div>
                      

                      <!-- 多选框 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid"
                        class="cell" 
                        @click.stop="highlight(rowItem, col)"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        v-if="rowItem[col.props].type == 'mul_select'">
                        <input 
                          type="search"
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid"
                          :value="rowItem[col.props].value.join('， ')" 
                          class="edit-inp nowrap"
                          :style="[rowItem[col.props].style]"
                          :class="[
                            option_show 
                            && 
                            option_info.row 
                            && 
                            (
                              option_info.row._rowid == rowItem._rowid 
                              && 
                              col._colid == option_info.col._colid
                            )? 
                            'active'
                            : 
                            ''
                            ,
                            {
                              'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                            }
                          ]"
                          readonly
                          @focus="searchFocus(rowItem, col, true); highlight(rowItem, col)"
                          @blur.stop
                        />

                        <i v-show="rowItem[col.props].id.length != 0" @click="selectClose(rowItem, col, 'mul_select')" class="fa fa-times-circle edit-close"></i>

                        <div 
                          @click="hideOption"
                          @touchstart.stop
                          @touchend.stop
                          v-show="option_show || dataPicker_show || timePicker_show" 
                          class="input-mask">
                        </div>

                      </div>

                      <!-- 日期，日期时间 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid" 
                        class="cell"
                        @click.stop="highlight(rowItem, col)"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        v-if="
                          rowItem[col.props].type == 'date' 
                          ||
                          rowItem[col.props].type == 'datetime'
                        ">
                        <input  
                          type="text" 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid" 
                          readonly
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :style="[rowItem[col.props].style, {'text-indent': '20px'}]"
                          :class="[
                            dataPicker_show 
                            && 
                            dataPicker_info.row 
                            && 
                            (
                              dataPicker_info.row._rowid == rowItem._rowid 
                              && 
                              col._colid == dataPicker_info.col._colid
                            )? 
                            'active'
                            : 
                            ''
                            ,
                            {
                              'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                            }
                          ]"
                          @focus="dataPickerFocus(rowItem, col); highlight(rowItem, col)"
                        />

                        <i style="cursor: default" v-show="rowItem[col.props].value" class="fa fa-calendar-o edit-close"></i>

                        <div 
                          @click="hideOption"
                          @touchstart.stop
                          @touchend.stop
                          v-show="option_show || dataPicker_show || timePicker_show" 
                          class="input-mask">
                        </div>

                      </div>

                      <!-- 时间 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid" 
                        class="cell"
                        @click.stop="highlight(rowItem, col)"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        v-if="rowItem[col.props].type == 'time'">
                        <input  
                          type="text" 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid" 
                          readonly
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :style="[rowItem[col.props].style, {'text-indent': '16px'}]"
                          :class="[
                            timePicker_show 
                            && 
                            timePicker_time.row 
                            && 
                            (
                              timePicker_time.row._rowid == rowItem._rowid 
                              && 
                              col._colid == timePicker_time.col._colid
                            )? 
                            'active'
                            : 
                            ''
                            ,
                            {
                              'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                            }
                          ]"
                          @focus="timePickerFocus(rowItem, col); highlight(rowItem, col)"
                        />

                        <i style="cursor: default" v-show="rowItem[col.props].value" class="fa fa-clock-o edit-close"></i>

                        <div 
                          @click="hideOption"
                          @touchstart.stop
                          @touchend.stop
                          v-show="option_show || dataPicker_show || timePicker_show" 
                          class="input-mask">
                        </div>

                      </div>

                      <!-- 月份、年份 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid" 
                        class="cell" 
                        @click.stop="highlight(rowItem, col)"
                        v-if="
                          rowItem[col.props].type == 'month' ||
                          rowItem[col.props].type == 'year'
                        ">
                        <input
                          type="text" 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid" 
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :class="{
                            'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid 
                          }"
                          :placeholder="placeholder_date(rowItem[col.props].type)"
                          :style="[rowItem[col.props].style]"
                          @focus="hideOption(); highlight(rowItem, col)"
                          @input="
                            this.selectFullData = null;
                            modifyByRowCol(
                              rowItem._rowid, 
                              col.props, 
                              $event.target.value
                            );
                          "
                          @blur=" checkDate(rowItem, col, $event.target.value, rowItem[col.props].type); "
                        />
                        <i :class="[rowItem[col.props].type == 'time'? 'fa-clock-o': 'fa-calendar-o']" class="fa edit-close"></i>
                      </div>

                    </div>
                    
                  </div>

                  <!-- 表体-右侧活动 -->
                  <div 
                    class="sheet-body-right"
                    :style="{
                        left: colFixHeaderWidth + 'px',
                        transform: 'translate('+ -1*geScrollLeftArea +'px, 0px)'
                    }">
                    <!-- (x轴方向的动态渲染) -->
                    <div
                      v-if="
                        geScrollLeftArea - col._left <  col.width
                        &&
                        col._left - geScrollLeftArea - width < col.width
                      "
                      class="tbl-cell" 
                      v-for="col in colActiveHeader" 
                      :key="rowItem._rowid + '-' + col._colid"
                      :style="{
                          left: col._left - colFixHeaderWidth + 'px',
                          width: col.width + 'px',
                          height: cellHeight + 'px',
                          display: col.hide? 'none': 'block'
                      }"
                      :ref="'cell-'+rowItem._rowid+'-'+col._colid"
                      @click.stop
                      @mouseover.stop="cellOver(rowItem, col)"
                      @mouseout="cellOut(rowItem, col)"
                      >
                      
                      <!-- 普通框 -->
                      <div 
                        class="cell"  
                        v-if="rowItem[col.props].type == 'normal'"
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid"
                        :style="[rowItem[col.props].style]"
                        @click.stop="hideOption(); navCoods = {}"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        >
                        <div class="text nowrap">
                            {{rowItem[col.props].value}}
                        </div>
                      </div>

                      <!-- 编辑框 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid" 
                        class="cell" 
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        @click.stop="highlight(rowItem, col)"
                        v-if="rowItem[col.props].type == 'edit'">
                        <input 
                          type="text" 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid"
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :class="{
                            'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                          }"
                          :style="[rowItem[col.props].style]"
                          @focus="hideOption(); highlight(rowItem, col)"
                          @input="
                            selectFullData = null;
                            modifyByRowCol(
                              rowItem._rowid, 
                              col.props, 
                              $event.target.value
                            )
                          "
                        />
                        <i class="fa fa-pencil-square-o edit-close"></i>
                      </div>

                      <!-- 数字输入 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid" 
                        class="cell" 
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        @click.stop="highlight(rowItem, col)"
                        v-if="rowItem[col.props].type == 'number'">
                        <input 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid"
                          type="number" 
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :class="{
                            'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                          }"
                          :style="[rowItem[col.props].style]"
                          @focus="hideOption(); highlight(rowItem, col)"
                          @input="
                            selectFullData = null;
                            modifyByRowCol(
                              rowItem._rowid, 
                              col.props, 
                              $event.target.value
                            );
                          "
                          @blur=" checkNumber(rowItem, col, $event.target.value); "
                        />
                      </div>

                      <!-- 单选框 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid"
                        class="cell"
                        @click.stop="highlight(rowItem, col)"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        v-if="rowItem[col.props].type == 'select'">
                        <input 
                          type="search" 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid"
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :style="[rowItem[col.props].style]"
                          :class="[
                            option_show 
                            && 
                            option_info.row 
                            && 
                            (
                              option_info.row._rowid == rowItem._rowid 
                              && 
                              col._colid == option_info.col._colid
                            )? 
                            'active'
                            : 
                            ''
                            ,
                            {
                              'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                            }
                          ]"
                          readonly
                          @focus="searchFocus(rowItem, col); highlight(rowItem, col)"
                          @blur.stop
                        />
                        <i v-show="(rowItem[col.props].id+'').trim() != ''" @click="selectClose(rowItem, col, 'select')" class="fa fa-times-circle edit-close"></i>

                        <div 
                          @click="hideOption"
                          @touchstart.stop
                          @touchend.stop
                          v-show="option_show || dataPicker_show || timePicker_show" 
                          class="input-mask">
                        </div>

                      </div>

                      <!-- 有option的单选框 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid"
                        class="cell"
                        @click.stop="highlight(rowItem, col)"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        v-if="rowItem[col.props].type == 'opt_select'">
                        <input 
                          type="text"
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid"
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :style="[rowItem[col.props].style]"
                          :class="[
                            option_show 
                            && 
                            option_info.row 
                            && 
                            (
                              option_info.row._rowid == rowItem._rowid 
                              && 
                              col._colid == option_info.col._colid
                            )? 
                            'active'
                            : 
                            ''
                            ,
                            {
                              'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                            }
                          ]"
                          readonly
                          @focus="opt_searchFocus(rowItem, col); highlight(rowItem, col)"
                          @blur.stop
                        />

                        <i v-show="(rowItem[col.props].id+'').trim() != ''" @click="selectClose(rowItem, col, 'opt_select')" class="fa fa-times-circle edit-close"></i>

                        <div 
                          @click="hideOption"
                          @touchstart.stop
                          @touchend.stop
                          v-show="option_show || dataPicker_show || timePicker_show" 
                          class="input-mask">
                        </div>

                      </div>

                      <!-- 有option的multiple多选框 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid"
                        class="cell"
                        @click.stop="highlight(rowItem, col)"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        v-if="rowItem[col.props].type == 'opt_mul_select'">
                        <input 
                          type="text" 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid"
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :style="[rowItem[col.props].style]"
                          :class="[
                            option_show 
                            && 
                            option_info.row 
                            && 
                            (
                              option_info.row._rowid == rowItem._rowid 
                              && 
                              col._colid == option_info.col._colid
                            )? 
                            'active'
                            : 
                            ''
                            ,
                            {
                              'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                            }
                          ]"
                          readonly
                          @focus="opt_searchFocus(rowItem, col, true); highlight(rowItem, col)"
                          @blur.stop
                        />

                        <i v-show="(rowItem[col.props].id+'').trim() != ''" @click="selectClose(rowItem, col, 'opt_mul_select')" class="fa fa-times-circle edit-close"></i>

                        <div 
                          @click="hideOption"
                          @touchstart.stop
                          @touchend.stop
                          v-show="option_show || dataPicker_show || timePicker_show" 
                          class="input-mask">
                        </div>

                      </div>
                      

                      <!-- 多选框 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid"
                        class="cell" 
                        @click.stop="highlight(rowItem, col)"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        v-if="rowItem[col.props].type == 'mul_select'">
                        <input 
                          type="search"
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid"
                          :value="rowItem[col.props].value.join('， ')" 
                          class="edit-inp nowrap"
                          :style="[rowItem[col.props].style]"
                          :class="[
                            option_show 
                            && 
                            option_info.row 
                            && 
                            (
                              option_info.row._rowid == rowItem._rowid 
                              && 
                              col._colid == option_info.col._colid
                            )? 
                            'active'
                            : 
                            ''
                            ,
                            {
                              'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                            }
                          ]"
                          readonly
                          @focus="searchFocus(rowItem, col, true); highlight(rowItem, col)"
                          @blur.stop
                        />

                        <i v-show="rowItem[col.props].id.length != 0" @click="selectClose(rowItem, col, 'mul_select')" class="fa fa-times-circle edit-close"></i>

                        <div 
                          @click="hideOption"
                          @touchstart.stop
                          @touchend.stop
                          v-show="option_show || dataPicker_show || timePicker_show" 
                          class="input-mask">
                        </div>

                      </div>

                      <!-- 日期，日期时间 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid" 
                        class="cell"
                        @click.stop="highlight(rowItem, col)"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        v-if="
                          rowItem[col.props].type == 'date' 
                          ||
                          rowItem[col.props].type == 'datetime'
                        ">
                        <input  
                          type="text" 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid" 
                          readonly
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :style="[rowItem[col.props].style, {'text-indent': '20px'}]"
                          :class="[
                            dataPicker_show 
                            && 
                            dataPicker_info.row 
                            && 
                            (
                              dataPicker_info.row._rowid == rowItem._rowid 
                              && 
                              col._colid == dataPicker_info.col._colid
                            )? 
                            'active'
                            : 
                            ''
                            ,
                            {
                              'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                            }
                          ]"
                          @focus="dataPickerFocus(rowItem, col); highlight(rowItem, col)"
                        />

                        <i style="cursor: default" v-show="rowItem[col.props].value" class="fa fa-calendar-o edit-close"></i>

                        <div 
                          @click="hideOption"
                          @touchstart.stop
                          @touchend.stop
                          v-show="option_show || dataPicker_show || timePicker_show" 
                          class="input-mask">
                        </div>

                      </div>

                      <!-- 时间 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid" 
                        class="cell"
                        @click.stop="highlight(rowItem, col)"
                        @touchend.stop="inpTouchEnd(rowItem._rowid, col._colid)"
                        v-if="rowItem[col.props].type == 'time'">
                        <input  
                          type="text" 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid" 
                          readonly
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :style="[rowItem[col.props].style, {'text-indent': '16px'}]"
                          :class="[
                            timePicker_show 
                            && 
                            timePicker_time.row 
                            && 
                            (
                              timePicker_time.row._rowid == rowItem._rowid 
                              && 
                              col._colid == timePicker_time.col._colid
                            )? 
                            'active'
                            : 
                            ''
                            ,
                            {
                              'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid
                            }
                          ]"
                          @focus="timePickerFocus(rowItem, col); highlight(rowItem, col)"
                        />

                        <i style="cursor: default" v-show="rowItem[col.props].value" class="fa fa-clock-o edit-close"></i>

                        <div 
                          @click="hideOption"
                          @touchstart.stop
                          @touchend.stop
                          v-show="option_show || dataPicker_show || timePicker_show" 
                          class="input-mask">
                        </div>

                      </div>

                      <!-- 月份、年份 -->
                      <div 
                        :ref="'cell-'+rowItem._rowid+'-'+col._colid" 
                        class="cell" 
                        @click.stop="highlight(rowItem, col)"
                        v-if="
                          rowItem[col.props].type == 'month' ||
                          rowItem[col.props].type == 'year'
                        ">
                        <input
                          type="text" 
                          :ref="'inp-'+rowItem._rowid+'-'+col._colid" 
                          :value="rowItem[col.props].value" 
                          class="edit-inp nowrap"
                          :class="{
                            'highlight': navCoodsComp.row == rowItem._rowid && navCoodsComp.col == col._colid 
                          }"
                          :placeholder="placeholder_date(rowItem[col.props].type)"
                          :style="[rowItem[col.props].style]"
                          @focus="hideOption(); highlight(rowItem, col)"
                          @input="
                            this.selectFullData = null;
                            modifyByRowCol(
                              rowItem._rowid, 
                              col.props, 
                              $event.target.value
                            );
                          "
                          @blur=" checkDate(rowItem, col, $event.target.value, rowItem[col.props].type); "
                        />
                        <i :class="[rowItem[col.props].type == 'time'? 'fa-clock-o': 'fa-calendar-o']" class="fa edit-close"></i>
                      </div>

                    </div>
                  </div>

                </div>
              <!-- </transition-group> -->

            </div>

        </div>

        <!-- x轴-滚动条 -->
        <div 
          class="scrollbar-x" 
          v-if="width * width / fullWidth < width"
          :style="{width: width+'px'}">
          <div
            @mousedown.prevent.stop="scrollMouseDown($event, 'x')"
            class="scrollbar-x-drag" 
            :style="{
              width: width * width / fullWidth + 'px',
              left: scrollLeft + 'px'
            }">
          </div>
        </div>

        <!-- y轴-滚动条 -->
        <div 
          class="scrollbar-y" 
          :class="[!isPC? 'mob': '']"
          v-if="(height - colRelMaxLevel * cellHeight) * (height - colRelMaxLevel * cellHeight) / fullHeight < height - colRelMaxLevel * cellHeight" 
          :style="{
            height: height - colRelMaxLevel * cellHeight + 'px',
            top: colRelMaxLevel * cellHeight + 'px'
          }">
          <div
            @mousedown.prevent.stop="scrollMouseDown($event, 'y')"
            class="scrollbar-y-drag" 
            :style="{
              height: (height - colRelMaxLevel * cellHeight) * (height - colRelMaxLevel * cellHeight) / fullHeight + 'px',
              top: scrollTop + 'px'
            }">
            <template v-if="((height - colRelMaxLevel * cellHeight) * (height - colRelMaxLevel * cellHeight) / fullHeight) < 32">
              <div class="drag-x1"></div>
              <div class="drag-x2"></div>
            </template>
          </div>
        </div>
        
        <!-- 拖拽线 -->
        <div 
          @click.stop.prevent 
          v-show="dragLineShow" 
          :style="{
            left: dragLeft + 'px'
          }" 
          class="drag_line">
        </div>

    </div>

    <!-- option的DOM -->
    <transition name="option">
      <div 
        class="option"
        ref="optionDOM"
        @click.stop
        @mousewheel.stop
        @mouseover.stop
        @touchstart.stop
        v-show="option_show"
        :style="{
          left: option_left + 'px',
          top: option_top + 'px',
          width: option_width + 'px',
        }"
        >
        <div class="arrow" v-show="!option_hide_arrow"></div>
        <div @click="$refs.option_inp.focus()" v-show="!option_loading && option_show_search" class="search-text">
          <span><i class="fa fa-search"></i></span>
          <input placeholder="搜索" ref="option_inp" @input="searchInput($event)" type="text" :value="option_search">
        </div>
        <div class="opp">
          <div style="text-align: center; padding-top: 10px; padding-bottom: 10px; color: #a9a9a9" v-if="option_loading">加载中...</div>
          <div v-else>
            <div 
              class="option-item"
              v-for="d in option_data"
              :class="[d.select? 'select': '']"
              @click="optionItemClick(d)"
              :key="d.id"
              >
              {{d.name}}
            </div>
          </div>
        </div>
        <!-- 分页 -->
        <div v-if="!option_loading && showOptionPage && option_total_page > 1" class="page">
          <i @click.stop="searchByPage(-1)" class="page-arrow fa fa-angle-left"></i>
          <span>{{option_current_page}} / {{option_total_page}}</span>
          <i @click.stop="searchByPage(1)" class="page-arrow fa fa-angle-right"></i>
        </div>
      </div>
    </transition>

    <!-- hover提示框 -->
    <div
      v-if="showPrompt"
      v-show="hover_show"
      class="hover-show"
      :style="{
        left: hover_left - 6 + 'px',
        bottom: hover_bottom + 'px',
        width: hover_width + 12 + 'px',
        'word-wrap': 'break-word',
      }">
      <span v-html="hover_text"></span>
    </div>

    <!-- datapicker选择 -->
    <transition name="option">
      <div
        class="data-picker"
        ref="dataPicker"
        @click.stop
        @mousewheel.stop
        @mouseover.stop
        @touchstart.stop
        v-show="dataPicker_show"
        :style="{
          left: dataPicker_left + 'px',
          top: dataPicker_top + 'px',
          width: dataPicker_width + 'px',
        }">
        <div v-show="!option_hide_arrow" class="arrow"></div>
        <div class="picker-arrow clearfix">
          <span @click.prevent.stop="dateYear(-1)" style="float: left;" class="fa fa-angle-double-left"></span>
          <span @click.prevent.stop="dateMonth(-1)" style="float: left;" class="fa fa-angle-left"></span>
          <i class="arrow-date">{{getPickerArray.year}}-{{getPickerArray.month}}</i>
          <span @click.prevent.stop="dateYear(1)" style="float: right;" class="fa fa-angle-double-right"></span>
          <span @click.prevent.stop="dateMonth(1)" style="float: right;" class="fa fa-angle-right"></span>
        </div>
        <div class="date-tbl">
          <div class="date-week">
            <span>一</span>
            <span>二</span>
            <span>三</span>
            <span>四</span>
            <span>五</span>
            <span>六</span>
            <span>日</span>
          </div>
          <div class="date-day">
            <div class="day-line" v-for="(dd, line) in getPickerArray.res" :key="line">
              <span 
                v-for="dateItem in dd" 
                :key="dateItem.date"
                @click.stop="datapickerClick(dateItem.date)"
                :class="[
                  dateItem.currentMonth? '': 'not-now',
                  dateItem.active? 'active': '',
                  dateItem.active2? 'active2': ''
                ]">
                {{dateItem.day}}
              </span>
            </div>
          </div>
        </div>
        <div v-if="dataPicker_info.row && dataPicker_info.row[dataPicker_info.col.props].type == 'datetime'" class="datetime-wrap">
          <label>
            <input :value="dateTimeHMS.h" @input="$event=>{dateTimeHMSFn($event, 'h')}" type="number">
            <span>时</span>
          </label>
          <label>
            <input :value="dateTimeHMS.m" @input="$event=>{dateTimeHMSFn($event, 'm')}" type="number">
            <span>分</span>
          </label>
          <label>
            <input :value="dateTimeHMS.s" @input="$event=>{dateTimeHMSFn($event, 's')}" type="number">
            <span>秒</span>
          </label>
        </div>
        <div class="select-now clearfix">
          <div @click.stop="datapickerClick(null)" class="toDay">现在</div>
          <div @click.stop="datapickerClick('clear')" class="clear">清空</div>
          <div 
            v-if="dataPicker_info.row && dataPicker_info.row[dataPicker_info.col.props].type == 'datetime'"
            @click.stop="datapickerClick('confirm')" 
            style="float: left; color: #05a78d; width: 62px;" 
            class="clear">
            <i class="fa fa-check"></i>
            &nbsp;&nbsp;完成
          </div>
        </div>
      </div>
    </transition>

    <!-- 时间选择 -->
    <transition name="option">
      <div
        class="time-picker"
        ref="timePicker"
        @click.stop
        @mousewheel.stop
        @mouseover.stop
        @touchstart.stop
        v-show="timePicker_show"
        :style="{
          left: timePicker_left + 'px',
          top: timePicker_top + 'px',
          width: timePicker_width + 'px',
        }">
        <div v-show="!option_hide_arrow" class="arrow"></div>
        <div class="time-control">
          <div style="font-size: 15px;" :style="{color: timeType? '#05a78d': '#6754c7'}" class="time-h">时</div>
          <div style="font-size: 15px;" :style="{color: timeType? '#05a78d': '#6754c7'}" class="time-m">分</div>
          <div style="font-size: 15px;" :style="{color: timeType? '#05a78d': '#6754c7'}" class="time-s">秒</div>
        </div>

        <div class="time-control">
          <div class="time-h">
            <div @click="timePickerFn('h', 1)" class="time-add">
              <i class="fa fa-plus"></i>
            </div>
            <div style="font-size: 16px;" :style="{color: timeType? '#05a78d': '#6754c7'}" class="time-show">{{timePickerComputed.h}}</div>
            <div @click="timePickerFn('h', -1)" class="time-des">
              <i class="fa fa-minus"></i>
            </div>
          </div>
          <div class="time-m">
            <div @click="timePickerFn('m', 1)" class="time-add">
              <i class="fa fa-plus"></i>
            </div>
            <div style="font-size: 16px;" :style="{color: timeType? '#05a78d': '#6754c7'}" class="time-show">{{timePickerComputed.m}}</div>
            <div @click="timePickerFn('m', -1)" class="time-des">
              <i class="fa fa-minus"></i>
            </div>
          </div>
          <div class="time-s">
            <div @click="timePickerFn('s', 1)" class="time-add">
              <i class="fa fa-plus"></i>
            </div>
            <div style="font-size: 16px;" :style="{color: timeType? '#05a78d': '#6754c7'}" class="time-show">{{timePickerComputed.s}}</div>
            <div @click="timePickerFn('s', -1)" class="time-des">
              <i class="fa fa-minus"></i>
            </div>
          </div>
        </div>

        <div class="line--"></div>

        <div class="time-circle">

          <span style="top: -5px" @click="timeTypeChange" class="minitem-title" :class="[timeType == false? 'active': '']">
            <i class="minitem-orb"></i>
            <div :style="{'text-indent': timeType? '23px': '7px'}">{{timeType == false? 'PM': 'AM'}}</div>
          </span>

          <!-- 分钟 -->
          <span 
            class="minitem"
            :style="{
              left: item.left+'px',
              top: item.top+'px'
            }" 
            @click="timePickerFn('m', 0, item.value)"
            v-for="(item, index_min) in timeMinute" 
            :key="'timeMinute'+index_min">
            {{item.value}}
          </span>

          <!-- 小时 -->
          <span 
            class="minitem"
            :style="{
              left: item.left+'px',
              top: item.top+'px'
            }" 
            @click="timePickerFn('h', 0, item.value)"
            v-for="(item, index_h) in timeHoursComputed" 
            :key="'timeHoursComputed'+index_h">
            {{item.alias? item.alias: item.value}}
          </span>

          <!-- 分钟指针 -->
          <span class="pin-center">
            <span 
              class="pin-line" 
              :style="{
                'transform': 'rotate(' + (+timePickerComputed.radius - 90) + 'deg)',
                'transform-origin': 'left center',
              }">
            </span>
          </span>

          <!-- 小时指针 -->
          <span class="pin-center">
            <span 
              class="pin-line pin-hours" 
              :style="{
                'transform': 'rotate(' + (+pickerHoursComputed.radius) + 'deg)',
                'transform-origin': 'left center',
                'background': '#7e8f9d',
                'width': '40px',
                'height': '2px',
                'border-radius': '4px'
              }">
            </span>
          </span>

        </div>

        <div class="btn clearfix">
          <div @click="timePickerBtn()" class="confirm" :style="{color: timeType? '#05a78d': '#6754c7'}">
            <i class="fa fa-check"></i>&nbsp;&nbsp;完成
          </div>
          <div @click="timePickerBtnNow()" class="cancel">现在</div>
          <div @click="timePickerBtn('clear')" class="clear">清空</div>
        </div>
      </div>
    </transition>

    <!-- 操作选择 -->
    <transition name="option">
      <div
        class="option"
        @click.stop
        @mousewheel.stop
        @mouseover.stop
        @touchstart.stop
        v-show="operate_show"
        :style="{
          left: operate_left + 'px',
          top: operate_top + 'px',
          width: 120 + 'px',
          transition: 'all 0s, top .17s, scaleY .17s;',
        }">
        <div v-show="!option_hide_arrow" class="arrow"></div>
        <div class="operate-item-wrap">
          <div v-show="operateItem.save" class="operate-item" @click="operateFn('save')">
            <i class="fa fa-floppy-o"></i>&nbsp;&nbsp;
            保存
          </div>
          <div v-show="operateItem.add" :class="{'no-entry': entry == false}" class="operate-item" @click="operateFn('add')">
            <i class="fa fa-plus"></i>&nbsp;&nbsp;
            增加一行
          </div>
          <div v-show="operateItem.remove" class="operate-item" @click="operateFn('remove')">
            <i class="fa fa-minus"></i>&nbsp;&nbsp;
            删除该行
          </div>
          <div v-show="operateItem.up" class="operate-item" @click="operateFn('up')">
            <div class="fa fa-caret-up"></div>&nbsp;&nbsp;
            向上移动
          </div>
          <div v-show="operateItem.down" class="operate-item" @click="operateFn('down')">
            <div class="fa fa-caret-down"></div>&nbsp;&nbsp;
            向下移动
          </div>
        </div>
      </div>
    </transition>

  </div>
</template>

<script>

export default {
  props: {
    // 列数据
    colData: { required: true },
    // 行数据
    rowData: { required: true },
    // 多级表头关系数组
    colRelation: { default: ()=>[] },

    // 增加行的数据格式
    entry:  { default: false },
    // 滚动条：一次滚动几行
    scrollSpeed: { default: 2 },
    // 是否出现复选框和索引
    showCheckBoxAndIndex: { default: true },
    // 是否只出现索引
    onlyShowIndex: { default: false },
    // 是否只出现复选框
    onlyShowCheckBox: { default: false },
    // 是否出现提示框
    showPrompt: { default: true },

    //搜索下拉的等待延迟 
    searchDelayTime: { default: 500 },
    //option选项框是否进行分页
    showOptionPage: { default: true },
    //option分页时一页显示多少条
    option_limit: { default: 100 },
    //是否显示操作列
    showOperate: { default: false },
    //操作列的项
    operateItem: {
      default: ()=>({
        save: true,
        add: true,
        remove: true,
        up: true,
        down: true,
      })
    },
    //是否显示状态列
    showStatus: { default: false },

  },
  data() {
    return {
      // 容器宽度
      width: 0,
      // 容器高度
      height: 0,
      // 单元格高度
      cellHeight: 40,
      // 滚动条的left距离
      scrollLeft: 0,
      // 滚动条的top距离
      scrollTop: 0,
      //每一行的hover存储
      lineHover: {},
      //列数据
      col: [],
      //行数据
      row: [],
      //表头层级关系
      colRel: [],
      reset: 0,
      //状态列宽度
      statusWidth: 4,
      //下拉、时间、日期等的点击某项时，临时保存的点击项
      selectFullData: null,
      
      /**
       * 下拉框变量集合
       */
      option_data: [], //option数据
      option_info: {}, //option其他信息
      option_loading: false, //option加载状态
      option_width: 0, //option宽度
      option_hide_arrow: false, //是否隐藏option小箭头
      option_left: 0, //option的left
      option_top: 0, //option的top
      option_show: false, //option是否显示
      /*与option分页有关*/
      option_current_page: 1, //option的当前页
      option_search: '', //option的搜索词
      option_total_number: 0, //option的总条数

      /**
       * datapicker变量集合
       */
      dataPicker_info: {},
      dataPicker_date: '',
      dataPicker_show: false,
      dataPicker_left: 0,
      dataPicker_top: 0,
      dataPicker_width: 0,

      /**
       * 时间选择器变量集合 
       */
      timePicker_show: false,
      timePicker_left: 0,
      timePicker_top: 0,
      timePicker_width: 0,
      timePicker_time: {},
      timeMinute: [],
      timeType: true, //am

      /**
      * 拖拽线变量
      */
      dragLeft: 0,
      dragLineShow: false,

      //hover单元格的变量
      hover_show: false,
      hover_info: {},
      hover_width: 0,
      hover_bottom: 0,
      hover_left: 0,

      //电脑还是手机
      isPC: true,
      //触摸距离
      _optionCanShowDisX: 0,
      _optionCanShowDisY: 0,

      // 操作列下拉
      operate_show: false,
      operate_left: 0, 
      operate_top: 0,
      operate_info: {},
      operate_loading: {},
  
      //方法调用的log日志
      log: [],
      startLog: false,
      //方向导航标的
      navCoods: {},

    };
  },

  computed: {
    //总宽度
    fullWidth() {
      let w = 0;
      for (let i = 0; i < this.col.length; i++) {
        if(!this.col[i].hide){
          w += this.col[i].width;
        };
      }
      if(this.showCheckBoxAndIndex){
        w += 40;
      }
      if(this.showOperate){
        w += 40;
      }
      if(this.showStatus){
        w += +this.statusWidth;
      }
      return w;
    },
    //总高度
    fullHeight() {
      // let needHeightNumber = this.colRelMaxLevel || 1; //因为表头占了top=0；所以最后一行会不见，需要多加一行计算！
      return this.cellHeight * (this.row.length + 0.5);
    },
    //x轴的偏移距离
    geScrollLeftArea: {
      get: function() {
        //x轴-滚动条宽度
        let x_width = this.width * this.width / this.fullWidth;
        //需要平移的宽度
        let tranlateX = 0;
        tranlateX =
          (this.scrollLeft + x_width) / this.width * this.fullWidth -
          this.width;
        return tranlateX;
      },
      set: function(val) {
        let x_width = this.width * this.width / this.fullWidth;
        this.scrollLeft =
          (val + this.width) / this.fullWidth * this.width - x_width;
      }
    },
    //y轴的偏移距离
    geScrollTopArea: {
      get: function() {
        //y轴-滚动条长度
        let height = (this.height - this.colRelMaxLevel * this.cellHeight)
        let y_width = height * height / this.fullHeight;
        //返回需要平移的高度
        let tranlateY = 0;
        tranlateY =
          (this.scrollTop + y_width) / height * this.fullHeight -
          height;
        return tranlateY;
      },
      set: function(val) {
        let height = (this.height - this.colRelMaxLevel * this.cellHeight)
        let y_width = height * height / this.fullHeight;
        this.scrollTop =
          (val + height) / this.fullHeight * height - y_width;
      }
    },
    //表头-左侧固定列
    colFixHeader() {
      return this.col.filter(col => col.fixed);
    },
    //表头-右侧活动列
    colActiveHeader() {
      return this.col.filter(col => !col.fixed);
    },
    //表头-左侧固定列【总宽度】
    colFixHeaderWidth() {
      let w = 0;
      for (let i = 0; i < this.colFixHeader.length; i++) {
        w += this.colFixHeader[i].width;
      }
      return w;
    },
    //表头-复选框的状态
    headerCheckStatus: {
      get: function(){
        /**
         * @description 首先需要排除禁用复选框的行
         */
        let all_len = this.row.filter(row => !row.noCheckAble).length;
        let checked_len = this.row.filter(row => row.checked && !row.noCheckAble).length;
        //没有行数
        if(all_len == 0){
          return false;
        }
        //全部选中
        if(all_len == checked_len){
          return 'all';
        }
        //部分选中
        if(checked_len > 0){
          return 'some';
        }
        //无选中
        if(checked_len == 0){
          return 'none';
        }
      },
      set: function(val){
        if(val == 'none'){
          let row = this.deepClone(this.row);
          row.forEach(r=>{
            if(!r.noCheckAble){
              r.checked = false
            }
          });
          this.row = row;
        }
        if(val == 'all'){
          let row = this.deepClone(this.row);
          row.forEach(r=>{
            if(!r.noCheckAble){
              r.checked = true
            }
          });
          this.row = row;
        };
      }
    },
    //hover的提示效果
    hover_text(){
      if(this.hover_info.type != 'mul_select' && this.hover_info.type != 'opt_mul_select'){
        return this.hover_info.value;
      };
      let res = this.row.filter(r=>r._rowid == this.hover_info.rowid);
      if(res.length == 0) return ''
      let textArr = res[0][this.hover_info.props].value;
      let html = `${ textArr.map( text => ` <span style="display: inline-block; margin: 2px; background: #fff; color: #009fff; padding: 2px 6px; border: 1px solid #009fff;">${text}</span> ` ).join('') }`
      return html;
    },
    //多级表头的最高层级数
    colRelMaxLevel(){
      let max = 1;
      for(let i=0; i<this.colRel.length; i++){
        if(this.colRel[i].level && this.colRel[i].level > max){
          max = this.colRel[i].level;
        };
      };
      return max;
    },
    //拼接所有层级关系的表头
    realCol(){
      let realCol = [];
      let maxLevel = this.colRelMaxLevel;
      let colLen = this.col.length;
      for(let i=0; i<this.colRel.length; i++){
        if(realCol[this.colRel[i].level-1] == undefined) realCol[this.colRel[i].level-1] = [];
        let obj = {
          _colid: "level-"+this.colRel[i].level+"-"+i,
          _top:( maxLevel - this.colRel[i].level) * this.cellHeight,
          title: this.colRel[i].title,
          _isLevel: true, //表示是层级头

          _left: 0,
          width: 0,
        };
        let indexStart = this.colRel[i].indexStart;
        let indexEnd = this.colRel[i].indexEnd || this.col.length;

        obj._left = this.col[indexStart]._left;
        let w = 0;
        for(let i=indexStart; i<indexEnd; i++){
          w += this.col[i].width;
        };

        obj.width = w;
        realCol[this.colRel[i].level - 1].push(obj);
      };

      //原始表头行（注意防止引用！）
      realCol[0] = this.jsonClone(this.col);
      for(let j=0; j<realCol[0].length; j++){
        realCol[0][j]._verticalSpace = this.colRelMaxLevel - 1;
      };
      //处理一级表头的top和height
      for(let i=0; i<this.colRel.length; i++){
        let start = this.colRel[i].indexStart;
        let end = this.colRel[i].indexEnd || colLen;
        
        for(let k=0; k<realCol[0].length; k++){
          if(k>=start && k<end){
            realCol[0][k]._verticalSpace -= 1;
          }
        };
      };
      return realCol;
    },
    //option总页数
    option_total_page(){
      return Math.ceil(this.option_total_number / this.option_limit);
    },
    //非请求型的的option不需要搜索
    option_show_search(){
      if(this.option_info.row == undefined){
        return false;
      };
      if(
        this.option_info.row[this.option_info.col.props].type == 'opt_select'
        ||
        this.option_info.row[this.option_info.col.props].type == 'opt_mul_select'
      ){
        return false;
      }
      return true;
    },
    //日期datapicker数据
    getPickerArray: {
      get: function(){
        if(this.dataPicker_date == '') return {};
        let val = this.dataPicker_date;
        //输入框值 == picker值？
        let nowActive = this.dataPicker_date == this.dataPicker_info.row[this.dataPicker_info.col.props].value;

        let d = new Date(val);
        // 总共的日期收集
        let date_array = [];
        // 当前-年
        let year = d.getFullYear();
        // 当前-月（从0开始）
        let month = +d.getMonth();
        // 当前-日
        let day = +d.getDate();
        // 当前月-第一天星期几
        let week = new Date(year+'-'+((+month+1)<10? '0'+(+month+1): (+month+1))+'-01').getDay();
        week == 0? week = 7: week = week;
        // 上个月最后要补多少天
        let deltaDay = week - 1;

        
        // 上个月-共多少天
        let prev_total = new Date((+month+1) == 1? year - 1: year, (+month+1)-1 == 0? 12: (+month+1)-1, 0).getDate();
        // 这个月-共多少天
        let now_total = new Date(year, (+month+1), 0).getDate();
        // 传入上个月的天数
        for(let i=deltaDay-1; i>=0; i--){
          let m2 = (+month+1) == 1? 12: (+month+1)-1;
          let d2 = prev_total - i;
          if(m2<10){
            m2 = '0' + m2
          }
          if(d2<10){
            d2 = '0' + d2
          }
          date_array.push({
            date: ((+month+1) == 1? year - 1: year) + '-' + m2 + '-' + d2,
            day: prev_total - i,
            currentMonth: false,
            active: false,
          })
        }
        //传入当前月的天数
        for(let i=1; i<=now_total; i++){
          let m2 = +month+1;
          let d2 = i;
          if(m2<10){
            m2 = '0' + m2
          }
          if(d2<10){
            d2 = '0' + d2
          }
          date_array.push({
            date: year + '-' + m2 + '-' + d2,
            currentMonth: true,
            day: i,
            active: (i==day && nowActive)? true: false,
            active2: (this.dataPicker_date.split(' ')[0] == (year + '-' + m2 + '-' + d2)) && this.dataPicker_info.row[this.dataPicker_info.col.props].type == 'datetime'
          })
        }
        //凑够42条了吗?不够就用下个月天数来凑。
        let now_length = date_array.length; 
        for(let i=1; i<=6*7 - now_length; i++){
          let m2 = (+month+1) == 12? 1: (+month+1)+1;
          let d2 = i;
          if(m2<10){
            m2 = '0' + m2
          }
          if(d2<10){
            d2 = '0' + d2
          }
          date_array.push({
            date: ((+month+1) == 12? year + 1: year) + '-' + m2 + '-' + d2,
            day: i,
            currentMonth: false,
            active: false,
          })
        }
        //分成（6行*7列）二维数组
        let res = [];
        let k=0;
        for(let i=0; i<6; i++){
          res[i] = [];
          for(let j=0; j<7; j++){
            res[i].push(date_array[k]);
            k++;
          }
        }

        return {
          year,
          month: (+month+1)<10? '0'+(+month+1):(+month+1),
          day,
          week,
          res,
        };
      },
      set: function(date){
        this.dataPicker_date = date;
      }
    },
    //时间timepicker数据
    timePickerComputed: {
      get: function(){
        let h = this.timePicker_time.h;
        let m = this.timePicker_time.m;
        let s = this.timePicker_time.s;
        let radius = ((+m) / 60) * 360; //旋转度数
        return { ...this.timePicker_time, h, s, m, radius };
      },
      set: function(val){
        this.timePicker_time = val;
      }
    },
    //小时数据（仅用于展示外圈）
    timeHoursComputed(){
      let tm = [];
      let radius = 50, //看css即可知道半径
          centerX = 110,//中心点坐标
          centerY = 110,
          w = 24; //span宽高是24
      for(let i=0; i<12; i++){
        tm.push({
          value: this.timeType? (i == 0? 12: i): ((i+12) == 12? 0: i+12),
          alias: this.timeType? i == 0? '12': false: i == 0? '凌晨': false,
          left: centerX + radius * Math.cos(i*(2*Math.PI)/12 - Math.PI/2) - w/2,
          top: centerY + radius * Math.sin(i*(2*Math.PI)/12 - Math.PI/2) - w/2,
        });
      }
      return tm;
    },
    //小时timepicker数据(用于小时指针)
    pickerHoursComputed: {
      get: function(){
        let h = this.timePicker_time.h;
        if(h != undefined && h<12){
          this.timeType = true;
        }
        if(h != undefined && h>12){
          this.timeType = false;
        }
        let radius = ((+h) / 12) * 360 - 90; //旋转度数
        return { h, radius };
      },
      set: function(val){
        this.timePicker_time.h = val;
      }
    },
    //用于datetime类型的选择器的时分秒
    dateTimeHMS(){
      let d = new Date(this.dataPicker_date);
      return {
        h: d.format('hh'),
        m: d.format('mm'),
        s: d.format('ss')
      }
    },
    //高亮-编辑单元格
    navCoodsComp(){
      if(this.navCoods.row == undefined || this.navCoods.row == ''){
        return {row: '', col: ''};
      };
      return {
        row: this.navCoods.row._rowid,
        col: this.navCoods.col._colid,
      }
    },
    //高亮-处于编辑状态的行
    sheetLineActived(){
      if(this.operate_show){
        return this.operate_info._rowid;
      }else{
        if(this.navCoods.row){
          return this.navCoods.row._rowid;
        }else{
          return -1;
        }
      }
    },


  },

  created() {},

  watch: {},

  mounted() {
    this.fixedWidthHeight();
    window.addEventListener("resize", this.fixWindowResize);
    document.addEventListener("click", this.hideOption);
    document.addEventListener("keydown", this.keydown);
    /**
    * 整体初始化
    */
    this.init();
  },

  methods: {
    print(m){
      window.console.log(m)
    },
    logFn(m){
      if(this.startLog){
        this.log.push(m)
      }
    },
    // 初始化
    init() {
      this.logFn('init')
      this.row = this.deepClone(this.rowData);
      this.col = this.deepClone(this.colData);
      this.colRel = this.deepClone(this.colRelation);
      /**
      * @name 定义行数据、列数据的_rowid、_colid
      */
      let rowid = 0;
      let colid = 0;
      for (let i = 0; i < this.row.length; i++) {
        if(this.row[i]._rowid == undefined){
          this.row[i]._rowid = rowid; 
          rowid++;
        }
        this.row[i]._error = this.row[i]._error != undefined? this.row[i]._error: false;
        this.row[i]._modify = this.row[i]._modify != undefined? this.row[i]._modify: false;
      }
      for (let i = 0; i < this.col.length; i++) {
        if(this.col[i]._colid == undefined){
          this.col[i]._colid = 'level-1-'+colid;
          colid++;
        }
        if(this.col[i]._sort == undefined){
          this.col[i]._sort = ''; //用于排序：'asc'、'desc'、''
        }
        if(this.col[i].width == undefined){
          this.col[i].width = 90;
        };
        if(typeof this.col[i].width != 'number'){
          console.error(this.col[i].title + '的width必须是number类型！')
          return ;
        };
      }

      /**
       * @name 定义每列离最左侧的绝对距离
       */
      for (let i = 0; i < this.col.length; i++) {
        let left = 0;
        if(this.showCheckBoxAndIndex){
          left = 40;
        };
        if(this.showOperate){
          left += 40;
        }
        if(this.showStatus){
          left += +this.statusWidth;
        }
        for (let j = 0; j < i; j++) {
          // 注意：hide为true的列的距离不需要计算
          if(!this.col[j].hide){
            left += this.col[j].width;
          }
        }
        this.col[i]._left = left;
        this.col[i]._top = (this.colRelMaxLevel - 1) * this.cellHeight;
      }

      //尝试修复最后一列不合适的宽度
      this.fixLastCol(this.col)
      
      //判断电脑、手机
      if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(window.navigator.userAgent)) { 
        this.isPC = false; 
      }else{
        this.isPC = true; 
      };

      Date.prototype.format = function (fmt) {
        if(this.toString() == 'Invalid Date'){
          return ''
        };
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }

    },
    // 修复容器的高度、宽度
    fixedWidthHeight() {
      this.logFn('fixedWidthHeight')
      let wrap = this.$refs.wrap;
      if (wrap instanceof Array) {
        wrap = wrap[0];
      }
      this.width = wrap.offsetWidth;
      this.height = wrap.offsetHeight;
      this.fixLastCol(this.col);
    },
    // 检查列总宽度是否为容器宽度，并且最后一列会把宽度设置合适
    fixLastCol(col){
      this.logFn('fixLastCol')
      if(!col || col.length == 0) return ;
      let col2 = this.jsonClone(col);
      let colWillWidth = 0;
      for (let i = 0; i < col2.length; i++) {
        //注意消除隐藏列和最后一列的影响
        if(!col2[i].hide && i != col2.length - 1){
          colWillWidth += col2[i].width;
        }
      }
      if(this.showCheckBoxAndIndex){
        colWillWidth += 40;
      }
      if(this.showOperate){
        colWillWidth += 40;
      }
      if(this.showStatus){
        colWillWidth += +this.statusWidth;
      }
      let titleNumber = col2[col2.length - 1].title.length;
      let lastWidth = col2[col2.length - 1].width || 0;
      if(colWillWidth < this.width){
        col2[col2.length - 1].width = Math.max(this.width - colWillWidth, 30 + titleNumber * 16, 100, lastWidth);
      }else{
        col2[col2.length - 1].width = Math.max(30 + titleNumber * 16, 100, lastWidth);
      }
      this.col = col2
    },
    // 日期时间的placeholder
    placeholder_date(type){
      this.logFn('placeholder_date')
      if(type == 'date'){
        return 'yyyy-MM-dd';
      }
      if(type == 'time'){
        return 'hh:mm:ss';
      }
      if(type == 'datetime'){
        return 'yyyy-MM-dd hh:mm:ss';
      }
      if(type == 'month'){
        return '输入月份';
      }
      if(type == 'year'){
        return '输入年份';
      }   
    },
    // 表体-复选框的切换
    checkBox(row){
      this.logFn('checkBox')
      for (let i = 0; i < this.row.length; i++) {
        if (this.row[i]._rowid == row._rowid) {
          this.row[i].checked = !this.row[i].checked;
          this.$forceUpdate();
          return;
        }
      };
    },
    // 滚动条-拖拽按下
    scrollMouseDown(e, type) {
      this.logFn('scrollMouseDown')
      e.preventDefault();
      this.option_show = false;
      this.dataPicker_show = false;
      this.timePicker_show = false;
      this.operate_show = false;
      let vm = this;
      let left, offsetX, top, offsetY;
      if (type == "x") {
        left = this.scrollLeft;
        offsetX = e.clientX;
      } else if (type == "y") {
        top = this.scrollTop;
        offsetY = e.clientY;
      } else {
        console.warn("请传入参数type");
        return false;
      }
      window.addEventListener("mousemove", mousemove);
      window.addEventListener("mouseup", mouseup);
      function mousemove(e) {
        let height = vm.height - vm.colRelMaxLevel * vm.cellHeight;
        if (type == "x") {
          let ll = left + (e.clientX - offsetX);
          if (ll < 0) ll = 0;
          let drag_w = vm.width * vm.width / vm.fullWidth;
          if (ll + drag_w > vm.width) ll = vm.width - drag_w;
          vm.scrollLeft = ll;
        } else {
          let tt = top + (e.clientY - offsetY);
          if (tt < 0) tt = 0;
          let drag_h = height * height / vm.fullHeight;
          if (tt + drag_h > height) tt = height - drag_h;
          vm.scrollTop = tt;
        }
      }
      function mouseup(e) {
        window.removeEventListener("mousemove", mousemove);
        window.removeEventListener("mouseup", mouseup);
      }
    },
    // 滚动条-鼠标滚轮
    mousewheel(e) {
      this.logFn('mousewheel')
      this.option_show = false;
      this.dataPicker_show = false;
      this.timePicker_show = false;
      this.operate_show = false;
      let height = this.height - this.colRelMaxLevel * this.cellHeight;
      //无滚动条不需要滚动
      if(height * height / this.fullHeight >= this.height - this.cellHeight * this.colRelMaxLevel) return ;

      let maxTop = height - height * height / this.fullHeight;
      let scrollTop = this.scrollTop;
      
      //滚轮速度
      let scrollYSpeed = this.scrollSpeed * (height / this.fullHeight) * this.cellHeight;
      if (e.wheelDelta) {
        // 1、IE/谷歌
        if (e.wheelDelta > 0) {
          //向上，阻止滚动父层
          if(scrollTop > 0){
            e.preventDefault()
          }
          scrollTop -= scrollYSpeed;
        }
        if (e.wheelDelta < 0) {
          //向下，阻止滚动父层
          if(scrollTop < maxTop){
            e.preventDefault() 
          }
          scrollTop += scrollYSpeed;
        }
      } else if (e.detail) {
        // 2、火狐
        if (e.detail > 0) {
          //向上，阻止滚动父层
          if(scrollTop > 0){
            e.preventDefault()
          }
          scrollTop -= scrollYSpeed;
        }
        if (e.detail < 0) {
          //向下，阻止滚动父层
          if(scrollTop < maxTop){
            e.preventDefault() 
          }
          scrollTop += scrollYSpeed;
        }
      }
      if (scrollTop < 0) scrollTop = 0;
      if (scrollTop > maxTop) scrollTop = maxTop;
      this.scrollTop = scrollTop;
    },
    // 触摸开始
    touchstart(e) {
      this.logFn('touchstart')
      this._optionCanShowDisX = 0;
      this._optionCanShowDisY = 0;
      e.preventDefault();
      let block = this.$refs.container;
      let touches = e.touches[0];
      this._geScrollLeftArea = this.geScrollLeftArea;
      this._geScrollTopArea = this.geScrollTopArea;
      this._startx = Math.floor(touches.pageX);
      this._starty = Math.floor(touches.pageY);
      block.addEventListener("touchmove", this.touchmove);
      block.addEventListener("touchend", this.touchend);
    },
    // 触摸移动
    touchmove(e) {
      this.logFn('touchmove')
      e.preventDefault();
      let endx = Math.floor(e.changedTouches[0].pageX);
      let endy = Math.floor(e.changedTouches[0].pageY);
      let nx = endx - this._startx;
      let ny = endy - this._starty;
      let angle = Math.atan2(ny, nx) * 180 / Math.PI;
      let geScrollTopArea = 0;
      let geScrollLeftArea = 0;
      if (Math.abs(nx) <= 1 || Math.abs(ny) <= 1) {
        // 滑动距离太小
        this._optionCanShowDisX = 0;
        this._optionCanShowDisY = 0;
        return false;
      }
      if (angle < 45 && angle >= -45) {
        //右滑动
        geScrollLeftArea = this._geScrollLeftArea - Math.abs(nx);
        if (geScrollLeftArea < 0) geScrollLeftArea = 0;
        this.geScrollLeftArea = geScrollLeftArea;

        this._optionCanShowDisX = Math.abs(nx);
        this._optionCanShowDisY = Math.abs(0);
      } else if (angle < 135 && angle >= 45) {
        //下滑动
        geScrollTopArea = this._geScrollTopArea - Math.abs(ny);
        if (geScrollTopArea < 0) geScrollTopArea = 0;
        this.geScrollTopArea = geScrollTopArea;

        this._optionCanShowDisX = Math.abs(0);
        this._optionCanShowDisY = Math.abs(ny);
      } else if (
        (angle <= 180 && angle >= 135) ||
        (angle >= -180 && angle < -135)
      ) {
        //左滑动
        geScrollLeftArea = this._geScrollLeftArea + Math.abs(nx);
        if (geScrollLeftArea > this.fullWidth - this.width)
          geScrollLeftArea = this.fullWidth - this.width;
        this.geScrollLeftArea = geScrollLeftArea;

        this._optionCanShowDisX = Math.abs(nx);
        this._optionCanShowDisY = Math.abs(0);
      } else if (angle <= -45 && angle >= -135) {
        //上滑动
        geScrollTopArea = this._geScrollTopArea + Math.abs(ny);
        if (geScrollTopArea > this.fullHeight - (this.height - this.colRelMaxLevel * this.cellHeight))
          geScrollTopArea = this.fullHeight - (this.height - this.colRelMaxLevel * this.cellHeight);
        this.geScrollTopArea = geScrollTopArea;

        this._optionCanShowDisX = Math.abs(0);
        this._optionCanShowDisY = Math.abs(ny);
      }
    },
    // 触摸结束
    touchend(e) {
      this.logFn('touchend')
      e.preventDefault();
      let block = this.$refs.container;
      block.removeEventListener("touchmove", this.touchmove);
      block.removeEventListener("touchup", this.touchup);
    },
    // input框在移动端的touchend
    inpTouchEnd(rowid, colid){
      this.logFn('inpTouchEnd')
      //触摸移动状态就不出现option
      if(this._optionCanShowDisX > 15 || this._optionCanShowDisY>15){
        return ;
      };

      let inp = this.$refs['inp-'+rowid+'-'+colid];
      if(inp == undefined || inp == null) return ;
      if(inp instanceof Array){
        inp = inp[0]
      }
      inp.focus();
    },
    //操作列的增、删、移动操作
    operateFn(type){
      this.logFn('operateFn')
      let rowItem = this.operate_info;
      let row = this.jsonClone(this.getTable().row);
      let vm = this;
      switch (type) {
        case 'add':
          if(this.entry != false && JSON.stringify(this.entry) != '{}'){
            for(let i=0; i<row.length; i++){
              if(row[i]._rowid == rowItem._rowid){
                let entry = this.deepClone(this.entry);
                entry.checked = false;
                entry._error = false;
                entry._modify = true;
                entry._add = true;
                entry._rowid = Date.now();
                for(let [key, value] of Object.entries(entry)){
                  if(typeof value.value == 'function'){
                    entry[key].value = value.value()
                  }
                  if(typeof value.id == 'function'){
                    entry[key].id = value.id()
                  }
                };
                row.splice(i+1, 0, entry);
                break ;
              }
            }
            this.row = row;
          }
          else{
            return false;
          }
          break;
        case 'remove':
          this.operate_show = false;
          this.$set(this.operate_loading, 'loading'+rowItem._rowid, true);
          this.$set(this.operate_loading, 'loading-type-'+rowItem._rowid, 'remove');

          let success = function(){
            row = this.jsonClone(this.getTable().row);
            for(let i=0; i<row.length; i++){
              if(row[i]._rowid == rowItem._rowid){
                row.splice(i, 1);
                break ;
              }
            }
            this.row = row;
            this.$set(this.operate_loading, 'loading'+rowItem._rowid, false);
          };

          let faild = function(){
            this.$set(this.operate_loading, 'loading'+rowItem._rowid, false);
          };

          this.$emit('removeLine', {
            data: rowItem,
            success: success.bind(this),
            faild: faild.bind(this),
          });
          
          return;
        case 'up':
          for(let i=0; i<row.length; i++){
            if(row[i]._rowid == rowItem._rowid){
              if(i == 0) return;
              let cur = this.jsonClone(rowItem);
              row.splice(i, 1);
              row.splice(i - 1, 0, cur);
              break ;
            }
          }
          this.row = row;
          break;
        case 'down':
          for(let i=0; i<row.length; i++){
            if(row[i]._rowid == rowItem._rowid){
              if(i == row.length - 1) return;
              let xiamian = this.jsonClone(row[i + 1]);
              row.splice(i + 1, 1);
              row.splice(i, 0, xiamian);
              break ;
            }
          }
          this.row = row;
          break;
        case 'save':
          this.operate_show = false;
          let getTitleByProps = function(props){
            for(let i=0; i<vm.col.length; i++){
              if(vm.col[i].props == props){
                return vm.col[i].title;
              }
            }
          };
          for(let i=0; i<this.row.length; i++){
            if(rowItem._rowid == this.row[i]._rowid){
              for(let [key, attr] of Object.entries(this.row[i])){
                if(attr.required == true){
                  if(attr.type == 'number'){
                    if(isNaN(attr.value)){
                      let msg = getTitleByProps(key);
                      this.row[i]._error = true;
                      this.$emit('saveLine', {
                        status: 'checkFail',
                        msg: '第'+ (i * 1 + 1) + '行，' + msg + '列 不能为空！'
                      })
                      return ;
                    }
                  }else{
                    if((attr.value+'').trim() == ''){
                      let msg = getTitleByProps(key);
                      this.row[i]._error = true;
                      this.$emit('saveLine', {
                        status: 'checkFail',
                        msg: '第'+ (i * 1 + 1) + '行，' + msg + '列 不能为空！'
                      })
                      return ;
                    }
                  }
                }
              };
              break ;
            }
          };
          
          this.$set(this.operate_loading, 'loading'+rowItem._rowid, true);
          this.$set(this.operate_loading, 'loading-type-'+rowItem._rowid, 'save');

          let complate = function(){
            this.$set(this.operate_loading, 'loading'+rowItem._rowid, false);
          };

          this.$emit('saveLine', {
            status: 'checkSuccess',
            data: rowItem,
            complate: complate.bind(this)
          });

          return ;
      };
      //重新定位悬浮框位置
      this.$nextTick(()=>{
        setTimeout(()=>{
          this.operateShowFn(rowItem, true);
        }, 166);
      })
    },
    //显示操作option
    operateShowFn(rowItem, isShow){
      this.logFn('operateShowFn')
      let dom = this.$refs['operate-'+rowItem._rowid];
      if(dom instanceof Array){
        dom = dom[0];
      };
      this.dataPicker_show = false;
      this.timePicker_show = false;
      this.option_show = false;
      this.hover_show = false;

      let rect = dom.getBoundingClientRect();
      let rect2 = this.$refs.container.getBoundingClientRect();

      //位置处理
      let left = rect.left - rect2.left - 5;
      this.operate_left = left;

      let will_top = rect.top - rect2.top + rect.height + 4;
      let w_h = document.documentElement.clientHeight || document.body.clientHeight;
      let opt_h = 184;
      let ful_h = +will_top + +rect2.top + opt_h;
      if(ful_h > w_h){
        will_top = will_top - (ful_h - w_h);
        this.option_hide_arrow = true;
      }else{
        this.option_hide_arrow = false;
      }
      this.operate_top = will_top;
      
      this.operate_info = rowItem;
      if(isShow != undefined){
        this.operate_show = isShow;
      } else {
        this.operate_show = !this.operate_show;
      }
    },

    /**
    * @description 修改this.row对应项
    */
    modifyByRowCol(rowid, props, val, id) {
      this.logFn('modifyByRowCol')
      for (let i = 0; i < this.row.length; i++) {
        if (this.row[i]._rowid == rowid) {
          this.row[i][props].value = val;
          if (id != undefined) {
            this.row[i][props].id = id;
            //下拉才会改变id，所以在这可以派发下拉选中
            let col = null;
            for(let j=0; j<this.col.length; j++){
              if(this.col[j].props == props){
                col = this.col[j]
                break ;
              }
            };
            if(this.selectFullData == 'close'){
              this.$emit('selectChange', {value: val, id, rowid, col, close: true});
              return ;
            } 
            if(this.selectFullData){
              this.$emit('selectChange', {value: val, id, rowid, col, clickData: this.selectFullData});
            }else{
              this.$emit('selectChange', {value: val, id, rowid, col});
            };
          }
          //该行被修改过了
          this.row[i]._modify = true;
          //重置错误标记
          this.row[i]._error = false;
          return;
        }
      }
    },
    //数字框-验证
    checkNumber(row, col, val){
      this.logFn('checkNumber')
      val *= 1;
      if(row[col.props].min != undefined){
        if(val < row[col.props].min){
          val = row[col.props].min;
        }
      }
      if(row[col.props].max != undefined){
        if(val > row[col.props].max){
          val = row[col.props].max;
        }
      }
      if(row[col.props].floatLength != undefined){
        val = (val*1).toFixed(row[col.props].floatLength)
      }
      this.selectFullData = null;
      this.modifyByRowCol(row._rowid, col.props, val);
    },
    //日期、时间、日期时间、年、月-验证
    checkDate(row, col, val, type){
      this.logFn('checkDate')
      // 日期 正则
      let dateReg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
      // 时间 正则
      let timeReg = /^(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
      // 日期+时间 正则
      let dateTimeReg = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
      // 年份-正则
      let yearReg = /^(1849|18[5-9]\d|20\d{2}|2200)$/;
      // 月份-正则
      let monthReg = /^0?[1-9]$|^1[0-2]$/;

      this.selectFullData = null;
      
      if((val+'').trim() == ''){
        this.modifyByRowCol(row._rowid, col.props, '');
        return ; 
      }
      if(type == 'date'){
        let regExp = new RegExp(dateReg);
        if(!regExp.test(val)){
          this.modifyByRowCol(row._rowid, col.props, '');
          return ;
        }
      }
      if(type == 'time'){
        let regExp = new RegExp(timeReg);
        if(!regExp.test(val)){
          this.modifyByRowCol(row._rowid, col.props, '');
          return ;
        }
      }
      if(type == 'datetime'){
        let regExp = new RegExp(dateTimeReg);
        if(!regExp.test(val)){
          this.modifyByRowCol(row._rowid, col.props, '');
          return ;
        }
      }
      if(type == 'month'){
        let regExp = new RegExp(monthReg);
        if(!regExp.test(val)){
          this.modifyByRowCol(row._rowid, col.props, '');
          return ;
        }
      }
      if(type == 'year'){
        let regExp = new RegExp(yearReg);
        if(!regExp.test(val)){
          this.modifyByRowCol(row._rowid, col.props, '');
          return ;
        }
      }
      this.modifyByRowCol(row._rowid, col.props, val);
    },
    //下拉input的close
    selectClose(row, col, type){
      this.logFn('selectClose')
      this.selectFullData = 'close';
      if(type == 'mul_select' || type == 'opt_mul_select'){
        this.modifyByRowCol(row._rowid, col.props, [], []);
      }else if(type == 'select' || type == 'opt_select'){
        this.modifyByRowCol(row._rowid, col.props, '', '');
      }else if(type == 'date' || type == 'time' || type == 'datetime'){
        this.modifyByRowCol(row._rowid, col.props, '');
      }
      this.hideOption();
    },

    //单选下拉-（聚焦+远程搜索）
    searchFocus(row, col, isMul){
      this.logFn('searchFocus')
      let dom = this.$refs['cell-'+row._rowid+'-'+col._colid];
      if(dom instanceof Array){
        dom = dom[0];
      };
      this.option_show = false;
      this.dataPicker_show = false;
      this.hover_show = false;
      this.timePicker_show = false;
      this.operate_show = false;
      //先全部选中
      dom.querySelector('input').select();

      let rect = dom.getBoundingClientRect();
      let rect2 = this.$refs.container.getBoundingClientRect();

      //option的处理
      this.option_info = {row, col};
      this.option_width = Math.min(Math.max(rect.width, 166), 400);
      let left = rect.left - rect2.left - 5;
      if(rect2.width < left + this.option_width){
        left = rect2.width - this.option_width - 5;
      }
      this.option_left = left;
      
      let will_top = rect.top - rect2.top + rect.height + 4;
      let w_h = document.documentElement.clientHeight || document.body.clientHeight;
      let opt_h = 226;
      let ful_h = +will_top + +rect2.top + opt_h;
      if(ful_h > w_h){
        will_top = will_top - (ful_h - w_h);
        this.option_hide_arrow = true;
      }else{
        this.option_hide_arrow = false;
      }
      this.option_top = will_top;
      this.option_show = true;

      this.option_loading = true;
      //兼容火狐的滚轮事件
      this._wheelStop = function(e){
        e.stopPropagation();
      }
      this.$refs.optionDOM.removeEventListener('DOMMouseScroll', this._wheelStop)
      this.$refs.optionDOM.addEventListener('DOMMouseScroll', this._wheelStop)

      //回到第1页
      this.option_current_page = 1;

      //通过http请求option数据
      this.$nextTick(()=>{
        let pos = row[col.props].dataPos || 'data.result';
        pos = pos.split('.');
        let total = row[col.props].dataTotal || 'data.total';
        total = total.split('.');
        //刚聚焦时，清空搜索，这样能搜索全部
        this.option_search = '';

        this.searchRemote(row[col.props]).then(res=>{
          let realData = this.jsonClone(res.data);
          for(let i=0; i<pos.length; i++){
            realData = realData[pos[i]]
          };
          let realData2 = this.jsonClone(res.data);
          let to = realData2;
          for(let i=0; i<total.length; i++){
            to = to[total[i]]
          };
          this.option_total_number = to;

          this.option_loading = false;
          this.cellOver(row, col, true)
          //对选中的select状态进行处理
          if(isMul){
            for(let i=0; i<realData.length; i++){
              for(let j=0; j<row[col.props].id.length; j++){
                if(realData[i].id + '' == row[col.props].id[j] + ''){
                  realData[i].select = true;
                  break ;
                }
              }
            }
          }else{
            for(let i=0; i<realData.length; i++){
              if(realData[i].id + '' == row[col.props].id + ''){
                realData[i].select = true;
                break ;
              }
            }
          };
          this.option_data = realData;
        }).catch(err=>{
          this.option_loading = false;
          this.option_data = [];
          console.error(err);
        });
      });
    },
    //有option的单/多选下拉
    opt_searchFocus(row, col, isMul){
      this.logFn('opt_searchFocus')
      let dom = this.$refs['cell-'+row._rowid+'-'+col._colid];
      this.option_show = false;
      this.dataPicker_show = false;
      this.hover_show = false;
      this.timePicker_show = false;
      this.operate_show = false;
      if(dom instanceof Array){
        dom = dom[0];
      };
      //先全部选中
      dom.querySelector('input').select();

      let rect = dom.getBoundingClientRect();
      let rect2 = this.$refs.container.getBoundingClientRect();
      
      //option的处理
      this.option_info = {row, col};
      this.option_left = rect.left - rect2.left - 5;

      let will_top = rect.top - rect2.top + rect.height + 4;
      let w_h = document.documentElement.clientHeight || document.body.clientHeight;
      let opt_h = 172;
      let ful_h = +will_top + +rect2.top + opt_h;
      if(ful_h > w_h){
        will_top = will_top - (ful_h - w_h);
        this.option_hide_arrow = true;
      }else{
        this.option_hide_arrow = false;
      }
      this.option_top = will_top;
      
      this.option_width = Math.min(Math.max(rect.width, 166), 400);
      this.option_loading = false;
      this.option_show = true;

      //兼容火狐的滚轮事件
      this._wheelStop = function(e){
        e.stopPropagation();
      }
      this.$refs.optionDOM.removeEventListener('DOMMouseScroll', this._wheelStop)
      this.$refs.optionDOM.addEventListener('DOMMouseScroll', this._wheelStop)

      //回到第1页
      this.option_current_page = 1;
      this.$nextTick(()=>{
        //刚聚焦时，清空搜索
        this.option_search = '';

        let realData = this.jsonClone(row[col.props].option);
        let to = realData;
        this.option_total_number = to.length;

        this.option_loading = false;
        this.cellOver(row, col, true)
        //对选中的select状态进行处理
        if(isMul){
          for(let i=0; i<realData.length; i++){
            for(let j=0; j<row[col.props].id.length; j++){
              if(realData[i].id + '' == row[col.props].id[j] + ''){
                realData[i].select = true;
                break ;
              }
            }
          }
        }else{
          for(let i=0; i<realData.length; i++){
            if(realData[i].id + '' == row[col.props].id + ''){
              realData[i].select = true;
              break ;
            }
          }
        };
        this.option_data = realData;
      });
    },

    //日期选择datapicker-聚焦
    dataPickerFocus(row, col){
      this.logFn('dataPickerFocus')
      let dom = this.$refs['cell-'+row._rowid+'-'+col._colid];
      if(dom instanceof Array){
        dom = dom[0];
      };
      //隐藏option的DOM下拉
      this.option_show = false;
      this.dataPicker_show = false;
      this.hover_show = false;
      this.timePicker_show = false;
      this.operate_show = false;
      //先全部选中
      dom.querySelector('input').select();

      let rect = dom.getBoundingClientRect();
      let rect2 = this.$refs.container.getBoundingClientRect();

      //picker的数据、位置处理
      this.dataPicker_info = {row, col};
      if(this.dataPicker_info.row[this.dataPicker_info.col.props].type == 'datetime'){
        this.dataPicker_date = row[col.props].value || new Date().format('yyyy-MM-dd hh:mm:ss');
      }else{
        this.dataPicker_date = row[col.props].value || new Date().format('yyyy-MM-dd');
      };
      let left = rect.left - rect2.left - 5;
      if(rect2.width < left + 220){
        left = rect2.width - 220 - 5;
      }
      this.dataPicker_left = left;

      let will_top = rect.top - rect2.top + rect.height + 4;
      let w_h = document.documentElement.clientHeight || document.body.clientHeight;
      let opt_h = 0;
      if(row[col.props].type == 'datetime'){
        opt_h = 346;
      }else{
        opt_h = 314;
      }
      let ful_h = +will_top + +rect2.top + opt_h;
      if(ful_h > w_h){
        will_top = will_top - (ful_h - w_h);
        this.option_hide_arrow = true;
      }else{
        this.option_hide_arrow = false;
      }
      this.dataPicker_top = will_top;

      this.dataPicker_width = 220;
      this.dataPicker_show = true;
    },
    //选择日期选择某项
    datapickerClick(date){
      this.logFn('datapickerClick')
      this.selectFullData = null;
      if(this.dataPicker_info.row[this.dataPicker_info.col.props].type == 'datetime'){
        // 现在btn
        if(date == null){
          this.dataPicker_date = new Date().format('yyyy-MM-dd hh:mm:ss');
          this.modifyByRowCol(
            this.dataPicker_info.row._rowid,
            this.dataPicker_info.col.props,
            this.dataPicker_date,
          );
          this.$emit('dateChange', {
            value: this.dataPicker_date, 
            rowid: this.dataPicker_info.row._rowid, 
            col: this.dataPicker_info.col,
          });
          this.dataPicker_show = false;
          return ;
        }
        // 清空btn
        if(date == 'clear'){
          date = '';
          this.modifyByRowCol(
            this.dataPicker_info.row._rowid,
            this.dataPicker_info.col.props,
            date,
          );
          this.$emit('dateChange', {
            value: date, 
            rowid: this.dataPicker_info.row._rowid, 
            col: this.dataPicker_info.col,
          });
          this.dataPicker_show = false;
          return ;
        };
        // 完成btn
        if(date == 'confirm'){
          this.modifyByRowCol(
            this.dataPicker_info.row._rowid,
            this.dataPicker_info.col.props,
            this.dataPicker_date
          );
          this.$emit('dateChange', {
            value: this.dataPicker_date, 
            rowid: this.dataPicker_info.row._rowid, 
            col: this.dataPicker_info.col
          });
          this.dataPicker_show = false;
          return ;
        };
        // 其他日期项的选择
        this.dataPicker_date = date + ' ' + new Date(this.dataPicker_date).format('hh:mm:ss');
        
      }else{
        if(!date){
          date = new Date().format('yyyy-MM-dd');
        }
        if(date == 'clear'){
          date = ''
        }
        this.modifyByRowCol(
          this.dataPicker_info.row._rowid,
          this.dataPicker_info.col.props,
          date,
        );
        this.$emit('dateChange', {
          value: date, 
          rowid: this.dataPicker_info.row._rowid, 
          col: this.dataPicker_info.col,
        });
        this.dataPicker_show = false;
      };
    },
    //日期选择datapicker-年份
    dateYear(del){
      this.logFn('dateYear')
      let d = this.dataPicker_date.split('-');
      let year = +d[0] + del;
      this.dataPicker_date = [year, d[1], d[2]].join('-');
    },
    //日期选择datapicker-月份
    dateMonth(del){
      this.logFn('dateMonth')
      if(this.dataPicker_info.row[this.dataPicker_info.col.props].type == 'datetime'){
        let old_yyyy = new Date(this.dataPicker_date).format('yyyy');
        let old_MM = new Date(this.dataPicker_date).format('MM');
        let old_dd = new Date(this.dataPicker_date).format('dd');

        let old_hh = new Date(this.dataPicker_date).format('hh');
        let old_mm = new Date(this.dataPicker_date).format('mm');
        let old_ss = new Date(this.dataPicker_date).format('ss');
        
        old_MM = +old_MM + del;

        if(old_MM < 1){
          old_MM = 12;
          old_yyyy = old_yyyy - 1;
        }
        if(old_MM > 12){
          old_MM = 1;
          old_yyyy = +old_yyyy + 1;
        }
        if(old_MM<10){
          old_MM = '0'+old_MM
        }
        let will = `${old_yyyy}-${old_MM}-${old_dd} ${old_hh}:${old_mm}:${old_ss}`;
        //'2月31号'情景需要处理
        this.dataPicker_date = new Date(will).format('yyyy-MM-dd hh:mm:ss');
      }else{
        let d = this.dataPicker_date.split('-');
        let y = +d[0];
        let m = +d[1];
        let day = +d[2];
        let m2 = m + del;
        if(m2 == 0){
          m2 = 12;
          y = y - 1;
        }
        if(m2 == 13){
          m2 = 1;
          y = y + 1;
        }
        if(m2 < 10){
          m2 = '0' + m2;
        }
        if(day < 10){
          day = '0' + day;
        }
        this.dataPicker_date = [y, m2, day].join('-');
      };
    },
    //改变时分秒
    dateTimeHMSFn(e, type){
      this.logFn('dateTimeHMSFn')
      let val = +e.target.value;
      let _date = new Date(this.dataPicker_date);
      let old_yyyy = _date.format('yyyy');
      let old_MM = _date.format('MM');
      let old_dd = _date.format('dd');

      let old_hh = _date.format('hh');
      let old_mm2= _date.format('mm');
      let old_ss = _date.format('ss');

      if(type == 'h'){
        old_hh = val;
        if(old_hh >= 24){
          old_hh = 0;
        }
        if(old_hh < 0){
          old_hh = 23;
        }
      }
      if(type == 'm'){
        old_mm2 = val;
        if(old_mm2 >= 60){
          old_mm2 = 0;
        }
        if(old_mm2 < 0){
          old_mm2 = 59;
        }
      }
      if(type == 's'){
        old_ss = val;
        if(old_ss >= 60){
          old_ss = 0;
        }
        if(old_ss < 0){
          old_ss = 59;
        }
      }
      if(old_hh < 10){
        old_hh = '0' + +old_hh;
      }
      if(old_mm2 < 10){
        old_mm2 = '0' + +old_mm2;
      }
      if(old_ss < 10){
        old_ss = '0' + +old_ss;
      }
      this.dataPicker_date = `${old_yyyy}-${old_MM}-${old_dd} ${old_hh}:${old_mm2}:${old_ss}`;
    },

    //时间选择器-聚焦
    timePickerFocus(row, col){
      this.logFn('timePickerFocus')
      let dom = this.$refs['cell-'+row._rowid+'-'+col._colid];
      if(dom instanceof Array){
        dom = dom[0];
      };
      //隐藏option的DOM下拉
      this.option_show = false;
      this.dataPicker_show = false;
      this.hover_show = false;
      this.timePicker_show = false;
      this.operate_show = false;
      //先全部选中
      dom.querySelector('input').select();

      let rect = dom.getBoundingClientRect();
      let rect2 = this.$refs.container.getBoundingClientRect();

      //picker的数据、位置处理
      let p_time= row[col.props].value;
      if(!p_time){
        p_time = new Date().format('hh:mm:ss');
      }
      this.timePicker_time = {
        time: p_time,
        h: p_time.split(':')[0],
        m: p_time.split(':')[1],
        s: p_time.split(':')[2],
        row,
        col
      };
      let left = rect.left - rect2.left - 5;
      if(rect2.width < left + 240){
        left = rect2.width - 240 - 5;
      }
      this.timePicker_left = left;

      let will_top = rect.top - rect2.top + rect.height + 4;
      let w_h = document.documentElement.clientHeight || document.body.clientHeight;
      let opt_h = 344;
      let ful_h = +will_top + +rect2.top + opt_h;
      if(ful_h > w_h){
        will_top = will_top - (ful_h - w_h);
        this.option_hide_arrow = true;
      }else{
        this.option_hide_arrow = false;
      }
      this.timePicker_top = will_top;

      this.timePicker_width = 240;
      this.timePicker_show = true;

      //分钟数据
      if(this.timeMinute.length == 0){
        let tm = [];
        let radius = 110 - 14, //看css即可知道半径
            centerX = 110,//中心点坐标
            centerY = 110,
            count = 5, // 5分钟间隔
            w = 24; //span宽高是24
        for(let i=0; i<60/count; i++){
          tm.push({
            value: i*count,
            left: centerX + radius * Math.cos(i*count*(2*Math.PI)/60 - Math.PI/2) - w/2,
            top: centerY + radius * Math.sin(i*count*(2*Math.PI)/60 - Math.PI/2) - w/2,
          });
          
        }
        this.timeMinute = tm;
      };
      
    },
    //时间选择调整fn
    timePickerFn(type, delta, setVal){
      this.logFn('timePickerFn')
      if(type == 'h'){
        let h = +this.timePickerComputed.h + delta;
        if(setVal != undefined){
          h = setVal
        }
        if(h<0){
          h=23;
        }else if(h>23){
          h=0;
        }
        this.timePickerComputed = { ...this.timePickerComputed, h: bu(h) }
      }
      if(type == 'm'){
        let m = +this.timePickerComputed.m + delta;
        if(m<0){
          m=59;
        }else if(m>59){
          m=0;
        }
        if(setVal != undefined){
          m = setVal
        }
        this.timePickerComputed = { ...this.timePickerComputed, m: bu(m) }
      }
      if(type == 's'){
        let s = +this.timePickerComputed.s + delta;
        if(s<0){
          s=59;
        }else if(s>59){
          s=0;
        }
        if(setVal != undefined){
          s = setVal
        }
        this.timePickerComputed = { ...this.timePickerComputed, s: bu(s) }
      };
      function bu(buarg){
        if(+buarg<10){
          buarg = '0' + (+buarg);
        }
        return buarg;
      };
    },
    //点击现在按钮
    timePickerBtnNow(){
      this.logFn('timePickerBtnNow')
      let now = new Date().format('hh:mm:ss');
      this.timePicker_time.h = now.split(':')[0];
      this.timePicker_time.m = now.split(':')[1];
      this.timePicker_time.s = now.split(':')[2];
      this.timePickerBtn();
    },
    // timepicker按钮
    timePickerBtn(type){
      this.logFn('timePickerBtn')
      let time = bu(this.timePicker_time.h)+':'+bu(this.timePicker_time.m)+':'+bu(this.timePicker_time.s);
      if(type == 'clear'){
        time = ''
      }
      this.selectFullData = null;
      this.modifyByRowCol(
        this.timePicker_time.row._rowid,
        this.timePicker_time.col.props,
        time,
      );
      this.$emit('dateChange', {
        value: time, 
        rowid: this.timePicker_time.row._rowid, 
        col: this.timePicker_time.col,
      });
      this.timePicker_show = false;

      function bu(buarg){
        if(+buarg<10){
          buarg = '0' + (+buarg);
        }
        return buarg;
      };
    },
    //切换am、pm，改变小时的数值
    timeTypeChange(){
      this.logFn('timeTypeChange')
      this.timeType = !this.timeType;
      let h = +this.timePicker_time.h;
      if(this.timeType){
        //am
        if(h>12){
          h = h - 12;
        }
      }else{
        //pm
        if(h<12){
          h = h + 12;
        }
      };
      if(h<10){
        h = '0' + h;
      }
      this.timePicker_time.h = h;
    },

    //输入框输入时搜索
    searchInput(e){
      this.logFn('searchInput')
      let row = this.option_info.row;
      let col = this.option_info.col;
      let isMul = false;
      if(row[col.props].type == 'mul_select'){
        isMul = true;
      };

      if(this.searchTimer) clearTimeout(this.searchTimer);
      this.option_search = e.target.value;
      //回到第1页
      this.option_current_page = 1;

      this.searchTimer = setTimeout(()=>{
        //通过http请求option数据
        let pos = row[col.props].dataPos || 'data.result';
        pos = pos.split('.');
        let total = row[col.props].dataTotal || 'data.total';
        total = total.split('.');
        this.searchRemote(row[col.props]).then(res=>{
          let realData = res.data;
          for(let i=0; i<pos.length; i++){
            realData = realData[pos[i]]
          };
          
          let realData2 = this.jsonClone(res.data);
          let to = realData2;
          for(let i=0; i<total.length; i++){
            to = to[total[i]]
          };
          this.option_total_number = to;
          //对选中的select状态进行处理
          if(isMul){
            for(let i=0; i<realData.length; i++){
              for(let j=0; j<row[col.props].id.length; j++){
                if(realData[i].id == row[col.props].id[j]){
                  realData[i].select = true;
                }
              }
            }
          }else{
            for(let i=0; i<realData.length; i++){
              if(realData[i].id == row[col.props].id){
                realData[i].select = true;
                break ;
              }
            }
          };
          this.option_loading = false;
          this.option_data = realData;
        }).catch(err=>{
          this.option_loading = false;
          this.option_data = [];
          console.error(err);
        });
      }, this.searchDelayTime);
    },
    //输入框的下拉项分页切换
    searchByPage(count){
      this.logFn('searchByPage')
      let row = this.option_info.row;
      let col = this.option_info.col;
      let isMul = false;
      if(row[col.props].type == 'mul_select'){
        isMul = true;
      };

      let pos = row[col.props].dataPos || 'data.result';
      pos = pos.split('.');
      let total = row[col.props].dataTotal || 'data.total';
      total = total.split('.');
      let cur_count = this.option_current_page;
      if(cur_count+count > this.option_total_page || cur_count+count <= 0){
        return ;
      };
      this.option_current_page += count;

      this.searchRemote(row[col.props]).then(res=>{
        let realData = res.data;
        for(let i=0; i<pos.length; i++){
          realData = realData[pos[i]]
        };
        
        let realData2 = this.jsonClone(res.data);
        let to = realData2;
        for(let i=0; i<total.length; i++){
          to = to[total[i]]
        };
        this.option_total_number = to;
        //对选中的select状态进行处理
        if(isMul){
          for(let i=0; i<realData.length; i++){
            for(let j=0; j<row[col.props].id.length; j++){
              if(realData[i].id == row[col.props].id[j]){
                realData[i].select = true;
              }
            }
          }
        }else{
          for(let i=0; i<realData.length; i++){
            if(realData[i].id == row[col.props].id){
              realData[i].select = true;
              break ;
            }
          }
        };
        this.option_loading = false;
        this.option_data = realData;
      }).catch(err=>{
        this.option_loading = false;
        this.option_data = [];
        console.error(err);
      });
    },
    //option下拉-选择某项
    optionItemClick(d){
      this.logFn('optionItemClick')
      this.selectFullData = d;
      let type = this.option_info.row[this.option_info.col.props].type;
      if(type == 'mul_select' || type == 'opt_mul_select'){
        let old_id = this.jsonClone(this.option_info.row[this.option_info.col.props].id);
        let old_name = this.jsonClone(this.option_info.row[this.option_info.col.props].value);
        let old_option_data = this.jsonClone(this.option_data).map(o=>{
          o.select = false; 
          return o;
        });
        // 判断点击项的id、name是否存在
        let have_id = false;
        for(let i=0; i<old_id.length; i++){
          if(old_id[i] == d.id){
            old_id.splice(i, 1);
            have_id = true;
            break ;
          };
        };
        if(!have_id){
          old_id.push(d.id);
        };

        let have_name = false;
        for(let i=0; i<old_name.length; i++){
          if(old_name[i] == d.name){
            old_name.splice(i, 1);
            have_name = true;
            break ;
          };
        };
        if(!have_name){
          old_name.push(d.name);
        };

        //更新select状态
        for(let i=0; i<old_option_data.length; i++){
          for(let j=0; j<old_id.length; j++){
            if(old_option_data[i].id == old_id[j]){
              old_option_data[i].select = true;
            }
          }
        };

        this.option_data = old_option_data;
        this.$nextTick(()=>{
          this.modifyByRowCol(
            this.option_info.row._rowid,
            this.option_info.col.props,
            old_name,
            old_id
          );
        })
        
      }else{
        this.modifyByRowCol(
          this.option_info.row._rowid,
          this.option_info.col.props,
          d.name,
          d.id
        );
        this.option_show = false;
      };
    },
    //option远程搜索
    searchRemote(row){
      this.logFn('searchRemote')
      if(!row.url){
        return Promise.reject('缺失url！');
      };
      
      if(this.showOptionPage){
        let fullUrl = this.addUrlQuery(
          row.url,
          {
            limit: this.option_limit,
            offset: (this.option_current_page - 1) * this.option_limit,
            q: this.option_search
          }
        );
        return this.$http.get(fullUrl);
      }else{
        let fullUrl = this.addUrlQuery(
          row.url,
          {
            q: this.option_search
          }
        );
        return this.$http.get(fullUrl);
      };
      
    },
    //隐藏option
    hideOption(){
      this.logFn('hideOption')
      this.hover_show = false;
      this.option_show = false;
      this.dataPicker_show = false;
      this.timePicker_show = false;
      this.operate_show = false;
    },
    //表格最后增加一行
    addLine(){
      this.logFn('addLine')
      if(this.entry != false && JSON.stringify(this.entry) != '{}'){
        let entry = this.deepClone(this.entry);
        entry.checked = false;
        entry._error = false;
        entry._modify = true;
        entry._add = true;
        entry._rowid = Date.now();
        for(let [key, value] of Object.entries(entry)){
          //value字段是：function
          if(typeof value.value == 'function'){
            entry[key].value = value.value()
          }
          //id字段是：function
          if(typeof value.id == 'function'){
            entry[key].id = value.id()
          }
        };
        this.row.push(entry);
        //增加一行后，回到底部
        this.$nextTick(()=>{
          this.geScrollTopArea = Math.max(this.fullHeight - (this.height - this.colRelMaxLevel * this.cellHeight), 0);
        });
      }
    },
    //调整布局
    doLayout(){
      this.logFn('doLayout')
      this.fixedWidthHeight();
      this.scrollLeft = 0;
    },
    fixWindowResize(){
      this.logFn('fixWindowResize')
      this.fixedWidthHeight();
      this.scrollLeft = 0;
    },
    //重置(参数：是否回到第一行第一列)
    doReset(bool){
      this.logFn('doReset')
      this.reset = Date.now();
      if(bool){
        this.scrollTop = 0;
        this.scrollLeft = 0;
      }
      this.$nextTick(()=>{
        this.init();
      });
    },
    //获取表格信息（新增、错误、修改过的、所有）
    getTable(){
      this.logFn('getTable')
      return {
        row: this.row, 
        col: this.col,
        modifyAndNew: this.row.filter(item=>item._modify),
        onlyModify: this.row.filter(item=>item._modify && !item._add),
        onlyNew: this.row.filter(item=>item._add),
      };
    },
    //表头-复选框被选中的行
    checkedRows(){
      this.logFn('checkedRows')
      return {
        //所有被选中的行（包括禁用但默认选中的行）
        allChecked: this.row.filter(rr => rr.checked),
        //所有被选中的行（排除掉禁用但默认选中的）
        realChecked: this.row.filter(row => row.checked && !row.noCheckAble),
        info: {
          description: '1、allChecked：所有被选中的行（包括禁用但默认选中的行）。2、realChecked：所有被选中的行（排除掉禁用但默认选中的行）'
        }
      }
    },
    //单元格移入提示框
    cellOver(row, col, byFocus){
      this.logFn('cellOver')
      if(!byFocus){
        //多选下拉聚焦时再显示
        if(this.option_show) return ;
        this.hover_show = false;
      };
      let val = row[col.props].value;
      //无值不显示提示框
      if((val+'').trim() == ''){
        this.hover_show = false;
        return ;
      };
      //长度未超过宽度也不用显示提示框
      let txt = this.$refs.textLengtn;
      txt.innerText = val;
      if(txt.offsetWidth*1 + 20 < col.width && row[col.props].type != 'mul_select'){
        this.hover_show = false;
        return ;
      }
      
      let hoverCell = this.$refs['cell-'+row._rowid+'-'+col._colid];
      let container = this.$refs['container'];
      if(hoverCell instanceof Array){
        hoverCell = hoverCell[0];
      };
      this.hover_info = {
        props: col.props, 
        rowid: row._rowid, 
        type: row[col.props].type,
        value: row[col.props].value,
      }
      let rect1 = hoverCell.getBoundingClientRect();
      let rect2 = container.getBoundingClientRect();
      let w = 0;
      if(row[col.props].type == 'mul_select'){
        w = Math.max(col.width, 214);
      }else{
        w = Math.max(col.width, 134);
      };
      let dis_w = w - col.width;
      this.hover_width = w;
      this.hover_left = rect1.left - rect2.left - dis_w/2;
      this.hover_bottom = this.height - (rect1.top - rect2.top) + 16;
      
      this.$nextTick(()=>{
        this.hover_show = true;
      });

    },
    cellOut(row, col){
      this.logFn('cellOut')
      if(this.option_show) return ;
      this.hover_show = false;
    },
    //检查required
    checkRequired(){
      this.logFn('checkRequired')
      let vm = this;
      for(let i=0; i<this.row.length; i++){
        for(let [key, attr] of Object.entries(this.row[i])){
          if(attr.required == true){
            if(attr.type == 'number'){
              if(isNaN(attr.value)){
                let msg = getTitleByProps(key);
                for(let j=0; j<vm.col.length; j++){
                  if(vm.col[j].props == key){
                    //跳到该列
                    this.goColCenter(vm.col[j]);
                    this.navCoods = {
                      row: this.row[i],
                      col: vm.col[j],
                    }
                    break ;
                  }
                }
                this.row[i]._error = true;
                //跳到该行
                this.goLineCenter(i);
                this.$forceUpdate();
                return '第'+ (i * 1 + 1) + '行，' + msg + '列 不能为空！'
              }
            }else{
              if((attr.value+'').trim() == ''){
                let msg = getTitleByProps(key);
                for(let j=0; j<vm.col.length; j++){
                  if(vm.col[j].props == key){
                    //跳到该列
                    this.goColCenter(vm.col[j]);
                    this.navCoods = {
                      row: this.row[i],
                      col: vm.col[j],
                    }
                    break ;
                  }
                }
                this.row[i]._error = true;
                //跳到该行
                this.goLineCenter(i);
                this.$forceUpdate();
                return '第'+ (i * 1 + 1) + '行，' + msg + '列 不能为空！'
              }
            }
          }
        };
      };
      return true;
      function getTitleByProps(props){
        for(let i=0; i<vm.col.length; i++){
          if(vm.col[i].props == props){
            return vm.col[i].title;
          }
        }
      };
    },
    //跳到某一行，在能处于中间时处于中间
    goLineCenter(line){
      this.logFn('goLineCenter');
      let lol = Math.floor(((this.height - this.colRelMaxLevel * this.cellHeight) / this.cellHeight) / 2);
      this.geScrollTopArea = Math.max(0, Math.min((line-lol)*this.cellHeight, this.fullHeight - this.height + this.colRelMaxLevel * this.cellHeight));
    },
    //跳到某一列，在能处于中间时处于中间
    goColCenter(col){
      this.logFn('goColCenter')
      let willGo = col._left - (this.width - col.width)/2;
      if(willGo < 0) willGo = 0;
      if(willGo > this.fullWidth - this.width) willGo = this.fullWidth - this.width;
      this.geScrollLeftArea = willGo;
    },
    //键盘按下事件
    keydown(e){
      //禁用tab键
      if(e.keyCode == 9){
        e.preventDefault();
      };
      switch (e.keyCode) {
        case 38:
          //上
          // e.preventDefault()
          this.cellNav('up', e)
          break;
        case 40:
          //下
          // e.preventDefault()
          this.cellNav('down', e)
          break;
        case 37:
          //左
          this.cellNav('left')
          break;
        case 39:
          //右
          this.cellNav('right')
          break;
      };
    },
    //正处于高亮的单元格
    highlight(row, col){
      this.navCoods = {row, col};
    },

    /*
    * 键盘的方向键-进行单元格高亮focus并且居中移动
    */
    cellNav(dir, e){
      if(this.navCoods.row){
        let vm = this;
        let cur_row = this.navCoods.row;
        let cur_col = this.navCoods.col;
        let cur_leftArea = this.geScrollLeftArea;
        let cur_topArea = this.geScrollTopArea;
        let v = false;
        let h = false;
        this.hideOption();
        //找到第一列和最后一列
        let firstCol = null;
        let lastCol = null;
        for(let i=0; i<vm.col.length; i++){
          if(vm.col[i].type != 'normal' && vm.col[i].hide != true){
            if(firstCol == null){
              firstCol = vm.col[i];
            }
            lastCol =  vm.col[i];
          }
        }
        /*
        * 算出下一个聚焦元素，高亮并且滚动条也需要移动
        */
        let next_col = {};
        //导航后的下一个单元格DOM
        let next_dom = null;

        if(dir == 'up'){
          v = true;
          let line = 0;
          // 找到下一个input类型的单元格
          for(let i=0; i<vm.row.length; i++){
            if(cur_row._rowid == vm.row[i]._rowid){
              if(vm.row[i-1] == undefined) return ;
              line = i-1;
              vm.navCoods = {row: vm.row[i-1], col: cur_col}
              break ;
            };
          };
          if(line != 0){
            e.preventDefault();
          }
          this.goLineCenter(line);
        };
        if(dir == 'down'){
          v = true;
          let line = 0;
          // 找到下一个input类型的单元格
          for(let i=0; i<vm.row.length; i++){
            if(cur_row._rowid == vm.row[i]._rowid){
              if(vm.row[i+1] == undefined) return ;
              line = i+1;
              vm.navCoods = {row: vm.row[i+1], col: cur_col}
              break ;
            };
          };
          if(line != vm.row.length - 1){
            e.preventDefault();
          }
          this.goLineCenter(line);
        };
        if(dir == 'left'){
          h = true;
          let next_dis = cur_col.width; // 当前列到前一列的跨度距离
          // 找到下一个input类型的单元格（注意：避开隐藏列、普通列）
          for(let i=0; i<vm.col.length; i++){
            if(cur_col._colid == vm.col[i]._colid){
              // 找到不是（隐藏列、普通列）的前一列
              let k = 1;
              while(123){
                if(vm.col[i-k] == undefined) break ;
                if(vm.col[i-k].hide == true) {
                  k++;
                  continue ;
                }
                next_dis -= vm.col[i-k].width;
                if(cur_row[vm.col[i-k].props].type == 'normal') {
                  k++;
                  continue ;
                }
                break ;
              };
              next_col = vm.col[i-k];
              if(next_col == undefined){
                next_col = lastCol;
              }
              next_dis -= next_col.width;
              vm.navCoods = {row: cur_row, col: next_col}
              break ;
            };
          };
          this.goColCenter(next_col);
        };
        if(dir == 'right'){
          h = true;
          let next_dis = cur_col.width; // 当前列到下一列的跨度距离
          // 找到下一个input类型的单元格（注意：避开隐藏列、普通列）
          for(let i=0; i<vm.col.length; i++){
            if(cur_col._colid == vm.col[i]._colid){
              // 找到不是（隐藏列、普通列）的下一列
              let k = 1;
              while(123){
                if(vm.col[i+k] == undefined) break ;
                if(vm.col[i+k].hide == true) {
                  k++;
                  continue ;
                }
                next_dis += vm.col[i+k].width;
                if(cur_row[vm.col[i+k].props].type == 'normal') {
                  k++;
                  continue ;
                }
                break ;
              };
              next_col = vm.col[i+k];
              if(next_col == undefined) {
                next_col = firstCol;
              }
              next_dis -= next_col.width;
              vm.navCoods = {row: cur_row, col: next_col}
              break ;
            };
          };
          this.goColCenter(next_col);
        };
        
        this.$nextTick(()=>{
          if(h == true){
            /*
            * 必须在滚动条，滚动后的nextTick回调中，DOM才更新出下一个单元格的DOM，才找得到单元格DOM
            */
            next_dom = vm.$refs['inp-' + cur_row._rowid + '-' + next_col._colid];
            if(next_dom instanceof Array){
              next_dom = next_dom[0];
            };
            if(cur_row[next_col.props].type == 'normal'){
              return ;
            };
          };
          if(v == true){
            next_dom = vm.$refs['inp-' + vm.navCoods.row._rowid + '-' + vm.navCoods.col._colid];
            if(next_dom instanceof Array){
              next_dom = next_dom[0];
            };
          };
          /*
          * 真正触发focus前，先设置好可能的下拉、时间、日期框的位置         
          */
          let rect = next_dom.getBoundingClientRect();
          let rect2 = this.$refs.container.getBoundingClientRect();

          //option
          this.option_width = Math.min(Math.max(rect.width, 166), 400);
          let left = rect.left - rect2.left - 5;
          if(rect2.width < left + this.option_width){
            left = rect2.width - this.option_width - 5;
          }
          this.option_left = left;
          this.option_top = rect.top - rect2.top + rect.height + 8;

          //dataPicker
          left = rect.left - rect2.left - 5;
          if(rect2.width < left + 220){
            left = rect2.width - 220 - 5;
          }
          this.dataPicker_left = left;
          this.dataPicker_top = rect.top - rect2.top + rect.height + 8;
          this.dataPicker_width = 220;

          //timePicker
          left = rect.left - rect2.left - 5;
          if(rect2.width < left + 240){
            left = rect2.width - 240 - 5;
          }
          this.timePicker_left = left;
          this.timePicker_top = rect.top - rect2.top + rect.height + 8;
          this.timePicker_width = 240;
          
          next_dom.focus();
        });

      };
    },
    
    /*
    * 导出excel的xls格式文件
    *   head: ['标题1', '标题2', '标题3']
    *   row: [
    *     [1,2,3],
    *     [2,3,4],
    *     [3,4,5],
    *   ]
    */
    exportXLS(head, row){
      //表头
      let header = '<tr>';
      for(let i=0; i<head.length; i++){
        header += '<td>'+head[i]+'</td>';
      }
      header += '</tr>';

      //表体
      let rowBody = []
      for(let i=0; i<row.length; i++){
        let body = '<tr>'
        for(let j=0; j<row[i].length; j++){
          body += '<td>'+row[i][j]+'</td>';
        }
        body += '</tr>'
        rowBody.push(body);
      }

      //准备blob数组
      let con = [
        "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>",
        "<meta http-equiv='content-type' content='application/vnd.ms-excel; charset=UTF-8'>",
        "<head>",
        "<!--[if gte mso 9]>",
        "<xml>",
        "<x:ExcelWorkbook>",
        "<x:ExcelWorksheets>",
        "<x:ExcelWorksheet>",
        "<x:Name>",
        "xlsWorksheetName",
        "</x:Name>",
        "<x:WorksheetOptions>",
        "<x:DisplayGridlines/>",
        "</x:WorksheetOptions>",
        "</x:ExcelWorksheet>",
        "</x:ExcelWorksheets>",
        "</x:ExcelWorkbook>",
        "</xml>",
        "<![endif]-->",
        "</head>",
        "<body>",
        "<table><thead>",

        header,

        "</thead><tbody>",

        ...rowBody,

        "</tbody></table>",

        "</body>",

        "</html>"

      ];

      let blob = new Blob(con, {type: 'application/vnd.ms-xls'});

      saveAs(blob, '文件名'+'.xls');

      function saveAs(blob, filename) {
        let type = blob.type;
        let force_saveable_type = 'application/octet-stream';
        // 强制下载，而非浏览器中打开
        if (type && type != force_saveable_type) {
            let slice = blob.slice || blob.webkitSlice || blob.mozSlice;
            blob = slice.call(blob, 0, blob.size, force_saveable_type);
        }

        let url = window.URL.createObjectURL(blob);
        let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link.href = url;
        save_link.download = filename;

        let event = document.createEvent('MouseEvents');
        event.initMouseEvent(
          'click', 
          true, 
          false, 
          window, 
          0, 
          0, 
          0, 
          0, 
          0, 
          false, 
          false, 
          false, 
          false, 
          0, 
          null
        );
        save_link.dispatchEvent(event);
        window.URL.revokeObjectURL(url);
      };
    },
    
    //拖拽列宽
    dragDown(colItem, event){
      this.logFn('dragDown')
      let vm = this;
      let move = false;
      event.preventDefault();
      window.addEventListener('mousemove', mousemove);
      window.addEventListener('mouseup', mouseup);
      let left = 0;
      if(colItem.fixed){
        left = colItem._left + colItem.width;
      }else{
        
        left = colItem._left + colItem.width - this.geScrollLeftArea;
      };
      this.dragLeft = left;
      this.dragLineShow = true;
      let startx = event.clientX;
      function mousemove(e){
        move = true;
        let dis = e.clientX - startx;
        vm._willWidth = colItem.width + dis;
        vm.dragLeft = left + dis;
      };
      function mouseup(){
        if(!move) {
          //修复点击未拖动排版bug
          vm.dragLineShow = false;
          window.removeEventListener('mousemove', mousemove);
          window.removeEventListener('mouseup', mouseup);
          return ;
        }
        if(vm._willWidth < 90){
          vm._willWidth = 90;
        };
        for(let i=0; i<vm.col.length; i++){
          if(vm.col[i]._colid == colItem._colid){
            vm.col[i].width = vm._willWidth;
            //需要重新计算绝对距离，因为排版根据left！
            for (let j = 0; j < vm.col.length; j++) {
              let left = 0;
              if(vm.showCheckBoxAndIndex){
                left += 40;
              };
              if(vm.showOperate){
                left += 40;
              }
              if(vm.showStatus){
                left += +vm.statusWidth;
              }
              for (let k = 0; k < j; k++) {
                if(!vm.col[k].hide){
                  left += vm.col[k].width;
                }
              }
              vm.col[j]._left = left;
            }
            break ;
          }
        };
        vm.dragLineShow = false;
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
      };
    },
    //排序
    colSort(col) {
      this.logFn('colSort')
      let vm = this;
      col = this.deepClone(col);
      let headerCol = this.deepClone(vm.col);
      let cloneRow = this.deepClone(this.row);
      //先隐藏除自己以外的排序状态的标识
      for(let i=0; i<headerCol.length; i++){
        headerCol[i]._sort = '';
      };
      this.$nextTick(()=>{
        if(col._sort == ''){
          //1、把它转为降序
          let row = cloneRow.sort((b, a)=>{
            return sortFn(a[col.props].value, b[col.props].value);
          });
          modCol(col._colid, 'desc');
          this.$nextTick(()=>{
            this.row = row;
          });
        }else if(col._sort == 'desc'){
          //2、把它转为升序
          let row = cloneRow.sort((b, a)=>{
            return sortFn(b[col.props].value, a[col.props].value);
          });
          modCol(col._colid, 'asc');
          this.$nextTick(()=>{
            this.row = row;
          })
        }else if(col._sort == 'asc'){
          //3、把它转为原始排序，按_rowid递增的
          modCol(col._colid, '');
          cloneRow = cloneRow.sort((a, b)=>a._rowid - b._rowid);
          this.$nextTick(()=>{
            this.row = cloneRow;
          })  
        };
        vm.col = headerCol;
      });
      function sortFn(a, b){
        if(a == b) return 0;
        if(a*1 == a && b*1 == b){
            return a - b < 0? -1: 1;
        };
        if(typeof a == typeof b) return a < b? -1: 1;
        return typeof a < typeof b? -1: 1;
      };
      function modCol(colid, willVal){
        for(let i=0; i<headerCol.length; i++){
          if(headerCol[i]._colid == colid){
            headerCol[i]._sort = willVal;
            return ;
          }
        }
      };

    },
    //拷贝对象
    jsonClone(obj){
      return JSON.parse(JSON.stringify(obj))
    },
    /**
    * @name 深拷贝
    */
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
    //给url字符串，添加和覆盖，查询字符串
    addUrlQuery(originUrl, queryObj) {
      function toQueryString(qObj) {
        let str = '';
        for (let [key, value] of Object.entries(qObj)) {
          str += `${key}=${value}&`;
        };
        str = str.substring(0, str.length - 1);
        return str;
      };
      function toStringQuery(qString) {
        if (qString.substring(qString.length - 1) == '&') {
          qString = qString.substring(0, qString.length - 1);
        };
        let qArr = qString.split('&');
        let resObj = {};
        for (let i = 0; i < qArr.length; i++) {
          let _o = qArr[i].split('=');
          resObj[_o[0]] = _o[1];
        };
        return resObj;
      };
      let urlArr = originUrl.split('?');
      if (urlArr[0] == originUrl) {
        return `${originUrl.trim()}?${toQueryString(queryObj)}`;
      } else {
        if (urlArr[1].trim() == "") {
          return `${originUrl.trim()}${toQueryString(queryObj)}`;
        } else {
          let _oldQueryObj = toStringQuery(urlArr[1]);
          let resObj = { ..._oldQueryObj, ...queryObj };
          return `${urlArr[0].trim()}?${toQueryString(resObj)}`;
        };
      };
    },

  },

  beforeDestroy(){
    document.removeEventListener("click", this.hideOption);
    window.removeEventListener("resize", this.fixWindowResize);
    document.removeEventListener("keydown", this.keydown);
  }

};
</script>

<style scoped>
* {
  box-sizing: border-box;
  font-family: "Helvetica Neue", Helvetica, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
}
.clearfix:before,
.clearfix:after{
    display: table;
    content: " ";
}
.clearfix:after{
    clear: both;
}
.nowrap {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.text-center{
  text-align: center;
}
.tbl-wrap {
  position: relative;
  max-width: 100%;
  height: 100%;
}
.container {
  position: relative;
  border: 1px solid #e9e9e9;
  background: #fff;
  font-size: 14px;
  color: #828282;
  overflow: hidden;
  max-width: 100%;
  -webkit-font-smoothing: antialiased;
}

/* 滚动条 */
.container:hover .scrollbar-x-drag {
  height: 12px;
  opacity: 0.6;
}
.scrollbar-x,
.scrollbar-y {
  position: absolute;
  background: transparent;
}
.scrollbar-x {
  height: 2px;
  bottom: 0px;
  left: 0px;
}
.scrollbar-y {
  width: 8px;
  top: 0px;
  right: 0px;
  background: #e7e7e7;
  overflow: hidden;
  transition: width .4s;
}
.scrollbar-y:hover{
  width: 15px;
}
.scrollbar-y.mob,
.scrollbar-y.mob:hover,
.scrollbar-y.mob .scrollbar-y-drag{
  /* width: 20px; */
}
.drag-x1,
.drag-x2 {
  width: 100%; 
  height: 16px; 
  background: #6b6b6b; 
  position: absolute; 
  left: 0px;
}
.drag-x1{
  top: 100%; 
}
.drag-x2{
  bottom: 100%; 
}
.scrollbar-x-drag,
.scrollbar-y-drag {
  position: absolute;
  background: #6b6b6b;
  opacity: 0.4;
  z-index: 100;
}
.scrollbar-x-drag {
  height: 5px;
  bottom: 1px;
  transition: height 0.4s, opacity 0.4s;
}
.scrollbar-y-drag {
  width: 15px;
  right: 0px;
  transition: width 0.4s, opacity 0.4s;
}
.container:hover .scrollbar-x-drag:hover{
  height: 15px;
  opacity: 0.8;
}
/* 容器 */
.body {
  position: relative;
  height: 100%;
  overflow: hidden;
}
.expand {
  position: absolute;
  left: 0px;
  top: 0px;
  visibility: hidden;
}
.tbl-cell {
  position: absolute;
  background: transparent;
  border-top: 1px solid #ebeef5;
  border-left: 1px solid #ebeef5;
  padding: 0px;
  top: 0px;
}
.tbl-cell input{
  background: transparent;
  font-size: 14px;
}
.check-cell{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px !important;
}
.check-cell.error span{
  color: #ff4f43 !important;
}
.check-cell .fa-check-square{
  cursor: pointer;
  color: dodgerblue;
}
.check-cell .fa-square{
  cursor: pointer;
  color: dodgerblue;
  position: relative;
}
.check-cell .fa-square:after{
  content: ' ';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  background: #fff;
  width: 9px;
  height: 3px;
  border-radius: 1px;
}
.check-cell .fa-square-o{
  cursor: pointer;
  color: silver;
}
/* 表头 */
.sheet-header,
.sheet-header-left,
.sheet-header-right {
  position: absolute;
  top: 0px;
}
.sheet-header .icon{
  font-size: 14px;
  display: inline-block;
  width: 15px;
  margin-left: 12px;
}
.sheet-header-left {
  z-index: 11;
}
.sheet-header-right {
  z-index: 10;
}
/* 边框border修正 */
.sheet-header .tbl-cell {
  line-height: 39px;
  color: #909399;
  font-size: 14px;
  background: #fff;
}
.sheet-header-left .tbl-cell:nth-of-type(1){
  border-left-width: 0px;
}
.sheet-header-left .tbl-cell:nth-last-of-type(1) {
  border-right: 1px solid #ebeef5 !important;
}
.sheet-body-left .tbl-cell {
  border: none;
  border-top: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}

/* 表体 */
.sheet-body,
.sheet-line,
.sheet-body-left,
.sheet-body-right {
  position: absolute;
}
.sheet-body{
  width: 100%;
}
.sheet-line{
  width: 100%;
  height: 40px;
  background: #fff;
}
.sheet-line:nth-last-child(1),
.sheet-line:nth-last-child(1) .sheet-body-left .tbl-cell {
  border-bottom: 1px solid #ebeef5;
}

.sheet-line .sheet-body-left .tbl-cell,
.sheet-line{
  transition: background .25s;
}
.sheet-body-left .tbl-cell{
  background: #fff;
}
.sheet-line:hover{
  background: #f5f7fa;
}
.sheet-line:hover .sheet-body-left .tbl-cell{
  background: #f5f7fa;
}
.sheet-line.actived,
.sheet-line.actived .sheet-body-left .tbl-cell{
  background: #fff5f0;
}
.sheet-body-left {
  z-index: 11;
}
.sheet-body-body {
  z-index: 10;
}
.sheet-body .tbl-cell{
  color: #000;
}
.sheet-body-left .tbl-cell:nth-last-of-type(1).needShadow,
.sheet-line:nth-last-child(1) .sheet-body-left .tbl-cell.needShadow:not(.check-cell) {
  border-right: 1px solid #ebeef5;
}

/* 其他 */
.sheet-header-right .tbl-cell,
.sheet-header-left .tbl-cell {
  border-bottom: 1px solid #f3f3f3;
  background: #fefefe;
}
.sheet-header-right .tbl-cell:nth-last-of-type(1){
  border-right: 1px solid #d8d8d8;
}
.sheet-body-right,
.sheet-header-right {
  will-change: transform;
  transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1);
  transition-duration: 0ms;
}
.sheet-body-right .tbl-cell:nth-last-child(1){
  border-right: 1px solid #d8d8d8;
  padding-right: 8px;
}
.cell {
  height: 40px;
  width: 100%;
  position: relative;
}
.cell:hover .edit-close{
  display: block;
}
.cell .edit-close{
  display: none;
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  color: #bebebe;
  font-size: 14px;
  cursor: pointer;
}
.cell .cell-show{
  display: block;
  position: absolute;
  left: 5px;
  top: calc(50% - 1px);
  transform: translateY(-50%);
  color: #999;
  font-size: 10px;
}
.cell .edit-close:hover{
  color: #9e9e9e;
}
.text {
  height: 40px;
  width: 100%;
  line-height: 40px;
  text-indent: 10px;
  font-size: 14px;
}
/* 输入框 */
.edit-inp {
  display: block;
  padding-right: 4px;
  width: 100%;
  height: 39px;
  line-height: 40px;
  border: 1px solid transparent;
  outline: none;
  text-indent: 10px;
}
.highlight{
  border: 1px solid #c7c4ff;
}
.edit-inp:focus,
.edit-inp.active {
  border: 1px solid #5b0ae4;
}
/* option、提示框的过度 */
.option-enter-active {
  transition: all .24s ease, top .17s linear;
  transform-origin: center top;
}
.option-leave-active{
  transition: all 0s, top .17s linear;
}
.option-enter, 
.option-leave-to {
  transform: scaleY(0);
  opacity: 0;
}

/* placeholder的颜色 */
input:-moz-placeholder{
    color: #c6c6c6;
    opacity: 1; 
}
input::-moz-placeholder{
    color: #c6c6c6; 
    opacity: 1; 
}
input:-ms-input-placeholder{
    color: #c6c6c6; 
    opacity: 1; 
}
input::-webkit-input-placeholder{
    color: #c6c6c6; 
    opacity: 1; 
}
input::input-placeholder {
    color: #c6c6c6; 
    opacity: 1; 
}
.option{
  position: absolute;
  background: #fff;
  border: 1px solid rgb(211, 211, 211);
  z-index: 2018;
  padding-bottom: 8px;
  padding-top: 8px;
  color: #878787;
  font-size: 14px;
  box-shadow: 0px 2px 6px  rgba(6, 6, 6, 0.3);
}
.option .opp{
  position: relative;
  height: 150px;
  overflow-y: auto;
  overflow-x: hidden;
}
.option .arrow{
  position: absolute;
  left: 16px;
  top: -6px;
  transform: rotate(45deg);
  content: ' ';
  width: 10px;
  height: 10px;
  z-index: 2019;
  background: #fff;
  border-left: 1px solid rgb(211, 211, 211);
  border-top: 1px solid rgb(211, 211, 211);
}

.option-item{
  padding: 9px 10px;
  cursor: pointer;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.option-item:hover{
  background: #f1f1f1;
  color: #00abff;
  overflow: inherit;
  white-space: inherit;
  text-overflow: inherit;
}
.option-item.select,
.option-item.select:hover{
  background: #89c2ff;
  color: #fff;
}
/* drag功能的样式 */
.drag-pad{
  position: absolute;
  width: 10px;
  left: calc(100% - 5px);
  z-index: 101;
  background: transparent;
  cursor: col-resize;
}
.drag_line{
  position: absolute;
  height: 100%;
  z-index: 108;
  width: 1px;
  background: #a8a8a8;
  top: 0px;
}
.hover-show{
  position: absolute;
  z-index: 2017;
  background: rgb(250, 250, 250);
  border: 1px solid #ebeef5;
  padding: 10px;
  font-size: 12px;
  color: rgb(65, 183, 238);
  box-shadow: 0px 1px 10px rgba(182, 182, 182, 0.5);
}
.hover-show:before{
  content: ' ';
  position: absolute;
  top: calc(100% - 5px);
  left: 50%;
  z-index: 2017;
  width: 10px;
  height: 10px;
  transform: translateX(-50%) rotate(45deg);
  background: rgb(250, 250, 250);
  border-bottom: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
}
.sort-wrap{
  position: absolute;
  left: calc(100% - 20px);
  width: 14px;
  height: 40px;
  background: transparent;
  cursor: pointer;
  top: 50%;
  transform: translateY(-50%);
}
.sort-wrap .fa-sort-asc,
.sort-wrap .fa-sort-desc {
  position: absolute;
  font-size: 16px;
  color: silver;
}
.sort-wrap .fa-sort-asc{
  top: 11px;
}
.sort-wrap .fa-sort-desc{
  bottom: 12px;
}
.sort-wrap .fa-sort-asc.active,
.sort-wrap .fa-sort-desc.active {
  color: #2988e7;
}
.page{
  padding-top: 8px; 
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #d8d8d8;
}
.page-arrow{
  font-size: 16px;
  display: inline-block;
  margin-left: 12px; 
  margin-right: 12px; 
  cursor: pointer;
  width: 16px;
  height: 16px;
  line-height: 16px;
  text-align: center;
  background: transparent;
  color: #999;
  border-radius: 50%;
}
.page-arrow:hover{
  color: #fff;
  background: #4eac20;
}
.search-text{
  height: 26px;
  line-height: 26px;
  text-indent: 2px;
  color: #999;
  position: relative;
  margin-bottom: 5px;
}
.search-text span{
  position: absolute;
  left: 7px;
  top: 2px;
  z-index: 99;
  height: 22px;
  background: transparent;
  line-height: 22px;
  width: 20px;
  font-size: 12px;
  color: #3fa50d;
}
.search-text input{
  font-size: 12px;
  color: #2988e7;
  position: absolute;
  left: 4px;
  top: 0px;
  height: 100%;
  width: calc(100% - 8px);
  z-index: 98;
  border: 1px solid #c7cfd1;
  outline: none;
  text-indent: 26px;
}
.search-text input:hover,
.search-text input:focus{
  border: 1px solid #3fa50d;
  outline: none;
}
.add-mark{
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  color: rgb(18, 214, 18);
  font-size: 18px;
}
.add-line-icon{
  position: absolute;
  left: 32px;
  font-size: 12px;
  z-index: 99;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  line-height: 16px;
  background: #27d413;
  text-align: center;
  cursor: pointer;
}
.add-line-icon:hover{
  background: #169b07;
}
.add-line-icon .fa{
  color: #fff;
}
.no-text{
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  color: #a7a7a7;
}

.data-picker{
  position: absolute;
  padding-left: 5px;
  padding-right: 5px;
  background: #fff;
  border: 1px solid rgb(211, 211, 211);
  z-index: 2018;
  padding-bottom: 8px;
  padding-top: 8px;
  color: #878787;
  font-size: 13px;
  border-radius: 2px;
  box-shadow: 0px 2px 6px  rgba(6, 6, 6, 0.3);
}
.data-picker .arrow{
  position: absolute;
  left: 20px;
  top: -6px;
  transform: rotate(45deg);
  content: ' ';
  width: 10px;
  height: 10px;
  z-index: 2019;
  background: #fff;
  border-left: 1px solid rgb(211, 211, 211);
  border-top: 1px solid rgb(211, 211, 211);
}
.picker-arrow{
  position: relative;
}
.picker-arrow > span{
  width: 22px;
  height: 22px;
  line-height: 22px;
  cursor: pointer;
  text-align: center;
  font-size: 13px;
  color: #919191;
  border-radius: 50%;
  margin-left: 3px;
  margin-right: 3px;
}
.picker-arrow > span:hover{
  background: #7bd3ff;
  color: #fff;
}
.arrow-date{
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  font-size: 14px;
  height: 22px;
  line-height: 23px;
  text-align: center;
  color: #00abff;
}
.date-tbl{
  margin-top: 6px;
}
.date-week,
.day-line{
  display: flex;
  margin-bottom: 4px;
}
.date-week{
  border-bottom: 1px solid #d9d9d9;
  height: 30px;
  margin-bottom: 4px;
}
.date-week span,
.day-line span{
  flex: none;
  text-align: center;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  line-height: 30px;
  color: #919fa7;
}
.day-line span.not-now{
  color: #ccc;
}
.day-line span:hover{
  background: #f1f1f1;
  color: #00abff;
}
.day-line span.active,
.day-line span.active.active2{
  background: #00abff;
  color: #fff;
}
.day-line span.active2:not(.active){
  border: 1px solid #47c2ff;
}
.select-now{
  border-top: 1px solid #d9d9d9;
  padding-top: 4px; 
}
.select-now .toDay{
  float: right;
  height: 20px;
  background-color: #ffffff;
  line-height: 20px;
  color: #a3a3a3;
  cursor: pointer;
  width: 40px;
  font-size: 12px;
  text-align: center;
}
.select-now .clear{
  float: right;
  height: 20px;
  background-color: #ffffff;
  line-height: 20px;
  color: #a3a3a3;
  cursor: pointer;
  width: 40px;
  font-size: 12px;
  text-align: center;
}
.day-line span{
  cursor: pointer;
}
.datetime-wrap{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  line-height: 24px;
  margin-bottom: 6px;
  margin-top: 6px;
}
.datetime-wrap label{
  flex: 1;
  display: flex;
  height: 100%;
}
.datetime-wrap label span{
  display: block;
  text-indent: 6px;
}

.datetime-wrap label input{
  display: block;
  flex: none;
  width: 46px;
  height: 100%;
  border: none;
  outline: none;
  text-indent: 8px;
}
.datetime-wrap label input:focus,
.datetime-wrap label input:hover{
  border-bottom: 1px solid #00abff;
}
.time-picker{
  position: absolute;
  padding-left: 5px;
  padding-right: 5px;
  background: #fff;
  border: 1px solid rgb(211, 211, 211);
  z-index: 2018;
  padding-top: 8px;
  color: #878787;
  font-size: 13px;
  border-radius: 2px;
  box-shadow: 0px 2px 6px  rgba(6, 6, 6, 0.3);
}
.time-picker .arrow{
  position: absolute;
  left: 20px;
  top: -6px;
  transform: rotate(45deg);
  content: ' ';
  width: 10px;
  height: 10px;
  z-index: 2019;
  background: #fff;
  border-left: 1px solid rgb(211, 211, 211);
  border-top: 1px solid rgb(211, 211, 211);
}
.time-picker .line--{
  border-top: 1px solid #ebeef5;
  height: 10px;
  margin-top: 10px;
}
.time-control{
  display: flex;
}
.time-control .time-h,
.time-control .time-m,
.time-control .time-s {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  height: 24px;
  border-left: 1px solid #ebeef5;
  color: #00abff;
}
.time-control .time-h{
  border-left: none;
}
.time-add,
.time-des{
  height: 100%;
  flex: none;
  width: 24px;
  height: 24px;
  cursor: pointer;
  text-align: center;
  line-height: 24px;
  font-size: 14px;
  border-radius: 50%;
  background: #fff;
  margin-left: 2px;
  margin-right: 2px;
}
.time-add,
.time-des{
  color: #c7c7c7;
}
.time-add:hover,
.time-des:hover{
  background: #f1f1f1;
  color: #0a97ff;
}
.time-show{
  height: 24px;
  line-height: 24px;
  font-size: 14px;
  flex: auto;
  text-align: center;
}
.time-circle{
  width: 220px;
  height: 220px;
  border-radius: 50%;
  border: 1px solid #c5c5c5;
  margin: 0px auto;
  position: relative;
}
.time-circle .minitem{
  position: absolute;
  cursor: pointer;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  font-size: 12px;
  background: #fff;
  color: #8e8e8e;
  border-radius: 50%;
}
.minitem-title{
  position: absolute;
  font-size: 12px;
  color: #05a78d;
  width: 50px;
  height: 24px;
  cursor: pointer;
  line-height: 24px;
  border-radius: 12px;
  right: -4px;
  cursor: pointer;
  border: 1px solid #05a78d;
}
.minitem-title.active{
  color: #6754c7;
  border: 1px solid #6754c7;
}
.minitem-orb{
  width: 16px;
  height: 16px;
  background: #05a78d;
  position: absolute;
  top: 3px;
  left: 3px;
  border-radius: 50%;
  transition: left .2s;
}
.minitem-title.active .minitem-orb{
  left: calc(100% - 20px);
  background: #6754c7;
}
.pin-center{
  position: absolute;
  width: 14px;
  height: 14px;
  background: #dedede;
  left: 110px;
  top: 110px;
  transform: translateX(-50%) translateY(-50%);
  border-radius: 50%;
}
.pin-line{
  position: absolute;
  transition: transform .4s;
  width: 80px;
  height: 1px;
  background: #9e9e9e;
  left: 7px;
  top: 7px;
}
.pin-hours:after{
  position: absolute;
  left: -3px;
  top: -2px;
  content: ' ';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #959595;
}
.time-circle .minitem:hover,
.time-circle .minitem.active{
  background: #f1f1f1;
  color: #0a97ff;
}
.time-picker .btn{
  height: 36px;
  margin-top: 6px;
  border-top: 1px solid #eaeaea;
  padding-top: 5px;
  padding-bottom: 5px; 
}
.time-picker .cancel,
.time-picker .confirm,
.time-picker .clear {
  font-size: 12px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  cursor: pointer;
  border-radius: 14px;
  width: 40px;
  float: right;
  border: 1px solid transparent;
}
.time-picker .confirm{
  float: left;
  width: 100px;
  border: 1px solid transparent;
  text-align: left;
  text-indent: 2px;
}
.time-picker .confirm:hover{
  text-decoration: underline;
}
.time-picker .cancel{
  color: rgb(163, 163, 163);
}
.time-picker .clear{
  color: rgb(163, 163, 163);
}
.time-picker .cancel:hover,
.select-now .toDay:hover{
  color: #086ed4;
}
.time-picker .clear:hover,
.select-now .clear:hover{
  color: #ff3b3b;
}
.input-mask{
  width: 100%; 
  height: 100%; 
  position: absolute; 
  left: 0px; 
  top: 0px; 
  background: transparent;
}
.entry-add{
  color:#27d413;
}
.operate-add, 
.operate-remove,
.operate-top,
.operate-bottom{
  width: 18px;
  height: 18px;
  line-height: 18px;
  position: absolute;
  display: block;
  font-size: 14px;
  text-align: center;
  border: 1px solid transparent;
  border-radius: 50%;
  cursor: pointer;
}
.operate-add{
  left: 0px;
  top: 0px;
}
.operate-add:hover{
  color: #16ca2e;
  border: 1px solid #16ca2e;
}
.operate-remove {
  left: 0px;
  top: 20px;
}
.operate-remove:hover{
  color: #e21818;
  border: 1px solid #e21818;
}
.operate-top {
  left: 20px;
  top: 0px;
}
.operate-top:hover{
  color: #237bd3;
  border: 1px solid #237bd3;
}
.operate-bottom{
  left: 20px;
  top: 20px;
}
.operate-top.ban,
.operate-top.ban:hover,
.operate-bottom.ban,
.operate-bottom.ban:hover{
  color: #e6e6e6;
  cursor: not-allowed;
  border: 1px solid transparent;
}
.operate-bottom:hover{
  color: #66a9ec;
  border: 1px solid #66a9ec;
}
.status-modify{
  background: #0093ff !important;
}
.status-add{
  background: #08e26a !important;
}
.status-error,
.status-error.status-modify,
.status-error.status-add{
  background: #ff4f43 !important;
}
.operate-item{
  height: 32px;
  line-height: 32px;
  text-indent: 8px;
  color: #878787;
  font-size: 14px;
  cursor: pointer;
}
.operate-item:hover{
  background: #f1f1f1;
  color: #00abff;
}
.operate-item.no-entry,
.operate-item.no-entry:hover{
  color: #dadada;
  background: #fff;
  cursor: not-allowed;
}
.operate-cir{
  position: absolute; 
  z-index: 98;
  left: 0px; 
  top: 0px; 
  width: 40px; 
  height: 40px; 
  line-height: 40px;
  text-align: center; 
  color: #d3d3d3;
  transition: all .3s;
  font-size: 14px;
}
.operate_loading{
  position: absolute; 
  z-index: 101;
  left: 0px; 
  top: 0px; 
  width: 39px; 
  height: 40px;
  background: #fff;
}
.skype-loader{
    width: 24px;
    height: 24px;
    position: relative;
    margin: 8px auto;
}
.skype-loader .dot {
    position: absolute;
    top: 0;
    left: 0;
    width: 24px;
    height: 24px;
    animation: 1.3s dotrotate cubic-bezier(.63,1.36,.92,.92) infinite;
}
.skype-loader .dot:after {
    content: " ";
    position: absolute;
    width: 4px;
    height: 4px;
    background: #999;
    border-radius: 50%;
    left: 50%;
    transform: translateX(-50%);
}
.skype-loader .dot.save:after{
    background: #08f76b;
}
.skype-loader .dot.remove:after{
    background: #ff5858;
}
.skype-loader .dot:nth-child(1) {
    animation-delay: 0s;
}
.skype-loader .dot:nth-child(2) {
    animation-delay: 0.12s;
}
.skype-loader .dot:nth-child(3) {
    animation-delay: 0.24s;
}
.skype-loader .dot:nth-child(4) {
    animation-delay: 0.36s;
}
@keyframes dotrotate {
  100% {
    transform: rotate(360deg);
  }
}

.operate-cir:hover,
.activeOperate.operate-cir{
  color: #00abff;
}
.sheet-move {
  transition: transform .16s;
}
</style>
