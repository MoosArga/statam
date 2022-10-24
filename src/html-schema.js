import fs from 'fs';

export function generateHtmlSchema(input, target) {
    fs.readFile(`${process.cwd()}/${input}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        try {
            const raw = JSON.parse(data);
            let render = initRenderer(input);
            for (let model in raw) {
                parseData(model, raw[model], render);
            }
            render.push(...closeRenderer());
            fs.writeFile(`${process.cwd()}/${target || 'target'}.html`, render.join('\n'), err => {
                if (err) {
                    console.error(err);
                }
            });
        } catch (error) {
            console.error(error);
        }
    });
}

function parseData(model, item, agg) {
    if (item) {
        const type = item.type;
        const desc = item.description;
        agg.push(`<ul>`);
        if (model) {
            agg.push(`<input type="checkbox" class="toggle-box" id="${model}-${agg.length}">
            <label class="model-name" for="${model}-${agg.length}">${model}</label>`);
        }
        if (type && (!!model || type !== 'object')) {
            agg.push('<li>');
            agg.push(`<span class="type type-${type}" title="${type[0].toUpperCase() + type.slice(1).toLowerCase()}">${type[0].toUpperCase()}</span>`)
            if (desc) {
                agg.push(`<span>${desc}</span>`)
            } else {
                agg.push(`<span class="no-description">${type[0].toUpperCase() + type.slice(1).toLowerCase()}</span>`)
            }
            agg.push('</li>');
        }
        for(let prop in item) {
            if (prop === 'properties') {
                for(let p in item.properties) {
                    parseData(p, item.properties[p], agg)
                }    
            }
            if (prop === 'items') {
                parseData('', item.items, agg)
            }
        }
        agg.push('</ul>')
    }
}

function initRenderer(name) {
    return [
        '<html>',
        '<head>',
        `<title>Schema model of ${name}</title>`,
        '<style>',
        '* { box-sizing: border-box; font-family: Roboto }',
        'body { background: rgb(20,36,51); color: white; }',
        'ul, li { list-style: none; margin: 10px 0 }',
        '.toggle-box { display: none;  }',
        '.model-name:before { position: absolute; content: "";',
        'left: -30px; top: 7px; width: 0; height: 0; border-left: 10px solid white; border-bottom: 5px solid transparent; border-top: 5px solid transparent;',
        'transform: rotate(0deg); transition: transform 0.2s ease-in-out; }',
        '.toggle-box:checked + .model-name:before { transform: rotate(90deg);  }',
        '.toggle-box:checked ~ *:not(.model-name) { display: none; }',
        '.model-name { font-weight: bold; font-size: 20px; cursor: pointer; position: relative; }',
        '.type { padding: 5px; border-radius: 5px; font-weight: bold; color: rgb(20,36,51); }',
        '.type-string { background-color: #FCB6D0 }',
        '.type-number { background-color: #D2E9E1 }',
        '.type-array { background-color: #FBEDC9 }',
        '.type-object { background-color: #F8DDA9 }',
        '.type-boolean { background-color: #B6DCB6 }',
        '.type-date { background-color: #FFDEE1 }',
        '.no-description { font-style: italic; color: #BBBBBB; }', 
        '.model-entry, li { break-inside: avoid }',
        '</style>',
        '<head>',
        '<body>',
    ]
}

function closeRenderer() {
    return [
        '</body>',
        '</html>'
    ]
}