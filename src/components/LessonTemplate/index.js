//备课模板
import React from 'react';
import styles from './index.less';

function LessonTemplate(props) {
    let origin = window.location.origin.indexOf('yungu.org') > -1
                ? 'https://task.yungu.org'
                : 'https://task.daily.yungu-inc.org';
    let url = `${origin}/#/schedule/lessonPrepareTemplate`;
    return (<div className={styles.templateContent}>
        <iframe 
            src={url}
        />
    </div>)
}

export default LessonTemplate;