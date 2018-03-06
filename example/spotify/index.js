const {
  createVerifiedIdentityClaimObject,
  verifyIdentityClaim,
} = require('@kord.js/identity-claims')
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
      id: process.env.KORD_ID,
      privateKey: process.env.PRIVATE_KEY,
    }

    // claim property
    const property = process.env.CLAIM_PROPERTY

    // parse request body
    const { address, claimHash, claimMessage, graph, oAuthToken, signature, subject } = await json(req)

    // verify recovered address equals given address
    const isAddressVerified = verifyIdentityClaim(address, claimHash, signature)

    // verify provided OAuth token is valid by requesting private profile data
    const spotifyUser = await request({
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${oAuthToken}`,
      },
      json: true,
      uri: 'https://api.spotify.com/v1/me',
    })

    // verify claimed Spotify ID equals response profile ID
    const isSpotifyIdVerified = spotifyUser.id === claimMessage

    // throw error for unverified claims
    if (!isAddressVerified || !isSpotifyIdVerified) return {
      errors: [{
        message: 'Could not verify claim',
      }]
    }

    // generate a verified KORD Claim object
    const verifiedIdentityClaim = createVerifiedIdentityClaimObject(
      claimMessage,
      graph,
      issuer,
      property,
      subject
    )

    // return verified KORD Claim in response body
    return verifiedIdentityClaim
  } catch (e) {
    return {
      errors: [{
        message: e.message,
      }]
    }
  }
})
