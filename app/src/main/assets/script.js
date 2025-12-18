// ALPHABET with special chars. Space is typically first or last.
// Let's do: Space, A-Z, 0-9.
const CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const FLIP_SPEED = 150; // ms per flip (User requested "rapid", but also "milliseconds")
// 100ms is fast, 150ms is visible. "Rapid clickitclack" implies maybe even faster?
// Defaulting to 100ms for responsiveness.

let currentIndex = 0;

// UTILS
const getCharIndex = (char) => CHARS.indexOf(char);
const getNextChar = (char) => {
    const idx = CHARS.indexOf(char);
    if (idx === -1) return CHARS[0];
    return CHARS[(idx + 1) % CHARS.length];
};

const setChar = (element, char) => {
    element.innerHTML = `<span>${char}</span>`;
};

const getChar = (element) => {
    return element.innerText || " ";
};

const playSound = () => {
    const audio = document.getElementById('clack-sound');
    if (audio) {
        // Polyphonic playback: clone the node for every click
        const clone = audio.cloneNode();
        clone.volume = 0.5;
        clone.play().catch(() => { });
        clone.addEventListener('ended', () => {
            clone.remove();
        });
    }
};

const setupDisplay = () => {
    const container = document.getElementById('display');
    container.innerHTML = '';
    for (let i = 0; i < 8; i++) {
        const flap = document.createElement('div');
        flap.className = 'split-flap';
        flap.id = `flap-${i}`;

        flap.innerHTML = `
            <div class="card top" id="top-static-${i}"></div>
            <div class="card bottom" id="bottom-static-${i}"></div>
            <div class="flap top" id="top-flap-${i}"></div>
            <div class="flap bottom" id="bottom-flap-${i}"></div>
        `;
        container.appendChild(flap);

        // Init with space
        setChar(flap.querySelector('.card.top'), " ");
        setChar(flap.querySelector('.card.bottom'), " ");
        setChar(flap.querySelector('.flap.top'), " ");
        setChar(flap.querySelector('.flap.bottom'), " ");
    }
};

// Controls a SINGLE FLIP (One Step)
// Returns a Promise that resolves when the flip animation completes
const flipOnce = (index, charFROM, charTO) => {
    return new Promise((resolve) => {
        const flapEl = document.getElementById(`flap-${index}`);
        const topStatic = flapEl.querySelector('.card.top');
        const bottomStatic = flapEl.querySelector('.card.bottom');
        const topFlap = flapEl.querySelector('.flap.top');
        const bottomFlap = flapEl.querySelector('.flap.bottom');

        // Prepare State for Animation
        // TOP STATIC: Shows TARGET (TO)
        setChar(topStatic, charTO);

        // BOTTOM STATIC: Shows FROM (Stays until covered)
        setChar(bottomStatic, charFROM);

        // TOP FLAP: Shows FROM (Visible, Flips Down)
        setChar(topFlap, charFROM);

        // BOTTOM FLAP: Shows TO (Hidden, Flips Down to Cover Bottom Static)
        setChar(bottomFlap, charTO);

        // Play Sound
        playSound();

        // Trigger Animation
        flapEl.classList.remove('animating');
        void flapEl.offsetWidth; // Reflow
        flapEl.classList.add('animating');

        // Cleanup after CSS animation (roughly 200-300ms total usually)
        // We need to match the FLIP_SPEED. 
        // If we want "rapid", we might set animation duration in CSS to match FLIP_SPEED.
        // JS wait time:
        setTimeout(() => {
            // Post-Flip Cleanup
            // Bottom Static becomes TO (for the next flip to use as 'FROM')
            setChar(bottomStatic, charTO);
            // Top Flap becomes TO (Ready for next flip)
            setChar(topFlap, charTO);

            flapEl.classList.remove('animating');
            resolve();
        }, FLIP_SPEED);
    });
};

const animateFlapToChar = async (index, targetChar) => {
    const flapEl = document.getElementById(`flap-${index}`);
    // What is currently on the display?
    // We can trust the Bottom Static as the "stable" state after a flip.
    let currentChar = getChar(flapEl.querySelector('.card.bottom'));

    // Normalize target
    if (CHARS.indexOf(targetChar) === -1) targetChar = " ";

    // While not at target, Keep Flipping
    while (currentChar !== targetChar) {
        const nextChar = getNextChar(currentChar);
        await flipOnce(index, currentChar, nextChar);
        currentChar = nextChar;
    }
};

const showWord = (word) => {
    const padded = word.padEnd(8, " ").toUpperCase();

    // Launch all 8 animations in parallel
    // They will naturally stagger because some have further to go than others
    for (let i = 0; i < 8; i++) {
        animateFlapToChar(i, padded[i]);
    }
};

const loop = () => {
    // Random word from WORDS
    const nextWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    showWord(nextWord);
};

// Init
setupDisplay();

// Start
// Wait a moment for fonts/etc then start
setTimeout(loop, 1000);

// Timer
setInterval(loop, 10000);

// Interaction for Audio
document.addEventListener('click', () => {
    playSound(); // Unlock
    loop(); // Force update
});
