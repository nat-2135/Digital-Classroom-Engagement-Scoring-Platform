const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log("Starting puppeteer browser...");
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    
    // Capture unhandled exceptions
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
    
    // Login as Teacher
    console.log("Navigating to login...");
    await page.goto('http://localhost:3000/login');
    
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 't3@test.com');
    await page.type('input[type="password"]', 'pw');
    await page.click('button[type="submit"]');

    // Wait for navigation
    await page.waitForNavigation();
    console.log("Logged in. Navigating to Weekly Tests tab...");
    
    // In teacher dashboard, click "Weekly Tests"
    // Wait for the dashboard to load sidebar
    await page.waitForTimeout(2000);
    
    // Take a screenshot of the main dashboard first
    await page.screenshot({ path: 'teacher_dashboard.png', fullPage: true });

    // evaluate and click tab
    await page.evaluate(() => {
        const tabs = document.querySelectorAll('button, div');
        for (const t of tabs) {
            if (t.innerText && t.innerText.includes('Weekly Tests')) {
                t.click();
            }
        }
    });

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'teacher_weekly_tests.png', fullPage: true });
    
    console.log("Screenshots captured. Check the output for console errors.");
    await browser.close();
})();
