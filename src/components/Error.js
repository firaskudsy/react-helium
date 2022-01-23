import React from 'react'
import { Modal} from 'react-bootstrap';

export default function Error({title, message, show, setShow}) {

      const handleClose = () => setShow(false);


    return (
         <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <h6>{title}</h6>
        </Modal.Header>
        <Modal.Body>
<p>
{message}
</p>

        </Modal.Body>
      </Modal>
    )
}
