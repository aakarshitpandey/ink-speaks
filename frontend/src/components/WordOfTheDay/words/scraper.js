const fs = require('fs')
// const csvParser = require('csvtojson')
const words = require('./words.json')

// const convertCSV = () => {
//     csvParser({ noheader: false, delimiter: '\t' }).fromFile('./words.csv').then((src) => {
//         console.log(src)
//         fs.writeFileSync('./words.json', JSON.stringify(src))
//     })
// }


function getHash(string) {
    let hash = 0
    let len = string.length
    if (string.length === 0) {
        return hash;
    }
    for (let i = 0; i < len; i++) {
        let charC = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + charC;
        hash = hash & hash; // Convert to 32bit integer
    }

    return Math.abs(hash) % 6000;
}

export default () => {
    const today = new Date()
    const idx = getHash(`${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`)
    return words[idx]
}