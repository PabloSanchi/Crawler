import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import fs from 'fs';

// wikipedia root (english)
const root = 'https://en.wikipedia.org/wiki/';
const visited = {};
let depth = 1;
const maxDepth = 1000;

// get html code
const getHtml = async (url) => {
  try {
    const response = await fetch(url);
    // printToFile(response.url.replace(root, '')+'.html', await response.text());
    if (response.status === 404) {
      console.error(`Error: ${url}`);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error(`Error: ${url}`);
  }
}

// get links from and url
const getLinks = async (url) => {
    const html = await getHtml(url);
    const $ = cheerio.load(html);
    const links = 
        $('a').map((i, link) => $(link).attr('href'))
        .filter((i, link) => link.startsWith('/wiki') && visited[(root + link.replace('/wiki/', ''))] == undefined)
        .get();

    return links;
}

// print to file the html code, given the filename and the code
const printToFile = (filename, code) => {
    if(code == null) return;

    fs.writeFile(`./results/${filename}.html`, code, (err) => {
        if (err) throw err;
        // console.log('The file has been saved!');
    });
}


const main = async () => {   
    
    console.log('Crawling...');
    
    // crawl from the root, and then from the links found in the root, for each iter depth increases
    let idx = 0, visit = [root];
    let name = 0;

    console.log(visit.length + ' links');
    
    while(visit.length > 0 && depth <= maxDepth) {
        const links = await getLinks(visit[idx]);
        // console.log(`${visit[idx]} has ${links.length} links found`);
        for(const link of links) {
            const fullLink = root + link.replace('/wiki/', '')
            visited[link] = true;
            visit.push(fullLink);
            await getHtml(fullLink).then(html => printToFile(name.toString(), html));
            // fullLink.replace(root, '').replace('/', '_')
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