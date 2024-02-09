const { By, Key, until, Builder } = require('selenium-webdriver')
require('chromedriver')
const assert = require('assert')
const { buildDriver, goToHome, teardown, captureScreensFor } = require('../../utils')

const SSOHomePage = require('../../pageobjects/SSOHomePage')

describe('When basic authentication is enabled but both Idps are down', function () {
  let driver
  let homePage
  let captureScreen

  before(async function () {
    driver = buildDriver()
    await goToHome(driver)
    homePage = new SSOHomePage(driver)
    captureScreen = captureScreensFor(driver, __filename)
  })

  it('should display a warning message for all oauth2 resources', async function () {
    await homePage.isLoaded()
    const warnings = await homePage.getWarnings()

    assert.equal(2, warnings.length)
    assert.equal(true, warnings[0].startsWith("OAuth resource RabbitMQ Development not available"))
    assert.equal(true, warnings[0].endsWith("not reachable"))
    assert.equal(true, warnings[1].startsWith("OAuth resource RabbitMQ Production not available"))
    assert.equal(true, warnings[1].endsWith("not reachable"))

  })

  it('should not be presented oauth2 section', async function () {
    await homePage.isLoaded()
    if (await homePage.isOAuth2SectionVisible()) {
      throw new Error('OAuth2 section should not be present')
    }
  })

  after(async function () {
    await teardown(driver, this, captureScreen)
  })
})
