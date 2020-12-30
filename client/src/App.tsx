import React from 'react';
import { Colors } from '@blueprintjs/core';

import './base.css';

// Load custom comps after blueprint css.
import Overview from './components/Overview';
import styles from './styles.module.sass';

const App = () => (
  <div className={styles.App} style={{ background: Colors.DARK_GRAY3}}>
    <div className={ `${styles.Container}`}>
      <Overview />
    </div>
  </div>
);

export default App;
