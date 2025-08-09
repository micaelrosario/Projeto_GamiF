// ui.js - Módulo de Gerenciamento da Interface do Usuário (UI)

// Importa funções e dados de outros módulos JavaScript
import { getProgress } from './state.js'; // Importa a função getProgress do módulo 'state.js' para obter o progresso do usuário.
import { modules, quizData } from './data.js'; // Importa a lista de módulos e os dados dos quizzes do módulo 'data.js'.

// DOMElements: Objeto que armazena referências a todos os elementos HTML importantes que serão manipulados pelo JavaScript.
// Isso evita a necessidade de procurar os elementos no DOM repetidamente, melhorando a performance e organização.
export const DOMElements = {
    // Elementos da Estrutura Principal
    appContainer: document.getElementById('app-container'), // Container principal da aplicação
    loadingOverlay: document.getElementById('loading-overlay'), // Overlay de carregamento
    homeContainer: document.getElementById('home-container'), // Container da página inicial (se houver)
    quizContainer: document.getElementById('quiz-container'), // Container onde o quiz (perguntas e opções) é exibido
    backToModulesButton: document.getElementById('back-to-modules-button'), // Botão para voltar para a tela de módulos
    
    // Elementos do Cabeçalho
    pageTitle: document.getElementById('page-title'), // Título principal da página
    pageSubtitle: document.getElementById('page-subtitle'), // Subtítulo da página
    moduleHeaderImage: document.getElementById('module-header-image'), // Imagem no cabeçalho do módulo (se usado)
    
    // Elementos da Trilha
    unitSelectorBar: document.getElementById('unit-selector-bar'), // Barra de seleção de unidades
    trailMainContent: document.getElementById('trail-main-content'), // Container principal da trilha
    trailCharacter: document.getElementById('trail-character'), // Personagem da trilha
    
    // Elementos do Quiz
    questionText: document.getElementById('question-text'), // Elemento onde o texto da pergunta é exibido
    optionsContainer: document.getElementById('options-container'), // Container para os botões das opções de resposta
    feedbackArea: document.getElementById('feedback-area'), // Área para exibir feedback após uma resposta
    feedbackText: document.getElementById('feedback-text'), // Texto do feedback (correto/incorreto, explicação)
    nextButton: document.getElementById('next-button'), // Botão para a próxima pergunta ou resultados
    score: document.getElementById('score'), // Elemento onde a pontuação atual é exibida
    questionArea: document.getElementById('question-area'), // Área que engloba a pergunta e opções
    progressContainer: document.getElementById('progress-container'), // Container da barra de progresso do quiz
    progressBar: document.getElementById('progress-bar'), // A barra de progresso visual
    progressText: document.getElementById('progress-text'), // Texto que mostra o progresso (ex: "1/5")

    // Elementos do Popup de Informações do Quiz
    quizInfoPopup: document.getElementById('quiz-info-popup'),
    quizInfoTitle: document.getElementById('quiz-info-title'),
    quizInfoDescription: document.getElementById('quiz-info-description'),
    startQuizButton: document.getElementById('start-quiz-button'),
};

/**
 * Atualiza o cabeçalho principal da página com novo título, subtítulo e, opcionalmente, uma imagem.
 * @param {string} title - O novo título da página.
 * @param {string} subtitle - O novo subtítulo da página.
 * @param {string | null} imageSrc - Opcional. O caminho da imagem para o cabeçalho do módulo. Se for null, a imagem é escondida.
 */
export function updateHeader(title, subtitle, imageSrc = null) {
    if (DOMElements.pageTitle) {
        DOMElements.pageTitle.textContent = title; // Atualiza o texto do título da página
    }
    if (DOMElements.pageSubtitle) {
        DOMElements.pageSubtitle.textContent = subtitle; // Atualiza o texto do subtítulo da página
    }
    if (DOMElements.moduleHeaderImage) {
        if (imageSrc) {
            DOMElements.moduleHeaderImage.src = imageSrc; // Define o caminho da imagem
            DOMElements.moduleHeaderImage.alt = title; // Define o texto alternativo da imagem para acessibilidade
            DOMElements.moduleHeaderImage.style.display = 'block'; // Mostra a imagem
        } else {
            DOMElements.moduleHeaderImage.style.display = 'none'; // Esconde a imagem se não houver um caminho
        }
    }
}

