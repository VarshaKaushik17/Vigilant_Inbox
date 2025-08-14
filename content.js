/**
 * Content Script for Email Security Analyzer
 * Integrates with major email platforms to analyze emails in real-time
 */

class EmailAnalyzer {
  constructor() {
    this.phishingDetector = new PhishingDetector();
    this.isAnalyzing = false;
    this.analyzedEmails = new Set();
    this.warningElements = new Map();
    
    this.init();
  }

  init() {
    console.log('Email Security Analyzer: Initializing...');
    
    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.startAnalysis());
    } else {
      this.startAnalysis();
    }
  }

  startAnalysis() {
    this.detectEmailPlatform();
    this.setupObserver();
    this.analyzeVisibleEmails();
  }

  detectEmailPlatform() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('mail.google.com')) {
      this.platform = 'gmail';
      console.log('Platform detected: Gmail');
    } else if (hostname.includes('outlook.')) {
      this.platform = 'outlook';
      console.log('Platform detected: Outlook');
    } else if (hostname.includes('yahoo.com')) {
      this.platform = 'yahoo';
      console.log('Platform detected: Yahoo Mail');
    } else {
      this.platform = 'generic';
      console.log('Platform detected: Generic webmail');
    }
  }

  setupObserver() {
    // Watch for new emails being loaded
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length > 0) {
          this.debounce(() => this.analyzeVisibleEmails(), 1000)();
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  analyzeVisibleEmails() {
    if (this.isAnalyzing) return;
    this.isAnalyzing = true;

    const emails = this.getEmailElements();
    console.log(`Found ${emails.length} emails to analyze`);

    emails.forEach((emailElement, index) => {
      const emailId = this.getEmailId(emailElement);
      
      if (!this.analyzedEmails.has(emailId)) {
        setTimeout(() => {
          this.analyzeEmailElement(emailElement, emailId);
        }, index * 100); // Stagger analysis to avoid performance issues
      }
    });

    this.isAnalyzing = false;
  }

  getEmailElements() {
    switch (this.platform) {
      case 'gmail':
        return document.querySelectorAll('[data-thread-id], .ii.gt .a3s.aiL, .ii.gt .a3s.aXjCH');
      case 'outlook':
        return document.querySelectorAll('[data-convid], .x_bodyContainer, .rps_cb28');
      case 'yahoo':
        return document.querySelectorAll('[data-test-id="message-view"], .msg-body');
      default:
        return document.querySelectorAll('[class*="email"], [class*="message"], [class*="mail"]');
    }
  }

  getEmailId(element) {
    // Try to get unique identifier for the email
    return element.dataset.threadId || 
           element.dataset.convid || 
           element.dataset.testId ||
           element.innerHTML.substring(0, 100).replace(/\s+/g, '').substring(0, 50);
  }

  analyzeEmailElement(emailElement, emailId) {
    try {
      const emailData = this.extractEmailData(emailElement);
      
      if (!emailData.content && !emailData.sender) {
        return; // Skip if no content to analyze
      }

      const analysis = this.phishingDetector.analyzeEmail(emailData);
      
      this.analyzedEmails.add(emailId);
      
      if (analysis.riskLevel !== 'minimal') {
        this.displayWarning(emailElement, analysis, emailId);
      }

      // Store analysis result
      this.storeAnalysis(emailId, analysis);

    } catch (error) {
      console.error('Error analyzing email:', error);
    }
  }

  extractEmailData(emailElement) {
    const emailData = {
      content: '',
      sender: '',
      subject: '',
      headers: {}
    };

    // Extract content based on platform
    switch (this.platform) {
      case 'gmail':
        emailData.content = this.extractGmailContent(emailElement);
        emailData.sender = this.extractGmailSender(emailElement);
        emailData.subject = this.extractGmailSubject(emailElement);
        break;
      case 'outlook':
        emailData.content = this.extractOutlookContent(emailElement);
        emailData.sender = this.extractOutlookSender(emailElement);
        emailData.subject = this.extractOutlookSubject(emailElement);
        break;
      case 'yahoo':
        emailData.content = this.extractYahooContent(emailElement);
        emailData.sender = this.extractYahooSender(emailElement);
        emailData.subject = this.extractYahooSubject(emailElement);
        break;
      default:
        emailData.content = emailElement.textContent || emailElement.innerText || '';
        break;
    }

    return emailData;
  }

  // Gmail extraction methods
  extractGmailContent(element) {
    const contentDiv = element.querySelector('.a3s.aiL, .ii.gt .a3s');
    return contentDiv ? contentDiv.textContent || contentDiv.innerText : '';
  }

  extractGmailSender(element) {
    const senderElement = element.querySelector('.go .gD, .h2osre .gN');
    return senderElement ? senderElement.getAttribute('email') || senderElement.textContent : '';
  }

  extractGmailSubject(element) {
    const subjectElement = element.querySelector('.hP, .bog');
    return subjectElement ? subjectElement.textContent : '';
  }

  // Outlook extraction methods
  extractOutlookContent(element) {
    const contentDiv = element.querySelector('.x_bodyContainer, .rps_cb28 .rps_9b0b');
    return contentDiv ? contentDiv.textContent || contentDiv.innerText : '';
  }

  extractOutlookSender(element) {
    const senderElement = element.querySelector('[data-automation-id="senderDisplayName"], .rps_7eb7');
    return senderElement ? senderElement.textContent : '';
  }

  extractOutlookSubject(element) {
    const subjectElement = element.querySelector('[data-automation-id="subjectLine"], .rps_83b5');
    return subjectElement ? subjectElement.textContent : '';
  }

  // Yahoo extraction methods
  extractYahooContent(element) {
    const contentDiv = element.querySelector('.msg-body, [data-test-id="message-view-body"]');
    return contentDiv ? contentDiv.textContent || contentDiv.innerText : '';
  }

  extractYahooSender(element) {
    const senderElement = element.querySelector('[data-test-id="message-from"], .msg-sender');
    return senderElement ? senderElement.textContent : '';
  }

  extractYahooSubject(element) {
    const subjectElement = element.querySelector('[data-test-id="message-subject"], .msg-subject');
    return subjectElement ? subjectElement.textContent : '';
  }

  displayWarning(emailElement, analysis, emailId) {
    // Remove existing warning if present
    if (this.warningElements.has(emailId)) {
      this.warningElements.get(emailId).remove();
    }

    const warningElement = this.createWarningElement(analysis);
    
    // Insert warning at the top of the email
    emailElement.insertBefore(warningElement, emailElement.firstChild);
    
    this.warningElements.set(emailId, warningElement);
  }

  createWarningElement(analysis) {
    const warning = document.createElement('div');
    warning.className = 'email-security-warning';
    warning.style.cssText = `
      background: ${this.getWarningColor(analysis.riskLevel)};
      color: white;
      padding: 12px;
      margin: 8px 0;
      border-radius: 6px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      position: relative;
      z-index: 10000;
      border-left: 4px solid rgba(255,255,255,0.3);
    `;

    const icon = this.getWarningIcon(analysis.riskLevel);
    const message = this.getWarningMessage(analysis);

    warning.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 18px;">${icon}</span>
        <div style="flex: 1;">
          <div style="font-weight: bold; margin-bottom: 4px;">
            ${analysis.riskLevel.toUpperCase()} SECURITY RISK DETECTED
          </div>
          <div style="font-size: 12px; opacity: 0.9;">
            ${message}
          </div>
        </div>
        <button class="dismiss-warning" style="
          background: rgba(255,255,255,0.2);
          border: none;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
        ">Dismiss</button>
      </div>
      <div class="warning-details" style="
        margin-top: 8px;
        padding: 8px;
        background: rgba(0,0,0,0.1);
        border-radius: 4px;
        font-size: 11px;
        display: none;
      ">
        <div><strong>Risk Score:</strong> ${analysis.riskScore}/100</div>
        ${analysis.content.suspiciousKeywords.length > 0 ? 
          `<div><strong>Suspicious keywords:</strong> ${analysis.content.suspiciousKeywords.slice(0, 5).join(', ')}</div>` : ''}
        ${analysis.content.urlAnalysis.some(url => url.isSuspicious) ? 
          `<div><strong>Suspicious URLs detected</strong></div>` : ''}
      </div>
    `;

    // Add event listeners
    warning.querySelector('.dismiss-warning').addEventListener('click', () => {
      warning.style.display = 'none';
    });

    warning.addEventListener('click', () => {
      const details = warning.querySelector('.warning-details');
      details.style.display = details.style.display === 'none' ? 'block' : 'none';
    });

    return warning;
  }

  getWarningColor(riskLevel) {
    switch (riskLevel) {
      case 'high': return '#d32f2f';
      case 'medium': return '#f57c00';
      case 'low': return '#fbc02d';
      default: return '#388e3c';
    }
  }

  getWarningIcon(riskLevel) {
    switch (riskLevel) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return '⚡';
      default: return 'ℹ️';
    }
  }

  getWarningMessage(analysis) {
    const messages = [];
    
    if (analysis.content.suspiciousKeywords.length > 0) {
      messages.push('Phishing keywords detected');
    }
    
    if (analysis.content.urlAnalysis.some(url => url.isSuspicious)) {
      messages.push('Suspicious links found');
    }
    
    if (!analysis.metadata.spfPass || !analysis.metadata.dkimPass) {
      messages.push('Email authentication failed');
    }
    
    if (analysis.sender.spoofingLikelihood > 50) {
      messages.push('Possible sender spoofing');
    }

    return messages.length > 0 ? messages.join(', ') + '.' : 'Multiple security indicators detected.';
  }

  storeAnalysis(emailId, analysis) {
    // Store analysis result for popup display
    chrome.storage.local.set({
      [`analysis_${emailId}`]: {
        timestamp: Date.now(),
        analysis: analysis
      }
    });
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// Initialize the analyzer when the script loads
let emailAnalyzer;

// Check if PhishingDetector is available
if (typeof PhishingDetector !== 'undefined') {
  emailAnalyzer = new EmailAnalyzer();
} else {
  // Load PhishingDetector if not available
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('phishing-detector.js');
  script.onload = () => {
    emailAnalyzer = new EmailAnalyzer();
  };
  document.head.appendChild(script);
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getAnalysis') {
    sendResponse({
      analyzedCount: emailAnalyzer ? emailAnalyzer.analyzedEmails.size : 0,
      platform: emailAnalyzer ? emailAnalyzer.platform : 'unknown'
    });
  }
}); 