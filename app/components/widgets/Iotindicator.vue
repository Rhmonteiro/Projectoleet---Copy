<template>
    <card>
        
        <div slot="header">
                <h4 class="card-title"> 
                 
                    {{config.selectedDevice.name}} - {{config.variableFullName}} 
                
                </h4>
        </div>

<i class="fa " :class="[config.icon]"></i>


    </card>
</template>

<script>
export default {
    props: ['config'],
    data(){
        return {
            config: {
                userId: 'userId',
                selectedDevice: {
                name :"home",
                dId: "8888",
                templateName: "Power Sensor",
                templateId: "2355646548ferssd",
                saverRule: false,
                },

                variableFullName: 'Pump',
                variable: 'uniqueSTR',
                icon: 'fa-sun',
                column: 'col-6',
                widget: 'indicator',
                class: 'danger',


            }
        }
    },
    mounted(){
        this.$nuxt.$on('widget-topic', this.processRecievedData)
    },
    methods: {
        processRecievedData(data){
            console.log("recieved");
            console.log(data);
            this.value=data.value; 
        },
        getIconColorClass(){
            if(!this.value){
                return "text-dark";
            }
            if (this.config.class=="success") {
                return "text-success";
            }
            if (this.config.class == "primary") {
                return "text-primary";
            }
            if (this.config.class == "warning") {
                return "text-warning";
            }
            if (this.config.class == "danger") {
                return "text-danger";
            }
        }
    }
}

//userId/dId/temperature/sdata
</script>