require('dotenv').config()
const axios = require('axios').default
const { Webhook, MessageBuilder } = require('discord-webhook-node')
const discord = new Webhook(process.env.discordWebook)

// Configure monitor here
let wallet = process.env.wallet
let profileName = process.env.profileName
let collection = process.env.collection // Handle of collection (optional). I.e. enter 'cryptopunks' to monitor how many CryptoPunks the wallet has

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
				owner: wallet,
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
		state2 = state1
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
	console.log(`${profileName} had ${state1} NFT's, and now has ${state2}`)

	if (state1 === state2 || state2 === 0) {
		await delay(60000 * 10) // Wait 10 mins before checking for updates
		fetchApi('state2')
	} else {
		const embed = new MessageBuilder()
			.setTitle(profileName)
			.setURL(`https://opensea.io/${wallet}`)

		if (state2 > state1) {
			console.log(`${profileName} recieved an NFT!`)
			embed.setDescription(`Received an NFT!`)
		} else if (state2 < state1) {
			console.log(`${profileName} sent an NFT!`)
			embed.setDescription(`Sent an NFT!`)
		} else {
			console.log(`${profileName} either bought or sold an NFT!`)
			embed.setDescription(`Sent or received an NFT!`)
		}
		discord.send(embed)
		console.log(`See the changes on OpenSea here: https://opensea.io/${wallet} \n`)

		// Comment the following line to stop the monitor after detecting a change
		fetchApi('state1')
	}
}
