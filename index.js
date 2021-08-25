const fetch = require('node-fetch')
const notifier = require('node-notifier')

let offset = 0
const profile = '0xff0bd4aa3496739d5667adc10e2b843dfab5712b'
const url = `https://api.opensea.io/api/v1/assets?owner=${profile}&order_direction=desc&offset=${offset}&limit=20`
const options = { method: 'GET' }
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

fetch(url, options)
	.then((res) => res.json())
	.then((json) => saveStartingPoint(json))
	.catch((err) => console.error('error:' + err))

saveStartingPoint = (json) => {
	const state1 = Object.keys(json.assets).length

	// if state1 === 20, make api call again with offset +20. Repeat until the offset < 20, then add all previous results together

	console.log(state1)
	checkForMatchingContent()
}

async function checkForMatchingContent() {
	await delay(5000)
	fetch(url, options)
		.then((res) => res.json())
		.then((json) => saveState2(json))
		.catch((err) => console.error('error: ' + err))

	saveState2 = (json) => {
		const state2 = Object.keys(json.assets).length
		console.log(state2)
	}

	// if state1 === state2, repeat checkForMatchingContent. Otherwise, send notification and stop. Or startover
	
}

/* 
notifier.notify({
	title: 'OpenSea Monitor',
	message: `${openseaProfile} bought or sold an NFT. From ${state1} to ${state2}`,
})
 */
