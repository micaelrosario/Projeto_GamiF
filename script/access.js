// access.js - Lógica de Autenticação e Alternância entre Login/Cadastro para GamiF

// --- Importações do Firebase SDK ---
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


// Importa todas as funções necessárias do Firebase Authentication em uma única linha
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider,     // Para autenticação Google
    signInWithPopup,        // Para autenticação Google
    onAuthStateChanged,     // Para observar o estado de autenticação do usuário
    sendPasswordResetEmail,
    updateProfile           // Para atualizar o perfil do usuário (ex: nome)
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js"; 


// Importa as funções necessárias do Firebase Realtime Database em uma única linha
import { 
    getDatabase, // Para obter a instância do Realtime Database
    ref,         // Para criar referências a locais no banco de dados
    set          // Para salvar dados no banco de dados
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-database.js";


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

// Inicializa o Firebase com as configurações
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// --- REFERÊNCIAS AOS ELEMENTOS HTML ---
// É crucial que os IDs no seu HTML (acesso.html) correspondam EXATAMENTE a estes aqui.

// Containers dos Formulários
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Botões do Formulário de Login
const loginButton = document.getElementById('login-button');
const googleLoginButton = document.getElementById('google-login-button');

const registerButton = document.getElementById('register-button'); // Descomentado
const googleRegisterButton = document.getElementById('google-register-button');

const showForgotPasswordLink = document.getElementById('forgot-password');

const loginEmailInput = document.getElementById('login-email').value;
const loginPasswordInput = document.getElementById('login-password').value;

const registerNameInput = document.getElementById('register-name').value;
const registerEmailInput = document.getElementById('register-email').value;
const registerPasswordInput = document.getElementById('register-password').value;

// Links para Alternar Formulários
const showRegisterLink = document.getElementById('show-register'); // Descomentado
const showLoginLink = document.getElementById('show-login'); // Descomentado

const authErrorMessageLogin = document.getElementById('auth-error-message-login');
const authErrorMessageRegister = document.getElementById('auth-error-message-register');
const authErrorMessageForgotPassword = document.getElementById('auth-error-message-forgot-password');

const loadingOverlay = document.getElementById('loading-overlay');
const loadingMessage = loadingOverlay ? loadingOverlay.querySelector('.loading-message') : null;

const themeSelect = document.getElementById('theme-select');

function clearFormInputs(formType) {
    if (formType === 'login') {
        if (loginEmailInput) loginEmailInput.value = '';
        if (loginPasswordInput) loginPasswordInput.value = '';
    } else if (formType === 'register') {
        if (registerNameInput) registerNameInput.value = '';
        if (registerEmailInput) registerEmailInput.value = '';
        if (registerPasswordInput) registerPasswordInput.value = '';
    }
}

function toggleLoadingOverlay(show, message = "Acessando sistema...") {
    if (loadingOverlay) {
        loadingOverlay.style.display = show ? 'flex' : 'none'; 
        if (loadingMessage) {
            loadingMessage.textContent = message;
        }
    }
}


function displayError(message, formType = 'login') {
    if (formType === 'login' && authErrorMessageLogin) {
        authErrorMessageLogin.textContent = message;
        if (authErrorMessageRegister) authErrorMessageRegister.textContent = ''; 
    } else if (formType === 'register' && authErrorMessageRegister) {
        authErrorMessageRegister.textContent = message;
        if (authErrorMessageLogin) authErrorMessageLogin.textContent = ''; 
    } else if (formType === 'forgot-password' && authErrorMessageForgotPassword) { 
        authErrorMessageForgotPassword.textContent = message;
    }
}


async function handleGoogleAuth() { 
    const provider = new GoogleAuthProvider();
    displayError('', 'login'); // Limpa erros anteriores (exibe no formulário de login)

    try {
        const userCredential = await signInWithPopup(auth, provider); 
        const user = userCredential.user;

        await set(ref(db, 'users/' + user.uid), {
            username: user.displayName || 'Usuário Google', // Pega o nome do Google, ou um padrão
            email: user.email || '', // Pega o e-mail do Google
            createdAt: new Date().toISOString(),
            level: 1, 
            score: 0,
            quizzesCompleted: {} 
        });

        console.log("Autenticação Google bem-sucedida!");
        window.location.href = 'home.html';
    } catch (error) {
        let errorMessage = "Erro ao autenticar com Google.";
        if (error.code === 'auth/popup-closed-by-user') {
            errorMessage = "Autenticação cancelada pelo usuário.";
        } else if (error.code === 'auth/cancelled-popup-request') {
            errorMessage = "Requisição de pop-up cancelada.";
        } else if (error.code === 'auth/operation-not-allowed') {
            errorMessage = "Autenticação Google não habilitada no Firebase.";
        }
        displayError(errorMessage, 'login'); 
        console.error("Erro de autenticação Google:", error);
    }
}

async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    displayError('', 'login'); 

    if (!email || !password) {
        toggleLoadingOverlay(false);
        displayError("Por favor, preencha todos os campos.", 'login');
        // Não limpa os campos aqui para que o usuário veja o que falta
        return; 
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password); 
        const user = userCredential.user; 

        console.log("Login bem-sucedido!", user); 
        clearFormInputs('login'); 
        window.location.href = 'home.html'; 
        
    } catch (error) {

        let errorMessage = "Erro ao fazer login. Tente novamente.";

        // CORREÇÃO AQUI: Adicionando a condição específica para 'auth/user-not-found'
        if (error.code === 'auth/user-not-found') {
            errorMessage = "Esta conta não existe. Tente criá-la.";
        } else if (error.code === 'auth/wrong-password') { // <--- Esta condição pode não ser atingida se 'invalid-credential' for sempre retornado
            errorMessage = "Senha incorreta."; 
        } else if (error.code === 'auth/invalid-credential') { // <--- Este é o seu "coringa" para credenciais inválidas
            errorMessage = "E-mail ou senha inválidos."; // Ou "Credenciais inválidas."
        } else {
            errorMessage = `Erro do Firebase: ${error.message}`;
        }
        displayError(errorMessage, 'login'); 
        clearFormInputs('login'); 
    }
}

