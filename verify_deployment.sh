#!/bin/bash

# AI Movie Writer - Automated Deployment Verification Script
# Usage: bash verify_deployment.sh https://your-deployment-url.vercel.app

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if URL is provided
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: No deployment URL provided${NC}"
  echo ""
  echo "Usage: bash verify_deployment.sh https://your-deployment-url.vercel.app"
  echo ""
  echo "Example:"
  echo "  bash verify_deployment.sh https://ai-movie-writer-abc123.vercel.app"
  exit 1
fi

DEPLOYMENT_URL="$1"

# Remove trailing slash if present
DEPLOYMENT_URL="${DEPLOYMENT_URL%/}"

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║        🔍 AI MOVIE WRITER - DEPLOYMENT VERIFICATION 🔍          ║"
echo "║                                                                  ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
echo "Testing deployment: $DEPLOYMENT_URL"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Initialize counters
PASSED=0
FAILED=0
WARNINGS=0

# Test 1: HTTP Accessibility
echo -e "${BLUE}TEST 1: HTTP Accessibility${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$DEPLOYMENT_URL" 2>/dev/null)

if [ "$HTTP_CODE" == "200" ]; then
  echo -e "${GREEN}✅ PASS${NC}: Site is accessible (HTTP $HTTP_CODE)"
  ((PASSED++))
elif [ -z "$HTTP_CODE" ]; then
  echo -e "${RED}❌ FAIL${NC}: No response (timeout or connection error)"
  echo "   → Check if URL is correct"
  echo "   → Check if deployment is complete"
  ((FAILED++))
else
  echo -e "${RED}❌ FAIL${NC}: Unexpected HTTP code: $HTTP_CODE"
  echo "   → 404: Page not found"
  echo "   → 500: Server error"
  echo "   → Check Vercel deployment logs"
  ((FAILED++))
fi
echo ""

# Test 2: HTTPS Check
echo -e "${BLUE}TEST 2: HTTPS Security${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [[ "$DEPLOYMENT_URL" == https://* ]]; then
  echo -e "${GREEN}✅ PASS${NC}: Using HTTPS (secure)"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  WARNING${NC}: Not using HTTPS"
  echo "   → Vercel deployments should use HTTPS by default"
  ((WARNINGS++))
fi
echo ""

# Test 3: Page Content
echo -e "${BLUE}TEST 3: Page Content${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
CONTENT=$(curl -s --max-time 10 "$DEPLOYMENT_URL" 2>/dev/null)

if echo "$CONTENT" | grep -q "AI Movie Writer\|AI电影编剧"; then
  echo -e "${GREEN}✅ PASS${NC}: Page content loaded correctly"
  ((PASSED++))
else
  echo -e "${RED}❌ FAIL${NC}: Expected content not found"
  echo "   → Page may not be loading correctly"
  echo "   → Check browser console for errors"
  ((FAILED++))
fi
echo ""

# Test 4: Next.js Framework
echo -e "${BLUE}TEST 4: Next.js Framework${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if echo "$CONTENT" | grep -q "_next/static\|__next"; then
  echo -e "${GREEN}✅ PASS${NC}: Next.js bundles detected"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  WARNING${NC}: Next.js bundles not clearly detected"
  echo "   → May be a build configuration issue"
  ((WARNINGS++))
fi
echo ""

# Test 5: API Key Security
echo -e "${BLUE}TEST 5: API Key Security${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if echo "$CONTENT" | grep -qi "API_KEY\|CUSTOM_AI_API_KEY"; then
  echo -e "${RED}❌ CRITICAL${NC}: API keys may be exposed in page source!"
  echo "   → IMMEDIATE ACTION REQUIRED"
  echo "   → Check environment variables in Vercel"
  echo "   → API keys should NEVER appear in client-side code"
  ((FAILED++))
else
  echo -e "${GREEN}✅ PASS${NC}: No API keys found in page source"
  ((PASSED++))
fi
echo ""

# Test 6: Response Time
echo -e "${BLUE}TEST 6: Response Time${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" --max-time 10 "$DEPLOYMENT_URL" 2>/dev/null)

if [ -z "$RESPONSE_TIME" ]; then
  echo -e "${RED}❌ FAIL${NC}: Could not measure response time"
  ((FAILED++))
