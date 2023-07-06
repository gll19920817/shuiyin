import './assets/main.css'

import {LoadingPlugin} from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

import { createApp } from 'vue'
import App from './App.vue'


createApp(App).use(LoadingPlugin).mount('#app')
