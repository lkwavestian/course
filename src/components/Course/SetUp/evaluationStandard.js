import React from 'react';
import styles from './index.less';

function EvaluationStandard(props) {
  let origin = window.location.origin.indexOf('yungu.org') > -1 ? 'https://task.yungu.org' : 'https://task.daily.yungu-inc.org';
  let iframeUrl = `${origin}/#/schedule/evaluationStandard/2?noHead=true`;
  return <div className={styles.evaluationStandardBox}>
    <iframe src={iframeUrl} className={styles.iframeStyle}></iframe>
  </div>
}
export default EvaluationStandard;