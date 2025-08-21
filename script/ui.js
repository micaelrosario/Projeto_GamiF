


import { getProgress } from './state.js'; 
import { modules, quizData } from './data.js'; 

let lives = 4; 



export const DOMElements = {
    pageTitle: document.getElementById('page-title'), 
    pageSubtitle: document.getElementById('page-subtitle'), 
    outDoor: document.getElementById('outdoor-gamif'),
    rodape: document.getElementById('rodape'),
    moduleHeaderImage: document.getElementById('module-header-image'), 
    modulesContainer: document.getElementById('modules-container'), 
    quizContainer: document.getElementById('quiz-container'), 
    questionText: document.getElementById('question-text'), 
    optionsContainer: document.getElementById('options-container'), 
    feedbackArea: document.getElementById('feedback-area'), 
    feedbackText: document.getElementById('feedback-text'), 
    nextButton: document.getElementById('next-button'), 
    score: document.getElementById('score'), 
    scoreArea: document.getElementById('score-area'), 
    questionArea: document.getElementById('question-area'), 
    backToModulesButton: document.getElementById('back-to-modules-button'), 
    progressContainer: document.getElementById('progress-container'), 
    progressBar: document.getElementById('progress-bar'), 
    progressText: document.getElementById('progress-text'), 
    livesContainer: document.getElementById('lives-container'),
    topBar: document.getElementById('top-bar'),
    livesCount: document.getElementById('lives-count'),
    messageBox: document.getElementById('message-box'),
    menuLateral: document.getElementById('menu-lateral')
    
};





/**
 * Reseta o número de vidas para o valor inicial e atualiza a exibição.
 */
export function resetLives() {
    lives = 4;
    updateLivesDisplay();
}

/**
 * Atualiza o texto que exibe o número de vidas na interface.
 */
export function updateLivesDisplay() {
    if (DOMElements.livesCount) {
        DOMElements.livesCount.textContent = lives;
    }
}

/**
 * Exibe a caixa de mensagem customizada, como "Game Over".
 * @param {string} message - A mensagem a ser exibida.
 */
function showMessageBox(message) {
    if (DOMElements.messageBox) {
        DOMElements.messageBox.textContent = message;
        DOMElements.messageBox.classList.remove('hidden');
        DOMElements.messageBox.classList.add('message-box-visible');
    }
}



/**
 * Atualiza o cabeçalho principal da página com novo título, subtítulo e, opcionalmente, uma imagem.
 * @param {string} title - O novo título da página.
 * @param {string} subtitle - O novo subtítulo da página.
 * @param {string | null} imageSrc - Opcional. O caminho da imagem para o cabeçalho do módulo. Se for null, a imagem é escondida.
 */
export function updateHeader(title, subtitle, imageSrc = null) {
    DOMElements.pageTitle.textContent = title; 
    DOMElements.pageSubtitle.textContent = subtitle; 
    DOMElements.moduleHeaderImage.classList.remove('hidden'); 
}

/**
 * Cria e retorna o elemento HTML (card) para um módulo de quiz individual.
 * @param {Object} module - O objeto contendo os dados do módulo (id, title, description, image, locked).
 * @param {Function} onStartQuiz - Função de callback a ser executada quando o módulo é clicado para iniciar o quiz.
 * @returns {HTMLElement} O elemento DIV HTML representando o card do módulo.
 */
