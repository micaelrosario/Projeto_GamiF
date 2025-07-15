// ui.js - Módulo de Gerenciamento da Interface do Usuário (UI)

// Importa funções e dados de outros módulos JavaScript
import { getProgress } from './state.js'; // Importa a função getProgress do módulo 'state.js' para obter o progresso do usuário.
import { modules, quizData } from './data.js'; // Importa a lista de módulos e os dados dos quizzes do módulo 'data.js'.

// DOMElements: Objeto que armazena referências a todos os elementos HTML importantes que serão manipulados pelo JavaScript.
// Isso evita a necessidade de procurar os elementos no DOM repetidamente, melhorando a performance e organização.
export const DOMElements = {
    pageTitle: document.getElementById('page-title'), // Título principal da página
    pageSubtitle: document.getElementById('page-subtitle'), // Subtítulo da página
    moduleHeaderImage: document.getElementById('module-header-image'), // Imagem no cabeçalho do módulo
    modulesContainer: document.getElementById('modules-container'), // Container onde os cards dos módulos são exibidos
    quizContainer: document.getElementById('quiz-container'), // Container onde o quiz (perguntas e opções) é exibido
    questionText: document.getElementById('question-text'), // Elemento onde o texto da pergunta é exibido
    optionsContainer: document.getElementById('options-container'), // Container para os botões das opções de resposta
    feedbackArea: document.getElementById('feedback-area'), // Área para exibir feedback após uma resposta
    feedbackText: document.getElementById('feedback-text'), // Texto do feedback (correto/incorreto, explicação)
    nextButton: document.getElementById('next-button'), // Botão para a próxima pergunta ou resultados
    score: document.getElementById('score'), // Elemento onde a pontuação atual é exibida
    questionArea: document.getElementById('question-area'), // Área que engloba a pergunta e opções
    backToModulesButton: document.getElementById('back-to-modules-button'), // Botão para voltar para a tela de módulos
    progressContainer: document.getElementById('progress-container'), // Container da barra de progresso do quiz
    progressBar: document.getElementById('progress-bar'), // A barra de progresso visual
    progressText: document.getElementById('progress-text'), // Texto que mostra o progresso (ex: "1/5")
};

/**
 * Atualiza o cabeçalho principal da página com novo título, subtítulo e, opcionalmente, uma imagem.
 * @param {string} title - O novo título da página.
 * @param {string} subtitle - O novo subtítulo da página.
 * @param {string | null} imageSrc - Opcional. O caminho da imagem para o cabeçalho do módulo. Se for null, a imagem é escondida.
 */
export function updateHeader(title, subtitle, imageSrc = null) {
    DOMElements.pageTitle.textContent = title; // Atualiza o texto do título da página
    // CORREÇÃO: A linha abaixo é uma duplicata da anterior, deve ser removida para evitar redundância.
    // DOMElements.pageTitle.textContent = title;
    DOMElements.pageSubtitle.textContent = subtitle; // Atualiza o texto do subtítulo da página
    if (imageSrc) {
        DOMElements.moduleHeaderImage.src = imageSrc; // Define o caminho da imagem
        DOMElements.moduleHeaderImage.alt = title; // Define o texto alternativo da imagem para acessibilidade
        DOMElements.moduleHeaderImage.style.display = 'block'; // Mostra a imagem
    } else {
        DOMElements.moduleHeaderImage.style.display = 'none'; // Esconde a imagem se não houver um caminho
    }
}

/**
 * Cria e retorna o elemento HTML (card) para um módulo de quiz individual.
 * @param {Object} module - O objeto contendo os dados do módulo (id, title, description, image, locked).
 * @param {Function} onStartQuiz - Função de callback a ser executada quando o módulo é clicado para iniciar o quiz.
 * @returns {HTMLElement} O elemento DIV HTML representando o card do módulo.
 */
