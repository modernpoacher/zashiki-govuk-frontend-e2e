import debug from 'debug'

import puppeteer from 'puppeteer'

import {
  expect
} from 'chai'

const log = debug('zashiki:e2e')

log('`zashiki` is awake')

const getTextContent = (element) => element.textContent.trim()

describe('@modernpoacher/zashiki-govuk-frontend', () => {
  before(() => {
    const {
      env: {
        DEBUG
      }
    } = process

    if (DEBUG) debug.enable(DEBUG)
  })

  let browser
  let page

  before(async () => { browser = await puppeteer.launch({ ignoreHTTPSErrors: true }) })

  after(async () => await browser.close())

  describe('`Zashiki`', () => {
    it('is awake', async () => {
      page = await browser.newPage()

      await page.goto('https://localhost:5001') // , { waitUntil: 'networkidle2' })
      await page.waitForSelector('h1')

      return expect(await page.$eval('h1', getTextContent)).to.equal('Zashiki')
    })
  })
})
