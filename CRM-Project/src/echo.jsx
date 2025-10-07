// src/echo.js
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const PUSHER_KEY = import.meta.env.VITE_PUSHER_KEY
const PUSHER_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER || 'mt1';

window.Pusher = Pusher; 
const tokenString = localStorage.getItem("token");
let token = null;

if (tokenString) {
  try {
    const tokenData = JSON.parse(tokenString);
    token = tokenData.token; // assuming your structure is { token: "abc123", ... }
  } catch (e) {
    console.error("Failed to parse token from localStorage:", e);
  }
} else {
  console.warn("No token found in localStorage.");
}

const echo = new Echo({
  broadcaster: 'pusher',
  key: PUSHER_KEY,        // e.g., "local-websockets-key"
  cluster: PUSHER_CLUSTER,  // required by Pusher client
  wsHost: window.location.hostname,
  wsPort: 6001,
  forceTLS: false,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
  // authEndpoint: 'https://chat.nexgenov8.com/broadcasting/auth',
  // auth: {
  //   headers: {
  //     Authorization: `Bearer ${token}`, // ✅ Important for auth middleware
  //   },
  // },
});

export default echo;