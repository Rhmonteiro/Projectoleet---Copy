<template>
   
   <div>
    <div class="row">
<div class="col-md-6">
        <card>
            <h3>Distribuição de peças/categorias</h3>
          <Doughnut
          ref="skills_chart"
        :chart-data="chartData"
        :options="options">
        </Doughnut>
        </card>
      </div>
      <div class="col-md-6">
        <card>
            <h3>Distribuição de peças/categorias</h3>
          <Doughnut
          ref="skills_chart"
        :chart-data="chartData"
        :options="options">
        </Doughnut>
        </card>
      </div>
<!-- 
    <div class="col-md-4">
        <card>
            <h3>Teste 2</h3>
        <Doughnut
          ref="skills_chart"
        :chart-data="chartData"
        :options="options">
        </Doughnut>
        </card>
    </div>

<div class="col-md-4">
        <card>
    <h3>Teste 3</h3>
          <Doughnut
          ref="skills_chart"
        :chart-data="chartData"
        :options="options">
        </Doughnut>
        </card>
    </div>

  -->

    </div>

     <!--
    <div class="row-4">
        <card>
          <Doughnut
          ref="skills_chart"
        :chart-data="chartData"
        :options="options">
        </Doughnut>
        </card>
    </div> -->
   </div>
    
    
</template>



<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option} from "element-ui";
import Doughnut from './../components/Doughnut.vue'

const options = {
  responsive: true, 
  maintainAspectRatio: false, 
  animation: {
    animateRotate: false
  },
  elements:{
    arc:{
        borderWidth:0               
    }
  },
    legend:{
        position:'bottom',
        labels:{
        fontColor: '#ffffff'
        }
        
    }
}
export default {
    middleware: 'authenticated',
    components:{
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Option.name]: Option,
        [Select.name]: Select,
        Doughnut,

    },
    async asyncData({store}){
      await store.dispatch('getCategories');
      const categorias = store.state.categoriesCount;
      let catCounts=[];
      store.state.categories.forEach(element => {
        catCounts+=categorias[element.name].count;
      });

    return {
      options, 
      chartData: {
        labels: store.state.categories.map(value=> value.name),//this.getCategories(),
        datasets: [
          {
            backgroundColor: ['#289435','#1ebaab','#942828'],
            data: catCounts,//this.getTotalsByCategories(),
          }
        ]
      }
    }
    },
    data(){
        return {
      // options, 
      // chartData: {
      //   labels: this.getCategories(),
      //   datasets: [
      //     {
      //       backgroundColor: ['#289435','#1ebaab','#942828'],
      //       data: this.getTotalsByCategories(),
      //     }
      //   ]
      // }
    }
    },
    methods:{
      getCategories(){
        let categories=[];
        this.$store.state.categories.forEach((element,index) => {
          categories.push(element.name);
          // this.chartData.labels.push(element.name);
        });
        return categories;
      },
      getTotalsByCategories(){
        let categoriesCount=[];
        let temp =this.$store.state.categoriesCount;
        this.$store.state.categories.forEach((element,index) => {
          categoriesCount.push(temp[element.name].count);
          // this.chartData.datasets[0].data.push(temp[element.name].count);
        });
        return categoriesCount;
      },
    }

}
</script>

<style>

</style>