import { createApp } from 'vue';
import App from './views/App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Button from 'primevue/button';
import { Form } from '@primevue/forms';
import router from './router'; // ⬅️ Importiere den Router!
import './assets/styles/variables.css';

const app = createApp(App);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

// ✅ Router aktivieren
app.use(router);

app.component('InputText', InputText);
app.component('Message', Message);
app.component('Button', Button);
app.component('Form', Form);

app.mount('#app');



//supabase
//Tung1234
