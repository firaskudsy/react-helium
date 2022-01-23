let rewardsCache = {};
const colors = ['#94D0CC', '#EEC4C4', '#D5DBB3', '#FBC7F7', '#0C4271', '#5B6D5B', '#301B3F', '#4E3620'];

const expiry = 60 * 60 * 0.1; // 10 minutes

const isRewardsCacheExpired = (hid) => {
  const now = new Date().getTime();
  const lastFetch = rewardsCache[hid]?.lastFetch || 0;
  return now - lastFetch > expiry * 1000;
};

export const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

export const getHid = async (name) => {
  const helium_hotspot = `https://api.helium.io/v1/hotspots/name?search=${name}`;

  const hid_rsp = await fetch(helium_hotspot);
  const hid = await hid_rsp.json();
  return hid.data;
};
export const getHntCurrencies = async () => {
  const coin_geco = 'https://api.coingecko.com/api/v3/coins/helium';
  const cur = await fetch(coin_geco);
  const currency_list = await cur.json();
  const currency_price = currency_list.market_data.current_price;
  return currency_price;
};

export const getStatus = async () => {
  const status_rsp = await fetch('https://status.helium.com/api/v2/status.json');
  const status = await status_rsp.json();
  return status;
};

export const fetchNearby = async (hid, distance) => {
  if (hid) {
    const miner = await customFetch(`https://api.helium.io/v1/hotspots/${hid}`);
    if (!miner.error) {
      const {lat, lng, address, name} = miner.data.data;
      const nearby = await customFetch(`https://api.helium.io/v1/hotspots/location/distance?lat=${lat}&lon=${lng}&distance=${distance}`);
      const _n = Object.values(nearby.data.data).map(
        ({lat, lng, address, name, distance, elevation, geocode, status, timestamp_added, gain, reward_scale}) => ({
          lat,
          lng,
          address,
          name,
          distance,
          elevation,
          geocode,
          status,
          timestamp_added,
          gain,
          reward_scale
        })
      );
      const _me = _n.filter((x) => Math.floor( x.distance) === 0);
      const _others = _n.filter((x) => Math.floor( x.distance) !== 0);

      return {data: {me: _me, others: _others}, error: null};
    } else {
      return {data: null, error: null};
    }
  } else {
    return {data: null, error: null};
  }
};

export const customFetch = async (url) => {
  try {
    const resp = await fetch(url);
    const data = await resp.json();

    return {data, error: null};
  } catch (error) {
    return {data: null, error: error.message};
  }
};

export const getCurrencies = async () => {
  const coin_geco = 'https://api.coingecko.com/api/v3/coins/helium';
  const cur = await fetch(coin_geco);
  const currency = await cur.json();
  const currency_list = Object.keys(currency.market_data.current_price);

  return currency_list;
};

export const fetchCompare = async (hids, names) => {
  try {
    const promises = hids?.map((hid) => fetchData(hid));
    const responses = await Promise.all(promises);
    const data = {
      error: null,
      recent: {
        options: {
          //  responsive: true,
          maintainAspectRatio: false
        },
        labels: responses[0].today.last_day.labels, // ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: responses.map((x, i) => {
          const resp = x.today.last_day.datasets[0];
          resp.label = names[i];
          resp.backgroundColor = colors[i];
          resp.borderColor = colors[i];

          resp.pointHoverBorderColor = colors[i];

          return resp;
        })
      },
      today: {
        options: {
          //  responsive: true,
          maintainAspectRatio: false
        },
        labels: responses[0].today.hnt_24.labels, // ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: responses.map((x, i) => {
          const resp = x.today.hnt_24.datasets[0];
          resp.label = names[i];
          resp.backgroundColor = colors[i];
          resp.borderColor = colors[i];

          resp.pointHoverBorderColor = colors[i];

          return resp;
        })
      },
      week: {
        options: {
          //  responsive: true,
          maintainAspectRatio: false
        },
        labels: responses[0].today.hnt_7day.labels, // ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: responses.map((x, i) => {
          const resp = x.today.hnt_7day.datasets[0];
          resp.label = names[i];
          resp.backgroundColor = colors[i];
          resp.borderColor = colors[i];

          resp.pointHoverBorderColor = colors[i];

          return resp;
        })
      },
      month: {
        options: {
          //  responsive: true,
          maintainAspectRatio: false
        },
        labels: responses[0].today.hnt_30day.labels, // ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: responses.map((x, i) => {
          const resp = x.today.hnt_30day.datasets[0];
          resp.label = names[i];
          resp.backgroundColor = colors[i];
          resp.borderColor = colors[i];

          resp.pointHoverBorderColor = colors[i];

          return resp;
        })
      }
    };
    return data;
  } catch (error) {
    return {
      error: 'Error fetching data, this could be a network issue or the API is down, also check a browser extesnsion blocking the API',
      recent: {},
      today: {},
      week: {},
      month: {}
    };
  }
};

