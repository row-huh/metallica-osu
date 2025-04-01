// necessary variables go here
NOTES = [   // all instances where the player must intervene. 
    {"time": 1.2, "key": "a"},
    {"time": 2.2, "key": "s"},
    {"time": 3.2, "key": "j"},
    {"time": 4.2, "key": "k"}
]

KEYS = ['a', 's', 'j', 'k']
// NOTES attributes: Time is the time at which they should intervene, key is the action they must take, sound is the sound that will play when the provided action is taken


// roha to roha : DO NOT EDIT THE TEXT BELOW THIS - LET THIS BE HERE REPRESENTING THE ENTIRE SCRIPT
// MAIN LOGIC
// when dom content loaded is loaded
//      load the interface with one simple button that says start
//      when start button is clicked on, play rhythm.mp3 and guitar.mp3 at the same time


// button click logic?:
// create sort of like swimlanes for the following keys: a, s, j, k
// have the music notes fall down incrementally - each note is a dict object(or json? oh god i keep forgetting js)
// when the time comes for a key to fall down, that key is opened and it falls down on the lane of the corresponding alphabet.
// For example, current key = {alphabet: "a"} so this key will fall down along the path of 'a'
// Also, assume any one hypothetical (or an exclusive html element, like a line) to be the boundary as in if the key
// is hit at that boundary then it is a perfect hit - if not clicked upon then it must keep going down until it reaches
// the end of the viewport - at which point, the key should disappear 
// OVER


document.addEventListener('DOMContentLoaded', ()=> {
    // load interface that only has one button which says 'start'
    // when the start button is clicked on, call the createLanes function
    start.addEventListener('onclick', () => {
        A = document.getElementById("key-container-a")
        S = document.getElementById("key-container-s")
        J = document.getElementById("key-container-j")
        K = document.getElementById("key-container-k")

        keys = {A, S, J, K}
        // const lanes = createLanes(KEYS)
        // somehow play the background music
        playBgMusic("master-of-puppets")
        // somehow have the notes start falling down
        playNotes(NOTES, keys)

        
    })
    // somehow figure out how it's all gonna go down next 
    // somehow figure out the point system 
})




// i probably don't need this function 
function createLanes(keys) {
    // somehow create one container / div for each key in the array KEYS
}


export function playBgMusic(song) {
    let guitar = new Audio('../audios/master-of-puppets/guitar.mp3') // had to change path for test - might need to change again (remove ../)
    let rhythm = new Audio('../audios/master-of-puppets/rhythm.mp3')
    console.log("The music should start playing here")
    guitar.play()
    rhythm.play()
}



function playNotes(notes, lanes) {
    // somehow, eaach note must be read 1 second before it must be executed
    // that 1 sec is for the falling down animation
    // The notes shouldn't go incrementally - like one goes through then we read the other
    // Instead, notes should start appearing T minus 1 second, I think I need something asynchronous here
    }