// NOVO: Definição das classes de alinhamento horizontal para os nós da trilha
const horizontalAlignmentClasses = [
    'node-align-left',    // Para o primeiro nó (índice 0, 5, 10...)
    'node-align-center',  // Para o segundo nó (índice 1, 6, 11...)
    'node-align-right',   // Para o terceiro nó (índice 2, 7, 12...)
    'node-align-center',  // Para o quarto nó (índice 3, 8, 13...)
    'node-align-left'     // Para o quinto nó (índice 4, 9, 14...)
];

const verticalSpacing = 120; // Espaçamento vertical entre os nós em pixels

/**
 * Cria e retorna o elemento HTML (nó) para um quiz individual na trilha.
 * @param {Object} module - O objeto contendo os dados do módulo (id, title, description, image, locked).
 * @param {Function} onNodeClick - Função de callback a ser executada quando o nó é clicado.
 * @param {number} index - O índice do módulo na lista, usado para posicionamento.
 * @returns {HTMLElement} O elemento DIV HTML representando o nó da trilha.
 */
function createTrailNodeHTML(module, onNodeClick, index) {
    const nodeElement = document.createElement('div');
    nodeElement.classList.add('trail-node'); // Adiciona a classe CSS 'trail-node' para estilização
    nodeElement.dataset.quizId = module.id; // Armazena o ID do quiz no dataset do elemento

    // --- Lógica de Posicionamento Dinâmico com Classes de Alinhamento ---
    
    // Calcula a posição vertical (top) - ainda é necessário para o espaçamento vertical
    nodeElement.style.top = `${index * verticalSpacing + 50}px`; // Começa um pouco abaixo do topo e adiciona espaçamento
    
    // Adiciona a classe de alinhamento horizontal com base no índice
    const alignmentClass = horizontalAlignmentClasses[index % horizontalAlignmentClasses.length];
    nodeElement.classList.add(alignmentClass);
    // A transformação translateX(-50%) será definida na classe CSS.
    // --- Fim da Lógica de Posicionamento Dinâmico ---

    let iconHTML = '';
    let labelText = module.title; // Usa o título do módulo como label padrão

    if (module.locked) {
        nodeElement.classList.add('locked');
        iconHTML = '<i class="fas fa-lock"></i>'; // Ícone de cadeado
        labelText = 'Em Breve';
    } else {
        const progressData = getProgress();
        const moduleProgress = progressData[module.id];
        const questionsForModule = quizData[module.id]?.questions || [];
        const totalQuestions = questionsForModule.length;

        if (moduleProgress && moduleProgress.bestScore === totalQuestions && totalQuestions > 0) {
            nodeElement.classList.add('completed');
            iconHTML = '<i class="fas fa-check-circle"></i>'; // Ícone de check para completo
        } else {
            // Ícone padrão para quizzes não travados e não completos
            iconHTML = '<i class="fas fa-question-circle"></i>'; 
        }

        if (totalQuestions === 0) {
            nodeElement.classList.add('locked'); // Trata como travado se não houver perguntas
            iconHTML = '<i class="fas fa-hourglass-half"></i>'; // Ícone de ampulheta para "Em breve"
            labelText = 'Em Breve';
        }
    }

    // Adiciona o listener de clique ao nó da trilha
    nodeElement.addEventListener('click', () => onNodeClick(module.id, nodeElement));

    nodeElement.innerHTML = `
        <span class="node-icon">${iconHTML}</span>
        <span class="node-label">${labelText}</span>
    `;
    return nodeElement;
}

/**
 * Exibe a tela de listagem de módulos (trilha) e esconde a tela do quiz.
 * @param {Function} onNodeClick - Função de callback para quando um nó da trilha é clicado.
 */
