# 🚀 Quick Start Guide - Email Security Analyzer

This guide will help you quickly test the Chrome extension with dummy email data.

## 📁 What's Included

### Core Extension Files
- `manifest.json` - Chrome extension configuration
- `phishing-detector.js` - Core analysis engine
- `content.js` - Email platform integration
- `background.js` - Service worker
- `popup.html/css/js` - Extension popup interface
- `styles.css` - Warning overlay styles

### Test Environment
- `test-emails.js` - Dummy email data (3 valid, 4 suspicious)
- `test-page.html` - Standalone analysis dashboard
- `test-runner.html` - Gmail simulator for extension testing
- `split-screen-demo.html` - Split-screen interface with Gmail simulation

## 🎯 Testing Options

### Option 1: Quick Demo (Recommended)
**Best for:** Seeing analysis in action without installing extension

**A. Split-Screen Demo (NEW!):**
   ```bash
   # Open in your browser:
   file:///path/to/EmailAnalysis/split-screen-demo.html
   ```
   - Gmail-style interface on the right
   - Analysis controls on the left
   - Navigate between safe HR email and suspicious phishing email
   - Click "Analyze Email" to see real-time threat detection

**B. Dashboard View:**
   ```bash
   # Open in your browser:
   file:///path/to/EmailAnalysis/test-page.html
   ```
   - Click "🔍 Analyze All Emails" for automated analysis
   - Compare multiple emails side-by-side
   - Detailed analysis reports

### Option 2: Chrome Extension Testing
**Best for:** Testing the actual Chrome extension functionality

1. **Install Extension:**
   ```bash
   # Open Chrome and navigate to:
   chrome://extensions/
   
   # Enable "Developer mode" (top right toggle)
   # Click "Load unpacked"
   # Select the EmailAnalysis folder
   ```

2. **Test with Gmail Simulator:**
   ```bash
   # Open in browser:
   file:///path/to/EmailAnalysis/test-runner.html
   
   # Click "Load Extension" in bottom-right controls
   # Select different emails from the list
   # Click "Test Analysis" to trigger security analysis
   ```

3. **Test with Real Email Sites:**
   - Navigate to Gmail, Outlook, or Yahoo Mail
   - Extension automatically analyzes emails
   - Look for warning banners above suspicious emails
   - Click extension icon for detailed reports

### Option 3: Real Email Platform Testing
**Best for:** Production testing with real emails

1. **Install Extension** (follow Option 2, step 1)

2. **Navigate to Email Platform:**
   - Gmail: https://mail.google.com
   - Outlook: https://outlook.live.com
   - Yahoo: https://mail.yahoo.com

3. **Automatic Analysis:**
   - Extension detects email platform
   - Automatically scans visible emails
   - Shows warnings for suspicious content
   - Updates extension badge with threat count

## 📊 Test Email Data

### Valid Emails (3)
1. **Team Meeting Reminder**
   - Professional workplace communication
   - Legitimate domain and authentication
   - Risk Score: ~5/100

2. **Amazon Order Shipment**
   - Standard e-commerce notification
   - Proper Amazon domain and headers
   - Risk Score: ~8/100

3. **HR Ethnic Day Celebration** ⭐ *Featured in Split-Screen Demo*
   - Internal company announcement
   - HR department communication
   - Proper authentication and company domain
   - Risk Score: ~2/100

### Suspicious Emails (4)
1. **Fake Amazon Security Alert**
   - Typosquatting domain (amaz0n-security.com)
   - Failed authentication (SPF/DKIM/DMARC)
   - Urgent language and suspicious links
   - Risk Score: ~95/100

2. **Lottery Scam**
   - Classic advance fee fraud
   - Free domain (.ml)
   - Requests money and personal info
   - Risk Score: ~98/100

3. **PayPal Phishing**
   - Domain spoofing (paypaI vs paypal)
   - Fake verification links
   - Brand impersonation
   - Risk Score: ~88/100

4. **IT Security Credential Theft** ⭐ *Featured in Split-Screen Demo*
   - Fake IT department impersonation
   - Requests username and password
   - Suspicious domain (.tk) and threats
   - Risk Score: ~92/100

## 🔍 Analysis Features to Test

### Keyword Detection
- **Urgency words:** "URGENT", "IMMEDIATE", "EXPIRES"
- **Financial threats:** "suspended", "verify account"
- **Social engineering:** "click here", "confirm identity"

### URL Analysis
- **IP addresses:** Instead of domain names
- **Suspicious domains:** Free domains, typosquatting
- **Redirects:** Bit.ly, tinyurl, etc.

### Authentication Checks
- **SPF failures:** Sender Policy Framework
- **DKIM failures:** Domain Keys Identified Mail  
- **DMARC failures:** Domain-based Message Authentication

### Sender Analysis
- **Domain spoofing:** paypaI vs paypal
- **Typosquatting:** amaz0n vs amazon
- **Free domains:** .tk, .ml, .ga, .cf

## 🛠️ Troubleshooting

### Extension Not Loading
```bash
# Check Chrome console for errors:
F12 → Console tab

# Common issues:
# - File paths incorrect
# - Scripts blocked by browser security
# - Manifest.json syntax errors
```

### Analysis Not Running
```bash
# Verify scripts loaded:
# - phishing-detector.js should be available globally
# - content.js should inject into email pages
# - Check browser console for errors
```

### No Warnings Appearing
```bash
# Check extension status:
# - Extension enabled in chrome://extensions/
# - Proper permissions granted
# - Content script injected (check dev tools)
```

## 🎨 Customization

### Adjust Detection Sensitivity
```javascript
// In phishing-detector.js, modify thresholds:
determineRiskLevel(score) {
  if (score >= 70) return 'high';    // Adjust these values
  if (score >= 40) return 'medium';  // to change sensitivity
  if (score >= 20) return 'low';
  return 'minimal';
}
```

### Add Custom Keywords
```javascript
// In phishing-detector.js, extend keyword list:
this.suspiciousKeywords = [
  // Add your custom suspicious terms
  'your custom keyword',
  'another suspicious phrase'
];
```

### Modify Warning Display
```css
/* In styles.css, customize warning appearance: */
.email-security-warning {
  background: your-color !important;
  border: your-border !important;
}
```

## 📈 Performance Tips

### For Large Inboxes
- Disable real-time scanning for better performance
- Use manual analysis mode
- Adjust debounce timing in content.js

### For Development
- Enable verbose logging in console
- Use Gmail simulator for consistent testing
- Test with various email formats

## 🔐 Security Notes

- **All analysis runs locally** - no data sent to servers
- **Extension requires minimal permissions** - only email site access
- **Data automatically cleaned up** - old analysis deleted after 7 days
- **Privacy-first design** - no tracking or analytics

## 📞 Support

If you encounter issues:

1. **Check browser console** for error messages
2. **Verify file paths** in test URLs
3. **Ensure extension permissions** are granted
4. **Test with different browsers** if needed

---

**🎉 You're ready to test!** Start with Option 1 (test-page.html) for the quickest demo, then move to Option 2 for full extension testing. 