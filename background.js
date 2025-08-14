/**
 * Background Service Worker for Email Security Analyzer
 * Handles extension lifecycle, storage management, and communication
 */

class BackgroundManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeStorage();
  }

  setupEventListeners() {
    // Extension installation and startup
    chrome.runtime.onInstalled.addListener((details) => {
      this.handleInstall(details);
    });

    chrome.runtime.onStartup.addListener(() => {
      this.handleStartup();
    });

    // Tab events
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
      this.handleTabUpdate(tabId, changeInfo, tab);
    });

    chrome.tabs.onActivated.addListener((activeInfo) => {
      this.handleTabActivated(activeInfo);
    });

    // Message handling
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep the message channel open for async responses
    });

    // Storage changes
    chrome.storage.onChanged.addListener((changes, areaName) => {
      this.handleStorageChanged(changes, areaName);
    });

    // Web navigation events
    chrome.webNavigation.onCompleted.addListener((details) => {
      this.handleNavigationCompleted(details);
    });
  }

  async initializeStorage() {
    try {
      // Initialize default settings if not present
      const stored = await chrome.storage.sync.get(['settings', 'totalStats']);
      
      if (!stored.settings) {
        await chrome.storage.sync.set({
          settings: {
            realTimeScanning: true,
            showWarnings: true,
            blockSuspicious: false,
            sensitivity: 3
          }
        });
      }

      if (!stored.totalStats) {
        await chrome.storage.sync.set({
          totalStats: {
            scanned: 0,
            threats: 0,
            lastReset: Date.now()
          }
        });
      }

      // Clean up old analysis data (older than 7 days)
      await this.cleanupOldData();

    } catch (error) {
      console.error('Failed to initialize storage:', error);
    }
  }

  async cleanupOldData() {
    try {
      const result = await chrome.storage.local.get(null);
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const keysToRemove = [];

      for (const [key, value] of Object.entries(result)) {
        if (key.startsWith('analysis_') && value.timestamp < sevenDaysAgo) {
          keysToRemove.push(key);
        }
      }

      if (keysToRemove.length > 0) {
        await chrome.storage.local.remove(keysToRemove);
        console.log(`Cleaned up ${keysToRemove.length} old analysis records`);
      }
    } catch (error) {
      console.error('Failed to cleanup old data:', error);
    }
  }

  handleInstall(details) {
    if (details.reason === 'install') {
      console.log('Email Security Analyzer installed');
      this.showWelcomeNotification();
    } else if (details.reason === 'update') {
      console.log('Email Security Analyzer updated');
      this.handleUpdate(details.previousVersion);
    }
  }

  handleStartup() {
    console.log('Email Security Analyzer started');
    this.updateBadge();
  }

  async handleTabUpdate(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete' && tab.url) {
      await this.handlePageLoad(tabId, tab);
    }
  }

  async handleTabActivated(activeInfo) {
    try {
      const tab = await chrome.tabs.get(activeInfo.tabId);
      await this.updateBadge(tab);
    } catch (error) {
      console.error('Failed to handle tab activation:', error);
    }
  }

  async handlePageLoad(tabId, tab) {
    if (this.isEmailSite(tab.url)) {
      // Inject content script if needed
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tabId },
          files: ['phishing-detector.js', 'content.js']
        });
      } catch (error) {
        // Content script might already be injected
        console.log('Content script injection skipped:', error.message);
      }

      // Update badge for email sites
      await this.updateBadge(tab);
    }
  }

  async handleNavigationCompleted(details) {
    if (details.frameId === 0) { // Main frame only
      const tab = await chrome.tabs.get(details.tabId);
      await this.handlePageLoad(details.tabId, tab);
    }
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'analysisComplete':
          await this.handleAnalysisComplete(request.data, sender);
          sendResponse({ success: true });
          break;

        case 'reportThreat':
          await this.handleThreatReport(request.data, sender);
          sendResponse({ success: true });
          break;

        case 'getSettings':
          const settings = await this.getSettings();
          sendResponse({ settings });
          break;

        case 'updateStats':
          await this.updateStats(request.data);
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Message handling error:', error);
      sendResponse({ error: error.message });
    }
  }

  async handleStorageChanged(changes, areaName) {
    if (areaName === 'sync' && changes.settings) {
      // Notify all email tabs about settings changes
      const tabs = await chrome.tabs.query({});
      const emailTabs = tabs.filter(tab => this.isEmailSite(tab.url));

      for (const tab of emailTabs) {
        try {
          await chrome.tabs.sendMessage(tab.id, {
            action: 'settingsChanged',
            settings: changes.settings.newValue
          });
        } catch (error) {
          // Tab might not have content script
          console.log('Failed to notify tab about settings change:', error.message);
        }
      }
    }
  }

  async handleAnalysisComplete(data, sender) {
    try {
      // Update total statistics
      await this.updateStats({
        scannedIncrement: data.emailCount || 1,
        threatsIncrement: data.threatsFound || 0
      });

      // Store analysis result
      if (data.analysisId && data.analysis) {
        await chrome.storage.local.set({
          [`analysis_${data.analysisId}`]: {
            timestamp: Date.now(),
            analysis: data.analysis,
            tabId: sender.tab.id,
            url: sender.tab.url
          }
        });
      }

      // Update badge
      await this.updateBadge(sender.tab);

      // Show notification for high-risk threats
      if (data.analysis && data.analysis.riskLevel === 'high') {
        await this.showThreatNotification(data.analysis, sender.tab);
      }

    } catch (error) {
      console.error('Failed to handle analysis completion:', error);
    }
  }

  async handleThreatReport(data, sender) {
    try {
      // Store threat report
      await chrome.storage.local.set({
        [`threat_${Date.now()}`]: {
          timestamp: Date.now(),
          data: data,
          tabId: sender.tab.id,
          url: sender.tab.url,
          reported: true
        }
      });

      console.log('Threat reported:', data);
    } catch (error) {
      console.error('Failed to handle threat report:', error);
    }
  }

  async getSettings() {
    try {
      const result = await chrome.storage.sync.get(['settings']);
      return result.settings || {
        realTimeScanning: true,
        showWarnings: true,
        blockSuspicious: false,
        sensitivity: 3
      };
    } catch (error) {
      console.error('Failed to get settings:', error);
      return {};
    }
  }

  async updateStats(data) {
    try {
      const result = await chrome.storage.sync.get(['totalStats']);
      const currentStats = result.totalStats || { scanned: 0, threats: 0, lastReset: Date.now() };

      const newStats = {
        scanned: currentStats.scanned + (data.scannedIncrement || 0),
        threats: currentStats.threats + (data.threatsIncrement || 0),
        lastReset: currentStats.lastReset
      };

      await chrome.storage.sync.set({ totalStats: newStats });
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  }

  async updateBadge(tab) {
    try {
      if (!tab) {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        tab = tabs[0];
      }

      if (tab && this.isEmailSite(tab.url)) {
        // Get recent threat count for this tab
        const result = await chrome.storage.local.get(null);
        let threatCount = 0;

        for (const [key, value] of Object.entries(result)) {
          if (key.startsWith('analysis_') && 
              value.tabId === tab.id && 
              value.analysis && 
              value.analysis.riskLevel !== 'minimal' &&
              value.analysis.riskLevel !== 'low') {
            threatCount++;
          }
        }

        if (threatCount > 0) {
          await chrome.action.setBadgeText({
            tabId: tab.id,
            text: threatCount.toString()
          });
          await chrome.action.setBadgeBackgroundColor({
            tabId: tab.id,
            color: '#dc2626'
          });
        } else {
          await chrome.action.setBadgeText({
            tabId: tab.id,
            text: ''
          });
        }
      } else {
        await chrome.action.setBadgeText({
          tabId: tab?.id,
          text: ''
        });
      }
    } catch (error) {
      console.error('Failed to update badge:', error);
    }
  }

  async showWelcomeNotification() {
    try {
      await chrome.notifications.create('welcome', {
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Email Security Analyzer',
        message: 'Extension installed successfully! Navigate to Gmail, Outlook, or other email sites to start protection.'
      });
    } catch (error) {
      console.error('Failed to show welcome notification:', error);
    }
  }

  async showThreatNotification(analysis, tab) {
    try {
      const settings = await this.getSettings();
      if (!settings.showWarnings) return;

      await chrome.notifications.create(`threat_${Date.now()}`, {
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'High-Risk Email Detected!',
        message: `A potentially dangerous email was found on ${new URL(tab.url).hostname}. Risk score: ${analysis.riskScore}/100`
      });
    } catch (error) {
      console.error('Failed to show threat notification:', error);
    }
  }

  handleUpdate(previousVersion) {
    console.log(`Updated from version ${previousVersion}`);
    // Handle any migration logic here
  }

  isEmailSite(url) {
    if (!url) return false;
    
    const emailDomains = [
      'mail.google.com',
      'outlook.live.com',
      'outlook.office.com',
      'outlook.office365.com',
      'yahoo.com',
      'protonmail.com'
    ];

    return emailDomains.some(domain => url.includes(domain));
  }
}

// Initialize background manager
const backgroundManager = new BackgroundManager();

// Handle extension lifecycle
chrome.runtime.onSuspend.addListener(() => {
  console.log('Email Security Analyzer suspended');
});

// Notification click handler
chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId.startsWith('threat_')) {
    // Open the extension popup or focus the tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.action.openPopup();
      }
    });
  }
});

// Cleanup on extension shutdown
chrome.runtime.onSuspend.addListener(() => {
  // Perform any necessary cleanup
  console.log('Extension shutting down');
}); 