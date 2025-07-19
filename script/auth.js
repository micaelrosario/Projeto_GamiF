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
const db = getDatabase(app); // NOVO: Obtém a instância do Realtime Database

// --- Referências aos elementos HTML específicos dos formulários de autenticação ---
// (Você já deve ter estes no seu auth.js, apenas confirmando)
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const registerNameInput = document.getElementById('register-name');
const googleRegisterButton = document.getElementById('google-register-button');

// Mensagem de Erro para Login e Cadastro ...
const authErrorMessageLogin = document.getElementById('auth-error-message-login'); // NOVO ID
const authErrorMessageRegister = document.getElementById('auth-error-message-register'); // NOVO ID

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

/**
 * Exibe o formulário de login e esconde o de cadastro.
 */
function showLoginForm() {
    loginForm.style.display = 'block';   // Torna o formulário de login visível
    registerForm.style.display = 'none'; // Esconde o formulário de cadastro
    // Opcional: Limpar mensagens de erro ao trocar de formulário
    // if (authErrorMessage) authErrorMessage.textContent = ''; 
}

/**
 * Exibe o formulário de cadastro e esconde o de login.
 */
function showRegisterForm() {
    loginForm.style.display = 'none';   // Esconde o formulário de login
    registerForm.style.display = 'block'; // Torna o formulário de cadastro visível
    // Opcional: Limpar mensagens de erro ao trocar de formulário
    // if (authErrorMessage) authErrorMessage.textContent = '';
}

// --- Adicionar Listeners de Eventos aos Links ---

// Adiciona listener ao link 'Cadastre-se'
if (showRegisterLink) { // Verifica se o elemento existe antes de adicionar o listener
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link (evita que a página recarregue ou role)
        showRegisterForm(); // Chama a função para mostrar o formulário de cadastro
    });
}

// Adiciona listener ao link 'Faça Login'
if (showLoginLink) { // Verifica se o elemento existe antes de adicionar o listener
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link
        showLoginForm();    // Chama a função para mostrar o formulário de login
    });
}

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