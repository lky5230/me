<template>
    <div class="index">
        test
        <fab @fabDone="fabDone" :fabList="fabList"/>
    </div>
</template>

<script>
import fab from '@/views/fab'
export default {
    name: 'test',
    data(){
        return {
            fabList: [{
                tooltip: '保存',
                function: 'save',
                bgColor: '#4cb300',
                img: 'save.png',
            },{
                tooltip: '删除',
                function: 'delete',
                bgColor: '#f00',
                img: 'delete.png',
            }]
        }
    },
    methods: {
        fabDone(e){
            console.log(e)
        }
    },
    components: {fab}
}
</script>

<style lang="less" scoped>

</style>
