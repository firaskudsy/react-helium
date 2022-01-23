import React from 'react';
import {useEffect} from 'react';
import {getMiners, analyticsLog} from '../services/firebase';
import {useContext} from 'react';
import {AuthContext} from '../providers/AuthProvider';
import {fetchCompare} from '../utils/api.js';
import {Container, Row, Col} from 'react-bootstrap';
import RewardsChart from '../components/RewardsChart';
import {BoxLoading} from 'react-loadingg';
import {useState} from 'react';
import {useNavigate, Navigate} from 'react-router-dom';

export default function Compare() {
  const {user, refresh} = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [dependincy, setDependincy] = useState({miners: [], names: []});
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
        recent: {
      labels: [],
      datasets: [],
      options: {}
    },
    today: {
      labels: [],
      datasets: [],
      options: {}
    },
    week: {
      labels: [],
      datasets: [],
      options: {}
    },
    month: {
      labels: [],
      datasets: [],
      options: {}
    }
  });

  useEffect(() => {
    document.title = 'Compare';

    analyticsLog('Compare');

    const fetchData = async (uid) => {
      setLoading(true);
      const _miners = await getMiners(uid);
      const _hids = _miners?.map((m) => m.address);
      const _names = _miners?.map((m) => m.name);

      setDependincy({miners: _hids, names: _names});
      // setMiners(_hids)
      // setNames(_names);
    };
    if (user.uid) {
      fetchData(user.uid);
    }

    return () => {
      console.log('cleaup hids');
    };
  }, [user.uid, refresh]);

  useEffect(() => {
    const fetchData = async (_miners, _names) => {
      const _data = await fetchCompare(_miners, _names);
      if (!_data.error) {
        setData(_data);
        setLoading(false);
      } else {
        setError(_data.error);
        setLoading(false);
      }
    };
    if (dependincy?.miners?.length > 0 && dependincy?.names?.length > 0) {
      fetchData(dependincy?.miners, dependincy?.names);
    }
    return () => {
      console.log('cleaup hids');
    };
  }, [dependincy, refresh]);

  return (
    <>
      {user !== null ? (
        <Container>
          {loading && <BoxLoading />}

          {error && (
            <div className="alert alert-danger m-5" role="alert">
              {' '}
              {error}{' '}
            </div>
          )}
          {!error && !loading && (
            <>
                  <Row className="mt-3">
                <Col>
                  <RewardsChart title="Recent Rewards" data={data?.recent}  />
                </Col>
              </Row>
              <Row className="mt-3">
                <Col>
                  <RewardsChart title="Last 24 hours" data={data?.today} />
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <RewardsChart title="Last Week" data={data?.week} />
                </Col>
              </Row>

              <Row className="mt-3">
                <Col>
                  <RewardsChart title="Last Month" data={data?.month} />
                </Col>
              </Row>
            </>
          )}
        </Container>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
}
