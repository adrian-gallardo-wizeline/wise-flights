<template>
  <div id="app">
    <el-container>
      <el-header class="center">
        <img class="logo" src="./assets/logo.png" />
      </el-header>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
.logo {
  max-width: 200px;
  max-height: 200px;
}
.center {
  text-align: center;
}
</style>
