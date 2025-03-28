
const notes = [
    {key: "a", time: 2.02},
    {key: "a", time: 3.5},
]

document.addEventListener('DOMContentLoaded', () => {
    //background music playing logic
    let play = document.getElementById("play");


    document.addEventListener('keydown', handleKeyDown);  
    play.addEventListener("click", playMusic);


})
                                                                                                              

function handleKeyDown (event) {
    const key = event.key.toLowerCase();
    const currentTime = performance.now() / 1000; // Convert to seconds

    playNote(key, currentTime);
}


function playNote(key, currentTime, audio) {
    for (const note of notes) {
        if (note.key === key) {
            const errorMargin = 0.2; // Allow 200ms deviation

            if (Math.abs(currentTime - note.time) <= errorMargin) {
                console.log(`🎯 Perfect! Played ${key} at ${currentTime.toFixed(2)}s`);
            } else if (currentTime < note.time) {
                console.log(`⌛ Too early! Expected at ${note.time}s`);
            } else {
                console.log(`⏳ Too late! Expected at ${note.time}s`);
            }

            // Play the sound no matter what
            const sound = new Audio(audio);
            sound.currentTime = note.time
            sound.play();
            break;
        }
    }
}




function playMusic() {
 let guitar = new Audio("audios/master-of-puppets/guitar.mp3");
 let rhythm = new Audio("audios/master-of-puppets/rhythm.mp3");
 let drums = new Audio("audios/master-of-puppets/drums.mp3")
 // user will have to play drums
 guitar.play()
 rhythm.play()
 playDrums(drums)
}

function playDrums(drums) {

}