export function showModulesView(onNodeClick) {
    updateHeader("Trilha de Aprendizado", "Explore os módulos e teste seus conhecimentos!");
    
    if (DOMElements.trailMainContent) {
        // Limpa quaisquer nós existentes antes de renderizar novamente
        // Remove todos os filhos que não são 'trail-path' ou 'trail-character'
        Array.from(DOMElements.trailMainContent.children).forEach(child => {
            if (!child.classList.contains('trail-path') && !child.classList.contains('trail-character')) {
                child.remove();
            }
        });

        // Para cada módulo, cria seu nó HTML e o adiciona à trilha
        modules.forEach((module, index) => { // Passa o índice para a função
            const nodeElement = createTrailNodeHTML(module, onNodeClick, index);
            DOMElements.trailMainContent.appendChild(nodeElement);
        });

        // Ajusta a altura do trail-container para acomodar todos os nós
        // Adiciona um padding extra no final para a trilha não ficar "cortada"
        const totalHeight = modules.length * verticalSpacing + 150; // Ajuste conforme necessário
        DOMElements.trailMainContent.style.height = `${totalHeight}px`;

        // Posiciona o personagem no primeiro nó (ou onde o usuário está no progresso)
        // Para este exemplo, vamos posicioná-lo no primeiro nó.
        if (DOMElements.trailCharacter && modules.length > 0) {
            const firstNodeTop = 50; // A mesma margem inicial que usamos para o primeiro nó
            // A posição horizontal do primeiro nó é determinada pela classe 'node-align-left'
            // O personagem também precisa ser centralizado horizontalmente
            DOMElements.trailCharacter.style.top = `${firstNodeTop - 50}px`; // Ajuste para o personagem ficar acima do nó
            // Para o personagem, vamos usar um valor fixo que corresponda ao 'left' da classe 'node-align-left'
            DOMElements.trailCharacter.style.left = '20%'; 
            DOMElements.trailCharacter.style.transform = 'translateX(-50%)'; // Centraliza o personagem
            DOMElements.trailCharacter.style.display = 'block'; // Garante que o personagem esteja visível
        }
    }

    if (DOMElements.appContainer) DOMElements.appContainer.style.display = 'block'; // Garante que o container principal esteja visível
    if (DOMElements.trailMainContent) DOMElements.trailMainContent.style.display = 'block'; // Mostra o container da trilha
    if (DOMElements.unitSelectorBar) DOMElements.unitSelectorBar.style.display = 'flex'; // Mostra a barra de unidades
    if (DOMElements.quizContainer) DOMElements.quizContainer.style.display = 'none'; // Esconde o container do quiz
    if (DOMElements.backToModulesButton) DOMElements.backToModulesButton.style.display = 'none'; // Esconde o botão de voltar
    
    hideQuizInfoPopup(); // Esconde o popup de informações do quiz ao mostrar a trilha
}

/**
 * Exibe a tela do quiz para um módulo específico e esconde a tela de módulos.
 * @param {Object} module - O objeto do módulo para o qual o quiz será exibido.
 */
export function showQuizView(module) {
    updateHeader(module.title, `Teste seus conhecimentos sobre ${module.title}!`, module.image);
    
    if (DOMElements.trailMainContent) DOMElements.trailMainContent.style.display = 'none'; // Esconde o container da trilha
    if (DOMElements.unitSelectorBar) DOMElements.unitSelectorBar.style.display = 'none'; // Esconde a barra de unidades
    if (DOMElements.quizContainer) DOMElements.quizContainer.style.display = 'block'; // Mostra o container do quiz
    if (DOMElements.backToModulesButton) DOMElements.backToModulesButton.style.display = 'inline-block'; // Mostra o botão de voltar
    if (DOMElements.trailCharacter) DOMElements.trailCharacter.style.display = 'none'; // Esconde o personagem
    
    hideQuizInfoPopup(); // Esconde o popup de informações do quiz ao iniciar o quiz
}

/**
 * Exibe uma tela de módulo vazio/em desenvolvimento.
 * @param {Object} module - O objeto do módulo que está vazio.
 */
