<template>
    <div>

        <!-- FORM ADD DEVICE -->
        <div class="row">
<card>
            <div slot="header">
                <h4 class="card-title">Adicionar Veiculo</h4>
            </div>

            <div class="row">
                 <div class="col-4">
                     <base-input 
                     label="Matricula" 
                     type="text" 
                     placeholder="Ex: 00-00-AA, AA-00-00"
                     v-model="newVehicle.plate"
                     ></base-input>
                 </div>
                 
                 <div class="col-4">
                     <base-input 
                     label="Marca" 
                     type="text" 
                     placeholder="Ex: Fiat, Honda"
                     v-model="newVehicle.maker"
                     ></base-input>
                 </div>
                 
                <div class="col-4">
                     <base-input 
                     label="Modelo" 
                     type="text" 
                     placeholder="Ex: Punto, Civic"
                     v-model="newVehicle.carModel"
                     ></base-input>

                 </div>
                     
                <div class="col-4">
                     <base-input 
                     label="Km" 
                     type="text" 
                     placeholder="Ex: 100000"
                     v-model="newVehicle.km"
                     ></base-input>
                
                </div>
                <div class="col-4">
                     <base-input 
                     label="Ano" 
                     type="text" 
                     placeholder="Ex: yyyy/mm/dd"
                     v-model="newVehicle.year"
                     ></base-input>

                 </div>
            </div>
    
       
       <div class="row pull-right">
          <div class="col-12">
            <base-button
              @click="createNewVehicle()"
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
            <div slot="header">
                <h4 class="card-title">Veiculos</h4>
            </div>
        
        <el-table :data="$store.state.vehicles">

            <el-table-column label="#" min-width="50" align="center">
                <div slot-scope="{ row, $index}">
                    {{$index +1 }}
                </div>
            </el-table-column>

            <el-table-column prop="plate" label="matricula"></el-table-column>

            <el-table-column prop="maker" label="marca"></el-table-column>

            <el-table-column prop="carModel" label="Modelo"></el-table-column>

            <el-table-column prop="km" label="km"></el-table-column>

            <el-table-column prop="year" label="Ano"></el-table-column>

            <el-table-column label="Actions">

                <div slot-scope="{row, $index}">
                
                <el-tooltip 
                content="Delete"
                 effect="light"
                :open-delay="300"
                placement="top"
                >
                
                    <base-button type="danger" icon size="sm" class="btn-link" @click="deleteVehicle(row)">
                        <i class="tim-icons icon-simple-remove"></i>
                    </base-button>
 
                </el-tooltip>
                </div>
            </el-table-column>

        </el-table>
            
                
           
        </card>
     </div>


    </div>
</template>


<script>
import { Table, TableColumn } from "element-ui";
import { Select, Option} from "element-ui";

export default {
    middleware: 'authenticated',
    components:{
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Option.name]: Option,
        [Select.name]: Select
    },
    data(){
        return {
            newVehicle: {
              userId: "",
              plate: "",
              maker: "",
              carModel: "",
              km:"",
              year:"",
              abate: true,
            }
        }   
    },
    mounted() {
        this.$store.dispatch('getVehicles');
    },
    methods: {

      //update rule status
      

       //new vehicle
    createNewVehicle() {
      if (this.newVehicle.plate == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: "  Matricula vazia :("
        });
        return;
      }
      if (this.newVehicle.maker == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Marca esta vazio :("
        });
        return;
      }
      if (this.newVehicle.carModel == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Modelo esta vazio :("
        });
        return;
      }
      
      if (this.newVehicle.km == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " km esta vazio :("
        });
        return;
      }
      if (this.newVehicle.year == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Ano esta vazio :("
        });
        return;
      }
 
    
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };

      const toSend = {
        newVehicle: this.newVehicle
      };
      this.$axios
        .post("/vehicle", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$store.dispatch("getVehicles");
            this.newVehicle.plate = "";
            this.newVehicle.maker = "";
            this.newVehicle.carModel = "";
            this.newVehicle.km = "";
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Successo!  o veiculo foi adicionado."
            });
            return;
          }
        })
        .catch(e => {
          if (
            e.response.data.status == "error" &&
            e.response.data.error.errors.plate.kind === "unique"
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
    deleteVehicle(vehicle) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          plate: vehicle.plate
        }
      };
      this.$axios
        .delete("/vehicle", axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {

            this.$store.dispatch("getVehicles");

            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: vehicle.plate + " deleted!"
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
            message: " Error deleting " + vehicle.name
          });
          return;
        });
    },
    }

}
</script>

<style>

</style>