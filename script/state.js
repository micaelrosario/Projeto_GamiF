// state.js - Módulo de Gerenciamento de Estado da Aplicação e Progresso do Usuário

// appState: Objeto central que mantém o estado atual do quiz e da aplicação.
// Este objeto é modificado diretamente pelas funções neste módulo.
export const appState = {
    currentModuleId: null,      // O ID do módulo de quiz que está ativo no momento (ex: 'logica-programacao').
    currentQuestionIndex: 0,    // O índice da pergunta atual dentro do quiz (começa em 0).
    score: 0,                   // A pontuação atual do usuário no quiz que está jogando.
    questions: [],              // Um array das perguntas do quiz que está ativo no momento.
};

/**
 * Reseta o estado do quiz para o início.
 * Zera o índice da pergunta atual e a pontuação.
 */
export function resetQuizState() {
    appState.currentQuestionIndex = 0; // Volta para a primeira pergunta
    appState.score = 0;                 // Zera a pontuação
}

/**
 * Define o módulo de quiz atual e carrega suas perguntas.
 * Também reseta o estado do quiz para o início quando um novo módulo é definido.
 * @param {string} moduleId - O ID do módulo a ser definido como atual.
 * @param {Array<Object>} questions - Um array de objetos de pergunta para o módulo.
 */
export function setCurrentModule(moduleId, questions = []) {
    appState.currentModuleId = moduleId; // Define o ID do módulo atual
    appState.questions = questions;     // Carrega as perguntas para o estado
    resetQuizState();                   // Reseta a pontuação e o índice da pergunta para este novo quiz
}

/**
 * Incrementa a pontuação atual do usuário em 1.
 * Chamada quando o usuário acerta uma pergunta.
 */
export function incrementScore() {
    appState.score++; // Adiciona 1 à pontuação
}

/**
 * Avança para a próxima pergunta no quiz.
 * Incrementa o índice da pergunta atual.
 */
export function advanceQuestion() {
    appState.currentQuestionIndex++; // Move para a próxima pergunta
}

// Chave usada para armazenar o progresso do usuário no Local Storage do navegador.
// Isso permite que o progresso seja persistente mesmo se o usuário fechar o navegador.
const PROGRESS_STORAGE_KEY = 'gamif_progress';

/**
 * Obtém o progresso salvo do usuário no Local Storage.
 * @returns {Object} Um objeto contendo o progresso dos módulos, ou um objeto vazio se não houver progresso salvo.
 */
export function getProgress() {
    const progressJSON = localStorage.getItem(PROGRESS_STORAGE_KEY); // Tenta obter o progresso como string JSON
    // Se encontrou progresso, faz o parse (converte de JSON string para objeto JavaScript),
    // caso contrário, retorna um objeto vazio.
    return progressJSON ? JSON.parse(progressJSON) : {};
}

/**
 * Salva o progresso do usuário para um módulo específico no Local Storage.
 * O progresso é salvo apenas se a pontuação atual for melhor que a pontuação anterior salva para aquele módulo.
 * @param {string} moduleId - O ID do módulo cujo progresso será salvo.
 * @param {number} currentScore - A pontuação atual do usuário neste quiz.
 * @param {number} totalQuestions - O número total de perguntas neste quiz.
 */
export function saveProgress(moduleId, currentScore, totalQuestions) {
    const progress = getProgress(); // Obtém o progresso atual de todos os módulos
    
    // Evita salvar progresso se o quiz não tinha perguntas (para não corromper dados)
    if (totalQuestions === 0) return;

    // Obtém a melhor pontuação anterior para este módulo, ou -1 se não houver registro.
    const currentBest = progress[moduleId] ? progress[moduleId].bestScore : -1;
    
    // Salva o progresso apenas se a pontuação atual for maior que a melhor pontuação anterior.
    if (currentScore > currentBest) {
        // Atualiza ou cria o registro de progresso para o módulo
        progress[moduleId] = { bestScore: currentScore, totalQuestions };
        // Salva o objeto de progresso atualizado de volta no Local Storage como uma string JSON.
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    }
}