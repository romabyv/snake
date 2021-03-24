const stopButton = document.getElementById('stopButton');
stopButton.onclick = () => game.timerId ? game.stop() : game.start();

const restartButton = document.getElementById('restartButton');
restartButton.onclick = () => game.initialize();

const game = new Game();