function createModuleHTML(module, onStartQuiz) {
    // Cria um novo elemento DIV que será o card do módulo
    const moduleElement = document.createElement('div');
    moduleElement.classList.add('module-item'); // Adiciona a classe CSS 'module-item' para estilização

    let progressHTML = ''; // String para armazenar o HTML do indicador de progresso (estrelas/troféu/cadeado)
    const progressData = getProgress(); // Obtém todos os dados de progresso do usuário (salvos localmente)
    const moduleProgress = progressData[module.id]; // Pega o progresso específico para este módulo
    const questionsForModule = quizData[module.id]?.questions || []; // Obtém as perguntas do módulo do quizData
    const totalQuestions = questionsForModule.length; // Calcula o número total de perguntas para este módulo

    // Lógica para determinar o estado e a exibição do módulo (travado, com progresso, sem progresso)
    if (module.locked) {
        moduleElement.classList.add('locked'); // Adiciona classe para estilização de módulo travado
        progressHTML = `
            <div class="progress-indicator">
                <span class="lock-icon">🔒</span>
                <span>Em Breve</span>
            </div>`; // HTML para módulo travado
    } else { // Se o módulo NÃO está travado
        if (moduleProgress) { // Se há progresso salvo para este módulo
            const bestScore = moduleProgress.bestScore; // Obtém a melhor pontuação salva para o módulo
            // CORREÇÃO: Usa 'totalQuestions' (número atual de perguntas do módulo) para calcular a porcentagem
            // Isso evita problemas se o número de perguntas do módulo mudou desde a última vez que o progresso foi salvo.
            const totalForPercentage = totalQuestions; 
            const percentage = Math.round((bestScore / totalForPercentage) * 100); // Calcula a porcentagem de acertos

            // --- INÍCIO DA LÓGICA DAS ESTRELAS E TROFÉU ---
            let starsHTML = ''; // String para o HTML das estrelas/troféu
            const totalVisualStars = 5; // O total de slots de estrela visualmente é 5

            // Mantenha os console.logs para depuração! Eles são muito úteis para ver os valores.
            console.log(`--- DEBUG ESTRELAS para módulo: ${module.title} ---`);
            console.log(`bestScore: ${bestScore}, totalForPercentage: ${totalForPercentage}`);
            console.log(`Porcentagem Calculada: ${percentage}%`);
            console.log(`Is percentage >= 100? ${percentage >= 100}`);

            // Lógica para determinar se exibe troféu (100% de acerto) ou estrelas (de 0 a 4)
            // Se o número de acertos for igual ao total de perguntas do módulo (100% de acerto)
            if (bestScore === totalForPercentage && totalForPercentage > 0) { 
                starsHTML = '<span class="trophy-icon">🏆</span>'; // Exibe o troféu
                console.log("Resultado: TROFÉU (Acertou todas!)");
            } else if (percentage >= 80) { // Se a porcentagem de acerto é 80% ou mais (mas não 100%)
                starsHTML = '<span class="stars-filled">⭐⭐⭐⭐</span>' + // 4 estrelas preenchidas
                            '<span class="stars-empty">⭐</span>';       // 1 estrela vazia
                console.log("Resultado: 4 estrela(s) (>= 80% de acerto)");
            } else if (percentage >= 60) { // Se a porcentagem de acerto é 60% ou mais (mas menos de 80%)
                starsHTML = '<span class="stars-filled">⭐⭐⭐</span>' + // 3 estrelas preenchidas
                            '<span class="stars-empty">⭐⭐</span>';    // 2 estrelas vazias
                console.log("Resultado: 3 estrela(s) (>= 60% de acerto)");
            } else if (percentage >= 40) { // Se a porcentagem de acerto é 40% ou mais (mas menos de 60%)
                starsHTML = '<span class="stars-filled">⭐⭐</span>' + // 2 estrelas preenchidas
                            '<span class="stars-empty">⭐⭐⭐</span>'; // 3 estrelas vazias
                console.log("Resultado: 2 estrela(s) (>= 40% de acerto)");
            } else if (percentage >= 20) { // Se a porcentagem de acerto é 20% ou mais (mas menos de 40%)
                starsHTML = '<span class="stars-filled">⭐</span>' +    // 1 estrela preenchida
                            '<span class="stars-empty">⭐⭐⭐⭐</span>'; // 4 estrelas vazias
                console.log("Resultado: 1 estrela(s) (>= 20% de acerto)");
            } else { // Se a porcentagem for abaixo de 20% (ou 0%)
                starsHTML = '<span class="stars-empty">⭐⭐⭐⭐⭐</span>'; // 0 estrelas preenchidas (todas vazias)
                console.log("Resultado: 0 estrela(s) (< 20% de acerto)");
            }
            // --- FIM DA LÓGICA DAS ESTRELAS E TROFÉU ---
            
            // Constrói o HTML do indicador de progresso final no card
            progressHTML = `
                <div class="progress-indicator">
                    <span class="stars">${starsHTML}</span>
                    <span class="percentage">Acerto: ${percentage}%</span>
                </div>
            `;
        } else { // Se NÃO há progresso salvo para este módulo (módulo não iniciado)
            progressHTML = `
                <div class="progress-indicator">
                    <span class="percentage">${totalQuestions > 0 ? 'Não iniciado' : 'Em breve'}</span>
                </div>
            `;
        }
        
        // Adiciona um 'event listener' para iniciar o quiz quando o card do módulo é clicado,
        // mas somente se o módulo tiver perguntas (ou seja, não for 'Em breve')
        if (totalQuestions > 0) {
            moduleElement.addEventListener('click', () => onStartQuiz(module.id));
        } else {
            // Se o módulo não tem perguntas, ele é tratado como travado para fins de clique
            moduleElement.classList.add('locked'); 
        }
    }

    // Define o conteúdo HTML interno do card do módulo
    moduleElement.innerHTML = `
        <img src="${module.image}" alt="${module.title}" class="module-card-image">
        <div class="module-content">
            <h3>${module.title}</h3>
            <p>${module.description}</p>
        </div>
        <div class="module-footer">
            ${progressHTML}
        </div>
    `;
    return moduleElement; // Retorna o elemento HTML do card do módulo
}

