// This is a preview of how the code will work in a browser environment
// You would save this as index.js and link it from your HTML file

// Game constants
const GAME_KEYS = ["a", "s", "d", "j", "k", "l"];
const NOTE_FALL_TIME = 2000; // Time it takes for a note to fall from top to bottom (ms)
const HIT_WINDOW = 150; // ms window for hitting notes

// Game state
let isPlaying = false;
let gameTime = 0;
let score = 0;
let combo = 0;
let notes = [];
let activeKeys = [];
let gameStarted = false;
let feedback = "";

// Animation references
let animationId = null;
let lastTime = 0;
let gameStartTime = 0;

// DOM elements (we'll get these after the DOM is loaded)
let scoreElement;
let comboElement;
let feedbackElement;
let lanesContainer;
let keyIndicators;

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get DOM elements
  scoreElement = document.getElementById('score');
  comboElement = document.getElementById('combo');
  feedbackElement = document.getElementById('feedback');
  lanesContainer = document.getElementById('lanes-container');
  keyIndicators = document.getElementById('key-indicators');
  
  // Set up event listeners for game controls
  document.getElementById('play-button').addEventListener('click', togglePlayback);
  document.getElementById('reset-button').addEventListener('click', resetGame);
  
  // Set up keyboard event listeners
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  
  // Create lanes
  createLanes();
});

// Create the game lanes
function createLanes() {
  lanesContainer.innerHTML = '';
  keyIndicators.innerHTML = '';
  
  GAME_KEYS.forEach((key, index) => {
    // Create lane
    const lane = document.createElement('div');
    lane.className = 'lane';
    lane.id = `lane-${index}`;
    lane.innerHTML = `<div class="lane-label">${key.toUpperCase()}</div>`;
    lanesContainer.appendChild(lane);
    
    // Create key indicator
    const keyIndicator = document.createElement('div');
    keyIndicator.className = 'key-indicator';
    keyIndicator.id = `key-${key}`;
    keyIndicator.textContent = key.toUpperCase();
    keyIndicators.appendChild(keyIndicator);
  });
}

// Generate the "We Will Rock You" pattern (boom boom clap)
function generateWeWillRockYouPattern() {
  const pattern = [];
  const beatDuration = 600; // ms between beats
  const measureDuration = beatDuration * 4; // 4 beats per measure
  
  // Create 8 measures of the pattern
  for (let measure = 0; measure < 8; measure++) {
    const measureStartTime = 2000 + measure * measureDuration;
    
    // First boom (on beat 1) - using A key (lane 0)
    pattern.push({
      id: `note-${measure}-1`,
      lane: 0, // A key
      time: measureStartTime,
      hit: false,
      missed: false,
      removed: false,
      element: null
    });
    
    // Second boom (on beat 2) - using A key (lane 0)
    pattern.push({
      id: `note-${measure}-2`,
      lane: 0, // A key
      time: measureStartTime + beatDuration,
      hit: false,
      missed: false,
      removed: false,
      element: null
    });
    
    // Clap (on beat 3) - using J key (lane 3)
    pattern.push({
      id: `note-${measure}-3`,
      lane: 3, // J key
      time: measureStartTime + beatDuration * 2,
      hit: false,
      missed: false,
      removed: false,
      element: null
    });
    
    // Beat 4 is silent in "We Will Rock You"
  }
  
  return pattern;
}

// Initialize the game
function startGame() {
  gameStarted = true;
  isPlaying = true;
  score = 0;
  combo = 0;
  gameTime = 0;
  feedback = "";
  notes = generateWeWillRockYouPattern();
  
  // Update UI
  updateScoreDisplay();
  setFeedback("");
  
  // Clear any existing notes from the DOM
  document.querySelectorAll('.note').forEach(note => note.remove());
  
  // Create DOM elements for all notes
  notes.forEach(note => {
    const noteElement = document.createElement('div');
    noteElement.className = 'note';
    noteElement.id = note.id;
    noteElement.innerHTML = `<span>${GAME_KEYS[note.lane].toUpperCase()}</span>`;
    
    // Add to the correct lane
    const lane = document.getElementById(`lane-${note.lane}`);
    lane.appendChild(noteElement);
    
    // Store reference to the DOM element
    note.element = noteElement;
  });
  
  gameStartTime = performance.now();
  lastTime = performance.now();
  
  if (animationId) {
    cancelAnimationFrame(animationId);
  }
  
  animationId = requestAnimationFrame(updateGameLoop);
  
  // Update button text
  document.getElementById('play-button').innerHTML = '<span>⏸️</span> Pause';
}

// Pause/resume the game
function togglePlayback() {
  if (isPlaying) {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
    document.getElementById('play-button').innerHTML = '<span>▶️</span> Resume';
  } else {
    if (gameStarted) {
      lastTime = performance.now();
      animationId = requestAnimationFrame(updateGameLoop);
      document.getElementById('play-button').innerHTML = '<span>⏸️</span> Pause';
    } else {
      startGame();
    }
  }
  isPlaying = !isPlaying;
}

// Reset the game
function resetGame() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  
  isPlaying = false;
  gameStarted = false;
  gameTime = 0;
  score = 0;
  combo = 0;
  notes = [];
  
  // Update UI
  updateScoreDisplay();
  setFeedback("");
  
  // Clear any existing notes from the DOM
  document.querySelectorAll('.note').forEach(note => note.remove());
  
  // Update button text
  document.getElementById('play-button').innerHTML = '<span>▶️</span> Start';
}

