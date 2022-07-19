<template>
    <div>
        <div class="row">
         <card>
           
<!-- TESTE FILTRO -->

<!-- <div class="col-12, flex-left">
<p class="text-left">Filtrar por: <br></p> 
<base-dropdown style="display:inline-block" min-width="32"  title-classes="btn btn-secondary"
               title="Categoria">
    <a v-for="item in categorias " :key="item.name" class="dropdown-item" v-on:click="resetFilteredCarPart();setFiltros('type',item.name);defaultPagination=1"> {{item.name}}</a>
</base-dropdown>
<base-dropdown style="display:inline-block"   title-classes="btn btn-secondary"
               title="Marca">
    <a v-for="item, index in this.filteredCarMakers" :key="filteredCarMakers" class="dropdown-item" v-on:click="setFiltros('carMaker',item);filterTableModels();defaultPagination=1"> {{item}}</a>
</base-dropdown>
<base-dropdown style="display:inline-block"  title-classes="btn btn-secondary"
               title="Modelo">
    <a v-for="item,index in this.tableMakerModels" :key="makerModels" class="dropdown-item" v-on:click="setFiltros('carModel',item);defaultPagination=1">{{item}}</a>
</base-dropdown>



</div> -->



            <div slot="header">
                <h4 class="card-title">Marcas</h4>
            </div>
        
        <el-table :data="$store.state.carMakers" >

                <!-- <div slot-scope="{ row, $index}">
                    {{$index +1 }}
                </div> -->
            </el-table-column>

            <el-table-column prop="name" sortable label="Marca"></el-table-column>

           
            <el-table-column label="Actions" min-width="40" align="right">

                <div slot-scope="{row, $index}">
                
                <el-tooltip 
                content="Delete"
                 effect="light"
                :open-delay="300"
                placement="top"
                >
                
              <base-button type="danger"
               icon size="sm"
               class="btn-link"
               @click="deletePart(row)">
               <i class="tim-icons icon-simple-remove"></i>
               </base-button>
 
                </el-tooltip>
                </div>
            </el-table-column>

        </el-table>

<!--  modelos tabela  -->
         </card>
         <card>
            <div slot="header">
                <h4 class="card-title">Modelos</h4>
            </div>
        
        <base-dropdown style="display:inline-block" min-width="32"  title-classes="btn btn-secondary"
               title="Marca">
    <a v-for="maker in $store.state.carMakers " :key="maker.name" class="dropdown-item" v-on:click="selectMaker(maker)"> {{maker.name}}</a>
</base-dropdown>

        <el-table :data="makerModels" >

                <!-- <div slot-scope="{ row, $index}">
                    {{$index +1 }}
                </div> -->
            

            <el-table-column prop="name" sortable label="Modelos" > 

            </el-table-column>

<!--             
            <el-table-column label="Models" :prop="selectedMaker.models[index]" min-width="40" align="right"> -->

           
            <el-table-column label="Actions" min-width="40" align="right">

                <div slot-scope="{row, $index}">
                
                <el-tooltip 
                content="Delete"
                 effect="light"
                :open-delay="300"
                placement="top"
                >
                
              <base-button type="danger"
               icon size="sm"
               class="btn-link"
               @click="deletePart(row)">
               <i class="tim-icons icon-simple-remove"></i>
               </base-button>
 
                </el-tooltip>
                </div>
            </el-table-column>

        </el-table>


                
            
           
           
        </card>
        

     </div>
<base-pagination :page-count="Math.ceil(this.$store.state.carMakers.length/this.pageSize)" v-model="defaultPagination">
</base-pagination>
    </div>
</template>

<script>
import {BasePagination} from '@/components'
import { Table, TableColumn } from "element-ui";
import { Select, Option} from "element-ui";