/**
 * Exibe a tela de listagem de módulos e esconde a tela do quiz.
 * @param {Function} onStartQuiz - Função de callback para iniciar um quiz quando um módulo é clicado.
 */
export function showModulesView(onStartQuiz) {
    // Atualiza o cabeçalho da página para a visão de módulos
    updateHeader("Plataforma de Aprendizado ADS", "Escolha um módulo abaixo para começar seus estudos.");
    
    DOMElements.modulesContainer.innerHTML = ''; // Limpa qualquer conteúdo anterior do container de módulos
    // Para cada módulo na lista 'modules', cria seu card HTML e o adiciona ao container
    modules.forEach(module => {
        const moduleElement = createModuleHTML(module, onStartQuiz);
        DOMElements.modulesContainer.appendChild(moduleElement);
    });

    DOMElements.modulesContainer.style.display = 'grid'; // Mostra o container de módulos (usando grid para layout)
    DOMElements.quizContainer.style.display = 'none'; // Esconde o container do quiz
}

/**
 * Exibe a tela do quiz para um módulo específico e esconde a tela de módulos.
 * @param {Object} module - O objeto do módulo para o qual o quiz será exibido.
 */
export function showQuizView(module) {
    // Atualiza o cabeçalho da página com informações do quiz atual
    updateHeader(module.title, `Teste seus conhecimentos sobre ${module.title}!`, module.image);
    DOMElements.modulesContainer.style.display = 'none'; // Esconde o container de módulos
    DOMElements.quizContainer.style.display = 'block'; // Mostra o container do quiz
    DOMElements.backToModulesButton.style.display = 'inline-block'; // Mostra o botão de voltar
}

/**
 * Exibe uma tela de módulo vazio/em desenvolvimento.
 * @param {Object} module - O objeto do módulo que está vazio.
 */
export function showEmptyModuleView(module) {
    updateHeader(module.title, "Conteúdo em desenvolvimento.", module.image); // Atualiza o cabeçalho
    DOMElements.modulesContainer.style.display = 'none'; // Esconde módulos
    DOMElements.quizContainer.style.display = 'block'; // Mostra área do quiz
    DOMElements.backToModulesButton.style.display = 'inline-block'; // Mostra botão de voltar
    DOMElements.progressContainer.style.display = 'none'; // Esconde barra de progresso (não relevante para módulo vazio)
    
    // Configura a área da pergunta para exibir a mensagem de "conteúdo em breve"
    DOMElements.questionArea.style.opacity = '1'; 
    DOMElements.questionArea.style.transform = 'translateY(0)';
    DOMElements.questionText.innerHTML = `Conteúdo para "<strong>${module.title}</strong>" estará disponível em breve!`;
    DOMElements.optionsContainer.innerHTML = ''; // Limpa opções de resposta
    DOMElements.feedbackArea.style.display = 'none'; // Esconde área de feedback
    DOMElements.feedbackText.innerHTML = ''; // Limpa texto de feedback
    DOMElements.nextButton.style.display = 'none'; // Esconde botão de próxima pergunta
    DOMElements.score.parentElement.style.display = 'none'; // Esconde área de pontuação
}

/**
 * Atualiza a barra de progresso do quiz.
 * @param {number} completedCount - Número de perguntas completadas.
 * @param {number} totalCount - Número total de perguntas no quiz.
 */
export function updateProgressBar(completedCount, totalCount) {
    if (totalCount > 0) { // Garante que não haja divisão por zero
        const percentage = (completedCount / totalCount) * 100; // Calcula a porcentagem de progresso
        DOMElements.progressBar.style.width = percentage + '%'; // Atualiza a largura visual da barra
        DOMElements.progressText.textContent = `${completedCount} / ${totalCount}`; // Atualiza o texto de progresso
        DOMElements.progressContainer.style.display = 'flex'; // Mostra o container da barra de progresso
    } else {
        DOMElements.progressContainer.style.display = 'none'; // Esconde a barra se não houver perguntas
    }
}

/**
 * Atualiza a pontuação exibida na interface do usuário.
 * @param {number} score - A pontuação atual a ser exibida.
 */
export function updateScore(score) {
    DOMElements.score.textContent = score; // Define o texto do elemento da pontuação
}

