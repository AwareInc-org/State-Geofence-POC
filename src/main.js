import { createApp } from 'vue';
import App from './App.vue';
import 'primevue/resources/themes/saga-blue/theme.css';    
import 'primevue/resources/primevue.min.css';             
import 'primeicons/primeicons.css';                       

const app = createApp(App);

// If you want to set global configurations (similar to Vue.config in Vue 2)
app.config.productionTip = false;

app.mount('#app');
