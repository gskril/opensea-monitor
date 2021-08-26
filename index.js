const axios = require('axios').default
const notifier = require('node-notifier')

// Customize monitor here
let profile = '0xff0bd4aa3496739d5667adc10e2b843dfab5712b' // Logan Paul wallet address
let profileName = 'Logan Paul'
// let profile = '0x179a862703a4adfb29896552df9e307980d19285' // Greg wallet address
// let profileName = 'Greg'
let collection = '' // See how many items in a certain collection the above profile owns

// Leave these untouched
let offset = 0
let itemsArray = []
let delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

fetchApi('state1')
async function fetchApi(stateName) {
	await delay(500) // Try to avoid OpenSea API rate limiting

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
				fetchApi(stateName)
			} else {
				addAllCalls(stateName, itemsArray)
			}
		})
}

function addAllCalls(stateName, itemsArray) {
	let state2 = 0

	if (stateName == 'state1') {
		state1 = 0
		for (let i = 0; i < itemsArray.length; i++) {
			state1 += itemsArray[i]
		}
	} else if (stateName == 'state2') {
		for (let i = 0; i < itemsArray.length; i++) {
			state2 += itemsArray[i]
		}
	}

	checkForUpdates(state1, state2)
}

async function checkForUpdates(state1, state2) {
	itemsArray = []
	offset = 0
	console.log(
		`${profileName} has ${state1} NFT's in state1, and ${state2} NFT's in state2`
	)

	if (state1 === state2 || state2 === 0) {
		await delay(60000 * 10) // Wait 10 mins before checking for updates
		fetchApi('state2')
	} else {
		if (state2 > state1) {
			console.log(`${profileName} has recieved an NFT!`)
			notifier.notify({
				title: 'OpenSea Monitor',
				message: `${profileName} has recieved an NFT!`,
			})
		} else if (state2 < state1) {
			console.log(`${profileName} has sent an NFT!`)
			notifier.notify({
				title: 'OpenSea Monitor',
				message: `${profileName} has sent an NFT!`,
			})
		} else {
			console.log(`${profileName} has either bought or sold an NFT!`)
			notifier.notify({
				title: 'OpenSea Monitor',
				message: `${profileName} has either bought or sold an NFT!`,
			})
		}
	}
}
