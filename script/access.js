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

const emailVerificationMessage = document.getElementById('email-verification-message');
const resendVerificationEmailButton = document.getElementById('resend-verification-email-button');

// Variável para controlar o tempo de início do carregamento
let loadingStartTime = 0;
const MIN_LOADING_DURATION = 5000; // 5 segundos em milissegundos

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

function toggleLoadingOverlay(show, message = "LOADING...") { 
    return new Promise(resolve => { // Retorna uma Promise
        console.log(`toggleLoadingOverlay: ${show ? 'Mostrando' : 'Escondendo'} com mensagem: "${message}"`);
        if (loadingOverlay) {
            if (show) {
                loadingOverlay.classList.remove('hidden'); 
                loadingOverlay.style.display = 'flex'; // Garante que esteja visível
                loadingStartTime = Date.now(); // Registra o tempo de início do carregamento
                if (loadingMessage) {
                    loadingMessage.textContent = message;
                }
                resolve(); // Resolve imediatamente ao mostrar
            } else {
                const elapsedTime = Date.now() - loadingStartTime;
                const remainingTime = MIN_LOADING_DURATION - elapsedTime;
                const delay = Math.max(0, remainingTime); // Garante que o delay não seja negativo

                // A lógica de 'immediate' foi removida. O overlay sempre aguardará o 'delay'.
                loadingOverlay.classList.add('hidden'); 
                if (loadingMessage) {
                    loadingMessage.textContent = message; // Atualiza mensagem antes de esconder
                }
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                    resolve(); // Resolve após o atraso
                }, delay); 
            }
        } else {
            console.warn("Elemento 'loading-overlay' não encontrado.");
            resolve(); // Resolve mesmo se o elemento não for encontrado
        }
    });
}

function displayEmailVerificationMessage(message, isError = false) {
    if (emailVerificationMessage) {
        emailVerificationMessage.textContent = message;
        if (isError) {
            emailVerificationMessage.classList.remove('text-info');
            emailVerificationMessage.classList.add('text-danger');
        } else {
            emailVerificationMessage.classList.remove('text-danger');
            emailVerificationMessage.classList.add('text-info');
        }
    }
    if (resendVerificationEmailButton) {
        resendVerificationEmailButton.style.display = isError ? 'block' : 'none';
    }
}

function displayError(message, formType = 'login') {
    if (formType === 'login' && authErrorMessageLogin) {
        authErrorMessageLogin.textContent = message;
        if (authErrorMessageRegister) authErrorMessageRegister.textContent = ''; 
        if (authErrorMessageForgotPassword) authErrorMessageForgotPassword.textContent = ''; 
    } else if (formType === 'register' && authErrorMessageRegister) {
        authErrorMessageRegister.textContent = message;
        if (authErrorMessageLogin) authErrorMessageLogin.textContent = ''; 
        if (authErrorMessageForgotPassword) authErrorMessageForgotPassword.textContent = ''; 
    } else if (formType === 'forgot-password' && authErrorMessageForgotPassword) { 
        authErrorMessageForgotPassword.textContent = message;
        if (authErrorMessageLogin) authErrorMessageLogin.textContent = ''; 
        if (authErrorMessageRegister) authErrorMessageRegister.textContent = ''; 
    }
}


