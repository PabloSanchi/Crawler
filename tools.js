import fetch from "node-fetch";
import * as cheerio from "cheerio";
import fs from "fs";

// wikipedia root (english)
const root = "https://en.wikipedia.org/wiki/";

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
};

// get links from and url
const getLinks = async (url, visited) => {
	const html = await getHtml(url);
	const $ = cheerio.load(html);
	const links = $("a")
		.map((i, link) => $(link).attr("href"))
		.filter(
			(i, link) =>
				link.startsWith("/wiki") &&
				visited[root + link.replace("/wiki/", "")] == undefined
		)
		.get();

	return links;
};

// print to file the html code, given the filename and the code
const printToFile = (filename, code) => {
	if (code == null) return;

	fs.writeFile(`./results/${filename}.html`, code, (err) => {
		if (err) throw err;
		// console.log('The file has been saved!');
	});
};

export { getHtml, getLinks, printToFile, root };
