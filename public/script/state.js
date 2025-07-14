export const appState = {
    currentModuleId: null,
    currentQuestionIndex: 0,
    score: 0,
    questions: [],
};

export function resetQuizState() {
    appState.currentQuestionIndex = 0;
    appState.score = 0;
}

export function setCurrentModule(moduleId, questions = []) {
    appState.currentModuleId = moduleId;
    appState.questions = questions;
    resetQuizState();
}

export function incrementScore() {
    appState.score++;
}

export function advanceQuestion() {
    appState.currentQuestionIndex++;
}

const PROGRESS_STORAGE_KEY = 'gamif_progress';

export function getProgress() {
    const progressJSON = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return progressJSON ? JSON.parse(progressJSON) : {};
}

export function saveProgress(moduleId, currentScore, totalQuestions) {
    const progress = getProgress();
    if (totalQuestions === 0) return;

    const currentBest = progress[moduleId] ? progress[moduleId].bestScore : -1;
    
    if (currentScore > currentBest) {
        progress[moduleId] = { bestScore: currentScore, totalQuestions };
        localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    }
}