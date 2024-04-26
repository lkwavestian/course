import React from 'react';
import styles from './navMainDetail.less';

export default function NavMainDetail(props) {
    let {
        startTimeString,
        endTimeString,
        schoolName,
        teachingOrgOutputModels,
        semesterModel,
        admins,
    } = props;
    console.log(props, 'pro..........');
    let currentUrl = window.location.href;
    currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');
    let host =
        currentUrl.indexOf('yungu.org') > -1
            ? 'https://userservice.api.yungu.org/api/user/avatarUrl/'
            : 'http://userservice.api.yungu-inc.org/api/user/avatarUrl/';
    return (
        <div className={styles.NavMainDetail}>
            {schoolName && (
                <div className={styles.item}>
                    <span className={styles.title}>校区:</span>
                    <span className={styles.sub}> {schoolName} </span>
                </div>
            )}
            {teachingOrgOutputModels && teachingOrgOutputModels.length > 0 && (
                <div className={styles.item}>
                    <span className={styles.title}>学段:</span>
                    {teachingOrgOutputModels.map((el, i) => (
                        <span key={i} className={styles.sub}>
                            {el.orgName}
                            {teachingOrgOutputModels.length - 1 === i ? null : '、'}
                        </span>
                    ))}
                </div>
            )}
            {semesterModel && (
                <div className={styles.item}>
                    <span className={styles.title}>所属学期:</span>
                    <span className={styles.sub}>{semesterModel.officialSemesterName}</span>
                </div>
            )}
            <div className={styles.item}>
                <span className={styles.title}>开课周期:</span>
                <span className={styles.sub}>
                    {startTimeString || null}-{endTimeString || null}
                </span>
            </div>

            {admins && admins.length > 0 && (
                <div className={styles.item}>
                    <span className={styles.title}>管理员:</span>
                    <span className={styles.imgList}>
                        {admins.map(
                            (el, i) =>
                                (el.unionUserId && (
                                    <img key={i} src={`${host}${el.unionUserId}`} />
                                )) ||
                                null
                        )}
                    </span>
                </div>
            )}
        </div>
    );
}