export function showEmptyModuleView(module) {
    updateHeader(module.title, "Conteúdo em desenvolvimento.", module.image); // Atualiza o cabeçalho
    
    if (DOMElements.trailMainContent) DOMElements.trailMainContent.style.display = 'none'; // Esconde a trilha
    if (DOMElements.unitSelectorBar) DOMElements.unitSelectorBar.style.display = 'none'; // Esconde a barra de unidades
    if (DOMElements.quizContainer) DOMElements.quizContainer.style.display = 'block'; // Mostra área do quiz
    if (DOMElements.backToModulesButton) DOMElements.backToModulesButton.style.display = 'inline-block'; // Mostra botão de voltar
    if (DOMElements.progressContainer) DOMElements.progressContainer.style.display = 'none'; // Esconde barra de progresso (não relevante para módulo vazio)
    if (DOMElements.trailCharacter) DOMElements.trailCharacter.style.display = 'none'; // Esconde o personagem
    
    if (DOMElements.questionArea) {
        DOMElements.questionArea.style.opacity = '1'; 
        DOMElements.questionArea.style.transform = 'translateY(0)';
        if (DOMElements.questionText) {
            DOMElements.questionText.innerHTML = `Conteúdo para "<strong>${module.title}</strong>" estará disponível em breve!`;
        }
    }
    if (DOMElements.optionsContainer) DOMElements.optionsContainer.innerHTML = ''; // Limpa opções de resposta
    if (DOMElements.feedbackArea) DOMElements.feedbackArea.style.display = 'none'; // Esconde área de feedback
    if (DOMElements.feedbackText) DOMElements.feedbackText.innerHTML = ''; // Limpa texto de feedback
    if (DOMElements.nextButton) DOMElements.nextButton.style.display = 'none'; // Esconde botão de próxima pergunta
    if (DOMElements.score && DOMElements.score.parentElement) {
        DOMElements.score.parentElement.style.display = 'none'; // Esconde área de pontuação
    }

    hideQuizInfoPopup(); // Esconde o popup de informações do quiz
}

/**
 * Atualiza a barra de progresso do quiz.
 * @param {number} completedCount - Número de perguntas completadas.
 * @param {number} totalCount - Número total de perguntas no quiz.
 */
export function updateProgressBar(completedCount, totalCount) {
    if (DOMElements.progressBar && DOMElements.progressText && DOMElements.progressContainer) {
        if (totalCount > 0) { // Garante que não haja divisão por zero
            const percentage = (completedCount / totalCount) * 100; // Calcula a porcentagem de progresso
            DOMElements.progressBar.style.width = percentage + '%'; // Atualiza a largura visual da barra
            DOMElements.progressText.textContent = `${completedCount} / ${totalCount}`; // Atualiza o texto de progresso
            DOMElements.progressContainer.style.display = 'flex'; // Mostra o container da barra de progresso
        } else {
            DOMElements.progressContainer.style.display = 'none'; // Esconde a barra se não houver perguntas
        }
    }
}

/**
 * Atualiza a pontuação exibida na interface do usuário.
 * @param {number} score - A pontuação atual a ser exibida.
 */
export function updateScore(score) {
    if (DOMElements.score) {
        DOMElements.score.textContent = score; // Define o texto do elemento da pontuação
    }
}

/**
 * Aplica um efeito de fade-in (aparecer gradualmente) e slide-up a um elemento.
 * @param {HTMLElement} element - O elemento HTML ao qual aplicar o efeito.
 */
function fadeIn(element) {
    if (element) {
        element.style.opacity = '0'; // Define opacidade inicial como 0 (invisível)
        element.style.transform = 'translateY(20px)'; // Move o elemento 20px para baixo
        void element.offsetWidth; // Força um "reflow" do navegador para garantir que as propriedades iniciais sejam aplicadas antes da transição
        element.style.opacity = '1'; // Define opacidade para 1 (visível), iniciando a transição
        element.style.transform = 'translateY(0)'; // Move o elemento de volta para a posição original
    }
}

