import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getAnalytics, logEvent} from 'firebase/analytics';
import firebase from 'firebase/compat/app';
import publicIp from 'public-ip';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously} from 'firebase/auth';
import faker from 'faker';
import firebaseConfig from '../services/config'; // import firebase config


// Initialize Firebase
export const app = firebase.initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);

export const analyticsLog = (eventName, params) => {
  logEvent(analytics, eventName, params);
};

export const db = app.firestore();

// Initialize Firebase

export const auth = firebase.auth();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({prompt: 'select_account'});

// export const signInWithGoogle = () => auth.signInWithPopup(provider);

const googleProvider = new firebase.auth.GoogleAuthProvider();

export const signInGuest = async () => {
  const {user} = await signInAnonymously(auth);

  const ip = await getIp();
  const query = await db.collection('users').where('uid', '==', user.uid).get();
  if (query.docs.length === 0) {
    await db.collection('users').add({
      uid: user.uid,
      name: faker.name.findName(),
      authProvider: 'guest',
      email: faker.internet.email(),
      ip: ip,
      lastLogin: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    });
  } else {
    const doc = query.docs[0];
    await doc.ref.update({
      ip: ip,
      lastLogin: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
    });
  }
  return user;
};

export const signUpWithEmail = async (name, email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const ip = await getIp();
    const query = await db.collection('users').where('uid', '==', user.uid).get();
    if (query.docs.length === 0) {
      await db.collection('users').add({
        uid: user.uid,
        name: name,
        authProvider: 'email',
        email: user.email,
        ip: ip,
        lastLogin: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      });
    } else {
      const doc = query.docs[0];
      await doc.ref.update({
        ip: ip,
        lastLogin: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      });
    }
    return user;
  } catch (error) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return {
          status: 'error',
          code: error.code,
          message: 'Email already in use'
        };

      default:
        return {
          status: 'error',
          code: error.code,
          message: error.message
        };
    }
  }
};
export const sendPasswordResetEmail = async (email) => {
  try {
    await auth.sendPasswordResetEmail(email);
  } catch (err) {
    console.error(err);
  }
};

export const signWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const ip = await getIp();

    const query = await db.collection('users').where('uid', '==', user.uid).get();
    if (query.docs.length === 0) {
      return null;
    } else {
      const doc = query.docs[0];
      await doc.ref.update({
        ip: ip,
        lastLogin: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      });
    }
    return user;
  } catch (error) {
    switch (error.code) {
      case 'auth/user-not-found':
        return {
          status: 'error',
          code: error.code,
          message: 'User not found'
        };
      case 'auth/wrong-password':
        return {
          status: 'error',
          code: error.code,
          message: 'Wrong password'
        };
      default:
        return {
          status: 'error',
          code: error.code,
          message: error.message
        };
    }
  }
};

export const signInWithGoogle = async () => {
  try {
    const res = await auth.signInWithPopup(googleProvider);
    const user = res.user;
    const ip = await getIp();

    const query = await db.collection('users').where('uid', '==', user.uid).get();
    if (query.docs.length === 0) {
      await db.collection('users').add({
        uid: user.uid,
        name: user.displayName,
        authProvider: 'google',
        email: user.email,
        ip: ip,
        lastLogin: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      });
    } else {
      const doc = query.docs[0];
      await doc.ref.update({
        ip: ip,
        lastLogin: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
      });
    }
  } catch (err) {
    console.error(err);
  }
};
export const getIp = async () => {
  const res = await fetch('https://api.ipify.org?format=json');
  const data = await res.json();
  return data.ip;
};

export const getAddress = async () => {
  const res = await fetch('https://ipapi.co/json/');
  const data = await res.json();
  return {
    country: data.country_name,
    city: data.city,
    postal: data.postal,
    latitude: data.latitude,
    longitude: data.longitude
  };
};

export const rateApp = async (uid, rate) => {
  try {
    const query = await db.collection('users').where('uid', '==', uid).limit(1).get();
    if (query.docs.length > 0) {
      const thing = query.docs[0];
      let tmp = thing.data();
      tmp.rated = true;
      tmp.rate = rate;

      await thing.ref.update(tmp);
      return tmp;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};
export const updateUser = async (uid) => {
  try {
    const query = await db.collection('users').where('uid', '==', uid).limit(1).get();
    if (query.docs.length > 0) {
      const thing = query.docs[0];
      let tmp = thing.data();
      try {
        const _ip = await publicIp.v4();
        tmp.ip = _ip;
      } catch (error) {
        tmp.ip = 'Unknown';
      }
      tmp.lastLogin = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

      try {
        const data = await getAddress();
        tmp.country = data?.country;
        tmp.city = data?.city;
        tmp.postal = data?.postal;
        tmp.latitude = data?.latitude;
        tmp.longitude = data?.longitude;
      } catch (error) {
        tmp.country = 'Unknown';
        tmp.city = 'Unknown';
        tmp.postal = 'Unknown';
        tmp.latitude = 'Unknown';
        tmp.longitude = 'Unknown';
      }
      if (tmp.visits >= 0) {
        tmp.visits += 1;
      } else {
        tmp.visits = 1;
      }

      tmp.version = '1.0.2';
      await thing.ref.update(tmp);
      return tmp;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const setMiners = async (uid, hids) => {
  try {
    const query = await db.collection('users').where('uid', '==', uid).limit(1).get();

    const thing = query.docs[0];
    let tmp = thing.data();
    tmp.hids = hids;
    await thing.ref.update(tmp);
  } catch (err) {
    console.error(err);
  }
};

export const getMiners = async (uid) => {
  try {
    const query = await db.collection('users').where('uid', '==', uid).limit(1).get();
    if (query.docs.length !== 0) {
      const thing = query.docs[0];
      let tmp = thing.data();
      return tmp.hids;
    } else {
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const removeMiner = async (uid, address) => {
  try {
    const query = await db.collection('users').where('uid', '==', uid).limit(1).get();

    const thing = query.docs[0];
    let tmp = thing.data();
    tmp.hids = tmp.hids.filter((h) => h.address !== address);
    await thing.ref.update(tmp);
  } catch (err) {
    console.error(err);
  }
};

export const setCurrency = async (uid, currency) => {
  try {
    const query = await db.collection('users').where('uid', '==', uid).limit(1).get();

    const thing = query.docs[0];
    let tmp = thing.data();
    tmp.currency = currency;
    await thing.ref.update(tmp);
  } catch (err) {
    console.error(err);
  }
};

export const setSelectedMiner = async (uid, miner) => {
  try {
    const query = await db.collection('users').where('uid', '==', uid).limit(1).get();

    const thing = query.docs[0];
    let tmp = thing.data();
    tmp.selectedMiner = miner;
    await thing.ref.update(tmp);
  } catch (err) {
    console.error(err);
  }
};

export const getSelectedMiner = async (uid) => {
  try {
    const query = await db.collection('users').where('uid', '==', uid).limit(1).get();
    if (query.docs.length !== 0) {
      const thing = query.docs[0];
      let tmp = thing.data();
      return tmp.selectedMiner;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getCurrency = async (uid) => {
  try {
    const query = await db.collection('users').where('uid', '==', uid).limit(1).get();
    if (query.docs.length !== 0) {
      const thing = query.docs[0];
      let tmp = thing.data();
      return tmp.currency;
    } else {
      return 'usd';
    }
  } catch (err) {
    console.error(err);
    return 'usd';
  }
};

export const signOutWithGoogle = () => auth.signOut();

export default firebase;