async function handleGoogleAuth() { 
    const provider = new GoogleAuthProvider();
    displayError('', 'login'); // Limpa erros anteriores (exibe no formulário de login)
    await toggleLoadingOverlay(true, "Autenticando com Google...");

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
        await toggleLoadingOverlay(false, "Autenticando com Google...");
        window.location.href = 'home.html';
    } catch (error) {
        await toggleLoadingOverlay(false);
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
    await toggleLoadingOverlay(true, "Carregando...");

    if (!email || !password) {
        await toggleLoadingOverlay(false);
        displayError("Por favor, preencha todos os campos.", 'login');
        // Não limpa os campos aqui para que o usuário veja o que falta
        return; 
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        await toggleLoadingOverlay(false);
        displayError("Formato de e-mail inválido.", 'login');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password); 
        const user = userCredential.user; 

        if (!user.emailVerified) {
            await toggleLoadingOverlay(false);
            await signOut(auth); 
            displayEmailVerificationMessage("Seu e-mail não foi verificado. Por favor, verifique sua caixa de entrada (e spam) ou clique em 'Reenviar E-mail de Verificação'.", true);
            console.warn("Login bloqueado: E-mail não verificado.");
            return; 
        }

        console.log("Login bem-sucedido!", user); 
        clearFormInputs('login'); 
        await toggleLoadingOverlay(false, "Carregando..."); 
        window.location.href = 'home.html'; 
        
    } catch (error) {
        await toggleLoadingOverlay(false);
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

    displayError('', 'register'); 
    await toggleLoadingOverlay(true, "Criando sua conta..."); 

    if (!name || !email || !password) { 
        await toggleLoadingOverlay(false); 
        displayError("Por favor, preencha todos os campos.", 'register');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        await toggleLoadingOverlay(false); 
        displayError("Formato de e-mail inválido.", 'register');
        return;
    }

    if (password.length < 6) {
        await toggleLoadingOverlay(false); 
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
        await toggleLoadingOverlay(false); 
        window.location.href = 'home.html'; 
        displayEmailVerificationMessage("Sua conta foi criada! Um e-mail de verificação foi enviado para " + email + ". Por favor, verifique sua caixa de entrada (e spam).");

    } catch (error) {
        await toggleLoadingOverlay(false);
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
    await toggleLoadingOverlay(true, "Enviando link de redefinição...");

    if (!email) { // Validação local: verifica se o e-mail foi digitado
        await toggleLoadingOverlay(false);
        displayError("Por favor, digite seu e-mail.", 'forgot-password');
        clearFormInputs('login'); 
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        await toggleLoadingOverlay(false); // AGUARDA O OVERLAY DESAPARECER
        displayError("Formato de e-mail inválido.", 'forgot-password');
        return;
    }

    try {
        // *** Esta é a linha que se conecta ao Firebase para enviar o e-mail de redefinição ***
        await sendPasswordResetEmail(auth, email); 
        await toggleLoadingOverlay(false);
        // Mensagem de sucesso (intencionalmente vaga por segurança do Firebase)
        alert("Se um e-mail válido for encontrado, um link de redefinição foi enviado para " + email + ". Verifique sua caixa de entrada e spam.");
        clearFormInputs('login'); // Limpa o campo após o envio
    } catch (error) {
        await toggleLoadingOverlay(false);
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
        clearFormInputs('login');
    }
}

async function handleResendVerificationEmail() {
    const user = auth.currentUser;
    if (user) {
        await toggleLoadingOverlay(true, "Reenviando e-mail de verificação..."); // AGUARDA O OVERLAY APARECER
        displayEmailVerificationMessage(''); 
        try {
            await sendEmailVerification(user);
            await toggleLoadingOverlay(false); // AGUARDA O OVERLAY DESAPARECER
            displayEmailVerificationMessage("E-mail de verificação reenviado para " + user.email + ". Por favor, verifique sua caixa de entrada (e spam).");
            console.log("E-mail de verificação reenviado.");
        } catch (error) {
            await toggleLoadingOverlay(false); // AGUARDA O OVERLAY DESAPARECER
            displayEmailVerificationMessage("Erro ao reenviar e-mail de verificação: " + error.message, true);
            console.error("Erro ao reenviar e-mail de verificação:", error);
        }
    } else {
        displayEmailVerificationMessage("Nenhum usuário logado para reenviar o e-mail de verificação.", true);
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

if (resendVerificationEmailButton) { 
    resendVerificationEmailButton.addEventListener('click', async () => {
        await handleResendVerificationEmail();
    });
} else {
    console.warn("Elemento com ID 'resend-verification-email-button' não encontrado no DOM.");
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

// --- COMPORTAMENTO INICIAL AO CARREGAR A PÁGINA ---
// Mostra o loading ao iniciar e aguarda o tempo mínimo antes de esconder
document.addEventListener('DOMContentLoaded', async () => {
    await toggleLoadingOverlay(false, "Carregando..."); 
    // Após o carregamento inicial, verifica o estado de autenticação
    onAuthStateChanged(auth, async (user) => { // onAuthStateChanged também precisa ser async
        console.log("onAuthStateChanged disparado. Usuário:", user ? user.uid : "Nenhum");
        if (user) {
            console.log("Usuário já logado:", user.uid);
            if (!user.emailVerified) {
                await signOut(auth); 
                showContent('login');
                displayEmailVerificationMessage("Seu e-mail não foi verificado. Por favor, verifique sua caixa de entrada (e spam) ou clique em 'Reenviar E-mail de Verificação'.", true);
            } else {
                showContent('home'); 
            }
        } else {
            console.log("Nenhum usuário logado.");
            showContent('login'); 
        }
        // AGORA O OVERLAY VAI DEMORAR 5 SEGUNDOS ANTES DE ESCONDER
        await toggleLoadingOverlay(false); 
        console.log("Loading overlay escondido após onAuthStateChanged.");
    });
});


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
