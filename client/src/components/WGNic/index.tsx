import { Icon, Text } from '@blueprintjs/core';
import React from 'react';
import ReportData from '../../models/report';
import styles from './styles.module.sass';


const WGNicComp = React.memo((props: { report : ReportData}) => (
  <div className={styles.WGNic}>
    <div className={styles.Nic}>
      <div className={ styles.Icon }><Icon icon='diagram-tree' iconSize={20} /></div>
      <Text className={ styles.Name}>{ props.report.InterfaceName }</Text>
    </div>
    <div className={ styles.Listen }>
      <div className={ styles.Icon }><Icon icon='globe' iconSize={20} /></div>
      <Text className={ styles.Address}>{ props.report.ExternalIP }:{ props.report.ListenPort }</Text>
    </div>
    <div className={ styles.VPN }>
      <div className={ styles.Icon }><Icon icon='home' iconSize={20} /></div>
      <Text className={ styles.Address}>{ props.report.IP }</Text>
    </div>
  </div>
));

export default WGNicComp;
