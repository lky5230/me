<template>
    <div class="mdui-fab-wrapper" mdui-fab="{trigger: 'click'}">
        <button 
            class="mdui-fab mdui-ripple mdui-color-teal"
            mdui-tooltip="{position: 'left', content: '操作面板'}">
            <i class="mdui-icon material-icons">more_verti</i>
            <i class="mdui-icon mdui-fab-opened material-icons">expand_less</i>
        </button>
        <div class="mdui-fab-dial">
            <button 
                v-for="(fab, fabIndex) in fabList"
                :key="fabIndex"
                :mdui-tooltip="'{position: \'left\', content: \''+fab.tooltip+'\'}'" 
                class="mdui-fab mdui-fab-mini mdui-ripple"
                :style="{
                    background: fab.bgColor || '#009688',
                }"
                @click="btnClick(fab)">
                <img class="fab-img" :src="require('../assets/fab/'+fab.img)" />
            </button>
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'fab',
    data(){
        return {
            
        }
    },
    props: {
        fabList: {
            default: ()=>[]
        }
    },
    methods: {
        btnClick(fab){
            this.$emit('fabDone', fab)
        }
    }
}
</script>

<style lang="less" scoped>
.fab-img{
    width: 16px;
    height: 16px;
}
</style>
