/**
 * Advanced Phishing Detection Module
 * Analyzes email content for phishing indicators using multiple techniques
 */

class PhishingDetector {
  constructor() {
    this.suspiciousKeywords = [
      // Urgency indicators
      'urgent', 'immediate', 'expires today', 'act now', 'limited time',
      'expires soon', 'don\'t delay', 'instant', 'immediately',
      
      // Financial threats
      'suspend account', 'verify account', 'update payment', 'billing problem',
      'payment failed', 'credit card', 'bank account', 'wire transfer',
      'tax refund', 'refund pending', 'unclaimed money', 'lottery winner',
      
      // Social engineering
      'click here', 'download now', 'open attachment', 'confirm identity',
      'security alert', 'unusual activity', 'sign in', 'log in',
      'reset password', 'update information', 'verify now',
      
      // Authority impersonation
      'microsoft', 'google', 'apple', 'amazon', 'paypal', 'netflix',
      'facebook', 'instagram', 'twitter', 'linkedin', 'irs', 'fbi',
      'government', 'official notice', 'legal action'
    ];

    this.suspiciousDomains = [
      // Common suspicious patterns
      /[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/, // IP addresses
      /[a-z0-9]+-[a-z0-9]+-[a-z0-9]+\.(tk|ml|ga|cf)$/, // Free domains
      /secure[0-9]*\./, // Fake security domains
      /[a-z]+[0-9]+\.(com|net|org)$/, // Random domains with numbers
    ];

    this.legitimateDomains = [
      'gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com',
      'microsoft.com', 'google.com', 'apple.com', 'amazon.com',
      'paypal.com', 'netflix.com', 'facebook.com', 'twitter.com'
    ];
  }

  /**
   * Main analysis function
   * @param {Object} email - Email object with content, headers, sender, etc.
   * @returns {Object} Analysis result with risk score and details
   */
  analyzeEmail(email) {
    const analysis = {
      riskScore: 0,
      riskLevel: 'low',
      warnings: [],
      indicators: [],
      metadata: this.analyzeMetadata(email.headers || {}),
      content: this.analyzeContent(email.content || ''),
      sender: this.analyzeSender(email.sender || '')
    };

    // Calculate overall risk score
    analysis.riskScore = this.calculateRiskScore(analysis);
    analysis.riskLevel = this.determineRiskLevel(analysis.riskScore);

    return analysis;
  }

  /**
   * Analyze email content for phishing indicators
   */
  analyzeContent(content) {
    const contentAnalysis = {
      suspiciousKeywords: [],
      urlAnalysis: [],
      socialEngineering: 0,
      urgencyIndicators: 0,
      grammarScore: 0
    };

    const lowerContent = content.toLowerCase();
    
    // Check for suspicious keywords
    this.suspiciousKeywords.forEach(keyword => {
      if (lowerContent.includes(keyword.toLowerCase())) {
        contentAnalysis.suspiciousKeywords.push(keyword);
      }
    });

    // Analyze URLs in content
    const urls = this.extractUrls(content);
    urls.forEach(url => {
      const urlAnalysis = this.analyzeUrl(url);
      contentAnalysis.urlAnalysis.push(urlAnalysis);
    });

    // Check for urgency indicators
    const urgencyPatterns = [
      /within \d+ hours?/i, /expires? (today|soon|in)/i,
      /immediate(ly)?/i, /urgent/i, /act now/i, /don't (wait|delay)/i
    ];
    
    urgencyPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        contentAnalysis.urgencyIndicators++;
      }
    });

    // Basic grammar and spelling analysis
    contentAnalysis.grammarScore = this.analyzeGrammar(content);

    return contentAnalysis;
  }

  /**
   * Analyze email metadata and headers
   */
  analyzeMetadata(headers) {
    const metadata = {
      spfPass: false,
      dkimPass: false,
      dmarcPass: false,
      suspiciousHeaders: [],
      ipReputation: 'unknown',
      originCountry: 'unknown'
    };

    // Check SPF, DKIM, DMARC
    if (headers['Authentication-Results']) {
      const authResults = headers['Authentication-Results'].toLowerCase();
      metadata.spfPass = authResults.includes('spf=pass');
      metadata.dkimPass = authResults.includes('dkim=pass');
      metadata.dmarcPass = authResults.includes('dmarc=pass');
    }

    // Check for suspicious headers
    const suspiciousHeaderPatterns = [
      'X-Mailer: PHP', 'X-Originating-IP', 'X-Forwarded'
    ];

    Object.keys(headers).forEach(header => {
      suspiciousHeaderPatterns.forEach(pattern => {
        if (header.includes(pattern) || headers[header].includes(pattern)) {
          metadata.suspiciousHeaders.push(header);
        }
      });
    });

    return metadata;
  }

  /**
   * Analyze sender information
   */
  analyzeSender(sender) {
    const senderAnalysis = {
      domainReputation: 'unknown',
      spoofingLikelihood: 0,
      isKnownLegitimate: false,
      domainAge: 'unknown'
    };

    if (!sender) return senderAnalysis;

    const domain = this.extractDomain(sender);
    
    // Check if domain is in legitimate domains list
    senderAnalysis.isKnownLegitimate = this.legitimateDomains.includes(domain);

    // Check for domain spoofing patterns
    senderAnalysis.spoofingLikelihood = this.checkDomainSpoofing(domain);

    // Check for suspicious domain patterns
    this.suspiciousDomains.forEach(pattern => {
      if (pattern.test && pattern.test(domain)) {
        senderAnalysis.spoofingLikelihood += 30;
      }
    });

    return senderAnalysis;
  }

  /**
   * Extract and analyze URLs from content
   */
  extractUrls(content) {
    const urlRegex = /(https?:\/\/[^\s<>"']+)/gi;
    return content.match(urlRegex) || [];
  }

  /**
   * Analyze individual URL for phishing indicators
   */
  analyzeUrl(url) {
    const analysis = {
      url: url,
      domain: '',
      isSuspicious: false,
      reasons: [],
      riskScore: 0
    };

    try {
      const urlObj = new URL(url);
      analysis.domain = urlObj.hostname;

      // Check for suspicious URL patterns
      if (/[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/.test(analysis.domain)) {
        analysis.isSuspicious = true;
        analysis.reasons.push('Uses IP address instead of domain');
        analysis.riskScore += 40;
      }

      if (analysis.domain.includes('-') && analysis.domain.split('-').length > 3) {
        analysis.isSuspicious = true;
        analysis.reasons.push('Suspicious domain structure');
        analysis.riskScore += 20;
      }

      if (urlObj.pathname.includes('..') || urlObj.search.includes('redirect')) {
        analysis.isSuspicious = true;
        analysis.reasons.push('Potential redirect or path traversal');
        analysis.riskScore += 30;
      }

      // Check for URL shorteners
      const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly'];
      if (shorteners.some(shortener => analysis.domain.includes(shortener))) {
        analysis.reasons.push('Uses URL shortener');
        analysis.riskScore += 15;
      }

    } catch (e) {
      analysis.isSuspicious = true;
      analysis.reasons.push('Malformed URL');
      analysis.riskScore += 50;
    }

    return analysis;
  }

  /**
   * Check for domain spoofing attempts
   */
  checkDomainSpoofing(domain) {
    let spoofingScore = 0;

    this.legitimateDomains.forEach(legitDomain => {
      const similarity = this.calculateSimilarity(domain, legitDomain);
      if (similarity > 0.7 && domain !== legitDomain) {
        spoofingScore += (similarity * 50);
      }
    });

    return Math.min(spoofingScore, 100);
  }

  /**
   * Calculate string similarity using Levenshtein distance
   */
  calculateSimilarity(str1, str2) {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    const maxLength = Math.max(str1.length, str2.length);
    return 1 - (matrix[str2.length][str1.length] / maxLength);
  }

  /**
   * Basic grammar analysis
   */
  analyzeGrammar(content) {
    let grammarScore = 100;

    // Check for common grammar mistakes
    const grammarPatterns = [
      /\s{2,}/g, // Multiple spaces
      /[.!?]{2,}/g, // Multiple punctuation
      /[A-Z]{3,}/g, // Excessive caps
      /\b(recieve|occured|seperate|definately)\b/gi // Common misspellings
    ];

    grammarPatterns.forEach(pattern => {
      const matches = content.match(pattern);
      if (matches) {
        grammarScore -= matches.length * 5;
      }
    });

    return Math.max(grammarScore, 0);
  }

  /**
   * Extract domain from email address
   */
  extractDomain(email) {
    const match = email.match(/@([^>]+)/);
    return match ? match[1].toLowerCase() : '';
  }

  /**
   * Calculate overall risk score
   */
  calculateRiskScore(analysis) {
    let riskScore = 0;

    // Content analysis scoring
    riskScore += analysis.content.suspiciousKeywords.length * 5;
    riskScore += analysis.content.urgencyIndicators * 10;
    riskScore += Math.max(0, (100 - analysis.content.grammarScore)) * 0.3;

    // URL analysis scoring
    analysis.content.urlAnalysis.forEach(url => {
      riskScore += url.riskScore;
    });

    // Metadata scoring
    if (!analysis.metadata.spfPass) riskScore += 20;
    if (!analysis.metadata.dkimPass) riskScore += 15;
    if (!analysis.metadata.dmarcPass) riskScore += 25;
    riskScore += analysis.metadata.suspiciousHeaders.length * 10;

    // Sender analysis scoring
    riskScore += analysis.sender.spoofingLikelihood;
    if (!analysis.sender.isKnownLegitimate && analysis.content.suspiciousKeywords.length > 0) {
      riskScore += 30;
    }

    return Math.min(riskScore, 100);
  }

  /**
   * Determine risk level based on score
   */
  determineRiskLevel(score) {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    if (score >= 20) return 'low';
    return 'minimal';
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PhishingDetector;
} else {
  window.PhishingDetector = PhishingDetector;
} 