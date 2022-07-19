<template>
    <div>

        <!-- FORM ADD DEVICE -->
        <div class="row">
<card>
            <div slot="header">
                <h4 class="card-title">Adicionar Peça</h4>
            </div>

            <div class="row">
                 <div class="col-1">
                   <p>Categoria:</p>
                   <base-dropdown style="display:inline-block"  title-classes="btn btn-secondary" v-bind="newCarPart"
               :title="newCarPart.type">
    <a v-for="item in categorias " :key="item.name" class="dropdown-item" v-on:click="newCarPart.type=item.name"> {{item.name}}</a>
</base-dropdown>
                    
                     <!-- <base-input 
                     label="Categoria" 
                     type="text" 
                     placeholder="Ex: 00-00-AA, AA-00-00"
                     v-model="newCarPart.type"
                     ></base-input> -->
                 </div>
                 <div class="col-1">
                   <p>Marca:</p>
                   <base-dropdown style="display:inline-block"   title-classes="btn btn-secondary"
               :title="newCarPart.carMaker">
    <a v-for="item in this.carMakers" :key="carMakers" class="dropdown-item" v-on:click="newCarPart.carMaker=item.name;getMakerModels(item.name)">{{item.name}}</a>
</base-dropdown>
                 </div>
                 <div class="col-1">
                   <p>Modelo:</p>
                   <base-dropdown style="display:inline-block"   title-classes="btn btn-secondary"
               :title="newCarPart.carModel">
    <a v-for="item,index in this.$store.state.makerModels" :key="carMakers" class="dropdown-item" v-on:click="newCarPart.carModel=item">{{item}}</a>
</base-dropdown>
                 </div>
                 <div class="col-1"></div>
                 
                 <div class="col-4">
                     <base-input 
                     label="Nome" 
                     type="text" 
                     placeholder="Ex: Nome da peça"
                     v-model="newCarPart.name"
                     ></base-input>
                 </div>
                 
                <div class="col-4">
                     <base-input 
                     label="Descrição" 
                     type="text" 
                     placeholder="Ex: breve descrição"
                     v-model="newCarPart.description"
                     ></base-input>

                 </div>
                     
                <div class="col-4">
                     <base-input 
                     label="Estado" 
                     type="text" 
                     placeholder="Ex: A+/A/B+/B..."
                     v-model="newCarPart.state"
                     ></base-input>
                
                </div>
                <div class="col-4">
                     <base-input 
                     label="Preço" 
                     type="text" 
                     placeholder="Ex: 100"
                     v-model="newCarPart.price"
                     ></base-input>

                 </div>

                    <div class="col-4">
                     <base-input 
                     label="Localizção" 
                     type="text" 
                     placeholder="Ex: A1M1P2"
                     v-model="newCarPart.whlocation"
                     ></base-input>

                 </div>

                 <!-- RFID TAG -->
                 <div class="col-4">
                     
<div>
            RFID:  {{this.newCarPart.rfid}}
</div>
                 </div>
            </div>
       
       
       
       <!-- botao ler RFID -->
        <div class="row pull-right">
          <div class="col-12">
            <base-button
              @click="getRFID()"
              type="primary"
              class="mb-3"
              size="lg"
              >Ler RFID</base-button
            >
          </div>
        </div>   
       
       <!-- botao add -->
       
       <div class="row pull-left">
          <div class="col-12">
            <base-button
              @click="createNewCarPart(),refreshCarPart()"
              type="primary"
              class="mb-3"
              size="lg"
              >Adicionar</base-button
            >
          </div>
        </div>
      </card>
    </div>




        <!-- DEVICES TABLE -->
         <div class="row">
         <card>
           
<!-- TESTE FILTRO -->

<div class="col-12, flex-left">
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



</div>



            <div slot="header">
                <h4 class="card-title">Peças</h4>
            </div>
        
        <el-table :data="pagedTableData" >

            <el-table-column prop="rfid" label="RFID" min-width="50" ></el-table-column>
            <el-table-column prop="carMaker" label="Marca" min-width="50" >
                <!-- <div slot-scope="{ row, $index}">
                    {{$index +1 }}
                </div> -->
            </el-table-column>
            <el-table-column prop="carModel" label="Modelo"  min-width="50" ></el-table-column>
            

            <el-table-column prop="type" label="Categoria"></el-table-column>

            <el-table-column prop="name" label="nome"></el-table-column>

            <el-table-column prop="description" label="descrição"></el-table-column>

            <el-table-column prop="whlocation" label="localização" min-width="50" align="left"></el-table-column>

            <el-table-column prop="state" label="estado" min-width="40"></el-table-column>

            <el-table-column prop="price" label="preço" min-width="40"></el-table-column>

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
<base-pagination :page-count="Math.ceil(this.carParts.length/this.pageSize)" v-model="defaultPagination">
</base-pagination>

    </div>
</template>


