<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>
    <side-bar
      :background-color="sidebarBackground"
      short-title="PL"
      title="Projecto RM"
    >
      <template slot-scope="props" slot="links">
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'tim-icons icon-tv-2',
            path: '/Dashboard'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Veículos',
            icon: 'tim-icons icon-bus-front-12',
            path: '/Vehicles'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Peças',
            icon: 'tim-icons icon-app',
            path: '/Parts'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Inventário',
            icon: 'tim-icons icon-single-copy-04',
            path: '/inventory'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Dispositivos',
            icon: 'tim-icons icon-wifi',
            path: '/Devices'
          }"
        >
        </sidebar-item>
         <!-- <sidebar-item
          :link="{
            name: 'Actualizar BD',
            icon: 'tim-icons icon-app',
            path: '/Updatedb'
          }"
        >
        </sidebar-item> -->
      
      </template>
    </side-bar>


    
    <div class="main-panel" :data="sidebarBackground">
    
      <dashboard-navbar></dashboard-navbar>
      <router-view name="header"></router-view>

      <div
        :class="{ content: !isFullScreenRoute }"
        @click="toggleSidebar"
      >
        <zoom-center-transition :duration="200" mode="out-in">
          <!-- your content here -->
          <nuxt></nuxt>
        </zoom-center-transition>
      </div>
      <content-footer v-if="!isFullScreenRoute"></content-footer>
    </div>
  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';
  import SidebarShare from '@/components/Layout/SidebarSharePlugin';
  import mqtt, { connect } from 'mqtt';
  
