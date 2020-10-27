import debug from 'debug'

import puppeteer from 'puppeteer'

import {
  expect
} from 'chai'

const log = debug('zashiki:e2e')

log('`zashiki` is awake')

const getTextContent = ({ textContent = '' }) => textContent.trim()

describe('@modernpoacher/zashiki-govuk-frontend/boolean', () => {
  const EMBARK = 'https://localhost:5001/embark-stage'
  const DEBARK = 'https://localhost:5001/debark-stage'
  const CONFIRM = 'https://localhost:5001/confirm-stage'

  before(() => {
    const {
      env: {
        DEBUG
      }
    } = process

    if (DEBUG) debug.enable(DEBUG)
  })

  let browser

  before(async () => { browser = await puppeteer.launch({ ignoreHTTPSErrors: true }) })

  after(async () => await browser.close())

  describe('Embark', () => {
    let page

    before(async () => {
      page = await browser.newPage()

      await page.goto(EMBARK)
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

  describe('Boolean', () => {
    let page

    before(async () => {
      page = await browser.newPage()

      await page.goto(EMBARK)

      await page.evaluate(() => {
        const option = Array.from(document.querySelectorAll('body main fieldset select option'))
          .find(({ text }) => text === 'Boolean')
        if (option) option.selected = true
      })

      page.click('body main button.govuk-button')

      await page.waitForNavigation()
    })

    describe('Boolean - Boolean', () => {
      const ROUTE = 'https://localhost:5001/boolean/boolean'

      before(async () => await page.goto(ROUTE))

      after(async () => {
        await page.goto(ROUTE)

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'true')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Boolean'))

      it('Has a Boolean component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('input[type="text"]', 'true')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto(ROUTE)

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Boolean - Boolean (Enum)', () => {
      const ROUTE = 'https://localhost:5001/boolean/boolean-enum'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Boolean (Enum)'))

      it('Has a Select component', async () => {
        const nodeList = await page.$$('body main fieldset.govuk-fieldset select.govuk-select')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.select('body main fieldset.govuk-fieldset select.govuk-select', '1')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Boolean - Boolean (Any Of)', () => {
      const ROUTE = 'https://localhost:5001/boolean/boolean-any-of'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Boolean (Any Of)'))

      it('Has a Select component', async () => {
        const nodeList = await page.$$('body main fieldset.govuk-fieldset select.govuk-select')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.select('body main fieldset.govuk-fieldset select.govuk-select', '1')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Boolean - Boolean (One Of)', () => {
      const ROUTE = 'https://localhost:5001/boolean/boolean-one-of'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Boolean (One Of)'))

      it('Has a Select component', async () => {
        const nodeList = await page.$$('body main fieldset.govuk-fieldset select.govuk-select')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.select('body main fieldset.govuk-fieldset select.govuk-select', '1')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Boolean - Boolean (All Of)', () => {
      const ROUTE = 'https://localhost:5001/boolean/boolean-all-of'

      before(async () => await page.goto(ROUTE))

      after(async () => {
        await page.goto(ROUTE)

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'true')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Boolean (All Of)'))

      it('Has a Boolean component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('input[type="text"]', 'true')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal(ROUTE))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto(ROUTE)

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal(ROUTE))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Debark', () => {
      before(async () => {
        page = await browser.newPage()

        await page.goto(DEBARK)
        await page.waitForSelector('h1')
      })

      it('Has an <h1 />', async () => expect(await page.$eval('body main h1', getTextContent)).to.equal('Boolean'))

      it('Has a <button />', async () => expect(await page.$eval('body main button.govuk-button', getTextContent)).to.equal('Accept and send'))

      describe('Summary', () => {
        describe('Boolean - Boolean', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('Boolean'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('Boolean')

            expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('true')
          })

          describe('Change', () => {
            before(async () => {
              page.click('body main h2:nth-of-type(1) + dl dd a')

              await page.waitForNavigation()

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'false')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('Boolean'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('Boolean')

              expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('false')
            })
          })
        })

        describe('Boolean - Boolean (Enum)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(2)', getTextContent)).to.equal('Boolean (Enum)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(2) + dl dt', getTextContent)).to.equal('Boolean (Enum)')

            expect(await page.$eval('body main h2:nth-of-type(2) + dl dd', getTextContent)).to.equal('false')
          })

          describe('Change', () => {
            before(async () => {
              page.click('body main h2:nth-of-type(2) + dl dd a')

              await page.waitForNavigation()

              await page.select('body main fieldset.govuk-fieldset select.govuk-select', '0')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(2)', getTextContent)).to.equal('Boolean (Enum)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(2) + dl dt', getTextContent)).to.equal('Boolean (Enum)')

              expect(await page.$eval('body main h2:nth-of-type(2) + dl dd', getTextContent)).to.equal('true')
            })
          })
        })

        describe('Boolean - Boolean (Any Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(3)', getTextContent)).to.equal('Boolean (Any Of)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(3) + dl dt', getTextContent)).to.equal('Boolean (Any Of)')

            expect(await page.$eval('body main h2:nth-of-type(3) + dl dd', getTextContent)).to.equal('False')
          })

          describe('Change', () => {
            before(async () => {
              page.click('body main h2:nth-of-type(3) + dl dd a')

              await page.waitForNavigation()

              await page.select('body main fieldset.govuk-fieldset select.govuk-select', '0')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(3)', getTextContent)).to.equal('Boolean (Any Of)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(3) + dl dt', getTextContent)).to.equal('Boolean (Any Of)')

              expect(await page.$eval('body main h2:nth-of-type(3) + dl dd', getTextContent)).to.equal('True')
            })
          })
        })

        describe('Boolean - Boolean (One Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(4)', getTextContent)).to.equal('Boolean (One Of)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(4) + dl dt', getTextContent)).to.equal('Boolean (One Of)')

            expect(await page.$eval('body main h2:nth-of-type(4) + dl dd', getTextContent)).to.equal('False')
          })

          describe('Change', () => {
            before(async () => {
              page.click('body main h2:nth-of-type(4) + dl dd a')

              await page.waitForNavigation()

              await page.select('body main fieldset.govuk-fieldset select.govuk-select', '0')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(4)', getTextContent)).to.equal('Boolean (One Of)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(4) + dl dt', getTextContent)).to.equal('Boolean (One Of)')

              expect(await page.$eval('body main h2:nth-of-type(4) + dl dd', getTextContent)).to.equal('True')
            })
          })
        })

        describe('Boolean - Boolean (All Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('Boolean (All Of)'))

          it('Has a <dl />', async () => { // TODO - "(All Of)"?
            expect(await page.$eval('body main h2:nth-of-type(5) + dl dt', getTextContent)).to.equal('Boolean') // (All Of)')

            expect(await page.$eval('body main h2:nth-of-type(5) + dl dd', getTextContent)).to.equal('true')
          })

          describe('Change', () => {
            before(async () => {
              page.click('body main h2:nth-of-type(5) + dl dd a')

              await page.waitForNavigation()

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'false')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('Boolean (All Of)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(5) + dl dt', getTextContent)).to.equal('Boolean')

              expect(await page.$eval('body main h2:nth-of-type(5) + dl dd', getTextContent)).to.equal('false')
            })
          })
        })

        describe('Submit', () => {
          before(async () => {
            page.click('body main button.govuk-button')

            await page.waitForNavigation()
          })

          it('Does not return to the same url', async () => expect(page.url()).not.to.equal(DEBARK))
        })
      })
    })

    describe('Confirm', () => {
      before(async () => {
        page = await browser.newPage()

        await page.goto(CONFIRM)
        await page.waitForSelector('h1')
      })

      it('Has an <h1 />', async () => expect(await page.$eval('body main h1', getTextContent)).to.equal('Confirmation'))
    })
  })
})