/**
 * Aplica um efeito de fade-in (aparecer gradualmente) e slide-up a um elemento.
 * @param {HTMLElement} element - O elemento HTML ao qual aplicar o efeito.
 */
function fadeIn(element) {
    element.style.opacity = '0'; // Define opacidade inicial como 0 (invisível)
    element.style.transform = 'translateY(20px)'; // Move o elemento 20px para baixo
    void element.offsetWidth; // Força um "reflow" do navegador para garantir que as propriedades iniciais sejam aplicadas antes da transição
    element.style.opacity = '1'; // Define opacidade para 1 (visível), iniciando a transição
    element.style.transform = 'translateY(0)'; // Move o elemento de volta para a posição original
}

/**
 * Renderiza uma pergunta na interface do usuário e configura os botões de opção.
 * @param {Object} question - O objeto da pergunta a ser renderizada.
 * @param {Function} onAnswer - Função de callback a ser executada quando uma opção de resposta é selecionada.
 */
export function renderQuestion(question, onAnswer) {
    // Esconde/limpa elementos de feedback de uma pergunta anterior
    DOMElements.feedbackArea.style.display = 'none';
    DOMElements.feedbackText.innerHTML = '';
    DOMElements.feedbackText.className = ''; // Remove classes de feedback anteriores
    DOMElements.nextButton.style.display = 'none'; // Esconde o botão de próxima pergunta
    DOMElements.optionsContainer.innerHTML = ''; // Limpa opções de resposta anteriores
    DOMElements.score.parentElement.style.display = 'block'; // Garante que a área de pontuação esteja visível

    DOMElements.questionText.textContent = question.question; // Define o texto da pergunta

    // Embaralha as opções de resposta para que apareçam em ordem diferente a cada vez
    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

    // Cria e adiciona um botão para cada opção de resposta
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

    DOMElements.feedbackArea.style.display = 'block'; // Mostra a área de feedback
    let feedbackPrefix = ""; // Prefixo para a mensagem de feedback

    // Define a mensagem de feedback e a classe CSS com base na correção da resposta
    if (isCorrect) {
        feedbackPrefix = "<strong>Correto!</strong> ";
        DOMElements.feedbackText.classList.add('correct'); // Adiciona classe para feedback correto
    } else {
        feedbackPrefix = `<strong>Incorreto.</strong> A resposta correta é: <em>"${correctAnswer}"</em>. `;
        DOMElements.feedbackText.classList.add('incorrect'); // Adiciona classe para feedback incorreto
    }
    DOMElements.feedbackText.innerHTML = feedbackPrefix + explanation; // Define o texto e a explicação do feedback
    DOMElements.nextButton.style.display = 'inline-block'; // Mostra o botão "Próxima Pergunta"
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

    DOMElements.questionText.innerHTML = `Quiz Concluído! <br>Sua pontuação final é: <strong>${score} de ${totalQuestions}</strong>.`; // Exibe a pontuação final
    DOMElements.optionsContainer.innerHTML = ''; // Limpa as opções de resposta
    DOMElements.feedbackArea.style.display = 'block'; // Mostra a área de feedback

    let finalMessage = ""; // Mensagem final baseada no desempenho
    if (score === totalQuestions) {
        finalMessage = "Excelente! Você dominou todos os conceitos básicos. Parabéns!";
        DOMElements.feedbackText.classList.add('correct'); // Feedback positivo
    } else if (score >= totalQuestions * 0.7) {
        finalMessage = "Muito bom! Você tem um bom entendimento dos fundamentos.";
        DOMElements.feedbackText.classList.add('correct'); // Feedback positivo intermediário
    } else if (score >= totalQuestions * 0.4) {
        finalMessage = "Nada mal! Continue estudando para aprimorar seus conhecimentos.";
        DOMElements.feedbackText.className = ''; // Remove classes anteriores (deixa neutro)
    } else {
        finalMessage = "Parece que você está começando. Continue aprendendo e refaça o quiz para fixar os conceitos!";
        DOMElements.feedbackText.classList.add('incorrect'); // Feedback indicando necessidade de mais estudo
    }
    DOMElements.feedbackText.innerHTML = finalMessage; // Define o texto da mensagem final
    
    DOMElements.nextButton.textContent = 'Recomeçar Quiz'; // Muda o texto do botão para "Recomeçar Quiz"
    DOMElements.nextButton.style.display = 'inline-block'; // Mostra o botão

    // Clona o botão para remover event listeners antigos e adiciona um novo para reiniciar o quiz
    const newNextButton = DOMElements.nextButton.cloneNode(true);
    DOMElements.nextButton.parentNode.replaceChild(newNextButton, DOMElements.nextButton);
    DOMElements.nextButton = newNextButton; 
    DOMElements.nextButton.addEventListener('click', onRestart); // Adiciona o listener para reiniciar
}