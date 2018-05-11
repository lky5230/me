/*
* 容器必须有position 
* 容器具有overflow: hidden
    v-scroll="{
        banX: false, //禁用x轴滚动条
        banY: false, //禁用y轴滚动条 
        scrollSpeed: 2, //滚动速度
        wheelPropagation: false, //滚动到顶或底后，能否滚动父层
    }"
*/
import Vue from 'vue'
import Ps from 'perfect-scrollbar'
let ps = {};
Vue.directive('scroll', {
    inserted(el, binding) {
        let v = binding.value || {};
        let mark = 'ps-' + Date.now();
        //给每个元素设置唯一标识
        el.dataset.mark = mark;

        ps[mark] = new Ps(el, {
            wheelSpeed: v.scrollSpeed == undefined? 0.6: v.scrollSpeed,
            wheelPropagation: v.wheelPropagation == undefined? true: v.wheelPropagation,
            minScrollbarLength: 20,
            useBothWheelAxes: true,
            suppressScrollX: v.banX || false,
            suppressScrollY: v.banY || false,
        });
    },
    componentUpdated(el, binding) {
        ps[el.dataset.mark].update(el);
    },
    unbind(el, binding) {
        if(ps[el.dataset.mark]){
            ps[el.dataset.mark].destroy(el);
            ps[el.dataset.mark] = null;
        }
    }
});
