import React from 'react';
import styles from './baseInfor.less';
import { Steps, Popover, Icon } from 'antd';
import { trans, locale } from '../../utils/i18n';
import { judgeTimeIsSame } from '../../utils/utils'
import cca from '../../assets/cca.png';
import { isEmpty } from 'lodash';

function BaseInfor(props) {
    let userSchoolId = props.userSchoolId;

    // console.log('planMsg', props.planMsg.id);
    let isSuitChooseId = props.planMsg.id;

    let newArr = props.teacherIntroduction && props.teacherIntroduction.split('$');

    newArr &&
        newArr.forEach((item, index) => {
            if (item == 'undefined') {
                newArr[index] = '';
            }
        });

    let suitGradeList = [];
    props.planningClassModels &&
        props.planningClassModels.map((item, index) => {
            if (item.name) {
                let courseName = props.courseName && props.courseName;
                let nameString = '';
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
                if (item.suitGradeList) {
                    console.log('nameString', nameString);
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

    let allSame = props.planningClassModels && props.planningClassModels.length > 0 && judgeTimeIsSame(props.planningClassModels);

    props.planningClassModels &&
        props.planningClassModels.map((item, index) => {
            let nameString = '';
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
            console.log(nameString,'nameString')
            console.log(allSame,'allSame')
            let weekDay = '';
            item.classTimeModels && item.classTimeModels.length > 0 ? 
                item.classTimeModels.map((el, ind) => {
                    weekDay += `${ind == 0 ? '周' : ''}${props.noToChinese(el.weekday)}${
                        ind != item.classTimeModels.length - 1 ? '、' : ' '
                    }`;
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
                        nameString + '(' + item.startTimeString.slice(5) + '~' + item.endTimeString.slice(5) + ')' :
                        nameString
                );
        });

    let newImageList = [];
    props?.pictureUrlModelList &&
        props.pictureUrlModelList.map((item, index) => {
            newImageList.push({
                // ...item,
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
                    {getGroupName(item.groupName)}
                    &nbsp;
                    {item.classFee}
                    元
                    <br />
                </span>
            ));
        if (type === 'materialCost')
            return classFeeModelList?.map((item) => (
                <span>
                    {getGroupName(item.groupName)}
                    &nbsp;
                    {item.materialCost}
                    元
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
                                {props.courseName ? props.courseName : ''}
                            </p>
                            <p className={styles.two}>
                                {typeof props.coursePlanType == 'number' ? (
                                    <span style={{ backgroundColor: pictorialColor }}>
                                        {props.coursePlanType == 0
                                            ? '新课'
                                            : props.coursePlanType == 1
                                            ? '进阶'
                                            : props.coursePlanType == 2
                                            ? '校队'
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
                                            ? '零基础纳新'
                                            : props.admissionType == 1
                                            ? '有条件纳新'
                                            : props.admissionType == 2
                                            ? '不纳新'
                                            : ''}
                                    </span>
                                ) : (
                                    ''
                                )}
                            </p>
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
                                                        : props?.levelList.indexOf('L2') != -1 &&
                                                          props?.levelList.indexOf('L3') != -1 &&
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
                                                        : props?.levelList.indexOf('L2') != -1 &&
                                                          props?.levelList.indexOf('L3') != -1 &&
                                                          props?.levelList.indexOf('L4') != -1
                                                        ? '4px'
                                                        : props?.levelList.indexOf('L1') != -1 &&
                                                          props?.levelList.indexOf('L2') != -1 &&
                                                          props?.levelList.indexOf('L3') != -1
                                                        ? userSchoolId
                                                            ? '1px'
                                                            : ''
                                                        : props?.levelList.indexOf('L2') != -1 &&
                                                          props?.levelList.indexOf('L1') != -1
                                                        ? userSchoolId
                                                            ? '-4px'
                                                            : '-8px'
                                                        : props?.levelList.indexOf('L2') != -1 &&
                                                          props?.levelList.indexOf('L3') != -1
                                                        ? userSchoolId
                                                            ? '6px'
                                                            : ''
                                                        : props?.levelList.indexOf('L4') != -1 &&
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
                                                        : props?.levelList.indexOf('L1') != -1 &&
                                                          props?.levelList.indexOf('L2') != -1 &&
                                                          props?.levelList.indexOf('L3') != -1
                                                        ? '-6px'
                                                        : props?.levelList.indexOf('L2') != -1 &&
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
                                                        : props?.levelList.indexOf('L2') != -1 &&
                                                          props?.levelList.indexOf('L3') != -1 &&
                                                          props?.levelList.indexOf('L4') != -1
                                                        ? '5px'
                                                        : props?.levelList.indexOf('L1') != -1 &&
                                                          props?.levelList.indexOf('L2') != -1 &&
                                                          props?.levelList.indexOf('L3') != -1
                                                        ? userSchoolId
                                                            ? '6px'
                                                            : ''
                                                        : props?.levelList.indexOf('L2') != -1 &&
                                                          props?.levelList.indexOf('L1') != -1
                                                        ? userSchoolId
                                                            ? '0'
                                                            : '-6px'
                                                        : props?.levelList.indexOf('L2') != -1 &&
                                                          props?.levelList.indexOf('L3') != -1
                                                        ? userSchoolId
                                                            ? '5px'
                                                            : '-2px'
                                                        : props?.levelList.indexOf('L4') != -1 &&
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
                                                        : props?.levelList.indexOf('L2') != -1 &&
                                                          props?.levelList.indexOf('L3') != -1 &&
                                                          props?.levelList.indexOf('L4') != -1
                                                        ? '5px'
                                                        : props?.levelList.indexOf('L4') != -1 &&
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
                                            /* opacity:
                                                props.levelList &&
                                                props.levelList.indexOf('L1') != -1
                                                    ? 0.7
                                                    : '', */
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
                                            /* opacity:
                                                props.levelList &&
                                                props.levelList.indexOf('L2') != -1
                                                    ? 0.7
                                                    : '', */
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
                                            /* opacity:
                                                props.levelList &&
                                                props.levelList.indexOf('L3') != -1
                                                    ? 0.7
                                                    : '', */
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
                                                /* opacity:
                                               props.levelList &&
                                               props.levelList.indexOf('L4') != -1
                                                   ? 0.7
                                                   : '', */
                                            }}
                                        >
                                            超越
                                        </span>
                                    )}
                                </p>
                            </p>
                        </span>
                        <span
                            className={styles.right}
                            style={{
                                /* backgroundColor: props.pictorialColor ? props.pictorialColor : '',
                                opacity: props.pictorialColor ? 0.04 : '', */
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
                                        {props.schoolId == '1000001001' ? '适用年龄:' : '学生年龄:'}
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
                                    <span style={{ minWidth: '72px' }}>面向年级:</span>
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
                                                            {item.name}&nbsp;
                                                        </span>
                                                        {/* {item.name}&nbsp; */}
                                                        {item.suitGrades &&
                                                            item.suitGrades.length > 0 &&
                                                            item.suitGrades.map((item2, index2) => {
                                                                return (
                                                                    <>
                                                                        {item2.name}
                                                                        {item.suitGrades.length -
                                                                            1 ===
                                                                        index2 ? (
                                                                            <br />
                                                                        ) : (
                                                                            '、'
                                                                        )}
                                                                    </>
                                                                );
                                                            })}
                                                    </>
                                                );
                                            })}
                                    </span>
                                </p>
                            )}

                            {props.userSchoolId ? (
                                <p className={styles.grade}>
                                    {/* <span>授课语言:</span> */}
                                    <span>{trans('mobile.teachingLanguage', '授课语言')}：</span>
                                    <span style={{ marginLeft: 0 }}>
                                        {/* {props?.teachingLanguage ? props.teachingLanguage : ''} */}
                                        {requireToLang}
                                    </span>
                                </p>
                            ) : null}
                            <p className={styles.grade} style={{ display: 'flex' }}>
                                <span>上课时间:</span>
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
                                    <span>报名条件:</span>
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
                                <span>每班人数:</span>
                                <span>{newMin && newMax ? `${newMin}-${newMax}人` : ''}</span>
                            </p>

                            {props?.classFeeShow ? (
                                <p className={styles.grade}>
                                    <span>{isSuitChooseId == 125 ? '加课包' : '课时费'}:</span>
                                    <span>
                                        {props?.classFeeType == 0
                                            ? '无'
                                            : props?.classFeeType == 1
                                            ? props?.classFee + '元'
                                            : props?.classFeeType == 2
                                            ? getStudentFee(props.classFeeModelList, 'classFee')
                                            : ''}
                                    </span>
                                </p>
                            ) : null}

                            {props?.materialFeeShow ? (
                                <p className={styles.grade}>
                                    <span>材料费:</span>
                                    <span>
                                        {props?.materialFeeType == 0
                                            ? '无'
                                            : props?.materialFeeType == 1
                                            ? props?.materialCost + '元'
                                            : props?.materialFeeType == 2
                                            ? props?.newMaterialCost +
                                              '(' +
                                              '老生' +
                                              props?.oldMaterialCost +
                                              '元' +
                                              ')'
                                            : props?.materialFeeType == 3
                                            ? getStudentFee(props.classFeeModelList, 'materialCost')
                                            : ''}
                                    </span>
                                </p>
                            ) : null}

                            {props.userSchoolId &&
                            (props?.languageRequirements || props?.enLanguageRequirements) ? (
                                <p className={styles.grade}>
                                    {/* <span>英文要求:</span> */}
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
                    </div>
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
                                        ? isEmpty(props?.enFreePlateContent) ?
                                            props.freePlateContent:
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