<script>
import {BasePagination} from '@/components'
import { Table, TableColumn } from "element-ui";
import { Select, Option} from "element-ui";
import { Client, MqttClient } from 'mqtt';

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
            itim:["1o","2o","3o"],
            filterby:{
              category:"null",
              brand:"null",
              model:"null"
            },
            makerModels:[],
            tableMakerModels:[],
            carMakers:[],
            filteredCarMakers:[],
            filtros:{
            },
            filteredUniqueBrands:[],
            categorias:[],
            carParts:[],
            newCarPart: {
              userId: "",
              vehicleId: "",
              type: "Categoria",
              name: "",
              description: "",
              state: "",
              price:"",
              rfid:"",
              carMaker:"Marca",
              carModel:"Modelo",
            },
            topic:"rfidIN"
        }   
    },
    computed:{
      pagedTableData(){
        
          let _sortBy=this.sortBy;
          if (this.carParts[0]) {
          let checkType = typeof this.carParts[0][_sortBy];
          console.log(checkType);
            

             switch (checkType) {
           case 'undefined':
             
             break;
          case 'number':
             return JSON.parse(JSON.stringify(this.carParts)).sort(function(a,b) {
          return a[_sortBy] - b[_sortBy];
        }).slice(this.pageSize * this.defaultPagination - this.pageSize, this.pageSize * this.defaultPagination);

            case'string':
console.log("sort by: ");
          console.log(_sortBy);

           return JSON.parse(JSON.stringify(this.carParts)).sort(function(a,b) {
             const sortByNormalizedA = a[_sortBy].toLowerCase();
             const sortByNormalizedB = b[_sortBy].toLowerCase();
             if (sortByNormalizedA < sortByNormalizedB) {
               return -1;
               
             }
             if (sortByNormalizedA > sortByNormalizedB) {
               return 1;
             }
             return 0;
           }).slice(this.pageSize * this.defaultPagination - this.pageSize, this.pageSize * this.defaultPagination);

            default:
             return JSON.parse(JSON.stringify(this.carParts));
         }
          }
        

        
        //  }
        // if(checkType === "number"){
        // return JSON.parse(JSON.stringify(this.carParts)).sort(function(a,b) {
        //   return a[_sortBy] - b[_sortBy];
        // }).slice(this.pageSize * this.defaultPagination - this.pageSize, this.pageSize * this.defaultPagination);

        // };
        //  if(_sortBy != ''){
        //   console.log("sort by: ");
        //   console.log(_sortBy);

        //    return JSON.parse(JSON.stringify(this.carParts)).sort(function(a,b) {
        //      const sortByNormalizedA = a[_sortBy].toLowerCase();
        //      const sortByNormalizedB = b[_sortBy].toLowerCase();
        //      if (sortByNormalizedA < sortByNormalizedB) {
        //        return -1;
               
        //      }
        //      if (sortByNormalizedA > sortByNormalizedB) {
        //        return 1;
        //      }
        //      return 0;
        //    }).slice(this.pageSize * this.defaultPagination - this.pageSize, this.pageSize * this.defaultPagination);
        //  }else{
        //  //return this.carParts.slice(this.pageSize * this.defaultPagination - this.pageSize, this.pageSize * this.defaultPagination);
        //  }
      }


      //computed function
      


    },
    async fetch() {
        // this.$store.dispatch('getCarParts',this.filterby);
       await this.$store.dispatch("getCarParts",this.filterby);
        await this.$store.commit('setFilteredCarParts',this.$store.state.carParts);
        await this.$store.dispatch('getCategories');
        await this.$nuxt.$on(this.topic, this.processRecievedData);
        await this.$store.dispatch('getCarMakers');
         //remove duplicados
         console.log("fetch");
         this.carParts=JSON.parse(JSON.stringify(this.$store.state.filteredCarParts));
        console.log("mounted car parts"+ this.carParts);
         this.carMakers=JSON.parse(JSON.stringify(this.$store.state.carMakers)).sort(
              (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
      console.log("mounted makers"+this.carMakers);        

              this.categorias=JSON.parse(JSON.stringify(this.$store.state.categories)).sort(
              (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);
console.log("mounted cate"+this.categorias);

        this.filterMakers();
    },
    mounted(){
//teste
console.log("mounted");
     
              
    },
    methods: {
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
      //process recieved nuxt even data
      processRecievedData(data){
        this.newCarPart.rfid=data.rfid;
        console.log("data: ");
        console.log(data);
      },

      //get device MQTT RFID
      getRFID(){
        this.$nuxt.$emit("rfid");
      },

      //update rule status
      

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

 /*   updateSaverRuleStatus(rule) {
      var ruleCopy = JSON.parse(JSON.stringify(rule));

      ruleCopy.status = !ruleCopy.status;
      
      const toSend = {
         rule: ruleCopy 
         };
      
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
      this.$axios
        .put("/saver-rule", toSend, axiosHeaders)
        .then(res => {
          
          if (res.data.status == "success") {

            this.$store.dispatch("getDevices");

            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: " Device Saver Status Updated"
            });
          }
          return;
        })
        .catch(e => {
          console.log(e);
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: " Error updating saver rule status"
          });
          return;
        });
    },*/
    deletePart(part) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          rfid: part.rfid
        }
      };
      this.$axios
        .delete("/carpart", axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {

            this.$store.dispatch("getCarParts","null");

            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: part.rfid + " deleted!"
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
    beforeDestroy(){
      this.$nuxt.$off(this.topic);
    }

}
</script>

<style>

</style>