import { getProgress } from './state.js';
import { modules, quizData } from './data.js';

export const DOMElements = {
    pageTitle: document.getElementById('page-title'),
    pageSubtitle: document.getElementById('page-subtitle'),
    moduleHeaderImage: document.getElementById('module-header-image'),
    modulesContainer: document.getElementById('modules-container'),
    quizContainer: document.getElementById('quiz-container'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    feedbackArea: document.getElementById('feedback-area'),
    feedbackText: document.getElementById('feedback-text'),
    nextButton: document.getElementById('next-button'),
    score: document.getElementById('score'),
    questionArea: document.getElementById('question-area'),
    backToModulesButton: document.getElementById('back-to-modules-button'),
    progressContainer: document.getElementById('progress-container'),
    progressBar: document.getElementById('progress-bar'),
    progressText: document.getElementById('progress-text'),
};

export function updateHeader(title, subtitle, imageSrc = null) {
    DOMElements.pageTitle.textContent = title;
    DOMElements.pageTitle.textContent = title; // Linha duplicada, remover
    DOMElements.pageSubtitle.textContent = subtitle;
    if (imageSrc) {
        DOMElements.moduleHeaderImage.src = imageSrc;
        DOMElements.moduleHeaderImage.alt = title;
        DOMElements.moduleHeaderImage.style.display = 'block';
    } else {
        DOMElements.moduleHeaderImage.style.display = 'none';
    }
}

function createModuleHTML(module, onStartQuiz) {
    const moduleElement = document.createElement('div');
    moduleElement.classList.add('module-item');

    let progressHTML = '';
    const progressData = getProgress();
    const moduleProgress = progressData[module.id];
    const questionsForModule = quizData[module.id]?.questions || [];
    const totalQuestions = questionsForModule.length; // Total de perguntas ATUAL do módulo

    if (module.locked) {
        moduleElement.classList.add('locked');
        progressHTML = `
            <div class="progress-indicator">
                <span class="lock-icon">🔒</span>
                <span>Em Breve</span>
            </div>`;
    } else {
        if (moduleProgress) {
            const bestScore = moduleProgress.bestScore; // Número de acertos do usuário
            const totalForPercentage = totalQuestions; // Total de perguntas do módulo (do quizData)
            const percentage = Math.round((bestScore / totalForPercentage) * 100);

            // Mantenha os console.logs para depuração! Eles são muito úteis.
            console.log(`--- DEBUG ESTRELAS para módulo: ${module.title} ---`);
            console.log(`bestScore: ${bestScore}, totalForPercentage: ${totalForPercentage}`);
            console.log(`Porcentagem Calculada: ${percentage}%`);

            let starsHTML = '';
            const totalVisualStars = 5; // O total de slots de estrela visualmente ainda é 5

            // --- NOVO TRECHO DE CÓDIGO CORRIGIDO: Lógica para estrelas ou troféu ---
            // Se o número de acertos for igual ao total de perguntas do módulo (acertou todas)
            if (bestScore === totalForPercentage && totalForPercentage > 0) { // Isso significa 100% de acerto
                starsHTML = '<span class="trophy-icon">🏆</span>';
                console.log("Resultado: TROFÉU (Acertou todas!)");
            } else if (percentage >= 80) { // Se 80% ou mais (mas não 100%)
                // Ex: 80% (4 de 5 questões)
                starsHTML = '<span class="stars-filled">⭐⭐⭐⭐</span>'
                console.log("Resultado: 4 estrela(s) (>= 80% de acerto)");
            } else if (percentage >= 60) { // Se 60% ou mais (mas menos de 80%)
                // Ex: 60% (3 de 5 questões)
                starsHTML = '<span class="stars-filled">⭐⭐⭐</span>'
                console.log("Resultado: 3 estrela(s) (>= 60% de acerto)");
            } else if (percentage >= 40) { // Se 40% ou mais (mas menos de 60%)
                // Ex: 40% (2 de 5 questões)
                starsHTML = '<span class="stars-filled">⭐⭐</span>'
                console.log("Resultado: 2 estrela(s) (>= 40% de acerto)");
            } else if (percentage >= 20) { // Se 20% ou mais (mas menos de 40%)
                // Ex: 20% (1 de 5 questões)
                starsHTML = '<span class="stars-filled">⭐</span>'
                console.log("Resultado: 1 estrela(s) (>= 20% de acerto)");
            } else { // Se a porcentagem for abaixo de 20% (ou 0%)
                starsHTML = '<span class="stars-empty">⭐⭐⭐⭐⭐</span>'; // 0 estrelas preenchidas
                console.log("Resultado: 0 estrela(s) (< 20% de acerto)");
            }
            progressHTML = `
                <div class="progress-indicator">
                    <span class="stars">${starsHTML}</span>
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

export function showModulesView(onStartQuiz) {
    updateHeader("Plataforma de Aprendizado ADS", "Escolha um módulo abaixo para começar seus estudos.");
    
    DOMElements.modulesContainer.innerHTML = '';
    modules.forEach(module => {
        const moduleElement = createModuleHTML(module, onStartQuiz);
        DOMElements.modulesContainer.appendChild(moduleElement);
    });

    DOMElements.modulesContainer.style.display = 'grid';
    DOMElements.quizContainer.style.display = 'none';
}

export function showQuizView(module) {
    updateHeader(module.title, `Teste seus conhecimentos sobre ${module.title}!`, module.image);
    DOMElements.modulesContainer.style.display = 'none';
    DOMElements.quizContainer.style.display = 'block';
    DOMElements.backToModulesButton.style.display = 'inline-block';
}

export function showEmptyModuleView(module) {
    updateHeader(module.title, "Conteúdo em desenvolvimento.", module.image);
    DOMElements.modulesContainer.style.display = 'none';
    DOMElements.quizContainer.style.display = 'block';
    DOMElements.backToModulesButton.style.display = 'inline-block';
    DOMElements.progressContainer.style.display = 'none';
    
    DOMElements.questionArea.style.opacity = '1';
    DOMElements.questionArea.style.transform = 'translateY(0)';
    DOMElements.questionText.innerHTML = `Conteúdo para "<strong>${module.title}</strong>" estará disponível em breve!`;
    DOMElements.optionsContainer.innerHTML = '';
    DOMElements.feedbackArea.style.display = 'none';
    DOMElements.feedbackText.innerHTML = '';
    DOMElements.nextButton.style.display = 'none';
    DOMElements.score.parentElement.style.display = 'none';
}

export function updateProgressBar(completedCount, totalCount) {
    if (totalCount > 0) {
        const percentage = (completedCount / totalCount) * 100;
        DOMElements.progressBar.style.width = percentage + '%';
        DOMElements.progressText.textContent = `${completedCount} / ${totalCount}`;
        DOMElements.progressContainer.style.display = 'flex';
    } else {
        DOMElements.progressContainer.style.display = 'none';
    }
}

export function updateScore(score) {
    DOMElements.score.textContent = score;
}

function fadeIn(element) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    void element.offsetWidth; // Trigger reflow
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
}

export function renderQuestion(question, onAnswer) {
    DOMElements.feedbackArea.style.display = 'none';
    DOMElements.feedbackText.innerHTML = '';
    DOMElements.feedbackText.className = '';
    DOMElements.nextButton.style.display = 'none';
    DOMElements.optionsContainer.innerHTML = '';
    DOMElements.score.parentElement.style.display = 'block';

    DOMElements.questionText.textContent = question.question;

    const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.addEventListener('click', () => {
            const isCorrect = option === question.correctAnswer;
            onAnswer(isCorrect, option, button);
        });
        DOMElements.optionsContainer.appendChild(button);
    });

    fadeIn(DOMElements.questionArea);
}

export function showAnswerFeedback(isCorrect, selectedOption, button, correctAnswer, explanation) {
    const optionButtons = DOMElements.optionsContainer.querySelectorAll('.option-button');
    optionButtons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add('correct');
        } else if (btn === button && !isCorrect) {
            btn.classList.add('incorrect');
        }
    });

    DOMElements.feedbackArea.style.display = 'block';
    let feedbackPrefix = "";

    if (isCorrect) {
        feedbackPrefix = "<strong>Correto!</strong> ";
        DOMElements.feedbackText.classList.add('correct');
    } else {
        feedbackPrefix = `<strong>Incorreto.</strong> A resposta correta é: <em>"${correctAnswer}"</em>. `;
        DOMElements.feedbackText.classList.add('incorrect');
    }
    DOMElements.feedbackText.innerHTML = feedbackPrefix + explanation;
    DOMElements.nextButton.style.display = 'inline-block';
}

export function renderFinalResults(score, totalQuestions, onRestart) {
    fadeIn(DOMElements.questionArea);
    updateProgressBar(totalQuestions, totalQuestions);

    DOMElements.questionText.innerHTML = `Quiz Concluído! <br>Sua pontuação final é: <strong>${score} de ${totalQuestions}</strong>.`;
    DOMElements.optionsContainer.innerHTML = '';
    DOMElements.feedbackArea.style.display = 'block';

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
        DOMElements.feedbackText.classList.add('incorrect'); // CORREÇÃO AQUI
    }
    DOMElements.feedbackText.innerHTML = finalMessage;
    
    DOMElements.nextButton.textContent = 'Recomeçar Quiz';
    DOMElements.nextButton.style.display = 'inline-block';
    
    const newNextButton = DOMElements.nextButton.cloneNode(true);
    DOMElements.nextButton.parentNode.replaceChild(newNextButton, DOMElements.nextButton);
    DOMElements.nextButton = newNextButton; 
    DOMElements.nextButton.addEventListener('click', onRestart);
}