import React, { useEffect, useState } from 'react';
import { useRef } from 'react';
import styles from './baseInfo.less';
import { Steps, Popover, Icon } from 'antd';
import { trans, locale } from '../../../utils/i18n';
import { intoChineseLang, judgeTimeIsSame } from '../../../utils/utils';
import cca from '../../../assets/cca.png';
import { transform } from 'lodash';

function BaseInfor(props) {
    let userSchoolId = props.userSchoolId;

    let chooseCoursePlanId = props.planId;

    let min = [];
    let max = [];
    props.planningClassModels &&
        props.planningClassModels.map((item, index) => {
            if (item.minStudentNum && typeof item.minStudentNum == 'number') {
                min.push(item.minStudentNum);
            }
            if (typeof item.maxStudentNum && typeof item.maxStudentNum == 'number') {
                max.push(item.maxStudentNum);
            }
        });
    let arr = [...min, ...max];
    arr = arr.sort(function (a, b) {
        return a - b;
    });
    let newMin = arr[0];
    let newMax = arr[arr.length - 1];

    let startMonth = props.startTime && Number(props.startTime.slice(5, 7));
    let startDay = props.startTime && Number(props.startTime.slice(8, 10));
    let endMonth = props.endTime && Number(props.endTime.slice(5, 7));
    let endDay = props.endTime && Number(props.endTime.slice(8, 10));
    let periodStr = `${startMonth}月${startDay}日-${endMonth}月${endDay}日 `;

    let minAge = [];
    let maxAge = [];
    props.planningClassModels &&
        props.planningClassModels.map((item, index) => {
            if (item.minAge && typeof item.minAge == 'number') {
                minAge.push(item.minAge);
            }
            if (typeof item.maxAge && typeof item.maxAge == 'number') {
                maxAge.push(item.maxAge);
            }
        });
    let ageArr = [...minAge, ...maxAge];
    arr = arr.sort(function (a, b) {
        return a - b;
    });
    let newMinAge = ageArr[0];
    let newMaxAge = ageArr[ageArr.length - 1];

    let suitGradeList = [];
    props.planningClassModels &&
        props.planningClassModels.map((item, index) => {
            if (item.name) {
                let courseName = props.courseName && props.courseName;
                let courseEnName = props.courseEnName && props.courseEnName;
                let nameString = '';
                if (locale() != 'en') {
                    for (
                        let i = 0;
                        i <
                        (props.planningClassModels[index].name &&
                            props.planningClassModels[index].name.length);
                        i++
                    ) {
                        if (props.planningClassModels[index].name[i] != courseName[i]) {
                            nameString += props.planningClassModels[index].name[i];
                        }
                    }
                } else {
                    for (
                        let i = 0;
                        i <
                        (props.planningClassModels[index].enName &&
                            props.planningClassModels[index].enName.length);
                        i++
                    ) {
                        if (props.planningClassModels[index].enName[i] != courseEnName[i]) {
                            nameString += props.planningClassModels[index].enName[i];
                        }
                    }
                }

                if (item.suitGradeList) {
                    suitGradeList.push({
                        name: nameString,
                        suitGrades: item.suitGradeList,
                    });
                }
            }
        });

    let courseTime = [];

    let courseName = props.courseName && props.courseName;
    let courseEnName = props.courseEnName && props.courseEnName;

    let allSame = props.planningClassModels && props.planningClassModels.length > 0 && judgeTimeIsSame(props.planningClassModels);

    props.planningClassModels &&
        props.planningClassModels.map((item, index) => {
            let nameString = '';

            if (locale() == 'en') {
                for (
                    let i = 0;
                    i <
                    (props.planningClassModels[index].enName &&
                        props.planningClassModels[index].enName.length);
                    i++
                ) {
                    if (props.planningClassModels[index].enName[i] != courseEnName[i]) {
                        nameString += props.planningClassModels[index].enName[i];
                    }
                }
            } else if (locale() != 'en') {
                for (
                    let i = 0;
                    i <
                    (props.planningClassModels[index].name &&
                        props.planningClassModels[index].name.length);
                    i++
                ) {
                    if (props.planningClassModels[index].name[i] != courseName[i]) {
                        nameString += props.planningClassModels[index].name[i];
                    }
                }
            }
            let weekDay = '';
            item.classTimeModels && item.classTimeModels.length > 0 ? 
                item.classTimeModels.map((el, ind) => {
                    weekDay += `${ind == 0 ? (locale() != 'en' ? '周' : '') : ''}${
                        locale() != 'en' ? props.noToChinese(el.weekday) : intoChineseLang(el.weekday)
                    }${ind != item.classTimeModels.length - 1 ? '、' : ' '}`;
                    let timeStr =
                        Number(el.endTime.split(':')[0] * 60) +
                        Number(el.endTime.split(':')[1]) -
                        (Number(el.startTime.split(':')[0] * 60) + Number(el.startTime.split(':')[1]));
                    timeStr = timeStr.toString();

                    if (ind == item.classTimeModels.length - 1) {
                        courseTime.push(
                            allSame == true ? 
                                item.startTimeString && item.endTimeString ? 
                                `${nameString}  ` +  '(' + item.startTimeString.slice(5) + '~' + item.endTimeString.slice(5) + ')' : 
                                nameString :
                            `${nameString}  ` + `${weekDay} ` +
                            timeStr +
                            trans('global.minutesTimetable', '分钟')
                        );
                    }
                }) : courseTime.push(
                    item.startTimeString && item.endTimeString ? 
                        `${nameString}  ` +  '(' + item.startTimeString.slice(5) + '~' + item.endTimeString.slice(5) + ')' : 
                        nameString
                );
            });

    const listHeight = useRef();
    let [isOver, setIsOver] = useState(false);
    useEffect(() => {
        if (listHeight.current.clientHeight > 1485) {
            setIsOver((isOver = true));
        } else {
            setIsOver((isOver = false));
        }
    });

    let weideStyle = {
        backgroundImage: `url('https://yungu-public.oss-cn-hangzhou.aliyuncs.com/weixin/weide/5661660893287_.pic.jpg')`,
        backgroundSize: '39px',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#fff',
        backgroundPosition: '6px -2px',
    };

    let pictorialColor = '';
    if (props.subjectList && props.subjectList.length > 0) {
        pictorialColor = props.subjectList[0].color || '#183F9F';
    }

    const teacheringLanguage = [
        {
            id: 'CHINESE_LESSONS',
            name: '中文授课',
            eName: 'Chinese Lessons',
        },
        {
            id: 'FOREIGN_TEACHER_LESSONS',
            name: '外教授课',
            eName: 'Foreign Teacher Lessons',
        },
        {
            id: 'BILINGUAL_LESSONS',
            name: '双语授课',
            eName: 'Bilingual Lessons',
        },
    ];

    let requireToLang = '';
    teacheringLanguage.map((item, index) => {
        if (item.id == props?.teachingLanguage) {
            requireToLang = locale() == 'en' ? item.eName : item.name;
        }
    });

    let getStudentFee = (classFeeModelList, type) => {
        if (type === 'classFee')
            return classFeeModelList?.map((item) => (
                <span>
                    {getGroupName(locale() != 'en' ? item.groupName : item.groupEnName)}
                    &nbsp;
                    {item.classFee}
                    {trans('global.yuan', '元')}
                    <br />
                </span>
            ));
        if (type === 'materialCost')
            return classFeeModelList?.map((item) => (
                <span>
                    {getGroupName(locale() != 'en' ? item.groupName : item.groupEnName)}
                    &nbsp;
                    {item.materialCost}
                    {trans('global.yuan', '元')}
                    <br />
                </span>
            ));
    };

    let getGroupName = (sourceGroupName) => {
        let courseName = props.courseName;
        let courseEnName = props.courseEnName;

        if (sourceGroupName.includes(courseName) && sourceGroupName !== courseName) {
            return sourceGroupName.split(courseName)[1].trimStart();
        }
        if (sourceGroupName.includes(courseEnName) && sourceGroupName !== courseEnName) {
            return sourceGroupName.split(courseEnName)[1].trimStart();
        }
        return sourceGroupName;
    };

    return (
        <>
            <div className={styles.content} ref={listHeight} id="preview">
                <div className={styles.main} style={userSchoolId ? weideStyle : null}>
                    <p
                        style={{
                            fontSize: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            visibility: userSchoolId ? 'hidden' : 'visible',
                        }}
                    >
                        <span>Co-curricular Activity</span>
                        <img src={cca} alt="" />
                        {/* <img src={cca}} > */}
                    </p>
                    <hr></hr>
                    <div className={styles.detail}>
                        <span className={styles.left}>
                            <p
                                className={styles.base}
                                style={{ color: props.pictorialColor ? props.pictorialColor : '' }}
                            >
                                {locale() == 'en' ? props.courseEnName : props.courseName}
                            </p>
                            <p className={styles.two}>
                                {typeof props.courseType == 'number' ? (
                                    <span
                                        style={{
                                            backgroundColor: props.pictorialColor
                                                ? props.pictorialColor
                                                : '',
                                        }}
                                    >
                                        {props.courseType == 0
                                            ? trans('course.plan.newClass', '新课')
                                            : props.courseType == 1
                                            ? trans('course.plan.advanced', '进阶')
                                            : props.courseType == 2
                                            ? trans('course.plan.schoolTeam', '校队')
                                            : ''}
                                    </span>
                                ) : (
                                    ''
                                )}
                                {typeof props.Enrollment == 'number' ? (
                                    <span
                                        style={{
                                            marginLeft: '16px',
                                            backgroundColor: props.pictorialColor
                                                ? props.pictorialColor
                                                : '',
                                        }}
                                    >
                                        {props.Enrollment == 0
                                            ? trans('global.Zero basis for new', '零基础纳新')
                                            : props.Enrollment == 1
                                            ? trans('global.Conditional admission', '有条件纳新')
                                            : props.Enrollment == 2
                                            ? trans('global.not accept new', '不纳新')
                                            : ''}
                                    </span>
                                ) : (
                                    ''
                                )}
                            </p>
                            {!props.level || props?.level?.length == 0 ? null : (
                                <p className={styles.three}>
                                    <p
                                        className={styles.line}
                                        style={{ background: props.pictorialColor }}
                                    ></p>
                                    <p className={styles.four}>
                                        {props.level ? (
                                            <span
                                                style={{
                                                    backgroundColor:
                                                        props.level.indexOf('L1') != -1
                                                            ? pictorialColor
                                                            : '#fff',
                                                    color:
                                                        props?.level.indexOf('L1') != -1
                                                            ? '#fff'
                                                            : pictorialColor || '#183F9F',
                                                    border:
                                                        props?.level.indexOf('L1') != -1
                                                            ? 'none'
                                                            : '1px solid rgba(1,17,61,0.12)',
                                                    width:
                                                        props?.level.indexOf('L1') != -1
                                                            ? '35px'
                                                            : '',
                                                    height:
                                                        props?.level.indexOf('L1') != -1
                                                            ? '35px'
                                                            : '',
                                                    lineHeight:
                                                        props?.level.indexOf('L1') != -1
                                                            ? '35px'
                                                            : '',
                                                    position:
                                                        props?.level.indexOf('L1') != -1
                                                            ? 'relative'
                                                            : '',
                                                    opacity:
                                                        props?.level.indexOf('L1') != -1 ? 1 : 0.7,
                                                    // top: props?.level.indexOf('L1') != -1 ? '-6px' : '',
                                                    left:
                                                        props?.level.indexOf('L1') != -1
                                                            ? '-5px'
                                                            : '',
                                                    top:
                                                        props?.level.indexOf('L1') != -1
                                                            ? '-3px'
                                                            : '3px',
                                                }}
                                            >
                                                L1
                                            </span>
                                        ) : (
                                            <span>L1</span>
                                        )}
                                        {props.level ? (
                                            <span
                                                className={
                                                    props?.level.indexOf('L2') == -1
                                                        ? styles.transFormX
                                                        : ''
                                                }
                                                style={{
                                                    background:
                                                        props?.level.indexOf('L2') != -1
                                                            ? props.pictorialColor
                                                            : '#fff',
                                                    color:
                                                        props?.level.indexOf('L2') != -1
                                                            ? '#fff'
                                                            : props.pictorialColor || '#183F9F',
                                                    border:
                                                        props?.level.indexOf('L2') != -1
                                                            ? 'none'
                                                            : '1px solid rgba(1,17,61,0.12)',
                                                    width:
                                                        props?.level.indexOf('L2') != -1
                                                            ? '35px'
                                                            : '',
                                                    height:
                                                        props?.level.indexOf('L2') != -1
                                                            ? '35px'
                                                            : '',
                                                    lineHeight:
                                                        props?.level.indexOf('L2') != -1
                                                            ? '35px'
                                                            : '',
                                                    position:
                                                        props?.level.indexOf('L2') != -1 ||
                                                        props?.level.indexOf('L1') != -1
                                                            ? 'relative'
                                                            : '',
                                                    left:
                                                        props?.level.indexOf('L2') != -1 &&
                                                        props?.level.indexOf('L3') != -1 &&
                                                        props?.level.indexOf('L4') != -1 &&
                                                        props?.level.indexOf('L1') != -1
                                                            ? '-2px'
                                                            : props?.level.indexOf('L2') != -1 &&
                                                              props?.level.indexOf('L3') != -1 &&
                                                              props?.level.indexOf('L4') != -1
                                                            ? '4px'
                                                            : props?.level.indexOf('L1') != -1 &&
                                                              props?.level.indexOf('L2') != -1 &&
                                                              props?.level.indexOf('L3') != -1
                                                            ? userSchoolId
                                                                ? ''
                                                                : ''
                                                            : props?.level.indexOf('L1') != -1 &&
                                                              props?.level.indexOf('L2') != -1
                                                            ? '-5px'
                                                            : props?.level.indexOf('L2') != -1 &&
                                                              props?.level.indexOf('L3') != -1
                                                            ? userSchoolId
                                                                ? '4px'
                                                                : ''
                                                            : props?.level.indexOf('L4') != -1
                                                            ? '-2px'
                                                            : props?.level.indexOf('L3') != -1
                                                            ? '-6px'
                                                            : props?.level.indexOf('L2') != -1
                                                            ? userSchoolId
                                                                ? ''
                                                                : '-3px'
                                                            : props?.level.indexOf('L1') != -1
                                                            ? '-6px'
                                                            : '',
                                                    top:
                                                        props?.level.indexOf('L2') != -1
                                                            ? '-3px'
                                                            : '3px',
                                                    opacity:
                                                        props?.level.indexOf('L1') != -1 ? 1 : 0.7,
                                                }}
                                            >
                                                L2
                                            </span>
                                        ) : (
                                            <span>L2</span>
                                        )}
                                        {props.level ? (
                                            <span
                                                style={{
                                                    background:
                                                        props?.level.indexOf('L3') != -1
                                                            ? props.pictorialColor
                                                            : '#fff',
                                                    color:
                                                        props?.level.indexOf('L3') != -1
                                                            ? '#fff'
                                                            : props.pictorialColor || '#183F9F',
                                                    border:
                                                        props?.level.indexOf('L3') != -1
                                                            ? 'none'
                                                            : '1px solid rgba(1,17,61,0.12)',
                                                    width:
                                                        props?.level.indexOf('L3') != -1
                                                            ? '35px'
                                                            : '',
                                                    height:
                                                        props?.level.indexOf('L3') != -1
                                                            ? '35px'
                                                            : '',
                                                    lineHeight:
                                                        props?.level.indexOf('L3') != -1
                                                            ? '35px'
                                                            : '',
                                                    position:
                                                        props?.level.indexOf('L1') != -1 ||
                                                        props?.level.indexOf('L3') != -1 ||
                                                        props?.level.indexOf('L2') != -1 ||
                                                        props?.level.indexOf('L4') != -1
                                                            ? 'relative'
                                                            : '',
                                                    opacity:
                                                        props?.level.indexOf('L1') != -1 ? 1 : 0.7,
                                                    top:
                                                        props?.level.indexOf('L3') != -1
                                                            ? '-3px'
                                                            : props?.level.indexOf('L3') != -1
                                                            ? '2px'
                                                            : '3px',
                                                    left:
                                                        props?.level.indexOf('L1') != -1 &&
                                                        props?.level.indexOf('L2') != -1 &&
                                                        props?.level.indexOf('L3') != -1 &&
                                                        props?.level.indexOf('L4') != -1
                                                            ? '1px'
                                                            : props?.level.indexOf('L2') != -1 &&
                                                              props?.level.indexOf('L3') != -1 &&
                                                              props?.level.indexOf('L4') != -1
                                                            ? '5px'
                                                            : props?.level.indexOf('L1') != -1 &&
                                                              props?.level.indexOf('L2') != -1 &&
                                                              props?.level.indexOf('L3') != -1
                                                            ? userSchoolId
                                                                ? '5px'
                                                                : ''
                                                            : props?.level.indexOf('L1') != -1 &&
                                                              props?.level.indexOf('L2') != -1
                                                            ? userSchoolId
                                                                ? '-1px'
                                                                : '-6px'
                                                            : props?.level.indexOf('L4') != -1 &&
                                                              props?.level.indexOf('L3') != -1
                                                            ? '8px'
                                                            : props?.level.indexOf('L3') != -1
                                                            ? userSchoolId
                                                                ? '5px'
                                                                : '1px'
                                                            : props?.level.indexOf('L4') != -1
                                                            ? '6px'
                                                            : props?.level.indexOf('L2') != -1
                                                            ? userSchoolId
                                                                ? ''
                                                                : '-4px'
                                                            : '',
                                                }}
                                            >
                                                L3
                                            </span>
                                        ) : (
                                            <span>L3</span>
                                        )}
                                        {props.level ? (
                                            <span
                                                style={{
                                                    background:
                                                        props?.level.indexOf('L4') != -1
                                                            ? props.pictorialColor
                                                            : '#fff',
                                                    color:
                                                        props?.level.indexOf('L4') != -1
                                                            ? '#fff'
                                                            : props.pictorialColor || '#183F9F',
                                                    border:
                                                        props?.level.indexOf('L4') != -1
                                                            ? 'none'
                                                            : '1px solid rgba(1,17,61,0.12)',
                                                    width:
                                                        props?.level.indexOf('L4') != -1
                                                            ? '35px'
                                                            : '',
                                                    height:
                                                        props?.level.indexOf('L4') != -1
                                                            ? '35px'
                                                            : '',
                                                    lineHeight:
                                                        props?.level.indexOf('L4') != -1
                                                            ? '35px'
                                                            : '',
                                                    position:
                                                        props?.level.indexOf('L4') != -1
                                                            ? 'relative'
                                                            : '',
                                                    left:
                                                        props?.level.indexOf('L4') != -1
                                                            ? '5px'
                                                            : props?.level.indexOf('L1' || 'L2') !=
                                                              -1
                                                            ? '4px'
                                                            : '',
                                                    top:
                                                        props?.level.indexOf('L4') != -1
                                                            ? '-3px'
                                                            : '3px',
                                                    opacity:
                                                        props?.level.indexOf('L1') != -1 ? 1 : 0.7,
                                                    display: userSchoolId ? 'none' : 'inline-block',
                                                }}
                                            >
                                                L4
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    display: userSchoolId ? 'none' : 'inline-block',
                                                }}
                                            >
                                                L4
                                            </span>
                                        )}
                                    </p>
                                    <p className={styles.level}>
                                        <span
                                            style={{
                                                color:
                                                    props.level && props.level.indexOf('L1') != -1
                                                        ? props.pictorialColor
                                                        : props.pictorialColor
                                                        ? props.hexToRgba(props.pictorialColor, 0.7)
                                                        : '',
                                            }}
                                        >
                                            {userSchoolId ? '初级' : '萌芽'}
                                        </span>
                                        <span
                                            style={{
                                                color:
                                                    props.level && props.level.indexOf('L2') != -1
                                                        ? props.pictorialColor
                                                        : props.pictorialColor
                                                        ? props.hexToRgba(props.pictorialColor, 0.7)
                                                        : '',
                                            }}
                                        >
                                            {userSchoolId ? '中级' : '生长'}
                                        </span>
                                        <span
                                            style={{
                                                color:
                                                    props.level && props.level.indexOf('L3') != -1
                                                        ? props.pictorialColor
                                                        : props.pictorialColor
                                                        ? props.hexToRgba(props.pictorialColor, 0.7)
                                                        : '',
                                            }}
                                        >
                                            {userSchoolId ? '高级' : '精熟'}
                                        </span>
                                        {userSchoolId ? (
                                            ''
                                        ) : (
                                            <span
                                                style={{
                                                    color:
                                                        props.level &&
                                                        props.level.indexOf('L4') != -1
                                                            ? props.pictorialColor
                                                            : props.pictorialColor
                                                            ? props.hexToRgba(
                                                                  props.pictorialColor,
                                                                  0.7
                                                              )
                                                            : '',
                                                }}
                                            >
                                                超越
                                            </span>
                                        )}
                                    </p>
                                </p>
                            )}
                        </span>
                        {props.courseIntroductionType == 0 && (
                            <span
                                className={styles.right}
                                style={{
                                    background: props.pictorialColor
                                        ? props.pictorialColor
                                            ? props.hexToRgba(props.pictorialColor, 0.04)
                                            : ''
                                        : '',
                                }}
                            >
                                {props.schoolId == '1000001001' ? (
                                    <p className={styles.grade}>
                                        <span>
                                            {schoolId == '1000001001'
                                                ? trans('global.suitAge', '适用年龄:')
                                                : trans('global.studentAge', '学生年龄:')}
                                        </span>
                                        <span>
                                            {newMinAge && newMaxAge
                                                ? `${newMinAge}-${newMaxAge}岁（年龄、英文水平分班）`
                                                : ''}
                                        </span>
                                    </p>
                                ) : null}
                                {props.schoolId == '1000001001' ? null : (
                                    <p className={styles.grade}>
                                        <span style={{ minWidth: '74px' }}>
                                            {trans('global.faceGrade', '面向年级:')}{' '}
                                        </span>
                                        <span>
                                            {suitGradeList &&
                                                suitGradeList.map((item, index) => {
                                                    return (
                                                        <>
                                                            <span
                                                                style={{
                                                                    marginRight: userSchoolId
                                                                        ? '5px'
                                                                        : '',
                                                                }}
                                                            >
                                                                {item.name}
                                                            </span>
                                                            {item.suitGrades &&
                                                                item.suitGrades.length > 0 &&
                                                                item.suitGrades.map(
                                                                    (item2, index2) => {
                                                                        return (
                                                                            <>
                                                                                {locale() != 'en'
                                                                                    ? item2.name
                                                                                    : item2.enName}
                                                                                {item.suitGrades
                                                                                    .length -
                                                                                    1 ===
                                                                                index2 ? (
                                                                                    <br />
                                                                                ) : (
                                                                                    '、'
                                                                                )}
                                                                            </>
                                                                        );
                                                                    }
                                                                )}
                                                        </>
                                                    );
                                                })}
                                        </span>
                                    </p>
                                )}

                                {userSchoolId ? (
                                    <p className={styles.grade} style={{ marginBottom: '16px' }}>
                                        <span>
                                            {trans('mobile.teachingLanguage', '授课语言')}：
                                        </span>
                                        <span style={{ marginLeft: '0' }}>{requireToLang}</span>
                                    </p>
                                ) : null}
                                <p
                                    className={styles.grade}
                                    style={{ display: 'flex', margin: '16px 0' }}
                                >
                                    <span>{trans('global.classTime', '上课时间:')}</span>
                                    <span>
                                        {courseTime &&
                                            courseTime.map((item, index) => {
                                                return (
                                                    <>
                                                        {item}
                                                        <br />
                                                    </>
                                                );
                                            })}
                                    </span>
                                </p>
                                {props?.condition && props.Enrollment == 1 ? (
                                    <p className={styles.grade} style={{ margin: '16px 0' }}>
                                        <span style={{ width: '69px' }}>
                                            {trans('global.reportCondition', '报名条件:')}
                                        </span>
                                        <span style={{ flex: 1 }}>
                                            {props?.condition ? props.condition : ''}
                                        </span>
                                    </p>
                                ) : (
                                    ''
                                )}

                                <p className={styles.grade} style={{ margin: '16px 0' }}>
                                    <span>{trans('global.classNumber', '每班人数:')}</span>
                                    <span>
                                        {newMin && newMax
                                            ? newMin == newMax
                                                ? locale() != 'en'
                                                    ? `${newMin}人`
                                                    : newMin == 1
                                                    ? `${newMin} person`
                                                    : `${newMin} persons`
                                                : locale() != 'en'
                                                ? `${newMin}-${newMax}人`
                                                : `${newMin}-${newMax} persons`
                                            : ''}
                                    </span>
                                </p>
                                {props?.classFeeShow ? (
                                    <p className={styles.grade}>
                                        <span>
                                            {chooseCoursePlanId == 125
                                                ? '加课包:'
                                                : trans('global.classFee', '课时费:')}
                                        </span>
                                        <span>
                                            {props?.classFeeType == 0
                                                ? trans('global.noAddress', '无')
                                                : props?.classFeeType == 1
                                                ? props?.classFee + trans('global.yuan', '元')
                                                : props?.classFeeType == 2
                                                ? getStudentFee(props.classFeeModelList, 'classFee')
                                                : ''}
                                        </span>
                                    </p>
                                ) : null}
                                {props?.materialFeeShow ? (
                                    <p className={styles.grade} style={{ margin: '16px 0 0' }}>
                                        <span>{trans('global.materialFee', '材料费:')}</span>
                                        <span>
                                            {props?.materialCost == 0
                                                ? trans('global.noAddress', '无')
                                                : props?.materialCost == 1
                                                ? props?.unite + trans('global.yuan', '元')
                                                : props?.materialCost == 2
                                                ? props?.newCost +
                                                  '(' +
                                                  trans('mobile.oldStu', '老生') +
                                                  ' ' +
                                                  props?.oldCost +
                                                  trans('global.yuan', '元') +
                                                  ')'
                                                : props?.materialCost == 3
                                                ? getStudentFee(
                                                      props.classFeeModelList,
                                                      'materialCost'
                                                  )
                                                : ''}
                                        </span>
                                    </p>
                                ) : null}

                                {userSchoolId &&
                                (props?.languageRequirements || props?.enLanguageRequirements) ? (
                                    <p className={styles.grade} style={{ margin: '16px 0 0' }}>
                                        <span>
                                            {trans('mobile.languageRequirements', '英文要求')}：
                                        </span>

                                        <span style={{ marginLeft: '0' }}>
                                            {locale() == 'en'
                                                ? props?.enLanguageRequirements
                                                : props?.languageRequirements}
                                        </span>
                                    </p>
                                ) : null}
                            </span>
                        )}
                    </div>
                    {props.courseIntroductionType == 1 && (
                        <div>
                            {props.planningClassModels?.length &&
                                props.planningClassModels.map((item, index) => {
                                    return (
                                        <div
                                            style={{
                                                background: pictorialColor
                                                    ? pictorialColor
                                                        ? props.hexToRgba(pictorialColor, 0.04)
                                                        : ''
                                                    : '',
                                                padding: '20px',
                                                fontWeight: 800,
                                                margin: '20px 0',
                                            }}
                                        >
                                            <p style={{ color: pictorialColor, fontSize: '20px' }}>
                                                {locale() != 'en' ? item.name : item.enName}
                                            </p>
                                            {props?.schoolId == '1000001001' ? null : (
                                                <p className={styles.grade}>
                                                    <span style={{ minWidth: '72px' }}>
                                                        {trans('global.faceGrade', '面向年级:')}
                                                    </span>
                                                    <span
                                                        style={{ marginLeft: 15, color: 'black' }}
                                                    >
                                                        {item.suitGradeList &&
                                                            item.suitGradeList.length &&
                                                            item.suitGradeList.map((el, idx) => {
                                                                return (
                                                                    <>
                                                                        {locale() != 'en'
                                                                            ? el.name
                                                                            : el.enName}
                                                                        {idx ==
                                                                        item.suitGradeList.length -
                                                                            1
                                                                            ? ''
                                                                            : '、'}
                                                                    </>
                                                                );
                                                            })}
                                                        {item.minAge && item.maxAge && (
                                                            <>
                                                                `${item.minAge} - ${item.maxAge}`{' '}
                                                                {locale() != 'en' ? '岁' : 'age'}
                                                            </>
                                                        )}
                                                    </span>
                                                </p>
                                            )}
                                            <p className={styles.grade} style={{ display: 'flex' }}>
                                                <span>
                                                    {trans('global.classTime', '上课时间:')}
                                                </span>
                                                <span style={{ marginLeft: 15, color: 'black' }}>
                                                    {periodStr}
                                                    {props.classDate && 
                                                        props.classDate.length > 0 ?
                                                        item.classTimeModels &&
                                                        item.classTimeModels.length > 0 &&
                                                        item.classTimeModels.map((el, idx) => {
                                                            return (
                                                                <>
                                                                    {locale() != 'en' ? '周' : ''}
                                                                    {locale() != 'en'
                                                                        ? props.noToChinese(
                                                                              el.weekday
                                                                          )
                                                                        : intoChineseLang(
                                                                              el.weekday
                                                                          )}{' '}
                                                                    {`${el.startTime}-${el.endTime}`}
                                                                    {idx ==
                                                                    item.classTimeModels.length - 1
                                                                        ? ''
                                                                        : '、'}
                                                                </>
                                                            );
                                                        }) : null}
                                                </span>
                                            </p>
                                            <p>
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        width: '25%',
                                                    }}
                                                >
                                                    <span>
                                                        {trans('global.classNumber', '每班人数:')}
                                                    </span>
                                                    <span
                                                        style={{ marginLeft: 15, color: 'black' }}
                                                    >
                                                        {`${item.minStudentNum}-${item.maxStudentNum}`}
                                                        {locale() != 'en' ? '人' : 'persons'}
                                                    </span>
                                                </span>

                                                {props.userSchoolId ? (
                                                    <span>
                                                        <span>
                                                            {trans(
                                                                'mobile.teachingLanguage',
                                                                '授课语言'
                                                            )}
                                                            :
                                                        </span>
                                                        <span
                                                            style={{
                                                                marginLeft: 15,
                                                                color: 'black',
                                                            }}
                                                        >
                                                            {requireToLang}
                                                        </span>
                                                    </span>
                                                ) : null}
                                            </p>
                                            <p>
                                                {props?.classFeeShow ? (
                                                    <span
                                                        style={{
                                                            display: 'inline-block',
                                                            width: '25%',
                                                        }}
                                                    >
                                                        <span>
                                                            {trans('global.classFee', '课时费:')}
                                                        </span>
                                                        <span
                                                            style={{
                                                                marginLeft: 28,
                                                                color: 'black',
                                                            }}
                                                        >
                                                            {props?.classFeeType == 0
                                                                ? trans('global.noAddress', '无')
                                                                : props?.classFeeType == 1
                                                                ? props?.classFee +
                                                                  trans('global.yuan', '元')
                                                                : props?.classFeeType == 2
                                                                ? getStudentFee(
                                                                      props.classFeeModelList,
                                                                      'classFee'
                                                                  )
                                                                : ''}
                                                        </span>
                                                    </span>
                                                ) : null}

                                                {props?.materialFeeShow ? (
                                                    <span>
                                                        <span>
                                                            {trans('global.materialFee', '材料费:')}
                                                        </span>
                                                        <span
                                                            style={{
                                                                marginLeft: 28,
                                                                color: 'black',
                                                            }}
                                                        >
                                                            {props?.materialFeeType == 0
                                                                ? trans('global.noAddress', '无')
                                                                : props?.materialFeeType == 1
                                                                ? props?.materialCost +
                                                                  trans('global.yuan', '元')
                                                                : props?.materialFeeType == 2
                                                                ? props?.newMaterialCost +
                                                                  '(' +
                                                                  trans('mobile.oldStu', '老生') +
                                                                  ' ' +
                                                                  props?.oldMaterialCost +
                                                                  trans('global.yuan', '元') +
                                                                  ')'
                                                                : props?.materialFeeType == 3
                                                                ? getStudentFee(
                                                                      props.classFeeModelList,
                                                                      'materialCost'
                                                                  )
                                                                : ''}
                                                        </span>
                                                    </span>
                                                ) : null}
                                            </p>
                                            <p>
                                                {props?.conditionDescription &&
                                                props.admissionType == 1 ? (
                                                    <span>
                                                        <span>
                                                            {trans(
                                                                'global.reportCondition',
                                                                '报名条件:'
                                                            )}
                                                        </span>
                                                        <span
                                                            style={{
                                                                marginLeft: 15,
                                                                color: 'black',
                                                            }}
                                                        >
                                                            {props?.conditionDescription
                                                                ? props.conditionDescription
                                                                : ''}
                                                        </span>
                                                    </span>
                                                ) : (
                                                    ''
                                                )}

                                                {props.userSchoolId &&
                                                (props?.languageRequirements ||
                                                    props?.enLanguageRequirements) ? (
                                                    <span>
                                                        <span>
                                                            {trans(
                                                                'mobile.languageRequirements',
                                                                '英文要求'
                                                            )}
                                                            :
                                                        </span>
                                                        <span
                                                            style={{
                                                                marginLeft: 15,
                                                                color: 'black',
                                                            }}
                                                        >
                                                            {locale() == 'en'
                                                                ? props?.enLanguageRequirements
                                                                : props?.languageRequirements}
                                                        </span>
                                                    </span>
                                                ) : null}
                                            </p>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                    <div className={styles.bottom}>
                        <span className={styles.left}>
                            <div className={styles.target}>
                                <p>课程目标</p>
                                <p style={{ fontStyle: '#01113D' }}>{props.courseObjectives}</p>
                            </div>
                            <div className={styles.Ccontent}>
                                <p>课程内容</p>
                                <p style={{ fontStyle: '#01113D' }}>{props.courseContent}</p>
                            </div>
                            <div className={styles.teacher}>
                                <p>师资介绍</p>
                                <p>
                                    {props?.teacherIntro && props.teacherIntro.trim() ? (
                                        <span
                                            style={{
                                                marginRight: '8px',
                                                background: props.pictorialColor
                                                    ? props.pictorialColor
                                                        ? props.hexToRgba(
                                                              props.pictorialColor,
                                                              0.12
                                                          )
                                                        : ''
                                                    : '',
                                                // opacity: 0.12,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: props.pictorialColor
                                                        ? props.pictorialColor
                                                        : '',
                                                    opacity: 1,
                                                }}
                                            >
                                                本校老师：
                                            </span>

                                            <span
                                                style={{
                                                    color: props.pictorialColor
                                                        ? props.pictorialColor
                                                        : '',
                                                    opacity: 1,
                                                }}
                                            >
                                                {props?.teacherIntro}
                                                {/* {props?.teacher &&
                                                props.teacher.map((item, index) => {
                                                    return (
                                                        <>
                                                            {item}
                                                            {props.teacher.length - 1 == index
                                                                ? null
                                                                : '、'}
                                                        </>
                                                    );
                                                })} */}
                                            </span>
                                        </span>
                                    ) : (
                                        ''
                                    )}

                                    {props.ExternalTeachers && props?.ExternalTeachers.trim() ? (
                                        <span
                                            style={{
                                                background: props.pictorialColor
                                                    ? props.pictorialColor
                                                        ? props.hexToRgba(
                                                              props.pictorialColor,
                                                              0.12
                                                          )
                                                        : ''
                                                    : '',
                                                marginTop: 1
                                                // opacity: 0.12,
                                            }}
                                        >
                                            <span
                                                style={{
                                                    color: props.pictorialColor
                                                        ? props.pictorialColor
                                                        : '',
                                                    opacity: 1,
                                                }}
                                            >
                                                外聘老师：
                                            </span>

                                            <span
                                                style={{
                                                    color: props.pictorialColor
                                                        ? props.pictorialColor
                                                        : '',
                                                    opacity: 1,
                                                }}
                                            >
                                                {props?.ExternalTeachers}
                                            </span>
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                </p>
                                <p style={{ fontStyle: '#01113D', whiteSpace: 'pre-wrap' }}>
                                    {props.teacherName}
                                </p>
                            </div>
                            <div className={styles.prepation}>
                                <p>
                                    <span>{trans('mobile.preparation', '课前准备')}</span>
                                    <span>含报名材料、材料费说明等</span>
                                </p>
                                <p style={{ whiteSpace: 'pre-wrap' }}>{props.coursePreparation}</p>
                            </div>
                        </span>
                        <span className={styles.right}>
                            {props && props.fileList && props.fileList.length > 0 ? (
                                <p>
                                    <img
                                        style={{
                                            height:
                                                props?.imageType && props.imageType == 1
                                                    ? '322px'
                                                    : props.imageType && props.imageType == 2
                                                    ? '228px'
                                                    : props.imageType && props.imageType == 3
                                                    ? '495px'
                                                    : '',
                                        }}
                                        src={
                                            props &&
                                            props.fileList &&
                                            props.fileList.length > 0 &&
                                            props.fileList[0] &&
                                            props.fileList[0].url != ''
                                                ? props.fileList[0].url.includes('http')
                                                    ? props.fileList[0].url
                                                    : window.location.origin + props.fileList[0].url
                                                : ''
                                        }
                                        alt=""
                                    ></img>
                                </p>
                            ) : (
                                ''
                            )}

                            {props && props.fileList && props.fileList.length > 1 ? (
                                <p
                                    style={{
                                        margin:
                                            props.imageType && props.imageType == 3
                                                ? '24px 0 0'
                                                : '24px 0',
                                    }}
                                >
                                    <img
                                        style={{
                                            height:
                                                props?.imageType && props.imageType == 1
                                                    ? '322px'
                                                    : props.imageType && props.imageType == 2
                                                    ? '228px'
                                                    : props.imageType && props.imageType == 3
                                                    ? '495px'
                                                    : '',
                                        }}
                                        src={
                                            props &&
                                            props.fileList &&
                                            props.fileList.length > 1 &&
                                            props.fileList[1] &&
                                            props.fileList[1].url != ''
                                                ? props.fileList[1].url.includes('http')
                                                    ? props.fileList[1].url
                                                    : window.location.origin + props.fileList[1].url
                                                : ''
                                        }
                                        alt=""
                                    ></img>
                                </p>
                            ) : (
                                ''
                            )}

                            {/* {props?.imageType && props.imageType == 3 ? ( */}
                            {props && props.fileList && props.fileList.length > 2 ? (
                                <p
                                    style={{
                                        display:
                                            props.imageType && props.imageType == 3
                                                ? 'none'
                                                : 'inline-block',
                                        width: '384px',
                                    }}
                                >
                                    <img
                                        style={{
                                            height:
                                                props?.imageType && props.imageType == 1
                                                    ? '322px'
                                                    : props.imageType && props.imageType == 2
                                                    ? '509px'
                                                    : '0',
                                        }}
                                        src={
                                            props &&
                                            props.fileList &&
                                            props.fileList.length > 2 &&
                                            props.fileList[2] &&
                                            props.fileList[2].url != ''
                                                ? props.fileList[2].url.includes('http')
                                                    ? props.fileList[2].url
                                                    : window.location.origin + props.fileList[2].url
                                                : ''
                                        }
                                        alt=""
                                    ></img>
                                </p>
                            ) : (
                                ''
                            )}
                        </span>
                    </div>
                </div>
            </div>
            <div
                style={{
                    display: isOver == true ? 'block' : 'none',
                }}
            >
                <hr className={styles.horizon} />
                <span className={styles.tips}>以下内容超出一页A4显示范围</span>
            </div>
        </>
    );
}

export default BaseInfor;
