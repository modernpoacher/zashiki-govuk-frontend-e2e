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

describe('@modernpoacher/zashiki-govuk-frontend/string', () => {
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

  describe('String', () => {
    /**
     *  @type {puppeteer.Page}
     */
    let page

    before(async () => {
      page = await browser.newPage()

      await page.goto(EMBARK, { waitUntil: 'load' })

      await page.screenshot({ path: '.screenshots/embark-string-1.png' })

      await page.evaluate(() => {
        const option = Array.from(document.querySelectorAll('body main fieldset select option')) // @ts-expect-error
          .find(({ text }) => text === 'String') // @ts-expect-error
        if (option) option.selected = true
      })

      await page.screenshot({ path: '.screenshots/embark-string-2.png' })

      await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

      page.click('body main button.govuk-button')

      await page.waitForNavigation()

      await page.screenshot({ path: '.screenshots/embark-string-3.png' })
    })

    describe('String - String', () => {
      const ROUTE = 'https://localhost:5001/string/string'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/string-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('String'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/string-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/string-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('String - String (Enum)', () => {
      const ROUTE = 'https://localhost:5001/string/string-enum'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/string-enum-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('String (Enum)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="radio"][value="1"]').scrollIntoView() })

          await page.click('input[type="radio"][value="1"]')

          await page.screenshot({ path: '.screenshots/string-enum-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/string-enum-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('String - String (Any Of)', () => {
      const ROUTE = 'https://localhost:5001/string/string-any-of'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/string-any-of-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('String (Any Of)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="radio"][value="1"]').scrollIntoView() })

          await page.click('input[type="radio"][value="1"]')

          await page.screenshot({ path: '.screenshots/string-any-of-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/string-any-of-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('String - String (One Of)', () => {
      const ROUTE = 'https://localhost:5001/string/string-one-of'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/string-one-of-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('String (One Of)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="radio"][value="1"]').scrollIntoView() })

          await page.click('input[type="radio"][value="1"]')

          await page.screenshot({ path: '.screenshots/string-one-of-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/string-one-of-3.png' })
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-summary__list li')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('String - String (All Of)', () => {
      const ROUTE = 'https://localhost:5001/string/string-all-of'

      before(async () => {
        await page.goto(ROUTE, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/string-all-of-1.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('String (All Of)'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          await page.screenshot({ path: '.screenshots/string-all-of-2.png' })

          await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

          page.click('body main button.govuk-button')

          await page.waitForNavigation()

          await page.screenshot({ path: '.screenshots/string-all-of-3.png' })
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

        await page.goto(DEBARK, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/debark-string.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('String'))

      it('Has a <button />', async () => expect(await page.$eval('body main button.govuk-button', getTextContent)).to.equal('Accept and send'))

      describe('Summary', () => {
        describe('String - String', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('String'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('String')

            expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('string')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(1) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(1) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-string-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'change')

              await page.screenshot({ path: '.screenshots/summary-string-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-string-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('String'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('String')

              expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('change')
            })
          })
        })

        describe('String - String (Enum)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(2)', getTextContent)).to.equal('String (Enum)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(2) + dl dt', getTextContent)).to.equal('String (Enum)')

            expect(await page.$eval('body main h2:nth-of-type(2) + dl dd', getTextContent)).to.equal('Two')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(2) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(2) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-string-enum-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="radio"][value="2"]').scrollIntoView() })

              await page.click('input[type="radio"][value="2"]')

              await page.screenshot({ path: '.screenshots/summary-string-enum-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-string-enum-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(2)', getTextContent)).to.equal('String (Enum)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(2) + dl dt', getTextContent)).to.equal('String (Enum)')

              expect(await page.$eval('body main h2:nth-of-type(2) + dl dd', getTextContent)).to.equal('Three')
            })
          })
        })

        describe('String - String (Any Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(3)', getTextContent)).to.equal('String (Any Of)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(3) + dl dt', getTextContent)).to.equal('String (Any Of)')

            expect(await page.$eval('body main h2:nth-of-type(3) + dl dd', getTextContent)).to.equal('Two')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(3) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(3) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-string-any-of-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="radio"][value="2"]').scrollIntoView() })

              await page.click('input[type="radio"][value="2"]')

              await page.screenshot({ path: '.screenshots/summary-string-any-of-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-string-any-of-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(3)', getTextContent)).to.equal('String (Any Of)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(3) + dl dt', getTextContent)).to.equal('String (Any Of)')

              expect(await page.$eval('body main h2:nth-of-type(3) + dl dd', getTextContent)).to.equal('Three')
            })
          })
        })

        describe('String - String (One Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(4)', getTextContent)).to.equal('String (One Of)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(4) + dl dt', getTextContent)).to.equal('String (One Of)')

            expect(await page.$eval('body main h2:nth-of-type(4) + dl dd', getTextContent)).to.equal('Two')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(4) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(4) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-string-one-of-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="radio"][value="2"]').scrollIntoView() })

              await page.click('input[type="radio"][value="2"]')

              await page.screenshot({ path: '.screenshots/summary-string-one-of-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-string-one-of-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(4)', getTextContent)).to.equal('String (One Of)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(4) + dl dt', getTextContent)).to.equal('String (One Of)')

              expect(await page.$eval('body main h2:nth-of-type(4) + dl dd', getTextContent)).to.equal('Three')
            })
          })
        })

        describe('String - String (All Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('String (All Of)'))

          it('Has a <dl />', async () => { // TODO - "(All Of)"?
            expect(await page.$eval('body main h2:nth-of-type(5) + dl dt', getTextContent)).to.equal('String') // (All Of)')

            expect(await page.$eval('body main h2:nth-of-type(5) + dl dd', getTextContent)).to.equal('string')
          })

          describe('Change', () => {
            before(async () => {
              await page.evaluate(() => { document.querySelector('body main h2:nth-of-type(5) + dl dd a').scrollIntoView() })

              page.click('body main h2:nth-of-type(5) + dl dd a')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-string-all-of-change-1.png' })

              await page.evaluate(() => { document.querySelector('input[type="text"]').scrollIntoView() })

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'change')

              await page.screenshot({ path: '.screenshots/summary-string-all-of-change-2.png' })

              await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

              page.click('body main button.govuk-button')

              await page.waitForNavigation()

              await page.screenshot({ path: '.screenshots/summary-string-all-of-change-3.png' })
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('String (All Of)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(5) + dl dt', getTextContent)).to.equal('String')

              expect(await page.$eval('body main h2:nth-of-type(5) + dl dd', getTextContent)).to.equal('change')
            })
          })
        })

        describe('Submit', () => {
          before(async () => {
            await page.evaluate(() => { document.querySelector('body main button.govuk-button').scrollIntoView() })

            page.click('body main button.govuk-button')

            await page.waitForNavigation()

            await page.screenshot({ path: '.screenshots/summary-string-confirm.png' })
          })

          it('Does not return to the same url', async () => expect(page.url()).not.to.equal(DEBARK))
        })
      })
    })

    describe('Confirm', () => {
      before(async () => {
        page = await browser.newPage()

        await page.goto(CONFIRM, { waitUntil: 'load' })

        await page.screenshot({ path: '.screenshots/confirm-string.png' })
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Confirmation'))
    })
  })
})
