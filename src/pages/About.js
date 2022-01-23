import React , {useEffect} from 'react'
import { analyticsLog } from '../services/firebase';
import { Container, Row, Col } from 'react-bootstrap';

export default function About() {
     useEffect(() => {
        document.title = "About"

    analyticsLog('About');


    return () => {
      console.log('cleaup hids');
    };
  }, []);

    return (
        <Container>
        <Row className="mt-3">
            <Col><h3>About</h3></Col>

        </Row>
        <p>
            <strong>Helium tools</strong> is a rewards monitorting tool for the Helium blockchain. It is a web application that allows users to view the rewards of their Helium accounts and also from other accounts.</p>
         <p>you can select the currency you want to view the rewards in.
            more fetures will be added soon.
        </p>
        <p>your support is very important to us. Please consider sharing the app with your friends and family. We are always looking for new features and improvements.
                </p>
        </Container>
    )
}
