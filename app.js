const express = require('express');
const cors = require('cors');
const { chromium } = require('playwright');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

// הגדרות סופהבייס
const SUPABASE_URL = 'https://vcbcftlykgpvgwqwyzzf.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYmNmdGx5a2dwdmd3cXd5enpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTc0ODEsImV4cCI6MjA5MjUzMzQ4MX0.gm1t9ZBwPfU_F5_6XubTJOi77iFj1QXwIHOMtaeZZl8'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const getRandomName = () => {
    const firstNames = ['Amir', 'Itay', 'Noam', 'Yossi', 'Omer', 'Dani', 'Guy', 'Eyal', 'Tomer'];
    const lastNames = ['Shaul', 'Levi', 'Cohen', 'Mizrahi', 'Peretz', 'Azulay', 'Katz', 'Halevi'];
    return { first: firstNames[Math.floor(Math.random() * firstNames.length)], last: lastNames[Math.floor(Math.random() * lastNames.length)] };
};

const getRandomPhone = () => '05' + Math.floor(20000000 + Math.random() * 79999999).toString().substring(0, 8);

async function runBotLogic() {
    console.log("🚀 מתחיל את הבוט...");
    const browser = await chromium.launch({ headless: false }); 
    const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    
    const name = getRandomName();
    const phone = getRandomPhone();
    const emailPrefix = `amir${Math.random().toString(36).substring(2, 7)}`;
    const email = `${emailPrefix}@maildrop.cc`;
    const password = "Amir" + Math.floor(1000 + Math.random() * 9000) + "!";
    const birthday = "01051995";

    try {
        await page.goto('https://www.terminalx.com/women?auth=register', { waitUntil: 'networkidle' });
        await page.waitForSelector('#qa-register-email-input', { timeout: 15000 });

        // מילוי פרטים בשיטה האנושית שלך
        const forceFill = async (selector, value) => {
            const el = page.locator(selector).last();
            await el.focus();
            await el.fill("");
            for (const char of value) {
                await page.keyboard.type(char, { delay: Math.random() * 30 + 20 });
            }
            await page.keyboard.press('Tab');
        };

        await forceFill('#qa-register-email-input', email);
        await forceFill('#qa-register-firstname-input', name.first);
        await forceFill('#qa-register-lastname-input', name.last);
        await forceFill('#qa-register-telephone-input', phone);
        await forceFill('#qa-register-date_of_birth-input', birthday);
        await forceFill('#qa-register-password-input', password);

        await page.click('label:has-text("גברים")', { force: true });
        
        await page.evaluate(() => {
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => { if(!cb.checked) cb.click(); });
        });

        console.log("🖱️ שולח טופס...");
        await page.keyboard.press('Enter');

        console.log("⏳ בודק אם עלה CAPTCHA. פתור אותו ידנית עכשיו!");
        
        // הבוט מחכה עד לזיהוי הצלחה (מעבר דף)
        await page.waitForURL('**/customer/account/**', { timeout: 120000 });
        
        console.log("💾 שומר לסופהבייס...");
        await supabase.from('coupons').insert([{ 
            terminal_email: email, 
            terminal_password: password, 
            inbox_url: `https://maildrop.cc/inbox/?mailbox=${emailPrefix}` 
        }]);

        return { success: true, email };
    } catch (err) {
        return { success: false, error: err.message };
    } finally {
        setTimeout(() => browser.close(), 5000);
    }
}

app.post('/run-bot', async (req, res) => {
    const result = await runBotLogic();
    res.json(result);
});

app.listen(3001, () => console.log("🌐 הבוט מחכה בפורט 3001"));