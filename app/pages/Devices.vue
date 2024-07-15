<template>
    <div>

        <!-- FORM ADD DEVICE -->
        <div class="row">
<card>
            <div slot="header">
                <h4 class="card-title">Adicionar Dispositivo</h4>
            </div>

            <div class="row">
                 <div class="col-4">
                     <base-input 
                     label="nome do dispositivo" 
                     type="text" 
                     placeholder="Ex: Aramazem 1"
                     v-model="newDevice.name"
                     ></base-input>
                 </div>
                 
                 <div class="col-4">
                     <base-input 
                     label="id do dispositivo" 
                     type="text" 
                     placeholder="Ex: 111111, 222222"
                     v-model="newDevice.dId"
                     ></base-input>
                 </div>
                 

            </div>
    
       
       <div class="row pull-right">
          <div class="col-12">
            <base-button
              @click="createNewDevice()"
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
                <h4 class="card-title">Dispositivos</h4>
            </div>
        
        <el-table :data="$store.state.devices"
        :header-cell-style="{ background: '#27293d' }"
        :cell-style="{ background: '#27293d' }"
        >

            <el-table-column label="#" min-width="50" align="center">
                <div slot-scope="{ row, $index}">
                    {{$index +1 }}
                </div>
            </el-table-column>

            <el-table-column prop="name" label="Nome"></el-table-column>

            <el-table-column prop="dId" label="ID do dispositivo"></el-table-column>

            <el-table-column prop="password" label="Password"></el-table-column>

            <el-table-column prop="chargeLeft" label="Bateria (%)"></el-table-column>

            <el-table-column prop="rssi" label="rssi (dBm)"></el-table-column>

            <el-table-column label="Ações">

                <div slot-scope="{row, $index}">

<!--                 <el-tooltip content="Database Indicator" style="margin-right:10px">
                  <i 
                  class="fas fa-database " 
                  :class="{
                    'text-success' : row.saverRule.status,
                     'text-dark' : !row.saverRule.status
                      }"
                  ></i>
                </el-tooltip>
                
                <el-tooltip content="Database Saver">
                  <base-switch 
                  @click="updateSaverRuleStatus(row.saverRule)"
                  :value="row.saverRule.status"
                  type="primary"
                  on-text="On"
                  off-text="Off"
                  ></base-switch>
                </el-tooltip> -->

                <el-tooltip 
                content="Delete"
                 effect="light"
                :open-delay="300"
                placement="top"
                >
                
                    <base-button type="danger" icon size="sm" class="btn-link" @click="deleteDevice(row)">
                        <i class="tim-icons icon-simple-remove"></i>
                    </base-button>
 
                </el-tooltip>
                </div>
            </el-table-column>

        </el-table>
            
                
           
        </card>
     </div>
      <Json :value="$store.state.selectedDevice"></Json>
      <Json :value="$store.state.devices"></Json>


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
            newDevice: {
            name: "",
            dId: "",
            }
        }   
    },
    mounted() {
        this.$store.dispatch('getDevices');
    },
    methods: {

      //update rule status
      

       //new device
    createNewDevice() {
      if (this.newDevice.name == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Device Name is Empty :("
        });
        return;
      }
      if (this.newDevice.dId == "") {
        this.$notify({
          type: "warning",
          icon: "tim-icons icon-alert-circle-exc",
          message: " Device ID is Empty :("
        });
        return;
      }
 
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        }
      };
    const toSend = {
        newDevice: this.newDevice
      };
      this.$axios
        .post("/device", toSend, axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            this.$store.dispatch("getDevices");
            this.newDevice.name = "";
            this.newDevice.dId = "";
            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: "Success! Device was added"
            });
            return;
          }
        })
        .catch(e => {
          if (
            e.response.data.status == "error" &&
            e.response.data.error.errors.dId.kind == "unique"
          ) {
            this.$notify({
              type: "warning",
              icon: "tim-icons icon-alert-circle-exc",
              message:
                "The device is already registered in the system. Try another device"
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
    updateSaverRuleStatus(rule) {
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
    },
    deleteDevice(device) {
      const axiosHeaders = {
        headers: {
          token: this.$store.state.auth.token
        },
        params: {
          dId: device.dId
        }
      };
      this.$axios
        .delete("/device", axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {

            this.$store.dispatch("getDevices");

            this.$notify({
              type: "success",
              icon: "tim-icons icon-check-2",
              message: device.name + " deleted!"
            });
          }
          $nuxt.$emit("time-to-get-devices");
          return;
        })
        .catch(e => {
          // console.log(e);
          this.$notify({
            type: "danger",
            icon: "tim-icons icon-alert-circle-exc",
            message: " Error deleting " + device.name
          });
          return;
        });
    },
    }

}
</script>

<style>

</style>