/**
 * Renderiza uma pergunta na interface do usuário e configura os botões de opção.
 * @param {Object} question - O objeto da pergunta a ser renderizada.
 * @param {Function} onAnswer - Função de callback a ser executada quando uma opção de resposta é selecionada.
 */
export function renderQuestion(question, onAnswer) {
    // Esconde/limpa elementos de feedback de uma pergunta anterior
    if (DOMElements.feedbackArea) DOMElements.feedbackArea.style.display = 'none';
    if (DOMElements.feedbackText) {
        DOMElements.feedbackText.innerHTML = '';
        DOMElements.feedbackText.className = ''; // Remove classes de feedback anteriores
    }
    if (DOMElements.nextButton) DOMElements.nextButton.style.display = 'none'; // Esconde o botão de próxima pergunta
    if (DOMElements.optionsContainer) DOMElements.optionsContainer.innerHTML = ''; // Limpa opções de resposta anteriores
    if (DOMElements.score && DOMElements.score.parentElement) DOMElements.score.parentElement.style.display = 'block'; // Garante que a área de pontuação esteja visível

    if (DOMElements.questionText) {
        DOMElements.questionText.textContent = question.question; // Define o texto da pergunta
    }

    // Embaralha as opções de resposta para que apareçam em ordem diferente a cada vez
    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

    // Cria e adiciona um botão para cada opção de resposta
    if (DOMElements.optionsContainer) {
        shuffledOptions.forEach(option => {
            const button = document.createElement('button'); // Cria um novo botão
            button.textContent = option; // Define o texto do botão como a opção de resposta
            button.classList.add('option-button'); // Adiciona classe para estilização
            // Adiciona um 'event listener' para quando o botão for clicado
            button.addEventListener('click', () => {
                const isCorrect = option === question.correctAnswer; // Verifica se a opção selecionada é a correta
                onAnswer(isCorrect, option, button); // Chama a função de callback com o resultado
            });
            DOMElements.optionsContainer.appendChild(button); // Adiciona o botão ao container de opções
        });
    }

    fadeIn(DOMElements.questionArea); // Aplica o efeito de fade-in na área da pergunta
}

/**
 * Mostra o feedback visual após o usuário responder a uma pergunta.
 * @param {boolean} isCorrect - Verdadeiro se a resposta estiver correta, falso caso contrário.
 * @param {string} selectedOption - O texto da opção selecionada pelo usuário.
 * @param {HTMLElement} button - O botão HTML da opção selecionada.
 * @param {string} correctAnswer - O texto da resposta correta da pergunta.
 * @param {string} explanation - A explicação da resposta.
 */
export function showAnswerFeedback(isCorrect, selectedOption, button, correctAnswer, explanation) {
    // Desabilita todos os botões de opção para evitar múltiplas respostas
    if (DOMElements.optionsContainer) {
        const optionButtons = DOMElements.optionsContainer.querySelectorAll('.option-button');
        optionButtons.forEach(btn => {
            btn.disabled = true;
            // Adiciona classes para destacar a resposta correta e a incorreta (se houver)
            if (btn.textContent === correctAnswer) {
                btn.classList.add('correct'); // Destaca a resposta correta
            } else if (btn === button && !isCorrect) {
                btn.classList.add('incorrect'); // Destaca a resposta incorreta que foi clicada
            }
        });
    }

    if (DOMElements.feedbackArea) DOMElements.feedbackArea.style.display = 'block'; // Mostra a área de feedback
    let feedbackPrefix = ""; // Prefixo para a mensagem de feedback

    // Define a mensagem de feedback e a classe CSS com base na correção da resposta
    if (isCorrect) {
        feedbackPrefix = "<strong>Correto!</strong> ";
        if (DOMElements.feedbackText) DOMElements.feedbackText.classList.add('correct'); // Adiciona classe para feedback correto
    } else {
        feedbackPrefix = `<strong>Incorreto.</strong> A resposta correta é: <em>"${correctAnswer}"</em>. `;
        if (DOMElements.feedbackText) DOMElements.feedbackText.classList.add('incorrect'); // Adiciona classe para feedback incorreto
    }
    if (DOMElements.feedbackText) DOMElements.feedbackText.innerHTML = feedbackPrefix + explanation; // Define o texto e a explicação do feedback
    if (DOMElements.nextButton) DOMElements.nextButton.style.display = 'inline-block'; // Mostra o botão "Próxima Pergunta"
}

