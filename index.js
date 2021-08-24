/* 
	https://stsourlidakis.com/blog/monitor-elements-on-a-webpage-with-nodejs/
*/

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function getData(url, selector, timeout) {
	const virtualConsole = new jsdom.VirtualConsole();
	virtualConsole.sendTo(console, { omitJSDOMErrors: true });
	const dom = await JSDOM.fromURL(url, {
		runScripts: "dangerously",
		resources: "usable",
		virtualConsole,
	});
	const data = await new Promise((res, rej) => {
		const started = Date.now();
		const timer = setInterval(() => {
			const element = dom.window.document.querySelector(selector);
			if (element) {
				res(element.textContent);
				clearInterval(timer);
			} else if (Date.now() - started > timeout) {
				rej("Timed out");
				clearInterval(timer);
			}
		}, 100);
	});
	dom.window.close();
	return data;
}

const url = "https://news.ycombinator.com/news";
const selector = "#score_28290765";
// getData(url, selector, 2000).then((result) => console.log(result));
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const checkForMatchingContent = async () => {
	const state1 = await getData(url, selector, 2000);
	await delay(5000);
	const state2 = await getData(url, selector, 2000);

	if (state1 === state2) {
		console.log('Original content: ' + state1);
		return checkForMatchingContent();
	} else {
		console.log('Original content: ' + state1);
		console.log('After content: ' + state2);
		return console.log("its not a match")
	}
}

checkForMatchingContent()