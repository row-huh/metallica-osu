// necessary variables go here
NOTES = [   // all instances where the player must intervene. 
    {"time": 1.2, "key": "a"},
    {"time": 2.2, "key": "s"},
    {"time": 3.2, "key": "j"},
    {"time": 4.2, "key": "k"}
]
// NOTES attributes: Time is the time at which they should intervene, key is the action they must take, sound is the sound that will play when the provided action is taken

KEYS = ['a', 's', 'j', 'k']


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

console.log("Before running script")

document.addEventListener('DOMContentLoaded', ()=> {
    const start = document.getElementById('start-button');
    // load interface that only has one button which says 'start'
    // when the start button is clicked on, call the createLanes function
    start.addEventListener('click', () => {
        A = document.getElementById("key-container-a");
        S = document.getElementById("key-container-s");
        J = document.getElementById("key-container-j");
        K = document.getElementById("key-container-k");

        keys = {A, S, J, K};
        // const lanes = createLanes(KEYS)
        // somehow play the background music - DONE
        playBgMusic("master-of-puppets")
        // somehow have the notes start falling down
        playNotes(NOTES, keys)

        const a_sound = new Audio('../audios/master-of-puppets/lvl1/1.mp3');

        // if a,s,j,k are pressed
        // putting this inside dom content loaded and start clicked bcz i only need
        // to accept keys after the two pre-reqs have been fulfilled: 
        // 1. the page is loaded
        // 2. the background music is playing
        document.addEventListener('keydown', function(e) {
            if (e.key == 'a' || e.key == 'A') {
                a_sound.play();
                console.log("A pressed");
            } else if (e.key == 's' || e.key == 'S') {
                console.log("S pressed");
            } else if (e.key == 'j' || e.key == 'J') {
                console.log("J pressed");
            } else if (e.key == 'k' || e.key == 'K') { 
                console.log("K pressed");
            } else {
                console.log("Irrelevant key pressed");
            }
        // somehow figure out how it's all gonna go down next 
})


    })

})



// UPDATE: i probably don't need this function 
function createLanes(keys) {
    // somehow create one container / div for each key in the array KEYS
}



// start playing the guitar and the rhythm
function playBgMusic(song) {
    let guitar = new Audio('../audios/master-of-puppets/guitar.mp3') // had to change path for test - might need to change again (remove ../)
    let rhythm = new Audio('../audios/master-of-puppets/rhythm.mp3')
    console.log("The music should start playing here")
    guitar.play()
    rhythm.play()
}



function playNotes(notes, lanes) {
    // somehow, each note must be read 1 second before it must be executed
    // that 1 sec is for the falling down animation - CSS?
    // The notes shouldn't go incrementally - like one goes through then we read the other
    // Instead, notes should start appearing T minus 1 second for each note, I think I need something asynchronous here

    startTime = Date.now()

    // create an interval that runs after every 10th of a second;
    const interval = setInterval(() => {
        const currentTime = (Date.now() - startTime) / 1000;
        
        // for loop which runs each 0.1 second later
    }, 100) // 100 ms
}