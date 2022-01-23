import React, {useState, useEffect} from 'react';
import {getCurrencies, getHid} from '../utils/api.js';

import {Button, ListGroup, Modal, Card, Container, Row, Col} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {useNavigate} from 'react-router-dom';
import {useContext} from 'react';
import {AuthContext} from '../providers/AuthProvider';
import {signOutWithGoogle, getMiners, setMiners, setCurrency, getCurrency, setSelectedMiner, analyticsLog, getSelectedMiner} from '../services/firebase';

export default function Settings() {
  const {user} = useContext(AuthContext);

  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [hotspots, setHotspots] = useState([]);
  const [currency, setSettingCurrency] = useState('usd');
  const [currencies, setCurrencies] = useState([]);
  const [selectedMiner, setSettingSelectedMiner] = useState({});

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  const [miners, setSettingMiners] = useState([]);

  const updateHotspots = async (name) => {
    let _hid = await getHid(name);
    setHotspots(_hid);
  };

  const saveCurrency = async (_currency) => {
    await setCurrency(user.uid, _currency);
    setSettingCurrency(_currency.toLowerCase());
  };

  const selectMiner = async (miner) => {
    if (miner.block) {
      const _m = {
        name: miner.name,
        address: miner.address,
        wallet: miner.owner}

        miner = _m

    }

    await setSelectedMiner(user.uid, miner);
    setSettingSelectedMiner(miner);
    // analyticsLog('selectMiner', {miner: miner});
    navigate('/');
  };
  const saveMiner = async (miner) => {
    const _miners = [{name: miner.name, address: miner.address, wallet: miner.owner}, ...(miners ? miners : [])];
    await setMiners(user.uid, _miners);
    setSettingMiners(_miners);
    await selectMiner(miner);
    analyticsLog('miner_added', miner);
    handleClose();
  };

  const removeSettingMiner = async (address) => {
    let _miners = miners.filter((miner) => miner.address !== address);
    await setMiners(user.uid, _miners);
    setSettingMiners(_miners);
    if(_miners.length === 0) {
     await setSelectedMiner(user.uid,null);
    }
    analyticsLog('removeMiner', {address: address});
  };

  useEffect(() => {
    document.title = 'Settings';

    analyticsLog('Settings');
    async function getDependencies() {
      let _miners = await getMiners(user.uid);
      setSettingMiners(_miners);

      let _currency = await getCurrency(user.uid);
      let _selectedMiner = await getSelectedMiner(user.uid);
      if (_selectedMiner?.name) {
        setSelectedMiner(user.uid, _selectedMiner);
        setSettingSelectedMiner(_selectedMiner);
      } else {
        if (_miners?.length > 0) {
          setSelectedMiner(user.uid, _miners[0]);
          setSettingSelectedMiner(_miners[0]);
        }
      }
      setSettingCurrency(_currency);

      let _currencies = await getCurrencies();
      setCurrencies(_currencies);
    }

    getDependencies();

    return () => {
      console.log('cleaup hids');
    };
  }, [user.uid]);

  const signOut = async () => {
    signOutWithGoogle();

    navigate('/');
  };

  return (
    <Container>
          {!selectedMiner?.address && <div className="alert alert-warning m-5" role="alert">
          No Hotspot selected, please select one from the list, or add a new one to get started.
           </div>}


      <Row className="mt-3">
        <Col>
          <h5>
            Welcome <span className="curr">{user?.email || 'Guest!!'} 🙂</span>{' '}
          </h5>
        </Col>
      </Row>

      <Row className="mt-1">
        <Col className="mt-2" md={6}>
          <Card>
            <Card.Header className="text-center">Hotspots</Card.Header>
            <Card.Body className="text-center">
              <small className="description">
                make sure you <strong>add</strong> your hotspot to the list below, if you don't have one. <br />
                you can <strong>click</strong> on the hotspot name to select it as your default hotspot.
              </small>

              <ul className="float-left">
                {miners?.map((b) => (
                  <div
                    className="list-group-item d-flex align-items-center"
                    style={{backgroundColor: selectedMiner?.name === b.name ? 'rgb(237 255 255)' : '#fff'}}
                    key={b.address}
                  >
                    <span
                      className="action-i currency-selector"
                      onClick={() => {
                        selectMiner(b);
                      }}
                    >
                      {b.name}{' '}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        removeSettingMiner(b.address);
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                ))}
              </ul>
              <Button variant="outline-success" key="add-miner" onClick={handleShow}>
                Add New Hotspot
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col className="mt-2" md={6}>
          <Card>
            <Card.Header className="text-center">Currency {currency}</Card.Header>
            <Card.Body className="text-center">
              <small className="description">select your currency, this will be used to calculate your earnings.</small>
              <div className="input-group-addon currency-addon">
                <select className="form-control currency-selector" value={currency} onChange={(x) => saveCurrency(x.target.value)}>
                  {currencies?.map((_currency) => (
                    <option value={_currency} key={_currency} data-symbol={_currency}>
                      {_currency.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-5 pt-5 text-center">
        <Col>
          <h6>we are sorry to see you go :(</h6>
          {!user?.email && (
            <p>
              if you signed up as a <strong>Guest</strong> you will lose your settings and data when you sign out. <br />
              its is recommended to sign up as a <strong>User or with Gmail account</strong> to keep your settings and data.
            </p>
          )}
          <Button variant="outline-success" onClick={signOut}>
            {' '}
            Sign out{' '}
          </Button>
        </Col>
      </Row>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <h6>Add new hotspot</h6>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col>
              <label>Name</label>

              <input className="form-control" onChange={(e) => updateHotspots(e.target.value)} type="text" />
              <small className="description">start typing the name of your hotspot to get list of hotspots to choose from.</small>
            </Col>
          </Row>
          <Row className="mt-3">
            {hotspots?.length > 0 ? (
              <ListGroup className="search">
                {hotspots?.map((h, i) => (
                  <ListGroup.Item className="currency-selector" key={`${h.name}-${i}`} action onClick={() => saveMiner(h)}>
                    {h.name}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : null}
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
