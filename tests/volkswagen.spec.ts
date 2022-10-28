// This test case spec contains everything needed to run a full visual test against the ACME bank site.
// It runs the test once locally, and then it performs cross-browser testing against multiple unique browsers in Applitools Ultrafast Grid.

import { test } from '@playwright/test';
import { BatchInfo, Configuration, VisualGridRunner, BrowserType, DeviceName, ScreenOrientation, Eyes, Target, ClassicRunner } from '@applitools/eyes-playwright';

// Applitools objects to share for all tests
export let Batch: BatchInfo;
export let Config: Configuration;
export let Runner: VisualGridRunner; 

test.beforeAll(async() => {


  Runner = new VisualGridRunner({ testConcurrency: 5 }); 


  Batch = new BatchInfo({name: 'Example: Playwright TypeScript with the Ultrafast Grid'});

  // Create a configuration for Applitools Eyes.
  Config = new Configuration();

  // Set the batch for the config.
  Config.setBatch(Batch);

  // Add 3 desktop browsers with different viewports for cross-browser testing in the Ultrafast Grid.
  // Other browsers are also available, like Edge and IE.
  Config.addBrowser(800, 600, BrowserType.CHROME);
  Config.addBrowser(1600, 1200, BrowserType.FIREFOX);

  Config.setLayoutBreakpoints(true); // No effect
  //Config.setDisableBrowserFetching(true); // nope, this makes it worse
});


test.describe('VW - Tutorial', () => {

  // Test-specific objects
  let eyes: Eyes;

  // This method sets up each test with its own Applitools Eyes object.
  test.beforeEach(async ({ page }) => {

    // Create the Applitools Eyes object connected to the VisualGridRunner and set its configuration.
    eyes = new Eyes(Runner, Config);

    // Open Eyes to start visual testing.
    // Each test should open its own Eyes for its own snapshots.
    // It is a recommended practice to set all four inputs below:
    await eyes.open(
      page,                             // The Playwright page object to "watch"
      'Login',                      // The name of the app under test
      test.info().title,                // The name of the test case
      { width: 1900, height: 800 });    // The viewport size for the local browser
  });
  

  test('log into a bank account', async ({ page }) => {

    // Load the login page.
    await page.goto('https://vwautocloud--dxpint.sandbox.my.site.com/s/login/?language=en_US');

    await page.waitForLoadState();
    await eyes.check('Login page', Target.window().fully()); // fully true/false doesn't matter

  });
  
  // This method performs cleanup after each test.
  test.afterEach(async () => {

    // Close Eyes to tell the server it should display the results.
    await eyes.closeAsync();

  });
});

test.afterAll(async() => {

  const results = await Runner.getAllTestResults();
  console.log('Visual test results', results);
});