export default {
    middleware: 'authenticated',
    components:{
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Option.name]: Option,
        [Select.name]: Select,
        BasePagination
    },
    data(){
        return {
          sortBy:"type",
          pageSize:10,
          defaultPagination:1,
          selectedMaker:"",
            
            makerModels:[],
            tableMakerModels:[],
            carMakers:[],
            filteredCarMakers:[],
            filtros:{
            },
            filteredUniqueBrands:[],
            categorias:[],
           
        }   
    },
    computed:{
//       pagedTableData(){
        
//           let _sortBy=this.sortBy;
//           if (this.carParts[0]) {
//           let checkType = typeof this.carParts[0][_sortBy];
//           console.log(checkType);
            

//              switch (checkType) {
//            case 'undefined':
             
//              break;
//           case 'number':
//              return JSON.parse(JSON.stringify(this.carParts)).sort(function(a,b) {
//           return a[_sortBy] - b[_sortBy];
//         }).slice(this.pageSize * this.defaultPagination - this.pageSize, this.pageSize * this.defaultPagination);

//             case'string':
// console.log("sort by: ");
//           console.log(_sortBy);

//            return JSON.parse(JSON.stringify(this.carParts)).sort(function(a,b) {
//              const sortByNormalizedA = a[_sortBy].toLowerCase();
//              const sortByNormalizedB = b[_sortBy].toLowerCase();
//              if (sortByNormalizedA < sortByNormalizedB) {
//                return -1;
               
//              }
//              if (sortByNormalizedA > sortByNormalizedB) {
//                return 1;
//              }
//              return 0;
//            }).slice(this.pageSize * this.defaultPagination - this.pageSize, this.pageSize * this.defaultPagination);

//             default:
//              return JSON.parse(JSON.stringify(this.carParts));
//          }
//           }
        
//       }


      //computed function
      


    },
    async fetch() {
        // this.$store.dispatch('getCarParts',this.filterby);
//        await this.$store.dispatch("getCarParts",this.filterby);
//         await this.$store.commit('setFilteredCarParts',this.$store.state.carParts);
//         await this.$store.dispatch('getCategories');
//         await this.$nuxt.$on(this.topic, this.processRecievedData);
//         await this.$store.dispatch('getCarMakers');
//          //remove duplicados
//          console.log("fetch");
//          this.carParts=JSON.parse(JSON.stringify(this.$store.state.filteredCarParts));
//         console.log("mounted car parts"+ this.carParts);
//          this.carMakers=JSON.parse(JSON.stringify(this.$store.state.carMakers)).sort(
//               (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
//       console.log("mounted makers"+this.carMakers);        

//               this.categorias=JSON.parse(JSON.stringify(this.$store.state.categories)).sort(
//               (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
// console.log("mounted cate"+this.categorias);

//         this.filterMakers();
    },
    mounted(){
//teste
console.log("mounted");
     
              
    },
    methods: {
      selectMaker(maker){
        this.selectedMaker=maker;
        let initialValue=[];
        const keyName = "name";
        this.selectedMaker.models.forEach((element,index)=>{
          initialValue.push({ name:element});
        });
        this.makerModels=initialValue;
      },
      getMakerModels(_carMaker){
        
        this.$store.dispatch('getMakerModels',_carMaker);
        
       this.makerModels = this.$store.state.makerModels;
        
        
      },
      refreshCarPart(){
        this.carParts = this.$store.state.filteredCarParts;
      },
      resetFilteredCarPart(){
        this.$store.commit('setFilteredCarParts',this.$store.state.carParts);
      },
      setFiltros(type,name){
        this.$store.state.filtros=this.filtros;             
        this.filtros[type]=name;
        this.$store.dispatch('filterCarParts', this.filtros);
        this.refreshCarPart();
        //remove duplicados
       this.filterMakers();
        //TODO ADICIONAR CAMPO MARCAS FAZER SET DAS MARCAS DEPOIS DE FILTRAR
      },
      filterMakers(){
      let filteredMakers=[];
        
       this.carParts.forEach(element => {
         filteredMakers.push(element.carMaker);
       });
       filteredMakers=[...new Set(filteredMakers)];
       this.filteredCarMakers=filteredMakers;
      },



      filterTableModels(){
      let filteredTableModels=[];
        
       this.carParts.forEach(element => {
         filteredTableModels.push(element.carModel);
       });
       filteredTableModels=[...new Set(filteredTableModels)];
       this.tableMakerModels=filteredTableModels;
      },
      

       //new vehicle
    createNewCarPart() {
      if (this.newCarPart.type == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "  Matricula vazia :("
        });
        return;
      }
      if (this.newCarPart.name == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Marca esta vazio :("
        });
        return;
      }
      if (this.newCarPart.price == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " preço esta vazio :("
        });
        return;
      }
      
      
 
    
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      const toSend = {
        newCarPart: this.newCarPart
      };
      this.$axios
        .post("/carpart", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$store.dispatch("getCarParts","null");
            this.newCarPart.type = "";
            this.newCarPart.name = "";
            this.newCarPart.description = "";
            this.newCarPart.price = "";
            this.newCarPart.state = "";
            this.newCarPart.rfid="";
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Successo!  a parte foi adicionado."
            });
            return;
          }
        })
        .catch(e => {
          if (
            e.response.data.status == "error" &&
            e.response.data.error.errors.part.kind === "unique"
          ) {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message:
                "O veiculo ja se encontra no sistema."
            });
            return;
          }else if (
            e.response.data.status == "error" &&
            e.response.data.error.errors.km.kind === "Number"
          ) {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message:
                "Km não e um numero."
            });
            return;
           }else if (
            e.response.data.status == "error" &&
            e.response.data.error.errors.e == "resource offline or not connected"
          ) {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message:
                "Failed to create new device - resource offline or not connected"
            });
            console.log(e);
            return;
          } else {
            this.showNotify("danger", "Error");
            return;
          }
        });
    },

    deletePart(part) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          id: part._id
        }
      };
      this.$axios
        .delete("/carmakers", axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {

            this.$store.dispatch("getCarMakers","null");

            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Marca: " + part.name + " deleted!"
            });
          }
          $nuxt.$emit("time-to-get-devices");
          return;
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: " Error deleting " + part.name
          });
          return;
        });
    },
    },

}

</script>