export const fetchData = async (hid = '') => {
  if (hid) {
    try {
      if (isRewardsCacheExpired(hid)) {
        const now = new Date();
        let _next = new Date();
        let lastDay = new Date();
        _next.setDate(now.getDate() + 1);
        lastDay.setDate(now.getDate() - 1);

        const _year = (d) => d.getFullYear().toString();
        const _month = (d) => (d.getMonth() + 1).toString().padStart(2, '0');
        const _day = (d) => d.getDate().toString().padStart(2, '0');
        const cursor = await customFetch(
          `https://api.helium.io/v1/hotspots/${hid}/rewards?max_time=now&min_time=${_year(lastDay)}-${_month(lastDay)}-${_day(lastDay)}T00:00:00.000000Z`
        );
        const _pre_day = cursor.data.data;
        const _cursor = cursor.data.cursor;

        const helium_hotspot = `https://api.helium.io/v1/hotspots/${hid}`;

        const hotspot = await fetch(helium_hotspot);
        const my_hotspot = await hotspot.json();

        const last_day = `https://api.helium.io/v1/hotspots/${hid}/rewards?max_time=now&min_time=${_year(lastDay)}-${_month(lastDay)}-${_day(lastDay)}T00:00:00.000000Z&cursor=${_cursor}`;

        const witnesses = `https://helium-api.stakejoy.com/v1/hotspots/${hid}/witnesses`;
        const helium_url_all = `https://api.helium.io/v1/hotspots/${hid}/rewards/sum?max_time=now&min_time=${my_hotspot.data.timestamp_added}&bucket=week`;

        const helium_total = `https://api.helium.io/v1/hotspots/${hid}/rewards/sum?max_time=now&min_time=${my_hotspot.data.timestamp_added}`;

        const helium_url_24h = `https://api.helium.io/v1/hotspots/${hid}/rewards/sum?min_time=-24 hour&max_time=now&bucket=hour`;
        const helium_url_30day = `https://api.helium.io/v1/hotspots/${hid}/rewards/sum?min_time=-30 day&max_time=now&bucket=day`;
        const helium_url_7day = `https://api.helium.io/v1/hotspots/${hid}/rewards/sum?min_time=-7 day&max_time=now&bucket=day`;

        let [hnt_all, hnt_24h, hnt_30day, hnt_7day, hnt_total, hnt_last_day, hnt_witnesses] = await Promise.all([
          fetch(helium_url_all),
          fetch(helium_url_24h),
          fetch(helium_url_30day),
          fetch(helium_url_7day),
          fetch(helium_total),
          fetch(last_day),
          fetch(witnesses)
        ]);

        let [rewards_all, rewards_24h, rewards_30day, rewards_7day, total_rewards, rewards_last_day, my_witnesses] = await Promise.all([
          hnt_all.json(),
          hnt_24h.json(),
          hnt_30day.json(),
          hnt_7day.json(),
          hnt_total.json(),
          hnt_last_day.json(),
          hnt_witnesses.json()
        ]);

        const _total_today = rewards_24h.data?.reduce(function (sum, current) {
          return sum + current.total;
        }, 0);

        const _total_week = rewards_7day.data?.reduce(function (sum, current) {
          return sum + current.total;
        }, 0);

        const _total_month = rewards_30day.data?.reduce(function (sum, current) {
          return sum + current.total;
        }, 0);

        const _total_all = total_rewards?.data?.total;

        const currencies = await getHntCurrencies();
        const currency_list = Object.keys(currencies);
        const _pre_day_data = [..._pre_day, ...rewards_last_day.data].filter(c=>(new Date(c.timestamp)>=lastDay));

        const _temp = {
          timestamp: new Date().getTime(),
          error: null,
          currencies,
          witnesses:my_witnesses.data.length,
          currency_list: currency_list,
          hotspot: my_hotspot,
          recent_rewards:((_pre_day_data[0]?.amount || 0) / 100000000),
          today: {
            total: Number(_total_today.toFixed(3)),
            rewards: _total_today,
            date: `${_year(now)}-${_month(now)}-${_day(now)}`,
            last_day: {
              labels: _pre_day_data?.reverse().map((x) => new Date(x.timestamp).toLocaleTimeString()), // ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'HNT Recent rewards',
                  fill: false,
                  lineTension: 0.2,
                  cubicInterpolationMode: 'monotone',
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderCapStyle: 'round',
                  borderDash: [],
                  borderDashOffset: 0.7,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'green',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 3,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'red',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: _pre_day_data.map((x) => x.amount / 100000000)
                }
              ]
            },
            hnt_24: {
              labels: rewards_24h?.data?.reverse().map((x) => new Date(x.timestamp).toLocaleTimeString()), // ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'HNT Day',
                  fill: false,
                  lineTension: 0.2,
                  cubicInterpolationMode: 'monotone',
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderCapStyle: 'round',
                  borderDash: [],
                  borderDashOffset: 0.7,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'green',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 3,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'red',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: rewards_24h.data.map((x) => x.total)
                }
              ]
            },
            hnt_30day: {
              labels: rewards_30day?.data?.reverse().map((x) => x.timestamp.substr(0, 10)), // ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'HNT Month',
                  fill: false,
                  lineTension: 0.2,
                  cubicInterpolationMode: 'monotone',
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderCapStyle: 'round',
                  borderDash: [],
                  borderDashOffset: 0.7,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'green',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 3,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'red',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: rewards_30day.data.map((x) => x.total)
                }
              ]
            },
            hnt_7day: {
              labels: rewards_7day?.data?.reverse().map((x) => x.timestamp.substr(0, 10)), // ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'HNT Week',
                  fill: false,
                  lineTension: 0.2,
                  cubicInterpolationMode: 'monotone',
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderCapStyle: 'round',
                  borderDash: [],
                  borderDashOffset: 0.7,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'green',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 3,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'red',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: rewards_7day.data.map((x) => x.total)
                }
              ]
            },
            hnt_365day: {
              labels: rewards_all?.data?.reverse().map((x) => x.timestamp.substr(0, 10)), // ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'HNT All',
                  fill: false,
                  lineTension: 0.2,
                  cubicInterpolationMode: 'monotone',
                  backgroundColor: 'rgba(75,192,192,0.4)',
                  borderColor: 'rgba(75,192,192,1)',
                  borderCapStyle: 'round',
                  borderDash: [],
                  borderDashOffset: 0.7,
                  borderJoinStyle: 'miter',
                  pointBorderColor: 'green',
                  pointBackgroundColor: '#fff',
                  pointBorderWidth: 3,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: 'red',
                  pointHoverBorderColor: 'rgba(220,220,220,1)',
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: rewards_all.data.map((x) => x.total)
                }
              ]
            }
          },
          week: {
            total: Number(_total_week.toFixed(3)),
            rewards: _total_week
          },
          month: {
            total: Number(_total_month.toFixed(3)),
            rewards: _total_month
          },
          all: {
            total: Number(_total_all.toFixed(3)),
            rewards: _total_all
          }
        };

        rewardsCache[hid] = {};

        rewardsCache[hid].lastFetch = new Date().getTime();

        rewardsCache[hid].data = _temp;

        return rewardsCache[hid].data;
      } else {
        rewardsCache[hid].data.timestamp = new Date().getTime();
        rewardsCache[hid].data.currencies = await getHntCurrencies();
        ['last_day', 'hnt_24', 'hnt_30day', 'hnt_7day', 'hnt_365day'].forEach(async (x) => {
        rewardsCache[hid].data.today[x].datasets[0].backgroundColor = colors[0]
        rewardsCache[hid].data.today[x].datasets[0].borderColor = colors[0]
        rewardsCache[hid].data.today[x].datasets[0].pointHoverBorderColor = colors[0]
        })

        const cached = rewardsCache[hid].data;
        if (cached) {
          return cached;
        }
      }
    } catch (error) {
      return {
        timestamp: new Date().getTime(),
recent_rewards:0,
witnesses:0,
        error: 'Error fetching data, this could be a network issue or the API is down, also check a browser extesnsion blocking the API',
        currencies: {},
        currency_list: [],
        hotspot: {},
        today: {},
        week: {},
        month: {},
        all: {}
      };
    }
  } else {
    return {
      timestamp: null,
recent_rewards:0,
witnesses:0,
      error: null,
      currencies: {},
      currency_list: [],
      hotspot: {},
      today: {},
      week: {},
      month: {},
      all: {}
    };
  }
};
