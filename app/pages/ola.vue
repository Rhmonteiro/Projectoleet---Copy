<template>
  <card>

    <div>
      <el-autocomplete v-model="state1" :fetch-suggestions="querySearch" placeholder="Type something" value-key="null" clearable></el-autocomplete>
    </div>
  </card>
</template>

<script>
import { Card } from '../components';
import  Autocomplete  from 'element-ui/lib/autocomplete';

export default {
    middleware: 'authenticated',
    data() {
        return {
            links: ['New York', 'London', 'Berlin', 'Paris'],
            state1: '',
        };
    },
    methods: {
        querySearch(queryString, cb) {
            const results = queryString ? this.links.filter(link => link.toLowerCase().includes(queryString.toLowerCase())) : this.links;
            // console.log("results "+results);
            cb(results);
        },
    },
    components: { Card,
      'el-autocomplete': Autocomplete,
      },
    
};
</script>

<style>
</style>