/**
 * Renderiza a tela de resultados finais do quiz.
 * @param {number} score - A pontuação final do usuário.
 * @param {number} totalQuestions - O número total de perguntas no quiz.
 * @param {Function} onRestart - Função de callback para reiniciar o quiz.
 */
export function renderFinalResults(score, totalQuestions, onRestart) {
    fadeIn(DOMElements.questionArea); // Aplica fade-in à área de perguntas/resultados
    updateProgressBar(totalQuestions, totalQuestions); // Atualiza a barra de progresso para 100%

    if (DOMElements.questionText) DOMElements.questionText.innerHTML = `Quiz Concluído! <br>Sua pontuação final é: <strong>${score} de ${totalQuestions}</strong>.`; // Exibe a pontuação final
    if (DOMElements.optionsContainer) DOMElements.optionsContainer.innerHTML = ''; // Limpa as opções de resposta
    if (DOMElements.feedbackArea) DOMElements.feedbackArea.style.display = 'block'; // Mostra a área de feedback

    let finalMessage = ""; // Mensagem final baseada no desempenho
    if (score === totalQuestions) {
        finalMessage = "Excelente! Você dominou todos os conceitos básicos. Parabéns!";
        if (DOMElements.feedbackText) DOMElements.feedbackText.classList.add('correct'); // Feedback positivo
    } else if (score >= totalQuestions * 0.7) {
        finalMessage = "Muito bom! Você tem um bom entendimento dos fundamentos.";
        if (DOMElements.feedbackText) DOMElements.feedbackText.classList.add('correct'); // Feedback positivo intermediário
    } else if (score >= totalQuestions * 0.4) {
        finalMessage = "Nada mal! Continue estudando para aprimorar seus conhecimentos.";
        if (DOMElements.feedbackText) DOMElements.feedbackText.className = ''; // Remove classes anteriores (deixa neutro)
    } else {
        finalMessage = "Parece que você está começando. Continue aprendendo e refaça o quiz para fixar os conceitos!";
        if (DOMElements.feedbackText) DOMElements.feedbackText.classList.add('incorrect'); // Feedback indicando necessidade de mais estudo
    }
    if (DOMElements.feedbackText) DOMElements.feedbackText.innerHTML = finalMessage; // Define o texto da mensagem final
    
    if (DOMElements.nextButton) {
        DOMElements.nextButton.textContent = 'Recomeçar Quiz'; // Muda o texto do botão para "Recomeçar Quiz"
        DOMElements.nextButton.style.display = 'inline-block'; // Mostra o botão

        // Clona o botão para remover event listeners antigos e adiciona um novo para reiniciar o quiz
        const newNextButton = DOMElements.nextButton.cloneNode(true);
        DOMElements.nextButton.parentNode.replaceChild(newNextButton, DOMElements.nextButton);
        DOMElements.nextButton = newNextButton; 
        DOMElements.nextButton.addEventListener('click', onRestart); // Adiciona o listener para reiniciar
    }
}

/**
 * Exibe o overlay de carregamento.
 * @param {string} message - A mensagem a ser exibida no overlay.
 */
export function showLoadingOverlay(message = "Carregando...") {
    if (DOMElements.loadingOverlay) {
        DOMElements.loadingOverlay.style.display = 'flex';
        const loadingMessageElement = DOMElements.loadingOverlay.querySelector('.loading-message');
        if (loadingMessageElement) {
            loadingMessageElement.textContent = message;
        }
    }
}

/**
 * Esconde o overlay de carregamento.
 */
export function hideLoadingOverlay() {
    if (DOMElements.loadingOverlay) {
        DOMElements.loadingOverlay.style.display = 'none';
    }
}

