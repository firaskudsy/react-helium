import React from 'react'
import {Card} from 'react-bootstrap';


export default function RewardsCard({title, hnt, rewards, currency}) {
    return (
              <Card>
                <Card.Header className="text-center">{title}</Card.Header>
                <Card.Body className="text-center">
                  <p>
                    <span className="hnt">{hnt}</span> hnt
                  </p>
                  <p>
                    {' '}
                    <span className="curr">{rewards}</span> {currency}
                  </p>{' '}
                </Card.Body>
              </Card>
    )
}
