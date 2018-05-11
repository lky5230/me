<template>
  <div class="no">
    Sorry, the page you are looking for could not be found.
  </div>
</template>

<script>

export default {
  name: 'notFound',
}
</script>

<style lang="less" scoped>
.no {
  height: calc(~"100vh - 120px");
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  padding: 20px;
  text-align: center;
  color: #636b6f;
  font-family: 'Raleway', sans-serif;
  font-weight: 100;
}
</style>
