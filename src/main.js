import { createApp } from 'vue'
import App from './views/App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import InputText from 'primevue/inputtext';
import Message from 'primevue/message';
import Button from 'primevue/button';
import { Form } from '@primevue/forms';




const app = createApp(App)
app.use(PrimeVue,{
    theme: {
        preset: Aura
    }
});
app.component('InputText', InputText);
app.component('Message', Message);
app.component('Button', Button);
app.component('Form', Form);

app.mount('#app');

//supabase
//Tung1234


import { createClient } from '@supabase/supabase-js'


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey)
console.warn(supabase.fetch())