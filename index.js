#!/usr/bin/env node

import { generateHtmlSchema } from './src/html-schema.js';
import { prepareSchema } from './src/prepare-schema.js';
import minimist from 'minimist';


const args = minimist(process.argv.slice(2));

const commandArgs = args._;
const mode = commandArgs[0];
const input = commandArgs[1];
const target = commandArgs[2];

switch(mode) {
    case 'generate': {
        if (input) {
            generateHtmlSchema(input, target);
        } else {
            console.error('No input file specified !!')
        }
        break;
    }
    case 'prepare': {
        if (input) {
            prepareSchema(input, target);
        } else {
            console.error('No input file specified !!')
        }
        break;
    }
    default: {
        console.log('Launch statam with specified options : statam <generate or prepare> <json input file> --target <target filename>')
    }
}
    
    

