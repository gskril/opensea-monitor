# Notes for OpenSea Web Monitor

## npm Packages:
- https://www.npmjs.com/package/jsdom


## GitHub Repo References
- https://github.com/antoniomuso/web-monitoring
- https://github.com/JuanmaMenendez/website-change-monitor

## Flow
1. User enters username or wallet address
2. Scrape OpenSea profile for number of collected items
	```css
	aside[data-testid="ProfilePage--sidebar"] > ul:first-of-type > li:first-of-type > a > div > span
	```
3. Store value returned in step 2 as variable using jsdom
4. Repeat step 3 every 5-10 minutes and store as new variable
5. Once the variables from step 3 and 4 are not equal, notify user
	- If var2 > var1, the monitored profile bought an NFT
	- If v2 < v1, the monitored profile sold an NFT