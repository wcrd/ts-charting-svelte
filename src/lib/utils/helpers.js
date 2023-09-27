// JSON importer (revive JSON formatted TS into JS data objects)
function parseJSONImport(importedJSONObject){
    return JSON.parse(importedJSONObject, dateTimeReviver)
}

function dateTimeReviver(k, v){
    if(typeof v == "string"){
        // check if it is a date like string
        const res = iso8601DateTimeRegex.exec(v);
        if(res){
            return new Date(v)
        }
    }
    return v
}

const iso8601DateTimeRegex = /\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[1-2]\d|3[0-1])T(?:[0-1]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d+|)(?:Z|(?:\+|\-)(?:\d{2}):?(?:\d{2}))/

// Manual converted for Array of Objects (std. table data format)
function convertDateTime(arrayOfObjects){
    return arrayOfObjects.map((row) => {
        const output = {}
        for(const [k, v] of Object.entries(row)){
            output[k] = dateTimeReviver(k, v)
        }
        return output
    })
}

export { parseJSONImport, convertDateTime }