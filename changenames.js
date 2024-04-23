let str = "abpsdxzzf"; 

function isIsogram(str) {
    str = str.toLowerCase();
    let charMap = {};
    for (let char of str) {
        if (charMap[char]) return false;
        charMap[char] = true;
    }
    
    return true;
}

console.log(isIsogram(str))