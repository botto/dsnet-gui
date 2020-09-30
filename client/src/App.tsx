import React from 'react';
import { Colors } from '@blueprintjs/core';

// Keep this loading order, otherwise blueprint css overides custom styles in our own comps.
import 'normalize.css/normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';

import './base.css';

// Load custom comps after blueprint css.
import Overview from './components/Overview';
import styles from './styles.module.sass';

const App = () => (
  <div className={styles.App} style={{ background: Colors.DARK_GRAY3}}>
    <div className={ `${styles.Container} bp3-dark`}>
      <Overview />
    </div>
  </div>
);

export default App;
