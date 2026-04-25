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

const getRandomIdentity = () => {
    const firstNames = ['Itay', 'Noam', 'Yossi', 'Omer', 'Dani', 'Eyal', 'Guy', 'Tomer', 'Amit', 'Niv', 'Idan', 'Amir'];
    const lastNames = ['Mizrahi', 'Peretz', 'Azulay', 'Katz', 'Halevi', 'Levi', 'Cohen', 'Biton', 'Golan', 'Shaul'];
    return { 
        first: firstNames[Math.floor(Math.random() * firstNames.length)], 
        last: lastNames[Math.floor(Math.random() * lastNames.length)] 
    };
};

async function runBotLogic(userId) {
    console.log(`🤖 הבוט מתחיל למלא פרטים עבור משתמש: ${userId}`);
    const browser = await chromium.launch({ headless: false }); 
    const context = await browser.newContext();
    const page = await context.newPage();
    
    const identity = getRandomIdentity();
    const fullName = `${identity.first} ${identity.last}`;
    const emailPrefix = `amir${Math.random().toString(36).substring(2, 7)}`;
    const email = `${emailPrefix}@maildrop.cc`;
    const password = "Amir" + Math.floor(1000 + Math.random() * 9000) + "!";

    try {
        await page.goto('https://www.terminalx.com/women?auth=register', { waitUntil: 'networkidle' });

        await page.fill('#qa-register-email-input', email);
        await page.fill('#qa-register-firstname-input', identity.first);
        await page.fill('#qa-register-lastname-input', identity.last);
        await page.fill('#qa-register-telephone-input', '05' + Math.floor(20000000 + Math.random() * 70000000));
        await page.fill('#qa-register-date_of_birth-input', '01051995');

        const passField = page.locator('#qa-register-password-input');
        await passField.click();
        await page.keyboard.type(password, { delay: 120 });
        await page.keyboard.press('Tab');

        await page.click('label:has-text("גברים")', { force: true });
        
        // --- עדכון סימון התיבות (ווי בכולן) ---
        await page.evaluate(() => {
            // מוצא את כל ה-Checkboxes בדף
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(cb => {
                // לוחץ רק אם לא מסומן כבר
                if (!cb.checked) {
                    cb.click();
                }
            });
        });

        // ליתר ביטחון, לחיצה מפורשת לפי ה-ID והשם כדי שלא יתפספס
        try {
            await page.locator('input[name="agreements"]').check({ force: true });
            await page.locator('input[name="is_subscribed"]').check({ force: true });
        } catch (e) {
            console.log("סימון תיבות נוסף בוצע");
        }
        // ------------------------------------

        await page.waitForTimeout(1000);
        const submitBtn = page.locator('.submit-btn_1KTI');
        await submitBtn.click({ force: true });

        console.log("⏳ ממתין לזיהוי כניסה מוצלחת (פתור קאפצ'ה אם צריך)...");

        try {
            await Promise.race([
                page.waitForFunction(() => 
                    document.body.innerText.includes('שלום') || 
                    document.body.innerText.includes('הי') || 
                    window.location.href.includes('account')
                , { timeout: 120000 }), 
                page.waitForURL('**/customer/account/**', { timeout: 120000 })
            ]);

            console.log("✅ הכניסה זוהתה! שומר נתונים לסופהבייס...");

            const { error } = await supabase.from('coupons').insert([{ 
                terminal_email: email, 
                terminal_password: password, 
                inbox_url: `https://maildrop.cc/inbox/?mailbox=${emailPrefix}`,
                full_name: fullName,
                user_id: userId,
                created_at: new Date().toISOString()
            }]);

            if (error) {
                console.error("❌ שגיאה בשמירה לסופהבייס:", error.message);
            } else {
                console.log("⭐ הצלחה! המשתמש נשמר ויופיע באתר שלך.");
            }

            return { success: true, email };

        } catch (timeoutErr) {
            console.error("❌ הבוט לא זיהה כניסה (Time Out). וודא שפתרת את הקאפצ'ה והגעת לדף החשבון.");
            return { success: false, error: "timeout" };
        }

    } catch (err) {
        console.error("⚠️ תקלה כללית בבוט:", err.message);
        return { success: false, error: err.message };
    }
}

app.post('/run-bot', async (req, res) => {
    const { userId } = req.body; 
    
    if (!userId) {
        return res.status(400).json({ success: false, error: "Missing userId" });
    }

    const result = await runBotLogic(userId);
    res.json(result);
});

app.listen(3001, () => console.log("🌐 השרת רץ על פורט 3001 - מוכן לייצור משתמשים!"));