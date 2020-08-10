import React from 'react';
import 'normalize.css/normalize.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import { Colors } from "@blueprintjs/core";
import styles from './styles.module.css';
import Overview from './components/Overview';

const App = () => (
  <div className={styles.App} style={{ background: Colors.DARK_GRAY3}}>
    <div className={ `${styles.Container} bp3-dark`}>
      <Overview />
    </div>
  </div>
);

export default App;
