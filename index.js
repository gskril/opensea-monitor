const fetch = require('node-fetch')
const notifier = require('node-notifier')

const profile = '0xff0bd4aa3496739d5667adc10e2b843dfab5712b'
const url = `https://api.opensea.io/api/v1/assets?owner=${profile}&order_direction=desc&offset=0&limit=5`
const options = { method: 'GET' }

fetch(url, options)
	.then((res) => res.json())
	.then((json) => checkForMatchingContent(json))
	.catch((err) => console.error('error:' + err))

checkForMatchingContent = (json) => {
	const state1 = Object.keys(json.assets).length
	return console.log(state1)
}

notifier.notify({
	title: 'OpenSea Monitor',
	message: `${openseaProfile} bought or sold an NFT. From ${state1} to ${state2}`,
})