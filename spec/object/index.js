import debug from 'debug'

import puppeteer from 'puppeteer'

import {
  expect
} from 'chai'

const log = debug('zashiki:e2e')

log('`zashiki` is awake')

const getTextContent = (element) => element.textContent.trim()

describe('@modernpoacher/zashiki-govuk-frontend/object', () => {
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

  describe('Object', () => {
    let page

    before(async () => {
      page = await browser.newPage()

      await page.goto('https://localhost:5001/embark-stage')

      await page.evaluate(() => {
        const option = Array.from(document.querySelectorAll('body main fieldset select option'))
          .find(({ text }) => text === 'Object')
        if (option) option.selected = true
      })

      page.click('body main button.govuk-button')

      await page.waitForNavigation()
    })

    describe('Object - Object (String)', () => {
      before(async () => await page.goto('https://localhost:5001/object/object-string'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (String)'))

      it('Has a String component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.type('input[type="text"]', 'string')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/object/object-string'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Object - Object (Number)', () => {
      before(async () => await page.goto('https://localhost:5001/object/object-number'))

      after(async () => {
        await page.goto('https://localhost:5001/object/object-number')

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', '1')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Number)'))

      it('Has a Number component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('input[type="text"]', '1')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/object/object-number'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto('https://localhost:5001/object/object-number')

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal('https://localhost:5001/object/object-number'))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Array - Array)', () => {
      before(async () => await page.goto('https://localhost:5001/object/object-array-array'))

      after(async () => {
        let input

        await page.goto('https://localhost:5001/object/object-array-array')

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

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Array - Array)'))

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

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/object/object-array-array'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          let input

          await page.goto('https://localhost:5001/object/object-array-array')

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

        it('Returns to the same url', async () => expect(page.url()).to.equal('https://localhost:5001/object/object-array-array'))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Array - Object - String)', () => {
      before(async () => await page.goto('https://localhost:5001/object/object-array-object-string'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Array - Object - String)'))

      it('Has a String component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input', () => {
        before(async () => {
          await page.type('input[type="text"]', 'string')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/object/object-array-object-string'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })
    })

    describe('Object - Object (Array - Object - Number)', () => {
      before(async () => await page.goto('https://localhost:5001/object/object-array-object-number'))

      after(async () => {
        await page.goto('https://localhost:5001/object/object-array-object-number')

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', '1')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Array - Object - Number)'))

      it('Has a Number component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('input[type="text"]', '1')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/object/object-array-object-number'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto('https://localhost:5001/object/object-array-object-number')

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal('https://localhost:5001/object/object-array-object-number'))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Array - Object - Boolean)', () => {
      before(async () => await page.goto('https://localhost:5001/object/object-array-object-boolean'))

      after(async () => {
        await page.goto('https://localhost:5001/object/object-array-object-boolean')

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'true')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Array - Object - Boolean)'))

      it('Has a Boolean component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('input[type="text"]', 'true')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/object/object-array-object-boolean'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto('https://localhost:5001/object/object-array-object-boolean')

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal('https://localhost:5001/object/object-array-object-boolean'))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Array - Object - Null)', () => {
      before(async () => await page.goto('https://localhost:5001/object/object-array-object-null'))

      after(async () => {
        await page.goto('https://localhost:5001/object/object-array-object-null')

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'null')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Array - Object - Null)'))

      it('Has a Null component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('input[type="text"]', 'null')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/object/object-array-object-null'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto('https://localhost:5001/object/object-array-object-null')

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal('https://localhost:5001/object/object-array-object-null'))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Object)', () => {
      before(async () => await page.goto('https://localhost:5001/object/object-object'))

      after(async () => {
        let input

        await page.goto('https://localhost:5001/object/object-object')

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

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Object)'))

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

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/object/object-object'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          let input

          await page.goto('https://localhost:5001/object/object-object')

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

        it('Returns to the same url', async () => expect(page.url()).to.equal('https://localhost:5001/object/object-object'))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Boolean)', () => {
      before(async () => await page.goto('https://localhost:5001/object/object-boolean'))

      after(async () => {
        await page.goto('https://localhost:5001/object/object-boolean')

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'true')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Boolean)'))

      it('Has a Boolean component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('input[type="text"]', 'true')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/object/object-boolean'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto('https://localhost:5001/object/object-boolean')

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal('https://localhost:5001/object/object-boolean'))

        it('Has an error summary', async () => expect(await page.$('.govuk-error-summary')).not.to.be.null)

        it('Has some error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf.above(0)
        })
      })
    })

    describe('Object - Object (Null)', () => {
      before(async () => await page.goto('https://localhost:5001/object/object-null'))

      after(async () => {
        await page.goto('https://localhost:5001/object/object-null')

        const input = await page.$('input[type="text"]')
        await input.click({ clickCount: 3 })
        await page.type('input[type="text"]', 'null')

        page.click('body main button.govuk-button')

        await page.waitForNavigation()
      })

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Object (Null)'))

      it('Has a Null component', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Input is valid', () => {
        before(async () => {
          await page.type('input[type="text"]', 'null')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/object/object-null'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList).to.have.lengthOf(0)
        })
      })

      describe('Input is invalid', () => {
        before(async () => {
          await page.goto('https://localhost:5001/object/object-null')

          const input = await page.$('input[type="text"]')
          await input.click({ clickCount: 3 })
          await page.type('input[type="text"]', 'string')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Returns to the same url', async () => expect(page.url()).to.equal('https://localhost:5001/object/object-null'))

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

      it('Has an <h1 />', async () => expect(await page.$eval('body main h1', getTextContent)).to.equal('Object'))

      it('Has a <button />', async () => expect(await page.$eval('body main button.govuk-button', getTextContent)).to.equal('Accept and send'))

      describe('Summary', () => {
        describe('Object - Object (String)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(1)', getTextContent)).to.equal('Object (String)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(1) + dl dt', getTextContent)).to.equal('String')

            expect(await page.$eval('body main h2:nth-of-type(1) + dl dd', getTextContent)).to.equal('string')
          })
        })

        describe('Object - Object (Number)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(2)', getTextContent)).to.equal('Object (Number)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(2) + dl dt', getTextContent)).to.equal('Number')

            expect(await page.$eval('body main h2:nth-of-type(2) + dl dd', getTextContent)).to.equal('1')
          })
        })

        describe('Object - Object (Array - Array)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(3)', getTextContent)).to.equal('Object (Array - Array)'))

          it('Has a <dl />', async () => {
            const titles = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(3) + dl dt'))
                .map(({ textContent }) => textContent.trim())
            })

            const values = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(3) + dl dd.govuk-summary-list__value'))
                .map(({ textContent }) => textContent.trim())
            })

            const actions = await page.evaluate(() => {
              return Array.from(document.querySelectorAll('body main h2:nth-of-type(3) + dl dd.govuk-summary-list__actions'))
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
        })

        describe('Object - Object (Array - Object - String)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(4)', getTextContent)).to.equal('Object (Array - Object - String)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(4) + dl dt', getTextContent)).to.equal('String')

            expect(await page.$eval('body main h2:nth-of-type(4) + dl dd', getTextContent)).to.equal('string')
          })
        })

        describe('Object - Object (Array - Object - Number)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(5)', getTextContent)).to.equal('Object (Array - Object - Number)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(5) + dl dt', getTextContent)).to.equal('Number')

            expect(await page.$eval('body main h2:nth-of-type(5) + dl dd', getTextContent)).to.equal('1')
          })
        })

        describe('Object - Object (Array - Object - Boolean)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(6)', getTextContent)).to.equal('Object (Array - Object - Boolean)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(6) + dl dt', getTextContent)).to.equal('Boolean')

            expect(await page.$eval('body main h2:nth-of-type(6) + dl dd', getTextContent)).to.equal('true')
          })
        })

        describe('Object - Object (Array - Object - Null)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(7)', getTextContent)).to.equal('Object (Array - Object - Null)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(7) + dl dt', getTextContent)).to.equal('Null')

            expect(await page.$eval('body main h2:nth-of-type(7) + dl dd', getTextContent)).to.equal('null')
          })
        })

        describe('Object - Object (Object)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(8)', getTextContent)).to.equal('Object (Object)'))

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
        })

        describe('Object - Object (Boolean)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(9)', getTextContent)).to.equal('Object (Boolean)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(9) + dl dt', getTextContent)).to.equal('Boolean')

            expect(await page.$eval('body main h2:nth-of-type(9) + dl dd', getTextContent)).to.equal('true')
          })
        })

        describe('Object - Object (Null)', () => {
          it('Has an <h2 />', async () => expect(await page.$eval('body main h2:nth-of-type(10)', getTextContent)).to.equal('Object (Null)'))

          it('Has a <dl />', async () => {
            expect(await page.$eval('body main h2:nth-of-type(10) + dl dt', getTextContent)).to.equal('Null')

            expect(await page.$eval('body main h2:nth-of-type(10) + dl dd', getTextContent)).to.equal('null')
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

        await page.goto('https://localhost:5001/confirm-stage')
        await page.waitForSelector('h1')
      })

      it('Has an <h1 />', async () => expect(await page.$eval('body main h1', getTextContent)).to.equal('Confirmation'))
    })
  })
})
