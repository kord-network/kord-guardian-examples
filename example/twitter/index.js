const {
  bufferToHex,
  ecrecover,
  ecsign,
  fromRpcSig,
  pubToAddress,
  sha3,
  toBuffer,
  toChecksumAddress,
  toRpcSig
} = require('ethereumjs-util')

const { json } = require('micro')
const microCors = require('micro-cors')

// configure CORS
const cors = microCors({ allowMethods: ['POST'] })

// set env variables in non-production environments
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './test/fixtures/.env' })
}

module.exports = cors(async (req, res) => {
  // META Claims Service config
  const metaClaimsService = {
    id: process.env.META_ID,
    privateKey: process.env.PRIVATE_KEY,
    property: process.env.CLAIM_PROPERTY,
  }

  // parse request body
  const { address, claimHash, claimMessage, signature, subject } = await json(req)

  // generate signature parameters
  const { v, r, s } = fromRpcSig(signature)

  // generate claim buffer from claim hash minus `0x` prefix
  const claimBuffer = Buffer.from(claimHash.substring(2), 'hex')

  // recover public key from claim
  const recoveredPublicKey = ecrecover(claimBuffer, v, r, s)

  // generate Ethereum address hex from public key
  const recoveredAddress = toChecksumAddress(
    bufferToHex(pubToAddress(recoveredPublicKey))
  )

  // verify recovered address equals given address
  const verified = recoveredAddress === address

  // throw error for unverified claims
  if (!verified) return {
    errors: [{
      message: 'Could not verify claim'
    }]
  }

  // set the claim value being verified
  const verifiedClaimValue = claimMessage

  // generate verified claim buffer
  const verifiedClaimBuffer = sha3(Buffer.concat([
    toBuffer(metaClaimsService.id),
    toBuffer(subject),
    toBuffer(metaClaimsService.property),
    toBuffer(verifiedClaimValue),
  ]))

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
    issuer: metaClaimsService.id,
    property: metaClaimsService.property,
    signature: verifiedClaimSignature,
    subject: subject,
  }
})
