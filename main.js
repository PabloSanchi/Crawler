import { Worker, isMainThread, workerData } from 'worker_threads';
import { getLinks, root } from './tools.js';

const visited = {};
let depth = 1;
const maxDepth = 1000;

const main = async () => {   
    
    console.log('Crawling...');
    
    // crawl from the root, and then from the links found in the root, for each iter depth increases
    let idx = 0, visit = [root];
    let name = 0;

    console.log(visit.length + ' links');
    
    while(visit.length > 0 && depth <= maxDepth) {
        const links = await getLinks(visit[idx], visited);
    
        for(const link of links) {
            const fullLink = root + link.replace('/wiki/', '')
            visited[link] = true;
            visit.push(fullLink);
            
            const worker = new Worker('./worker.js', { workerData: { name, fullLink } });
  
            worker.on('message', (msg) => console.log('worker says: ', msg));
            // worker.on('error', (err) => console.log('worker error: ', err));
  
            name++;
        }
        visit.shift()
        // visit.splice(0,(visit.length-links.length));
        console.log(visit.length + ' links');

        depth++;
    }
    
    console.log('Finished');
}

main();