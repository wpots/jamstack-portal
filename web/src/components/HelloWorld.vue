<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2 v-if="loading">Loading...</h2>
    <ul>
      <li v-for="(member, index) in members" :key="index">{{ member.firstName }}</li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuery, useResult } from '@vue/apollo-composable';
import testQuery from '@/apollo/queries/testQuery';

export default defineComponent({
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  setup() {
    const { result, loading } = useQuery(testQuery);
    const members = useResult(result, null, (data) => data.memberCollection.items);
    console.log(members);
    return { loading, members };
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
