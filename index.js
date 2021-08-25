const jsdom = require('jsdom')
const { JSDOM } = jsdom
const notifier = require('node-notifier')

async function getData(url, selector, timeout) {
	const virtualConsole = new jsdom.VirtualConsole()
	virtualConsole.sendTo(console, { omitJSDOMErrors: true })
	const dom = await JSDOM.fromURL(url, {
		runScripts: 'dangerously',
		resources: 'usable',
		virtualConsole,
	})
	const data = await new Promise((res, rej) => {
		const started = Date.now()
		const timer = setInterval(() => {
			const element = dom.window.document.querySelector(selector)
			if (element) {
				res(element.textContent)
				clearInterval(timer)
			} else if (Date.now() - started > timeout) {
				rej('Timed out')
				clearInterval(timer)
			}
		}, 100)
	})
	dom.window.close()
	return data
}

const openseaProfile = 'logz'
const url = 'https://opensea.io/' + openseaProfile
const selector = 'aside[data-testid="ProfilePage--sidebar"] > ul:first-of-type > li:first-of-type > a > div > span'
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const checkForMatchingContent = async () => {
	await delay(5000)
	try {
		const state1 = await getData(url, selector, 2000)
	} catch (error) {
		console.log('Couldn\'t get state 1')
	}
	await delay(5000)
	const state2 = await getData(url, selector, 2000)

	if (state1 === state2) {
		console.log('Items collected: ' + state1)
		return checkForMatchingContent()
	} else {
		notifier.notify({
			title: 'OpenSea Monitor',
			message: `${openseaProfile} bought or sold an NFT. From ${state1} to ${state2}`,
		})
		return console.log(
			`${openseaProfile} bought or sold an NFT. From ${state1} to ${state2}`
		)
	}
}

checkForMatchingContent()
