<template>
  <div id="app">
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
import 'assets/css/common'
import common from 'assets/js/common'

export default {
  data () {
    return {
      message: 'hello page ...'
    }
  },
  beforeCreate () {
    console.log(common)
  }
}
</script>

<style lang="scss" scoped>
  h1 {
    color: red;
  }
</style>
