import {Form, Container, Row, Col} from 'react-bootstrap';
import {signInWithGoogle, analyticsLog, signWithEmail, signInGuest} from '../services/firebase';
import {useContext, useEffect} from 'react';
import './Login.css';
import {useState} from 'react';
import {LoginContext} from '../providers/LoginProvider';
import {useForm} from 'react-hook-form';
import Error from './Error';

const Signin = () => {
  const {setFrm} = useContext(LoginContext);
  const [error, setError] = useState('');
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    formState,
  } = useForm({
    mode: "onChange"
  });
const guest =async () => {
  try {
    const _user = await signInGuest();
    analyticsLog('Sign in as guest');
  } catch (error) {
    console.log(error);
  }

}

  const onSubmit = async (data) => {
    const {email, password} = data;
    const _user = await signWithEmail(email, password);
    if (_user.status === 'error') {
      setError(_user.message);
      setShow(true);
    }
  };

  useEffect(() => {
    analyticsLog('Signup');
    window.scrollTo(0, 0);
  }, []);

  return (
    <Col md={6} className="mb-5">
      {error && show && <Error title="Signin Failed" message={error} show={show} setShow={setShow} />}
      <Container className="form pt-4">
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
          <Form className="mt-4 p-5">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                autoComplete="username"
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
              {formState.errors.email?.type === 'required' && <small className="error text-right">{formState.errors.email.message}</small>}
              {formState.errors.email?.type === 'pattern' && <small className="error text-right">{formState.errors.email.message}</small>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" autoComplete="current-password" placeholder="Password" {...register('password', {required: {value: true, message: 'Password is required'}})} />
              {formState.errors.password?.type === 'required' && <small className="error text-right">{formState.errors.password.message}</small>}
            </Form.Group>
                 <p className="forgot-password text-right">
                New User <span className="hvr-link" onClick={() => setFrm({type: 'signup'})}>register ?</span>
              </p>
            {/* <p className="forgot-password text-right">
              Forget Password <a onClick={() => setFrm({type: 'forget'})}>reset ?</a>
            </p> */}
          </Form>
          <div className=" text-center p-2">
            <div className="fbtn">
              <button disabled={!formState.isValid}  className="login-btn btn-block mt-2" onClick={handleSubmit(onSubmit)}>
                Signin
              </button>
            </div>
            <div className="fbtn">
              <button className="login-with-google-btn mt-2" onClick={signInWithGoogle}>
                Sign in with google
              </button>
            </div>
                      <div className="fbtn">
              <button className="login-with-guest-btn mt-2" onClick={guest}>
                I'm Guest !!
              </button>
            </div>

          </div>
                <p className="forgot-password text-center">
                please note that popup blockers may prevent the app from working properly. please allow popups to continue. and check if your browser is blocking popups.
              </p>
        </Row>
      </Container>
    </Col>
  );
};

export default Signin;
