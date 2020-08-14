export const removeDuplicates = (arr) => {
    let tmp = [];
    return arr.filter((item) => {
        if (tmp.indexOf(item.toString()) < 0) {
            tmp.push(item.toString());
            return item;
        }
    });
}

export const isPresentInArray = (arrayToSearch, elementToFind) => {
    let elemString = elementToFind.toString();
    for(let i = 0; i < arrayToSearch.length; i++) {
        if(arrayToSearch[i].toString() === elemString) return true;
    }
    return false;
}

export const checkIfInteger = (number) => {
    return number % 1 === 0;
}
