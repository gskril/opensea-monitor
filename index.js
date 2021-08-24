const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const notifier = require('node-notifier');

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
const selector = ".athing .title>a:first-of-type";
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const checkForMatchingContent = async () => {
	const state1 = await getData(url, selector, 2000);
	await delay(5000);
	const state2 = await getData(url, selector, 2000);

	if (state1 === state2) {
		// console.log('Original content: ' + state1);
		return checkForMatchingContent();
	} else {
		notifier.notify({
			title: 'Page Monitor',
			message: `Top post on HackerNews changed from ${state1} to ${state2}`
		})
		return console.log(`Top post on HackerNews changed from ${state1} to ${state2}`)
	}
}

checkForMatchingContent()