# Guide to writing a KORD Guardian micro-service

1. Install the
   [KORD Guardian CLI](https://github.com/kord-network/kord-guardian-cli):
   ```bash
   npm install -g @kord.js/guardian-cli
   ```

2. Use the CLI to generate a new KORD Guardian micro-service boilerplate:
   ```bash
   kord-guardian generate service
   ```

3. The core dependencies can then be installed by running:
   ```bash
   npm install
   ```

4. Next, create a `.env` file in `test/fixtures/` and add your service config:
   ```
   CLAIM_PROPERTY=service.id
   KORD_ID=0xE4258268bf30F9540EeBfF7150148E387bcE0a2f
   PRIVATE_KEY=9969281b7a152e6e6c9bdaf60f64ad6882956c31f56241960eeae90d6980e6e7
   ```
   - `CLAIM_PROPERTY` is the property of the claim the service will verify
   - `KORD_ID` is the Ethereum public address associated with your KORD Graph
   - `PRIVATE_KEY` is the corresponding private key of the Ethereum account

5. The micro-service can be started by running:
   ```bash
   npm start
   ```
   Try sending a request using this example of a verifiable claim:
   ```
   {
     "address": "0xEe078019375fBFEef8f6278754d54Cf415e83329",
     "claimHash": "0x111ac54a68c3b29b9eabab1f814a9f6163c6e434b65d5d1a42e245a7016cba7c",
     "claimMessage": "Your Name",
     "graph": "0xEe078019375fBFEef8f6278754d54Cf415e83329",
     "signature":  "0x2d2a2b63f14130c09e092d5c8a95fee1b32ab0b9f927d7d76efa8b38450342342fba919ce9ff01792a717ea3686fcdd98bade8672ff9ae540ef3e2d284a4445500",
     "subject": "0xEe078019375fBFEef8f6278754d54Cf415e83329"
   }
   ```

6. The template can be customised with additional verification checks, such as
   [OAuth](https://oauth.net/), [TLS Notary](https://tlsnotary.org/), [2FA](https://en.wikipedia.org/wiki/Multi-factor_authentication),
   [JWT](https://jwt.io/) etc.

7. The tests and test data can be updated as you build your KORD Guardian
   micro-service. Tests can be run with:
   ```bash
   npm test
   ```

8. When your KORD Guardian micro-service is ready to be added to the KORD
   Network, it will need to be deployed. We are currently working on a
   deployment process for the KORD Testnet.
