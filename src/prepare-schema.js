import fs from 'fs';

export function prepareSchema(input, target) {
    fs.readFile(`${process.cwd()}/${input}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const raw = JSON.parse(data);
        let jsonResult = {};
        for (let model in raw) {
            parseData(model, raw[model], jsonResult);
        }
        fs.writeFile(`${process.cwd()}/${target || 'target'}.json`, JSON.stringify(jsonResult), err => {
            if (err) {
                console.error(err);
            }
        });
    });
}

function parseData(model, item, agg) {
    if (item) {
        agg[model] = { description: '' };
        if (typeof(item) === 'object') {
            if(Array.isArray(item)) {
                agg[model]['type'] = 'array';
                parseData('items', item[0], agg[model])
            } else {
                agg[model]['type'] = 'object';
                agg[model]['properties'] = {};
                for(let prop in item) {
                    parseData(prop, item[prop], agg[model]['properties'])
                }
            }
        } else {
            agg[model]['type'] = typeof(item);
        }
    }
}
