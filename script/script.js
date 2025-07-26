// script.js - Módulo Principal da Lógica do Quiz

// Importa módulos e funções de outros arquivos JavaScript
import * as Confetti from './confetti.js'; // Importa todas as exportações do módulo 'confetti.js' (que gerencia os efeitos de confete)
import { modules, quizData } from './data.js'; // Importa a lista de módulos e os dados dos quizzes do 'data.js'
import * as UI from './ui.js';             // Importa todas as exportações do módulo 'ui.js' (que gerencia a interface do usuário)
import * as State from './state.js';         // Importa todas as exportações do módulo 'state.js' (que gerencia o estado da aplicação, como pontuação e progresso)

/**
 * Lida com a seleção de resposta do usuário em uma pergunta do quiz.
 * Esta função é chamada quando o usuário clica em um botão de opção de resposta.
 * @param {boolean} isCorrect - Indica se a resposta selecionada está correta (true) ou incorreta (false).
 * @param {string} selectedOption - O texto da opção de resposta que foi selecionada.
 * @param {HTMLElement} button - O elemento do botão HTML que foi clicado pelo usuário.
 */
function handleAnswer(isCorrect, selectedOption, button) {
    // Obtém a pergunta atual do estado da aplicação
    const question = State.appState.questions[State.appState.currentQuestionIndex];
    // Mostra o feedback visual na UI (verde para correto, vermelho para incorreto)
    UI.showAnswerFeedback(isCorrect, selectedOption, button, question.correctAnswer, question.explanation);
    
    // Se a resposta estiver correta
    if (isCorrect) {
        State.incrementScore(); // Incrementa a pontuação no estado da aplicação
        UI.updateScore(State.appState.score); // Atualiza a pontuação exibida na UI
        Confetti.playConfetti(); // Toca o efeito de confete para celebrar a resposta correta
    }
    
    // Recria e substitui o botão 'Próxima Pergunta'/'Recomeçar Quiz' para remover listeners de eventos antigos
    // Isso garante que apenas um listener de clique esteja ativo por vez.
    const newNextButton = UI.DOMElements.nextButton.cloneNode(true);
    UI.DOMElements.nextButton.parentNode.replaceChild(newNextButton, UI.DOMElements.nextButton);
    UI.DOMElements.nextButton = newNextButton;
    // Adiciona um listener de evento ao novo botão para avançar para a próxima pergunta ou mostrar os resultados
    UI.DOMElements.nextButton.addEventListener('click', showNextQuestionOrResults);
}

/**
 * Avança para a próxima pergunta do quiz ou exibe os resultados finais se o quiz terminou.
 * Esta função é chamada quando o botão 'Próxima Pergunta' é clicado.
 */
function showNextQuestionOrResults() {
    State.advanceQuestion(); // Avança o índice da pergunta atual no estado da aplicação
    
    // Verifica se ainda há mais perguntas no quiz
    if (State.appState.currentQuestionIndex < State.appState.questions.length) {
        // Se sim, renderiza a próxima pergunta e atualiza a barra de progresso
        const nextQuestion = State.appState.questions[State.appState.currentQuestionIndex];
        UI.renderQuestion(nextQuestion, handleAnswer); // Renderiza a pergunta na UI
        UI.updateProgressBar(State.appState.currentQuestionIndex, State.appState.questions.length); // Atualiza a barra de progresso
    } else {
        // Se não há mais perguntas, o quiz é considerado finalizado
        // Salva o progresso do usuário para o módulo atual
        State.saveProgress(State.appState.currentModuleId, State.appState.score, State.appState.questions.length);
        // Renderiza a tela de resultados finais do quiz
        UI.renderFinalResults(State.appState.score, State.appState.questions.length, () => startQuiz(State.appState.currentModuleId));
        // Se o usuário acertou todas as perguntas, toca o efeito de confete novamente
        if (State.appState.score === State.appState.questions.length) {
            Confetti.playConfetti(5000); // Toca confete por 5 segundos
        }
    }
}

/**
 * Inicia um quiz para um dado ID de módulo.
 * @param {string} moduleId 
 */
function startQuiz(moduleId) {
    // Encontra o objeto do módulo correspondente ao ID fornecido
    const module = modules.find(m => m.id === moduleId);
    if (!module) return; // Se o módulo não for encontrado, encerra a função

    // Obtém as perguntas para o módulo. Se não houver, retorna um array vazio.
    const moduleQuestions = quizData[moduleId]?.questions || [];

    // Verifica se o módulo está travado ou não tem perguntas. Se sim, mostra uma visão de "módulo vazio".
    if (module.locked || moduleQuestions.length === 0) {
        UI.showEmptyModuleView(module); // Exibe uma mensagem indicando que o conteúdo está indisponível
        return; // Encerra a função
    }

    // Configura o estado inicial do quiz para o módulo selecionado
    State.setCurrentModule(moduleId, moduleQuestions);
    UI.showQuizView(module); // Exibe a interface do quiz na tela
    
    // Atualiza a pontuação e a barra de progresso para o início do quiz
    UI.updateScore(State.appState.score);
    UI.updateProgressBar(0, State.appState.questions.length);

    // Renderiza a primeira pergunta do quiz
    const firstQuestion = State.appState.questions[0];
    UI.renderQuestion(firstQuestion, handleAnswer); // Exibe a primeira pergunta na UI e configura seu handler de resposta
}

//Inicializa a aplicação GamiF.
function init() {
    // Inicializa o gerador de confetes, associando-o ao canvas no HTML
    Confetti.initConfetti(document.getElementById('confetti-canvas'));
    // Adiciona um listener de evento ao botão 'Voltar aos Módulos'
    UI.DOMElements.backToModulesButton.addEventListener('click', () => {
        UI.showModulesView(startQuiz); // Quando clicado, mostra a tela de módulos novamente
    });
    // Exibe inicialmente a tela de módulos ao carregar a aplicação
    UI.showModulesView(startQuiz);
}

// Garante que a função 'init' seja chamada somente depois que todo o conteúdo HTML da página for carregado e parseado.
document.addEventListener('DOMContentLoaded', init);