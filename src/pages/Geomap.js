import React, {useContext, useEffect, useState} from 'react';
import {analyticsLog} from '../services/firebase';
import {AuthContext} from '../providers/AuthProvider';
import {Map, Marker} from 'pigeon-maps';
import { Modal, Button } from 'react-bootstrap'
import {fetchNearby} from '../utils/api';

let _markers = [];

export default function Geomap() {
  const {active} = useContext(AuthContext);
  const [locations, setLocations] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [center, setCenter] = useState([]);
const [show, setShow] = useState(false);
const [selected, setSelected] = useState(null);


  const handleClose = () => setShow(false);
  const handleShow = (m) => {
    setSelected(m[2]);
    setShow(true);}

  useEffect(() => {
    document.title = 'Nearby';

    analyticsLog('Nearby');
    return () => {
      console.log('unmounting');
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (active?.hid) {
        const {data, error} = await fetchNearby(active?.hid, 300);
        setLocations(data);
      }
    }
    fetchData();

    return () => {
      console.log('nearby clean');
    };
  }, [active?.hid]);

  useEffect(() => {
    const updateMarkers = () => {
      if (locations?.me?.length > 0) {
          setCenter([locations?.me[0]?.lat, locations.me[0]?.lng, locations.me[0]]);

      }
      if (locations?.others?.length > 0) {
        locations?.others.forEach((location, index) => {
          _markers.push([location.lat, location.lng, location]);

          setMarkers(_markers);
        });
      }
    };
    updateMarkers();
    return () => {
      console.log('unmounting');
    };
  }, [locations?.others?.length, locations?.me?.length, locations]);


const showInfo = (event) => {
  setShow(true);

}

  return (
      <>

       <Modal show={show &&  selected!==null} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{
            selected?.name
}
</Modal.Title>
        </Modal.Header>
        <Modal.Body>


<strong>distance: </strong>{ selected?.distance.toFixed(2)} m<br/>
<strong>status: </strong>{ selected?.status?.online}<br/>
<strong>elevation: </strong>{ selected?.elevation.toFixed(0)} m<br/>
<strong>gain: </strong>{ (selected?.gain/10)} dBi<br/>
<strong>scale: </strong>{ selected?.reward_scale.toFixed(2)}<br/>
<strong>added: </strong>{ selected?.timestamp_added.substr(0,10)}<br/>




        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>

{  center.length > 0 &&    <Map height={800} defaultCenter={center} defaultZoom={17}>
<Marker onClick={()=>handleShow(center)}   key="map=me" width={30} anchor={center}  color="blue"/>
    { markers.map((m,i)=> m[2].status.online === 'online'? <Marker onClick={()=>handleShow(m)}  key={`map-${i}`} width={30} anchor={[m[0], m[1]]} color="green" caption="ddddd" />:<Marker onClick={()=>handleShow(m)}  key={`map-${i}`} width={30} anchor={[m[0], m[1]]} color="red" caption="ddddd" />  )}
    </Map>}
    </>
  );
}
