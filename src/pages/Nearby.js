import React from 'react';
import {useGoogleMaps} from 'react-hook-google-maps';
import {useContext, useEffect} from 'react';
import {AuthContext} from '../providers/AuthProvider';
import { fetchNearby} from '../utils/api';
import {analyticsLog} from '../services/firebase';

export default function Nearby() {
  const {active} = useContext(AuthContext);
const [locations, setLocations] = React.useState([]);


  const {ref, map, google} = useGoogleMaps(
    // Use your own API key, you can get one from Google (https://console.cloud.google.com/google/maps-apis/overview)
    'AIzaSyDMdLtmSENG3lPh-qE4c38jenrFjzut44o',
    // NOTE: even if you change options later
    {
      center: {lat: 0, lng: 0},
      zoom: 17,

    }
  );

  useEffect(() => {
  document.title = 'Nearby';

    analyticsLog('Nearby');
        return () => {
      console.log('unmounting');
    }
  }, [])

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
    async function fetchData() {
      if (locations?.others?.length > 0 && locations?.me?.length > 0) {

  if (map) {

    var circle = new google.maps.Circle({
      strokeColor: '#b6dbdb',
      strokeOpacity: 0.4,
      strokeWeight: 2,
      fillColor: '#b6dbdb',
      fillOpacity: 0.25,
      map: map,
      radius: 300
    });

    var infowindow = new google.maps.InfoWindow();

    var marker, i;
        map.setCenter(new google.maps.LatLng(locations.me[0].lat, locations.me[0].lng));
      marker = new google.maps.Marker({
        icon: 'blue.png',
        position: new google.maps.LatLng(locations.me[0].lat, locations.me[0].lng),
        map: map
      });

        circle.bindTo('center', marker, 'position');

      google.maps.event.addListener(
        marker,
        'click',
        (function (marker, i) {
          return function () {
            infowindow.setContent(`<h3 style="color:green"><a target="_blank" href="https://explorer.helium.com/hotspots/${locations?.me[0]?.address}">${locations?.me[0]?.name} </a></h3>
            <h6>${locations?.me[0]?.address}</h6>
            <span class="map-span"><strong style="color:rgb(73, 73, 73);">added: </strong>${locations?.me[0]?.timestamp_added.substr(0,10)}</span>

            <span class="map-span"><strong style="color:rgb(73, 73, 73);">elevation: </strong>${locations?.me[0]?.elevation} m </span>
            <span class="map-span"><strong style="color:rgb(73, 73, 73);">distance: </strong>${locations?.me[0]?.distance.toFixed(2)} m </span>
            <span class="map-span"><strong style="color:rgb(73, 73, 73);">status: </strong>${locations?.me[0]?.status.online} </span>
             <span class="map-span"><strong style="color:rgb(73, 73, 73);">gain: </strong>${locations?.me[0]?.gain/10} dBi </span>
                          <span class="map-span"><strong style="color:rgb(73, 73, 73);">scale: </strong>${locations?.me[0]?.reward_scale.toFixed(2)} </span>


             `);
            infowindow.open(map, marker);
          };
        })(marker, i)
      );

    for (i = 0; i < locations?.others.length; i++) {

      marker = new google.maps.Marker({
        icon: locations?.others[i]?.distance ===0 ?'blue.png':(locations?.others[i]?.status.online==='online'?'green.png':'red.png'),
        position: new google.maps.LatLng(locations?.others[i]?.lat, locations?.others[i]?.lng),
        map: map
      });

var line= new google.maps.Polyline({
    path: [{lat:locations?.me[0].lat, lng:locations?.me[0].lng},{lat:locations?.others[i].lat, lng:locations?.others[i].lng}],
    geodesic: true,
    strokeColor: 'orange',
    strokeOpacity: 1.0,
    strokeWeight: 2
});

line.setMap(map);
      google.maps.event.addListener(
        marker,
        'click',
        (function (marker, i) {
          return function () {
            infowindow.setContent(`<h3 style="color:green"><a target="_blank" href="https://explorer.helium.com/hotspots/${locations?.others[i]?.address}">${locations?.others[i]?.name} </a></h3>
            <h6>${locations?.others[i]?.address}</h6>
            <span class="map-span"><strong style="color:rgb(73, 73, 73);">added: </strong>${locations?.others[i]?.timestamp_added.substr(0,10)}</span>

            <span class="map-span"><strong style="color:rgb(73, 73, 73);">elevation: </strong>${locations?.others[i]?.elevation} m </span>
            <span class="map-span"><strong style="color:rgb(73, 73, 73);">distance: </strong>${locations?.others[i]?.distance.toFixed(2)} m </span>
            <span class="map-span"><strong style="color:rgb(73, 73, 73);">status: </strong>${locations?.others[i]?.status.online} </span>
             <span class="map-span"><strong style="color:rgb(73, 73, 73);">gain: </strong>${locations?.others[i]?.gain/10} dBi </span>
                          <span class="map-span"><strong style="color:rgb(73, 73, 73);">scale: </strong>${locations?.others[i]?.reward_scale.toFixed(2)} </span>


             `);
            infowindow.open(map, marker);
          };
        })(marker, i)
      );
    }
  }
      }
    }
    fetchData();

    return () => {
      console.log('nearby clean');
    };
  }, [locations?.others?.length, locations?.me?.length]);





  return (
    <div>
     <div className="map-t">
        this map shows the nearby miners within 300m from the active miner, you can click on the marker to see more details about the miner and its status
              </div>
      <div ref={ref} className="gmap" />
    </div>
  );
}
