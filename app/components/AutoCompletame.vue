<template>
    <el-row>
      <el-col :span="12">
        <el-autocomplete
          class="inline-input"
          v-model="state1"
          :fetch-suggestions="querySearch"
          placeholder="Please Input"
          @select="handleSelect"
          :value-key="valueKey"
        ></el-autocomplete>
      </el-col>
   
    </el-row>
  </template>
  
  <script>
  import { Autocomplete } from 'element-ui';
  import { Row, Col } from 'element-ui';
  
  export default {
    props: {
      links: {
        type: Array,
        required: true
      },
      valueKey: {
        type: String,
        default: 'value'
      }
    },
    components: {
      [Autocomplete.name]: Autocomplete,
      [Row.name]: Row,
      [Col.name]: Col
    },
    data() {
      return {
        state1: '',
      };
    },
    methods: {
      querySearch(queryString, cb) {
        const results = queryString ? this.links.filter(this.createFilter(queryString)) : this.links;
        cb(results);
      },
      createFilter(queryString) {
        return (link) => {
          return link[this.valueKey].toLowerCase().indexOf(queryString.toLowerCase()) === 0;
        };
      },
      handleSelect(item) {
        console.log(item);
      }
    },
    watch: {
      state1(newValue) {
        this.$emit('update:state1', newValue);
      }
    }
  };
  </script>
  
  <style>
  .el-input__inner,
  .el-scrollbar {
    color: white !important;
    background: linear-gradient(to bottom, #222a42 0%, #1d253b 100%) !important;
    border-color: #344675 !important;
  }
  
  .el-input__inner:focus {
    border-color: #6e4ee1 !important;
  }
  
  .el-popper {
    border-color: #344675 !important;
  }
  
  .el-autocomplete-sugestion {
    background-color: #6e4ee1 !important;
    color: white !important;
  }
  
  .el-autocomplete-suggestion li {
    color: rgba(255, 255, 255, 0.7) !important;
  }
  
  .el-autocomplete-suggestion li:hover {
    color: white !important;
    background-color: rgba(222, 222, 222, 0.3);
  }
  
  .sub-title {
    color: white !important;
  }
  </style>
  