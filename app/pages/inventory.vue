<template>
    <div>
        <!-- Your content here -->
         <card>
            <div slot="header">
                <h4 class="card-title">Inventário</h4>
            </div>
            <div class="row">
                <div class="col">
                    <h4>selecione a localização:</h4>  
                    <AutoCompletame v-model="locationFilter" :state1="locationFilter" :links="$store.state.locations" @update:selectedValue="handleLocationFilter"></AutoCompletame>
                    <base-button 
                    type="primary"
                    class="mb-3"
                    size="">Ler</base-button>
                    <base-button 
                        type="danger"
                        class="mb-3"
                        size="">Parar</base-button>
                </div>
            </div>
            <div class="row">
                <el-table :data="inventoryTableData">
                    <el-table-column width="50" prop="icon"> </el-table-column>
                    <el-table-column prop="rfid" label="rfid">
                    </el-table-column>
                    <el-table-column prop="type" label="Type">
                    </el-table-column>
                    <el-table-column prop="carMaker" label="Marca">
                    </el-table-column>
                    <el-table-column prop="carModel" label="Modelo">
                    </el-table-column>
                    <el-table-column prop="state" label="Condição">
                    </el-table-column>
                    <el-table-column prop="price" label="Preço">
                    </el-table-column>
                </el-table>
                
            </div>
        
        </card>
        
    </div>
</template>

<script>
    import { Table, TableColumn } from "element-ui";
    import { Select, Option} from "element-ui";
export default {
    // Your script logic here
    middleware: 'authenticated',
    components:{
        [Table.name]: Table,
        [TableColumn.name]: TableColumn,
        [Option.name]: Option,
        [Select.name]: Select
    },
    mounted() {
        // Your mounted logic here
        this.$store.dispatch('getLocations')
    },
    data() {
        return {
            locationFilter: '',
            inventoryTableData: []
        }
    },
    methods: {
        // Your methods here
    async    handleLocationFilter(item){    

            this.locationFilter = item
            const axiosHeaders = {
                params: {
                    whlocation: item
                },
                headers: {
                    token: this.$store.state.auth.token
                }
      };
      this.$axios
        .get("/carpart", axiosHeaders)
        .then(res => {
          if (res.data.status == "success") {
            console.log("response data: "+res.data.data);
            this.inventoryTableData= res.data.data;
            this.inventoryTableData = res.data.data.map(item => {
                return {
                    ...item,
                    icon: <i class="tim-icons icon-check-2"/>   
                };
            });
            
            return;
          }
        })
        .catch(e => {
          
            this.$notify("danger", "Error");
            return;
          
        });


    },
}
}
</script>

<style scoped>
/* Your styles here */
</style>