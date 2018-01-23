const micro = require('micro')
const listen = require('test-listen')
const request = require('request-promise')

const metaClaimsService = require('../')
const claimData = require('./fixtures/claim.json')
const verifiedClaimData = require('./fixtures/verified-claim.json')

describe('META Claims Service', () => {
  let service

  beforeAll(async () => {
    service = micro(metaClaimsService)
  })

  afterAll(() => {
    service.close()
  })

  it('Should return a META Claim object', async () => {
    const uri = await listen(service)

    const body = await request({
      body: claimData,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      method: 'POST',
      uri,
    })

    const actual = body
    const expected = verifiedClaimData

    expect(actual).toEqual(expected)
  })

  it('Should return an error object', async () => {
    const uri = await listen(service)

    const invalidClaimData = { ...claimData, oAuthToken: null }

    const body = await request({
      body: invalidClaimData,
      headers: {
        'Content-Type': 'application/json',
      },
      json: true,
      method: 'POST',
      uri,
    })

    const actual = body
    const expected = { errors: [{ message: 'Could not verify claim' }] }

    expect(actual).toEqual(expected)
  })
})
