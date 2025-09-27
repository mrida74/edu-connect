# Stripe CLI Setup for Git Bash

## 📋 **Option 1: Manual Download & Setup (সবচেয়ে সহজ)**

### **Step 1: Create Directory and Download**

```bash
# 1. Create directory for Stripe CLI
mkdir -p ~/stripe-cli
cd ~/stripe-cli

# 2. Download Stripe CLI (Git Bash এ curl দিয়ে)
curl -LO https://github.com/stripe/stripe-cli/releases/download/v1.21.8/stripe_1.21.8_windows_x86_64.zip

# 3. Extract (যদি unzip available থাকে)
unzip stripe_1.21.8_windows_x86_64.zip

# 4. Make executable
chmod +x stripe.exe

# 5. Add to PATH (temporary জন্য)
export PATH=$PATH:~/stripe-cli

# 6. Test installation
stripe --version
```

### **Step 2: Login to Stripe**

```bash
# Stripe account এ login করুন
stripe login

# এটি browser open করবে Stripe dashboard এর জন্য
# Login করার পর একটি API key pair হবে
```

### **Step 3: Start Webhook Listener**

```bash
# Webhook listener start করুন
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# এটি একটি webhook endpoint secret দেবে
# সেটি .env.local এ add করুন: STRIPE_WEBHOOK_SECRET=whsec_...
```

### **Step 4: Test Payment Intent**

```bash
# Payment intent create করে test করুন
stripe payment_intents create --amount 2000 --currency usd

# Webhook events trigger করুন
stripe trigger payment_intent.succeeded
```

## 🚀 **Quick Setup Commands (Git Bash)**

একবার Stripe CLI install হলে এই commands গুলো run করুন:

```bash
# 1. Login
stripe login

# 2. Start webhook listener (separate terminal এ)
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 3. Test webhook (another terminal এ)
stripe trigger payment_intent.succeeded

# 4. Create test payment
stripe payment_intents create --amount 5000 --currency usd
```

## 🔧 **Permanent PATH Setup**

যদি আপনি Stripe CLI permanently ব্যবহার করতে চান:

### **Option A: Git Bash Profile এ add করুন**

```bash
# ~/.bashrc file এ add করুন
echo 'export PATH=$PATH:~/stripe-cli' >> ~/.bashrc

# Reload bash profile
source ~/.bashrc
```

### **Option B: Windows PATH এ add করুন**

1. **Windows Search** → "Environment Variables"
2. **System Properties** → Advanced → Environment Variables
3. **PATH variable** এ add করুন: `C:\Users\YourUsername\stripe-cli\`

## ⚡ **Common Commands**

```bash
# Check version
stripe --version

# Login/logout
stripe login
stripe logout

# List webhooks
stripe webhooks list

# Create webhook endpoint
stripe webhooks create --url="https://yoursite.com/webhook" --events="payment_intent.succeeded"

# Listen to webhooks locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
stripe trigger checkout.session.completed

# Create test payment intent
stripe payment_intents create \
  --amount=2000 \
  --currency=usd \
  --payment-method-types=card

# List payment intents
stripe payment_intents list --limit=5

# Get payment intent details
stripe payment_intents retrieve pi_xxxxxxxxxxxxxx
```

## 🎯 **For EduConnect Project**

```bash
# 1. Navigate to project directory
cd /c/Users/User/OneDrive/Desktop/HTML/reactive-accelerator/edu-connect

# 2. Login to Stripe
stripe login

# 3. Start webhook listener for your purchase system
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# 4. Copy the webhook secret that appears and add it to .env.local
# STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxx

# 5. Test your purchase system
stripe trigger payment_intent.succeeded
```

**Git Bash এ Stripe CLI install করার পর এই commands গুলো কাজ করবে! 🎉**