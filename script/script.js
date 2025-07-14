import * as Confetti from './confetti.js';
import { modules, quizData } from './data.js';
import * as UI from './ui.js';
import * as State from './state.js';

/**
 * Handles the user's answer selection.
 * @param {boolean} isCorrect - Whether the selected answer was correct.
 * @param {string} selectedOption - The text of the selected option.
 * @param {HTMLElement} button - The button element that was clicked.
 */
function handleAnswer(isCorrect, selectedOption, button) {
    const question = State.appState.questions[State.appState.currentQuestionIndex];
    UI.showAnswerFeedback(isCorrect, selectedOption, button, question.correctAnswer, question.explanation);
    
    if (isCorrect) {
        State.incrementScore();
        UI.updateScore(State.appState.score);
        Confetti.playConfetti();
    }
    
    // The 'next' button is displayed by showAnswerFeedback. We just need to attach the correct listener.
    const newNextButton = UI.DOMElements.nextButton.cloneNode(true);
    UI.DOMElements.nextButton.parentNode.replaceChild(newNextButton, UI.DOMElements.nextButton);
    UI.DOMElements.nextButton = newNextButton;
    UI.DOMElements.nextButton.addEventListener('click', showNextQuestionOrResults);
}

/**
 * Advances to the next question or shows the final results if the quiz is over.
 */
function showNextQuestionOrResults() {
    State.advanceQuestion();
    
    if (State.appState.currentQuestionIndex < State.appState.questions.length) {
        const nextQuestion = State.appState.questions[State.appState.currentQuestionIndex];
        UI.renderQuestion(nextQuestion, handleAnswer);
        UI.updateProgressBar(State.appState.currentQuestionIndex, State.appState.questions.length);
    } else {
        // Quiz is finished
        State.saveProgress(State.appState.currentModuleId, State.appState.score, State.appState.questions.length);
        UI.renderFinalResults(State.appState.score, State.appState.questions.length, () => startQuiz(State.appState.currentModuleId));
        if (State.appState.score === State.appState.questions.length) {
            Confetti.playConfetti(5000);
        }
    }
}

/**
 * Starts a quiz for a given module ID.
 * @param {string} moduleId - The ID of the module to start.
 */
function startQuiz(moduleId) {
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;

    const moduleQuestions = quizData[moduleId]?.questions || [];

    if (module.locked || moduleQuestions.length === 0) {
        UI.showEmptyModuleView(module);
        return;
    }

    State.setCurrentModule(moduleId, moduleQuestions);
    UI.showQuizView(module);
    
    UI.updateScore(State.appState.score);
    UI.updateProgressBar(0, State.appState.questions.length);

    const firstQuestion = State.appState.questions[0];
    UI.renderQuestion(firstQuestion, handleAnswer);
}

/**
 * Initializes the application.
 */
function init() {
    Confetti.initConfetti(document.getElementById('confetti-canvas'));
    UI.DOMElements.backToModulesButton.addEventListener('click', () => {
        UI.showModulesView(startQuiz);
    });
    UI.showModulesView(startQuiz);
}

document.addEventListener('DOMContentLoaded', init);