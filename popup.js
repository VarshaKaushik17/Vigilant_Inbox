/**
 * Popup JavaScript for Email Security Analyzer
 * Handles UI interactions, data loading, and settings management
 */

class PopupManager {
  constructor() {
    this.currentTab = null;
    this.analysisData = null;
    this.settings = {
      realTimeScanning: true,
      showWarnings: true,
      blockSuspicious: false,
      sensitivity: 3
    };
    
    this.init();
  }

  async init() {
    try {
      await this.loadSettings();
      await this.getCurrentTab();
      this.setupEventListeners();
      this.loadAnalysisData();
      this.updateUI();
    } catch (error) {
      console.error('Failed to initialize popup:', error);
      this.showError('Failed to initialize extension');
    }
  }

  async getCurrentTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    this.currentTab = tabs[0];
  }

  async loadSettings() {
    try {
      const stored = await chrome.storage.sync.get(['settings']);
      if (stored.settings) {
        this.settings = { ...this.settings, ...stored.settings };
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  }

  async saveSettings() {
    try {
      await chrome.storage.sync.set({ settings: this.settings });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  setupEventListeners() {
    // Settings checkboxes
    document.getElementById('realTimeScanning').addEventListener('change', (e) => {
      this.settings.realTimeScanning = e.target.checked;
      this.saveSettings();
    });

    document.getElementById('showWarnings').addEventListener('change', (e) => {
      this.settings.showWarnings = e.target.checked;
      this.saveSettings();
    });

    document.getElementById('blockSuspicious').addEventListener('change', (e) => {
      this.settings.blockSuspicious = e.target.checked;
      this.saveSettings();
    });

    // Sensitivity slider
    document.getElementById('sensitivitySlider').addEventListener('input', (e) => {
      this.settings.sensitivity = parseInt(e.target.value);
      this.saveSettings();
    });

    // Action buttons
    document.getElementById('rescanBtn').addEventListener('click', () => {
      this.rescanPage();
    });

    document.getElementById('reportBtn').addEventListener('click', () => {
      this.showReport();
    });

    // Modal controls
    document.getElementById('modalClose').addEventListener('click', () => {
      this.hideModal();
    });

    document.getElementById('closeReportBtn').addEventListener('click', () => {
      this.hideModal();
    });

    document.getElementById('exportBtn').addEventListener('click', () => {
      this.exportReport();
    });

    // Footer links
    document.getElementById('helpLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.showHelp();
    });

    document.getElementById('feedbackLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.showFeedback();
    });

    document.getElementById('aboutLink').addEventListener('click', (e) => {
      e.preventDefault();
      this.showAbout();
    });

    // Close modal when clicking outside
    document.getElementById('reportModal').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        this.hideModal();
      }
    });
  }

  async loadAnalysisData() {
    if (!this.currentTab || !this.isEmailSite(this.currentTab.url)) {
      this.showNotEmailSite();
      return;
    }

    try {
      // Get analysis data from content script
      const response = await chrome.tabs.sendMessage(this.currentTab.id, {
        action: 'getAnalysis'
      });

      if (response) {
        this.analysisData = response;
        this.updateAnalysisDisplay();
      } else {
        this.showLoadingError();
      }
    } catch (error) {
      console.error('Failed to load analysis data:', error);
      this.showLoadingError();
    }

    // Load recent threats from storage
    await this.loadRecentThreats();
    
    // Load total statistics
    await this.loadTotalStats();
  }

  async loadRecentThreats() {
    try {
      const result = await chrome.storage.local.get(null);
      const threats = [];

      for (const [key, value] of Object.entries(result)) {
        if (key.startsWith('analysis_') && value.analysis) {
          const analysis = value.analysis;
          if (analysis.riskLevel !== 'minimal' && analysis.riskLevel !== 'low') {
            threats.push({
              id: key,
              timestamp: value.timestamp,
              analysis: analysis
            });
          }
        }
      }

      // Sort by timestamp, most recent first
      threats.sort((a, b) => b.timestamp - a.timestamp);
      
      this.displayThreats(threats.slice(0, 5)); // Show only last 5 threats
    } catch (error) {
      console.error('Failed to load recent threats:', error);
    }
  }

  async loadTotalStats() {
    try {
      const stats = await chrome.storage.sync.get(['totalStats']);
      const totalStats = stats.totalStats || { scanned: 0, threats: 0 };
      
      document.getElementById('totalScanned').textContent = totalStats.scanned;
      document.getElementById('totalThreats').textContent = totalStats.threats;
    } catch (error) {
      console.error('Failed to load total stats:', error);
    }
  }

  updateUI() {
    // Update settings UI
    document.getElementById('realTimeScanning').checked = this.settings.realTimeScanning;
    document.getElementById('showWarnings').checked = this.settings.showWarnings;
    document.getElementById('blockSuspicious').checked = this.settings.blockSuspicious;
    document.getElementById('sensitivitySlider').value = this.settings.sensitivity;

    // Update status
    this.updateStatus();
  }

  updateStatus() {
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = statusIndicator.querySelector('.status-text');
    const statusDot = statusIndicator.querySelector('.status-dot');

    if (this.settings.realTimeScanning) {
      statusText.textContent = 'Active';
      statusDot.style.background = '#4ade80';
    } else {
      statusText.textContent = 'Paused';
      statusDot.style.background = '#fbbf24';
    }
  }

  updateAnalysisDisplay() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const analysisResults = document.getElementById('analysisResults');

    loadingIndicator.style.display = 'none';
    analysisResults.style.display = 'block';

    if (this.analysisData) {
      document.getElementById('emailCount').textContent = this.analysisData.analyzedCount || 0;
      document.getElementById('platformName').textContent = this.analysisData.platform || 'Unknown';
      
      // Calculate threats and average risk score (placeholder for now)
      document.getElementById('threatsFound').textContent = '0';
      document.getElementById('riskScore').textContent = '0';
    }
  }

  displayThreats(threats) {
    const threatsList = document.getElementById('threatsList');
    const noThreats = document.getElementById('noThreats');

    if (threats.length === 0) {
      noThreats.style.display = 'flex';
      return;
    }

    noThreats.style.display = 'none';
    
    const threatsHTML = threats.map(threat => {
      const timeAgo = this.getTimeAgo(threat.timestamp);
      const analysis = threat.analysis;
      
      return `
        <div class="threat-item">
          <div class="threat-info">
            <div class="threat-title">Suspicious Email Detected</div>
            <div class="threat-details">${timeAgo} • Risk Score: ${analysis.riskScore}</div>
          </div>
          <div class="threat-level ${analysis.riskLevel}">${analysis.riskLevel}</div>
        </div>
      `;
    }).join('');

    threatsList.innerHTML = threatsHTML;
  }

  isEmailSite(url) {
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

  showNotEmailSite() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.innerHTML = `
      <div style="text-align: center; color: #6b7280;">
        <span style="font-size: 24px;">📧</span>
        <div style="margin-top: 8px;">Navigate to an email site to start analysis</div>
      </div>
    `;
  }

  showLoadingError() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.innerHTML = `
      <div style="text-align: center; color: #dc2626;">
        <span style="font-size: 24px;">⚠️</span>
        <div style="margin-top: 8px;">Failed to analyze emails</div>
        <button onclick="window.location.reload()" style="margin-top: 8px; padding: 4px 8px; border: 1px solid #dc2626; background: white; color: #dc2626; border-radius: 4px; font-size: 11px;">Retry</button>
      </div>
    `;
  }

  showError(message) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    loadingIndicator.innerHTML = `
      <div style="text-align: center; color: #dc2626;">
        <span style="font-size: 24px;">❌</span>
        <div style="margin-top: 8px;">${message}</div>
      </div>
    `;
  }

  async rescanPage() {
    const rescanBtn = document.getElementById('rescanBtn');
    const originalHTML = rescanBtn.innerHTML;
    
    rescanBtn.innerHTML = '<span class="btn-icon">⏳</span>Scanning...';
    rescanBtn.disabled = true;

    try {
      if (this.currentTab) {
        await chrome.tabs.reload(this.currentTab.id);
        setTimeout(() => {
          this.loadAnalysisData();
        }, 2000);
      }
    } catch (error) {
      console.error('Failed to rescan page:', error);
    } finally {
      setTimeout(() => {
        rescanBtn.innerHTML = originalHTML;
        rescanBtn.disabled = false;
      }, 2000);
    }
  }

  showReport() {
    const modal = document.getElementById('reportModal');
    const reportContent = document.getElementById('reportContent');
    
    // Generate report content
    const reportHTML = this.generateReportHTML();
    reportContent.innerHTML = reportHTML;
    
    modal.classList.add('show');
  }

  hideModal() {
    const modal = document.getElementById('reportModal');
    modal.classList.remove('show');
  }

  generateReportHTML() {
    const now = new Date().toLocaleString();
    
    return `
      <div class="report-section">
        <h4>Security Analysis Report</h4>
        <p><strong>Generated:</strong> ${now}</p>
        <p><strong>Current Site:</strong> ${this.currentTab ? this.currentTab.url : 'Unknown'}</p>
        <p><strong>Platform:</strong> ${this.analysisData ? this.analysisData.platform : 'Unknown'}</p>
      </div>
      
      <div class="report-section">
        <h4>Analysis Summary</h4>
        <ul>
          <li>Emails Analyzed: ${this.analysisData ? this.analysisData.analyzedCount : 0}</li>
          <li>Threats Detected: 0</li>
          <li>Average Risk Score: 0</li>
        </ul>
      </div>
      
      <div class="report-section">
        <h4>Settings</h4>
        <ul>
          <li>Real-time Scanning: ${this.settings.realTimeScanning ? 'Enabled' : 'Disabled'}</li>
          <li>Show Warnings: ${this.settings.showWarnings ? 'Enabled' : 'Disabled'}</li>
          <li>Block Suspicious: ${this.settings.blockSuspicious ? 'Enabled' : 'Disabled'}</li>
          <li>Detection Sensitivity: ${this.settings.sensitivity}/5</li>
        </ul>
      </div>
    `;
  }

  exportReport() {
    const reportData = {
      timestamp: new Date().toISOString(),
      site: this.currentTab ? this.currentTab.url : 'Unknown',
      platform: this.analysisData ? this.analysisData.platform : 'Unknown',
      analyzedCount: this.analysisData ? this.analysisData.analyzedCount : 0,
      settings: this.settings
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `email-security-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  showHelp() {
    chrome.tabs.create({
      url: 'https://github.com/your-repo/email-security-analyzer#help'
    });
  }

  showFeedback() {
    chrome.tabs.create({
      url: 'https://github.com/your-repo/email-security-analyzer/issues'
    });
  }

  showAbout() {
    alert('Email Security Analyzer v1.0.0\n\nAdvanced email analysis tool for detecting phishing, analyzing metadata, and providing security warnings.\n\nCreated with ❤️ for email security.');
  }

  getTimeAgo(timestamp) {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
}); 