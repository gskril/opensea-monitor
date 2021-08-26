# Notes for OpenSea Web Monitor

## Flow
1. User enters username or wallet address
	- Offer defaults like Logal Paul, KSI, FaZe Banks, Gary Vee, etc.
2. Get number of collected items using the [OpenSea assets API](https://docs.opensea.io/reference/getting-assets)
3. Store value returned in step 2 as `state1` variable
4. Repeat step 2 every few minutes and store value as `state2` variable
5. Once the variables from step 3 and 4 are not equal, notify user
	- If `state2` > `state1`, the monitored profile recieved an NFT
	- If `state2` < `state1`, the monitored profile sent an NFT

## Additional Notes
- OpenSea does have an API that returns a users assets. It's limited to 50 items, but can be offset to go further (put it in a loop)
- NFT's can be hidden on OpenSea profiles. This would throw off scraping, but the API still picks those up

## Ideas
- Make Twitter bot that tweets when there's activity in celebs' OpenSea accounts. Inspired by [@BigTechAlert](https://twitter.com/bigtechalert)