/**
 * Exibe o popup de informações do quiz.
 * @param {Object} quizModule - O objeto do módulo de quiz a ser exibido.
 * @param {HTMLElement} clickedNodeElement - O elemento do nó da trilha que foi clicado.
 * @param {Function} onStartQuizCallback - A função de callback para iniciar o quiz.
 */
export function showQuizInfoPopup(quizModule, clickedNodeElement, onStartQuizCallback) {
    if (!DOMElements.quizInfoPopup || !DOMElements.quizInfoTitle || !DOMElements.quizInfoDescription || !DOMElements.startQuizButton) {
        console.error("Erro: Elementos do popup de informações do quiz não encontrados.");
        return;
    }

    // Preenche o popup com as informações do quiz
    DOMElements.quizInfoTitle.textContent = quizModule.title;
    DOMElements.quizInfoDescription.textContent = quizModule.description;

    // Remove qualquer listener anterior do botão para evitar múltiplos disparos
    const oldStartButton = DOMElements.startQuizButton;
    const newStartButton = oldStartButton.cloneNode(true);
    oldStartButton.parentNode.replaceChild(newStartButton, oldStartButton);
    DOMElements.startQuizButton = newStartButton;

    // Adiciona o listener para iniciar o quiz
    DOMElements.startQuizButton.addEventListener('click', () => {
        // Esconde o popup antes de iniciar o quiz
        hideQuizInfoPopup();
        // Chama o callback para iniciar o quiz com o ID do módulo
        onStartQuizCallback(quizModule.id);
    });

    // Posiciona o popup de informações do quiz
    const nodeRect = clickedNodeElement.getBoundingClientRect();
    const trailContainerRect = DOMElements.trailMainContent.getBoundingClientRect();

    // Calcula a posição relativa ao trail-container
    // Ajusta o 'top' para que o popup fique acima do nó
    // Ajusta o 'left' para que o popup fique centralizado horizontalmente com o nó
    const relativeTop = nodeRect.top - trailContainerRect.top;
    const relativeLeft = nodeRect.left - trailContainerRect.left;

    DOMElements.quizInfoPopup.style.top = `${relativeTop - DOMElements.quizInfoPopup.offsetHeight - 10}px`; // 10px de margem acima do nó
    DOMElements.quizInfoPopup.style.left = `${relativeLeft + clickedNodeElement.offsetWidth / 2}px`; 
    DOMElements.quizInfoPopup.style.transform = 'translateX(-50%)'; // Centraliza o popup horizontalmente

    DOMElements.quizInfoPopup.style.display = 'flex'; // Mostra o popup
    // Força o reflow para garantir que o display 'flex' seja aplicado antes da transição de opacidade
    void DOMElements.quizInfoPopup.offsetWidth; 
    DOMElements.quizInfoPopup.classList.add('show'); // Adiciona classe para animação de fade-in e slide-up

    // Adiciona um listener para fechar o popup ao clicar fora dele
    function handleClickOutside(event) {
        // Verifica se o clique não foi dentro do popup e não foi no nó que o abriu
        if (!DOMElements.quizInfoPopup.contains(event.target) && !clickedNodeElement.contains(event.target)) {
            hideQuizInfoPopup();
            document.removeEventListener('click', handleClickOutside); // Remove o listener para evitar múltiplos
        }
    }
    // Adiciona o listener com um pequeno atraso para não capturar o clique que abriu o popup
    setTimeout(() => {
        document.addEventListener('click', handleClickOutside);
    }, 100);
}

/**
 * Esconde o popup de informações do quiz.
 */
export function hideQuizInfoPopup() {
    if (DOMElements.quizInfoPopup) {
        DOMElements.quizInfoPopup.classList.remove('show'); // Remove a classe para animar o fade-out
        // Esconde o elemento completamente após a transição
        DOMElements.quizInfoPopup.addEventListener('transitionend', function handler() {
            if (!DOMElements.quizInfoPopup.classList.contains('show')) {
                DOMElements.quizInfoPopup.style.display = 'none';
                DOMElements.quizInfoPopup.removeEventListener('transitionend', handler);
            }
        });
    }
}
