<template>
  <GeoFence/>
</template>

<script>
import GeoFence from './components/GeoFence.vue'

export default {
  name: 'App',
  components: {
    GeoFence
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
