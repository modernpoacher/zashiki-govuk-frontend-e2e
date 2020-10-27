import debug from 'debug'

import puppeteer from 'puppeteer'

import {
  expect
} from 'chai'

const log = debug('zashiki:e2e')

log('`zashiki` is awake')

const getTextContent = ({ textContent = '' }) => textContent.trim()

describe('@modernpoacher/zashiki-govuk-frontend/array', () => {
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

  describe('Array', () => {
    let page

    before(async () => {
      page = await browser.newPage()

      await page.goto(EMBARK)

      await page.evaluate(() => {
        const option = Array.from(document.querySelectorAll('body main fieldset select option'))
          .find(({ text }) => text === 'Array')
        if (option) option.selected = true
      })

      page.click('body main button.govuk-button')

      await page.waitForNavigation()
    })

    describe('Array - Array (String - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-array'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Array)'))

      it('Has a String component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.type('input[type="text"]', 'string')
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

    describe('Array - Array (String - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-object'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Object)'))

      it('Has a String component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.type('input[type="text"]', 'string')
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

    describe('Array - Array (Number - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-array'

      before(async () => await page.goto(ROUTE))

      after(async () => {
        await page.goto(ROUTE)

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', '1')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Array)'))

      it('Has a Number component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('input[type="text"]', '1')
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
        const ROUTE = 'https://localhost:5001/array/array-number-array'

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

    describe('Array - Array (Number - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-object'

      before(async () => await page.goto(ROUTE))

      after(async () => {
        await page.goto(ROUTE)

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', '1')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Object)'))

      it('Has a Number component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('input[type="text"]', '1')
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
        const ROUTE = 'https://localhost:5001/array/array-number-object'

        before(async () => {
          await page.goto(ROUTE)

          await page.type('input[type="text"]', 'string')
          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })

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

    describe('Array - Array (Array - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-array-array'

      before(async () => await page.goto(ROUTE))

      after(async () => {
        let input

        await page.goto(ROUTE)

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

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Array - Array)'))

      it('Has a String component', async () => expect(await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')).not.to.be.null)

      it('Has a Number component', async () => expect(await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')).not.to.be.null)

      it('Has a Boolean component', async () => expect(await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')).not.to.be.null)

      it('Has a Null component', async () => expect(await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

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
        const ROUTE = 'https://localhost:5001/array/array-array-array'

        before(async () => {
          let input

          await page.goto(ROUTE)

          input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'string')

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

    describe('Array - Array (Array - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-array-object'

      before(async () => await page.goto(ROUTE))

      after(async () => {
        let input

        await page.goto(ROUTE)

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

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Array - Object)'))

      it('Has a String component', async () => expect(await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')).not.to.be.null)

      it('Has a Number component', async () => expect(await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')).not.to.be.null)

      it('Has a Boolean component', async () => expect(await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')).not.to.be.null)

      it('Has a Null component', async () => expect(await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

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
          let input

          await page.goto(ROUTE)

          input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'string')

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

    describe('Array - Array (Object - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-object-array'

      before(async () => await page.goto(ROUTE))

      after(async () => {
        let input

        await page.goto(ROUTE)

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

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Object - Array)'))

      it('Has a String component', async () => expect(await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')).not.to.be.null)

      it('Has a Number component', async () => expect(await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')).not.to.be.null)

      it('Has a Boolean component', async () => expect(await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')).not.to.be.null)

      it('Has a Null component', async () => expect(await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

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
          let input

          await page.goto(ROUTE)

          input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'string')

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

    describe('Array - Array (Object - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-object-object'

      before(async () => await page.goto(ROUTE))

      after(async () => {
        let input

        await page.goto(ROUTE)

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

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Object - Object)'))

      it('Has a String component', async () => expect(await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')).not.to.be.null)

      it('Has a Number component', async () => expect(await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')).not.to.be.null)

      it('Has a Boolean component', async () => expect(await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')).not.to.be.null)

      it('Has a Null component', async () => expect(await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

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
          let input

          await page.goto(ROUTE)

          input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'string')

          input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'string')

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

    describe('Array - Array (Boolean - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-boolean-array'

      before(async () => await page.goto(ROUTE))

      after(async () => {
        await page.goto(ROUTE)

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'true')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Boolean - Array)'))

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

    describe('Array - Array (Boolean - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-boolean-object'

      before(async () => await page.goto(ROUTE))

      after(async () => {
        await page.goto(ROUTE)

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'true')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Boolean - Object)'))

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
        const ROUTE = 'https://localhost:5001/array/array-boolean-object'

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

    describe('Array - Array (Null - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-null-array'

      before(async () => await page.goto(ROUTE))

      after(async () => {
        await page.goto(ROUTE)

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'null')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Null - Array)'))

      it('Has a Null component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('input[type="text"]', 'null')

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
        const ROUTE = 'https://localhost:5001/array/array-null-array'

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

    describe('Array - Array (Null - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-null-object'

      before(async () => await page.goto(ROUTE))

      after(async () => {
        await page.goto(ROUTE)

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'null')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Null - Object)'))

      it('Has a Null component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('input[type="text"]', 'null')

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

    describe('Array - Array (String - Enum - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-enum-array'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Enum - Array)'))

      it('Has a <select />', async () => expect(await page.$('select')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.select('select', '1')
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

    describe('Array - Array (String - Enum - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-enum-object'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Enum - Object)'))

      it('Has a <select />', async () => expect(await page.$('select')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.select('select', '1')
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

    describe('Array - Array (String - Any Of - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-any-of-array'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Any Of - Array)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
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

    describe('Array - Array (String - Any Of - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-any-of-object'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Any Of - Object)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
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

    describe('Array - Array (String - One Of - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-one-of-array'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - One Of - Array)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
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

    describe('Array - Array (String - One Of - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-string-one-of-object'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - One Of - Object)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
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

    describe('Array - Array (Number - Enum - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-enum-array'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Enum - Array)'))

      it('Has a <select />', async () => expect(await page.$('select')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.select('select', '1')
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

    describe('Array - Array (Number - Enum - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-enum-object'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Enum - Object)'))

      it('Has a <select />', async () => expect(await page.$('select')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.select('select', '1')
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

    describe('Array - Array (Number - Any Of - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-any-of-array'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Any Of - Array)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
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

    describe('Array - Array (Number - Any Of - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-any-of-object'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Any Of - Object)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
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

    describe('Array - Array (Number - One Of - Array)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-one-of-array'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - One Of - Array)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
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

    describe('Array - Array (Number - One Of - Object)', () => {
      const ROUTE = 'https://localhost:5001/array/array-number-one-of-object'

      before(async () => await page.goto(ROUTE))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - One Of - Object)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
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

    describe('Debark', () => {
      before(async () => {
        page = await browser.newPage()

        await page.goto(DEBARK)
        await page.waitForSelector('h1')
      })

      it('Has an <h1 />', async () => expect(await page.$eval('body main h1', getTextContent)).to.equal('Array'))

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
              page.click('body main h2:nth-of-type(1) + dl dd a')

              await page.waitForNavigation()

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'change')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
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
              page.click('body main h2:nth-of-type(2) + dl dd a')

              await page.waitForNavigation()

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'change')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
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
              page.click('body main h2:nth-of-type(3) + dl dd a')

              await page.waitForNavigation()

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', '2')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
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
              page.click('body main h2:nth-of-type(4) + dl dd a')

              await page.waitForNavigation()

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', '2')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
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
                .map(({ textContent }) => textContent.trim())
            })

            const values = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(5) + dl dd.govuk-summary-list__value'))
                .map(({ textContent }) => textContent.trim())
            })

            const actions = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(5) + dl dd.govuk-summary-list__actions'))
                .map(({ textContent }) => textContent.trim())
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

              page.click('body main h2:nth-of-type(5) + dl dd a')

              await page.waitForNavigation()

              input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'change')

              input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '2')

              input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'false')

              input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('Array (Array - Array)'))

            it('Has a <dl />', async () => {
              const titles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(5) + dl dt'))
                  .map(({ textContent }) => textContent.trim())
              })

              const values = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(5) + dl dd.govuk-summary-list__value'))
                  .map(({ textContent }) => textContent.trim())
              })

              const actions = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(5) + dl dd.govuk-summary-list__actions'))
                  .map(({ textContent }) => textContent.trim())
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
                .map(({ textContent }) => textContent.trim())
            })

            const values = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(6) + dl dd.govuk-summary-list__value'))
                .map(({ textContent }) => textContent.trim())
            })

            const actions = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(6) + dl dd.govuk-summary-list__actions'))
                .map(({ textContent }) => textContent.trim())
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

              page.click('body main h2:nth-of-type(6) + dl dd a')

              await page.waitForNavigation()

              input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'change')

              input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '2')

              input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'false')

              input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(6)', getTextContent)).to.equal('Array (Array - Object)'))

            it('Has a <dl />', async () => {
              const titles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(6) + dl dt'))
                  .map(({ textContent }) => textContent.trim())
              })

              const values = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(6) + dl dd.govuk-summary-list__value'))
                  .map(({ textContent }) => textContent.trim())
              })

              const actions = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(6) + dl dd.govuk-summary-list__actions'))
                  .map(({ textContent }) => textContent.trim())
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
                .map(({ textContent }) => textContent.trim())
            })

            const values = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(7) + dl dd.govuk-summary-list__value'))
                .map(({ textContent }) => textContent.trim())
            })

            const actions = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(7) + dl dd.govuk-summary-list__actions'))
                .map(({ textContent }) => textContent.trim())
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

              page.click('body main h2:nth-of-type(7) + dl dd a')

              await page.waitForNavigation()

              input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'change')

              input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '2')

              input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'false')

              input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(7)', getTextContent)).to.equal('Array (Object - Array)'))

            it('Has a <dl />', async () => {
              const titles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(7) + dl dt'))
                  .map(({ textContent }) => textContent.trim())
              })

              const values = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(7) + dl dd.govuk-summary-list__value'))
                  .map(({ textContent }) => textContent.trim())
              })

              const actions = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(7) + dl dd.govuk-summary-list__actions'))
                  .map(({ textContent }) => textContent.trim())
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
                .map(({ textContent }) => textContent.trim())
            })

            const values = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(8) + dl dd.govuk-summary-list__value'))
                .map(({ textContent }) => textContent.trim())
            })

            const actions = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(8) + dl dd.govuk-summary-list__actions'))
                .map(({ textContent }) => textContent.trim())
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

              page.click('body main h2:nth-of-type(8) + dl dd a')

              await page.waitForNavigation()

              input = await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'change')

              input = await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '2')

              input = await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'false')

              input = await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
            })

            it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(8)', getTextContent)).to.equal('Array (Object - Object)'))

            it('Has a <dl />', async () => {
              const titles = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(8) + dl dt'))
                  .map(({ textContent }) => textContent.trim())
              })

              const values = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(8) + dl dd.govuk-summary-list__value'))
                  .map(({ textContent }) => textContent.trim())
              })

              const actions = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('body main h2:nth-of-type(8) + dl dd.govuk-summary-list__actions'))
                  .map(({ textContent }) => textContent.trim())
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
              page.click('body main h2:nth-of-type(9) + dl dd a')

              await page.waitForNavigation()

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'false')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
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
              page.click('body main h2:nth-of-type(10) + dl dd a')

              await page.waitForNavigation()

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'false')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
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
              page.click('body main h2:nth-of-type(11) + dl dd a')

              await page.waitForNavigation()

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'null')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
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
              page.click('body main h2:nth-of-type(12) + dl dd a')

              await page.waitForNavigation()

              const input = await page.$('input[type="text"]')
              await input.click({ clickCount: 3 })
              await page.type('input[type="text"]', 'null')

              page.click('body main button.govuk-button')

              await page.waitForNavigation()
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
