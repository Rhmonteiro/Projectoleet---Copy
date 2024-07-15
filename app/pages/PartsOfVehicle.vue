<template>
    <div>

        <!-- FORM ADD DEVICE -->
        <div class="row">
<card>
            <div slot="header">
                <h4 class="card-title">Adicionar Peça ao veículo de matricula:</h4>
                
                <h2 class="text-success" > {{this.$store.state.selectedVehicle.plate}}</h2>
            </div>

            <div class="row">
                 <div class="col-md-4">
                   <p>Categoria:</p>
                   <AutoCompletame v-model="newCarPart.type" :links="this.categorias" :state1="newCarPart.type" @update:state1="handleState3Update" valueKey="name" >
                    </AutoCompletame>

                 </div>
                 <div class="col-md-4">
                   <p>Marca:</p>
                    <AutoCompletame v-model="newCarPart.carMaker" :disabled="true" :state1="newCarPart.carMaker" :links="this.carMakers" @update:state1="handleState1Update" @update:selectedValue="getMakerModels" valueKey="name" >
                    </AutoCompletame>
                 </div>
                <div class="col-md-4">
                   <p>Modelo:</p>
                   <AutoCompletame v-model="newCarPart.carModel" :disabled="true" :state1="newCarPart.carModel" :links="this.$store.state.makerModels" @update:state1="handleState2Update">
                    </AutoCompletame>
                   

                 </div>
                 
                 </div>

                 <div class="row">
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
                 
                 </div>
                 

                 <!-- RFID TAG -->
                 <div class="col-4">
                     
<div style="color: azure;">
            RFID:  {{this.newCarPart.rfid}}
</div>
                 </div>
            <!-- </div> -->
       
       
       
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
<!-- botao gerar RFID -->
<div class="row pull-right">
  <div class="col-12">
    <base-button
      @click="generateRFID()"
      type="primary"
      class="mb-3"
      size="lg"
      >Gerar RFID</base-button
    >
  </div>
</div>
            
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
<div class="row">

  <div class="col-sm-2">
    <p>Categoria:</p>
                       <AutoCompletame v-model="catTextFilter" :state1="catTextFilter" :links="this.categorias"  @update:selectedValue="handleCatFilter"  valueKey="name" >
                        </AutoCompletame>
  
    </div> 


                          <div class="row-sm-2 align-self-end position-relative">
  
  
                            <base-button
                                          @click="resetFilteredCarPart();setFiltros('vehicleId',filterby.vehicleId);setFiltros('type','null');setFiltros('carMaker','null');setFiltros('carModel','null');catTextFilter='';makerTextFilter='';defaultPagination=1; filterTableModels();modelTextFilter='';"
                                          type="danger"
                                          class="col-sm-2"
                                          size="sm"
                                          ><i class="tim-icons icon-simple-remove"></i>
                                          </base-button
                                        >
                        </div>


</div>  

</div>



            <div slot="header">
                <h4 class="card-title">Peças do veículo de matricula:</h4>
                <h2 class="text-success" > {{this.$store.state.selectedVehicle.plate}}</h2>
            </div>
        
        <el-table :data="pagedTableData" >

            <el-table-column prop="rfid" label="RFID"  ></el-table-column>
            <el-table-column prop="carMaker" label="Marca" >
                <!-- <div slot-scope="{ row, $index}">
                    {{$index +1 }}
                </div> -->
            </el-table-column>
            <el-table-column prop="carModel" label="Modelo"  ></el-table-column>
            

            <el-table-column prop="type" label="Categoria"></el-table-column>

            <el-table-column prop="name" label="nome"></el-table-column>

            <el-table-column prop="description" label="descrição"></el-table-column>

            <el-table-column prop="whlocation" label="localização"  align="left"></el-table-column>

            <el-table-column prop="state" label="estado" ></el-table-column>

            <el-table-column prop="price" label="preço" ></el-table-column>

            <el-table-column label="Actions" align="right">

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
import {BasePagination, AutoCompletame} from '@/components'
import { Table, TableColumn } from "element-ui";
import { Select, Option} from "element-ui";
import { Autocomplete } from "element-ui";
import { Client, MqttClient } from 'mqtt';

