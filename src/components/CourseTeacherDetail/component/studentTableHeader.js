import React from 'react';
import { Icon, Divider } from 'antd';
import styles from './studentTableHeader.less';
import icon from '../../../icon.less';
import { trans, locale } from '../../../utils/i18n';

function StudentTableHeader(props) {
    let currentUrl = window.location.href;
    currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');
    let homePageUrl =
        currentUrl.indexOf('yungu.org') > -1
            ? 'https://profile.yungu.org/#/dynamic/'
            : 'https://student-profile.daily.yungu-inc.org/#/dynamic/';
    let host =
        currentUrl.indexOf('yungu.org') > -1
            ? 'https://userservice.api.yungu.org/api/user/avatarUrl/'
            : 'http://userservice.api.yungu-inc.org/api/user/avatarUrl/';
    return (
        <div className={styles.StudentTableHeader}>
            <div
                className={styles.top}
                // style={{ marginTop: props.chooseCourseDetails.type == 1 ? '' : '15px' }}
            >
                {/* <a href={`${homePageUrl}${props.userDTO.userId}`} target="_blank">
                    <img className={styles.img} src={`${host}${props.userDTO.unionUserId}`} />
                </a> */}
                <div className={styles.right}>
                    <div
                        className={styles.name}
                        title={`${props.userDTO.name} ${props.userDTO.enName}`}
                    >
                        <a
                            href={`${homePageUrl}${props.userDTO.userId}`}
                            target="_blank"
                            style={{ color: '#464c56' }}
                        >
                            {locale() !== 'en' ? props.userDTO.name : props.userDTO.enName}
                        </a>
                    </div>
                    {/* <div className={styles.score}>
                        <i className={icon.iconfont + " " + styles.statisticNum}>&#xe634;</i>
                        <span className={styles.num}>{trans("global.credit", "学分")}{props.selectedCredits || 0}</span>
                        <span className={styles.add}>
                            {
                                props.scoreAdd &&
                                <Fragment>
                                    <Icon type="plus" />
                                    {props.scoreAdd}
                                </Fragment>
                            }
                        </span>
                    </div> */}
                </div>
            </div>
            <div className={styles.bottom}>
                {/* {props.chooseCourseDetails.type == 1 && (
                    <>
                        <span>
                            <span className={styles.num}>{trans('global.reported', '已报')}</span>
                            {props.signUpCourseAmount || 0}
                        </span>
                        <Divider type="vertical" />
                        <span>
                            <span className={styles.num}>{trans('global.yes', '已中')}</span>
                            {props.selectedCourseAmount || 0}
                        </span>
                        <Divider type="vertical" />
                        <span>
                            <span className={styles.num}>{trans('global.free', '空余')}</span>
                            {props.spareLessonAmount || 0}
                        </span>
                    </>
                )} */}
                <span>
                    {props.userDTO?.administrativeClass?.absoluteName || ''}
                </span>
            </div>
        </div>
    );
}

export default StudentTableHeader;
