export const removeDuplicates = (arr) => {
    let tmp = [];
    return arr.filter((v) => {
        if (tmp.indexOf(v.toString()) < 0) {
            tmp.push(v.toString());
            return v;
        }
    });
}