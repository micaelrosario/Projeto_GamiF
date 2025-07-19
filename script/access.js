// acesso.js - Lógica essencial para alternar entre formulários de Login e Cadastro

// 1. Obter referências aos elementos HTML
// É crucial que os IDs no HTML (acesso.html) correspondam EXATAMENTE a estes aqui.
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

// 2. Função para mostrar um formulário e esconder o outro
/**
 * Alterna a visibilidade entre os formulários de login e cadastro.
 * @param {'login' | 'register'} formToShow - O formulário a ser exibido.
 */
function showForm(formToShow) {
    // Garante que os elementos existam antes de tentar manipulá-los
    if (loginForm && registerForm) {
        if (formToShow === 'login') {
            loginForm.style.display = 'block';   // Mostra o formulário de login
            registerForm.style.display = 'none'; // Esconde o formulário de registro
        } else if (formToShow === 'register') {
            registerForm.style.display = 'block';   // Mostra o formulário de registro
            loginForm.style.display = 'none'; // Esconde o formulário de login
        }
    } else {
        console.error("Erro: Elementos de formulário (login-form ou register-form) não encontrados no DOM.");
    }
}

// 3. Adicionar Listeners de Eventos aos Links
// Estes listeners conectam os links do HTML às funções JavaScript.

// Listener para o link "CRIAR CONTA" (para mostrar o formulário de cadastro)
if (showRegisterLink) {
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link (#)
        showForm('register'); // Chama a função para mostrar o formulário de cadastro
    });
} else {
    console.warn("Elemento com ID 'show-register' não encontrado.");
}

// Listener para o link "ENTRAR" (para mostrar o formulário de login)
if (showLoginLink) {
    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault(); // Previne o comportamento padrão do link (#)
        showForm('login'); // Chama a função para mostrar o formulário de login
    });
} else {
    console.warn("Elemento com ID 'show-login' não encontrado.");
}

// 4. Comportamento Inicial ao Carregar a Página
// Garante que o formulário de login seja exibido por padrão quando a página é carregada.
document.addEventListener('DOMContentLoaded', () => {
    showForm('login');
});
