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

function arrayEqual2D(array1, array2) {
    if (array1.length !== array2.length) return false;
    
    for (let i = 0; i < array1.length; i++) {
        sub_array1 = array1[i];
        sub_array2 = array2[i];

        if (sub_array1.length !== sub_array2.length) return false;

        for (let j = 0; j < sub_array1.length; j++) {
            if (sub_array1[j] !== sub_array2[j]) return false;
        }
    }

    return true;
}


module.exports = {
    shuffleArray,
    arrayEqual2D
};