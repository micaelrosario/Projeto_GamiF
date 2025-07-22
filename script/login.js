// access.js - Lógica de Autenticação e Alternância entre Login/Cadastro para GamiF

// --- Importações do Firebase SDK ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA1ILKkaRw-x091E4oUsZtJpRVg9cQQshE",
    authDomain: "projeto-gamif.firebaseapp.com",
    databaseURL: "https://projeto-gamif-default-rtdb.firebaseio.com",
    projectId: "projeto-gamif",
    storageBucket: "projeto-gamif.firebasestorage.app",
    messagingSenderId: "249783252827",
    appId: "1:249783252827:web:f31c96dcd227368f3ccc7e"
};

// Importações para o Firebase Realtime Database
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"; 

// Inicializa o Firebase com as configurações
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// --- REFERÊNCIAS AOS ELEMENTOS HTML ---
// É crucial que os IDs no seu HTML (acesso.html) correspondam EXATAMENTE a estes aqui.

// Containers dos Formulários
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Botões do Formulário de Login
const loginButton = document.getElementById('login-button');
const googleLoginButton = document.getElementById('google-login-button');

// Mensagens de Erro (certifique-se de que estes IDs existam nos seus <p> de erro no HTML)
const authErrorMessageLogin = document.getElementById('auth-error-message-login');
const authErrorMessageRegister = document.getElementById('auth-error-message-register');

// Botão fazendo login com sucesso!
loginButton.addEventListener("click", function(event){
    event.preventDefault()
    // Inputs do Formulário de Login
    const loginEmailInput = document.getElementById('login-email').value;
    const loginPasswordInput = document.getElementById('login-password').value;
    // Mensagens de Erro (certifique-se de que estes IDs existam nos seus <p> de erro no HTML)
    const authErrorMessageLogin = document.getElementById('auth-error-message-login');
    const authErrorMessageRegister = document.getElementById('auth-error-message-register');
    signInWithEmailAndPassword(auth, loginEmailInput, loginPasswordInput)
    .then((userCredential) => {
        const user = userCredential.user;
        alert("Access Account...")
        window.location.href = "index.html"
        //
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
    })
}) 