const {
  bufferToHex,
  ecrecover,
  ecsign,
  fromRpcSig,
  pubToAddress,
  sha3,
  toRpcSig
} = require('ethereumjs-util')

const { json } = require('micro')
const request = require('request-promise')

// set env variables in non-production environments
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './test/fixtures/.env' })
}

module.exports = async (req, res) => {
  // META Claims Service keys from env config
  const metaClaimsService = {
    address: process.env.ETHEREUM_ADDRESS,
    privateKey: process.env.PRIVATE_KEY,
  }

  // parse request body
  const { address, claimHash, claimValue, oAuthToken, signature } = await json(req)

  // generate signature parameters
  const { v, r, s } = fromRpcSig(signature)

  // generate claim buffer from claim hash minus `0x` prefix
  const claimBuffer = Buffer.from(claimHash.substring(2), 'hex')

  // recover public key from claim
  const recoveredPublicKey = ecrecover(claimBuffer, v, r, s)

  // generate Ethereum address hex from public key
  const recoveredAddress = bufferToHex(pubToAddress(recoveredPublicKey))

  // verify recovered address equals given address
  const isAddressVerified = recoveredAddress === address

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
  const isSpotifyIdVerified = spotifyUser.id === claimValue

  // throw error for unverified claims
  if (!isAddressVerified || !isSpotifyIdVerified) return {
    errors: [{
      message: 'Could not verify claim'
    }]
  }

  // set the claim value being verified
  const verifiedClaimValue = claimValue

  // generate verified claim buffer from verified claim value
  const verifiedClaimBuffer = sha3(verifiedClaimValue)

  // generate ECDSA signature of verified claim buffer using the MCS private key
  const verifiedClaimSignatureObject = ecsign(
    verifiedClaimBuffer,
    Buffer.from(metaClaimsService.privateKey, 'hex')
  )

  // convert ECDSA signature buffer to hex value
  const verifiedClaimSignature = toRpcSig(
    verifiedClaimSignatureObject.v,
    verifiedClaimSignatureObject.r,
    verifiedClaimSignatureObject.s
  )

  // return response body
  return {
    claim: verifiedClaimValue,
    issuer: metaClaimsService.address,
    signature: verifiedClaimSignature,
    subject: address,
  }
}
