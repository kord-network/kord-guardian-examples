const {
  createVerifiedIdentityClaimObject,
  verifyIdentityClaim,
} = require('@meta.js/identity-claims')
const { json } = require('micro')
const microCors = require('micro-cors')
const request = require('request-promise')

// configure CORS
const cors = microCors({ allowMethods: ['POST'] })

// set env variables in non-production environments
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './test/fixtures/.env' })
}

module.exports = cors(async (req, res) => {
  try {
    // claim issuer
    const issuer = {
      id: process.env.META_ID,
      privateKey: process.env.PRIVATE_KEY,
    }

    // claim property
    const property = process.env.CLAIM_PROPERTY

    // parse request body
    const { address, claimHash, claimMessage, oAuthToken, signature, subject } = await json(req)

    // verify recovered address equals given address
    const isAddressVerified = verifyIdentityClaim(address, claimHash, signature)

    // verify provided OAuth token is valid by requesting private profile data
    const facebookUser = await request({
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${oAuthToken}`,
      },
      json: true,
      uri: 'https://graph.facebook.com/me?fields=id,link,name',
    })

    // verify claimed Facebook name equals response user name
    const isFacebookUserVerified = facebookUser.name === claimMessage

    // throw error for unverified claims
    if (!isAddressVerified || !isFacebookUserVerified) return {
      errors: [{
        message: 'Could not verify claim'
      }]
    }

    // generate a verified META Identity Claim object
    // use Facebook user's profile link as claim message
    const verifiedIdentityClaim = createVerifiedIdentityClaimObject(
      facebookUser.link,
      issuer,
      property,
      subject
    )

    // return verified META Identity Claim in response body
    return verifiedIdentityClaim
  } catch (e) {
    return {
      errors: [e]
    }
  }
})
