import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import React, {useContext} from 'react';

import Menu from './components/Menu';
import Settings from './pages/Settings';
import Donate from './pages/Donate';
import MinerDashboard from './pages/MinerDashboard';
import Footer from './components/Footer';
import {AuthContext} from './providers/AuthProvider';
import ShareBar from './components/ShareBar';
import About from './pages/About';
import Compare from './pages/Compare';
import Geomap from './pages/Geomap';

import Landing from './components/Landing';
import {BoxLoading} from 'react-loadingg';

function App() {
  const {user, authenticating} = useContext(AuthContext);

  if (process.env.NODE_ENV === 'production') {
    console.log(`.%%..%%..%%%%%%..%%......%%%%%%..%%..%%..%%...%%.
.%%..%%..%%......%%........%%....%%..%%..%%%.%%%.
.%%%%%%..%%%%....%%........%%....%%..%%..%%.%.%%.
.%%..%%..%%......%%........%%....%%..%%..%%...%%.
.%%..%%..%%%%%%..%%%%%%..%%%%%%...%%%%...%%...%%.
.................................................
.%%%%%%...%%%%....%%%%...%%.......%%%%..
...%%....%%..%%..%%..%%..%%......%%.....
...%%....%%..%%..%%..%%..%%.......%%%%..
...%%....%%..%%..%%..%%..%%..........%%.
...%%.....%%%%....%%%%...%%%%%%...%%%%..
........................................         `);
    console.log = function no_console() {};
  }
  return (
    <>
      {authenticating ? (
        <BoxLoading />
      ) : user !== null ? (
        <>
          <Router>
            <div className="App">
              <Menu />
              <Routes>
                <Route path="/" exact element={<MinerDashboard />} />
                <Route path="/rewards" exact element={<MinerDashboard />} />
                <Route path="/settings" exact element={<Settings />} />
                <Route path="/compare" exact element={<Compare />} />
                <Route path="/donate" exact element={<Donate />} />
                <Route path="/nearby" exact element={<Geomap />} />

                <Route path="/about" exact element={<About />} />
              </Routes>
            </div>
          </Router>
          <Footer>
            <div style={{float: 'left'}}>
              <ShareBar />
            </div>
          </Footer>
        </>
      ) : (
        <Landing />
      )}
    </>
  );
}
export default App;
