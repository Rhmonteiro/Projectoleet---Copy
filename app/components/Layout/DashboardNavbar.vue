<template>
  <base-nav
    v-model="showMenu"
    class="navbar-absolute top-navbar"
    type="white"
    :transparent="true"
  >
    <div slot="brand" class="navbar-wrapper">
      <div
        class="navbar-toggle d-inline"
        :class="{ toggled: $sidebar.showSidebar }"
      >
        <button type="button" class="navbar-toggler" @click="toggleSidebar">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </button>
      </div>
      <a class="navbar-brand ml-xl-3 ml-5" href="#">{{ routeName }}</a>
    </div>

    <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">
     




     <!-- lupa -->
<!--      
      <div class="search-bar input-group" @click="searchModalVisible = true">
        <button
          class="btn btn-link"
          id="search-button"
          data-toggle="modal"
          data-target="#searchModal"
        >
          <i class="tim-icons icon-zoom-split"></i>
        </button>
        <!-- You can choose types of search input -->
        <!-- 
      </div>

      <modal
        :show.sync="searchModalVisible"
        class="modal-search"
        id="searchModal"
        :centered="false"
        :show-close="true"
      >
        <input
          slot="header"
          v-model="searchQuery"
          type="text"
          class="form-control"
          id="inlineFormInputGroup"
          placeholder="SEARCH"
        />
      </modal> 
      -->

      <!-- profile -->
<!-- 
      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        class="nav-item"
        title-classes="nav-link"
        menu-classes="dropdown-navbar"
      >
        <template
          slot="title"
        >
          <div class="photo"><img src="img/mike.jpg" /></div>
          <b class="caret d-none d-lg-block d-xl-block"></b>
          <p class="d-lg-none">Log out</p>
        </template>
        <li class="nav-link">
          <a href="#" class="nav-item dropdown-item">Profile</a>
        </li>
        <li class="nav-link">
          <a href="#" class="nav-item dropdown-item">Settings</a>
        </li>
        <div class="dropdown-divider"></div>
        <li class="nav-link">
          <a href="#" class="nav-item dropdown-item">Log out</a>
        </li>
      </base-dropdown>
       -->
       <base-dropdown  :title="selectedDeviceTitle" title-classes="btn btn-info" menu-classes="dropdown-black" >
       <a v-for="item,index in $store.state.devices " :key="item.name" class="dropdown-item" v-on:click="selectedDevice=item;updateSelectedDeviceIndex(index); selectedDeviceTitle=selectedDevice.name"> {{item.name}}</a>
       <div class="dropdown-divider"></div>
       <a class="dropdown-item" v-on:click="selectedDevice='',selectedDeviceTitle='Selecione o Leitor RFID'">Nenhum</a>
       </base-dropdown>
    </ul>
  </base-nav>
</template>
<script>
import { CollapseTransition } from 'vue2-transitions';
import { BaseNav, Modal } from '@/components';
import {Select, Option} from 'element-ui';

export default {
  components: {
    CollapseTransition,
    BaseNav,
    Modal,
    [Option.name]: Option,
    [Select.name]: Select,
  },
  computed: {
    routeName() {
      const { path } = this.$route;
      let parts = path.split('/')
      if(parts == ','){
        return 'Dashboard';
      }
      return parts.map(p => this.capitalizeFirstLetter(p)).join(' ');
    },
    isRTL() {
      return this.$rtl.isRTL;
    }
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: '',
      selectedDevice: "" ,
      selectedDeviceTitle:"Selecione o Leitor RFID"
    };
  },
  mounted(){
    this.$store.dispatch("getDevices");
    this.$store.dispatch("getNotifications");
    //this.$nuxt.$on("selectedDeviceIndex", this.updateSelectedDeviceIndex);


    },
  
  methods: {

    //UPDATE SELECTED DEVICE
    updateSelectedDeviceIndex(index){
      this.selectedDevice = this.$store.state.devices[index];
      this.$store.commit('setSelectedDevice',this.selectedDevice);
      this.$nuxt.$emit("subUnSub")
    },

    //SELECT DEVICE
    selectDevice(index){
        const device = this.$store.state.devices[index];

        const axiosHeaders={
          headers: {
            token: this.$store.state.auth.token
          }
        }

        const toSend = {
          dId: device.dId
        }

        this.$axios
        .put("/device", toSend, axiosHeaders)
        .then(res => {

          this.$store.dispatch("getDevices");

        }).catch(e=> {
          console.log(e);
          return;
        });



    },

    // subUnSub(){

    //     s
    //     const subscribetopicsdata = "+/" + this.selectedDevice.dId +"/+/sdata";

    //     this.client.subscribe(subscribetopicsdata, {qos: 0},(err)=>{
           
    //        if(err){
    //           console.log("error in sdata subscribe topic");
    //         }

    //         console.log("subscribe sdata topic success");
    //         console.log(subscribetopicsdata); 
          
          
    //       });
    // };
    
    capitalizeFirstLetter(string) {
      if (!string || typeof string !== 'string') {
        return ''
      }
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    closeDropDown() {
      this.activeNotifications = false;
    },

    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },

    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    
    //CONVERT DATE FUNCTION
    unixToDate(ms) {
        let d = new Date(parseInt(ms)), 
          yyyy = d.getFullYear(),
          mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
          dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
          hh = d.getHours(),
          h = hh,
          min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
          ampm = 'AM',
          time;
        if (hh > 12) {
          h = hh - 12;
          ampm = 'PM';
        } else if (hh === 12) {
          h = 12;
          ampm = 'PM';
        } else if (hh == 0) {
          h = 12;
        }
        // ie: 2013-02-18, 8:35 AM	
        time = dd + '/' + mm + '/' + yyyy + ', ' + h + ':' + min + ' ' + ampm;
        return time;
      },
  }
};
</script>
<style >
.top-navbar {
  top: 0px;
}
.dropdown-item:hover {
   color: #FFFFFf !important;
}
.btn-info,.btn-info:hover,.btn-info:focus,.btn-info:active{
  background-image: linear-gradient(to left bottom,rgb(6, 161, 60), rgb(34, 210, 119), rgb(15, 107, 59) ) !important;
}
.btn-info:active:focus{
  background-image: linear-gradient(to left bottom,rgb(6, 161, 60), rgb(34, 210, 119), rgb(15, 107, 59) ) !important;
}


</style>
