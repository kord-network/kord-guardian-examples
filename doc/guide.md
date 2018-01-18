# Guide to writing a META Identity Claims Service

1. Start by cloning the META Identity Claims Service template, which can be
   found in [the root of this repository](https://github.com/meta-network/meta-identity-claims-service).
   You'll need the following files:
   - `index.js` - Basic META Identity Claims micro-service code
   - `package.json` - For managing dependencies and development scripts
   - `README.md` - A guide to developing the micro-service
   - `/test` - Micro-service tests and fixtures

2. The core dependencies can then be installed by running:
   ```
   npm install
   ```

3. Next, create a `.env` file in `test/fixtures/` with your service config:
   ```
   CLAIM_PROPERTY=service.id
   ETHEREUM_ADDRESS=0xE4258268bf30F9540EeBfF7150148E387bcE0a2f
   META_ID=0x2013ce5cacbfb860251db4c55f0ed4d70e89c6c6700a5fd7a38fe45afa12ec92
   PRIVATE_KEY=9969281b7a152e6e6c9bdaf60f64ad6882956c31f56241960eeae90d6980e6e7
   ```
   - `CLAIM_PROPERTY` is the property of the claim the service will verify
   - `ETHEREUM_ADDRESS` and `PRIVATE_KEY` are
      [from your keystore](https://www.myetherwallet.com/).
   - `META_ID` is a
      [`keccak256` hash](https://emn178.github.io/online-tools/keccak_256.html)
      of your META ID username eg. `jaak.id.meta`

4. The micro-service can be started by running:
   ```
   npm start
   ```
   Try sending a request using this example of a verifiable claim:
   ```
   {
     "address": "0xadE4772179087732696bE0Bc947412C6c5098Dd6",
     "claimHash": "0xe864f1c2c17d143cfbc1ae68f2977e0068a2b13342f12834a4184c8a31d7b84f",
     "claimMessage": "ray.id.meta",
     "signature": "0x156e0666d92c5f382825f961c6a380398674b0a3aba30f994f1b26ab3d330c653d03db0b0985dda16cbce0f7deffaebebd8259516028bf099ef9ec25f44a7a1100",
     "subject": "0xe864f1c2c17d143cfbc1ae68f2977e0068a2b13342f12834a4184c8a31d7b84f"
   }
   ```

5. The template can be customised with additional verification checks, such as
   [OAuth](https://oauth.net/), [TLS Notary](https://tlsnotary.org/), [JWT](https://jwt.io/) etc.

6. The tests and test data can be updated as you build out your META Identity
   Claims Service. Tests can be run with:
   ```
   npm test
   ```

7. When your META Identity Claims Service is ready to be added to the META
   Network, it will need to be deployed.
   _TODO - deployment details to be written._
