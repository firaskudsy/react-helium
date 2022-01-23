import React, {useEffect, useState} from 'react';
import {Dropdown} from 'react-bootstrap';
import {useContext} from 'react';
import {AuthContext} from '../providers/AuthProvider';
import {getMiners, setSelectedMiner, getSelectedMiner} from '../services/firebase';

export default function MinerSelector({hid}) {
  const {user, setRefresh} = useContext(AuthContext);

  const [localMiners, setLocalMiners] = useState([]);
    const [selectedLocalMiner, setSelectedLocalMiner] = useState(null);


  useEffect(() => {
    const getLocalMiners = async () => {
      const _miners = await getMiners(user?.uid);
      const _selectedMiner = await getSelectedMiner(user?.uid);
      setLocalMiners(_miners);
        setSelectedLocalMiner(_selectedMiner);

    };

    getLocalMiners();

    return () => {};
  }, [user?.uid]);

  return (
    <Dropdown className="miner-selector">
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        { selectedLocalMiner ? selectedLocalMiner.name : 'Select Miner'}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {localMiners.map((miner) => (
          <Dropdown.Item key={miner.address} onClick={() => {setSelectedMiner(user?.uid, miner);setRefresh(new Date().toISOString())}}>
            {miner.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
