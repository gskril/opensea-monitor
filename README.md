# OpenSea Web Monitor
Monitor OpenSea profiles and get notified via Discord when they send or receive NFT's.  

**Note**: Receiving an NFT does not necessarily mean the user bought it. Any person can send an NFT to any wallet and it would be picked up by this monitor. [See this example](https://twitter.com/gregskril/status/1430585478399631361).
  
## How To Use
1. Clone the project
	```bash
	git clone https://github.com/gskril/opensea-monitor.git
	```

2. Go to the project directory
	```bash
	cd opensea-monitor
	```

3. Install dependencies
	```bash
	npm install
	```

4. Configure the monitor in the .env file. This includes the Discord Webhook URL and wallet information. Some influencer wallets to get you started are:
	- Logal Paul: 0xff0bd4aa3496739d5667adc10e2b843dfab5712b
	- FaZe Banks: 0x7d4823262bd2c6e4fa78872f2587dda2a65828ed
	- Gary Vee: 0x5ea9681c3ab9b5739810f8b91ae65ec47de62119
	- KSI: 0x87badfcc6b5eb79acbd108d1208d82dc6a6d48ab  
  
5. Start the monitor
	```bash
	npm start
	```
  
## How It Works
1. Get the number of collected items based on configuration variables using the [OpenSea assets API](https://docs.opensea.io/reference/getting-assets)
2. Store value returned in step 1 as `state1` variable
3. Repeat step 1 every 10 minutes and store value as `state2` variable
4. Once the variables from step 2 and 3 are not equal, send Discord notification
	- If `state2` > `state1`, the monitored profile recieved an NFT
	- If `state2` < `state1`, the monitored profile sent an NFT

## Additional Notes
- You will need an OpenSea API key to use this script. They are notoriously slow at responding to these requests, but you can [try it here](https://docs.opensea.io/reference/request-an-api-key).
- NFT's can be hidden on OpenSea profiles, but the API still tracks them. This might make the number you see on OpenSea's website next to "Collected" and the number returned by this monitor different.