async function handleRegister() {
    // Inputs do Formulário de Cadastro
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value.trim();

    if (!name) { 
        displayError("Por favor, digite seu nome.", 'register');
        clearFormInputs('register'); 
        return; 
    }

    if (!email) { 
        displayError("Por favor, digite seu email.", 'register');
        clearFormInputs('register'); 
        return; 
    }

    if (password.length < 6) {
        displayError("A senha deve ter no mínimo 6 caracteres.", 'register');
        clearFormInputs('register');
        return; 
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password); 
        const user = userCredential.user; // O objeto user contém o user.uid

        await updateProfile(user, {
            displayName: name
        });

        
        await set(ref(db, 'users/' + user.uid), {
            username: name,
            email: email,
            createdAt: new Date().toISOString(), 
            level: 1, 
            score: 0, 
            quizzesCompleted: {} 
        });

        console.log("Cadastro bem-sucedido!", user);
        clearFormInputs('register');
        window.location.href = 'home.html'; 
    } catch (error) {
        let errorMessage = "Erro ao cadastrar. Tente novamente.";
        // Agora, essas condições devem ser atingidas se o Firebase retornar esses erros específicos.
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "Este e-mail já está em uso.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "A senha é muito fraca.";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "Formato de e-mail inválido.";
        } else {
            // Caso seja um erro diferente dos esperados, mostra o erro genérico do Firebase.
            errorMessage = `Erro do Firebase: ${error.message}`;
        }
        displayError(errorMessage, 'register');
        clearFormInputs('register');
    }
}

