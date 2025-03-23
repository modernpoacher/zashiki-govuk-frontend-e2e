import debug from 'debug'

import puppeteer from 'puppeteer'

import {
  expect
} from 'chai'

const log = debug('zashiki/e2e')

log('`zashiki` is awake')

const getTextContent = ({ textContent = '' }) => textContent.trim()

const EMBARK = 'https://localhost:5001/embark-stage'
const DEBARK = 'https://localhost:5001/debark-stage'
const CONFIRM = 'https://localhost:5001/confirm-stage'

/*
 *  To ensure consistency of behaviour `page.click()` to submit a form or a link _is not_ resolved with `await` --
 *  instead an immediately subsequent call to `page.waitForNavigation()` _is_ resolved
 */

describe('@modernpoacher/zashiki-govuk-frontend/array', () => {
  /**
   *  @type {puppeteer.Browser}
   */
  let browser

  before(async () => { browser = await puppeteer.launch({ acceptInsecureCerts: true, headless: true }) })

  after(async () => await browser.close())

  describe('Embark', () => {
    /**
     *  @type {puppeteer.Page}
     */
    let page

    before(async () => {
      page = await browser.newPage()

      await page.goto(EMBARK, { waitUntil: 'load' })
    })

    it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Embark'))

    it('Has a <button />', async () => expect(await page.$eval('body main button.govuk-button', getTextContent)).to.equal('Start'))

    describe('Zashiki', () => {
      it('Has a <legend />', async () => {
        expect(await page.$eval('body main fieldset legend', getTextContent)).to.equal('Schema for Collections')
      })

      it('Has a <label />', async () => {
        expect(await page.$eval('body main fieldset label', getTextContent)).to.equal('Collection')
      })

      it('Has a Select component', async () => expect(await page.$('body main fieldset select')).not.to.be.null)
    })
  })

  describe('Array', () => {
    /**
     *  @type {puppeteer.Page}
     */
    let page

    before(async () => {
      page = await browser.newPage()

      await page.goto(EMBARK, { waitUntil: 'load' })

      await page.screenshot({ path: '.screenshots/embark-array-1.png' })

      await page.evaluate(() => {
        const option = Array.from(document.querySelectorAll('body main fieldset select option')) // @ts-expect-error
          .find(({ text }) => text === 'Array') // @ts-expect-error
        if (option) option.selected = true
      })

      await page.screenshot({ path: '.screenshots/embark-array-2.png' })

      await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

      page.click('body main button.govuk-button')

      await page.waitForNavigation()

      await page.screenshot({ path: '.screenshots/embark-array-3.png' })
    })

    describe('Array - Array (String - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-array'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-string-array-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Array)'))

      it('Has a String component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/array-string-array-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-string-array-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Array - Array (String - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-object'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-string-object-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Object)'))

      it('Has a String component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/array-string-object-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-string-object-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Array - Array (Number - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-array'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-number-array-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-number-array-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', '1')

        await page.screenshot({ path: '.screenshots/array-number-array-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/array-number-array-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Array)'))

      it('Has a Number component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', '1')

          await page.screenshot({ path: '.screenshots/array-number-array-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-number-array-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto(ROUTE, { waitUntil: 'load' })

          await page.screenshot({ path: '.screenshots/array-number-array-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/array-number-array-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-number-array-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Array - Array (Number - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-object'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-number-object-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-number-object-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', '1')

        await page.screenshot({ path: '.screenshots/array-number-object-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/array-number-object-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Object)'))

      it('Has a Number component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', '1')

          await page.screenshot({ path: '.screenshots/array-number-object-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-number-object-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto(ROUTE, { waitUntil: 'load' })

          await page.screenshot({ path: '.screenshots/array-number-object-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/array-number-object-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-number-object-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Array - Array (Array - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-array-array'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-array-array-1.png' })
      })

      after(async () => {
        let input

        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-array-array-7.png' })

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

        await page.screenshot({ path: '.screenshots/array-array-array-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/array-array-array-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Array - Array)'))

      it('Has a String component', async () => expect(await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')).not.to.be.null)

      it('Has a Number component', async () => expect(await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')).not.to.be.null)

      it('Has a Boolean component', async () => expect(await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')).not.to.be.null)

      it('Has a Null component', async () => expect(await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          let input

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })
          input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })
          input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })
          input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

          await page.screenshot({ path: '.screenshots/array-array-array-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-array-array-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        const ROUTE = 'https://localhost:5001/array/array-array-array'

        before(async () => {
          let input

          await page.goto(ROUTE, { waitUntil: 'load' })

          await page.screenshot({ path: '.screenshots/array-array-array-4.png' })

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/array-array-array-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-array-array-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Array - Array (Array - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-array-object'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-array-object-1.png' })
      })

      after(async () => {
        let input

        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-array-object-7.png' })

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

        await page.screenshot({ path: '.screenshots/array-array-object-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/array-array-object-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Array - Object)'))

      it('Has a String component', async () => expect(await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')).not.to.be.null)

      it('Has a Number component', async () => expect(await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')).not.to.be.null)

      it('Has a Boolean component', async () => expect(await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')).not.to.be.null)

      it('Has a Null component', async () => expect(await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          let input

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

          await page.screenshot({ path: '.screenshots/array-array-object-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-array-object-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          let input

          await page.goto(ROUTE, { waitUntil: 'load' })

          await page.screenshot({ path: '.screenshots/array-array-object-4.png' })

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/array-array-object-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-array-object-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Array - Array (Object - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-object-array'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-object-array-1.png' })
      })

      after(async () => {
        let input

        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-object-array-7.png' })

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

        await page.screenshot({ path: '.screenshots/array-object-array-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/array-object-array-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Object - Array)'))

      it('Has a String component', async () => expect(await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')).not.to.be.null)

      it('Has a Number component', async () => expect(await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')).not.to.be.null)

      it('Has a Boolean component', async () => expect(await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')).not.to.be.null)

      it('Has a Null component', async () => expect(await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          let input

          input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

          input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

          input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

          await page.screenshot({ path: '.screenshots/array-object-array-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-object-array-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          let input

          await page.goto(ROUTE, { waitUntil: 'load' })

          await page.screenshot({ path: '.screenshots/array-object-array-4.png' })

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/array-object-array-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-object-array-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Array - Array (Object - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-object-object'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-object-object-1.png' })
      })

      after(async () => {
        let input

        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-object-object-7.png' })

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

        await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

        input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

        await page.screenshot({ path: '.screenshots/array-object-object-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/array-object-object-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Object - Object)'))

      it('Has a String component', async () => expect(await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')).not.to.be.null)

      it('Has a Number component', async () => expect(await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')).not.to.be.null)

      it('Has a Boolean component', async () => expect(await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')).not.to.be.null)

      it('Has a Null component', async () => expect(await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          let input

          input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

          input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

          input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

          await page.screenshot({ path: '.screenshots/array-object-object-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-object-object-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          let input

          await page.goto(ROUTE, { waitUntil: 'load' })

          await page.screenshot({ path: '.screenshots/array-object-object-4.png' })

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/array-object-object-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-object-object-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Array - Array (Boolean - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-boolean-array'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-boolean-array-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-boolean-array-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'true')

        await page.screenshot({ path: '.screenshots/array-boolean-array-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/array-boolean-array-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Boolean - Array)'))

      it('Has a Boolean component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'true')

          await page.screenshot({ path: '.screenshots/array-boolean-array-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-boolean-array-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto(ROUTE, { waitUntil: 'load' })

          await page.screenshot({ path: '.screenshots/array-boolean-array-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/array-boolean-array-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-boolean-array-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Array - Array (Boolean - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-boolean-object'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-boolean-object-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-boolean-object-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'true')

        await page.screenshot({ path: '.screenshots/array-boolean-object-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/array-boolean-object-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Boolean - Object)'))

      it('Has a Boolean component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'true')

          await page.screenshot({ path: '.screenshots/array-boolean-object-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-boolean-object-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        const ROUTE = 'https://localhost:5001/array/array-boolean-object'

        before(async () => {
          await page.goto(ROUTE, { waitUntil: 'load' })

          await page.screenshot({ path: '.screenshots/array-boolean-object-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/array-boolean-object-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-boolean-object-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Array - Array (Null - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-null-array'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-null-array-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-null-array-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'null')

        await page.screenshot({ path: '.screenshots/array-null-array-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/array-null-array-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Null - Array)'))

      it('Has a Null component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'null')

          await page.screenshot({ path: '.screenshots/array-null-array-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-null-array-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto(ROUTE, { waitUntil: 'load' })

          await page.screenshot({ path: '.screenshots/array-null-array-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/array-null-array-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-null-array-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Array - Array (Null - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-null-object'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-null-object-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-null-object-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'null')

        await page.screenshot({ path: '.screenshots/array-null-object-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/array-null-object-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Null - Object)'))

      it('Has a Null component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'null')

          await page.screenshot({ path: '.screenshots/array-null-object-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-null-object-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto(ROUTE, { waitUntil: 'load' })

          await page.screenshot({ path: '.screenshots/array-null-object-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/array-null-object-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-null-object-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Array - Array (String - Enum - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-enum-array'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-string-enum-array-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Enum - Array)'))

      it('Has a Select component', async () => expect(await page.$('select')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('select').scrollIntoView() })

          await page.select('select', '1')

          await page.screenshot({ path: '.screenshots/array-string-enum-array-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-string-enum-array-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Array - Array (String - Enum - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-enum-object'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-string-enum-object-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Enum - Object)'))

      it('Has a Select component', async () => expect(await page.$('select')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('select').scrollIntoView() })

          await page.select('select', '1')

          await page.screenshot({ path: '.screenshots/array-string-enum-object-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-string-enum-object-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Array - Array (String - Any Of - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-any-of-array'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-string-any-of-array-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Any Of - Array)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="radio"][value="1"]').scrollIntoView() })

          await page.click('input[type="radio"][value="1"]')

          await page.screenshot({ path: '.screenshots/array-string-any-of-array-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-string-any-of-array-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Array - Array (String - Any Of - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-any-of-object'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-string-any-of-object-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Any Of - Object)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="radio"][value="1"]').scrollIntoView() })

          await page.click('input[type="radio"][value="1"]')

          await page.screenshot({ path: '.screenshots/array-string-any-of-object-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-string-any-of-object-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Array - Array (String - One Of - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-one-of-array'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-string-one-of-array-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - One Of - Array)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="radio"][value="1"]').scrollIntoView() })

          await page.click('input[type="radio"][value="1"]')

          await page.screenshot({ path: '.screenshots/array-string-one-of-array-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-string-one-of-array-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Array - Array (String - One Of - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-one-of-object'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-string-one-of-object-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - One Of - Object)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="radio"][value="1"]').scrollIntoView() })

          await page.click('input[type="radio"][value="1"]')

          await page.screenshot({ path: '.screenshots/array-string-one-of-object-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-string-one-of-object-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Array - Array (Number - Enum - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-enum-array'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-number-enum-array-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Enum - Array)'))

      it('Has a Select component', async () => expect(await page.$('select')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('select').scrollIntoView() })

          await page.select('select', '1')

          await page.screenshot({ path: '.screenshots/array-number-enum-array-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-number-enum-array-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Array - Array (Number - Enum - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-enum-object'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-number-enum-object-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Enum - Object)'))

      it('Has a Select component', async () => expect(await page.$('select')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('select').scrollIntoView() })

          await page.select('select', '1')

          await page.screenshot({ path: '.screenshots/array-number-enum-object-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-number-enum-object-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Array - Array (Number - Any Of - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-any-of-array'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-number-any-of-array-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Any Of - Array)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="radio"][value="1"]').scrollIntoView() })

          await page.click('input[type="radio"][value="1"]')

          await page.screenshot({ path: '.screenshots/array-number-any-of-array-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-number-any-of-array-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Array - Array (Number - Any Of - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-any-of-object'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-number-any-of-object-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Any Of - Object)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="radio"][value="1"]').scrollIntoView() })

          await page.click('input[type="radio"][value="1"]')

          await page.screenshot({ path: '.screenshots/array-number-any-of-object-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-number-any-of-object-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Array - Array (Number - One Of - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-one-of-array'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-number-one-of-array-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - One Of - Array)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="radio"][value="1"]').scrollIntoView() })

          await page.click('input[type="radio"][value="1"]')

          await page.screenshot({ path: '.screenshots/array-number-one-of-array-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-number-one-of-array-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Array - Array (Number - One Of - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-one-of-object'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/array-number-one-of-object-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - One Of - Object)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="radio"][value="1"]').scrollIntoView() })

          await page.click('input[type="radio"][value="1"]')

          await page.screenshot({ path: '.screenshots/array-number-one-of-object-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/array-number-one-of-object-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Debark', () => {
      before(async () => {
        page = await browser.newPage()

        await page.goto(DEBARK)

        await page.screenshot({ path: '.screenshots/debark-array.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array'))

      it('Has a <button />', async () => expect(await page.$eval('body main button.govuk-button', getTextContent)).to.equal('Accept and send'))

      describe('Summary', () => {
        describe('Array - Array (String - Array)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('Array (String - Array)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('String')

            expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('string')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(1) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(1) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-string-array-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'change')

              await page.screenshot({ path: '.screenshots/summary-array-string-array-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-string-array-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('Array (String - Array)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('String')

              expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('change')
            })
          })
        })

        describe('Array - Array (String - Object)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(2)', getTextContent)).to.equal('Array (String - Object)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(2) + dl dt', getTextContent)).to.equal('String')

            expect(await page.$eval('body main h2:nth-of-type(2) + dl dd', getTextContent)).to.equal('string')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(2) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(2) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-string-object-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'change')

              await page.screenshot({ path: '.screenshots/summary-array-string-object-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-string-object-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(2)', getTextContent)).to.equal('Array (String - Object)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(2) + dl dt', getTextContent)).to.equal('String')

              expect(await page.$eval('body main h2:nth-of-type(2) + dl dd', getTextContent)).to.equal('change')
            })
          })
        })

        describe('Array - Array (Number - Array)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(3)', getTextContent)).to.equal('Array (Number - Array)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(3) + dl dt', getTextContent)).to.equal('Number')

            expect(await page.$eval('body main h2:nth-of-type(3) + dl dd', getTextContent)).to.equal('1')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(3) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(3) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-number-array-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', '2')

              await page.screenshot({ path: '.screenshots/summary-array-number-array-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-number-array-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(3)', getTextContent)).to.equal('Array (Number - Array)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(3) + dl dt', getTextContent)).to.equal('Number')

              expect(await page.$eval('body main h2:nth-of-type(3) + dl dd', getTextContent)).to.equal('2')
            })
          })
        })

        describe('Array - Array (Number - Object)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(4)', getTextContent)).to.equal('Array (Number - Object)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(4) + dl dt', getTextContent)).to.equal('Number')

            expect(await page.$eval('body main h2:nth-of-type(4) + dl dd', getTextContent)).to.equal('1')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(4) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(4) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-number-object-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', '2')

              await page.screenshot({ path: '.screenshots/summary-array-number-object-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-number-object-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(4)', getTextContent)).to.equal('Array (Number - Object)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(4) + dl dt', getTextContent)).to.equal('Number')

              expect(await page.$eval('body main h2:nth-of-type(4) + dl dd', getTextContent)).to.equal('2')
            })
          })
        })

        describe('Array - Array (Array - Array)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('Array (Array - Array)'))

          it('Has a <dl />', async () => {
            const titles = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(5) + dl dt'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            const values = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(5) + dl dd.govuk-summary-list__value'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            const actions = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(5) + dl dd.govuk-summary-list__actions'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            expect(titles).to.eql([
              'String',
              'Number',
              'Boolean',
              'Null'
            ])

            expect(values).to.eql([
              'string',
              '1',
              'true',
              'null'
            ])

            expect(actions).to.eql([
              'Change string',
              'Change number',
              'Change boolean',
              'Change null'
            ])
          })

          describe('Change', () => {
            before(async () => {
              let input

              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(5) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(5) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-array-array-change-1.png' })

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'change')

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '2')

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'false')

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

              await page.screenshot({ path: '.screenshots/summary-array-array-array-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-array-array-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('Array (Array - Array)'))

            it('Has a <dl />', async () => {
              const titles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(5) + dl dt'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              const values = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(5) + dl dd.govuk-summary-list__value'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              const actions = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(5) + dl dd.govuk-summary-list__actions'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              expect(titles).to.eql([
                'String',
                'Number',
                'Boolean',
                'Null'
              ])

              expect(values).to.eql([
                'change',
                '2',
                'false',
                'null'
              ])

              expect(actions).to.eql([
                'Change string',
                'Change number',
                'Change boolean',
                'Change null'
              ])
            })
          })
        })

        describe('Array - Array (Array - Object)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(6)', getTextContent)).to.equal('Array (Array - Object)'))

          it('Has a <dl />', async () => {
            const titles = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(6) + dl dt'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            const values = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(6) + dl dd.govuk-summary-list__value'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            const actions = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(6) + dl dd.govuk-summary-list__actions'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            expect(titles).to.eql([
              'String',
              'Number',
              'Boolean',
              'Null'
            ])

            expect(values).to.eql([
              'string',
              '1',
              'true',
              'null'
            ])

            expect(actions).to.eql([
              'Change string',
              'Change number',
              'Change boolean',
              'Change null'
            ])
          })

          describe('Change', () => {
            before(async () => {
              let input

              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(6) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(6) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-array-object-change-1.png' })

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'change')

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '2')

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'false')

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

              await page.screenshot({ path: '.screenshots/summary-array-array-object-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-array-object-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(6)', getTextContent)).to.equal('Array (Array - Object)'))

            it('Has a <dl />', async () => {
              const titles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(6) + dl dt'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              const values = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(6) + dl dd.govuk-summary-list__value'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              const actions = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(6) + dl dd.govuk-summary-list__actions'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              expect(titles).to.eql([
                'String',
                'Number',
                'Boolean',
                'Null'
              ])

              expect(values).to.eql([
                'change',
                '2',
                'false',
                'null'
              ])

              expect(actions).to.eql([
                'Change string',
                'Change number',
                'Change boolean',
                'Change null'
              ])
            })
          })
        })

        describe('Array - Array (Object - Array)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(7)', getTextContent)).to.equal('Array (Object - Array)'))

          it('Has a <dl />', async () => {
            const titles = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(7) + dl dt'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            const values = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(7) + dl dd.govuk-summary-list__value'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            const actions = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(7) + dl dd.govuk-summary-list__actions'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            expect(titles).to.eql([
              'String',
              'Number',
              'Boolean',
              'Null'
            ])

            expect(values).to.eql([
              'string',
              '1',
              'true',
              'null'
            ])

            expect(actions).to.eql([
              'Change string',
              'Change number',
              'Change boolean',
              'Change null'
            ])
          })

          describe('Change', () => {
            before(async () => {
              let input

              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(7) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(7) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-object-array-change-1.png' })

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'change')

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '2')

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'false')

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

              await page.screenshot({ path: '.screenshots/summary-array-object-array-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-object-array-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(7)', getTextContent)).to.equal('Array (Object - Array)'))

            it('Has a <dl />', async () => {
              const titles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(7) + dl dt'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              const values = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(7) + dl dd.govuk-summary-list__value'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              const actions = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(7) + dl dd.govuk-summary-list__actions'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              expect(titles).to.eql([
                'String',
                'Number',
                'Boolean',
                'Null'
              ])

              expect(values).to.eql([
                'change',
                '2',
                'false',
                'null'
              ])

              expect(actions).to.eql([
                'Change string',
                'Change number',
                'Change boolean',
                'Change null'
              ])
            })
          })
        })

        describe('Array - Array (Object - Object)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(8)', getTextContent)).to.equal('Array (Object - Object)'))

          it('Has a <dl />', async () => {
            const titles = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(8) + dl dt'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            const values = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(8) + dl dd.govuk-summary-list__value'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            const actions = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(8) + dl dd.govuk-summary-list__actions'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            expect(titles).to.eql([
              'String',
              'Number',
              'Boolean',
              'Null'
            ])

            expect(values).to.eql([
              'string',
              '1',
              'true',
              'null'
            ])

            expect(actions).to.eql([
              'Change string',
              'Change number',
              'Change boolean',
              'Change null'
            ])
          })

          describe('Change', () => {
            before(async () => {
              let input

              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(8) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(8) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-object-object-change-1.png' })

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'change')

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '2')

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(3) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'false')

              await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

              input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

              await page.screenshot({ path: '.screenshots/summary-array-object-object-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-object-object-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(8)', getTextContent)).to.equal('Array (Object - Object)'))

            it('Has a <dl />', async () => {
              const titles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(8) + dl dt'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              const values = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(8) + dl dd.govuk-summary-list__value'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              const actions = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(8) + dl dd.govuk-summary-list__actions'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              expect(titles).to.eql([
                'String',
                'Number',
                'Boolean',
                'Null'
              ])

              expect(values).to.eql([
                'change',
                '2',
                'false',
                'null'
              ])

              expect(actions).to.eql([
                'Change string',
                'Change number',
                'Change boolean',
                'Change null'
              ])
            })
          })
        })

        describe('Array - Array (Boolean - Array)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(9)', getTextContent)).to.equal('Array (Boolean - Array)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(9) + dl dt', getTextContent)).to.equal('Boolean')

            expect(await page.$eval('body main h2:nth-of-type(9) + dl dd', getTextContent)).to.equal('true')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(9) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(9) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-boolean-array-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'false')

              await page.screenshot({ path: '.screenshots/summary-array-boolean-array-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-boolean-array-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(9)', getTextContent)).to.equal('Array (Boolean - Array)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(9) + dl dt', getTextContent)).to.equal('Boolean')

              expect(await page.$eval('body main h2:nth-of-type(9) + dl dd', getTextContent)).to.equal('false')
            })
          })
        })

        describe('Array - Array (Boolean - Object)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(10)', getTextContent)).to.equal('Array (Boolean - Object)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(10) + dl dt', getTextContent)).to.equal('Boolean')

            expect(await page.$eval('body main h2:nth-of-type(10) + dl dd', getTextContent)).to.equal('true')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(10) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(10) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-boolean-object-change-1.png' })

              await page.screenshot({ path: '.screenshots/summary-boolean-all-of-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'false')

              await page.screenshot({ path: '.screenshots/summary-array-boolean-object-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-boolean-object-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(10)', getTextContent)).to.equal('Array (Boolean - Object)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(10) + dl dt', getTextContent)).to.equal('Boolean')

              expect(await page.$eval('body main h2:nth-of-type(10) + dl dd', getTextContent)).to.equal('false')
            })
          })
        })

        describe('Array - Array (Null - Array)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(11)', getTextContent)).to.equal('Array (Null - Array)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(11) + dl dt', getTextContent)).to.equal('Null')

            expect(await page.$eval('body main h2:nth-of-type(11) + dl dd', getTextContent)).to.equal('null')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(11) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(11) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-null-array-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'null')

              await page.screenshot({ path: '.screenshots/summary-array-null-array-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-null-array-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(11)', getTextContent)).to.equal('Array (Null - Array)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(11) + dl dt', getTextContent)).to.equal('Null')

              expect(await page.$eval('body main h2:nth-of-type(11) + dl dd', getTextContent)).to.equal('null')
            })
          })
        })

        describe('Array - Array (Null - Object)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(12)', getTextContent)).to.equal('Array (Null - Object)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(12) + dl dt', getTextContent)).to.equal('Null')

            expect(await page.$eval('body main h2:nth-of-type(12) + dl dd', getTextContent)).to.equal('null')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(12) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(12) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-null-object-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'null')

              await page.screenshot({ path: '.screenshots/summary-array-null-object-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-array-null-object-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(12)', getTextContent)).to.equal('Array (Null - Object)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(12) + dl dt', getTextContent)).to.equal('Null')

              expect(await page.$eval('body main h2:nth-of-type(12) + dl dd', getTextContent)).to.equal('null')
            })
          })
        })

        describe('Submit', () => {
          before(async () => {
            await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

            page.click('body main button.govuk-button')

            await page.waitForNavigation()

            await page.screenshot({ path: '.screenshots/summary-array-confirm.png' })
          })

          it('Does not return to the same url', async () => expect(page.url()).not.to.equal(DEBARK))
        })
      })
    })

    describe('Confirm', () => {
      before(async () => {
        page = await browser.newPage()

        await page.goto(CONFIRM, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/confirm-array.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Confirmation'))
    })
  })
})
