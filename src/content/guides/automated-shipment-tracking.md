---
title: "Automated Shipment Tracking"
date: 2021-08-31
description: "A Gmail and Deliveries workflow for automatically adding package tracking numbers to your shipment tracker."
tags: [email, automation, shipping]
growthStage: published
---

## Overview

This is my current workflow for automatically catching all emails that contain a tracking number and forwarding them to my package tracking app of choice, [Deliveries by Junecloud](https://junecloud.com/).

[Junecloud](https://junecloud.com/)

> We make software for iPhone, iPad, Mac, and Web. Deliveries 9 has arrived We've been hard at work on a major update to Deliveries, and we're excited to announce that it's available now. Read our initial announcement, our update with final details, or download it now on the App Store.

I’m a big fan of the Deliveries app, but with this workflow it’s even better because all of your tracking numbers show up in the app automatically! ✨ You can download Deliveries for iPhone, iPad, and on the Mac (which includes a menu bar app for quick access!), and your tracked shipments can be synced across all of your devices. Like I said, I’m a fan.

Here’s the basic workflow you’ll want to setup to get your packages automatically added to Deliveries without any effort on your part:

---

## 1. Create a new filter in your Google email account.

First you’ll need to create a new filter in your GMail or GSuite email account. You can do this in the Settings menu (top right if you’re on desktop).

For the search query, you’ll want to leave all fields blank, except for the `Has the words` field, into which you’ll copy and paste the following snippet:

```
{ "tracking number" "tracking numbers" "tracking no" "track my" "track package" "track shipment" "track your order" "track your package" "track your shipment" "track the status" "tracking link" "tracking id" "tracking information" "shipping information" "shipment tracking" "shipment status" "shipping confirmation" "shipment from" "shipped by" "priority tracking" subject:"order AROUND 2 shipped" } -{ subject:"[confidential]" subject:(bank account) subject:banking }
```

*The basic goal of this gibberish is to grab all emails that sound like they are providing you with a tracking number. The last section removes emails that contain sensitive info like banking details or that are flagged as “confidential”. Feel free to modify as you see fit.*

Once you’ve pasted this into your filter options, click **Continue**.

## 2. Forward filtered mail to Deliveries app.

For the next step, you’ll want to forward all mail that gets filtered with this rule to Junecloud to add to your Deliveries app. You'll need to [follow their instructions](https://junecloud.com/support/deliveries-ios/mail-to-deliveries.html) on the specifics of setting up the forwarding, but it's quick and easy, and you'll only need to do it once.

You can also apply other actions on the GMail filter at this point. I like to apply a tag of `tracking` so I can easily see them in my inbox. You could also choose to archive the messages if you prefer.

## 3. Enable Junecloud Sync in the Deliveries app

Now the you’ve got all email messages that contain a tracking number getting forwarded to Junecloud, the last step is to make sure your Deliveries app is using Junecloud Sync so you’ll see your tracking numbers show up automatically. It’s a little different in each version of the app, but you’ll see the option to log in to your Junecloud Sync account in the Settings section of the app.

Once you’ve got this enabled, you should start seeing your tracking numbers flowing through!

---

## Notes & Bonus Tips

- This guide assumes you’re using a GMail or GSuite account for your email. I’m sure this can be done with other email providers, but you would just need to modify steps 1 and 2 to fit the settings of your preferred email system.

- Occasionally the filter rules will catch a false positive. An email that says something like “your shipping information is coming soon” would get caught in this filter and added to your Deliveries app. Just delete these as they come through, it’s usually pretty rare.

- Amazon orders tend to use their own Amazon tracking system. If you log into your Amazon account, Deliveries can pull tracking info for these packages as well.

- If you sign up for an account with FedEx or UPS, you can have them automatically email you any time a package gets shipped to your address within their system. And of course, those notifications would get caught with our filter and added to Deliveries. This is great for packages where you might not normally get an email notifying you that it was shipped. Shipments from a friend or family member are common examples where this is helpful.
