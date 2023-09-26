// // Quick script to process the example TS data into a more usable format for our testing
// import TSData from '../src/data/example_ts_21s.json' assert { type: 'json' }

// import * as fs from 'fs';

// // 1: Process data to be key-value array
// const keys = TSData.Columns.map(c => c.ColumnName)

// const result = []

// TSData.Rows.forEach((row) => {
//     result.push( 
//         Object.assign({}, ...keys.map((k, idx) => ({
//             [k]: row[idx]
//             })
//         ))
//     )
// })


// // Async functions are functions that return a promise in a more concise way.
// async function writeToFile(filename, file) {
//     let fj = JSON.stringify(file, undefined, 2)
//     // fs.readFileSync will automatically reject the promise with the error when it encounters an error
//     fs.writeFileSync(filename, fj, {
//          encoding: "utf8"
//     })
//     return // This line is the equivalent of resolve(), this line is optional too.
// }
// // fs.writeFile('./ts_data.json', JSON.stringify(result), (e)=>console.debug(e))

// writeToFile("ts.json", TSData)




