import React from 'react';
import {Card} from 'react-bootstrap';
import {Chart, Line} from 'react-chartjs-2';
import {useMediaQuery} from 'react-responsive';
import {average} from '../utils/api';

export default function RewardsChart({title, data, range = '', price = 0, currency = '$', name=''}) {
  const isMobile = useMediaQuery({query: `(max-width: 760px)`});

  const barChartOptions = {
    options: {
      tooltips: {
        yAlign: 'bottom'
      }
    }
  };

  return (
    <Card>
      <Card.Header className="text-center">
        {title}
        {range !== '' && (
          <span>
            <strong> Avg:</strong>({average(data?.datasets[0]?.data).toFixed(3)}<strong>hnt</strong>    {price !== 0 && (
        <span>{(price * average(data?.datasets[0]?.data)).toFixed(3)}<strong>{currency}</strong></span>
        )} /{range})
          </span>
        )}

      </Card.Header>
      <Card.Body className="text-center">
        <Line
          data={data}
          width={1000}
          height={isMobile ? 800 : 300}
          options={{
            plugins: {
              // legend: {
              //   display: false,
              //   position: 'right'
              // },
              tooltip: {
                yAlign: 'bottom',
                xAlign: 'center',
                fontSize: 12,
                backgroundColor: '#b6dbdb',
                bodyColor: '#444444',
                titleColor: '#444444',
                borderColor: '#444444',
displayColors:false,

                callbacks: {
       label: function(context) {

                        return `${name} \r\n ${context.raw.toFixed(3)} hnt = ${(context.raw*price).toFixed(3)} ${currency} / ${range}` ;
                    }
                }
              },
              // title: {
              //   display: true,
              //   text: title,
              //   padding: {
              //     top: 10,
              //     bottom: 30
              //   }
              // }
            }
          }}
        />
      </Card.Body>
    </Card>
  );
}