async function handleForgotPassword() { // Esta é a função que você procura
    const email = document.getElementById('login-email').value.trim();

    displayError('', 'forgot-password'); // Limpa erros anteriores
    //toggleLoadingOverlay(true, "Enviando link de redefinição..."); // Mostra o loading

    if (!email) { // Validação local: verifica se o e-mail foi digitado
        displayError("Por favor, digite seu e-mail.", 'forgot-password');
        return;
    }

    try {
        // *** Esta é a linha que se conecta ao Firebase para enviar o e-mail de redefinição ***
        await sendPasswordResetEmail(auth, email); 
        // Mensagem de sucesso (intencionalmente vaga por segurança do Firebase)
        alert("Se um e-mail válido for encontrado, um link de redefinição foi enviado para " + email + ". Verifique sua caixa de entrada e spam.");
        clearFormInputs('forgot-password'); // Limpa o campo após o envio
    } catch (error) {
        let errorMessage = "Erro ao enviar o link de redefinição. Tente novamente.";
        // Tratamento de erros específicos do Firebase
        if (error.code === 'auth/invalid-email') {
            errorMessage = "Formato de e-mail inválido.";
        } else if (error.code === 'auth/user-not-found') {
             // Embora o Firebase seja vago, se ele retornar user-not-found, podemos ser mais específicos.
             errorMessage = "Nenhuma conta encontrada com este e-mail. Verifique o e-mail ou crie uma nova conta.";
        } else if (error.code === 'auth/too-many-requests') {
            errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
        }
        displayError(errorMessage, 'forgot-password');
        console.error("Erro ao redefinir senha:", error);
    }
}



// --- ADICIONAR LISTENERS DE EVENTOS ---
if (loginButton) {
    loginButton.addEventListener('click', async (e) => { // A função interna precisa ser 'async'
        e.preventDefault(); // Previne o envio padrão do formulário HTML
        await handleLogin(); 
    });
}

if (registerButton) {
    registerButton.addEventListener('click', async (e) => { // A função interna precisa ser 'async'
        e.preventDefault(); // Previne o envio padrão do formulário HTML
        await handleRegister(); 
    });
}

if (showForgotPasswordLink) {
    showForgotPasswordLink.addEventListener('click', async (e) => {
        e.preventDefault();
        await handleForgotPassword();
    });
} else {
    console.warn("Elemento com ID 'show-forgot-password' não encontrado no DOM.");
}

if (googleLoginButton) {
    googleLoginButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await handleGoogleAuth();
    });
} else {
    console.warn("Elemento com ID 'google-login-button' não encontrado no DOM.");
}

if (googleRegisterButton) {
    googleRegisterButton.addEventListener('click', async (e) => {
        e.preventDefault();
        await handleGoogleAuth();
    });
} else {
    console.warn("Elemento com ID 'google-register-button' não encontrado no DOM.");
}

function showContent(formToShow) {
    // Garante que os elementos existam antes de tentar manipulá-los
    if (loginForm && registerForm) {
        if (formToShow === 'login') {
            loginForm.style.display = 'block';   // Mostra o formulário de login
            registerForm.style.display = 'none'; // Esconde o formulário de registro
            clearFormInputs('register');
        } else if (formToShow === 'register') {
            registerForm.style.display = 'block';   // Mostra o formulário de registro
            loginForm.style.display = 'none'; // Esconde o formulário de login
            clearFormInputs('login');
        }
    } else {
        console.error("Erro: Elementos de formulário (login-form ou register-form) não encontrados no DOM.");
    }
}

if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        showContent('register'); 
    });
}

if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault(); 
        showContent('login'); 
    });
}


function applyTheme(theme) {
    const htmlElement = document.documentElement; // Referência à tag <html>
    if (htmlElement) {
        let actualTheme = theme;
        if (theme === 'system') {
            // Verifica a preferência do sistema operacional
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            actualTheme = prefersDark ? 'dark' : 'light';
        }
        
        htmlElement.setAttribute('data-bs-theme', actualTheme);
        localStorage.setItem('themePreference', theme); // Salva a preferência original ('system', 'light', 'dark')

        // Atualiza o seletor para refletir o tema atual
        if (themeSelect) {
            themeSelect.value = theme;
        }
        console.log(`Tema aplicado: ${actualTheme} (preferência: ${theme})`);
    }
}

// Listener para o seletor de tema
if (themeSelect) {
    themeSelect.addEventListener('change', () => {
        const selectedTheme = themeSelect.value;
        applyTheme(selectedTheme);
    });
} else {
    console.warn("Elemento 'theme-select' não encontrado no DOM.");
}

// Carrega o tema preferido do localStorage ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('themePreference');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Se não houver preferência salva, usa o tema do sistema como padrão
        applyTheme('system');
    }
});