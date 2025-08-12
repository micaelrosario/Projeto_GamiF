import { onAuthStateChanged } from './access.js';

firebase.auth().onAuthStateChanged (user => {
    if (!user) {
        window.location.href = ".../.../index.html"
    }
})