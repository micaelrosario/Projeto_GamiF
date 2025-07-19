// script/auth.js - Lógica de Autenticação e Cadastro para GamiF

// Importações do Firebase SDK
import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup,
    onAuthStateChanged, // Para observar o estado de autenticação (usuário logado/deslogado)
    updateProfile // Para atualizar o nome do usuário no Firebase Auth
} from "firebase/auth";

// Importações para o Firebase Realtime Database (se for usar para perfis de usuário, por exemplo)
import { getDatabase, ref, set, child, get } from "firebase/database"; 

// --- CONFIGURAÇÕES DO FIREBASE ---
// IMPORTANTE: Substitua estes valores pelas suas configurações reais do Firebase!
// Você pode encontrá-las no Console do Firebase > Configurações do projeto > Seus apps > Web app
const firebaseConfig = {
    apiKey: "SUA_API_KEY", // Ex: "AIzaSyC_YOUR_API_KEY"
    authDomain: "SEU_AUTH_DOMAIN", // Ex: "your-project-id.firebaseapp.com"
    projectId: "SEU_PROJECT_ID", // Ex: "your-project-id"
    storageBucket: "SEU_STORAGE_BUCKET", // Ex: "your-project-id.appspot.com"
    messagingSenderId: "SEU_MESSAGING_SENDER_ID", // Ex: "1234567890"
    appId: "SEU_APP_ID", // Ex: "1:234567890:web:abcdef1234567890abcdef"
    databaseURL: "SUA_DATABASE_URL" // Ex: "https://your-project-id-default-rtdb.firebaseio.com" (se usar Realtime Database)
};

// Inicializa o Firebase com as configurações
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Obtém a instância do serviço de autenticação
const db = getDatabase(app); // Obtém a instância do Realtime Database

// --- REFERÊNCIAS AOS ELEMENTOS HTML ---
// Obtenha todos os elementos do DOM que você precisará manipular ou interagir.
// É crucial que os IDs no HTML correspondam EXATAMENTE a estes aqui.

// Containers dos Formulários
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Inputs do Formulário de Login
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');

// Botões do Formulário de Login
const loginButton = document.getElementById('login-button');
const googleLoginButton = document.getElementById('google-login-button');

// Inputs do Formulário de Cadastro
const registerNameInput = document.getElementById('register-name');
const registerEmailInput = document.getElementById('register-email');
const registerPasswordInput = document.getElementById('register-password');

// Botão do Formulário de Cadastro
const registerButton = document.getElementById('register-button');

// Mensagens de Erro
const authErrorMessageLogin = document.getElementById('auth-error-message-login');
const authErrorMessageRegister = document.getElementById('auth-error-message-register');

// Links para Alternar Formulários
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

// --- FUNÇÕES DE UTILIDADE DA UI ---

/**
 * Exibe uma mensagem de erro em um formulário específico.
 * @param {string} message - A mensagem de erro a ser exibida.
 * @param {'login' | 'register'} formType - O tipo de formulário ('login' ou 'register').
 */
function displayError(message, formType = 'login') {
    if (formType === 'login' && authErrorMessageLogin) {
        authErrorMessageLogin.textContent = message;
        // Limpa a mensagem do outro formulário para evitar confusão
        if (authErrorMessageRegister) authErrorMessageRegister.textContent = '';
    } else if (formType === 'register' && authErrorMessageRegister) {
        authErrorMessageRegister.textContent = message;
        // Limpa a mensagem do outro formulário
        if (authErrorMessageLogin) authErrorMessageLogin.textContent = '';
    }
}

/**
 * Alterna a visibilidade entre os formulários de login e cadastro.
*/
function showLoginForm(){
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
}

function showRegisterForm(){
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
}

// --- FUNÇÕES DE AUTENTICAÇÃO ---

/**
 * Lida com o processo de login via e-mail e senha.
 */
async function handleLogin() {
    // Garante que os inputs existam antes de tentar acessar seus valores
    const email = loginEmailInput ? loginEmailInput.value : '';
    const password = loginPasswordInput ? loginPasswordInput.value : '';

    displayError('', 'login'); // Limpa erros anteriores

    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Redireciona para a página principal após login bem-sucedido
        window.location.href = 'index.html'; 
    } catch (error) {
        let errorMessage = "Erro ao fazer login. Tente novamente.";
        // Mensagens de erro mais amigáveis para o usuário
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = "E-mail ou senha inválidos.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Formato de e-mail inválido.";
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = "Muitas tentativas de login. Tente novamente mais tarde.";
        }
        displayError(errorMessage, 'login');
        console.error("Erro de login:", error); // Log detalhado para depuração
    }
}

/**
 * Lida com o processo de cadastro de novo usuário via e-mail e senha.
 */
