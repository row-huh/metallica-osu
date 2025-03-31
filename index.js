// necessary variables go here
//NOTES = [   // all instances where the player must intervene. 
//    {"time": 1.2, "key": "a", "sound" : "1.mp3"}
//]  

//KEYS = ['a', 's', 'j', 'k']
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



document.addEventListener('DOMContentLoaded', ()=> {
    // load interface that only has one button which says 'start'
    // when the start button is clicked on, call the createLanes function
    start.addEventListener('onclick', () => {
        createLanes(KEYS)
        // somehow play the background music
        playBgMusic("master-of-puppets")
        // somehow have the notes start falling down
        playNotes(NOTES)

        
    })
    // somehow figure out how it's all gonna go down next 
    // somehow figure out the point system 
})



function createLanes(keys) {
    // for each key in the array KEYS (a,s,d or whatever)
    // get the total width of the viewport and then divide by the total length of array KEYS
    // assign one partition for each key - this should somehow, im not yet sure how, but it should help
    // in guiding each note where to fall
    // return something? do i need to save any info here? the center of each lane maybe?? 
    // like the exact horizontal place (each note area's center) where the key is supposed to fall
    // return {key : "a", center: "difference from the left in pixels(int)"}??


}

export function playBgMusic(song) {
    // somehow play the bg music
    console.log("Oh look you have reached the function")
    let guitar = new Audio('../audios/master-of-puppets/guitar.mp3') // had to change path for test - might need to change again (remove ../)
    let rhythm = new Audio('../audios/master-of-puppets/rhythm.mp3')
    console.log("The music should start playing here")
    guitar.play()
    rhythm.play()
}



function playNotes(notes) {
    // somehow have the notes start falling down

    // um i was thinking if there is any way that i start counting time
    // and only when the current time matches the time attribute of the next element
    // should the note be played?
    // or maybe current time - delay matches the time attribute??
    // because you have to deduct out the time it would take for it to fall?? gahhhhh idk
}