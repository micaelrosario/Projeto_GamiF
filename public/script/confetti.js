import 'confetti-lib'

let confettiInstance = null;

export function initConfetti(canvasElement) {
    if (!canvasElement) {
        console.error("Confetti canvas not found");
        return;
    }
    const confettiSettings = {
        target: canvasElement,
        max: 120,
        size: 1.1,
        animate: true,
        props: ['circle', 'square', 'triangle'],
        colors: [[0,123,255],[40,167,69],[255,193,7],[220,53,69]],
        clock: 30,
        rotate: true,
        start_from_edge: false,
        respawn: false,
    };
    confettiInstance = new window.ConfettiGenerator(confettiSettings);
}

export function playConfetti(duration = 2500) {
    if (confettiInstance) {
        confettiInstance.render();
        setTimeout(() => {
             if (confettiInstance) confettiInstance.clear();
        }, duration);
    }
}

