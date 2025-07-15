// confetti.js - Módulo de Gerenciamento de Efeitos de Confete

// Importa a biblioteca 'confetti-js'.
// O 'importmap' no index.html mapeia 'confetti-lib' para o caminho do arquivo da biblioteca (CDN ou local).
// Esta linha garante que o código da biblioteca seja carregado e executado,
// tornando a classe 'ConfettiGenerator' disponível globalmente via 'window.ConfettiGenerator'.
import 'confetti-lib'; 

// Variável para armazenar a instância do gerador de confetes.
// É inicializada como null e será preenchida após a chamada de initConfetti().
let confettiInstance = null;

/**
 * Inicializa o gerador de confetes, associando-o a um elemento canvas específico no HTML.
 * Esta função deve ser chamada uma vez, geralmente na inicialização da aplicação.
 * @param {HTMLCanvasElement} canvasElement - O elemento <canvas> HTML onde os confetes serão renderizados.
 */
export function initConfetti(canvasElement) {
    // Verifica se o elemento canvas foi fornecido. Se não, exibe um erro no console e encerra.
    if (!canvasElement) {
        console.error("Confetti canvas not found");
        return;
    }

    // Define as configurações para o gerador de confetes.
    const confettiSettings = {
        target: canvasElement, // O elemento canvas onde os confetes aparecerão.
        max: 120,              // Número máximo de confetes na tela.
        size: 1.1,             // Tamanho dos confetes.
        animate: true,         // Se os confetes devem ter animações.
        props: ['circle', 'square', 'triangle'], // Formas dos confetes.
        colors: [[0,123,255],[40,167,69],[255,193,7],[220,53,69]], // Cores dos confetes (RGB).
        clock: 30,             // Velocidade da animação (quanto menor, mais rápido).
        rotate: true,          // Se os confetes devem girar.
        start_from_edge: false, // Se os confetes devem começar das bordas da tela.
        respawn: false,        // Se os confetes devem reaparecer após desaparecerem.
    };
    // Cria uma nova instância do ConfettiGenerator e a armazena na variável confettiInstance.
    // Acessa ConfettiGenerator via 'window' porque a biblioteca o expõe globalmente.
    confettiInstance = new window.ConfettiGenerator(confettiSettings);
}

/**
 * Inicia a animação dos confetes por uma duração específica e depois os limpa.
 * @param {number} [duration=2500] - Opcional. A duração em milissegundos que os confetes devem aparecer. Padrão é 2500ms (2.5 segundos).
 */
export function playConfetti(duration = 2500) {
    // Verifica se a instância do gerador de confetes foi inicializada.
    if (confettiInstance) {
        confettiInstance.render(); // Inicia a renderização dos confetes na tela.
        // Define um temporizador para limpar os confetes após a duração especificada.
        setTimeout(() => {
            // Verifica novamente se a instância existe antes de tentar limpar (evita erros se for nullificado externamente).
            if (confettiInstance) confettiInstance.clear(); // Limpa os confetes da tela.
        }, duration);
    }
}