export default {
    middleware: 'authenticated',
    components:{
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Option.name]: Option,
        [Select.name]: Select,
        BasePagination,
        
        [Autocomplete.name]: Autocomplete,
    },
    data(){
        return {
          links: [],
        state1: '',
        state2: '',
        state3: '',
        catTextFilter: '',
        makerTextFilter: '',
        thisStateCatFilter: '',
        modelTextFilter: '',
        stateMakerFilter: '',
        selectedValue: '',
          sortBy:"type",
          pageSize:10,
          defaultPagination:1,
            itim:["1o","2o","3o"],
            filterby:{
              category:"null",
              brand:"null",
              model:"null",
              vehicleId:""
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
              type: "",
              name: "",
              description: "",
              state: "",
              price:"",
              rfid:"",
              carMaker:"",
              carModel:"",
            },
            topic:"rfidIN"
        }   
    },
    computed:{
      pagedTableData(){
      
        
          let _sortBy=this.sortBy;
          if (this.carParts[0]) {
          let checkType = typeof this.carParts[0][_sortBy];
          // // console.log(checkType);
            

             switch (checkType) {
           case 'undefined':
             
             break;
          case 'number':
             return JSON.parse(JSON.stringify(this.carParts)).sort(function(a,b) {
          return a[_sortBy] - b[_sortBy];
        }).slice(this.pageSize * this.defaultPagination - this.pageSize, this.pageSize * this.defaultPagination);

            case'string':
// // console.log("sort by: ");
          // // console.log(_sortBy);

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
        

        
      }


      //computed function
      


    },
    async fetch() {
        // this.$store.dispatch('getCarParts',this.filterby);
        this.filterby.vehicleId=this.$route.query.vehicle;
      // console.log("fetch: "+ this.filterby.vehicleId);
       await this.$store.dispatch("getCarParts",this.filterby);
       // await this.$store.commit('setFilteredCarParts',this.$store.state.carParts);
        await this.$store.dispatch('getCategories');
        await this.$nuxt.$on(this.topic, this.processRecievedData);
       // await this.$store.dispatch('getCarMakers');
         //remove duplicados
        // this.carParts=JSON.parse(JSON.stringify(this.$store.state.filteredCarParts));
        //  this.carMakers=JSON.parse(JSON.stringify(this.$store.state.carMakers)).sort(
        //       (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);

              this.categorias=JSON.parse(JSON.stringify(this.$store.state.categories)).sort(
              (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1);

              if(this.$route.query.vehicle!=undefined){
               await this.$store.dispatch('getSelectedVehicleInfo',this.$route.query.vehicle);
               this.newCarPart.userId=this.$store.state.auth.userData._id;
                this.newCarPart.carMaker=this.$store.state.selectedVehicle.maker;
                this.newCarPart.carModel=this.$store.state.selectedVehicle.carModel;
                this.newCarPart.vehicleId=this.$store.state.selectedVehicle._id;
                await this.setFiltros('vehicleId',this.filterby.vehicleId);
                await this.filterTableModels();
                await this.filterMakers();
              }
              
    },
    mounted(){
    
//teste
// console.log("mounted");
// console.log("query: "+JSON.stringify(this.$route.query.vehicle.abate) );
//this.filterby.vehicleId=this.$store.state.selectedVehicle._id;
Object.keys(this.$store.state.selectedVehicle).forEach(key => {
  // // console.log("key: "+key);
  // // console.log("value: "+this.$route.query.vehicle[key]);
});
Object.keys(this.newCarPart).forEach(key => {
  this.newCarPart[key]=this.$store.state.selectedVehicle[key];
  // // console.log("key: "+key);
  // // console.log("value: "+this.newCarPart[key]);
});
this.carMakers=this.$store.state.carMakers;

     
              
    },
    methods: {
      handleStateCatFilter(newValue4) {
        this.stateCatFilter = newValue4;
        // // console.log('stateCatFilter updated to:', this.stateCatFilter);
        if(this.stateCatFilter === ""){
          this.resetFilteredCarPart();
          this.setFiltros('type','null');

          return;
        }
    },
    handleCatFilter(item){
      // // console.log("handleCatFilter");
      this.resetFilteredCarPart();
      this.setFiltros('vehicleId',this.filterby.vehicleId)
      this.setFiltros('type',item);
      this.filterTableModels();
    },
handleModelFilter(item){
  // // console.log("handleModelFilter");
  this.resetFilteredCarPart();
  this.setFiltros('carModel',item);
  this.filterTableModels();
},

    handleStateMakerFilter(newValue5) {
      this.stateMakerFilter = newValue5;
      // // console.log('stateMakerFilter updated to:', this.stateMakerFilter);
      if(this.stateMakerFilter === ""){
        this.resetFilteredCarPart();
        this.setFiltros('carMaker','null');
        return;
      }
    },
handleStateModelFilter(newValue6) {
  this.stateModelFilter = newValue6;
  // // console.log('stateModelFilter updated to:', this.stateModelFilter);
  if(this.stateModelFilter === ""){
    this.resetFilteredCarPart();
    this.setFiltros('carModel','null');
    return;
  }
},
    
    handleMakerFilter(item){
      // // console.log("handleMakerFilter " + JSON.stringify(item.value));
      this.setFiltros('carMaker',item);
      this.filterTableModels();
    },
generateRFID() {
   const rfid = Math.floor(Math.random() * 1000000);
   this.newCarPart.rfid = rfid;
},
      
      handleState1Update(newValue) {
      //  console.log('state1 updated to:', newValue);
        this.state1 = newValue;
        this.newCarPart.carMaker = newValue;
    },handleState2Update(newValue2) {
        this.state2 = newValue2;
        this.newCarPart.carModel = newValue2;
    },handleState3Update(newValue3) {
        this.state3 = newValue3;
        this.newCarPart.type = newValue3;
    },
      querySearchMaker(queryString, cb) {
        var carMakers = this.carMakers;
        var results = queryString ? carMakers.filter(this.createFilter(queryString)) : carMakers;
        // call callback function to return suggestions
        // // console.log(results);
        cb(results);
      },
      querySearchModels(queryString, cb) {
        var carModels = this.makerModels;
        var results = queryString ? carModels.filter(this.createFilter(queryString)) : carModels;
        // call callback function to return suggestions
        // // console.log("resultadosmodels");
        // // console.log(results);
        cb(results);
      },
      createFilter(queryString) {
        return (carMaker) => {
          // // console.log("dentro filtros");
          // // console.log(carMaker);
            return carMaker.name.toLowerCase().indexOf(queryString.toLowerCase()) !==-1;
        };
      },
      
      handleSelect(item, vmodel) {
        //check vmodel if vmodel is state1 then set state1 to item.name if vmodel is state2 then set state2 to item.name
        this[vmodel] = item.name;
        // // console.log(item.name);
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
        // console.log("filtros SETFILTROS: "+JSON.stringify(this.filtros));
        // console.log("filtros NAME: "+name);
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
        
      },

      //get device MQTT RFID
      getRFID(){
        this.$nuxt.$emit("rfid");
      },

      //update rule status
      
      async refreshVehicleCarParts(){
      await this.$store.dispatch("getCarParts",this.filterby);
      await this.$store.commit('setFilteredCarParts',this.$store.state.carParts);
      this.setFiltros('vehicleId',this.filterby.vehicleId);
      this.carParts=JSON.parse(JSON.stringify(this.$store.state.filteredCarParts));
      this.filterTableModels();
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
            this.newCarPart.whlocation="";
            this.refreshVehicleCarParts();
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
                "O veículo ja se encontra no sistema."
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
            // console.log(e);
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
          // console.log(e);
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
          this.refreshVehicleCarParts();
          return;
        })
        .catch(e => {
          // console.log(e);
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

<style >
.btn-primary,.btn-primary:hover,.btn-primary:focus,.btn-primary:active{
  background-image: linear-gradient(to left bottom,rgb(78, 164, 225), rgb(123, 70, 213), rgb(1, 26, 250) ) !important;
}
.btn-primary:active:focus{
  background-image: linear-gradient(to left bottom,rgb(19, 218, 250), rgb(34, 94, 210), rgb(15, 60, 107) ) !important;
}
.dropdown-item:hover {
   color: #FFFFFf !important;
}
.form-control:focus {
  border-color: #6e4ee1 !important;
}
.page-item.active .page-link{
  background-color: #1d8cf8 !important;
  border-color: #1d8cf8 !important;
}
</style>