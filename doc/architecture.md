# Architecture

## Introduction

**META Identity Claims Services** are micro-services that expose a single HTTP
endpoint. Requests can be sent to this endpoint with a verifiable identity claim
object in the body. This claim will be verified and, if all verification checks
pass, a verified **META Identity Claim** object will be returned. This verified
identity claim can then be added to the **META Claims Index** in the **META
Network**. The META Claims Index can be queried by other services to establish the
credentials of a **META Identity**.

## Supported languages

Currently, `Node.js` is the only officially supported language. Although META
Identity Claims Services could be written in other languages, the supporting
documentation and boilerplate code depend on the
[`meta.js`](https://github.com/meta-network/meta.js) library. Official support
for other languages will be added as other external libraries are developed.

## Data flow

1. A verifiable claim is sent to the META Identity Claims Service via an HTTP
   request

   ![1](https://user-images.githubusercontent.com/1913316/35090435-92e70f00-fc31-11e7-89d8-a8ea7e0a7058.png)

2. The META Identity Claims Service MUST recover the sender's Ethereum address
   from the claim signature and verify that it matches the address sent in the
   body of the claim

   ```
   verifyIdentityClaim(address, claimHash, signature)
   ```

3. Additional verification CAN be made on the claim. For example: OAuth,
   TLS Notary, JWT, 2FA, social network statements, national ID document checks.

4. The META Identity Claims Service MUST return a verified META Identity Claim
   object

   ```
   createVerifiedIdentityClaimObject(claimMessage, issuer, property, subject)
   ```

   ![2](https://user-images.githubusercontent.com/1913316/35090436-93043e54-fc31-11e7-8ab2-f2ba0c0feee6.png)

5. The verified META Identity Claim CAN then be added to META Claims Index in
   the META Network by the claim subject.