else
  # Convert to integer for comparison (remove decimal)
  RESPONSE_INT=$(echo "$RESPONSE_TIME" | cut -d'.' -f1)
  
  if [ "$RESPONSE_INT" -lt 2 ]; then
    echo -e "${GREEN}✅ EXCELLENT${NC}: Response time: ${RESPONSE_TIME}s (Fast!)"
    ((PASSED++))
  elif [ "$RESPONSE_INT" -lt 5 ]; then
    echo -e "${GREEN}✅ PASS${NC}: Response time: ${RESPONSE_TIME}s (Good)"
    ((PASSED++))
  else
    echo -e "${YELLOW}⚠️  WARNING${NC}: Response time: ${RESPONSE_TIME}s (Slow)"
    echo "   → Consider optimizing or checking network"
    ((WARNINGS++))
  fi
fi
echo ""

# Test 7: Meta Tags
echo -e "${BLUE}TEST 7: HTML Meta Tags${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if echo "$CONTENT" | grep -q "<head"; then
  echo -e "${GREEN}✅ PASS${NC}: HTML structure valid"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  WARNING${NC}: HTML structure may be incomplete"
  ((WARNINGS++))
fi
echo ""

# Test 8: Character Encoding
echo -e "${BLUE}TEST 8: Character Encoding${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if echo "$CONTENT" | grep -q "charset=utf-8\|charset=UTF-8"; then
  echo -e "${GREEN}✅ PASS${NC}: UTF-8 encoding set (supports Chinese)"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠️  WARNING${NC}: UTF-8 encoding not clearly set"
  echo "   → May cause issues with Chinese characters"
  ((WARNINGS++))
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "VERIFICATION SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Passed:${NC}   $PASSED tests"
echo -e "${RED}❌ Failed:${NC}   $FAILED tests"
echo -e "${YELLOW}⚠️  Warnings:${NC} $WARNINGS warnings"
echo ""

# Overall status
TOTAL_TESTS=$((PASSED + FAILED))
PASS_RATE=$((PASSED * 100 / TOTAL_TESTS))

echo "Pass Rate: $PASS_RATE% ($PASSED/$TOTAL_TESTS)"
echo ""

if [ $FAILED -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo "╔══════════════════════════════════════════════════════════════════╗"
  echo "║                                                                  ║"
  echo "║              🎉 ALL TESTS PASSED! 🎉                             ║"
  echo "║                                                                  ║"
  echo "║  Your deployment is working perfectly!                           ║"
  echo "║                                                                  ║"
  echo "╚══════════════════════════════════════════════════════════════════╝"
  echo ""
  echo "✅ NEXT STEPS:"
  echo "   1. Test manually in browser: $DEPLOYMENT_URL"
  echo "   2. Try generating a script"
  echo "   3. Share with users!"
  echo ""
  exit 0
elif [ $FAILED -eq 0 ]; then
  echo "╔══════════════════════════════════════════════════════════════════╗"
  echo "║                                                                  ║"
  echo "║            ⚠️  PASSED WITH WARNINGS ⚠️                           ║"
  echo "║                                                                  ║"
  echo "║  Your deployment works but has minor issues.                     ║"
  echo "║                                                                  ║"
  echo "╚══════════════════════════════════════════════════════════════════╝"
  echo ""
  echo "⚠️  RECOMMENDED ACTIONS:"
  echo "   1. Review warnings above"
  echo "   2. Test manually in browser"
  echo "   3. Fix warnings when possible"
  echo ""
  exit 0
else
  echo "╔══════════════════════════════════════════════════════════════════╗"
  echo "║                                                                  ║"
  echo "║              ❌ VERIFICATION FAILED ❌                           ║"
  echo "║                                                                  ║"
  echo "║  Critical issues detected. Please fix before using.              ║"
  echo "║                                                                  ║"
  echo "╚══════════════════════════════════════════════════════════════════╝"
  echo ""
  echo "❌ REQUIRED ACTIONS:"
  echo "   1. Review failed tests above"
  echo "   2. Check Vercel deployment logs"
  echo "   3. Verify environment variables"
  echo "   4. See VERIFY_DEPLOYMENT.md for troubleshooting"
  echo ""
  exit 1
fi
