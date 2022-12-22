import { Worker, isMainThread, workerData } from 'worker_threads';
import { getLinks, getHtml, printToFile, root } from './tools.js';

const visited = {};
const maxDepth = 1000;

const main = async () => {   
    
    console.log('Crawling...');
    
    let idx = 0, visit = [root];
    let name = 0;
    
    while(Object.keys(visited).length <= maxDepth) {
        
        const links = await getLinks(visit[0], visited);

        for(const link of links) {
            const fullLink = root + link.replace('/wiki/', '')
            visited[link] = true;
            visit.push(fullLink);
            name = link.replace('/wiki/', '');
            // remove from symbols (%,/,:,=) from the name variable
            name = name.replace(/[%/:=]/g, '');
            
            const html = await getHtml(fullLink)
            printToFile(name.toString(), html)
            
        }

        visit.shift()
    }

    console.log(`${Object.keys(visited).length} links crawled`);
    console.log('Finished');
}

main();