function createModuleHTML(module, onStartQuiz) {
    
    const moduleElement = document.createElement('div');
    moduleElement.classList.add('module-item'); 

    let progressHTML = ''; 
    const progressData = getProgress(); 
    const moduleProgress = progressData[module.id]; 
    const questionsForModule = quizData[module.id]?.questions || []; 
    const totalQuestions = questionsForModule.length; 

    
    if (module.locked) {
        moduleElement.classList.add('locked'); 
        progressHTML = `
            <div class="progress-indicator">
                <span class="lock-icon">🔒</span>
                <span>Em Breve</span>
            </div>`; 
    } else { 
        if (moduleProgress) { 
            const bestScore = moduleProgress.bestScore; 
            
            
            const totalForPercentage = totalQuestions; 
            const percentage = Math.round((bestScore / totalForPercentage) * 100); 

            
            let starsHTML = ''; 

            
            console.log(`--- DEBUG ESTRELAS para módulo: ${module.title} ---`);
            console.log(`bestScore: ${bestScore}, totalForPercentage: ${totalForPercentage}`);
            console.log(`Porcentagem Calculada: ${percentage}%`);
            console.log(`Is percentage >= 100? ${percentage >= 100}`);

            
            
            if (bestScore === totalForPercentage && totalForPercentage > 0) { 
                starsHTML = '<span class="trophy-icon">🏆</span>'; 
                console.log("Resultado: TROFÉU (Acertou todas!)");
            } else if (percentage >= 80) { 
                starsHTML = '<span class="stars-filled">⭐⭐⭐⭐</span>' + 
                            '<span class="stars-empty">⭐</span>';       
                console.log("Resultado: 4 estrela(s) (>= 80% de acerto)");
            } else if (percentage >= 60) { 
                starsHTML = '<span class="stars-filled">⭐⭐⭐</span>' + 
                            '<span class="stars-empty">⭐⭐</span>';    
                console.log("Resultado: 3 estrela(s) (>= 60% de acerto)");
            } else if (percentage >= 40) { 
                starsHTML = '<span class="stars-filled">⭐⭐</span>' + 
                            '<span class="stars-empty">⭐⭐⭐</span>'; 
                console.log("Resultado: 2 estrela(s) (>= 40% de acerto)");
            } else if (percentage >= 20) { 
                starsHTML = '<span class="stars-filled">⭐</span>' +    
                            '<span class="stars-empty">⭐⭐⭐⭐</span>'; 
                console.log("Resultado: 1 estrela(s) (>= 20% de acerto)");
            } 
            
            
            
            progressHTML = `
                <div class="progress-indicator">
                    <span class="stars">${starsHTML}</span>
                    <span class="percentage">Acerto: ${percentage}%</span>
                </div>
            `;
        } else { 
            progressHTML = `
                <div class="progress-indicator">
                    <span class="percentage">${totalQuestions > 0 ? 'Não iniciado' : 'Em breve'}</span>
                </div>
            `;
        }
        
        
        
        if (totalQuestions > 0) {
            moduleElement.addEventListener('click', () => onStartQuiz(module.id));
        } else {
            
            moduleElement.classList.add('locked'); 
        }
    }

    
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
    return moduleElement; 
}

/**
 * Exibe a tela de listagem de módulos e esconde a tela do quiz.
 * @param {Function} onStartQuiz - Função de callback para iniciar um quiz quando um módulo é clicado.
 */
export function showModulesView(onStartQuiz) {
    
    updateHeader("Plataforma de Aprendizado ADS", "Escolha um módulo abaixo para começar seus estudos.");
    
    DOMElements.modulesContainer.innerHTML = ''; 
    
    modules.forEach(module => {
        const moduleElement = createModuleHTML(module, onStartQuiz);
        DOMElements.modulesContainer.appendChild(moduleElement);
    });

    DOMElements.modulesContainer.style.display = 'grid'; 
    DOMElements.quizContainer.classList.add('hidden');
    DOMElements.modulesContainer.classList.remove('hidden');
    DOMElements.outDoor.classList.remove('hidden');
    DOMElements.rodape.classList.remove('hidden');
    DOMElements.scoreArea.classList.remove('hidden');
    DOMElements.menuLateral.classList.remove('hidden');
}

/**
 * Exibe a tela do quiz para um módulo específico e esconde a tela de módulos.
 * @param {Object} module - O objeto do módulo para o qual o quiz será exibido.
 */
export function showQuizView(module) {
    
    updateHeader(module.title, `Teste seus conhecimentos sobre ${module.title}!`, module.image);
    DOMElements.modulesContainer.classList.add('hidden'); 
    DOMElements.outDoor.classList.add('hidden');
    DOMElements.rodape.classList.add('hidden');
    DOMElements.scoreArea.classList.add('hidden');
    DOMElements.quizContainer.classList.remove('hidden'); 
    DOMElements.menuLateral.classList.add('hidden');
    DOMElements.backToModulesButton.style.display = 'inline-block'; 
    resetQuizState();
}

/**
 * Exibe uma tela de módulo vazio/em desenvolvimento.
 * @param {Object} module - O objeto do módulo que está vazio.
 */
