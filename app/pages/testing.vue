<template>
    <div>
        <div class="row">
            <div class="col-xs-4">
                <card>
                    <h1>Sample Nuxt Page</h1>
                    <Doughnut :chart-data="chartData" ></Doughnut>
                </card>
            </div>
            <div class="col-xs-4">
                <card>
                    <h1>Sample Nuxt Page</h1>
                    <Doughnut :chart-data="chartData" ></Doughnut>
                </card>
            </div>  
        </div>
    </div>
</template>

<script>
import Doughnut from '@/components/Doughnut.vue';

export default {
    middleware: 'authenticated',
    components: {
        Doughnut,
    },
    computed: {
        chartData() {
            return {
                labels: this.$store.state.categorias,
                datasets: [
                    {
                        label: 'My Dataset',
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.6)',
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 206, 86, 0.6)',
                            'rgba(75, 192, 192, 0.6)',
                            'rgba(153, 102, 255, 0.6)',
                            'rgba(255, 159, 64, 0.6)',
                        ],
                    },
                ],
            };
        },
    },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
                    },
                ],
            },
        };
    },
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
