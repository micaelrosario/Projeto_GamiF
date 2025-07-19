// script/auth.js - Lógica de Autenticação e Cadastro

// ... (Seu código de importação do Firebase e inicialização, e as const de DOMElements) 
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup,
    onAuthStateChanged,
    updateProfile // NOVO: Para atualizar o nome do usuário no Firebase Auth
} from "firebase/auth";

// NOVO: Importações para o Realtime Database
import { getDatabase, ref, set, child, get } from "firebase/database"; 

// TODO: SUBSTITUA PELAS SUAS CONFIGURAÇÕES DO FIREBASE!
const firebaseConfig = {
    apiKey: "SUA_API_KEY",
    authDomain: "SEU_AUTH_DOMAIN",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_STORAGE_BUCKET",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Obtém o serviço de autenticação
const db = getDatabase(app); // Obtém a instância do Realtime Database

// --- Referências aos elementos HTML específicos dos formulários de autenticação ---
// Formulário de Login
const loginEmailInput = document.getElementById('login-email'); // Corrigir ID no HTML
const loginPasswordInput = document.getElementById('login-password'); // Corrigir ID no HTML
const loginButton = document.getElementById('login-button'); // Botão de Entrar do Login
const googleLoginButton = document.getElementById('google-login-button'); // Botão Google do Login

// Formulário de Cadastro
const registerNameInput = document.getElementById('register-name');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');
const registerButton = document.getElementById('register-button'); // Adicionar ID ao botão de cadastro no HTML
// const googleRegisterButton = document.getElementById('google-register-button'); // Este botão não existe no HTML que você enviou para o formulário de cadastro. Se quiser, adicione-o.

// Mensagens de Erro
const authErrorMessageLogin = document.getElementById('auth-error-message-login');
const authErrorMessageRegister = document.getElementById('auth-error-message-register');

// --- CORREÇÃO: Adicionar as declarações showRegisterLink e showLoginLink ---
const showRegisterLink = document.getElementById('show-register'); 
const showLoginLink = document.getElementById('show-login'); 

// --- Funções de Utilitário da UI (ATUALIZADAS) ---

// A função displayError agora precisa saber em qual formulário exibir a mensagem
function displayError(message, formType = 'login') { // 'formType' pode ser 'login' ou 'register'
    if (formType === 'login') {
        authErrorMessageLogin.textContent = message;
        authErrorMessageRegister.textContent = ''; // Limpa a outra mensagem
    } else if (formType === 'register') {
        authErrorMessageRegister.textContent = message;
        authErrorMessageLogin.textContent = ''; // Limpa a outra mensagem
    }
}

// --- Funções para alternar a visibilidade dos formulários ---

// Função para mostrar um formulário e esconder o outro
function showForm(formToShow) {
    if (formToShow === 'login') {
        loginForm.style.display = 'block'; // Mostra o formulário de login
        registerForm.style.display = 'none'; // Esconde o formulário de registro
    } else if (formToShow === 'register') {
        registerForm.style.display = 'block'; // Mostra o formulário de registro
        loginForm.style.display = 'none'; // Esconde o formulário de login
    }
}

// --- Adicionar Listeners de Eventos aos Links ---

// Adiciona listener ao link 'Cadastre-se'
if (showRegisterLink) { // Verifica se o elemento existe antes de adicionar o listener
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link (evita que a página recarregue ou role)
        showForm('register')
    });
}

// Adiciona listener ao link 'Faça Login'
if (showLoginLink) { // Verifica se o elemento existe antes de adicionar o listener
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link
        showForm('login');    // Chama a função para mostrar o formulário de login
    });
}

// Opcional: Mostrar o formulário de login por padrão ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    showForm('login');
});

// --- Funções de Autenticação (ATUALIZADAS para usar o novo displayError) ---

async function handleLogin() {
    const email = loginEmailInput.value;
    const password = loginPasswordInput.value;

    try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = 'index.html'; 
    } catch (error) {
        let errorMessage = "Erro ao fazer login. Tente novamente.";
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = "E-mail ou senha inválidos.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Formato de e-mail inválido.";
        }
        displayError(errorMessage, 'login'); // Passe 'login' como segundo argumento
        console.error("Erro de login:", error);
    }
}

async function handleRegister() {
    const name = registerNameInput.value;
    const email = registerEmailInput.value;
    const password = registerPasswordInput.value;

    
    if (password.length < 6) {
        displayError("A senha deve ter no mínimo 6 caracteres.", 'register'); // Passe 'register'
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        window.location.href = 'index.html'; 
    } catch (error) {
        let errorMessage = "Erro ao cadastrar. Tente novamente.";
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Este e-mail já está em uso.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "A senha é muito fraca.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Formato de e-mail inválido.";
        }
        displayError(errorMessage, 'register'); // Passe 'register'
        console.error("Erro de cadastro:", error);
    }
}

async function handleGoogleLogin() {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        window.location.href = 'index.html';
    } catch (error) {
        let errorMessage = "Erro ao fazer login com Google.";
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = "Login cancelado pelo usuário.";
        }
        displayError(errorMessage, 'login'); // Passe 'login' para erros do Google
        console.error("Erro de login Google:", error);
    }
}