export function showEmptyModuleView(module) {
    updateHeader(module.title, "Conteúdo em desenvolvimento.", module.image); 
    DOMElements.modulesContainer.classList.add('hidden'); 
    DOMElements.quizContainer.classList.add('hidden'); 
    DOMElements.backToModulesButton.style.display = 'inline-block'; 
    DOMElements.progressContainer.classList.add('hidden'); 
    
    
    DOMElements.questionArea.style.opacity = '1'; 
    DOMElements.questionArea.style.transform = 'translateY(0)';
    DOMElements.questionText.innerHTML = `Conteúdo para "<strong>${module.title}</strong>" estará disponível em breve!`;
    DOMElements.optionsContainer.innerHTML = ''; 
    DOMElements.feedbackArea.classList.add('hidden'); 
    DOMElements.feedbackText.innerHTML = ''; 
    DOMElements.nextButton.classList.add('hidden'); 
    DOMElements.score.parentElement.classList.add('hidden'); 
}

/**
 * Atualiza a barra de progresso do quiz.
 * @param {number} completedCount - Número de perguntas completadas.
 * @param {number} totalCount - Número total de perguntas no quiz.
 */
export function updateProgressBar(completedCount, totalCount) {
    if (totalCount > 0) { 
        const percentage = (completedCount / totalCount) * 100; 
        DOMElements.progressBar.style.width = percentage + '%'; 
        DOMElements.progressContainer.style.display = 'flex'; 
    } else {
        DOMElements.progressContainer.classList.add('hidden'); 
    }
}

/**
 * Atualiza a pontuação exibida na interface do usuário.
 * @param {number} score - A pontuação atual a ser exibida.
 */
export function updateScore(score) {
    DOMElements.score.textContent = score; 
}

/**
 * Aplica um efeito de fade-in (aparecer gradualmente) e slide-up a um elemento.
 * @param {HTMLElement} element - O elemento HTML ao qual aplicar o efeito.
 */
function fadeIn(element) {
    element.style.opacity = '0'; 
    element.style.transform = 'translateY(20px)'; 
    void element.offsetWidth; 
    element.style.opacity = '1'; 
    element.style.transform = 'translateY(0)'; 
}

/**
 * Renderiza uma pergunta na interface do usuário e configura os botões de opção.
 * @param {Object} question - O objeto da pergunta a ser renderizada.
 * @param {Function} onAnswer - Função de callback a ser executada quando uma opção de resposta é selecionada.
 */
export function renderQuestion(question, onAnswer) {
    
    DOMElements.feedbackArea.classList.add('hidden');
    DOMElements.feedbackText.innerHTML = '';
    DOMElements.feedbackText.className = ''; 
    
    
    DOMElements.nextButton.classList.remove('hidden');
    DOMElements.nextButton.disabled = true;
    
    DOMElements.optionsContainer.innerHTML = ''; 
    DOMElements.score.parentElement.classList.remove('hidden'); 

    
    
    
    if (lives <= 0) {
        showMessageBox("Game Over!");
        
        return;
    }

    DOMElements.questionText.textContent = question.question; 

    
    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

    
    shuffledOptions.forEach(option => {
        const button = document.createElement('button'); 
        button.textContent = option; 
        button.classList.add('option-button'); 
        
        button.addEventListener('click', () => {
            const isCorrect = option === question.correctAnswer; 
            onAnswer(isCorrect, option, button); 
            
            
            DOMElements.feedbackArea.classList.remove('hidden')
            DOMElements.nextButton.disabled = false;
        });
        DOMElements.optionsContainer.appendChild(button); 
    });

    fadeIn(DOMElements.questionArea); 
}

/**
 * Mostra o feedback visual após o usuário responder a uma pergunta.
 * @param {boolean} isCorrect - Verdadeiro se a resposta estiver correta, falso caso contrário.
 * @param {string} selectedOption - O texto da opção selecionada pelo usuário.
 * @param {HTMLElement} button - O botão HTML da opção selecionada.
 * @param {string} correctAnswer - O texto da resposta correta da pergunta.
 * @param {string} explanation - A explicação da resposta.
 * @param {Function} onStartQuiz
 */
