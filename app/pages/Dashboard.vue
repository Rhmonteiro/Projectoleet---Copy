<template>
   
   <div>
    <div class="row">
<div class="col-md-12">
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
    data(){
        return {
      options, 
        chartData: {
        labels: ['Carrosaria','Direccao','Suspencao'],
        datasets: [
          {
            backgroundColor: ['#289435','#1ebaab','#942828'],
            data: [10,30,5]
          }
        ]
      }
    }
    }

}
</script>

<style>

</style>