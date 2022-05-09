<template>
    <div>
        <card>
          
        </card>
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
        [Select.name]: Select,
    },

}
</script>

<style>

</style>