export function showAnswerFeedback(isCorrect, selectedOption, button, correctAnswer, explanation, onStartQuiz) {
    
    const optionButtons = DOMElements.optionsContainer.querySelectorAll('.option-button');
    optionButtons.forEach(btn => {
        btn.disabled = true;
        
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct'); 
        } else if (btn === button && !isCorrect) {
            btn.classList.add('incorrect'); 
        }
    });

    DOMElements.feedbackArea.classList.remove('hidden'); 
    let feedbackPrefix = ""; 

    
    if (isCorrect) {
        feedbackPrefix = "<strong>Correto!</strong> ";
        DOMElements.feedbackText.classList.add('correct'); 
    } else {
        
        
        
        lives--; 
        updateLivesDisplay(); 
        
        
        if (lives <= 0) {
            
            showMessageBox("Game Over!");
            
            DOMElements.questionArea.classList.add('hidden');
            DOMElements.progressContainer.classList.add('hidden');
            DOMElements.topBar.classList.remove('hidden');
        } else {
             
             feedbackPrefix = `<strong>Incorreto.</strong> A resposta correta é: <em>"${correctAnswer}"</em>. `;
             DOMElements.feedbackText.classList.add('incorrect'); 
             DOMElements.feedbackText.innerHTML = feedbackPrefix + explanation; 
        }
    }
    DOMElements.feedbackText.innerHTML = feedbackPrefix + explanation; 
    DOMElements.nextButton.style.display = 'inline-block'; 

    
    if (lives > 0) {
        DOMElements.nextButton.style.display = 'inline-block'; 
    } else {
        
        
        
        
        const backButton = document.createElement('button');
        backButton.textContent = 'Voltar aos Módulos';
        backButton.classList.add('next-button');
        backButton.addEventListener('click', () => {
            
            
            showModulesView(); 
            hideMessageBox(); 
            DOMElements.questionArea.classList.remove('hidden');
            DOMElements.progressContainer.classList.remove('hidden');
        });

        
        
        DOMElements.nextButton.classList.add('next-button')
        DOMElements.nextButton.textContent = 'Retornar aos Módulos';
        DOMElements.nextButton.addEventListener('click', () => {
            showModulesView()
            hideMessageBox(); 
            DOMElements.questionArea.classList.remove('hidden');
            DOMElements.progressContainer.classList.remove('hidden');
        });
        
    }

}

/**
 * Renderiza a tela de resultados finais do quiz e configura o botão para voltar ao menu.
 * @param {number} score - A pontuação final do usuário.
 * @param {number} totalQuestions - O número total de perguntas no quiz.
 * @param {Function} onRestart - Função de callback que precisa ser passada para a `showModulesView`.
* @param {Function} onStartQuiz
*/
export function renderFinalResults(score, totalQuestions, onStartQuiz) {
    fadeIn(DOMElements.questionArea);
    updateProgressBar(totalQuestions, totalQuestions);

    DOMElements.questionText.innerHTML = `Quiz Concluído! <br>Sua pontuação final é: <strong>${score} de ${totalQuestions}</strong>.`;
    DOMElements.optionsContainer.innerHTML = '';
    DOMElements.feedbackArea.classList.remove('hidden');
    DOMElements.nextButton.classList.remove('hidden'); 

    let finalMessage = "";
    if (score === totalQuestions) {
        finalMessage = "Excelente! Você dominou todos os conceitos básicos. Parabéns!";
        DOMElements.feedbackText.classList.add('correct');
    } else if (score >= totalQuestions * 0.7) {
        finalMessage = "Muito bom! Você tem um bom entendimento dos fundamentos.";
        DOMElements.feedbackText.classList.add('correct');
    } else if (score >= totalQuestions * 0.4) {
        finalMessage = "Nada mal! Continue estudando para aprimorar seus conhecimentos.";
        DOMElements.feedbackText.className = '';
    } else {
        finalMessage = "Parece que você está começando. Continue aprendendo e refaça o quiz para fixar os conceitos!";
        DOMElements.feedbackText.classList.add('incorrect');
    }
    DOMElements.feedbackText.innerHTML = finalMessage;
    
    
    const newNextButton = DOMElements.nextButton.cloneNode(true);
    DOMElements.nextButton.parentNode.replaceChild(newNextButton, DOMElements.nextButton);
    DOMElements.nextButton = newNextButton; 
    DOMElements.nextButton.textContent = 'Retornar aos Módulos';
    DOMElements.nextButton.addEventListener('click', () => {
        showModulesView(onStartQuiz);
    });
    
    
    
    DOMElements.livesContainer.classList.add('hidden');

}

export function resetQuizState() {
    DOMElements.nextButton.textContent = 'Próxima Pergunta';
    DOMElements.nextButton.disabled = true;
    DOMElements.nextButton.classList.add('hidden');
}


document.addEventListener('DOMContentLoaded', () => {
    DOMElements.backToModulesButton.addEventListener('click', () => {
        showModulesView();
    });
});