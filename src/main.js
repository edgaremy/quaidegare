import './app.css'
import './theme.css'
import { mount } from 'svelte'
import App from './App.svelte'

// NOTE: window._nativeReplaceState is captured in index.html's inline <script>
// before this module (and the router patch) loads. Do not move it here.

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app
