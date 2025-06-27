function shuffleArray(array) {

    if (!array) return;

    let shuffledArray = [];
    
    while (array.length > 0) {
        const randIndex = Math.floor(Math.random() * array.length);

        shuffledArray.push(array[randIndex]);

        array.splice(randIndex, 1);
    }

    return shuffledArray;
}


module.exports = {
    shuffleArray
};