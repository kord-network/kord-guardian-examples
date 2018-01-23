const {
  createVerifiedIdentityClaimObject,
  verifyIdentityClaim,
} = require('@meta.js/identity-claims')
const { json } = require('micro')
const microCors = require('micro-cors')

// Configure CORS
const cors = microCors({ allowMethods: ['POST'] })

// Set env variables in non-production environments
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './test/fixtures/.env' })
}

module.exports = cors(async (req, res) => {
  // Set the claim issuer from environment variables
  const issuer = {
    id: process.env.META_ID,
    privateKey: process.env.PRIVATE_KEY,
  }

  // Set the claim property from environment variables
  const property = process.env.CLAIM_PROPERTY

  // Parse request body
  const { address, claimHash, claimMessage, signature, subject } = await json(req)

  /**
   * Verify claim sender's identity
   */

  // Recover claim subject's address from signature and verify recovered address
  // matches given address
  const verified = verifyIdentityClaim(address, claimHash, signature)

  /**
   * Insert additional verification
   */

  // ...

  /**
   * Claim verification failed
   */

  // throw error for unverified claims
  if (!verified) return {
    errors: [{
      message: 'Could not verify claim'
    }]
  }

  /**
   * Claim verification passed
   */

  // Generate a verified META Identity Claim object
  const verifiedIdentityClaim = createVerifiedIdentityClaimObject(
    claimMessage,
    issuer,
    property,
    subject
  )

  // Return verified META Identity Claim in response body
  return verifiedIdentityClaim
})
