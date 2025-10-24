// Import modul Selenium WebDriver dan modul assertion bawaan Node.js
const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

// Membuat Test Suite dengan Mocha
describe('SauceDemo Test Suite', function () {
  let driver; // Variabel driver akan digunakan di semua test case

  // Hook before() dijalankan sekali sebelum semua test case
  before(async function () {
    // Konfigurasi Chrome agar berjalan dalam mode headless (tanpa tampilan browser)
    const chrome = require('selenium-webdriver/chrome');
    const options = new chrome.Options();
    options.addArguments('--headless'); // Menjalankan browser di background

    // Inisialisasi driver dengan browser Chrome dan opsi headless
    driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  });

  // Hook after() dijalankan sekali setelah semua test case selesai
  after(async function () {
    await driver.sleep(2000); // Delay sebentar agar proses stabil sebelum quit
    await driver.quit(); // Menutup browser dan mengakhiri sesi
  });

  // Test Case 1: Login dan validasi logo
  it('Login dan cek logo', async function () {
    // Buka halaman login SauceDemo
    await driver.get('https://www.saucedemo.com');

    // Isi username dan password
    await driver.findElement(By.css('[data-test="username"]')).sendKeys('standard_user');
    await driver.findElement(By.xpath('//*[@data-test="password"]')).sendKeys('secret_sauce');

    // Klik tombol login
    await driver.findElement(By.className('submit-button')).click();

    // Cari elemen logo dan ambil teksnya
    const logo = await driver.findElement(By.className('app_logo'));
    const logoText = await logo.getText();

    // Validasi bahwa teks logo adalah "Swag Labs"
    assert.strictEqual(logoText, 'Swag Labs');
  });

  // Test Case 2: Sorting produk dari A ke Z
  it('Urutkan produk dari A-Z', async function () {
    // Buka halaman login lagi
    await driver.get('https://www.saucedemo.com');

    // Login seperti sebelumnya
    await driver.findElement(By.css('[data-test="username"]')).sendKeys('standard_user');
    await driver.findElement(By.xpath('//*[@data-test="password"]')).sendKeys('secret_sauce');
    await driver.findElement(By.className('submit-button')).click();

    // Temukan dropdown sorting dan pilih opsi "Name (A to Z)"
    const dropdown = await driver.findElement(By.css('.product_sort_container'));
    await dropdown.sendKeys('Name (A to Z)');

    // Ambil nama produk pertama setelah sorting
    const firstProduct = await driver.findElement(By.css('.inventory_item_name'));
    const productName = await firstProduct.getText();

    // Validasi bahwa nama produk tidak kosong
    assert.ok(productName.length > 0);
  });
});