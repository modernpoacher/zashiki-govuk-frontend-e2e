import debug from 'debug'

import puppeteer from 'puppeteer'

import {
  expect
} from 'chai'

const log = debug('zashiki:e2e')

log('`zashiki` is awake')

const getTextContent = (element) => element.textContent.trim()

describe('@modernpoacher/zashiki-govuk-frontend/array', () => {
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

  describe('Array', () => {
    let page

    before(async () => {
      page = await browser.newPage()

      await page.goto('https://localhost:5001/embark-stage') // , { waitUntil: 'networkidle2' })

      await page.evaluate(() => {
        const option = Array.from(document.querySelectorAll('body main fieldset select option'))
          .find(({ text }) => text === 'Array')
        if (option) option.selected = true
      })

      page.click('body main button.govuk-button')

      await page.waitForNavigation()
    })

    describe('Array - Array (String - Array)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-string-array'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Array)'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('input[type="text"]', 'string')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-string-array'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (String - Object)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-string-object'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Object)'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('input[type="text"]', 'string')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-string-object'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Number - Array)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-number-array'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Array)'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('input[type="text"]', '1')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-number-array'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Number - Object)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-number-object'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Object)'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('input[type="text"]', '1')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-number-object'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Array - Array)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-array-array'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Array - Array)'))

      it('Has a String <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')).not.to.be.null)

      it('Has a Number <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')).not.to.be.null)

      it('Has a Boolean <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')).not.to.be.null)

      it('Has a Null <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-array-array'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Array - Object)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-array-object'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Array - Object)'))

      it('Has a String <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')).not.to.be.null)

      it('Has a Number <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')).not.to.be.null)

      it('Has a Boolean <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')).not.to.be.null)

      it('Has a Null <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-array-object'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Object - Array)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-object-array'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Object - Array)'))

      it('Has a String <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')).not.to.be.null)

      it('Has a Number <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')).not.to.be.null)

      it('Has a Boolean <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')).not.to.be.null)

      it('Has a Null <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-object-array'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Object - Object)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-object-object'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Object - Object)'))

      it('Has a String <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(1) input[type="text"]')).not.to.be.null)

      it('Has a Number <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(2) input[type="text"]')).not.to.be.null)

      it('Has a Boolean <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(3) input[type="text"]')).not.to.be.null)

      it('Has a Null <input />', async () => expect(await page.$('.govuk-form-group:nth-of-type(4) input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('.govuk-form-group:nth-of-type(1) input[type="text"]', 'string')

          await page.type('.govuk-form-group:nth-of-type(2) input[type="text"]', '1')

          await page.type('.govuk-form-group:nth-of-type(3) input[type="text"]', 'true')

          await page.type('.govuk-form-group:nth-of-type(4) input[type="text"]', 'null')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-object-object'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Boolean - Array)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-boolean-array'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Boolean - Array)'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('input[type="text"]', 'true')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-boolean-array'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Boolean - Object)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-boolean-object'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Boolean - Object)'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('input[type="text"]', 'true')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-boolean-object'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Null - Array)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-null-array'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Null - Array)'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('input[type="text"]', 'null')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-null-array'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Null - Object)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-null-object'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Null - Object)'))

      it('Has an <input />', async () => expect(await page.$('input[type="text"]')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.type('input[type="text"]', 'null')

          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-null-object'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (String - Enum - Array)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-string-enum-array'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Enum - Array)'))

      it('Has a <select />', async () => expect(await page.$('select')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.select('select', '1')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-string-enum-array'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (String - Enum - Object)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-string-enum-object'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Enum - Object)'))

      it('Has a <select />', async () => expect(await page.$('select')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.select('select', '1')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-string-enum-object'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (String - Any Of - Array)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-string-any-of-array'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Any Of - Array)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Submitting input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-string-any-of-array'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (String - Any Of - Object)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-string-any-of-object'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - Any Of - Object)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Submitting input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-string-any-of-object'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (String - One Of - Array)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-string-one-of-array'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - One Of - Array)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Submitting input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-string-one-of-array'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (String - One Of - Object)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-string-one-of-object'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (String - One Of - Object)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Submitting input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-string-one-of-object'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Number - Enum - Array)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-number-enum-array'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Enum - Array)'))

      it('Has a <select />', async () => expect(await page.$('select')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.select('select', '1')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-number-enum-array'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Number - Enum - Object)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-number-enum-object'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Enum - Object)'))

      it('Has a <select />', async () => expect(await page.$('select')).not.to.be.null)

      describe('Submitting input', () => {
        before(async () => {
          await page.select('select', '1')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-number-enum-object'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Number - Any Of - Array)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-number-any-of-array'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Any Of - Array)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Submitting input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-number-any-of-array'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Number - Any Of - Object)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-number-any-of-object'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - Any Of - Object)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Submitting input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-number-any-of-object'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Number - One Of - Array)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-number-one-of-array'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - One Of - Array)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Submitting input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-number-one-of-array'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })

    describe('Array - Array (Number - One Of - Object)', () => {
      before(async () => await page.goto('https://localhost:5001/array/array-number-one-of-object'))

      it('Has an <h1 />', async () => expect(await page.$eval('h1', getTextContent)).to.equal('Array (Number - One Of - Object)'))

      it('Has a Radios component', async () => {
        const nodeList = await page.$$('.govuk-radios input[type="radio"]')

        return expect(nodeList).to.have.lengthOf.above(0)
      })

      describe('Submitting input', () => {
        before(async () => {
          await page.click('input[type="radio"][value="1"]')
          page.click('body main button.govuk-button')

          await page.waitForNavigation()
        })

        it('Does not return to the same url', async () => expect(page.url()).not.to.equal('https://localhost:5001/array/array-number-one-of-object'))

        it('Does not have an error summary', async () => expect(await page.$('.govuk-error-summary')).to.be.null)

        it('Does not have any error messages', async () => {
          const nodeList = await page.$$('.govuk-error-message')

          return expect(nodeList.length).to.equal(0)
        })
      })
    })
  })
})
