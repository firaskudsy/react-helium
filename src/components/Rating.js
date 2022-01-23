import React , {useContext} from 'react';
import {useStars} from 'stars-rating-react-hooks';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { AuthContext } from '../providers/AuthProvider';
import { rateApp} from '../services/firebase';
export default function Rating() {

      const {user, setLater} = useContext(AuthContext);


  const config = {
    totalStars: 5,
    initialSelectedValue: 4.5,
    renderFull: '★',
    renderEmpty: '☆'
  };

  const {stars, getStarProps, getStarWrapperProps, isSelecting, selectingValue} = useStars(config);

  return (
  <Container>
<Row    className= "mt-3">
      <Col>
      <Card>
      <Card.Body>
        <Card.Title>Rating
        </Card.Title>
        <Card.Text>
    please rate this application, it will help us to improve it. Thank you!

        </Card.Text>

        <span
          {...getStarWrapperProps({
            style: {
              cursor: 'pointer',
              display: 'inline-block'
            }
          })}
        >
          {stars?.map((star, i) => (
            <span
              key={i}
              {...getStarProps(i, {
                style: {
                    color: isSelecting && selectingValue === i + 1 ? '#ffd700' : '#ffd700',
                  fontSize: '30px',
                  display: 'inline-block'
                },
                onClick: async (event, ratedValue) => {

await rateApp(user.uid, ratedValue);
setLater(false);
                  console.log(`You just rated ${ratedValue} Stars!!`);
                }
              })}
            >
              {star}
            </span>
          ))}
        </span>
        </Card.Body>
    <Card.Footer >

    <div className="rate-group">

    <div className="nav-link hvr text-center rate-btn" onClick={()=>{console.log('click');setLater(false)}}>
        Later !
    </div>
    </div>
    </Card.Footer>
      </Card>

      </Col>
    </Row>
  </Container>  );

}
