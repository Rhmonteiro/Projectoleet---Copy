<template>
 <el-row class="demo-autocomplete">
  <el-col :span="12">
    <div class="sub-title">list suggestions when activated</div>
    <el-autocomplete
      class="inline-input"
      v-model="state1"
      :fetch-suggestions="querySearch"
      placeholder="Please Input"
      @select="handleSelect"
    ></el-autocomplete>
  </el-col>
  <el-col :span="12">
    <div class="sub-title">list suggestions on input</div>
    <el-autocomplete
      class="inline-input"
      v-model="state2"
      :fetch-suggestions="querySearch"
      placeholder="Please Input"
      :trigger-on-focus="false"
      @select="handleSelect"
    ></el-autocomplete>
  </el-col>
</el-row>
</template>

<script>
    import { Autocomplete} from 'element-ui';
export default {
    middleware: 'authenticated',
    components:{
        [Autocomplete.name]: Autocomplete,
    },
  data() {
      return {
        links: [],
        state1: '',
        state2: ''
      };
    },
    methods: {
      querySearch(queryString, cb) {
        var links = this.links;
        var results = queryString ? links.filter(this.createFilter(queryString)) : links;
        // call callback function to return suggestions
        console.log(results)
        cb(results);
      },
      createFilter(queryString) {
        return (link) => {
          return (link.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
       
        return results;
      },
      handleSelect(item) {
        console.log(item);
      }
    },
    async fetch(){
      await this.$store.dispatch('getCategories');

    },
    mounted() {
      let categorias=JSON.parse(JSON.stringify(this.$store.state.categories)).sort(
              (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
console.log("mounted cate"+categorias);
 let resultados = [];
 categorias.forEach(element => {
  resultados.push({"value":element.name});
 });
      this.links = resultados;
    }
  }
  
</script>
<style>
.el-input__inner, .el-scrollbar{
  color: white !important;
  background:linear-gradient(to bottom, #222a42 0%, #1d253b 100%)!important;
  border-color: #344675 !important;
 
}
.el-input__inner:focus{
  border-color: aquamarine !important ;
  }
.el-popper{
  border-color: #344675 !important;
}
.el-autocomplete-sugestion {
 background-color: aquamarine !important;
 color: white !important;
}
.el-autocomplete-suggestion li{
 color: rgba(255, 255, 255, 0.7) !important;
}
.el-autocomplete-suggestion li:hover{
 color: white!important;
 background-color: rgba(222, 222, 222, 0.3);
}
.sub-title{
  color: white !important;
}
</style>
