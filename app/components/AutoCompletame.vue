<template>
    <el-row>
      <el-col>
        <el-autocomplete
          class="inline-input"
          v-model="state1"
          :fetch-suggestions="querySearch"
          placeholder="Please Input"
          @select="handleSelect"
          :value-key="valueKey"
          :clearable="clearable"
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
      },
      clearable: {
        type: Boolean,
        default: true
      }
    },
    components: {
      'el-autocomplete': Autocomplete,
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
      let results;
      if (this.links.length > 0 && typeof this.links[0] === 'object') {
        results = queryString ? this.links.filter(link => link[this.valueKey].toLowerCase().startsWith(queryString.toLowerCase())) : this.links;
      } else {
        results = queryString ? this.links.filter(link => link.toLowerCase().startsWith(queryString.toLowerCase())) : this.links;

        results= results.map((item) => {
          return {
            value: item
          };
        });
      }
      cb(results);
    },
      createFilter(queryString) {
        if (this.valueKey === null) {
          return (link) => {
            return link.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
          };
        } else {
          
          return (link) => {
            return link[this.valueKey].toLowerCase().indexOf(queryString.toLowerCase()) === 0;
          };
        }
      },
      handleSelect(item) {
        if (this.links.length > 0 && typeof this.links[0] === 'object') {
        this.$emit('update:selectedValue', item[this.valueKey]);
        } else {
          this.$emit('update:selectedValue', item);
        }
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
  