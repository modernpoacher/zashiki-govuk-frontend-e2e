import debug from 'debug'

import puppeteer from 'puppeteer'

import {
  expect
} from 'chai'

const log = debug('zashiki:e2e')

log('`zashiki` is awake')

const getTextContent = (element) => element.textContent.trim()

describe('@modernpoacher/zashiki-govuk-frontend/null', () => {
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

  describe('Embark', () => {
    before(async () => {
      page = await browser.newPage()

      await page.goto('https://localhost:5001/embark-stage') // , { waitUntil: 'networkidle2' })
      await page.waitForSelector('h1')
    })

    it('Has an <h1 />', async () => expect(await page.$eval('body main h1', getTextContent)).to.equal('Embark'))

    it('Has a <button />', async () => expect(await page.$eval('body main button.govuk-button', getTextContent)).to.equal('Start'))

    describe('Zashiki', () => {
      it('Has a <legend />', async () => {
        expect(await page.$eval('body main fieldset legend', getTextContent)).to.equal('Schema for Collections')
      })

      it('Has a <label />', async () => {
        expect(await page.$eval('body main fieldset label', getTextContent)).to.equal('Collection')
      })

      it('Has a <select />', async () => expect(await page.$('body main fieldset select')).not.to.be.null)
    })
  })

  describe('Null', () => {
    let page

    before(async () => {
      page = await browser.newPage()

      await page.goto('https://localhost:5001/embark-stage') // , { waitUntil: 'networkidle2' })

      await page.evaluate(() => {
        const option = Array.from(document.querySelectorAll('body main fieldset select option'))
          .find(({ text }) => text === 'Null')
        if (option) option.selected = true
      })

      page.click('body main button.govuk-button')

      await page.waitForNavigation()
    })

    describe('Null - Null', () => {
      before(async () => await page.goto('https://localhost:5001/null/null'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Null'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('input[type="text"]', 'null')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/null/null'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Null - Null (Enum)', () => {
      before(async () => await page.goto('https://localhost:5001/null/null-enum'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Null (Enum)'))

      it('Has a Select component', async () => {
        const nodeList = await page.$$('body main fieldset.govuk-fieldset select.govuk-select')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Submitting input', () => {
        before(async () => {
          await page.select('body main fieldset.govuk-fieldset select.govuk-select', '0')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/null/null-enum'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Null - Null (Any Of)', () => {
      before(async () => await page.goto('https://localhost:5001/null/null-any-of'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Null (Any Of)'))

      it('Has a Select component', async () => {
        const nodeList = await page.$$('body main fieldset.govuk-fieldset select.govuk-select')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Submitting input', () => {
        before(async () => {
          await page.select('body main fieldset.govuk-fieldset select.govuk-select', '0')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/null/null-any-of'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Null - Null (One Of)', () => {
      before(async () => await page.goto('https://localhost:5001/null/null-one-of'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Null (One Of)'))

      it('Has a Select component', async () => {
        const nodeList = await page.$$('body main fieldset.govuk-fieldset select.govuk-select')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Submitting input', () => {
        before(async () => {
          await page.select('body main fieldset.govuk-fieldset select.govuk-select', '0')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/null/null-one-of'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Null - Null (All Of)', () => {
      before(async () => await page.goto('https://localhost:5001/null/null-all-of'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Null (All Of)'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('input[type="text"]', 'null')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/null/null-all-of'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Debark', () => {
      before(async () => {
        page = await browser.newPage()

        await page.goto('https://localhost:5001/debark-stage') // , { waitUntil: 'networkidle2' })
        await page.waitForSelector('h1')
      })

      it('Has an <h1 />', async () => expect(await page.$eval('body main h1', getTextContent)).to.equal('Null'))

      it('Has a <button />', async () => expect(await page.$eval('body main button.govuk-button', getTextContent)).to.equal('Accept and send'))

      describe('Check Answers', () => {
        describe('Null - Null', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('Null'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('Null')

            expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('null')
          })
        })

        describe('Null - Null (Enum)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(2)', getTextContent)).to.equal('Null (Enum)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(2) + dl dt', getTextContent)).to.equal('Null (Enum)')

            expect(await page.$eval('body main h2:nth-of-type(2) + dl dd', getTextContent)).to.equal('null')
          })
        })

        describe('Null - Null (Any Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(3)', getTextContent)).to.equal('Null (Any Of)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(3) + dl dt', getTextContent)).to.equal('Null (Any Of)')

            expect(await page.$eval('body main h2:nth-of-type(3) + dl dd', getTextContent)).to.equal('Null')
          })
        })

        describe('Null - Null (One Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(4)', getTextContent)).to.equal('Null (One Of)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(4) + dl dt', getTextContent)).to.equal('Null (One Of)')

            expect(await page.$eval('body main h2:nth-of-type(4) + dl dd', getTextContent)).to.equal('Null')
          })
        })

        describe('Null - Null (All Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('Null (All Of)'))

          it('Has a <dl />', async () => { // TODO - "(All Of)"?
            expect(await page.$eval('body main h2:nth-of-type(5) + dl dt', getTextContent)).to.equal('Null') // (All Of)')

            expect(await page.$eval('body main h2:nth-of-type(5) + dl dd', getTextContent)).to.equal('null')
          })
        })

        describe('Submitting', () => {
          before(async () => {
            page.click('body main button.govuk-button')

            await page.waitForNavigation()
          })

          it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/debark-stage'))
        })
      })
    })

    describe('Confirm', () => {
      before(async () => {
        page = await browser.newPage()

        await page.goto('https://localhost:5001/confirm-stage') // , { waitUntil: 'networkidle2' })
        await page.waitForSelector('h1')
      })

      it('Has an <h1 />', async () => expect(await page.$eval('body main h1', getTextContent)).to.equal('Confirmation'))
    })
  })
})
