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
                   <base-dropdown style="display:inline-block"   title-classes="btn btn-secondary" v-bind="newCarPart"
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
                     placeholder="Ex: Fiat, Honda"
                     v-model="newCarPart.name"
                     ></base-input>
                 </div>
                 
                <div class="col-4">
                     <base-input 
                     label="Descrição" 
                     type="text" 
                     placeholder="Ex: Punto, Civic"
                     v-model="newCarPart.description"
                     ></base-input>

                 </div>
                     
                <div class="col-4">
                     <base-input 
                     label="Estado" 
                     type="text" 
                     placeholder="Ex: 100000"
                     v-model="newCarPart.state"
                     ></base-input>
                
                </div>
                <div class="col-4">
                     <base-input 
                     label="Preço" 
                     type="text" 
                     placeholder="Ex: yyyy/mm/dd"
                     v-model="newCarPart.price"
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
        <div class="row pull-left">
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
       
       <div class="row pull-right">
          <div class="col-12">
            <base-button
              @click="createNewCarPart()"
              type="primary"
              class="mb-3"
              size="lg"
              >Add</base-button
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
    <a v-for="item in categorias " :key="item.name" class="dropdown-item" v-on:click="resetFilteredCarPart();setFiltros('type',item.name)"> {{item.name}}</a>
</base-dropdown>
<base-dropdown style="display:inline-block"   title-classes="btn btn-secondary"
               title="Marca">
    <a v-for="item, index in this.filteredCarMakers" :key="filteredCarMakers" class="dropdown-item" v-on:click="setFiltros('carMaker',item);">{{index+1}}-> {{item}}</a>
</base-dropdown>
<base-dropdown style="display:inline-block"  title-classes="btn btn-secondary"
               title="Modelo">
    <a v-for="item,index in this.$store.state.makerModels" :key="makerModels" class="dropdown-item" v-on:click="getCategories()">{{index+1}}-> {{item}}</a>
</base-dropdown>



</div>



            <div slot="header">
                <h4 class="card-title">Peças</h4>
            </div>
        
        <el-table :data="pagedTableData($event, sortBy)" :default-sort = "{prop: 'name', order: 'ascending'}" >

            <el-table-column label="#" min-width="50" align="center">
                <div slot-scope="{ row, $index}">
                    {{$index +1 }}
                </div>
            </el-table-column>
            <el-table-column prop="rfid" label="RFID"></el-table-column>

            <el-table-column prop="type" label="Categoria"></el-table-column>

            <el-table-column prop="name" label="nome"></el-table-column>

            <el-table-column prop="description" label="descrição"></el-table-column>

            <el-table-column prop="state" label="estado"></el-table-column>

            <el-table-column prop="price" label="preço"></el-table-column>

            <el-table-column label="Actions">

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
<base-pagination :page-count="Math.ceil(this.carParts.length/10)" v-model="defaultPagination">
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
          sortBy:"name",
          pageSize:10,
          defaultPagination:1,
            itim:["1o","2o","3o"],
            filterby:{
              category:"null",
              brand:"null",
              model:"null"
            },
            makerModels:[],
            carMakers:JSON.parse(JSON.stringify(this.$store.state.carMakers)).sort(
              (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1),
            filteredCarMakers:[],
            filtros:{
              type:"Carrosaria"
            },
            filteredUniqueBrands:[],
            categorias:JSON.parse(JSON.stringify(this.$store.state.categories)).sort(
              (a, b) => a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1),
            carParts:this.$store.state.filteredCarParts,
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
      pagedTableData(sortBy){
        
         if(sortBy){
          let _sortBy=sortBy;
          console.log("sort by: "+ _sortBy);
           return JSON.parse(JSON.stringify(this.carParts)).sort(function(a,b) {
             return a[sortBy] - b[sortBy];
           }).slice(this.pageSize * this.defaultPagination - this.pageSize, this.pageSize * this.defaultPagination);
         }
         return this.carParts.slice(this.pageSize * this.defaultPagination - this.pageSize, this.pageSize * this.defaultPagination);
      }
    },
    mounted() {
        this.$store.dispatch('getCarParts',this.filterby);
        this.$store.dispatch('getCategories');
        this.$nuxt.$on(this.topic, this.processRecievedData);
        this.$store.dispatch('getCarMakers');
         //remove duplicados


        
    },
    methods: {
      getMakerModels(_carMaker){
        if (this.filteredCarMakers.length <2) {
          console.log("getmakermodles maker: ",this.filteredCarMakers[0]);
        this.$store.dispatch('getMakerModels',_carMaker);
        
       this.makerModels = this.$store.state.makerModels;
        }
        
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
        let filteredMakers=[];
        
       this.carParts.forEach(element => {
         filteredMakers.push(element.carMaker);
       });
       filteredMakers=[...new Set(filteredMakers)];
       this.filteredCarMakers=filteredMakers;
        //TODO ADICIONAR CAMPO MARCAS FAZER SET DAS MARCAS DEPOIS DE FILTRAR
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