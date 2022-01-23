import React, {useState, useEffect, Fragment} from 'react';
import {Container, Table, Row, Col} from 'react-bootstrap';
import {fetchData, getStatus} from '../utils/api.js';
import {useNavigate, Navigate} from 'react-router-dom';
import {BoxLoading} from 'react-loadingg';
import RewardsCard from '../components/RewardsCard';
import RewardsChart from '../components/RewardsChart';

import {getCurrency, getSelectedMiner} from '../services/firebase';
import {useContext} from 'react';
import {AuthContext} from '../providers/AuthProvider';
import Rating from '../components/Rating';
import MinerSelector from '../components/MinerSelector';
export default function MinerDashboard() {
  const {user, account, later, refresh, setActive} = useContext(AuthContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dependincy, setDependincy] = useState({currency: 'usd', miner: null});
  const [error, setError] = useState(null);

  const [status, setStatus] = useState({});

  const [data, setData] = useState({
    currencies: {},
    currency_list: 0,
    witnesses: 0,
    hotspot: {},
    recent_rewards: [],
    today: {},
    week: {},
    month: {},
    all: {}
  });

  useEffect(() => {
    async function getDependencies() {
      let _status = await getStatus();
      setStatus(_status);

      let _selectdMiner = await getSelectedMiner(user.uid);
      if (!_selectdMiner) {
        navigate('/settings');
      }
      let _currency = await getCurrency(user.uid);
      setActive({hid: _selectdMiner?.address, name: _selectdMiner?.name});
      setDependincy({currency: _currency || 'usd', miner: _selectdMiner});
    }

    getDependencies();

    return () => {
      console.log('cleaup hids');
    };
  }, [navigate, user.uid, refresh]);

  useEffect(() => {
    async function fetchMyAPI(_hid) {
      setLoading(true);
      let response = await fetchData(_hid);
      if (!response.error) {
        setData(response);
      } else {
        setError(response.error);
        setLoading(false);
      }
    }

    fetchMyAPI(dependincy.miner?.address);

    return () => {
      console.log('cleaup response');
    };
  }, [dependincy, refresh]);

  useEffect(() => {
    if (data.timestamp) {
      setLoading(false);
    }
    return () => {
      console.log('cleaup data');
    };
  }, [data.timestamp]);

  return (
    <>
      {user !== null ? (
        account?.visits > 30 && !account?.rated && later ? (
          <Rating />
        ) : loading ? (
          <BoxLoading />
        ) : (
          <>
            {error && (
              <div className="alert alert-danger m-5" role="alert">
                {' '}
                {error}{' '}
              </div>
            )}
            {!error && (
              <Container>
                <Row className="mt-3">
                  <h2>
                    <span className="title">
                      Welcome <MinerSelector />
                      {/* <strong className="hnt-name">
                        <a target="_blank" href={`https://explorer.helium.com/hotspots/${dependincy.miner.address}`} rel="noreferrer">
                          {dependincy.miner.name}
                        </a>
                      </strong> */}
                    </span>
                  </h2>
                  <span className="cad infoc ">
                    <strong>price: </strong> {data?.currencies[dependincy.currency]} {dependincy.currency}
                  </span>
                  <span className="today  infoc">
                    <strong>date: </strong>
                    {data?.today?.date}
                  </span>
                  {data?.hotspot?.data?.status?.online === 'online' ? (
                    <span className="status-on  infoc">
                      <strong>hotspot status: </strong>
                      {data?.hotspot?.data?.status?.online}
                    </span>
                  ) : (
                    <span className="status-off  infoc">
                      <strong>hotspot status: </strong>
                      {data?.hotspot?.data?.status?.online}
                    </span>
                  )}
                  <span className="cad  infoc">
                    <strong>witnesses: </strong>
                    {data?.witnesses}
                  </span>
                  <span className="scale  infoc">
                    <strong>hotspot scale: </strong>
                    {(data?.hotspot?.data?.reward_scale || 0).toFixed(2)}
                  </span>
                  {status?.status?.indicator === 'none' ? (
                    <span className="status-on  infoc">
                      <strong>helium status: </strong>
                      {status?.status?.description}
                    </span>
                  ) : (
                    <span className="status-off  infoc">
                      <strong>helium status: </strong>
                      {status?.status?.description}
                    </span>
                  )}
                </Row>
                <Row className="mt-3">
                  <Col>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                        <th></th>
                          <th>Recent</th>
                          <th>Last Day</th>
                          <th>Last Week</th>
                          <th>Last Month</th>
                          <th>All</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                                                  <td>hnt</td>

                          <td>{data?.recent_rewards.toFixed(2)}</td>
                          <td>{data?.today?.total.toFixed(2)}</td>
                          <td>{data?.week?.total.toFixed(2)}</td>
                          <td>{data?.month?.total.toFixed(2)}</td>
                          <td>{data?.all?.total.toFixed(2)}</td>
                        </tr>
                        <tr>
                        <td>{dependincy.currency.toUpperCase()}</td>
                          <td>{(data?.recent_rewards * data?.currencies[dependincy.currency]).toFixed(2)}</td>
                          <td>{(data?.today?.rewards * data?.currencies[dependincy.currency]).toFixed(2)}</td>
                          <td>{(data?.week?.rewards * data?.currencies[dependincy.currency]).toFixed(2)}</td>
                          <td>{(data?.month?.rewards * data?.currencies[dependincy.currency]).toFixed(2)}</td>
                          <td>{(data?.all?.rewards * data?.currencies[dependincy.currency]).toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Col>
                </Row>

                {/* <Row className="text-center">
                  <p> if you see this app useful please consider sharing it with your friends or family, sharing is caring ;)</p>
                  <Col lg={3} md={6} xs={6} className="mt-3">
                    <RewardsCard
                      title="Recent"
                      hnt={data?.recent_rewards.toFixed(3)}
                      rewards={(data?.recent_rewards * data?.currencies[dependincy.currency]).toFixed(3)}
                      currency={dependincy.currency.toUpperCase()}
                    />
                  </Col>
                  <Col lg={3} md={6} xs={6} className="mt-3">
                    <RewardsCard
                      title="Today"
                      hnt={data?.today?.total}
                      rewards={(data?.today?.rewards * data?.currencies[dependincy.currency]).toFixed(3)}
                      currency={dependincy.currency.toUpperCase()}
                    />
                  </Col>
                  <Col lg={3} md={6} xs={6} className="mt-3">
                    <RewardsCard
                      title="Week"
                      hnt={data?.week?.total}
                      rewards={(data?.week?.rewards * data?.currencies[dependincy.currency]).toFixed(3)}
                      currency={dependincy.currency.toUpperCase()}
                    />
                  </Col>
                  <Col lg={3} md={6} xs={6} className="mt-3">
                    <RewardsCard
                      title="Month"
                      hnt={data?.month?.total}
                      rewards={(data?.month?.rewards * data?.currencies[dependincy.currency]).toFixed(3)}
                      currency={dependincy.currency.toUpperCase()}
                    />
                  </Col>
                  <Col lg={3} md={6} xs={6} className="mt-3">
                    <RewardsCard
                      title="All"
                      hnt={data?.all?.total}
                      rewards={(data?.all?.rewards * data?.currencies[dependincy.currency]).toFixed(3)}
                      currency={dependincy.currency.toUpperCase()}
                    />
                  </Col>
                </Row> */}
                <Row className="mt-3">
                  <Col>
                    <RewardsChart
                      title="Recent Rewards"
                      data={data?.today.last_day}
                      range="reward"
                      price={data?.currencies[dependincy.currency]}
                      currency={dependincy.currency}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <RewardsChart
                      title="Last 24 hours"
                      data={data?.today.hnt_24}
                      range="hour"
                      price={data?.currencies[dependincy.currency]}
                      currency={dependincy.currency}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <RewardsChart
                      title="Last Week"
                      data={data?.today.hnt_7day}
                      range="day"
                      price={data?.currencies[dependincy.currency]}
                      currency={dependincy.currency}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <RewardsChart
                      title="Last Month"
                      data={data?.today.hnt_30day}
                      range="day"
                      price={data?.currencies[dependincy.currency]}
                      currency={dependincy.currency}
                    />
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col>
                    <RewardsChart
                      title="All"
                      data={data?.today.hnt_365day}
                      range="week"
                      price={data?.currencies[dependincy.currency]}
                      currency={dependincy.currency}
                    />
                  </Col>
                </Row>
              </Container>
            )}
          </>
        )
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
}
