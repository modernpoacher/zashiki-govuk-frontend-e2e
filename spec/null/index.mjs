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

describe('@modernpoacher/zashiki-govuk-frontend/null', () => {
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

  describe('Null', () => {
    /**
     *  @type {puppeteer.Page}
     */
    let page

    before(async () => {
      page = await browser.newPage()

      await page.goto(EMBARK, { waitUntil: 'load' })

      await page.screenshot({ path: '.screenshots/embark-null-1.png' })

      await page.evaluate(() => {
        const option = Array.from(document.querySelectorAll('body main fieldset select option')) // @ts-expect-error
          .find(({ text }) => text === 'Null') // @ts-expect-error
        if (option) option.selected = true
      })

      await page.screenshot({ path: '.screenshots/embark-null-2.png' })

      await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

      page.click('body main button.govuk-button')

      await page.waitForNavigation()

      await page.screenshot({ path: '.screenshots/embark-null-3.png' })
    })

    describe('Null - Null', () => {
      const ROUTE = 'https://localhost:5001/null/null'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/null-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/null-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'null')

        await page.screenshot({ path: '.screenshots/null-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/null-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Null'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'null')

          await page.screenshot({ path: '.screenshots/null-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/null-3.png' })
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

          await page.screenshot({ path: '.screenshots/null-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/null-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/null-6.png' })
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Null - Null (Enum)', () => {
      const ROUTE = 'https://localhost:5001/null/null-enum'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/null-enum-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Null (Enum)'))

      it('Has a Select component', async () => {
        const nodeList = await page.$$('body main fieldset select')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('body main fieldset select').scrollIntoView() })

          await page.select('body main fieldset select', '0')

          await page.screenshot({ path: '.screenshots/null-enum-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/null-enum-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Null - Null (Any Of)', () => {
      const ROUTE = 'https://localhost:5001/null/null-any-of'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/null-any-of-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Null (Any Of)'))

      it('Has a Select component', async () => {
        const nodeList = await page.$$('body main fieldset select')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('body main fieldset select').scrollIntoView() })

          await page.select('body main fieldset select', '0')

          await page.screenshot({ path: '.screenshots/null-any-of-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/null-any-of-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Null - Null (One Of)', () => {
      const ROUTE = 'https://localhost:5001/null/null-one-of'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/null-one-of-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Null (One Of)'))

      it('Has a Select component', async () => {
        const nodeList = await page.$$('body main fieldset select')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('body main fieldset select').scrollIntoView() })

          await page.select('body main fieldset select', '0')

          await page.screenshot({ path: '.screenshots/null-one-of-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/null-one-of-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Null - Null (All Of)', () => {
      const ROUTE = 'https://localhost:5001/null/null-all-of'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/null-all-of-1.png' })
      })

      after(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/null-all-of-7.png' })

        await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'null')

        await page.screenshot({ path: '.screenshots/null-all-of-8.png' })

        await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

        page.click('body main button.govuk-button')

        await page.waitForNavigation()

        await page.screenshot({ path: '.screenshots/null-all-of-9.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Null (All Of)'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'null')

          await page.screenshot({ path: '.screenshots/null-all-of-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/null-all-of-3.png' })
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

          await page.screenshot({ path: '.screenshots/null-all-of-4.png' })

          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/null-all-of-5.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/null-all-of-6.png' })
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

        await page.screenshot({ path: '.screenshots/debark-null.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Null'))

      it('Has a <button />', async () => expect(await page.$eval('body main button.govuk-button', getTextContent)).to.equal('Accept and send'))

      describe('Summary', () => {
        describe('Null - Null', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('Null'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('Null')

            expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('null')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(1) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(1) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-null-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'null')

              await page.screenshot({ path: '.screenshots/summary-null-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-null-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('Null'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('Null')

              expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('null')
            })
          })
        })

        describe('Null - Null (Enum)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(2)', getTextContent)).to.equal('Null (Enum)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(2) + dl dt', getTextContent)).to.equal('Null (Enum)')

            expect(await page.$eval('body main h2:nth-of-type(2) + dl dd', getTextContent)).to.equal('null')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(2) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(2) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-null-enum-change-1.png' })

              await page.evaluate(() => { document.querySelector('body main fieldset select').scrollIntoView() })

              await page.select('body main fieldset select', '0')

              await page.screenshot({ path: '.screenshots/summary-null-enum-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-null-enum-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(2)', getTextContent)).to.equal('Null (Enum)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(2) + dl dt', getTextContent)).to.equal('Null (Enum)')

              expect(await page.$eval('body main h2:nth-of-type(2) + dl dd', getTextContent)).to.equal('null')
            })
          })
        })

        describe('Null - Null (Any Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(3)', getTextContent)).to.equal('Null (Any Of)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(3) + dl dt', getTextContent)).to.equal('Null (Any Of)')

            expect(await page.$eval('body main h2:nth-of-type(3) + dl dd', getTextContent)).to.equal('Null')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(3) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(3) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-null-any-of-change-1.png' })

              await page.evaluate(() => { document.querySelector('body main fieldset select').scrollIntoView() })

              await page.select('body main fieldset select', '0')

              await page.screenshot({ path: '.screenshots/summary-null-any-of-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-null-any-of-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(3)', getTextContent)).to.equal('Null (Any Of)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(3) + dl dt', getTextContent)).to.equal('Null (Any Of)')

              expect(await page.$eval('body main h2:nth-of-type(3) + dl dd', getTextContent)).to.equal('Null')
            })
          })
        })

        describe('Null - Null (One Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(4)', getTextContent)).to.equal('Null (One Of)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(4) + dl dt', getTextContent)).to.equal('Null (One Of)')

            expect(await page.$eval('body main h2:nth-of-type(4) + dl dd', getTextContent)).to.equal('Null')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(4) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(4) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-null-one-of-change-1.png' })

              await page.evaluate(() => { document.querySelector('body main fieldset select').scrollIntoView() })

              await page.select('body main fieldset select', '0')

              await page.screenshot({ path: '.screenshots/summary-null-one-of-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-null-one-of-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(4)', getTextContent)).to.equal('Null (One Of)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(4) + dl dt', getTextContent)).to.equal('Null (One Of)')

              expect(await page.$eval('body main h2:nth-of-type(4) + dl dd', getTextContent)).to.equal('Null')
            })
          })
        })

        describe('Null - Null (All Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('Null (All Of)'))

          it('Has a <dl />', async () => { // TODO - "(All Of)"?
            expect(await page.$eval('body main h2:nth-of-type(5) + dl dt', getTextContent)).to.equal('Null') // (All Of)')

            expect(await page.$eval('body main h2:nth-of-type(5) + dl dd', getTextContent)).to.equal('null')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(5) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(5) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-null-all-of-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'null')

              await page.screenshot({ path: '.screenshots/summary-null-all-of-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-null-all-of-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('Null (All Of)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(5) + dl dt', getTextContent)).to.equal('Null')

              expect(await page.$eval('body main h2:nth-of-type(5) + dl dd', getTextContent)).to.equal('null')
            })
          })
        })

        describe('Submit', () => {
          before(async () => {
            await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

            page.click('body main button.govuk-button')

            await page.waitForNavigation()

            await page.screenshot({ path: '.screenshots/summary-null-confirm.png' })
          })

          it('Does not return to the same url', async () => expect(page.url()).not.to.equal(DEBARK))
        })
      })
    })

    describe('Confirm', () => {
      before(async () => {
        page = await browser.newPage()

        await page.goto(CONFIRM, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/confirm-null.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Confirmation'))
    })
  })
})
