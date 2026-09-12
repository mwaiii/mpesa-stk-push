# M-Pesa STK Push Demo

A working demo that triggers Safaricom's M-Pesa "STK Push" payment prompt — enter a phone number and amount, and the customer gets a PIN prompt on their phone to complete payment.

**Live demo:** https://mpesa-prompt-2026.netlify.app

## How it works

1. User enters a phone number and amount on the webpage.
2. The page calls a serverless function (`stkpush.js`), which authenticates with Safaricom's Daraja API and requests a payment prompt.
3. Safaricom sends the prompt to the customer's phone.

## Tech stack

- **Frontend:** Plain HTML/CSS/JavaScript
- **Backend:** Netlify Functions (serverless, Node.js)
- **Payments:** Safaricom Daraja API (M-Pesa STK Push), sandbox environment

## Notes

- Currently running against Safaricom's sandbox environment (test payments only, no real money).
- Phone numbers are auto-formatted to Safaricom's required format (`2547XXXXXXXX`) regardless of how they're typed (`07...`, `+254...`, `254...`).
