const micro = require('micro')
const listen = require('test-listen')
const request = require('request-promise')

const kordClaimsService = require('../')
const claimData = require('./fixtures/claim.json')
const verifiedClaimData = require('./fixtures/verified-claim.json')

describe('KORD Guardian micro-service', () => {
  let service

  beforeAll(async () => {
    service = micro(kordClaimsService)
  })

  afterAll(() => {
    service.close()
  })

  it('Should return a KORD Claim object', async () => {
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
    const expected = 'errors'

    expect(actual).toHaveProperty(expected)
  })
})
