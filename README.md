# Email Security Analyzer - Prototype for Chrome Extension

#Link - https://varshakaushik17.github.io/Vigilant_Inbox/

Created a prototype to demonstrate how a comprehensive Chrome extension will be used for detecting phishing emails, analyzing metadata, and providing real-time security warnings across major email platforms.

## 🛡️ Features

### Advanced Phishing Detection
- **Smart Keyword Analysis**: Detects suspicious language patterns and social engineering tactics
- **URL Analysis**: Identifies malicious links, IP-based URLs, and domain spoofing attempts
- **Metadata Verification**: Checks SPF, DKIM, and DMARC authentication records
- **Sender Analysis**: Detects domain spoofing and suspicious sender patterns

### Real-Time Protection
- **Live Email Scanning**: Automatically analyzes emails as you read them
- **Instant Warnings**: Displays color-coded alerts for different threat levels
- **Platform Integration**: Works seamlessly with Gmail, Outlook, Yahoo Mail, and more
- **Non-Intrusive**: Lightweight analysis that doesn't slow down your email experience

### Comprehensive Security Features
- **Risk Scoring**: Assigns numerical risk scores (0-100) to each email
- **Threat Categories**: Classifies threats as minimal, low, medium, or high risk
- **Detailed Analysis**: Provides specific reasons for flagging suspicious content
- **Historical Tracking**: Maintains records of detected threats and analysis results

## 🌐 Upcoming Supported Platforms

- **Gmail** (mail.google.com)
- **Outlook** (outlook.live.com, outlook.office.com, outlook.office365.com)
- **Yahoo Mail** (yahoo.com)
- **ProtonMail** (protonmail.com)

## 📥 Installation

### From Chrome Web Store
1. Visit the Chrome Web Store (link coming soon)
2. Click "Add to Chrome"
3. Confirm installation permissions
4. Navigate to any supported email platform to start protection

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension directory
5. The extension will be installed and ready to use

## 🚀 Usage

### Getting Started
1. Install the extension
2. Navigate to your email platform (Gmail, Outlook, etc.)
3. The extension automatically begins analyzing emails
4. Warning banners appear above suspicious emails

### Understanding Warnings

#### Risk Levels
- 🟢 **Minimal**: Safe email with no detected threats
- 🟡 **Low**: Minor suspicious indicators detected
- 🟠 **Medium**: Multiple warning signs present
- 🔴 **High**: Strong phishing indicators detected

#### Warning Information
- **Risk Score**: Numerical score from 0-100
- **Threat Details**: Specific reasons for flagging
- **Recommended Actions**: Guidance on how to proceed

### Extension Popup
Click the extension icon to access:
- **Current Page Analysis**: Statistics for the active email tab
- **Recent Threats**: History of detected suspicious emails
- **Settings**: Customize detection sensitivity and notifications
- **Security Reports**: Detailed analysis reports

## ⚙️ Settings

### Detection Settings
- **Real-time Scanning**: Enable/disable automatic email analysis
- **Show Warnings**: Control inline warning display
- **Block Suspicious**: Automatically blur/block high-risk content
- **Detection Sensitivity**: Adjust from low (1) to high (5)

### Notification Settings
- **Browser Notifications**: Get alerts for high-risk emails
- **Badge Alerts**: Show threat count on extension icon
- **Sound Alerts**: Audio notifications for critical threats

## 🔒 Privacy & Security

### Data Handling
- **Local Processing**: All analysis performed locally in your browser
- **No Data Upload**: Email content never sent to external servers
- **Minimal Storage**: Only stores analysis results and settings locally
- **Automatic Cleanup**: Old analysis data automatically purged after 7 days

### Permissions Explained
- **Active Tab**: Required to analyze emails on current page
- **Storage**: Saves settings and analysis results locally
- **Scripting**: Injects analysis code into email pages
- **Host Permissions**: Access to supported email platforms only

## 🧪 Technical Details

### Architecture
- **Content Scripts**: Analyze emails directly on web pages
- **Background Service Worker**: Manages extension lifecycle and notifications
- **Popup Interface**: Provides user controls and analysis reports
- **Local Storage**: Secure, browser-based data persistence

### Analysis Techniques
1. **Natural Language Processing**: Identifies phishing keywords and patterns
2. **URL Analysis**: Checks domain reputation and link destinations
3. **Header Analysis**: Validates email authentication records
4. **Pattern Recognition**: Detects grammar anomalies and formatting issues
5. **Domain Comparison**: Identifies typosquatting and spoofing attempts

### Performance
- **Lightweight**: Minimal impact on browser performance
- **Efficient**: Debounced analysis prevents excessive processing
- **Fast**: Real-time analysis with sub-second response times
- **Scalable**: Handles large inboxes without performance degradation

