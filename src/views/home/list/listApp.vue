<template>
  <div>
    <h1>Hello world.</h1>
    <div class="flex-demo">
      <div>header</div>
      <div>
        <ul>
          <li v-for="page in pages" :key="page.id">
            <a :href="page.url">{{page.name}}</a>
          </li>
        </ul>
      </div>
      <div>footer</div>
    </div>
  </div>
</template>

<script>
import 'assets/css/common'
import common from 'assets/js/common'
export default {
  data () {
    return {
      pages: [
        {
          id: 0,
          name: 'hello page',
          url: '/views/hello.html'
        },
        {
          id: 1,
          name: 'detail page',
          url: '/views/home/detail.html'
        }
      ]
    }
  },
  beforeCreate () {
    console.log(common)
  }
}
</script>

<style lang="scss" scoped>

</style>
