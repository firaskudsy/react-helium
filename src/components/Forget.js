import {Form, Container, Row, Col} from 'react-bootstrap';
import {signInWithGoogle, analyticsLog, sendPasswordResetEmail} from '../services/firebase';
import { useEffect} from 'react';
import './Login.css';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import Error from './Error';

const Forget = () => {
const [error, setError] = useState('');
      const [show, setShow] = useState(false);


  const {
    register,
    handleSubmit,
    formState: {errors}
  } = useForm();

  const onSubmit = async (data) => {
    const {email} = data;
    const _user = await sendPasswordResetEmail( email);
const message = 'Reset link sent to your email';
  setError(message);
setShow(true);

  };

  useEffect(() => {
    analyticsLog('Signup');
    window.scrollTo(0, 0);
  }, []);

  return (

    <Col md={6}>
    {error && show && <Error title="Reset Passowrd" message={error} show={show} setShow={setShow} />}
      <Container className="form">
        <Row className="mt-3">
          <Col>
            <h4 className="text-center">
              <strong>Welcome to Helium Tools</strong>
            </h4>

            <small className="mt-1">
              sign in required to access the app features, save your hotspots preferences, currency and other settings. those details are needed to provide you
              with the best experience.
            </small>
          </Col>
          <Form className="mt-4">


            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                {...register('email', {
                  required: {value: true, message: 'Email is required'},
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'invalid email address'
                  }
                })}
              />
              <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
              {errors.email?.type === 'required' && <small className="error text-right">{errors.email.message}</small>}
              {errors.email?.type === 'pattern' && <small className="error text-right">{errors.email.message}</small>}
            </Form.Group>


          </Form>
          <button className="login-btn btn-block mt-2" onClick={handleSubmit(onSubmit)}>
            Reset
          </button>
          <button className="login-with-google-btn mt-2" onClick={signInWithGoogle}>
            Sign in with google
          </button>

        </Row>
      </Container>
    </Col>
  );
};

export default Forget;