function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import DashboardNavbar from '@/components/Layout/DashboardNavbar.vue';
  import ContentFooter from '@/components/Layout/ContentFooter.vue';
  import DashboardContent from '@/components/Layout/Content.vue';
  import { SlideYDownTransition, ZoomCenterTransition } from 'vue2-transitions';

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      DashboardContent,
      SlideYDownTransition,
      ZoomCenterTransition,
      SidebarShare
    },
    data() {
      return {
        sidebarBackground: 'vue', //vue|blue|orange|green|red|primary
        client: null,
        options: {
            port: process.env.mqtt_port,
            host: process.env.mqtt_host,
            endpoint:'/mqtt',
            clean: true,
            connectTimeOut: 5000,
            reconnectPeriod: 5000,

            //Certification Information
            clientId: 'web_'+ this.$store.state.auth.userData.name+ "_" + Math.round(Math.random() * (0 - 10000) * -1),
            username: "",
            password: "",
          },
          nuxtTopic:"rfid",
          currentSubTopicSData: "",
          currentSubTopicNotif: "",
          currentPubTopicRFID:"",
    };
    },
    computed: {
      isFullScreenRoute() {
        return this.$route.path === '/maps/full-screen'
      }
    },
    beforeDestroy() {
      this.$nuxt.$off("mqtt-sender");
      this.$nuxt.$off(this.nuxtTopic);
    },
    methods: {
      publishGetRFID(){
        const toSend={
          rfid:"1"
        };
        this.client.publish(this.$store.state.auth.userData._id+"/" + this.$store.state.selectedDevice.dId +"/1/actdata", JSON.stringify(toSend));
      },

      async getMqttCredentials(){
          try {
            const axiosHeaders = {
            headers: {
              token: this.$store.state.auth.token
              }
            };
              
          const credentials = await this.$axios.post("/getmqttcredentials", null, axiosHeaders);
          console.log(credentials.data);
          this.options.username= credentials.data.username;
          this.options.password= credentials.data.password;

          } catch (error) {
            console.log(error);
          }
        
      },

      async getMqttCredentialsForReconnection(){
      try {
            const axiosHeaders = {
            headers: {
              token: this.$store.state.auth.token
              }
            };
              
          const credentials = await this.$axios.post("/getmqttcredentialsforreconnection", null, axiosHeaders);
          console.log(credentials.data);
          this.client.options.username= credentials.data.username;
          this.client.options.password= credentials.data.password;

          } catch (error) {
            console.log(error);
          }
        
      },
      
      async startMqttClient(){

        await this.getMqttCredentials();

        

        //ex topic. "userId/did/variableId/sdata"
        this.currentSubTopicSData = this.$store.state.auth.userData._id +"/+/+/sdata";
        const subscribetopicsinfo = "+/"+"+"+"/+/sinfo";
        this.currentSubTopicNotif = this.$store.state.auth.userData._id +"/+/+/notif";
        const pubTopic= this.$store.state.auth.userData._id +"/"+ this.$store.state.selectedDevice.dId +"/1/actdata";

        const connectUrl = "ws://" + this.options.host + ":"+ this.options.port+ this.options.endpoint;

        try {
          this.client = mqtt.connect(connectUrl, this.options);
        } catch (error) {
          console.log(error);
        }
        
        this.client.on('connect', ()=>{
          console.log("connection success");


          //subscribe sdata
          this.client.subscribe(this.currentSubTopicSData, {qos: 0},(err)=>{
           
           if(err){
              console.log("error in sdata subscribe topic");
            }

            console.log("subscribe sdata topic success");
            console.log(this.currentSubTopicSData); 
          
          
          });

           //subscribe sinfo
          this.client.subscribe(subscribetopicsinfo, {qos: 0},(err)=>{
           
           if(err){
              console.log("error in sinfo subscribe topic");
            }

            console.log("subscribe sinfo topic success");
            console.log(subscribetopicsinfo); 
          
          
          });

          //subscribe notif
          this.client.subscribe(this.currentSubTopicNotif, {qos: 0},(err)=>{
           
           if(err){
              console.log("error in notif subscribe topic");
            }

            console.log("subscribe notif topic success");
            console.log(subscribetopicsinfo); 
          
          
          });
         
        });

        // this.client.publish(pubTopic, JSON.stringify({"a":"a"}));
          

        
        this.client.on('error', error => {
              console.log('Connection failed', error)
          });

        this.client.on("reconnect", (error) => {
              console.log("reconnecting:", error);
              this.getMqttCredentialsForReconnection();
          });
        
        this.client.on('message', (topic, message) => {
        
            console.log("Message from topic " + topic + " -> ");
            console.log(message.toString());
            
            try {
              const splittedTopic = topic.split("/");
              const msgType = splittedTopic[3];
            
            
              if(msgType == "notif"){
                this.$notify({ type: 'danger', icon: 'tim-icons icon-alert-circle-exc', message: message.toString()});
                this.$store.dispatch("getNotifications");
                return;
                
              }else if (msgType == "sdata"){
                
                // $nuxt.$emit(topic, JSON.parse(message.toString()));
                if(message.rfid!=""){
                  console.log("nuxt emit rfidin");
                  this.$nuxt.$emit("rfidIN",JSON.parse(message));
                }
                return;
              }
            } catch (error) {
              console.log(error);
            }
          });
          
          $nuxt.$on('mqtt-sender', (toSend) => {
            this.client.publish(toSend.topic, JSON.stringify(toSend.msg));
          });


      },

      updatePubSub(){

        //unsubscribe sdata
        this.client.unsubscribe(this.currentSubTopicSData,(err)=>{
           
           if(err){
              console.log("error in sdata unsubscribe topic");
            }

            console.log("unsubscribe sdata topic success");
            console.log(this.currentSubTopicSData); 
          
          
          });

          //unsubscribe notif
          this.client.unsubscribe(this.currentSubTopicNotif,(err)=>{
           
           if(err){
              console.log("error in notif unsubscribe topic");
            }

            console.log("unsubscribe notif topic success");
            console.log(this.currentSubTopicNotif); 
          
          
          });

        this.currentSubTopicSData= this.$store.state.auth.userData._id +"/" + this.$store.state.selectedDevice.dId + "/+/sdata";
        this.currentSubTopicNotif= this.$store.state.auth.userData._id +"/" + this.$store.state.selectedDevice.dId + "/+/notif";
        
          
          //subscribe sdata
          this.client.subscribe(this.currentSubTopicSData, {qos: 0},(err)=>{
           
           if(err){
              console.log("error in sdata subscribe topic");
            }

            console.log("subscribe sdata topic success");
            console.log(this.currentSubTopicSData); 
          
          
          });


        //subscribe notif
        this.client.subscribe(this.currentSubTopicNotif, {qos: 0},(err)=>{
           
           if(err){
              console.log("error in notif subscribe topic");
            }

            console.log("subscribe notif topic success");
            console.log(this.currentSubTopicNotif); 
          
          
          });
          this.client.publish(this.$store.state.auth.userData._id+"/" + this.$store.state.selectedDevice.dId +"/1/actdata", JSON.stringify({"a":"a"}));

      },

      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      },
      initScrollbar() {
        let docClasses = document.body.classList;
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          // if we are on windows OS we activate the perfectScrollbar function
          initScrollbar('sidebar');
          initScrollbar('main-panel');
          initScrollbar('sidebar-wrapper');

          docClasses.add('perfect-scrollbar-on');
        } else {
          docClasses.add('perfect-scrollbar-off');
        }
      }
    },
    mounted() {
      this.initScrollbar();
      this.startMqttClient();
      this.$nuxt.$on(this.nuxtTopic,this.publishGetRFID);
      this.$nuxt.$on("subUnSub",this.updatePubSub);
    }
  };
</script>
<style lang="scss">
  $scaleSize: 0.95;
  @keyframes zoomIn95 {
    from {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
    to {
      opacity: 1;
    }
  }

  .main-panel .zoomIn {
    animation-name: zoomIn95;
  }

  @keyframes zoomOut95 {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
  }

  .main-panel .zoomOut {
    animation-name: zoomOut95;
  }
</style>


<style>

</style>