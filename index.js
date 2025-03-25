document.addEventListener('DOMContentLoaded', () => {

    document.addEventListener('keydown', handleKeyDown);  
    document.addEventListener('keyup', handleKeyUp);

})


function handleKeyDown (event) {
    const key = event.key.toLowerCase();


    if (key == 'a') {
        let a_sound = new Audio('./audios/guitar.mp3')
        a_sound.play()
    }
    if (key == 'j') {
        let j_sound = new Audio('snare2.wav')
        j_sound.play()
    }
}