async function handleRegister() {
    // Garante que os inputs existam antes de tentar acessar seus valores
    const name = registerNameInput ? registerNameInput.value : '';
    const email = registerEmailInput ? registerEmailInput.value : '';
    const password = registerPasswordInput ? registerPasswordInput.value : '';

    displayError('', 'register'); // Limpa erros anteriores

    // Validação básica da senha
    if (password.length < 6) {
        displayError("A senha deve ter no mínimo 6 caracteres.", 'register');
        return; // Interrompe a função se a senha for muito curta
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Atualiza o perfil do usuário no Firebase Auth com o nome fornecido
        await updateProfile(user, {
            displayName: name
        });

        // Opcional: Salvar informações adicionais do usuário no Realtime Database
        // Isso é útil se você precisar de outros dados do usuário além do que o Auth oferece.
        // Certifique-se de ter as regras de segurança do Realtime Database configuradas!
        // await set(ref(db, 'users/' + user.uid), {
        //     username: name,
        //     email: email,
        //     createdAt: new Date().toISOString() // Exemplo de dado adicional
        // });

        // Redireciona para a página principal após o cadastro bem-sucedido
        window.location.href = 'index.html'; 
    } catch (error) {
        let errorMessage = "Erro ao cadastrar. Tente novamente.";
        // Mensagens de erro mais amigáveis para o usuário
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Este e-mail já está em uso.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "A senha é muito fraca.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Formato de e-mail inválido.";
        }
        displayError(errorMessage, 'register');
        console.error("Erro de cadastro:", error); // Log detalhado para depuração
    }
}

/**
 * Lida com o processo de login/cadastro via Google.
 */
async function handleGoogleAuth() { // Renomeado para ser mais genérico para login/cadastro Google
    const provider = new GoogleAuthProvider();
    displayError('', 'login'); // Limpa erros anteriores

    try {
        await signInWithPopup(auth, provider);
        // Redireciona para a página principal após login/cadastro Google bem-sucedido
        window.location.href = 'index.html';
    } catch (error) {
        let errorMessage = "Erro ao autenticar com Google.";
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = "Autenticação cancelada pelo usuário.";
        } else if (error.code === 'auth/cancelled-popup-request') {
            errorMessage = "Requisição de pop-up cancelada.";
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = "Autenticação Google não habilitada no Firebase.";
        }
        displayError(errorMessage, 'login'); // Exibe erro no formulário de login
        console.error("Erro de autenticação Google:", error); // Log detalhado para depuração
    }
}

// --- ADICIONAR LISTENERS DE EVENTOS ---
// Estes listeners conectam os botões e links do HTML às funções JavaScript.

/* Listener para o botão de Login por E-mail/Senha
if (loginButton) {
    loginButton.addEventListener('click', async (e) => {
        e.preventDefault(); // Previne o envio padrão do formulário HTML
        await handleLogin();
    });
}

// Listener para o botão de Cadastro por E-mail/Senha
if (registerButton) {
    registerButton.addEventListener('click', async (e) => {
        e.preventDefault(); // Previne o envio padrão do formulário HTML
        await handleRegister();
    });
}

// Listener para o botão de Login/Cadastro com Google (no formulário de Login)
if (googleLoginButton) {
    googleLoginButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await handleGoogleAuth();
    });
}
*/
// Listener para o botão de Login/Cadastro com Google (no formulário de Cadastro)
// Se você tiver um botão Google separado para o formulário de cadastro, adicione um ID único a ele no HTML
// e adicione um listener aqui. Por enquanto, ambos os botões Google chamam a mesma função.
const googleRegisterButton = document.getElementById('google-register-button'); // Certifique-se de que este ID existe no seu HTML
if (googleRegisterButton) {
    googleRegisterButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await handleGoogleAuth();
    });
}

// Listener para o link "CRIAR CONTA" (para mostrar o formulário de cadastro)
if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link (#)
        showRegisterForm() // Chama a função para mostrar o formulário de cadastro
    });
}

// Listener para o link "ENTRAR" (para mostrar o formulário de login)
if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link (#)
        showForm('login'); // Chama a função para mostrar o formulário de login
    });
}

// --- COMPORTAMENTO INICIAL AO CARREGAR A PÁGINA ---
// Garante que o formulário de login seja exibido por padrão quando auth.html é carregado.
document.addEventListener('DOMContentLoaded', () => {
    showForm('login');
});

// --- VERIFICAÇÃO DE ESTADO DE AUTENTICAÇÃO (Opcional, mas útil) ---
// Se o usuário já estiver logado ao acessar auth.html, redireciona-o para index.html
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuário está logado, redireciona para a página principal
        console.log("Usuário já logado:", user.uid);
        window.location.href = 'index.html';
    } else {
        // Usuário não está logado, permanece na página de autenticação
        console.log("Nenhum usuário logado.");
    }
});
