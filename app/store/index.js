


export const state = () => ({
    auth: null,
    devices: [],
    items: [],
    selectedDevice: {},
    notifications: [],
    vehicles: [],
    carMakers:[],
    carParts:[],
    categories:[],
    filteredCarParts:[],
    filteredVehicles:[],
    filterCarpats: {
        search:'',
    },
    rFiltros:{},
    makerModels:[],
});

export const mutations = {
    setAuth(state, auth) {
        state.auth = auth;
    },
    setDevices(state, devices) {
        state.devices = devices;
    },
    setItems(state, items) {
        state.items = items;
    },
    setSelectedDevice(state, device) {
        state.selectedDevice = device;
    },
    setNotifications(state, notifications) {
        state.notifications = notifications;
    },
    setVehicles(state, vehicles) {
        state.vehicles = vehicles;
    },
    setCarParts(state, carParts) {
        state.carParts = carParts;
    },
    setCategories(state, categories) {
        state.categories = categories;
    },
    setFilteredCarParts(state, filteredCarParts) {
        state.filteredCarParts = filteredCarParts;
    },
    setRfiltros(state, rFiltros){
        state.rFiltros = rFiltros;
    },
    setCarMakers(state,carMakers){
        state.carMakers= carMakers;
    },
    setMakerModels(state, makerModels){
        state.makerModels = makerModels;
    },

}

export const actions = {

    //GET NOTIFICATIONS
    // getNotifications() {
      
    //     const axiosHeader = {
    //         headers: {
    //             token: this.state.auth.token
    //         }
    //     };

    //     this.$axios.get("/notifications", axiosHeader)
    //         .then(res => {
    //             console.log(res.data.data);
    //             this.commit("setNotifications", res.data.data);
    //         }).catch(error => {
    //             console.log(error);
    //         });
    // },

    //GET DEVICES
     getDevices(){
            const axiosHeader= {
                headers: {
                    token : this.state.auth.token
                }
            }

            this.$axios.get("/device",axiosHeader)
            .then(res => {
                console.log(res.data.data);

                res.data.data.forEach((device, index) => {
                    if (device.selected) {
                        this.commit('setSelectedDevice', device);
                        $nuxt.$emit('selectedDeviceIndex', index); 
                    }
                });

                this.commit('setDevices', res.data.data);
            })
    },
    //GET MAKER MODELS
    getMakerModels({commit,dispatch}, maker){
        const axiosHeader= {
            params:{name:maker},
            headers: {
                token : this.state.auth.token
            }
        }

        this.$axios.get("/makermodels",axiosHeader)
        .then(res => {
            console.log(res.data.data);
            this.commit('setMakerModels', res.data.data);
        })
    },
    //GET ITEMS
    getItems(){
            const axiosHeader= {
                headers: {
                    token : this.state.auth.token
                }
            }

            this.$axios.get("/item",axiosHeader)
            .then(res => {
                console.log(res.data.data);
                this.commit('setItems', res.data.data);
            })
    },
        //GET vehicles
    getVehicles(){
            const axiosHeader= {
                headers: {
                    token : this.state.auth.token
                }
            }

            this.$axios.get("/vehicle",axiosHeader)
            .then(res => {
                console.log(res.data.data);
                this.commit('setVehicles', res.data.data);
            })
    },
    //filterCarParts
     filterCarParts({commit,dispatch},filtros){
         this.commit('setRFiltros',filtros);
         let filteredCarPartss = [];
         
         Object.keys(this.state.filtros).forEach((key, index) =>{
            filteredCarPartss =this.state.filteredCarParts.filter(carPart =>{

                if (filtros[key]!="null") {
                    if (carPart[key].toLowerCase() == filtros[key].toLowerCase()) {
                        return true;
                    } 
                    return false;
                } else {
                    return true;
                }
            });
             delete this.state.filtros[key];
             this.commit('setFilteredCarParts',filteredCarPartss);
             this.dispatch('filterCarParts', this.state.filtros);
          });
        //  let testType = "type";
        // let filteredCarPartss = carParts.filter(carPart => carPart[testType] == "Carrosaria");
        console.log("filteredCarParts->" + filteredCarPartss);
        //this.commit('setFilteredCarParts',filteredCarPartss);
    },

    //GET CAR PARTS
    getCarParts({commit},filterBy){

        let filterByName = filterBy.category;
        let filterByBrand = filterBy.brand;
        let filterByModel = filterBy.model;
        console.log("filterByName= " +filterByName);
            if (filterByName =="null" && filterByBrand =="null" && filterByModel =="null") {
            const axiosHeader= {
                
                headers: {
                    token : this.state.auth.token
                }
            }

            this.$axios.get("/carpart",axiosHeader)
            .then(res => {
                console.log(res.data.data);
                this.commit('setCarParts', res.data.data);
                this.commit('setFilteredCarParts',res.data.data);
            })
            } else {
                console.log("byModel-> "+filterByModel);
            const axiosHeader= {
                
                params: {type: filterByName, brand: filterByBrand, model: filterByModel},
                headers: {
                    token : this.state.auth.token
                }
            }

            this.$axios.get("/carpart",axiosHeader)
            .then(res => {
                console.log(res.data.data);
                this.commit('setCarParts', res.data.data);
                this.commit('setFilteredCarParts',res.data.data);
            })
                
            }
        },
    //GET CATEGORIES
        getCategories(){
            const axiosHeader= {
                headers: {
                    token : this.state.auth.token,
                    
                }
            }
                this.$axios.get("/category",axiosHeader)
            .then(res => {
                console.log(res.data.data);
                this.commit('setCategories', res.data.data);
            });
            
    },
    //GET MAKERS
    getCarMakers(){
        const axiosHeader= {
            headers: {
                token : this.state.auth.token,
                
            }
        }
            this.$axios.get("/carmakers",axiosHeader)
        .then(res => {
            console.log(res.data.data);
            this.commit('setCarMakers', res.data.data);
        });
        
},



    //GET TOKEN FROM LOCALSTORAGE
    readToken() {
        let auth = null;
        try {
            auth = JSON.parse(localStorage.getItem('auth'));
        } catch (error) {
            console.log(error);
        }

        //save auth
        this.commit('setAuth', auth);
    }
}