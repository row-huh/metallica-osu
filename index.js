// roha to roha, row-huh, rokage and all other alter egos : DO NOT DELETE THE TEXT BELOW THIS - LET THIS BE HERE REPRESENTING THE ENTIRE SCRIPT
// MAIN LOGIC
// when dom content is loaded
//      load the interface with one simple button that says start
//      when start button is clicked on, play rhythm.mp3, drums.mp3 and guitar.mp3 at the same time
//      decide on timestamps that will be the required hit times

// Actually, I'm thinking of playing the drums.mp3 together with the other 2 sounds.
// what the user will do is button smashing to the rhythm of the whole song


// There's another approach I can take here;
        // Split up drums.mp3
        // Each note is associated to a key - i.e 1.mp3 is associated with 'a' and will need to be pressed at T + 1.2 seconds
        // The problem's that this appraoch is;
                // A) Too much work (manually associate each time stamp where there's a drum with a key(a,s,j,k)? no thank you)
                // B) Even if I do that, I will have to play the sounds at the right time, 
                // which is a tad complicating considering I do not know why there's 
                // a delay - like with key a, i associated a sound 1.mp3 - i hit a, 1.mp3 plays but for a few seconds after that I do not hear 1.mp3
                // which is strange considering 1.mp3 is a 1 second sound and the delay is easily 3-4 secs
        // Get to Stage 1 (drums playing + user just hitting keys along the beat) then figure this out

// button click logic?:
// create sort of like swimlanes for the following keys: a, s, j, k
// have the music notes fall down incrementally - each note is a dict object(or json? oh god i keep forgetting js)
// when the time comes for a key to fall down, that key is opened and it falls down on the lane of the corresponding alphabet.
// For example, current key = {alphabet: "a"} so this key will fall down along the path of 'a'
// Also, assume any one hypothetical (or an exclusive html element, like a line) to be the boundary as in if the key
// is hit at that boundary then it is a perfect hit - if not clicked upon then it must keep going down until it reaches
// the end of the viewport - at which point, the key should disappear 
// OVER



const FALL_DURATION = 2000; // Time for note to fall from top to bottom (ms)
const PERFECT_WINDOW = 50; // Perfect hit window (ms)
const GREAT_WINDOW = 100; // Great hit window (ms)
const GOOD_WINDOW = 150; // Good hit window (ms)

const NOTES = [
    { time: 2.0, key: "a" },
    { time: 2.5, key: "s" },
    { time: 3.0, key: "j" },
    { time: 3.5, key: "k" },
    { time: 4.0, key: "a" },
    { time: 4.3, key: "s" },
    { time: 4.6, key: "j" },
    { time: 5.0, key: "k" },
    { time: 5.4, key: "a" },
    { time: 5.8, key: "s" },
    { time: 6.2, key: "j" },
    { time: 6.6, key: "k" },
    { time: 7.0, key: "a" },
    { time: 7.3, key: "a" },
    { time: 7.6, key: "s" },
    { time: 8.0, key: "j" },
    { time: 8.4, key: "k" },
    { time: 8.8, key: "a" },
    { time: 9.2, key: "s" },
    { time: 9.6, key: "j" },
    { time: 10.0, key: "k" },
    { time: 10.4, key: "a" },
    { time: 10.8, key: "s" },
    { time: 11.2, key: "j" },
    { time: 11.6, key: "k" },
    { time: 12.0, key: "a" },
    { time: 12.3, key: "s" },
    { time: 12.6, key: "a" },
    { time: 13.0, key: "j" },
    { time: 13.4, key: "k" },
    { time: 13.8, key: "a" },
    { time: 14.2, key: "s" },
    { time: 14.6, key: "j" },
    { time: 15.0, key: "k" }
];

const KEYS = ['a', 's', 'j', 'k'];

let gameState = {
    score: 0,
    combo: 0,
    maxCombo: 0,
    hits: { perfect: 0, great: 0, good: 0, miss: 0 },
    isPlaying: false,
    startTime: null,
    activeNotes: [],
    spawnedNotes: new Set(),
    guitar: null,
    rhythm: null,
    drums: null
};

let lanes = {};

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    
    // Cache lane references
    lanes = {
        a: document.getElementById('key-container-a'),
        s: document.getElementById('key-container-s'),
        j: document.getElementById('key-container-j'),
        k: document.getElementById('key-container-k')
    };

    startButton.addEventListener('click', startGame);

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyRelease);
});


function startGame() {
    const startButton = document.getElementById('start-button');
    startButton.classList.add('hidden');
    
    gameState = {
        score: 0,
        combo: 0,
        maxCombo: 0,
        hits: { perfect: 0, great: 0, good: 0, miss: 0 },
        isPlaying: true,
        startTime: Date.now(),
        activeNotes: [],
        spawnedNotes: new Set()
    };
    
    updateScoreDisplay();
    playBgMusic();
    startGameLoop();
}

function playBgMusic() {
    gameState.guitar = new Audio('audios/master-of-puppets/guitar.mp3');
    gameState.rhythm = new Audio('audios/master-of-puppets/rhythm.mp3');
    gameState.drums = new Audio('audios/master-of-puppets/drums.mp3');

    // idk why but maybe coz of a slight delay the rhythm is dominating the track for some reason
    gameState.rhythm.volume = 0.3;

    // Synchronize all three tracks
    gameState.guitar.play();
    gameState.rhythm.play();
    gameState.drums.play();
    
    console.log('🎸 Master of Puppets - Playing with drums! 🥁');
}


