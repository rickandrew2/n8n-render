# 🎂 Zapier Birthday Bot — Complete Setup Guide

## 📋 What You'll Need

- A Zapier account (free or paid)
- A Google Sheet to store birthdays and contact info
- One of these messaging services:
  - Gmail (easiest)
  - Discord
  - Telegram
  - Messenger (requires Facebook Page token)

---

## 🧱 STEP 1: Make Your Google Sheet

### Create a New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it **"Birthdays List"** (or any name you prefer)

### Set Up Your Columns

| Name | Birthday | Message | Email |
|------|----------|---------|-------|
| John | 2025-11-02 | Happy Birthday bro 🎉🎂 | john@example.com |
| Mary | 2025-12-01 | Wishing you the best day ever 💖 | mary@example.com |
| Alex | 2025-12-15 | Hope you have an amazing day! 🎊 | alex@example.com |

**Important Notes:**
- Use **YYYY-MM-DD** format for dates (e.g., 2025-11-02)
- Use the exact column headers: `Name`, `Birthday`, `Message`, `Email`
- Make sure Row 1 contains your headers
- Add your actual birthday data starting from Row 2

---

## ⚙️ STEP 2: Create the Zap

**📋 Zap Flow Summary:**
1. Schedule by Zapier (Trigger)
2. Google Sheets (Get birthday data)
3. Filter by Zapier (Match today's date)
4. **Looping by Zapier (Process each person individually)** ⚠️ CRITICAL!
5. AI by Zapier (Generate personalized message) - Optional
6. Gmail/Discord/Telegram (Send message)

### Go to Zapier

1. Log in to [Zapier](https://zapier.com)
2. Click **"Create Zap"** in the top right

---

### 🔔 TRIGGER: Schedule by Zapier

1. **Search for:** `Schedule by Zapier`
2. **Choose Event:** `Every Day`
3. **Click:** "Continue"

#### Configure the Trigger

1. **Trigger Interval:** `Every Day`
2. **Time of Day:** Set to `9:00 AM` (or your preferred time)
3. **Timezone:** Select your timezone
4. **Click:** "Continue"

#### Test the Trigger

1. Click **"Test trigger"** to verify it works
2. Click **"Continue"** when done

---

### 📊 ACTION 1: Get Birthday Data from Google Sheets

1. **Click:** "+ Add a Step"
2. **Search for:** `Google Sheets`
3. **Choose Event:** `Find Many Spreadsheet Rows (Advanced, With Line Item Support)`
4. **Click:** "Continue"

#### Connect Google Sheets (if first time)

1. Click **"Sign in to Google Sheets"**
2. Follow the prompts to authenticate
3. Grant permissions to Zapier

#### Configure the Action

1. **Drive:** Select `My Google Drive`
2. **Spreadsheet:** Choose your **"Birthdays List"** spreadsheet
3. **Worksheet:** Select `Sheet1` (or your worksheet name)
4. **Columns:** `A:D` (or adjust based on your columns)
5. **Row count:** `100` (adjust based on how many birthdays you have)
6. **Output format:** `All: Rows, (JSON) Raw Rows and Formatted...`
7. **First row:** `2` (Row 1 is headers)
8. **Successful if no search results are found?:** `False`
9. **Click:** "Continue"

#### Test the Action

1. Click **"Test action"**
2. Verify it pulls your birthday data
3. Click **"Continue"**

---

### 🔍 ACTION 2: Filter by Zapier

1. **Click:** "+ Add a Step"
2. **Search for:** `Filter by Zapier`
3. **Click:** "Continue"

#### Configure the Filter

1. **Only continue if:** Set up a condition (this section is already there)
2. **Field 1 (Left side):** Click the empty field → Select `Birthday` from your Google Sheets data
   - You should see something like "2. Formatted Rows COL B" or "Birthday"
3. **Condition (Middle):** Select `(Date/time) Contains` from the dropdown ⚠️ USE "Contains" NOT "Equals" or "Exactly matches"
4. **Field 2 (Right side):** This is where it gets tricky!
   - Click inside the "Enter text or insert data..." field
   - Click the **"+"** icon that appears
   - A menu will pop up
   - Click **"Add formatter"**
   - You'll see a list of formatters
   - Find and click: **"Formatter → Date/Time → Format"**
   - Now configure the formatter:
     - **Input:** Click inside → Look for `TODAY()` in the dropdown OR manually type it
     - **Format String:** Type exactly `YYYY-MM-DD` (this matches your Google Sheets format)
5. **Click:** "Continue"

**📝 Visual Guide:**
```
[Birthday Column] [Contains] [TODAY() formatted as YYYY-MM-DD]
    Field 1       Condition          Field 2
```

**⚠️ WHY "Contains" instead of "Equals"?**
- Google Sheets returns multiple rows as comma-separated values like "2025-11-02,2025-12-01"
- "Contains" will match if today's date appears anywhere in that string
- "Equals" only works if there's exactly one date that matches perfectly

**🎥 Step-by-Step for Field 2 (RIGHT SIDE):**

1. You'll see an empty field on the RIGHT that says "Enter text or insert data..."
2. **⚠️ IMPORTANT:** If a pop-up window titled "Insert data for Only continue if... Dynamic" is open:
   - **CLOSE IT** by clicking outside the pop-up or pressing ESC
   - This pop-up is blocking the "+" button!
3. Look for the little **"+"** icon on the RIGHT side of the "Enter text or insert data..." field
4. Click the **"+"** button
5. **NOW** a dropdown menu appears with options like:
   - "Insert Data"
   - "Add formatter" ← **THIS ONE!**
   - "Copilot suggestions"
6. Click **"Add formatter"**
7. A list of formatters appears, categorized by type
8. Scroll down or click **"Date/Time"** category
9. Click **"Format"** under Date/Time
10. A formatter configuration box appears with 2 fields:
    - **Input:** (empty field)
    - **Format String:** (empty field)
11. For **Input field:** Click inside it → You might see `TODAY()` in the dropdown, OR just type `TODAY()` manually
12. For **Format String field:** Type: `YYYY-MM-DD`
13. Click **"Done"** or just click outside the box
14. You should now see something like "TODAY() Format" in Field 2

**💡 Alternative if you can't find TODAY():**
- Try typing just `today` in the Input field
- Or click the dropdown and look for date options

#### Test the Filter

1. Click **"Test filter"**
2. **⚠️ IMPORTANT:** The filter might fail because of how Google Sheets returns multiple rows
3. If you see an error like "Formatted rows[]col$b: 2025-11-02,2025-12-01" (comma-separated dates):
   - This happens when your Google Sheet has multiple birthday dates
   - The filter is working correctly, but it's testing against ALL rows at once
   - **Click "Continue" anyway** - it will work when running daily

4. **If testing with only ONE birthday in your sheet:** It should match successfully
5. Click **"Continue"** to proceed

**💡 Pro Tip:** You can test with just one birthday entry in your sheet to verify the filter works, then add more entries later.

---

### 🔄 ACTION 2.5: Loop by Zapier (CRITICAL!)

**⚠️ IMPORTANT:** This step is ESSENTIAL! Without it, your Zap will send ONE email to ALL people with the same birthday instead of individual emails for each person.

1. **Click:** "+ Add a Step" (after Filter, before AI/Gmail)
2. **Search for:** `Looping by Zapier`
3. **Choose Event:** `Looping`
4. **Click:** "Continue"

#### Configure the Loop

1. **Use values from:** Select the entire output from your Google Sheets step
   - Look for "2. Formatted Rows" or similar
2. **Click:** "Continue" and test
3. This creates a loop that runs the subsequent steps ONCE for each birthday found

**📝 Why This Matters:**
- Without Loop: John AND Mary get ONE combined email ❌
- With Loop: John gets his own email, Mary gets her own email ✅

---

### 💬 ACTION 3: Send Message

Choose ONE of the following options based on your preference:

---

#### 📧 **Option A: Gmail (Recommended)**

1. **Click:** "+ Add a Step"
2. **Search for:** `Gmail`
3. **Choose Event:** `Send an Email`
4. **Click:** "Continue"

##### Configure Gmail

1. **Connect Gmail:** Sign in if needed
2. **Send Email As:** Your email address
3. **To:** Click field → Select `Email` from Google Sheets data
4. **Subject:** `🎉 Happy Birthday {{Name}}!`
5. **Body Type:** `Plain Text` or `HTML`
6. **Body Text:** 
   
   **⚠️ IMPORTANT:** If you're using AI by Zapier (Step 4), you need to use the AI-generated message instead of static text!
   
   **WITHOUT AI (Simple version):**
   ```
   Hey {{Name}} 🎉
   
   Just wanted to wish you a very happy birthday! Hope your day's amazing 🎂
   ```
   
   **WITH AI (Personalized version):**
   - **CLEAR** all the static text in the Body field
   - Click the **"+"** icon next to the Body field
   - Click **"Insert data"**
   - Look for step **"4. Analyze and Return Data"** (AI by Zapier)
   - Select the AI-generated message/output from that step
   - The field should now show something like "4. Output" or "4. Result"

7. **Click:** "Continue"

##### Test Gmail Action

1. Click **"Test action"**
2. Verify it sends correctly
3. Click **"Continue"**

---

#### 💻 **Option B: Discord**

1. **Click:** "+ Add a Step"
2. **Search for:** `Discord`
3. **Choose Event:** `Send Channel Message` or `Send Direct Message`
4. **Click:** "Continue"

##### Configure Discord

1. **Connect Discord:** Sign in and authorize Zapier
2. **Channel:** Select your channel
3. **Bot Username:** Your Discord bot name
4. **Message Text:**
   ```
   Hey {{Name}} 🎉
   Just wanted to wish you a very happy birthday! Hope your day's amazing 🎂
   ```
5. **Click:** "Continue" and test

---

#### 📱 **Option C: Telegram**

1. **Click:** "+ Add a Step"
2. **Search for:** `Telegram`
3. **Choose Event:** `Send Message`
4. **Click:** "Continue"

##### Configure Telegram

1. **Connect Telegram:** Get your bot token
2. **Chat ID:** Enter recipient's chat ID
3. **Message Text:**
   ```
   Hey {{Name}} 🎉
   Just wanted to wish you a very happy birthday! Hope your day's amazing 🎂
   ```
4. **Click:** "Continue" and test

---

### ⚡️ BONUS: Personalize with AI by Zapier (Optional)

**Note:** OpenAI's "Create Completion" has been replaced. Use "AI by Zapier" instead for a better experience!

1. **Click:** "+ Add a Step" (before the message step)
2. **Search for:** `AI by Zapier` (NOT "OpenAI" or "ChatGPT")
3. **Choose Event:** `Create Prompt with Chat Model`
4. **Click:** "Continue"

#### Configure AI by Zapier

1. **Connect account:** Sign in if needed
2. **Model:** Select `GPT-4` or `GPT-4o mini` or `GPT-3.5` from dropdown
3. **Prompt Builder:** You'll see an "Input fields" section

#### Add the Name Field

1. **Click:** "Add value set" button under "Input fields"
2. Two fields appear:
   - **Field Name:** Type: `Name`
   - **Field Value:** Click inside the empty field, then click the **"+"** icon that appears → Select `Name` from your Google Sheets step (look for "2. Formatted Rows COL A" or similar)
3. **In the Prompt text area** below, change it to:
   ```
   Write a short and funny birthday message for {{Name}} with emojis.
   ```
4. The `{{Name}}` will automatically use the field you just created!
5. **Click:** "Continue" and test

**Then modify your Gmail/Discord/Telegram action to use the AI-generated message instead of static text.**

**💡 Using AI Response:**
- In your message action, click the field for message body
- Click "+" → Insert data
- Select the AI-generated message from the AI by Zapier step

---

## 🚀 STEP 3: Publish Your Zap

1. **Review:** Check all steps are configured correctly
2. **Name Your Zap:** Click "Untitled Zap Draft" → Name it "Birthday Bot"
3. **Turn On:** Click the toggle at the top to **"ON"**
4. **Save:** Your Zap is now live! 🎉

---

## 📝 Example Message Templates

### Simple Template
```
Hey {{Name}} 🎉
Just wanted to wish you a very happy birthday! Hope your day's amazing 🎂
```

### Friendly Template
```
Happy Birthday {{Name}}! 🎊🎂

Hope your special day is filled with joy and celebration. Have an awesome one! 🥳
```

### Funny Template
```
{{Name}}, time flies when you're having fun! 
Another year older, another year wiser (or so they say 😏)
Happy Birthday! 🎉🎂
```

---

## 🔧 Troubleshooting

### Filter Not Working?
- Make sure your date format matches: `YYYY-MM-DD`
- Verify the date column is formatted as date in Google Sheets
- Check timezone settings in Zapier

### No Emails/Messages Sent?
- Verify your test runs first
- Check Zap history for errors
- Ensure your trigger time is set correctly
- Make sure the Zap is turned ON

### Data Not Pulling from Sheets?
- Verify Google Sheets connection
- Check column names match exactly
- Ensure "First row" is set to 2
- Test with a smaller row count first

---

## 💡 Tips

1. **Test First:** Always test your Zap in "Draft" mode before turning it ON
2. **Date Format:** Stick to `YYYY-MM-DD` for consistency
3. **Multiple Recipients:** The Zap handles multiple birthdays on the same day automatically
4. **Time Zone:** Set your preferred time zone for when the Zap runs
5. **Backup:** Keep a copy of your birthday data elsewhere
6. **Monitor:** Check Zap runs daily initially to ensure it's working

---

## 📅 Maintenance

### Update Birthdays
- Simply edit your Google Sheet
- Changes take effect on the next Zap run

### Add New Friends
- Add rows to your Google Sheet
- No need to modify the Zap

### Pause the Zap
- Turn it OFF in Zapier dashboard
- Turn it back ON when ready

---

## ✅ Quick Checklist

- [ ] Google Sheet created with proper column headers
- [ ] Birthday data added in `YYYY-MM-DD` format
- [ ] Zapier account created
- [ ] Trigger configured (Schedule by Zapier)
- [ ] Google Sheets action configured
- [ ] Filter by Zapier configured
- [ ] **Looping by Zapier added (CRITICAL for individual emails!)**
- [ ] Filter action configured
- [ ] Messaging action configured (Gmail/Discord/Telegram)
- [ ] All actions tested
- [ ] Zap turned ON and published

---

## 🎉 You're Done!

Your Birthday Bot is now live and will automatically send birthday wishes daily! Check your Zap history regularly to make sure everything is running smoothly.

**Need Help?** 
- Check [Zapier Community](https://community.zapier.com)
- Read [Zapier Documentation](https://zapier.com/apps)

