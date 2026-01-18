#!/bin/bash

# 🔒 Document Security Scanner
# Run this before sharing any document to verify safety

echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║         🔒 DOCUMENT SECURITY SCANNER 🔒                  ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Check if file provided
if [ -z "$1" ]; then
    echo "❌ Usage: ./security-scan.sh <filename>"
    echo ""
    echo "Example: ./security-scan.sh WHY_5-7_MINUTES_FORMATTED.md"
    exit 1
fi

FILE="$1"

# Check if file exists
if [ ! -f "$FILE" ]; then
    echo "❌ File not found: $FILE"
    exit 1
fi

echo "📄 Scanning: $FILE"
echo "⏳ Please wait..."
echo ""

ISSUES_FOUND=0

# Check for API keys (actual values, not variable names)
echo "🔍 Checking for API keys..."
# Look for patterns like: apiKey: "sk-...", APIKEY=abc123, etc.
if grep -qE "(apiKey|api_key|APIKEY)\s*(=|:)\s*['\"]?[a-zA-Z0-9]{20,}" "$FILE"; then
    echo "   ⚠️  POTENTIAL API KEY VALUE FOUND!"
    grep -nE "(apiKey|api_key|APIKEY)\s*(=|:)\s*['\"]?[a-zA-Z0-9]{20,}" "$FILE" | head -3
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "   ✅ No API key values detected"
fi
echo ""

# Check for secrets/passwords
echo "🔍 Checking for secrets/passwords..."
if grep -qi "secret\|password\|token\|credential" "$FILE"; then
    echo "   ⚠️  POTENTIAL SECRETS FOUND!"
    grep -n "secret\|password\|token\|credential" "$FILE" | head -3
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "   ✅ No secrets detected"
fi
echo ""

# Check for internal IPs (but exclude common false positives like version numbers)
echo "🔍 Checking for internal IP addresses..."
# Exclude patterns like "10." in "10. Executive Summary"
if grep -E "(192\.168\.[0-9]{1,3}\.[0-9]{1,3}|10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.[0-9]{1,3}\.[0-9]{1,3})" "$FILE" | grep -v "^[0-9]\+:" | grep -qE "(192\.168\.|10\.[0-9]{1,3}\.|172\.)"; then
    echo "   ⚠️  INTERNAL IP ADDRESSES FOUND!"
    grep -nE "(192\.168\.[0-9]{1,3}\.[0-9]{1,3}|10\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}|172\.(1[6-9]|2[0-9]|3[0-1])\.[0-9]{1,3}\.[0-9]{1,3})" "$FILE" | grep -v "^[0-9]\+:" | head -3
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "   ✅ No internal IPs detected"
fi
echo ""

# Check for email addresses
echo "🔍 Checking for email addresses..."
EMAIL_COUNT=$(grep -oE "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" "$FILE" | wc -l)
if [ "$EMAIL_COUNT" -gt 0 ]; then
    echo "   ⚠️  $EMAIL_COUNT EMAIL ADDRESS(ES) FOUND!"
    grep -oE "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}" "$FILE" | head -3
    echo "   ℹ️  Review if these should be public"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "   ✅ No email addresses detected"
fi
echo ""

# Check for database connection strings
echo "🔍 Checking for database connections..."
if grep -qi "mongodb://\|postgresql://\|mysql://\|redis://" "$FILE"; then
    echo "   ⚠️  DATABASE CONNECTION STRING FOUND!"
    grep -n "mongodb://\|postgresql://\|mysql://\|redis://" "$FILE" | head -3
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "   ✅ No database connections detected"
fi
echo ""

# Check for private keys
echo "🔍 Checking for private keys..."
if grep -qi "BEGIN.*PRIVATE KEY\|BEGIN RSA PRIVATE KEY" "$FILE"; then
    echo "   ⚠️  PRIVATE KEY FOUND!"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "   ✅ No private keys detected"
fi
echo ""

# Check for AWS credentials
echo "🔍 Checking for AWS credentials..."
if grep -qi "AKIA\|aws_access_key\|aws_secret" "$FILE"; then
    echo "   ⚠️  AWS CREDENTIALS FOUND!"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
else
    echo "   ✅ No AWS credentials detected"
fi
echo ""

# Final summary
echo "════════════════════════════════════════════════════════════"
if [ $ISSUES_FOUND -eq 0 ]; then
    echo ""
    echo "✅ SECURITY CHECK PASSED!"
    echo ""
    echo "   No sensitive data detected in: $FILE"
    echo "   This document appears SAFE to share."
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                                                          ║"
    echo "║              ✅ SAFE TO SHARE! ✅                        ║"
    echo "║                                                          ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    exit 0
else
    echo ""
    echo "⚠️  SECURITY CHECK FAILED!"
    echo ""
    echo "   $ISSUES_FOUND potential security issue(s) found!"
    echo "   REVIEW THE FILE before sharing."
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║                                                          ║"
    echo "║           ⚠️  DO NOT SHARE YET! ⚠️                       ║"
    echo "║                                                          ║"
    echo "║   Review and fix issues before distribution              ║"
    echo "║                                                          ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    exit 1
fi