function startGameLoop() {
    const gameLoop = setInterval(() => {
        if (!gameState.isPlaying) {
            clearInterval(gameLoop);
            return;
        }
        
        const currentTime = (Date.now() - gameState.startTime) / 1000;
        
        spawnNotes(currentTime);
        
        updateNotes(currentTime);
        
        checkMissedNotes(currentTime);
        
    }, 16); 
}

function spawnNotes(currentTime) {
    NOTES.forEach((note, index) => {
        const spawnTime = note.time - (FALL_DURATION / 1000);
        
        if (currentTime >= spawnTime && !gameState.spawnedNotes.has(index)) {
            gameState.spawnedNotes.add(index);
            createNote(note, index);
        }
    });
}

function createNote(noteData, noteId) {
    const noteElement = document.createElement('div');
    noteElement.className = `note note-${noteData.key}`;
    noteElement.textContent = noteData.key.toUpperCase();
    noteElement.dataset.noteId = noteId;
    noteElement.dataset.hitTime = noteData.time;
    noteElement.dataset.key = noteData.key;
    
    noteElement.style.top = '-60px';
    
    lanes[noteData.key].appendChild(noteElement);
    
    gameState.activeNotes.push({
        element: noteElement,
        noteId: noteId,
        hitTime: noteData.time,
        key: noteData.key,
        hit: false
    });
}

function updateNotes(currentTime) {
    gameState.activeNotes.forEach(note => {
        if (note.hit) return;
        
        const timeSinceSpawn = currentTime - (note.hitTime - FALL_DURATION / 1000);
        const progress = timeSinceSpawn / (FALL_DURATION / 1000);
        
        const laneHeight = lanes[note.key].clientHeight;
        const position = progress * laneHeight - 60;
        
        note.element.style.top = `${position}px`;
    });
}

function checkMissedNotes(currentTime) {
    gameState.activeNotes = gameState.activeNotes.filter(note => {
        if (note.hit) return false;
        
        const missWindow = note.hitTime + (GOOD_WINDOW / 1000);
        
        if (currentTime > missWindow) {
            handleMiss(note);
            note.element.remove();
            return false;
        }
        
        return true;
    });
}

function handleKeyPress(e) {
    if (!gameState.isPlaying) return;
    
    const key = e.key.toLowerCase();
    if (!KEYS.includes(key)) return;
    
    lanes[key].classList.add('active');
    
    const currentTime = (Date.now() - gameState.startTime) / 1000;
    const notesInLane = gameState.activeNotes.filter(
        note => note.key === key && !note.hit
    );
    
    if (notesInLane.length === 0) return;
    
    let closestNote = null;
    let minDiff = Infinity;
    
    notesInLane.forEach(note => {
        const diff = Math.abs(currentTime - note.hitTime);
        if (diff < minDiff) {
            minDiff = diff;
            closestNote = note;
        }
    });
    
    if (!closestNote) return;
    
    const timingDiff = Math.abs(currentTime - closestNote.hitTime) * 1000;
    
    if (timingDiff <= PERFECT_WINDOW) {
        handleHit(closestNote, 'perfect');
    } else if (timingDiff <= GREAT_WINDOW) {
        handleHit(closestNote, 'great');
    } else if (timingDiff <= GOOD_WINDOW) {
        handleHit(closestNote, 'good');
    }
}

function handleKeyRelease(e) {
    const key = e.key.toLowerCase();
    if (KEYS.includes(key)) {
        lanes[key].classList.remove('active');
    }
}

function handleHit(note, accuracy) {
    note.hit = true;
    note.element.classList.add('hit');
    
    gameState.hits[accuracy]++;
    gameState.combo++;
    
    if (gameState.combo > gameState.maxCombo) {
        gameState.maxCombo = gameState.combo;
    }
    
    const scoreMap = {
        perfect: 300,
        great: 200,
        good: 100
    };
    
    const comboBonus = Math.min(gameState.combo * 10, 500);
    gameState.score += scoreMap[accuracy] + comboBonus;
    
    showHitFeedback(note.key, accuracy);
    
    setTimeout(() => note.element.remove(), 100);
    
    updateScoreDisplay();
}

function handleMiss(note) {
    gameState.hits.miss++;
    gameState.combo = 0;
    
    showHitFeedback(note.key, 'miss');
    updateScoreDisplay();
}

// fetch hit feedback based on accuracy thingy like error points so to speak
function showHitFeedback(key, accuracy) {
    const lane = lanes[key];
    const feedback = document.createElement('div');
    feedback.className = `hit-feedback hit-${accuracy}`;
    
    const textMap = {
        perfect: 'PERFECT!',
        great: 'GREAT!',
        good: 'GOOD',
        miss: 'MISS'
    };
    
    feedback.textContent = textMap[accuracy];
    lane.appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 500);
}

function updateScoreDisplay() {
    document.getElementById('score-value').textContent = gameState.score;
    document.getElementById('combo-value').textContent = `${gameState.combo}x`;
    
    const totalHits = gameState.hits.perfect + gameState.hits.great + 
                      gameState.hits.good + gameState.hits.miss;
    const accuracy = totalHits > 0 
        ? Math.round(((gameState.hits.perfect + gameState.hits.great + gameState.hits.good) / totalHits) * 100)
        : 100;
    
    document.getElementById('accuracy-value').textContent = `${accuracy}%`;
}

console.log('Metallica OSU - behehhe');