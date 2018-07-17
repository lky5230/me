/**
 * 自动注册'components'文件夹下的vue文件
 */
import Vue from 'vue'

function capitalizeLetter(str){
    return str.charAt(0).toLowerCase() + str.slice(1);
}

//找到'components'文件夹下第一层的vue文件
const requireComponent = require.context('./components', false, /\.vue$/);

requireComponent.keys().forEach(fileName=>{
    const componentConfig = requireComponent(fileName);
    const componentName = capitalizeLetter(
        fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
    );
    Vue.component(componentName, componentConfig.default || componentConfig);
})
