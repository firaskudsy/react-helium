import React, {useEffect} from 'react'
import { Tab, Tabs, Row, Col, Container, Card } from 'react-bootstrap';
import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import api from '../utils/stripe-api';
import './crypto.css'

import CheckoutForm from '../components/CheckoutForm';
import { analyticsLog } from '../services/firebase';
const stripePromise = api.getPublicStripeKey().then((key) => loadStripe(key));

export default function Donate() {

  useEffect(() => {
    document.title = "Donate"
    analyticsLog('Donate')
  }, [])

    return (
        <Container>
        <Row className="mt-3">
        <Col className="p-10">
          <Card>
                  <Card.Header className="text-center">
                    <strong>we are thankful for your support, please donate to help us continue to provide the best service.</strong>
                    <p>Developing, hosting, and maintaining this tool is turning into a costly endeavor. Please consider supporting the project with a donation.

</p>
                  </Card.Header>
                  <Card.Body className="text-center">
     {/* <Tabs defaultActiveKey="hnt" id="uncontrolled-tab-example" className="m-10">
            <Tab eventKey="hnt" title="HNT"> */}
            <p className="mt-3">Scan the QR code from your Helium App
or copy the wallet address:</p>
              <label className="btc donate-crypto-box">
                <div className="coin">
                  <img src="./helium-hnt-logo.svg" alt="hnt" />
                </div>
                <input
                readOnly
                  className="coin-address"

                  spellCheck="false"
                  type="text"
                  value="137o1cFHTvHmgN2FaGx5JH5QGxKgr5uD5tsrZuNppjEBu4mEoH1"
                />
              </label>
              <img src="./hnt-address.jpg" alt="hnt" />
            {/* </Tab>
            <Tab eventKey="usd" title="USD">
              <Row className="p-3">
                <h6>
                thanks for your support!, we are working hard to make this project a reality.
                </h6>

                <Col>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm />
                  </Elements>
                </Col>
              </Row>
            </Tab>
          </Tabs> */}
                  </Card.Body>
                </Card>


          </Col>
          </Row>
        </Container>
    )
}
