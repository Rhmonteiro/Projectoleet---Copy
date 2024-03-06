
<template>
  <div>
    
    <div class="row">
      <div class="col-md-4">
        <card class="comBordasL comBordasR comBordasT comBordasB">
          <h3>Number of Vehicles in Stock</h3>
          <h1>{{ numberOfVehicles }}</h1>
        </card>
      </div>
      <div class="col-md-8">
        <card class="comBordasL comBordasR comBordasT comBordasB">
          <div class="row">
          <div class="col-md-4 comBordasR ">
          <h3>Number of items in Stock</h3>
          <h1 class="combBordasB">{{ numberOfItems }}</h1>
          </div>
          <div class="col-md-8 comBordasL">
            <h3 class="comBordasT">Value of items in stock</h3>
            <h1>{{ValueOfItems}}€</h1>
          </div>
        </div>
        </card>
      </div>
    </div>
    <div class="row">
      <div class="col-md-6">
        <card>
          <h3>Distribuição de peças/categorias</h3>
          <Doughnut
            ref="skills_chart"
            :chart-data="chartData"
            :options="options"
          ></Doughnut>
        </card>
      </div>
      <div class="col-md-6">
        <card>
          <h3>Distribuição de carros/categorias</h3>
          <Doughnut
            ref="skills_chart"
            :chart-data="chartData"
            :options="options"
          ></Doughnut>
        </card>
      </div>
    </div>

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
    duration: 500,
    easing: 'easeInOutQuint',
    onProgress: function(animation) {
     // console.log('Progress: ' + animation.animationObject.currentStep + '/' + animation.animationObject.numSteps);
    },
    onComplete: function() {
     // console.log('Completed animation!');
    }
  },
  elements:{
    arc:{
        borderWidth:0               
    }
  },
    legend:{
      position: 'bottom',
      align: 'center',
        labels:{

        fontSize: 14,
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
      await  store.dispatch('getCarParts','');
      await  store.dispatch('getVehicles');
      await  store.dispatch('getCategories');
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
            backgroundColor:['#00876c','#51a676','#88c580','#c2e38c','#ffff9d','#fdd172','#f7a258','#ea714e','#d43d51'],// ['#289435','#1ebaab','#942828'],
            data: catCounts,//this.getTotalsByCategories(),
          }
        ]
      }
    }
    },
    beforeCreate() {
        this.$store.dispatch('getCarParts','');
        this.$store.dispatch('getVehicles');
        this.$store.dispatch('getCategories');
    },
    data(){
        return {
      numberOfVehicles: this.$store.state.vehicles.length,
      numberOfItems: this.$store.state.carParts.length,
      ValueOfItems: this.$store.state.carParts.reduce((acc, item) => acc + item.price, 0),
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
      }
      
    }

}
</script>

<style>
.comBordasL{ 
    
    border-left: 4px solid aquamarine
};
.comBordasR{ 
    border-right: 2px solid aquamarine;
    
}
@media (max-width:768px) {
  .comBordasT{ 
    border-left: 0px solid aquamarine !important;
    border-top: 1px solid aquamarine;
  };
  .comBordasB{ 
    border-right: 0px solid aquamarine !important;
    border-bottom: 1px solid aquamarine;
};
.comBordasL{ 
    
    border-left: 0px solid aquamarine
};
.comBordasR{ 
    border-right: 0px solid aquamarine;
    
}
}
</style>