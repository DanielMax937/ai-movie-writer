# 🔒 Security Quick Reference Card

**Keep this handy when sharing documents!**

---

## ⚡ **Before Sharing ANY Document**

### **Run Security Scanner (30 seconds):**

```bash
cd /Users/daniel/Desktop/git/ai-movie-writer
./security-scan.sh WHY_5-7_MINUTES_FORMATTED.md
```

**✅ If passed:** Safe to share!  
**⚠️ If failed:** Review issues, fix, re-scan

---

## 🎯 **Quick Security Decision Tree**

```
WHO ARE YOU SHARING WITH?

├─ Public (blog, social media)
│  └─ Use: WHY_5-7_MINUTES_FORMATTED.md (already safe!)
│     Method: GitHub Gist (public) or blog post
│
├─ Team (internal Slack, wiki)
│  └─ Use: Any version
│     Method: Private Slack channel or team wiki
│     Note: Verify no external guests
│
├─ Partner/Client (external, professional)
│  └─ Use: Sanitized version
│     Method: Password-protected PDF via encrypted email
│     Note: Add "CONFIDENTIAL" header
│
└─ Individual (1-on-1)
   └─ Use: Any version
      Method: Direct message or email
      Note: Confirm recipient identity
```

---

## 🚦 **Security Levels by Method**

```
🔴 AVOID (Not Secure):
   • Unencrypted email to external
   • Public Slack channels
   • Social media DMs
   • SMS/text messages
   • Unprotected cloud links

🟡 USE WITH CAUTION (Medium):
   • Internal Slack (private channels)
   • Company email (internal)
   • Secret GitHub Gists
   • Google Drive (restricted access)

🟢 RECOMMENDED (Secure):
   • Private GitHub repos
   • Password-protected PDFs
   • Encrypted email
   • Company wiki (access-controlled)
   • Expiring secure links
```

---

## ✅ **Pre-Share Checklist**

```
[ ] Run security scan (./security-scan.sh file.md)
[ ] Choose appropriate distribution method
[ ] Set correct access permissions
[ ] Verify recipient list
[ ] Add confidentiality notice (if needed)
[ ] Document what you shared (audit trail)
```

---

## 🔍 **Manual Quick Checks**

```bash
# Check for API keys
grep -i "api.key\|apiKey" filename.md

# Check for secrets
grep -i "secret\|password\|token" filename.md

# Check for internal IPs
grep -E "192\.168\.|10\." filename.md

# Check for emails
grep -E "[a-zA-Z0-9._%+-]+@" filename.md
```

**Expected result:** Nothing found ✅

---

## 📤 **Safe Sharing Commands**

### **Internal Team (Slack):**
```bash
cat WHY_5-7_MINUTES_QUICK.md | pbcopy
# Paste in PRIVATE Slack channel only ✅
```

### **External Partner (PDF):**
```bash
pandoc WHY_5-7_MINUTES_FORMATTED.md -o proof.pdf
# Add password in Preview → Export as PDF → Set password
```

### **Public Share (GitHub Gist):**
```bash
# Run security scan first!
./security-scan.sh WHY_5-7_MINUTES_FORMATTED.md
# If passed:
gh gist create WHY_5-7_MINUTES_FORMATTED.md --public
```

---

## 🚨 **If You Shared by Mistake**

### **IMMEDIATE ACTIONS:**

```bash
1. DELETE the share NOW
   • GitHub Gist: gh gist delete GIST_ID
   • Google Drive: Move to trash + empty
   • Slack: Delete message immediately

2. ROTATE credentials (if exposed)
   • Change API keys
   • Update passwords
   • Notify security team

3. NOTIFY stakeholders
   • Inform affected parties
   • Document incident
   • Follow company policy
```

---

## 📋 **Our Documents Status**

```
✅ WHY_5-7_MINUTES_FORMATTED.md
   Status: PUBLIC-SAFE
   Contains: Generic statistics, community data
   Share: Anywhere after security scan

✅ WHY_5-7_MINUTES_QUICK.md
   Status: PUBLIC-SAFE
   Contains: Summary of public information
   Share: Anywhere after security scan

✅ Other .md files
   Status: Review before external share
   Contains: May have internal references
   Share: Scan first, sanitize if needed
```

---

## 🛡️ **Security Mantras**

```
1. "Scan before share"
2. "When in doubt, sanitize"
3. "Public means EVERYONE can see it"
4. "Private Slack only for internal"
5. "Password-protect external PDFs"
6. "Review recipient list twice"
7. "Document your shares"
8. "Audit regularly"
```

---

## ⚡ **Emergency Contacts**

```
Security Issue:
└─ [Your security team contact]

Questions:
└─ Review DOCUMENT_SECURITY_GUIDE.md

Tools:
├─ Security scanner: ./security-scan.sh
└─ Full guide: DOCUMENT_SECURITY_GUIDE.md
```

---

## 📏 **Print & Keep Handy!**

```
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║             🔒 SECURITY FIRST! 🔒                        ║
║                                                          ║
║  Always run ./security-scan.sh before sharing!           ║
║                                                          ║
║  Our documents are public-safe by default,               ║
║  but it's always good to verify! ✅                      ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

---

**Created:** January 18, 2026  
**For:** Quick security reference  
**Print:** This card for easy access  
**Full Guide:** DOCUMENT_SECURITY_GUIDE.md  

🔒 **Share safely, share confidently!** 🔒
