const axios = require('axios').default
const notifier = require('node-notifier')

// Customize monitor here
let profile = '0xff0bd4aa3496739d5667adc10e2b843dfab5712b' // Logan Paul wallet address
let profileName = 'Logan Paul'
let collection = '' // See how many items in a certain collection the above profile owns

// Leave these untouched
let offset = 0
let itemsArray = []
let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

fetchApi()
async function fetchApi() {
	await delay(250) // Try to avoid OpenSea API rate limiting

	axios
		.request({
			method: 'GET',
			url: 'https://api.opensea.io/api/v1/assets',
			params: {
				owner: profile,
				offset: offset,
				limit: '50',
				collection: collection,
			},
		})
		.then(function (response) {
			let numberOfItemsInCall = Object.keys(response.data.assets).length
			itemsArray.push(numberOfItemsInCall)
			if (numberOfItemsInCall === 50) {
				offset = offset + 50
				fetchApi()
			} else {
				addAllCalls(itemsArray)
			}
		})
}

function addAllCalls(itemsArray) {
	let totalItems = 0
	for (let i = 0; i < itemsArray.length; i++) {
		totalItems += itemsArray[i]
	}
	console.log(`${profileName} has ${totalItems} NFT's`)
}

/* 
notifier.notify({
	title: 'OpenSea Monitor',
	message: `${profileName} bought or sold an NFT. From ${state1} to ${state2}`,
})
 */
