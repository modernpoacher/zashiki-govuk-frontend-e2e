import puppeteer from 'puppeteer'

import {
  expect
} from 'chai'

import debug from '#zashiki/debug'

const log = debug('zashiki/e2e')

log('`zashiki` is awake')

const getTextContent = ({ textContent = '' }) => textContent.trim()

describe('@modernpoacher/zashiki-govuk-frontend', () => {
  describe('`Zashiki`', () => {
    /**
   *  @type {puppeteer.Browser}
   */
    let browser

    before(async () => { browser = await puppeteer.launch({ acceptInsecureCerts: true, headless: true }) })

    after(async () => await browser.close())

    it('is awake', async () => {
      const page = await browser.newPage()
      await page.goto('https://localhost:5001')
      await page.waitForSelector('h1')

      expect(await page.$eval('h1', getTextContent)).to.equal('Zashiki')
    })
  })
})
