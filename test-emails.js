/**
 * Test Email Data for Email Security Analyzer
 * Contains sample emails for testing and demonstration
 */

const testEmails = {
  validEmails: [
    {
      id: 'valid_1',
      subject: 'Weekly Team Meeting - Thursday 2PM',
      sender: 'sarah.johnson@company.com',
      headers: {
        'Authentication-Results': 'spf=pass dkim=pass dmarc=pass',
        'From': 'Sarah Johnson <sarah.johnson@company.com>',
        'To': 'team@company.com',
        'Date': 'Wed, 13 Dec 2023 14:30:00 +0000',
        'Message-ID': '<abc123@company.com>'
      },
      content: `Hi Team,

I hope this email finds you well. I wanted to remind everyone about our weekly team meeting scheduled for Thursday at 2:00 PM in Conference Room B.

Agenda:
- Project status updates
- Q4 planning discussion
- New client onboarding process
- Questions and feedback

Please bring your laptops and any relevant documents. If you can't attend, please let me know in advance.

Looking forward to seeing everyone there!

Best regards,
Sarah Johnson
Project Manager
Company Inc.
Phone: (555) 123-4567
Email: sarah.johnson@company.com`,
      timestamp: Date.now() - 3600000 // 1 hour ago
    },
    
    {
      id: 'valid_2',
      subject: 'Your Order #ORD-2023-5678 Has Been Shipped',
      sender: 'orders@amazon.com',
      headers: {
        'Authentication-Results': 'spf=pass dkim=pass dmarc=pass',
        'From': 'Amazon.com <orders@amazon.com>',
        'To': 'customer@email.com',
        'Date': 'Wed, 13 Dec 2023 10:15:00 +0000',
        'Message-ID': '<ord2023@amazon.com>'
      },
      content: `Hello,

Your order has been shipped and is on its way!

Order Details:
- Order Number: ORD-2023-5678
- Items: Wireless Bluetooth Headphones
- Shipping Address: 123 Main St, Anytown, ST 12345
- Estimated Delivery: December 15, 2023

You can track your package using this link: https://amazon.com/track?order=ORD-2023-5678

Thank you for shopping with Amazon!

The Amazon Team`,
      timestamp: Date.now() - 7200000 // 2 hours ago
    },

    {
      id: 'hr_ethnic_day',
      subject: 'Ethnic Day Celebration - Friday, December 15th',
      sender: 'hr@company.com',
      headers: {
        'Authentication-Results': 'spf=pass dkim=pass dmarc=pass',
        'From': 'Human Resources <hr@company.com>',
        'To': 'all-employees@company.com',
        'Date': 'Wed, 13 Dec 2023 09:00:00 +0000',
        'Message-ID': '<ethnic2023@company.com>'
      },
      content: `Dear Team,

We are excited to announce our annual Ethnic Day celebration happening this Friday, December 15th, from 12:00 PM to 3:00 PM in the main cafeteria.

🌍 What to Expect:
- Traditional food from different cultures
- Cultural performances and presentations
- Traditional dress showcase
- Interactive cultural booths
- Music and dance from around the world

🎭 How to Participate:
- Wear your traditional/cultural attire
- Bring a dish representing your heritage (optional)
- Sign up for cultural presentations at the HR desk
- Invite your family members to join us (2:00 PM - 3:00 PM)

📋 Important Details:
- Lunch will be provided for all participants
- Photography will be taken for our company newsletter
- Please RSVP by Thursday, December 14th
- Contact HR for any dietary restrictions or questions

This is a wonderful opportunity to learn about our diverse workplace and celebrate the rich cultural backgrounds of our team members.

Looking forward to a fantastic celebration!

Best regards,
HR Team
Company Inc.
Phone: (555) 123-4500
Email: hr@company.com

P.S. Prizes will be awarded for best traditional attire!`,
      timestamp: Date.now() - 10800000 // 3 hours ago
    }
  ],

  suspiciousEmails: [
    {
      id: 'suspicious_1',
      subject: 'URGENT: Your Account Will Be Suspended Today!',
      sender: 'security@amaz0n-security.com',
      headers: {
        'Authentication-Results': 'spf=fail dkim=fail dmarc=fail',
        'From': 'Amazon Security <security@amaz0n-security.com>',
        'To': 'victim@email.com',
        'Date': 'Wed, 13 Dec 2023 16:45:00 +0000',
        'Message-ID': '<fake123@suspicious-domain.tk>',
        'X-Originating-IP': '192.168.1.100',
        'X-Mailer': 'PHP/7.4'
      },
      content: `URGENT SECURITY ALERT!

Your Amazon account has been flagged for suspicious activity and will be SUSPENDED within 24 hours unless you verify your information immediately.

⚠️ IMMEDIATE ACTION REQUIRED ⚠️

We have detected the following suspicious activities:
- Unusual login attempts from multiple countries
- Unauthorized payment method changes
- Suspicious order history modifications

To prevent account suspension, you must:
1. Click here to verify your account: http://amaz0n-verification.tk/secure-login
2. Confirm your credit card information
3. Update your password immediately

This verification must be completed within 6 hours or your account will be permanently suspended and all pending orders cancelled.

Don't wait - act now to secure your account!

For immediate assistance, call our security hotline: +1-800-FAKE-NUM (this is not a real Amazon number)

Amazon Customer Security Team
Note: This is an automated message, please do not reply to this email.

Click here if you didn't request this: http://bit.ly/fake-unsubscribe`,
      timestamp: Date.now() - 1800000 // 30 minutes ago
    },

    {
      id: 'suspicious_2',
      subject: 'Congratulations! You\'ve Won $1,000,000 in Our Lottery!',
      sender: 'lottery-winner@international-lottery.ml',
      headers: {
        'Authentication-Results': 'spf=none dkim=none dmarc=none',
        'From': 'International Lottery Commission <lottery-winner@international-lottery.ml>',
        'To': 'lucky-winner@email.com',
        'Date': 'Wed, 13 Dec 2023 12:20:00 +0000',
        'Message-ID': '<lottery2023@fake-server.ga>',
        'X-Originating-IP': '45.123.456.789'
      },
      content: `🎉 CONGRATULATIONS WINNER! 🎉

You have been selected as the GRAND PRIZE WINNER of our International Online Lottery!

WINNING AMOUNT: $1,000,000.00 USD

Your lucky numbers were: 7-14-21-28-35-42
Winning ticket number: ILC-2023-789456

This is not a joke! You have won ONE MILLION DOLLARS in our legitimate international lottery. Your email address was randomly selected from our global database of internet users.

To claim your prize money, you must:

1. Send us your full name and address
2. Provide your bank account details for transfer
3. Pay the processing fee of $500 (refundable from your winnings)
4. Send a copy of your government ID

⚠️ URGENT: You have only 48 hours to claim this prize or it will be forfeited to the next winner!

Wire the processing fee to:
Account: FAKE BANK
Account Number: 123456789
Routing: 987654321

For questions, contact our claims agent Mr. John Smith at: fake-claims@lottery-scam.tk

Congratulations again on this life-changing win!

International Lottery Commission
London, England (fake address)

P.S. This opportunity expires soon - don't let this fortune slip away!`,
      timestamp: Date.now() - 5400000 // 90 minutes ago
    },

    {
      id: 'suspicious_3',
      subject: 'Your PayPal payment failed - Update payment method',
      sender: 'service@paypaI-security.com', // Note: Capital i instead of l
      headers: {
        'Authentication-Results': 'spf=fail dkim=none dmarc=fail',
        'From': 'PayPal Service <service@paypaI-security.com>',
        'To': 'user@email.com',
        'Date': 'Wed, 13 Dec 2023 15:30:00 +0000',
        'Message-ID': '<payment2023@fake-paypal.cf>'
      },
      content: `Dear PayPal Customer,

We were unable to process your recent payment due to an issue with your payment method.

Transaction Details:
- Amount: $299.99
- Merchant: TechStore Online
- Date: December 13, 2023
- Status: FAILED

Your account has been temporarily limited to prevent unauthorized transactions. To restore full access, please verify your information by clicking the link below:

🔗 Verify Account: https://paypaI-secure-verification.herokuapp.com/login

You will need to:
✓ Confirm your identity
✓ Update your payment method
✓ Verify your recent transactions

If you don't complete this verification within 24 hours, your account may be permanently suspended.

For your security, PayPal will never ask for sensitive information via email. However, due to the urgent nature of this security issue, immediate action is required.

Thank you for using PayPal.

The PayPal Team

© 2023 PayPal Inc. All rights reserved.`,
      timestamp: Date.now() - 2700000 // 45 minutes ago
    },

    {
      id: 'phishing_credential_theft',
      subject: 'Company IT Security Update Required',
      sender: 'it-security@company-secure.tk',
      headers: {
        'Authentication-Results': 'spf=fail dkim=fail dmarc=fail',
        'From': 'IT Security <it-security@company-secure.tk>',
        'To': 'employees@company.com',
        'Date': 'Wed, 13 Dec 2023 11:30:00 +0000',
        'Message-ID': '<security2023@fake-company.tk>',
        'X-Originating-IP': '203.0.113.100'
      },
      content: `URGENT SECURITY UPDATE REQUIRED

Dear Employee,

Due to a recent security breach affecting multiple companies in our industry, we are implementing mandatory security updates for all employee accounts.

🔒 IMMEDIATE ACTION REQUIRED:

Your company credentials need to be updated within the next 4 hours to prevent account lockout. Failure to complete this update will result in temporary suspension of your access to:
- Company email systems
- Internal databases and applications  
- VPN and remote access
- Payroll and benefits portal

⚠️ CLICK HERE TO UPDATE YOUR CREDENTIALS: http://company-secure-portal.tk/update-login

The security update process will take less than 2 minutes and requires:
1. Your current username and password
2. Verification of personal details
3. Creation of new secure password
4. Multi-factor authentication setup

This is a mandatory update as directed by our Chief Information Security Officer. Non-compliance will be reported to HR and may result in disciplinary action.

If you experience any issues during the update process, do NOT contact IT support through normal channels. Instead, use our emergency security hotline: +1-800-FAKE-SEC

This email is automatically generated and cannot be replied to. Complete your update immediately to maintain access to company systems.

IT Security Department
Company Inc.
URGENT - DO NOT IGNORE`,
      timestamp: Date.now() - 4500000 // 75 minutes ago
    },
    {
      id: 'phishing_promotion_salary',
      subject: 'Congratulations on Your Promotion! View Your Updated Salary Package',
      sender: 'hr-updates@company-careers.co',
      headers: {
        'Authentication-Results': 'spf=fail dkim=none dmarc=fail',
        'From': 'HR Updates <hr-updates@company-careers.co>',
        'To': 'you@company.com',
        'Date': 'Wed, 13 Dec 2023 17:20:00 +0000',
        'Message-ID': '<promo2023@careers-co.co>'
      },
      content: `<div style="font-family: Arial, sans-serif;">
  <div style="text-align:center; padding: 16px 0;">
    <div style="font-size:28px; font-weight:800; color:#0f766e;">🎉 Congratulations!</div>
    <div style="font-size:16px; color:#334155; margin-top:6px;">You have been selected for a promotion effective immediately.</div>
  </div>
  <img alt="Celebration" src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop" style="width:100%; max-height:220px; object-fit:cover; border-radius:8px; box-shadow:0 6px 18px rgba(0,0,0,0.15);"/>
  <div style="margin-top:16px; line-height:1.6; color:#1f2937;">
    We are pleased to inform you that your role has been updated. Please review your updated compensation details and benefits breakdown using the secure link below.
  </div>
  <div style="text-align:center; margin-top:18px;">
    <a href="http://company-careers.co-portal.com/salary/structure?emp=you" style="
      background: linear-gradient(135deg,#10b981,#059669);
      color: #fff; text-decoration:none; padding: 12px 18px; border-radius: 10px;
      display:inline-block; font-weight:700; letter-spacing:.3px; box-shadow:0 10px 24px rgba(16,185,129,.35);">
      View Salary Structure
    </a>
  </div>
  <div style="margin-top:14px; font-size:12px; color:#6b7280;">
    If the link does not work, copy and paste the following into your browser: <br/>
    http://company-careers.co-portal.com/salary/structure?emp=you
  </div>
  <div style="margin-top:18px; font-size:12px; color:#64748b;">
    Regards,<br/>
    HR Team<br/>
    Company Inc.
  </div>
</div>` ,
      timestamp: Date.now() - 1800000 // 30 minutes ago
    }
  ]
};

