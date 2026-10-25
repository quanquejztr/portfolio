# Contact form on Netlify

The React form submits directly to Netlify Forms, with a static declaration in `public/index.html` so Netlify can detect its fields during deploy. `netlify.toml` builds the CRA app into `build/`. No email API key or custom backend is needed.

## Enable on your Netlify site

1. Go to **Forms** and select **Enable form detection**.
2. Deploy this version (or redeploy after enabling detection).
3. Confirm the **contact** form appears under Forms.
4. Under **Forms → Submission notifications**, choose **Add notification → Email notification**, select the contact form, and use **stephenluong24@gmail.com** as recipient.
5. After deployment, submit a real test message and confirm both the verified submission and your notification email. Delivery has not been tested from this local checkout.

Without the email notification, submissions are stored in the Netlify Forms dashboard but are not automatically emailed to you. No deployment or account configuration was performed by this change.

The frontend validates name/email/message, includes a honeypot, prevents duplicate pending requests, preserves text after errors, and shows success only after an accepted HTTP response. On localhost it explicitly says to use the published site; it never reports a successful submission to the local static server.

Official setup: https://docs.netlify.com/manage/forms/setup/
Official notifications: https://docs.netlify.com/manage/forms/notifications/
