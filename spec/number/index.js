import debug from 'debug'

import puppeteer from 'puppeteer'

import {
  expect
} from 'chai'

const log = debug('zashiki:e2e')

log('`zashiki` is awake')

const getTextContent = (element) => element.textContent.trim()

describe('@modernpoacher/zashiki-govuk-frontend/number', () => {
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

      await page.goto('https://localhost:5001/embark-stage')
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

  describe('Number', () => {
    let page

    before(async () => {
      page = await browser.newPage()

      await page.goto('https://localhost:5001/embark-stage')

      await page.evaluate(() => {
        const option = Array.from(document.querySelectorAll('body main fieldset select option'))
          .find(({ text }) => text === 'Number')
        if (option) option.selected = true
      })

      page.click('body main button.govuk-button')

      await page.waitForNavigation()
    })

    describe('Number - Number', () => {
      before(async () => await page.goto('https://localhost:5001/number/number'))

      after(async () => {
        await page.goto('https://localhost:5001/number/number')

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', '1')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Number'))

      it('Has a Number component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.goto('https://localhost:5001/number/number')

          await page.type('input[type="text"]', '1')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/number/number'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto('https://localhost:5001/number/number')

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal('https://localhost:5001/number/number'))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Number - Number (Enum)', () => {
      before(async () => await page.goto('https://localhost:5001/number/number-enum'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Number (Enum)'))

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

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/number/number-enum'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Number - Number (Any Of)', () => {
      before(async () => await page.goto('https://localhost:5001/number/number-any-of'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Number (Any Of)'))

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

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/number/number-any-of'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Number - Number (One Of)', () => {
      before(async () => await page.goto('https://localhost:5001/number/number-one-of'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Number (One Of)'))

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

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/number/number-one-of'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Number - Number (All Of)', () => {
      before(async () => await page.goto('https://localhost:5001/number/number-all-of'))

      after(async () => {
        await page.goto('https://localhost:5001/number/number-all-of')

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', '1')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Number (All Of)'))

      it('Has a Number component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('input[type="text"]', '1')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/number/number-all-of'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto('https://localhost:5001/number/number-all-of')

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal('https://localhost:5001/number/number-all-of'))

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

        await page.goto('https://localhost:5001/debark-stage')
        await page.waitForSelector('h1')
      })

      it('Has an <h1 />', async () => expect(await page.$eval('body main h1', getTextContent)).to.equal('Number'))

      it('Has a <button />', async () => expect(await page.$eval('body main button.govuk-button', getTextContent)).to.equal('Accept and send'))

      describe('Summary', () => {
        describe('Number - Number', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('Number'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('Number')

            expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('1')
          })

          describe('Change', () => {
            before(async () => {
              page.click('body main h2:nth-of-type(1) + dl dd a')

              await page.waitForNavigation()

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', '2')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('Number'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('Number')

              expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('2')
            })
          })
        })

        describe('Number - Number (Enum)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(2)', getTextContent)).to.equal('Number (Enum)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(2) + dl dt', getTextContent)).to.equal('Number (Enum)')

            expect(await page.$eval('body main h2:nth-of-type(2) + dl dd', getTextContent)).to.equal('2')
          })
        })

        describe('Number - Number (Any Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(3)', getTextContent)).to.equal('Number (Any Of)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(3) + dl dt', getTextContent)).to.equal('Number (Any Of)')

            expect(await page.$eval('body main h2:nth-of-type(3) + dl dd', getTextContent)).to.equal('Two')
          })
        })

        describe('Number - Number (One Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(4)', getTextContent)).to.equal('Number (One Of)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(4) + dl dt', getTextContent)).to.equal('Number (One Of)')

            expect(await page.$eval('body main h2:nth-of-type(4) + dl dd', getTextContent)).to.equal('Two')
          })
        })

        describe('Number - Number (All Of)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('Number (All Of)'))

          it('Has a <dl />', async () => { // TODO - "(All Of)"?
            expect(await page.$eval('body main h2:nth-of-type(5) + dl dt', getTextContent)).to.equal('Number') // (All Of)')

            expect(await page.$eval('body main h2:nth-of-type(5) + dl dd', getTextContent)).to.equal('1')
          })

          describe('Change', () => {
            before(async () => {
              page.click('body main h2:nth-of-type(5) + dl dd a')

              await page.waitForNavigation()

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', '2')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('Number (All Of)'))

            it('Has a <dl />', async () => {
              expect(await page.$eval('body main h2:nth-of-type(5) + dl dt', getTextContent)).to.equal('Number')

              expect(await page.$eval('body main h2:nth-of-type(5) + dl dd', getTextContent)).to.equal('2')
            })
          })
        })

        describe('Submit', () => {
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

        await page.goto('https://localhost:5001/confirm-stage')
        await page.waitForSelector('h1')
      })

      it('Has an <h1 />', async () => expect(await page.$eval('body main h1', getTextContent)).to.equal('Confirmation'))
    })
  })
})
