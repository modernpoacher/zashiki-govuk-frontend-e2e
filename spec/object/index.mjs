import puppeteer from 'puppeteer'

import {
  expect
} from 'chai'

import debug from '#zashiki/debug'

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

describe('@modernpoacher/zashiki-govuk-frontend/object', () => {
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

  describe('Object', () => {
    /**
     *  @type {puppeteer.Page}
     */
    let page

    before(async () => {
      page = await browser.newPage()

      await page.goto(EMBARK, { waitUntil: 'load' })

      await page.screenshot({ path: '.screenshots/embark-object-1.png' })

      await page.evaluate(() => {
        const option = Array.from(document.querySelectorAll('body main fieldset select option')) // @ts-expect-error
          .find(({ text }) => text === 'Object') // @ts-expect-error
        if (option) option.selected = true
      })

      await page.screenshot({ path: '.screenshots/embark-object-2.png' })

      await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

      page.click('body main button.govuk-button')

      await page.waitForNavigation()

      await page.screenshot({ path: '.screenshots/embark-object-3.png' })
    })

    describe('Object - Object (String)', () => {
      const ROUTE = 'https://localhost:5001/object/object-string'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-string-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (String)'))

      it('Has a String component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/object-string-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-string-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Object - Object (Number)', () => {
      const ROUTE = 'https://localhost:5001/object/object-number'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-number-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-number-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', '1')

        await page.screenshot({ path: '.screenshots/object-number-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/object-number-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Number)'))

      it('Has a Number component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          await page.type('input[type="text"]', '1')

          await page.screenshot({ path: '.screenshots/object-number-2.png' })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-number-3.png' })
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

          await page.screenshot({ path: '.screenshots/object-number-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/object-number-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-number-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Array - Array)', () => {
      const ROUTE = 'https://localhost:5001/object/object-array-array'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-array-array-1.png' })
      })

      after(async () => {
        let input

        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-array-array-7.png' })

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

        await page.screenshot({ path: '.screenshots/object-array-array-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/object-array-array-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Array - Array)'))

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

          await page.screenshot({ path: '.screenshots/object-array-array-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-array-array-3.png' })
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

          await page.screenshot({ path: '.screenshots/object-array-array-4.png' })

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(1) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(2) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'string')

          await page.evaluate(() => { document.querySelector('.govuk-form-group:nth-of-type(4) input[type="text"]').scrollIntoView() })

          input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/object-array-array-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-array-array-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Array - Object - String)', () => {
      const ROUTE = 'https://localhost:5001/object/object-array-object-string'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-array-object-string-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Array - Object - String)'))

      it('Has a String component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/object-array-object-string-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-array-object-string-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Object - Object (Array - Object - Number)', () => {
      const ROUTE = 'https://localhost:5001/object/object-array-object-number'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-array-object-number-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-array-object-number-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', '1')

        await page.screenshot({ path: '.screenshots/object-array-object-number-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/object-array-object-number-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Array - Object - Number)'))

      it('Has a Number component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', '1')

          await page.screenshot({ path: '.screenshots/object-array-object-number-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-array-object-number-3.png' })
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

          await page.screenshot({ path: '.screenshots/object-array-object-number-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/object-array-object-number-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-array-object-number-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Array - Object - Boolean)', () => {
      const ROUTE = 'https://localhost:5001/object/object-array-object-boolean'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-array-object-boolean-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-array-object-boolean-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'true')

        await page.screenshot({ path: '.screenshots/object-array-object-boolean-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/object-array-object-boolean-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Array - Object - Boolean)'))

      it('Has a Boolean component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'true')

          await page.screenshot({ path: '.screenshots/object-array-object-boolean-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-array-object-boolean-3.png' })
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

          await page.screenshot({ path: '.screenshots/object-array-object-boolean-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/object-array-object-boolean-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-array-object-boolean-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Array - Object - Null)', () => {
      const ROUTE = 'https://localhost:5001/object/object-array-object-null'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-array-object-null-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-array-object-null-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'null')

        await page.screenshot({ path: '.screenshots/object-array-object-null-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/object-array-object-null-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Array - Object - Null)'))

      it('Has a Null component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'null')

          await page.screenshot({ path: '.screenshots/object-array-object-null-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-array-object-null-3.png' })
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

          await page.screenshot({ path: '.screenshots/object-array-object-null-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/object-array-object-null-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-array-object-null-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Object)', () => {
      const ROUTE = 'https://localhost:5001/object/object-object'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-object-1.png' })
      })

      after(async () => {
        let input

        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-object-7.png' })

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

        await page.screenshot({ path: '.screenshots/object-object-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/object-object-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Object)'))

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

          await page.screenshot({ path: '.screenshots/object-object-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-object-3.png' })
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

          await page.screenshot({ path: '.screenshots/object-object-4.png' })

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

          await page.screenshot({ path: '.screenshots/object-object-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-object-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Boolean)', () => {
      const ROUTE = 'https://localhost:5001/object/object-boolean'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-boolean-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-boolean-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'true')

        await page.screenshot({ path: '.screenshots/object-boolean-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/object-boolean-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Boolean)'))

      it('Has a Boolean component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'true')

          await page.screenshot({ path: '.screenshots/object-boolean-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-boolean-3.png' })
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

          await page.screenshot({ path: '.screenshots/object-boolean-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/object-boolean-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-boolean-5.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Null)', () => {
      const ROUTE = 'https://localhost:5001/object/object-null'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-null-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/object-null-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'null')

        await page.screenshot({ path: '.screenshots/object-null-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/object-null-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Null)'))

      it('Has a Null component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'null')

          await page.screenshot({ path: '.screenshots/object-null-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-null-3.png' })
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

          await page.screenshot({ path: '.screenshots/object-null-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/object-null-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/object-null-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Debark', () => {
      before(async () => {
        page = await browser.newPage()

        await page.goto(DEBARK, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/debark-object.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object'))

      it('Has a <button />', async () => expect(await page.$eval('body main button.govuk-button', getTextContent)).to.equal('Accept and send'))

      describe('Summary', () => {
        describe('Object - Object (String)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('Object (String)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('String')

            expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('string')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(1) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(1) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-string-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'change')

              await page.screenshot({ path: '.screenshots/summary-object-string-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-string-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('Object (String)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('String')

              expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('change')
            })
          })
        })

        describe('Object - Object (Number)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(2)', getTextContent)).to.equal('Object (Number)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(2) + dl dt', getTextContent)).to.equal('Number')

            expect(await page.$eval('body main h2:nth-of-type(2) + dl dd', getTextContent)).to.equal('1')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(2) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(2) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-number-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', '2')

              await page.screenshot({ path: '.screenshots/summary-object-number-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-number-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(2)', getTextContent)).to.equal('Object (Number)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(2) + dl dt', getTextContent)).to.equal('Number')

              expect(await page.$eval('body main h2:nth-of-type(2) + dl dd', getTextContent)).to.equal('2')
            })
          })
        })

        describe('Object - Object (Array - Array)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(3)', getTextContent)).to.equal('Object (Array - Array)'))

          it('Has a <dl />', async () => {
            const titles = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(3) + dl dt'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            const values = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(3) + dl dd.govuk-summary-list__value'))
                .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
            })

            const actions = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(3) + dl dd.govuk-summary-list__actions'))
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

              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(3) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(3) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-array-array-change-1.png' })

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

              await page.screenshot({ path: '.screenshots/summary-object-array-array-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-array-array-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(3)', getTextContent)).to.equal('Object (Array - Array)'))

            it('Has a <dl />', async () => {
              const titles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(3) + dl dt'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              const values = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(3) + dl dd.govuk-summary-list__value'))
                  .map(({ textContent = '' }) => textContent.trim()) // must be in page scope
              })

              const actions = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(3) + dl dd.govuk-summary-list__actions'))
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

        describe('Object - Object (Array - Object - String)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(4)', getTextContent)).to.equal('Object (Array - Object - String)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(4) + dl dt', getTextContent)).to.equal('String')

            expect(await page.$eval('body main h2:nth-of-type(4) + dl dd', getTextContent)).to.equal('string')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(4) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(4) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-array-object-string-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'change')

              await page.screenshot({ path: '.screenshots/summary-object-array-object-string-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-array-object-string-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(4)', getTextContent)).to.equal('Object (Array - Object - String)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(4) + dl dt', getTextContent)).to.equal('String')

              expect(await page.$eval('body main h2:nth-of-type(4) + dl dd', getTextContent)).to.equal('change')
            })
          })
        })

        describe('Object - Object (Array - Object - Number)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('Object (Array - Object - Number)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(5) + dl dt', getTextContent)).to.equal('Number')

            expect(await page.$eval('body main h2:nth-of-type(5) + dl dd', getTextContent)).to.equal('1')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(5) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(5) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-array-object-number-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', '2')

              await page.screenshot({ path: '.screenshots/summary-object-array-object-number-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-array-object-number-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('Object (Array - Object - Number)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(5) + dl dt', getTextContent)).to.equal('Number')

              expect(await page.$eval('body main h2:nth-of-type(5) + dl dd', getTextContent)).to.equal('2')
            })
          })
        })

        describe('Object - Object (Array - Object - Boolean)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(6)', getTextContent)).to.equal('Object (Array - Object - Boolean)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(6) + dl dt', getTextContent)).to.equal('Boolean')

            expect(await page.$eval('body main h2:nth-of-type(6) + dl dd', getTextContent)).to.equal('true')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(6) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(6) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-array-object-boolean-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'false')

              await page.screenshot({ path: '.screenshots/summary-object-array-object-boolean-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-array-object-boolean-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(6)', getTextContent)).to.equal('Object (Array - Object - Boolean)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(6) + dl dt', getTextContent)).to.equal('Boolean')

              expect(await page.$eval('body main h2:nth-of-type(6) + dl dd', getTextContent)).to.equal('false')
            })
          })
        })

        describe('Object - Object (Array - Object - Null)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(7)', getTextContent)).to.equal('Object (Array - Object - Null)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(7) + dl dt', getTextContent)).to.equal('Null')

            expect(await page.$eval('body main h2:nth-of-type(7) + dl dd', getTextContent)).to.equal('null')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(7) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(7) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-array-object-null-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'null')

              await page.screenshot({ path: '.screenshots/summary-object-array-object-null-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-array-object-null-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(7)', getTextContent)).to.equal('Object (Array - Object - Null)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(7) + dl dt', getTextContent)).to.equal('Null')

              expect(await page.$eval('body main h2:nth-of-type(7) + dl dd', getTextContent)).to.equal('null')
            })
          })
        })

        describe('Object - Object (Object)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(8)', getTextContent)).to.equal('Object (Object)'))

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

              await page.screenshot({ path: '.screenshots/summary-object-object-change-1.png' })

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

              await page.screenshot({ path: '.screenshots/summary-object-object-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-object-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(8)', getTextContent)).to.equal('Object (Object)'))

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

        describe('Object - Object (Boolean)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(9)', getTextContent)).to.equal('Object (Boolean)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(9) + dl dt', getTextContent)).to.equal('Boolean')

            expect(await page.$eval('body main h2:nth-of-type(9) + dl dd', getTextContent)).to.equal('true')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(9) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(9) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-boolean-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'false')

              await page.screenshot({ path: '.screenshots/summary-object-boolean-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-boolean-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(9)', getTextContent)).to.equal('Object (Boolean)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(9) + dl dt', getTextContent)).to.equal('Boolean')

              expect(await page.$eval('body main h2:nth-of-type(9) + dl dd', getTextContent)).to.equal('false')
            })
          })
        })

        describe('Object - Object (Null)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(10)', getTextContent)).to.equal('Object (Null)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(10) + dl dt', getTextContent)).to.equal('Null')

            expect(await page.$eval('body main h2:nth-of-type(10) + dl dd', getTextContent)).to.equal('null')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(10) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(10) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-null-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'null')

              await page.screenshot({ path: '.screenshots/summary-object-null-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-object-null-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(10)', getTextContent)).to.equal('Object (Null)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(10) + dl dt', getTextContent)).to.equal('Null')

              expect(await page.$eval('body main h2:nth-of-type(10) + dl dd', getTextContent)).to.equal('null')
            })
          })
        })

        describe('Submit', () => {
          before(async () => {
            await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

            page.click('body main button.govuk-button')

            await page.waitForNavigation()

            await page.screenshot({ path: '.screenshots/summary-object-confirm.png' })
          })

          it('Does not return to the same url', async () => expect(page.url()).not.to.equal(DEBARK))
        })
      })
    })

    describe('Confirm', () => {
      before(async () => {
        page = await browser.newPage()

        await page.goto(CONFIRM, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/confirm-object.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Confirmation'))
    })
  })
})
