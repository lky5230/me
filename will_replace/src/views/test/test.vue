<template>
    <div style="height: 400px;" class="index">
        test
        <database 
            :colData="colData"
            :rowData="rowData" 
        />
        <fab 
            @fabDone="fabDone" 
            :fabList="fabList
        "/>
    </div>
</template>

<script>
export default {
  name: "test",
  data() {
    return {
      fabList: [
        {
          tooltip: "保存",
          function: "save",
          bgColor: "#4cb300",
          img: "save.png"
        },
        {
          tooltip: "删除",
          function: "delete",
          bgColor: "#f00",
          img: "delete.png"
        }
      ],
      colData: [
        {
          title: "多选",
          props: "a1",
          width: 150,
          icon: "",
          sort: true,
        },
        {
          title: "单选",
          width: 100,
          props: "a2",
          icon: "number"
        }
      ],
      rowData: [],
    };
  },
  methods: {
    fabDone(e) {
      console.log(e);
    }
  },
};
</script>

<style lang="less" scoped>
</style>
