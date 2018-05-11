<template>
  <div style="height: 600px;">
    <flow2 @save="save" />
  </div>
</template>

<script>
import flow2 from './flow2.vue'
export default {
    components: {flow2},
    methods: {
      save(e){
        console.log(e)
      }
    }
}
</script>

<style scoped>

</style>
