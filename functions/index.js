/* eslint-disable no-unused-vars */
/* eslint-disable max-len */

"use strict";

const functions = require("firebase-functions");
const bodyParser = require("body-parser");
const {resolve} = require("path");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(
    express.json({
      verify: function(req, res, buf) {
        if (req.originalUrl.startsWith("/webhook")) {
          req.rawBody = buf.toString();
        }
      },
    })
);

// Automatically allow cross-origin requests
app.use(cors({origin: true}));

// const admin = require("firebase-admin");
// admin.initializeApp();
const {Logging} = require("@google-cloud/logging");
// eslint-disable-next-line no-unused-vars
const logging = new Logging({
  projectId: functions.config().app.gcloud_project,
});

const {Stripe} = require("stripe");
// eslint-disable-next-line no-unused-vars
const stripe = new Stripe(functions.config().app.stripe_secret_key, {
  apiVersion: "2020-08-27",
});


app.get("/", (req, res) => {
  res.send("Hello from API");
});

app.get("/public-key", (req, res) => {
  res.send({ publishableKey: functions.config().app.stripe_piblishable_key });
});

app.get("/product-details", (req, res) => {
  let data = getProductDetails();
  res.send(data);
});

app.get("/donations", (req, res) => {
  let data = getDonationsDetails();
  res.send(data);
});


app.post("/create-payment-intent", async (req, res) => {
  const body = req.body;
  const productDetails = getProductDetails();

  const options = {
    ...body,
    // amount: productDetails.amount,
    // currency: "USD"
  };

  try {
    const paymentIntent = await stripe.paymentIntents.create(options);
    res.json(paymentIntent);
  } catch (err) {
    res.json(err);
  }
});

let getProductDetails = () => {
  return { currency: "USD", amount: 500 };
};

let getDonationsDetails = () => {
  return [{ currency: "USD", amount: 500 }, { currency: "USD", amount: 1000 }, { currency: "USD", amount: 2500 }];
};

// Webhook handler for asynchronous events.
app.post("/webhook", async (req, res) => {
  let data;
  let eventType;
  // Check if webhook signing is configured.
  if (functions.config().app.stripe_webhook_secret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        functions.config().app.stripe_webhook_secret
      );
    } catch (err) {
      console.log(`⚠️ Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  if (eventType === "payment_intent.succeeded") {
    // Fulfill any orders, e-mail receipts, etc
    console.log("💰 Payment received!");
  }

  if (eventType === "payment_intent.payment_failed") {
    // Notify the customer that their order was not fulfilled
    console.log("❌ Payment failed.");
  }

  res.sendStatus(200);
});

exports.stripe = functions.https.onRequest(app);