// Main game loop
function updateGameLoop(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  // Update game time
  gameTime = timestamp - gameStartTime;
  
  // Update note positions
  updateNotes();
  
  // Check for missed notes
  notes.forEach(note => {
    // If the note is 150ms past its hit time and hasn't been hit, mark it as missed
    if (!note.hit && !note.missed && !note.removed && note.time < gameTime - 150) {
      combo = 0; // Break combo on miss
      setFeedback("Miss!");
      
      // Play miss sound
      const missSound = new Audio("drums/miss.mp3");
      missSound.volume = 0.3;
      missSound.play();
      
      note.missed = true;
      note.removed = true;
      
      // Remove from DOM
      if (note.element) {
        note.element.remove();
      }
      
      // Update UI
      updateScoreDisplay();
    }
  });
  
  // Check if game is over (all notes processed)
  const allNotesProcessed = notes.every(note => note.hit || note.missed);
  const lastNoteTime = notes.length > 0 ? Math.max(...notes.map(note => note.time)) : 0;
  
  if (allNotesProcessed && gameTime > lastNoteTime + 2000) {
    isPlaying = false;
    setFeedback("Game Over!");
    document.getElementById('play-button').innerHTML = '<span>▶️</span> Restart';
    return;
  }
  
  animationId = requestAnimationFrame(updateGameLoop);
}

// Update the positions of all notes
function updateNotes() {
  notes.forEach(note => {
    if (note.removed || !note.element) return;
    
    // Calculate position based on time
    const timeUntilHit = note.time - gameTime;
    
    // Only show notes that are within the fall time window
    if (timeUntilHit > NOTE_FALL_TIME || timeUntilHit < -200) {
      note.element.style.display = 'none';
      return;
    }
    
    // Calculate vertical position (0 = top, 100% = bottom)
    const progress = 1 - (timeUntilHit / NOTE_FALL_TIME);
    const yPosition = progress * 100;
    
    // Update position
    note.element.style.display = 'flex';
    note.element.style.top = `${yPosition}%`;
  });
}

// Handle key presses
function handleKeyDown(e) {
  const key = e.key.toLowerCase();
  
  if (GAME_KEYS.includes(key) && !activeKeys.includes(key)) {
    // Update active keys for visual feedback
    activeKeys.push(key);
    updateKeyIndicators();
    
    if (isPlaying) {
      const laneIndex = GAME_KEYS.indexOf(key);
      
      // Find the closest upcoming note in this lane
      const upcomingNotes = notes.filter(
        note => note.lane === laneIndex && !note.removed
      );
      
      if (upcomingNotes.length === 0) {
        // No notes in this lane, just play the wrong sound
        setFeedback("Wrong!");
        
        // Play wrong hit sound
        const wrongSound = new Audio("drums/wrong.mp3");
        wrongSound.volume = 0.3;
        wrongSound.play();
        
        return;
      }
      
      // Sort by time and get the first (earliest) note
      upcomingNotes.sort((a, b) => a.time - b.time);
      const closestNote = upcomingNotes[0];
      const timeDiff = Math.abs(closestNote.time - gameTime);
      
      // Play the drum sound regardless of timing
      const audio = new Audio(`drums/lane-${laneIndex}.mp3`);
      audio.volume = 1.0;
      audio.play();
      
      // Calculate score based on timing accuracy
      const isGoodHit = timeDiff <= HIT_WINDOW;
      
      if (isGoodHit) {
        const accuracyScore = Math.max(100 - Math.floor(timeDiff / HIT_WINDOW * 100), 0);
        score += accuracyScore * (combo + 1);
        
        // Set feedback based on accuracy
        if (timeDiff < 30) {
          setFeedback("Perfect!");
          combo++;
        } else if (timeDiff < 70) {
          setFeedback("Great!");
          combo++;
        } else if (timeDiff < 100) {
          setFeedback("Good!");
          combo++;
        } else {
          setFeedback("OK!");
          combo++;
        }
      } else {
        // Too early or too late
        setFeedback(gameTime < closestNote.time ? "Too Early!" : "Too Late!");
        combo = 0;
      }
      
      // Mark the note as hit or missed based on timing, but always remove it
      closestNote.hit = isGoodHit;
      closestNote.missed = !isGoodHit;
      closestNote.removed = true;
      
      // Remove from DOM
      if (closestNote.element) {
        closestNote.element.remove();
      }
      
      // Update UI
      updateScoreDisplay();
    }
  }
}

// Handle key releases
function handleKeyUp(e) {
  const key = e.key.toLowerCase();
  activeKeys = activeKeys.filter(k => k !== key);
  updateKeyIndicators();
}

// Update the key indicators
function updateKeyIndicators() {
  GAME_KEYS.forEach(key => {
    const keyElement = document.getElementById(`key-${key}`);
    if (activeKeys.includes(key)) {
      keyElement.classList.add('active');
    } else {
      keyElement.classList.remove('active');
    }
  });
}

// Update the score display
function updateScoreDisplay() {
  scoreElement.textContent = score.toLocaleString();
  comboElement.textContent = `${combo}x`;
}

// Set feedback message
function setFeedback(message) {
  feedback = message;
  feedbackElement.textContent = message;
  
  // Set color based on feedback type
  feedbackElement.className = 'feedback';
  if (message === "Perfect!") {
    feedbackElement.classList.add('perfect');
  } else if (message === "Great!") {
    feedbackElement.classList.add('great');
  } else if (message === "Good!") {
    feedbackElement.classList.add('good');
  } else if (message === "OK!") {
    feedbackElement.classList.add('ok');
  } else if (message === "Miss!" || message === "Wrong!" || message.includes("Too")) {
    feedbackElement.classList.add('miss');
  } else if (message === "Game Over!") {
    feedbackElement.classList.add('game-over');
  }
}

// For testing in Node.js environment
if (typeof window === 'undefined') {
  console.log("This script is designed to run in a browser environment.");
  console.log("Game logic initialized and ready to use with HTML/CSS.");
}