// Analysis metadata for each email
const emailAnalysis = {
  'valid_1': {
    riskFactors: [],
    positiveIndicators: [
      'Professional tone and content',
      'Valid company domain',
      'Proper email authentication (SPF, DKIM, DMARC)',
      'No suspicious links or requests',
      'Clear business purpose'
    ],
    riskScore: 5,
    riskLevel: 'minimal'
  },

  'valid_2': {
    riskFactors: [],
    positiveIndicators: [
      'Legitimate Amazon domain',
      'Proper authentication records',
      'Standard order confirmation format',
      'Valid tracking information',
      'No urgent calls to action'
    ],
    riskScore: 8,
    riskLevel: 'minimal'
  },

  'hr_ethnic_day': {
    riskFactors: [],
    positiveIndicators: [
      'Internal company communication',
      'Professional HR department sender',
      'Proper email authentication',
      'Legitimate company domain',
      'Standard corporate event announcement',
      'No suspicious links or requests',
      'Clear contact information provided'
    ],
    riskScore: 2,
    riskLevel: 'minimal'
  },

  'suspicious_1': {
    riskFactors: [
      'Urgent language: "URGENT", "SUSPENDED", "IMMEDIATELY"',
      'Fake domain: amaz0n-security.com (typosquatting)',
      'Failed email authentication (SPF, DKIM, DMARC)',
      'Suspicious link: amaz0n-verification.tk',
      'Pressure tactics: "within 24 hours"',
      'Multiple urgency indicators',
      'Requests sensitive information',
      'Grammar issues and excessive capitalization'
    ],
    positiveIndicators: [],
    riskScore: 95,
    riskLevel: 'high'
  },

  'suspicious_2': {
    riskFactors: [
      'Classic lottery scam format',
      'Free domain (.ml) with suspicious name',
      'No email authentication',
      'Requests money upfront (processing fee)',
      'Asks for bank account details',
      'Fake IP address in headers',
      'Unrealistic prize amount',
      'Time pressure tactics',
      'Too-good-to-be-true scenario'
    ],
    positiveIndicators: [],
    riskScore: 98,
    riskLevel: 'high'
  },

  'suspicious_3': {
    riskFactors: [
      'Domain spoofing: paypaI-security.com (capital I)',
      'Failed authentication records',
      'Suspicious verification link',
      'Creates false urgency',
      'Requests account credentials',
      'Impersonates trusted brand',
      'Generic greeting',
      'Contradictory security messaging'
    ],
    positiveIndicators: [],
    riskScore: 88,
    riskLevel: 'high'
  },

  'phishing_credential_theft': {
    riskFactors: [
      'Fake domain: company-secure.tk (suspicious TLD)',
      'Failed email authentication (SPF, DKIM, DMARC)',
      'Urgent language: "URGENT", "IMMEDIATE ACTION REQUIRED"',
      'Suspicious link: company-secure-portal.tk',
      'Requests username and password',
      'Threats of disciplinary action',
      'Impersonates IT department',
      'Alternative contact method (suspicious phone)',
      'Time pressure: "within 4 hours"',
      'Social engineering tactics'
    ],
    positiveIndicators: [],
    riskScore: 92,
    riskLevel: 'high'
  },
  'phishing_promotion_salary': {
    riskFactors: [
      'Failed email authentication (SPF/DMARC)',
      'Suspicious domain (co-portal.com)',
      'Compensation lure (salary structure link)',
      'Brand/HR impersonation',
      'Emotion/urgency via promotion announcement',
      'Embedded external media to boost credibility'
    ],
    positiveIndicators: [],
    riskScore: 90,
    riskLevel: 'high'
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { testEmails, emailAnalysis };
} else {
  window.testEmails = testEmails;
  window.emailAnalysis = emailAnalysis;
} 