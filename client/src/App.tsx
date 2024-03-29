import { Colors } from '@blueprintjs/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import './base.css';

// Load custom comps after blueprint css.
import Overview from './components/Overview';
import styles from './styles.module.scss';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
  <div className={styles.App} style={{ background: Colors.DARK_GRAY3}}>
    <div className={ `${styles.Container}`}>
      <Overview />
    </div>
  </div>
  </QueryClientProvider>
);

export default App;
