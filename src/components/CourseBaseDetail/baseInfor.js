import React from 'react';
import styles from './baseInfor.less';
import { Steps, Popover, Icon } from 'antd';
import { trans, locale } from '../../utils/i18n';
import { intoChineseLang, judgeTimeIsSame } from '../../utils/utils';
import cca from '../../assets/cca.png';
import { isEmpty } from 'lodash';

function BaseInfor(props) {
    let userSchoolId = props.userSchoolId;

    console.log('courseIntroductionType', props.courseIntroductionType);

    let chooseCoursePlanId = props.chooseCoursePlanId;

    let newArr = props.teacherIntroduction && props.teacherIntroduction.split('$');

    newArr &&
        newArr.forEach((item, index) => {
            if (item == 'undefined') {
                newArr[index] = '';
            }
        });

    let startMonth = props.startTime && Number(props.startTime.slice(5, 7));
    let startDay = props.startTime && Number(props.startTime.slice(8, 10));
    let endMonth = props.endTime && Number(props.endTime.slice(5, 7));
    let endDay = props.endTime && Number(props.endTime.slice(8, 10));
    let periodStr = `${startMonth}月${startDay}日-${endMonth}月${endDay}日 `;

    let suitGradeList = [];
    props.planningClassModels &&
        props.planningClassModels.map((item, index) => {
            if (item.name) {
                let courseName = props.courseName && props.courseName;
                let courseEnName = props.courseEnName && props.courseEnName;
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
                if (item.suitGradeList) {
                    suitGradeList.push({
                        name: nameString,
                        suitGrades: item.suitGradeList,
                    });
                }
            }
        });

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

    let courseTime = [];

    let courseName = props.courseName && props.courseName;
    let courseEnName = props.courseEnName && props.courseEnName;

    let allSame = props.planningClassModels && props.planningClassModels.length > 0 && judgeTimeIsSame(props.planningClassModels);

    props.planningClassModels &&
        props.planningClassModels.map((item, index) => {
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
            console.log(nameString,'nameString')
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
                                    `${nameString}  ` + '(' + item.startTimeString.slice(5) + '~' + item.endTimeString.slice(5) + ')' : 
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
                )
        });

    let newImageList = [];
    props?.pictureUrlModelList &&
        props.pictureUrlModelList.map((item, index) => {
            newImageList.push({
                uid: index,
                type: 'image/png',
                url: window.location.origin + item.url,
            });
        });

    let pictorialColor = '';
    if (props.subjectList && props.subjectList.length > 0) {
        pictorialColor = props.subjectList[0].color || '#183F9F';
    }

    let weideStyle = {
        backgroundImage: `url('https://yungu-public.oss-cn-hangzhou.aliyuncs.com/weixin/weide/5661660893287_.pic.jpg')`,
        backgroundSize: '50px',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#fff',
        backgroundPosition: '60px 5px',
    };

    const teacheringLanguage = [
        {
            id: 'CHINESE_LESSONS',
            name: '中文授课',
            eName: 'Chinese',
        },
        {
            id: 'FOREIGN_TEACHER_LESSONS',
            name: '外教授课',
            eName: 'English',
        },
        {
            id: 'BILINGUAL_LESSONS',
            name: '双语授课',
            eName: 'Biliangual',
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
            <div className={styles.content}>
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
                    </p>
                    <hr></hr>
                    <div className={styles.detail}>
                        <span className={styles.left}>
                            <p className={styles.base} style={{ color: pictorialColor }}>
                                {locale() == 'en' ? props.courseEnName : props.courseName}
                            </p>
                            <p className={styles.two}>
                                {typeof props.coursePlanType == 'number' ? (
                                    <span style={{ backgroundColor: pictorialColor }}>
                                        {props.coursePlanType == 0
                                            ? trans('course.plan.newClass', '新课')
                                            : props.coursePlanType == 1
                                            ? trans('course.plan.advanced', '进阶')
                                            : props.coursePlanType == 2
                                            ? trans('course.plan.schoolTeam', '校队')
                                            : ''}
                                    </span>
                                ) : (
                                    ''
                                )}
                                {typeof props.admissionType == 'number' ? (
                                    <span
                                        style={{
                                            marginLeft: '16px',
                                            backgroundColor: pictorialColor,
                                        }}
                                    >
                                        {props.admissionType == 0
                                            ? trans('global.Zero basis for new', '零基础纳新')
                                            : props.admissionType == 1
                                            ? trans('global.Conditional admission', '有条件纳新')
                                            : props.admissionType == 2
                                            ? trans('global.not accept new', '不纳新')
                                            : ''}
                                    </span>
                                ) : (
                                    ''
                                )}
                            </p>
                            {!props.levelList || props?.levelList?.length == 0 ? null : (
                                <p className={styles.three}>
                                    <p
                                        className={styles.line}
                                        style={{ background: pictorialColor }}
                                    ></p>
                                    <p className={styles.four}>
                                        {props.levelList ? (
                                            <span
                                                style={{
                                                    backgroundColor:
                                                        props?.levelList.indexOf('L1') != -1
                                                            ? pictorialColor
                                                            : '#fff',
                                                    color:
                                                        props?.levelList.indexOf('L1') != -1
                                                            ? '#fff'
                                                            : pictorialColor,
                                                    border:
                                                        props?.levelList.indexOf('L1') != -1
                                                            ? 'none'
                                                            : '1px solid rgba(1,17,61,0.12)',
                                                    width:
                                                        props?.levelList.indexOf('L1') != -1
                                                            ? '35px'
                                                            : '',
                                                    height:
                                                        props?.levelList.indexOf('L1') != -1
                                                            ? '35px'
                                                            : '',
                                                    lineHeight:
                                                        props?.levelList.indexOf('L1') != -1
                                                            ? '35px'
                                                            : '',
                                                    position:
                                                        props?.levelList.indexOf('L1') != -1
                                                            ? 'relative'
                                                            : '',
                                                    top:
                                                        props?.levelList.indexOf('L1') != -1 &&
                                                        props?.levelList.indexOf('L2') != -1 &&
                                                        props?.levelList.indexOf('L3') != -1 &&
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? '-4px'
                                                            : props?.levelList.indexOf('L1') != -1
                                                            ? '-6px'
                                                            : '',
                                                    left:
                                                        props?.levelList.indexOf('L1') != -1
                                                            ? '-4px'
                                                            : '',
                                                }}
                                            >
                                                L1
                                            </span>
                                        ) : (
                                            <span>L1</span>
                                        )}
                                        {props.levelList ? (
                                            <span
                                                style={{
                                                    backgroundColor:
                                                        props?.levelList.indexOf('L2') != -1
                                                            ? pictorialColor
                                                            : '#fff',
                                                    color:
                                                        props?.levelList.indexOf('L2') != -1
                                                            ? '#fff'
                                                            : pictorialColor,
                                                    border:
                                                        props?.levelList.indexOf('L2') != -1
                                                            ? 'none'
                                                            : '1px solid rgba(1,17,61,0.12)',
                                                    width:
                                                        props?.levelList.indexOf('L2') != -1
                                                            ? '35px'
                                                            : '',
                                                    height:
                                                        props?.levelList.indexOf('L2') != -1
                                                            ? '35px'
                                                            : '',
                                                    lineHeight:
                                                        props?.levelList.indexOf('L2') != -1
                                                            ? '35px'
                                                            : '',
                                                    position:
                                                        props?.levelList.indexOf('L2') != -1 ||
                                                        props?.levelList.indexOf('L1') != -1 ||
                                                        props?.levelList.indexOf('L3') != -1
                                                            ? 'relative'
                                                            : '',
                                                    top:
                                                        props?.levelList.indexOf('L1') != -1 &&
                                                        props?.levelList.indexOf('L2') != -1 &&
                                                        props?.levelList.indexOf('L3') != -1 &&
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? '-4px'
                                                            : props?.levelList.indexOf('L2') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L3') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L4') != -1
                                                            ? '-6px'
                                                            : props?.levelList.indexOf('L2') != -1
                                                            ? '-6px'
                                                            : '',
                                                    left:
                                                        props?.levelList.indexOf('L1') != -1 &&
                                                        props?.levelList.indexOf('L2') != -1 &&
                                                        props?.levelList.indexOf('L3') != -1 &&
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? '-2px'
                                                            : props?.levelList.indexOf('L2') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L3') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L4') != -1
                                                            ? '4px'
                                                            : props?.levelList.indexOf('L1') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L2') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L3') != -1
                                                            ? userSchoolId
                                                                ? '1px'
                                                                : ''
                                                            : props?.levelList.indexOf('L2') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L1') != -1
                                                            ? userSchoolId
                                                                ? '-4px'
                                                                : '-8px'
                                                            : props?.levelList.indexOf('L2') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L3') != -1
                                                            ? userSchoolId
                                                                ? '6px'
                                                                : ''
                                                            : props?.levelList.indexOf('L4') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L3') != -1
                                                            ? '7px'
                                                            : props?.levelList.indexOf('L3') != -1
                                                            ? userSchoolId
                                                                ? '6px'
                                                                : ''
                                                            : props?.levelList.indexOf('L2') != -1
                                                            ? '-1px'
                                                            : props?.levelList.indexOf('L1') != -1
                                                            ? userSchoolId
                                                                ? '-5px'
                                                                : '-7px'
                                                            : '',
                                                }}
                                            >
                                                L2
                                            </span>
                                        ) : (
                                            <span>L2</span>
                                        )}
                                        {props.levelList ? (
                                            <span
                                                style={{
                                                    backgroundColor:
                                                        props?.levelList.indexOf('L3') != -1
                                                            ? pictorialColor
                                                            : '#fff',
                                                    color:
                                                        props?.levelList.indexOf('L3') != -1
                                                            ? '#fff'
                                                            : pictorialColor,
                                                    border:
                                                        props?.levelList.indexOf('L3') != -1
                                                            ? 'none'
                                                            : '1px solid rgba(1,17,61,0.12)',
                                                    width:
                                                        props?.levelList.indexOf('L3') != -1
                                                            ? '35px'
                                                            : '',
                                                    height:
                                                        props?.levelList.indexOf('L3') != -1
                                                            ? '35px'
                                                            : '',
                                                    lineHeight:
                                                        props?.levelList.indexOf('L3') != -1
                                                            ? '35px'
                                                            : '',
                                                    position:
                                                        props?.levelList.indexOf('L1') != -1 ||
                                                        props?.levelList.indexOf('L3') != -1 ||
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? 'relative'
                                                            : '',
                                                    top:
                                                        props?.levelList.indexOf('L1') != -1 &&
                                                        props?.levelList.indexOf('L2') != -1 &&
                                                        props?.levelList.indexOf('L3') != -1 &&
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? '-4px'
                                                            : props?.levelList.indexOf('L1') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L2') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L3') != -1
                                                            ? '-6px'
                                                            : props?.levelList.indexOf('L2') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L3') != -1
                                                            ? '-5px'
                                                            : props?.levelList.indexOf('L3') != -1
                                                            ? '-5px'
                                                            : '',
                                                    left:
                                                        props?.levelList.indexOf('L1') != -1 &&
                                                        props?.levelList.indexOf('L2') != -1 &&
                                                        props?.levelList.indexOf('L3') != -1 &&
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? '2px'
                                                            : props?.levelList.indexOf('L2') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L3') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L4') != -1
                                                            ? '5px'
                                                            : props?.levelList.indexOf('L1') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L2') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L3') != -1
                                                            ? userSchoolId
                                                                ? '6px'
                                                                : ''
                                                            : props?.levelList.indexOf('L2') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L1') != -1
                                                            ? userSchoolId
                                                                ? '0'
                                                                : '-6px'
                                                            : props?.levelList.indexOf('L2') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L3') != -1
                                                            ? userSchoolId
                                                                ? '5px'
                                                                : '-2px'
                                                            : props?.levelList.indexOf('L4') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L3') != -1
                                                            ? '8px'
                                                            : props?.levelList.indexOf('L4') != -1
                                                            ? '7px'
                                                            : props?.levelList.indexOf('L3') != -1
                                                            ? userSchoolId
                                                                ? '5px'
                                                                : ''
                                                            : props?.levelList.indexOf('L2') != -1
                                                            ? '-8px'
                                                            : props?.levelList.indexOf('L1') != -1
                                                            ? userSchoolId
                                                                ? '1px'
                                                                : '-3px'
                                                            : '',
                                                }}
                                            >
                                                L3
                                            </span>
                                        ) : (
                                            <span>L3</span>
                                        )}
                                        {props.levelList ? (
                                            <span
                                                style={{
                                                    backgroundColor:
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? pictorialColor
                                                            : '#fff',
                                                    color:
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? '#fff'
                                                            : pictorialColor,
                                                    border:
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? 'none'
                                                            : '1px solid rgba(1,17,61,0.12)',
                                                    width:
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? '35px'
                                                            : '',
                                                    height:
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? '35px'
                                                            : '',
                                                    lineHeight:
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? '35px'
                                                            : '',
                                                    position:
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? 'relative'
                                                            : '',
                                                    top:
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? '-5px'
                                                            : '',
                                                    left:
                                                        props?.levelList.indexOf('L1') != -1 &&
                                                        props?.levelList.indexOf('L2') != -1 &&
                                                        props?.levelList.indexOf('L3') != -1 &&
                                                        props?.levelList.indexOf('L4') != -1
                                                            ? '4px'
                                                            : props?.levelList.indexOf('L2') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L3') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L4') != -1
                                                            ? '5px'
                                                            : props?.levelList.indexOf('L4') !=
                                                                  -1 &&
                                                              props?.levelList.indexOf('L3') != -1
                                                            ? '6px'
                                                            : props?.levelList.indexOf('L4') != -1
                                                            ? '4px'
                                                            : '',
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
                                                    props.levelList &&
                                                    props.levelList.indexOf('L1') != -1
                                                        ? pictorialColor
                                                        : pictorialColor
                                                        ? props.hexToRgba(pictorialColor, 0.7)
                                                        : '',
                                            }}
                                        >
                                            {userSchoolId ? '初级' : '萌芽'}
                                        </span>
                                        <span
                                            style={{
                                                color:
                                                    props.levelList &&
                                                    props.levelList.indexOf('L2') != -1
                                                        ? pictorialColor
                                                        : pictorialColor
                                                        ? props.hexToRgba(pictorialColor, 0.7)
                                                        : '',
                                            }}
                                        >
                                            {userSchoolId ? '中级' : '生长'}
                                        </span>
                                        <span
                                            style={{
                                                color:
                                                    props.levelList &&
                                                    props.levelList.indexOf('L3') != -1
                                                        ? pictorialColor
                                                        : pictorialColor
                                                        ? props.hexToRgba(pictorialColor, 0.7)
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
                                                        props.levelList &&
                                                        props.levelList.indexOf('L4') != -1
                                                            ? pictorialColor
                                                            : pictorialColor
                                                            ? props.hexToRgba(pictorialColor, 0.7)
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
                                    background: pictorialColor
                                        ? pictorialColor
                                            ? props.hexToRgba(pictorialColor, 0.04)
                                            : ''
                                        : '',
                                }}
                            >
                                {props?.schoolId == '1000001001' ? (
                                    <p className={styles.grade}>
                                        <span>
                                            {props.schoolId == '1000001001'
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
                                {props?.schoolId == '1000001001' ? null : (
                                    <p className={styles.grade}>
                                        <span style={{ minWidth: '72px' }}>
                                            {trans('global.faceGrade', '面向年级:')}
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

                                {props.userSchoolId ? (
                                    <p className={styles.grade}>
                                        <span>
                                            {trans('mobile.teachingLanguage', '授课语言')}：
                                        </span>
                                        <span style={{ marginLeft: 0 }}>{requireToLang}</span>
                                    </p>
                                ) : null}
                                <p className={styles.grade} style={{ display: 'flex' }}>
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
                                {props?.conditionDescription && props.admissionType == 1 ? (
                                    <p className={styles.grade}>
                                        <span>{trans('global.reportCondition', '报名条件:')}</span>
                                        <span>
                                            {props?.conditionDescription
                                                ? props.conditionDescription
                                                : ''}
                                        </span>
                                    </p>
                                ) : (
                                    ''
                                )}
                                <p className={styles.grade}>
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
                                    <p className={styles.grade}>
                                        <span>{trans('global.materialFee', '材料费:')}</span>
                                        <span>
                                            {props?.materialFeeType == 0
                                                ? trans('global.noAddress', '无')
                                                : props?.materialFeeType == 1
                                                ? props?.materialCost + trans('global.yuan', '元')
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
                                    </p>
                                ) : null}

                                {props.userSchoolId &&
                                (props?.languageRequirements || props?.enLanguageRequirements) ? (
                                    <p className={styles.grade}>
                                        <span>
                                            {trans('mobile.languageRequirements', '英文要求')}：
                                        </span>
                                        <span style={{ marginLeft: 0 }}>
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
                    {props.courseIntroductionType == 0 ? (
                        <div className={styles.bottom}>
                            <span className={styles.left}>
                                <div className={styles.target}>
                                    <p>课程目标</p>
                                    <p>{props.courseObjectives}</p>
                                </div>
                                <div className={styles.Ccontent}>
                                    <p>课程内容</p>
                                    <p>{props.courseContent}</p>
                                </div>
                                <div className={styles.teacher}>
                                    <p>师资介绍</p>
                                    <p>
                                        {newArr && newArr.length > 0 && newArr[0].trim() ? (
                                            <span
                                                style={{
                                                    marginRight: '8px',
                                                    background: pictorialColor
                                                        ? pictorialColor
                                                            ? props.hexToRgba(pictorialColor, 0.12)
                                                            : ''
                                                        : '',
                                                    // opacity: 0.12,
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: pictorialColor,

                                                        opacity: 1,
                                                    }}
                                                >
                                                    本校老师：
                                                </span>
                                                <span
                                                    style={{
                                                        color: pictorialColor,
                                                        opacity: 1,
                                                    }}
                                                >
                                                    {newArr && newArr.length > 0 ? newArr[0] : ''}
                                                </span>
                                            </span>
                                        ) : (
                                            ''
                                        )}
                                        {newArr && newArr.length > 1 && newArr[1].trim() ? (
                                            <span
                                                style={{
                                                    background: pictorialColor
                                                        ? pictorialColor
                                                            ? props.hexToRgba(pictorialColor, 0.12)
                                                            : ''
                                                        : '',
                                                    marginTop: 1
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        color: pictorialColor,
                                                        opacity: 1,
                                                    }}
                                                >
                                                    外聘老师：
                                                </span>
                                                <span
                                                    style={{
                                                        color: pictorialColor,
                                                        opacity: 1,
                                                    }}
                                                >
                                                    {newArr && newArr.length > 1 ? newArr[1] : ''}
                                                </span>
                                            </span>
                                        ) : (
                                            ''
                                        )}
                                    </p>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>
                                        {newArr && newArr.length > 2 ? newArr[2] : ''}
                                    </p>
                                </div>
                                <div className={styles.prepation}>
                                    <p>
                                        <span>{trans('mobile.preparation', '课前准备')}</span>
                                        <span>含报名材料、材料费说明等</span>
                                    </p>
                                    <p style={{ whiteSpace: 'pre-wrap' }}>
                                        {props.coursePreparation}
                                    </p>
                                </div>
                            </span>
                            <span className={styles.right}>
                                {props &&
                                props.pictureUrlModelList &&
                                props.pictureUrlModelList.length > 0 ? (
                                    <p>
                                        <img
                                            style={{
                                                height:
                                                    props?.pictureType && props.pictureType == 1
                                                        ? // ? '244px'
                                                          '322px'
                                                        : props.pictureType &&
                                                          props.pictureType == 2
                                                        ? // ? '200px'
                                                          '228px'
                                                        : props.pictureType &&
                                                          props.pictureType == 3
                                                        ? // ? '370px'
                                                          '495px'
                                                        : '',
                                            }}
                                            src={
                                                props &&
                                                props.pictureUrlModelList &&
                                                props.pictureUrlModelList.length > 0
                                                    ? window.location.origin +
                                                      props.pictureUrlModelList[0].url
                                                    : ''
                                            }
                                            alt=""
                                        ></img>
                                    </p>
                                ) : (
                                    ''
                                )}

                                {props &&
                                props.pictureUrlModelList &&
                                props.pictureUrlModelList.length > 1 ? (
                                    <p>
                                        <img
                                            style={{
                                                height:
                                                    props?.pictureType && props.pictureType == 1
                                                        ? /* ? '244px'
                                                : props.pictureType && props.pictureType == 2
                                                ? '200px'
                                                : props.pictureType && props.pictureType == 3
                                                ? '370px' */
                                                          '322px'
                                                        : props.pictureType &&
                                                          props.pictureType == 2
                                                        ? '228px'
                                                        : props.pictureType &&
                                                          props.pictureType == 3
                                                        ? '495px'
                                                        : '',
                                            }}
                                            src={
                                                props &&
                                                props.pictureUrlModelList &&
                                                props.pictureUrlModelList.length > 1
                                                    ? window.location.origin +
                                                      props.pictureUrlModelList[1].url
                                                    : ''
                                            }
                                            alt=""
                                        ></img>
                                    </p>
                                ) : (
                                    ''
                                )}

                                {/* {props?.pictureType && props.pictureType == 3 ? ( */}
                                {props &&
                                props.pictureUrlModelList &&
                                props.pictureUrlModelList.length > 2 ? (
                                    <p>
                                        <img
                                            style={{
                                                height:
                                                    props?.pictureType && props.pictureType == 1
                                                        ? /* ? '244px'
                                                : props.pictureType && props.pictureType == 2
                                                ? '330px' */
                                                          '322px'
                                                        : props.pictureType &&
                                                          props.pictureType == 2
                                                        ? '509px'
                                                        : '0',
                                            }}
                                            src={
                                                props &&
                                                props.pictureUrlModelList &&
                                                props.pictureUrlModelList.length > 2
                                                    ? window.location.origin +
                                                      props.pictureUrlModelList[2].url
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
                    ) : props.courseIntroductionType == 1 ? (
                        <div
                            className={styles.imgContent}
                            dangerouslySetInnerHTML={{
                                __html:
                                    locale() == 'en'
                                        ? isEmpty(props.enFreePlateContent) ? 
                                            props.freePlateContent : 
                                            props.enFreePlateContent
                                        : props.freePlateContent,
                            }}
                            style={{ marginTop: '50px' }}
                        ></div>
                    ) : (
                        ''
                    )}
                </div>
            </div>
        </>
    );
}

export default BaseInfor;
