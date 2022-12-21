import { parentPort, workerData } from 'worker_threads';
import {getHtml, printToFile} from './tools.js';

const {name, fullLink} = workerData;

getHtml(fullLink)
.then(html => 
    printToFile(name.toString(), html
));

parentPort.postMessage(`Worker finished!`);

