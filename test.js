// figuring out how to send out the note 1 second before it's to be executed,
// the extra one second will be for the animation


const notes = [
    { key: "A", time: 3 },
    { key: "B", time: 6 },
    { key: "C", time: 9 }
];

const startTime = Date.now();

const timer = setInterval(() => {
    const currentTime = Math.floor((Date.now() - startTime) / 1000)
})
