import React, { useEffect, useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import "./CheckoutForm.css";
import api from '../utils/stripe-api';
import { analyticsLog } from '../services/firebase';

export default function CheckoutForm() {
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("");
  const [donations, setDonations] = useState([]);
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  // const [metadata, setMetadata] = useState(null);
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
analyticsLog("CheckoutForm");

        api.getDonationsDetails().then(donationsDetails => {
      setDonations(donationsDetails);
       setAmount(donationsDetails[0].amount);
      setCurrency(donationsDetails[0].currency);
    });


  }, []);

  useEffect(() => {

    api
      .createPaymentIntent({
        payment_method_types: ["card"],
        amount,
        currency
      })
      .then(clientSecret => {
        setClientSecret(clientSecret);
      })
      .catch(err => {
        setError(err.message);
      });
  }, [donations, amount, currency]);

  const handleSubmit = async ev => {
    ev.preventDefault();
    setProcessing(true);
analyticsLog("CheckoutForm", "handleSubmit");
    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: ev.target.name.value
        }
      }
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
      console.log("[error]", payload.error);
    } else {
      setError(null);
      setSucceeded(true);
      setProcessing(false);
      // setMetadata(payload.paymentIntent);
      console.log("[PaymentIntent]", payload.paymentIntent);
    }
  };

  const renderSuccess = () => {
    return (
      <div className="sr-field-success message">
        <h1>Thank you for your donation</h1>
        <p>People like you are an inspiration to all. Thank you for this generous act of giving. Today, your donation is a gift that could not be appreciated more.</p>
      </div>
    );
  };

  const renderForm = () => {
    const options = {
      style: {
        base: {
          color: "#32325d",
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSmoothing: "antialiased",
          fontSize: "16px",
          "::placeholder": {
            color: "#aab7c4"
          }
        },
        invalid: {
          color: "#fa755a",
          iconColor: "#fa755a"
        }
      }
    };

    return (
      <div>
        {donations?.map(p=>(<button className="btn btn-outline-success m-2" key={p.amount} onClick={()=>{setAmount(p.amount);setCurrency(p.currency)}}>{p.amount/100}<small style={{ 'fontSize':'10px'}}>{p.currency}</small></button>))}
<h5>{amount/100}<small>{currency}</small></h5>
      <form onSubmit={handleSubmit}>

        <div className="sr-combo-inputs">
          <div className="sr-combo-inputs-row">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              autoComplete="cardholder"
              className="form-control"
            />
          </div>

          <div className="sr-combo-inputs-row">
            <CardElement
              className="sr-input sr-card-element"
              options={options}
            />
          </div>
        </div>
        {error && <div className="message sr-field-error">{error}</div>}
        <button
          className="btn btn-outline-success"
          disabled={processing || !clientSecret || !stripe}
        >
          {processing ? "Processing…" : "Donate"}
        </button>
      </form>
      </div>
    );
  };

  return (
    <div className="checkout-form">
      <div className="sr-payment-form">
        <div className="sr-form-row" />
        {succeeded ? renderSuccess() : renderForm()}
      </div>
    </div>
  );
}
