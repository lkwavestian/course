import React from 'react';
import { connect } from 'dva';
import {
    Input,
    Modal,
    Radio,
    Upload,
    Icon,
    message,
    Button,
    Spin,
    Popover,
    Form,
    Tabs,
    Select,
    InputNumber,
} from 'antd';
import styles from './editCourseInfor.less';
import NavTitle from './navTitle';
import { trans, locale } from '../../../utils/i18n';
import RichEditor from '@yungu-fed/static-richeditor';
import ooo from '../../../assets/ooo.png';
import tt from '../../../assets/tt.png';
import oot from '../../../assets/oot.png';
import BaseInfor from './baseInfo';
import ImgCrop from 'antd-img-crop';
import OssButton from '../../UploadByOSS/ossButton';

import { getUrlSearch } from '../../../utils/utils';

const { TextArea } = Input;
const { TabPane } = Tabs;
const { Option } = Select;
@Form.create()
@connect((state) => ({
    teacherList: state.course.teacherList,
    showCoursePlanningDetail: state.course.showCoursePlanningDetail,
    uploadImages: state.course.uploadImages,
    ossAssumeResult: state.global.ossAssumeResult,
    currentUser: state.global.currentUser,
    uploadFileResponse: state.global.uploadFileResponse,
    chooseCourseDetails: state.choose.chooseCourseDetails,
    userSchoolId: state.global.userSchoolId,
}))
class EditCourseInfor extends React.Component {
    state = {
        switchOnchange: false,
        totalLesson: undefined,
        weekLesson: undefined,
        minStudent: undefined,
        maxStudent: undefined,
        classFee: 1,
        teacherValue: [],
        courseName: '',
        courseEnName: '',
        subject: '',
        pictorialColor: '',
        prevCourse: '',
        courseType: undefined,
        Enrollment: undefined,
        condition: '',
        eCondition: '',
        limit: undefined,
        courseObjectives: '',
        enCourseObjectives: '',
        courseContent: '',
        enCourseContent: '',
        materialCost: undefined,
        newCost: undefined,
        oldCost: undefined,
        unite: undefined,
        coursePreparation: '',
        enCoursePreparation: '',
        teacherIntro: '',
        eTeacherIntro: '',
        ExternalTeachers: '',
        eExternalTeachers: '',
        teacherName: '',
        eTeacherName: '',
        imageType: undefined,
        images: [],
        fileList: [],
        content: undefined,
        enContent: undefined,
        planId: getUrlSearch('planId'),
        previewVisible: false,
        previewImage: '',
        preVisible: false,
        gradeList: [],
        level: [],
        planningClassModels: [],
        loading: false,
        freePlateContent: undefined,
        enFreePlateContent: undefined,
        courseCover: undefined,
        freeCourseCover: undefined,
        uploadStatus: '',
        freeUploadStatus: '', //自由版式上传图片状态
        teachingLanguage: undefined, //授课语言
        languageRequirements: undefined, //英文要求
        enLanguageRequirements: undefined, //英文要求
        classFeeModelList: [],
    };

    componentDidMount() {
        this.getTeacher();
        this.initCoursePlan(this.props.coursePlanId);
    }

    getTeacher() {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/getTeacherList',
            payload: {},
        });
    }

    initCoursePlan = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'course/showCoursePlanningDetail',
            payload: {
                coursePlanningId: id,
                chooseCoursePlanId: this.state.planId,
            },
        }).then(() => {
            const { showCoursePlanningDetail } = this.props;
            let switchOnchange =
                showCoursePlanningDetail.classFee || showCoursePlanningDetail.materialCost
                    ? true
                    : false;
            let newImageList = [];
            showCoursePlanningDetail?.pictureUrlModelList &&
                showCoursePlanningDetail.pictureUrlModelList.map((item, index) => {
                    if (item != null) {
                        newImageList.push({
                            // ...item,
                            // uid: index,
                            type: 'image/png',
                            url: item.url,
                        });
                    } else {
                        newImageList.push(null);
                    }
                });

            let subject = [];
            showCoursePlanningDetail.subjectList &&
                showCoursePlanningDetail.subjectList.length > 0 &&
                showCoursePlanningDetail.subjectList.map((item, index) => {
                    return subject.push(locale() !== 'en' ? item.name : item.enName);
                });
            let pictorialColor = '';
            if (
                showCoursePlanningDetail.subjectList &&
                showCoursePlanningDetail.subjectList.length > 0
            ) {
                pictorialColor = showCoursePlanningDetail.subjectList[0].color;
            }

            let prevCourse = '';
            showCoursePlanningDetail.prefaceCourseList &&
                showCoursePlanningDetail.prefaceCourseList.length > 0 &&
                (prevCourse = showCoursePlanningDetail.prefaceCourseList[0].name);

            let newArr =
                showCoursePlanningDetail.teacherIntroduction &&
                showCoursePlanningDetail.teacherIntroduction.split('$');

            /* let eNewArr =
                showCoursePlanningDetail.enTeacherIntroduction &&
                showCoursePlanningDetail.enTeacherIntroduction.split('$');
                eNewArr &&
                eNewArr.forEach((item, index) => {
                    if (item == 'undefined') {
                        eNewArr[index] = '';
                    }
                }); */

            newArr &&
                newArr.forEach((item, index) => {
                    if (item == 'undefined') {
                        newArr[index] = '';
                    }
                });

            this.setState({
                switchOnchange: switchOnchange,
                teacherValue: showCoursePlanningDetail.teacherUserIds, //老师ID
                totalLesson: showCoursePlanningDetail.totalLesson, //总课时
                weekLesson: showCoursePlanningDetail.weekLesson, //周课时
                maxStudent: showCoursePlanningDetail.maxStudent, //最多人
                minStudent: showCoursePlanningDetail.minStudent, //最少人
                classFee: showCoursePlanningDetail.classFee, //课时费

                courseName: showCoursePlanningDetail.courseName, //课程名
                courseEnName: showCoursePlanningDetail.courseEnName,
                subject: subject, //学科
                prevCourse: prevCourse, //前序课程
                pictorialColor: pictorialColor, //前序课程
                courseType: showCoursePlanningDetail.coursePlanType, //课程类型
                Enrollment: showCoursePlanningDetail.admissionType, //招生条件
                condition: showCoursePlanningDetail.conditionDescription, //条件说明
                eCondition: showCoursePlanningDetail.enConditionDescription, //条件说明
                limit:
                    showCoursePlanningDetail?.repeatRegistration == true
                        ? 1
                        : showCoursePlanningDetail?.repeatRegistration == false
                        ? 0
                        : undefined, //报名限制
                courseObjectives: showCoursePlanningDetail.courseObjectives, //课程目标
                enCourseObjectives: showCoursePlanningDetail.enCourseObjectives, //课程目标
                courseContent: showCoursePlanningDetail.courseContent, //课程内容
                enCourseContent: showCoursePlanningDetail.enCourseContent, //课程内容
                materialCost: showCoursePlanningDetail.materialFeeType, //材料费
                unite: showCoursePlanningDetail.materialCost,
                newCost: showCoursePlanningDetail.newMaterialCost, //材料费
                oldCost: showCoursePlanningDetail.oldMaterialCost, //材料费
                coursePreparation: showCoursePlanningDetail.coursePreparation, //课前准备
                enCoursePreparation: showCoursePlanningDetail.enCoursePreparation, //课前准备
                teacherIntro: newArr && newArr.length > 0 && newArr[0], //师资介绍
                ExternalTeachers: newArr && newArr.length > 1 && newArr[1], //外聘教师
                teacherName: newArr && newArr.length > 2 && newArr[2], //外聘教师
                /* eTeacherIntro: eNewArr && eNewArr.length > 0 && eNewArr[0], //师资介绍
                eExternalTeachers: eNewArr && eNewArr.length > 1 && eNewArr[1], //外聘教师 */
                eTeacherName: showCoursePlanningDetail.enTeacherIntroduction, //外聘教师
                imageType: showCoursePlanningDetail.pictureType, //图片版式
                fileList: newImageList, //上传图片
                courseCover: showCoursePlanningDetail.courseCover,
                freeCourseCover: showCoursePlanningDetail.courseCover,
                level: showCoursePlanningDetail.levelList,
                planningClassModels: showCoursePlanningDetail.planningClassModels,
                freePlateContent: showCoursePlanningDetail?.freePlateContent
                    ? showCoursePlanningDetail.freePlateContent
                    : undefined,
                enFreePlateContent: showCoursePlanningDetail?.enFreePlateContent
                    ? showCoursePlanningDetail.enFreePlateContent
                    : undefined,
                // fileList: showCoursePlanningDetail.pictureUrlModelList, //上传图片
                gradeList: showCoursePlanningDetail.gradeList, //适用年级（预览用）
                teachingLanguage: showCoursePlanningDetail.teachingLanguage, //授课语言
                languageRequirements: showCoursePlanningDetail.languageRequirements, //英文要求
                enLanguageRequirements: showCoursePlanningDetail.enLanguageRequirements, //英文要求
                content: showCoursePlanningDetail?.freePlateContent,
                enContent: showCoursePlanningDetail?.enFreePlateContent,

                classFeeModelList: showCoursePlanningDetail?.classFeeModelList,
                classFeeType: showCoursePlanningDetail?.classFeeType, //  课时费类型
            });
        });
    };

    onCancel = () => {
        const { hideModal, self } = this.props;
        typeof hideModal == 'function' && hideModal.call(self, 'visibleEditCourseInfor');
    };

    editPreview = () => {
        this.setState({
            preVisible: true,
        });
    };

    hexToRgba = (bgColor, alpha) => {
        let color = bgColor.slice(1);
        let rgba = [
            parseInt('0x' + color.slice(0, 2)),
            parseInt('0x' + color.slice(2, 4)),
            parseInt('0x' + color.slice(4, 6)),
            alpha,
        ];
        return 'rgba(' + rgba.toString() + ')';
    };

    editCourseOk = () => {
        const { dispatch, coursePlanId, chooseCourseDetails, userSchoolId } = this.props;
        let {
            courseType,
            Enrollment,
            condition,
            eCondition,
            limit,
            courseObjectives,
            enCourseObjectives,
            courseContent,
            enCourseContent,
            materialCost,
            newCost,
            oldCost,
            coursePreparation,
            enCoursePreparation,
            teacherIntro,
            eTeacherIntro,
            ExternalTeachers,
            eExternalTeachers,
            teacherName,
            eTeacherName,
            imageType,
            fileList,
            unite,
            content,
            enContent,
            courseCover,
            freeCourseCover,
            uploadStatus,
            freeUploadStatus,
            teachingLanguage,
            languageRequirements,
            enLanguageRequirements,
            classFeeModelList,
        } = this.state;
        let params = {};
        /* if (!teacherIntro.trim()) {
            teacherIntro = '';
        }
        if (!ExternalTeachers.trim()) {
            ExternalTeachers = '';
        } */
        if (teacherIntro) {
            teacherIntro = teacherIntro.trim();
        } else {
            teacherIntro = '';
        }
        if (ExternalTeachers) {
            ExternalTeachers = ExternalTeachers.trim();
        } else {
            ExternalTeachers = '';
        }
        if (!teacherName) {
            teacherName = '';
        }

        console.log('123', 123);

        let teacherIntroduction = teacherIntro + '$' + ExternalTeachers + '$' + teacherName;
        if (chooseCourseDetails.courseIntroductionType == 0) {
            if (courseType == undefined) {
                message.warn('请选择一个开课类型');
                return;
            }
            if (Enrollment == undefined) {
                message.warn('请选择一个招生条件');
                return;
            }
            if (condition && condition.length > 15) {
                message.warn('条件说明限制在15字内(含15)');
                return;
            }
            if (limit == undefined) {
                message.warn('请选择报名限制');
                return;
            }
            if (!courseObjectives) {
                message.warn('请填写课程目标');
                return;
            }
            if (!courseContent) {
                message.warn('请填写课程内容');
                return;
            }

            if (materialCost == undefined) {
                message.warn('请选择材料费');
                return;
            }
            if (materialCost == 1 && !unite) {
                message.warn('启用统一材料费时，请填写具体费用!');
                return;
            }
            if (materialCost == 2) {
                if (typeof newCost != 'number' || typeof oldCost != 'number') {
                    message.warn('启用新老学员不同时，请分别填写费用!');
                    return;
                }
            }
            if (
                materialCost == 3 &&
                classFeeModelList.find((item) => item.materialCost == undefined)
            ) {
                message.warn('启用按班级收费时，请分别填写费用!');
                return;
            }
            if (userSchoolId) {
                if (uploadStatus == 'uploading') {
                    message.info('封面正在上传中，请稍等！');
                    return;
                }
                if (courseCover == undefined) {
                    message.warn('请上传封面！');
                    return;
                }
            }

            params = {
                chooseCoursePlanId: this.state.planId,
                coursePlanningId: coursePlanId,
                coursePlanType: courseType, //开课类型
                admissionType: Enrollment, //招生条件
                conditionDescription: condition, //条件说明
                enConditionDescription: eCondition, //条件说明
                repeatRegistration: limit, //允许重复报名
                courseObjectives, //课程目标
                enCourseObjectives,
                courseContent, //课程内容
                enCourseContent,
                materialFeeType: materialCost || 0, //费用
                materialCost: materialCost == 1 ? unite : undefined,
                newMaterialCost: materialCost == 2 ? newCost : undefined, //新生
                oldMaterialCost: materialCost == 2 ? oldCost : undefined, //老生,
                coursePreparation, //课前准备
                enCoursePreparation,
                teacherIntroduction, //师资介绍
                enTeacherIntroduction: eTeacherName,
                pictureType: imageType,
                pictureUrlModelList: fileList,
                courseCover,
                teachingLanguage,
                languageRequirements,
                enLanguageRequirements,
                classFeeModelList,
            };
        } else if (chooseCourseDetails.courseIntroductionType == 1) {
            if (limit == undefined) {
                message.warn('请选择报名限制');
                return;
            }
            if (materialCost == undefined) {
                message.warn('请选择材料费');
                return;
            }
            if (materialCost == 1 && !unite) {
                message.warn('启用统一材料费时，请填写具体费用!');
                return;
            }
            if (materialCost == 2) {
                if (typeof newCost != 'number' || typeof oldCost != 'number') {
                    message.warn('启用新老学员不同时，请分别填写费用!');
                    return;
                }
            }
            if (
                materialCost == 3 &&
                classFeeModelList.find((item) => item.materialCost == undefined)
            ) {
                message.warn('启用按班级收费时，请分别填写费用!');
                return;
            }

            if (userSchoolId) {
                if (freeCourseCover == undefined) {
                    message.warn('请上传封面！');
                    return;
                }
                if (content == undefined) {
                    message.warn('请在富文本(中文)内填入内容!');
                    return;
                }
                if (freeUploadStatus == 'uploading') {
                    message.info('封面正在上传中，请稍等！');
                    return;
                }
            }

            params = {
                chooseCoursePlanId: this.state.planId,
                coursePlanningId: coursePlanId,
                repeatRegistration: limit,
                materialFeeType: materialCost || 0,
                materialCost: materialCost == 1 ? unite : undefined,
                newMaterialCost: materialCost == 2 ? newCost : undefined, //新生
                oldMaterialCost: materialCost == 2 ? oldCost : undefined, //老生,
                freePlateContent: content,
                enFreePlateContent: enContent,
                courseCover: freeCourseCover,
                teachingLanguage,
                languageRequirements,
                enLanguageRequirements,
                classFeeModelList,
            };
        }

        dispatch({
            type: 'course/updateCoursePlanning',
            payload: params,
            onSuccess: () => {
                let { getTableList, self } = this.props;
                self.props.getTableList();
                typeof getTableList === 'function' && getTableList.call(self);
                // this.onCancel();
                this.setState({
                    courseType: undefined,
                    Enrollment: undefined,
                    condition: '',
                    eCondition: '',
                    limit: undefined,
                    courseObjectives: '',
                    enCourseObjectives: '',
                    courseContent: '',
                    enCourseContent: '',
                    materialCost: undefined,
                    newCost: undefined,
                    oldCost: undefined,
                    coursePreparation: '',
                    enCoursePreparation: '',
                    teacherIntro: '',
                    eTeacherIntro: '',
                    ExternalTeachers: '',
                    eExternalTeachers: '',
                    teacherName: '',
                    eTeacherName: '',
                    imageType: undefined,
                    images: [],
                    fileList: [],
                    content: undefined,
                    enContent: undefined,
                    teacherValue: [],
                    courseName: '',
                    subject: '',
                    prevCourse: '',
                    teachingLanguage: undefined,
                    languageRequirements: undefined,
                    enLanguageRequirements: undefined,
                });
            },
        });
    };

    //处理教师数据
    formatTeacherData = (teacherList) => {
        if (!teacherList || teacherList.length < 0) return;
        let teacherData = [];
        teacherList.map((item) => {
            let obj = {};
            obj.title = item.name;
            obj.key = item.teacherId;
            obj.value = item.teacherId;
            obj.ename = item.englishName;
            teacherData.push(obj);
        });
        return teacherData;
    };

    isReReg = (e) => {
        this.setState({
            limit: e.target.value,
        });
    };

    getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    andleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    ifHaveUid = (uid) => {
        const { fileList } = this.state;
        let haveId = false;
        for (let i = 0; i < fileList.length; i++) {
            if (fileList[i] && fileList[i]['uid'] === uid) {
                haveId = true;
                break;
            }
        }
        return haveId;
    };

    replaceFileList = (res, uid, index) => {
        let newFile = JSON.parse(JSON.stringify(this.state.fileList));
        for (let i = 0; i < newFile.length; i++) {
            if (newFile[i]['uid'] === uid) {
                newFile[i] = res;
                break;
            }
        }
        // newFile[index] = res;
        this.setState({
            fileList: newFile,
        });
    };

    uploadFile = (info, index) => {
        let file = info.file;
        // let fileList = JSON.parse(JSON.stringify(this.state.fileList));
        // if (!this.ifHaveUid(file.uid)) {
        //     // fileList.push(file);
        //     fileList[index] = file;
        // }
        // this.setState({
        //     fileList,
        // });
        if (file && file.status === 'done') {
            const response = file.response?.content ? file.response.content[0] : [];
            let fileList = JSON.parse(JSON.stringify(this.state.fileList));
            let resFile = {
                url: response.url,
                uid: file.uid,
                name: response.fileName,
            };
            fileList[index] = resFile;
            this.setState({
                fileList,
            });
            // this.replaceFileList(resFile, file.uid, index);
        }
    };

    removeImg = (a, index) => {
        let newImgs = this.state.fileList;
        newImgs[index] = null;
        this.setState({
            fileList: newImgs,
        });
    };

    changeCourseType = (e) => {
        this.setState({
            courseType: e.target.value,
        });
    };
    changeEnrollment = (e) => {
        this.setState({
            Enrollment: e.target.value,
        });
    };
    changeCost = (e) => {
        this.setState({
            materialCost: e.target.value,
        });
    };
    changeImgType = (e) => {
        this.setState({
            imageType: e.target.value,
            fileList: [],
        });
    };

    handleEditorChange = (content) => {
        this.setState({
            content,
        });
    };

    handleEnEditorChange = (content) => {
        this.setState({
            enContent: content,
        });
    };

    base64toFile = (dataurl, filename = 'file') => {
        let arr = dataurl.split(',');
        console.log('arr', arr);
        let mime = arr[0].match(/:(.*?);/)[1];
        console.log('mine', mine);
        let suffix = mime.split('/')[1];
        console.log('suffix', suffix);
        let bstr = atob(arr[1]);
        console.log('bstr', bstr);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }

        return new File([u8arr], `${filename}.${suffix}`, {
            type: mime,
        });
    };

    //支持复制粘贴word文档中的图片
    uploadPasteWordImg = (blobInfo, callback) => {
        let uuid = new Date().getTime();
        this.getOssAssume().then(() => {
            const { ossAssumeResult, dispatch } = this.props;
            let OSS = require('ali-oss');
            let newBinary = blobInfo.blob();
            let client = new OSS({
                region: ossAssumeResult.region,
                accessKeyId: ossAssumeResult.accessKeyId,
                accessKeySecret: ossAssumeResult.accessSecret,
                bucket: ossAssumeResult.bucketName,
                endpoint: ossAssumeResult.endpoint,
                stsToken: ossAssumeResult.stsToken,
                ossPath: ossAssumeResult.ossPath,
            });
            let newDataUrl = this.dataURLtoFile(blobInfo.base64(), newBinary.type, '');
            console.log('newDataUrl', newDataUrl);
            client
                .multipartUpload(
                    `${ossAssumeResult.ossPath}${uuid}_${blobInfo.filename()}`,
                    // newBinary,
                    newDataUrl,
                    {}
                )
                .then((response) => {
                    if (response.res && response.res.status == '200') {
                        let origin = ossAssumeResult.endpoint.split('//')[1];
                        let fileUrl = `https://${ossAssumeResult.bucketName}.${origin}/${
                            ossAssumeResult.ossPath
                        }${uuid}_${blobInfo.filename()}?x-oss-process=image/resize,w_800`;
                        typeof callback == 'function' && callback(fileUrl);
                    } else {
                        message.error('上传失败');
                    }
                })
                .catch((err) => {
                    console.log('catch_error:', err.message);
                    message.error('哎呀，oss出错了');
                });
        });
    };

    getOssAssume() {
        const { dispatch } = this.props;
        return dispatch({
            type: 'global/getOssAssume',
            payload: {
                type: '',
            },
        });
    }

    dataURLtoFile = (newUrl, urlType, filename) => {
        /* let arr = newUrl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), */
        let bstr = atob(newUrl);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        console.log('arr', 11);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: urlType });
    };

    uploadImage = (files, callback) => {
        for (let i = 0; i < files.length; i++) {
            files[i]['uuid'] = new Date().getTime() + i;
            this.readFile(files[i], (responseFile) => {
                if (responseFile['uuid'] == files[i]['uuid']) {
                    let imageList = [{ url: `${window.location.origin}${responseFile.url}` }];
                    typeof callback == 'function' && callback.call(this, imageList);
                }
            });
        }
    };

    uploadMedia = (files, callback) => {
        for (let i = 0; i < files.length; i++) {
            files[i]['uuid'] = new Date().getTime() + i;
            this.readFile(files[i], (responseFile) => {
                if (responseFile['uuid'] == files[i]['uuid']) {
                    console.log('responseFile', responseFile);
                    let videoList = [
                        {
                            url: `${window.location.origin}${responseFile.url}`,
                            attr: {
                                poster: `${window.location.origin}${responseFile.previewImage}`,
                            },
                        },
                    ];
                    typeof callback == 'function' && callback.call(this, videoList);
                }
            });
        }
    };

    uploadEnMedia = (files, callback) => {
        for (let i = 0; i < files.length; i++) {
            files[i]['uuid'] = new Date().getTime() + i;
            this.readFile(files[i], (responseFile) => {
                if (responseFile['uuid'] == files[i]['uuid']) {
                    let videoList = [
                        {
                            url: `${window.location.origin}${responseFile.url}`,
                            attr: {
                                poster: `${window.location.origin}${responseFile.previewImage}`,
                            },
                        },
                    ];
                    typeof callback == 'function' && callback.call(this, videoList);
                }
            });
        }
    };

    uploadEnImage = (files, callback) => {
        for (let i = 0; i < files.length; i++) {
            files[i]['uuid'] = new Date().getTime() + i;
            this.readFile(files[i], (responseFile) => {
                if (responseFile['uuid'] == files[i]['uuid']) {
                    let imageList = [{ url: `${window.location.origin}${responseFile.url}` }];
                    typeof callback == 'function' && callback.call(this, imageList);
                }
            });
        }
    };

    readFile = (file, callback) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let self = this;
        reader.onloadend = function () {
            let data = new FormData();
            data.append('fileList', file);
            self.props.dispatch({
                type: '/course/uploadImages',
                payload: data,
                onSuccess: (response) => {
                    response.uuid = file.uuid;
                    callback && callback(response);
                },
            });
            self.uploadToOss(file, (res) => {
                typeof callback == 'function' && callback(res);
            });
        };
    };

    uploadToOss = (files, callback) => {
        this.getOssAssume().then(() => {
            const { ossAssumeResult, dispatch } = this.props;
            let OSS = require('ali-oss');
            let client = new OSS({
                region: ossAssumeResult.region,
                accessKeyId: ossAssumeResult.accessKeyId,
                accessKeySecret: ossAssumeResult.accessSecret,
                bucket: ossAssumeResult.bucketName,
                endpoint: ossAssumeResult.endpoint,
                stsToken: ossAssumeResult.stsToken,
                ossPath: ossAssumeResult.ossPath,
            });
            client
                .multipartUpload(`${ossAssumeResult.ossPath}${files.uuid}_${files.name}`, files, {})
                .then((response) => {
                    if (response.res && response.res.status == '200') {
                        let fileUrl = `${ossAssumeResult.ossPath}${files.uuid}_${files.name}`;
                        dispatch({
                            type: 'global/payloadUploadFile',
                            payload: {
                                fileName: files.name,
                                bucketName: ossAssumeResult.bucketName,
                                fileSize: files.size || 0,
                                fileType: files.type || '',
                                fileUrl: fileUrl,
                                percent: 100,
                                uuid: files.uuid,
                            },
                            onSuccess: () => {
                                const { uploadFileResponse } = this.props;
                                typeof callback == 'function' && callback(uploadFileResponse);
                            },
                        });
                    } else {
                        message.error('上传失败');
                    }
                })
                .catch((err) => {
                    message.error('哎呀，oss出错了');
                });
        });
    };

    getOssAssume() {
        const { dispatch } = this.props;
        return dispatch({
            type: 'global/getOssAssume',
            payload: {
                type: '',
            },
        });
    }

    changeCondition = (e) => {
        this.setState({
            condition: e.target.value,
        });
    };

    noToChinese = (num) => {
        if (!/^\d*(\.\d*)?$/.test(num)) {
            alert('Number is wrong!');
            return 'Number is wrong!';
        }
        // eslint-disable-next-line no-array-constructor
        var AA = new Array('零', '一', '二', '三', '四', '五', '六', '七', '八', '九');
        // eslint-disable-next-line no-array-constructor
        var BB = new Array('', '十', '百', '千', '万', '亿', '点', '');
        var a = ('' + num).replace(/(^0*)/g, '').split('.'),
            k = 0,
            re = '';
        for (var i = a[0].length - 1; i >= 0; i--) {
            // eslint-disable-next-line default-case
            switch (k) {
                case 0:
                    re = BB[7] + re;
                    break;
                case 4:
                    if (!new RegExp('0{4}\\d{' + (a[0].length - i - 1) + '}$').test(a[0]))
                        re = BB[4] + re;
                    break;
                case 8:
                    re = BB[5] + re;
                    BB[7] = BB[5];
                    k = 0;
                    break;
            }
            if (k % 4 == 2 && a[0].charAt(i + 2) != 0 && a[0].charAt(i + 1) == 0) re = AA[0] + re;
            if (a[0].charAt(i) != 0) re = AA[a[0].charAt(i)] + BB[k % 4] + re;
            k++;
        }
        if (a.length > 1) {
            //加上小数部分(如果有小数部分)
            re += BB[6];
            for (var i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i)];
        }
        return re;
    };

    delImg = (index) => {
        let newFileList = this.state.fileList;
        newFileList[index] = null;
        this.setState({
            fileList: newFileList,
        });
    };

    //文件上传
    upload = (file) => {
        this.setState({
            courseCover: file.previewImage,
            uploadStatus: file.status,
        });
        /**
         *file.status == "uploading",上传中逻辑判断可用此状态写
         *file.status == "done",上传成功逻辑判断可用此状态写
         *file.fileSize, 文件大小
         *file.fileName, 文件名称
         *file.uuid, 动态创建的文件唯一id
         *file.percent, 文件上传的进度
         *file.fileType, 文件类型
         *file.previewImage, 文件预览图片
         */
    };

    freeUpload = (file) => {
        this.setState({
            freeCourseCover: file.previewImage,
            freeUploadStatus: file.status,
        });
    };

    universalChange = (realValue, e) => {
        this.setState({
            [realValue]: e.target.value,
        });
    };

    classFeeModelListChange = (value, groupId) => {
        const { classFeeModelList } = this.state;
        this.setState({
            classFeeModelList: classFeeModelList.map((item) => {
                if (groupId === item.groupId) {
                    return {
                        ...item,
                        materialCost: Number(value),
                    };
                } else {
                    return item;
                }
            }),
        });
    };

    getGroupName = (sourceGroupName) => {
        const { courseName } = this.state;
        if (sourceGroupName.includes(courseName) && sourceGroupName !== courseName) {
            return sourceGroupName.split(courseName)[1].trimStart();
        }
        return sourceGroupName;
    };

    render() {
        let {
            visibleEditCourseInfor,
            chooseCourseDetails,
            showCoursePlanningDetail,
            form: { getFieldDecorator },
            currentUser,
            userSchoolId,
        } = this.props;
        let schoolId = currentUser.schoolId;
        let {
            courseName,
            subject,
            prevCourse,
            courseType,
            Enrollment,
            condition,
            eCondition,
            limit,
            courseObjectives,
            enCourseObjectives,
            courseContent,
            enCourseContent,
            materialCost,
            coursePreparation,
            enCoursePreparation,
            teacherIntro,
            eTeacherIntro,
            ExternalTeachers,
            eExternalTeachers,
            teacherName,
            eTeacherName,
            imageType,
            courseCover,
            freeCourseCover,
            previewVisible,
            previewImage,
            fileList,
            newCost,
            oldCost,
            unite,
            preVisible,
            teachingLanguage,
            languageRequirements,
            enLanguageRequirements,
            classFeeModelList,
        } = this.state;

        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        const teacheringLanguage = [
            {
                id: 'CHINESE_LESSONS',
                name: '中文授课',
                eName: 'Chinese',
            },
            {
                id: 'FOREIGN_TEACHER_LESSONS',
                name: '英文授课',
                eName: 'English',
            },
            {
                id: 'BILINGUAL_LESSONS',
                name: '双语授课',
                eName: 'Billangual',
            },
        ];

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };

        return (
            <>
                <Modal
                    title={
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                lineHeight: '40px',
                                position: 'sticky',
                            }}
                        >
                            <span onClick={this.onCancel} style={{ cursor: 'pointer' }}>
                                <Icon type="close" />
                            </span>
                            <span
                                style={{
                                    marginLeft:
                                        chooseCourseDetails?.courseIntroductionType == 0
                                            ? '240px'
                                            : '130px',
                                }}
                            >
                                {trans('global.setCourseInformation', '设置课程信息')}
                            </span>
                            <span>
                                {chooseCourseDetails?.courseIntroductionType == 0 ? (
                                    <Button
                                        type="primary"
                                        style={{ width: '100px' }}
                                        onClick={this.editPreview}
                                    >
                                        {trans('student.preview', '预览')}
                                    </Button>
                                ) : (
                                    ''
                                )}
                                &nbsp;&nbsp;
                                <Button
                                    type="primary"
                                    style={{ width: '100px' }}
                                    onClick={this.editCourseOk}
                                >
                                    {trans('global.save', '保存')}
                                </Button>
                            </span>
                        </div>
                    }
                    style={{ top: 0 }}
                    className={styles.editInfo}
                    visible={visibleEditCourseInfor}
                    footer={null}
                    maskClosable={false}
                    closable={false}
                    // okText={trans('global.save', '保存')}
                    // cancelText={trans('global.cancel', '取消')}
                >
                    <div className={styles.top}>
                        <span>
                            <b>{trans('planDetail.course.name', '课程名称')}:</b>
                            {courseName}
                        </span>
                        <span>
                            <b>{trans('teacher.employeeRole', '所属类别')}:</b>
                            {subject}
                        </span>
                        <span>
                            {prevCourse ? (
                                <Popover
                                    trigger="hover"
                                    content={
                                        <div>
                                            {showCoursePlanningDetail &&
                                                showCoursePlanningDetail.prefaceCourseList?.map(
                                                    (item, index) => {
                                                        return <p>{item.name}</p>;
                                                    }
                                                )}
                                        </div>
                                    }
                                >
                                    <b>{trans('courseSet.prevCourse', '前序课程')}:</b>
                                    {prevCourse}
                                    {showCoursePlanningDetail?.prefaceCourseList &&
                                    showCoursePlanningDetail.prefaceCourseList.length > 2
                                        ? '...'
                                        : ''}
                                </Popover>
                            ) : (
                                ''
                            )}
                        </span>
                    </div>
                    {chooseCourseDetails.courseIntroductionType == 0 ? (
                        <div className={styles.content}>
                            <p className={locale() == 'cn' ? styles.contentP : styles.contentEnP}>
                                <span>
                                    {trans('global.Course Type', '开课类型')}
                                    <i style={{ color: 'red' }}>*</i>
                                </span>
                                <Radio.Group onChange={this.changeCourseType} value={courseType}>
                                    <Radio value={0}>{trans('course.plan.newClass', '新课')}</Radio>
                                    <Radio value={1}>{trans('course.plan.advanced', '进阶')}</Radio>
                                    {!userSchoolId ? (
                                        <Radio value={2}>
                                            {trans('course.plan.schoolTeam', '校队')}
                                        </Radio>
                                    ) : null}
                                </Radio.Group>
                            </p>
                            <p className={locale() == 'cn' ? styles.contentP : styles.contentEnP}>
                                <span>
                                    {trans('global.admissionsConditions', '招生条件')}
                                    <i style={{ color: 'red' }}>*</i>
                                </span>
                                <Radio.Group onChange={this.changeEnrollment} value={Enrollment}>
                                    <Radio value={0}>
                                        {trans('global.Zero basis for new', '零基础纳新')}
                                    </Radio>
                                    <Radio value={1}>
                                        {trans('global.Conditional admission', '有条件纳新')}
                                    </Radio>
                                    <Radio value={2} disabled={courseType == 0 ? true : false}>
                                        {trans('global.not accept new', '不纳新')}
                                    </Radio>
                                </Radio.Group>
                            </p>
                            {Enrollment == 1 ? (
                                <p
                                    className={
                                        locale() == 'cn' ? styles.contentP : styles.contentEnP
                                    }
                                >
                                    <span style={{ lineHeight: '32px' }}>
                                        {trans('global.Condition Description', '条件说明')}
                                    </span>
                                    <div style={{ width: '77%' }}>
                                        <Input
                                            placeholder={trans(
                                                'global.Description of admission conditions',
                                                '招生条件说明'
                                            )}
                                            value={condition}
                                            // suffix={condition.length + '/15'}
                                            suffix={condition ? condition.length + '/15' : '0/15'}
                                            // style={{borderColor:condition && condition.length>15 ? }}
                                            // maxLength={15}
                                            className={styles.inputCodition}
                                            onChange={(e) => {
                                                this.setState({
                                                    condition: e.target.value,
                                                });
                                            }}
                                        ></Input>
                                        <Input
                                            placeholder={trans(
                                                'global.enDescription',
                                                '招生条件说明(英文模版非必填)'
                                            )}
                                            value={eCondition}
                                            // suffix={eCondition.length + '/15'}
                                            suffix={eCondition ? eCondition.length + '/15' : '0/15'}
                                            // style={{borderColor:eCondition && eCondition.length>15 ? }}
                                            // maxLength={15}
                                            className={styles.inputCodition}
                                            style={{ marginTop: '15px' }}
                                            onChange={(e) => {
                                                this.setState({
                                                    eCondition: e.target.value,
                                                });
                                            }}
                                        ></Input>
                                    </div>
                                </p>
                            ) : (
                                ''
                            )}

                            {userSchoolId ? (
                                <>
                                    <p
                                        className={
                                            locale() == 'cn' ? styles.contentP : styles.contentEnP
                                        }
                                    >
                                        <span style={{ paddingLeft: '2px', lineHeight: '36px' }}>
                                            {trans('mobile.teachingLanguage', '授课语言')}
                                        </span>
                                        {/* <Input
                                            placeholder="例：全英文、纯外教"
                                            onChange={(e) =>
                                                this.universalChange('teachingLanguage', e)
                                            }
                                            value={teachingLanguage}
                                            style={{ width: '250px' }}
                                        /> */}
                                        <Select
                                            placeholder="请选择授课语言"
                                            value={teachingLanguage}
                                            style={{ width: 150 }}
                                            onChange={(e) =>
                                                this.setState({
                                                    teachingLanguage: e,
                                                })
                                            }
                                        >
                                            {teacheringLanguage.map((item, index) => {
                                                return (
                                                    <Option value={item.id} key={item.id}>
                                                        {locale() == 'en' ? item.eName : item.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </p>
                                    <p
                                        className={
                                            locale() == 'cn' ? styles.contentP : styles.contentEnP
                                        }
                                        style={{ display: 'flex' }}
                                    >
                                        <span style={{ paddingLeft: '2px', lineHeight: '36px' }}>
                                            {trans('mobile.languageRequirements', '英文要求')}
                                        </span>
                                        <div style={{ display: 'inline-block' }}>
                                            <Input
                                                placeholder="请输入英文要求（中文模版）"
                                                onChange={(e) =>
                                                    this.universalChange('languageRequirements', e)
                                                }
                                                value={languageRequirements}
                                                style={{ width: '250px', marginBottom: '15px' }}
                                            />
                                            <br />
                                            <Input
                                                placeholder="请输入英文要求（英文模版）"
                                                onChange={(e) =>
                                                    this.universalChange(
                                                        'enLanguageRequirements',
                                                        e
                                                    )
                                                }
                                                value={enLanguageRequirements}
                                                style={{ width: '250px' }}
                                            />
                                        </div>
                                    </p>
                                </>
                            ) : (
                                ''
                            )}

                            <p className={locale() == 'cn' ? styles.contentP : styles.contentEnP}>
                                <span>
                                    {trans('global.registration Restrictions', '报名限制')}
                                    <i style={{ color: 'red' }}>*</i>
                                </span>
                                <Radio.Group
                                    onChange={this.isReReg}
                                    value={limit}
                                    style={{ width: '75%' }}
                                >
                                    <Radio value={0}>
                                        {trans(
                                            'global.registration is prohibited',
                                            '禁止已上/已报名学生再次报名'
                                        )}
                                    </Radio>
                                    <Radio value={1}>
                                        {trans(
                                            'global.registration allowed',
                                            '允许已上/已报名学生再次报名'
                                        )}
                                    </Radio>
                                </Radio.Group>
                            </p>
                            <p
                                className={locale() == 'cn' ? styles.contentP : styles.contentEnP}
                                style={{ position: 'relative' }}
                            >
                                <span>
                                    {trans('mobile.courseObjectives', '课程目标')}
                                    <i style={{ color: 'red' }}>*</i>
                                </span>
                                <div style={{ width: '75%' }}>
                                    <p>
                                        <TextArea
                                            className={styles.textarea}
                                            rows={4}
                                            value={courseObjectives}
                                            suffix={
                                                courseObjectives && courseObjectives.length + '/200'
                                            }
                                            placeholder={trans(
                                                'global.cnCourseObjectives',
                                                '请填写课程目标中文版'
                                            )}
                                            // maxLength={200}
                                            // style={{ wordRrap: 'break-word', overflowX: 'hidden' }}
                                            onChange={(e) => {
                                                this.setState({
                                                    courseObjectives: e.target.value,
                                                });
                                            }}
                                        ></TextArea>
                                        <i className={styles.maxLength}>
                                            {courseObjectives && courseObjectives.length}/200
                                        </i>
                                    </p>
                                    <p>
                                        <TextArea
                                            className={styles.textarea}
                                            rows={4}
                                            value={enCourseObjectives}
                                            suffix={
                                                enCourseObjectives &&
                                                enCourseObjectives.length + '/200'
                                            }
                                            // maxLength={200}
                                            // style={{ wordRrap: 'break-word', overflowX: 'hidden' }}
                                            placeholder={trans(
                                                'global.enCourseObjectives',
                                                '请填写课程目标英文模板（非必填）'
                                            )}
                                            onChange={(e) => {
                                                this.setState({
                                                    enCourseObjectives: e.target.value,
                                                });
                                            }}
                                        ></TextArea>
                                        <i className={styles.maxLength} style={{ top: '12.5em' }}>
                                            {enCourseObjectives && enCourseObjectives.length}/200
                                        </i>
                                    </p>
                                </div>
                            </p>
                            <p
                                className={locale() == 'cn' ? styles.contentP : styles.contentEnP}
                                style={{ position: 'relative' }}
                            >
                                <span>
                                    {trans('mobile.content', '课程内容')}
                                    <i style={{ color: 'red' }}>*</i>
                                </span>
                                <div style={{ width: '75%' }}>
                                    <p>
                                        <TextArea
                                            className={styles.textarea}
                                            rows={4}
                                            value={courseContent}
                                            suffix={courseContent && courseContent.length + '/200'}
                                            // maxLength={200}
                                            placeholder={trans(
                                                'global.cnContent',
                                                '请填写课程介绍中文版'
                                            )}
                                            onChange={(e) => {
                                                this.setState({
                                                    courseContent: e.target.value,
                                                });
                                            }}
                                            // autoSize={true}
                                        ></TextArea>
                                        <i className={styles.maxLength}>
                                            {courseContent && courseContent.length}/200
                                        </i>
                                    </p>
                                    <p>
                                        <TextArea
                                            className={styles.textarea}
                                            rows={4}
                                            value={enCourseContent}
                                            suffix={
                                                enCourseContent && enCourseContent.length + '/200'
                                            }
                                            placeholder={trans(
                                                'mobile.enContent',
                                                '请填写课程内容英文模板（非必填）'
                                            )}
                                            // maxLength={200}
                                            onChange={(e) => {
                                                this.setState({
                                                    enCourseContent: e.target.value,
                                                });
                                            }}
                                            // autoSize={true}
                                        ></TextArea>
                                        <i className={styles.maxLength} style={{ top: '12.5em' }}>
                                            {enCourseContent && enCourseContent.length}/200
                                        </i>
                                    </p>
                                </div>
                            </p>
                            {/* {userSchoolId ? null : ( */}
                            <p className={locale() == 'cn' ? styles.contentP : styles.contentEnP}>
                                <span>
                                    {trans('tc.base.material.cost', '材料费')}
                                    <i style={{ color: 'red' }}>*</i>
                                </span>
                                <Radio.Group onChange={this.changeCost} value={materialCost}>
                                    <Radio value={0}>
                                        {trans('global.No material fee', '无材料费')}
                                    </Radio>
                                    <br />
                                    <div style={{ display: 'flex', marginBottom: '-24px' }}>
                                        <Radio
                                            value={1}
                                            style={{ height: '32px', lineHeight: '32px' }}
                                        >
                                            {trans('global.flat material fee', '统一材料费')}
                                        </Radio>
                                        {materialCost == 1 ? (
                                            <p style={{ marginLeft: '30px', marginBottom: 0 }}>
                                                <span style={{ display: 'inline-block' }}>
                                                    {trans('tc.base.material.cost', '材料费')}
                                                    <Input
                                                        value={unite}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                unite: Number(e.target.value),
                                                            })
                                                        }
                                                        style={{ width: '60px' }}
                                                    ></Input>
                                                    {trans('tc.base.yuan.period', '元/期')}
                                                </span>
                                            </p>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                    <br />
                                    {userSchoolId ? null : (
                                        <div style={{ display: 'flex' }}>
                                            <Radio
                                                value={2}
                                                style={{ height: '32px', lineHeight: '32px' }}
                                            >
                                                {trans(
                                                    'global.New and old students',
                                                    '新老学员不同'
                                                )}
                                            </Radio>
                                            {materialCost == 2 ? (
                                                <p
                                                    style={{
                                                        marginLeft: '30px',
                                                        marginBottom: 0,
                                                    }}
                                                >
                                                    <span style={{ display: 'inline-block' }}>
                                                        {trans('global.new student', '新学员')}
                                                        <Input
                                                            value={newCost}
                                                            onChange={(e) =>
                                                                this.setState({
                                                                    newCost: Number(e.target.value),
                                                                })
                                                            }
                                                            style={{ width: '60px' }}
                                                        ></Input>
                                                        {trans('tc.base.yuan.period', '元/期')}
                                                    </span>
                                                    &nbsp;&nbsp;
                                                    <span>
                                                        {trans('global.old student', '老学员')}
                                                        <Input
                                                            value={oldCost}
                                                            onChange={(e) =>
                                                                this.setState({
                                                                    oldCost: Number(e.target.value),
                                                                })
                                                            }
                                                            style={{ width: '60px' }}
                                                        ></Input>
                                                        {trans('tc.base.yuan.period', '元/期')}
                                                    </span>
                                                </p>
                                            ) : (
                                                ''
                                            )}
                                            <br />
                                        </div>
                                    )}
                                    {userSchoolId ? null : (
                                        <div style={{ display: 'flex' }}>
                                            <Radio
                                                value={3}
                                                style={{ height: '32px', lineHeight: '32px' }}
                                            >
                                                按班级收费
                                            </Radio>
                                            {materialCost == 3 ? (
                                                <p className={styles.classFeeModelList}>
                                                    {classFeeModelList?.map((item) => (
                                                        <span className={styles.feeItem}>
                                                            <span>
                                                                {/* {item.groupName} */}
                                                                {this.getGroupName(item.groupName)}
                                                            </span>
                                                            <InputNumber
                                                                style={{ width: '80px' }}
                                                                onChange={(value) =>
                                                                    this.classFeeModelListChange(
                                                                        value,
                                                                        item.groupId
                                                                    )
                                                                }
                                                                placeholder={trans(
                                                                    'global.Please enter the lesson fee',
                                                                    '请输入课时费'
                                                                )}
                                                                value={item.materialCost}
                                                            ></InputNumber>
                                                            <span>元/期</span>
                                                        </span>
                                                    ))}
                                                </p>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    )}
                                </Radio.Group>
                            </p>
                            {/* )} */}
                            <p
                                className={locale() == 'cn' ? styles.contentP : styles.contentEnP}
                                style={{ position: 'relative' }}
                            >
                                <span>{trans('mobile.preparation', '课前准备')}</span>
                                <div style={{ width: '75%' }}>
                                    <p>
                                        <TextArea
                                            className={styles.textarea}
                                            placeholder={trans(
                                                'global.preparation before',
                                                '填写参考：1、学员须具备哪些基本条件，如过往学习经历、能力水平等；2、须提前准备的装备，如服装、乐器、工具等（不包含在材料费中）。另外请说明购买方式（课前自行购买，或开课后任课老师统计后统一购买）；3、若须提前与指定老师确认是否符合报名条件，请在此处说明'
                                            )}
                                            rows={4}
                                            value={coursePreparation}
                                            suffix={
                                                coursePreparation &&
                                                coursePreparation.length + '/200'
                                            }
                                            // maxLength={200}
                                            onChange={(e) => {
                                                this.setState({
                                                    coursePreparation: e.target.value,
                                                });
                                            }}
                                        ></TextArea>
                                        <i className={styles.maxLength}>
                                            {coursePreparation && coursePreparation.length}/200
                                        </i>
                                    </p>
                                    <p>
                                        <TextArea
                                            className={styles.textarea}
                                            placeholder={trans(
                                                'global.enPreparation before',
                                                '请填写课前准备英文模板（非必填）'
                                            )}
                                            rows={4}
                                            value={enCoursePreparation}
                                            suffix={
                                                enCoursePreparation &&
                                                enCoursePreparation.length + '/200'
                                            }
                                            // maxLength={200}
                                            onChange={(e) => {
                                                this.setState({
                                                    enCoursePreparation: e.target.value,
                                                });
                                            }}
                                        ></TextArea>
                                        <i className={styles.maxLength} style={{ top: '12.5em' }}>
                                            {enCoursePreparation && enCoursePreparation.length}/200
                                        </i>
                                    </p>
                                </div>
                            </p>
                            <p
                                className={locale() == 'cn' ? styles.contentP : styles.contentEnP}
                                style={{ position: 'relative' }}
                            >
                                <span>{trans('mobile.intro', '师资介绍')}</span>
                                <div className={styles.teacherInfo}>
                                    <p>
                                        <span
                                            style={{
                                                marginLeft: '10px',
                                                lineHeight: '36px',
                                            }}
                                        >
                                            {trans('global.ourTeachers', '本校教师')}:
                                        </span>
                                        <Input
                                            style={{ border: 0 }}
                                            value={teacherIntro}
                                            placeholder={trans(
                                                'global.teacher description',
                                                '在此输入教师名字,不同教师之间请用空格间隔'
                                            )}
                                            onChange={(e) =>
                                                this.setState({ teacherIntro: e.target.value })
                                            }
                                        ></Input>
                                    </p>
                                    <p>
                                        <span style={{ marginLeft: '10px', lineHeight: '36px' }}>
                                            {trans('mobile.externalTeacher', '外聘教师：')}
                                        </span>
                                        <Input
                                            style={{ border: 0 }}
                                            value={ExternalTeachers}
                                            placeholder={trans(
                                                'global.teacher description',
                                                '在此输入教师名字,不同教师之间请用空格间隔'
                                            )}
                                            onChange={(e) =>
                                                this.setState({ ExternalTeachers: e.target.value })
                                            }
                                        ></Input>
                                    </p>
                                    <TextArea
                                        className={styles.textarea}
                                        rows={4}
                                        placeholder={trans(
                                            'global.teacher introduction',
                                            '请填写教师详细介绍'
                                        )}
                                        value={teacherName}
                                        suffix={teacherName && teacherName.length + '/200'}
                                        // maxLength={200}
                                        onChange={(e) => {
                                            this.setState({
                                                teacherName: e.target.value,
                                            });
                                        }}
                                    ></TextArea>
                                    <i className={styles.teacherLength} style={{ bottom: '9em' }}>
                                        {teacherName && teacherName.length}/200
                                    </i>
                                    <TextArea
                                        className={styles.textarea}
                                        style={{ marginTop: '15px' }}
                                        rows={4}
                                        placeholder={trans(
                                            'global.teacher details',
                                            '请填写教师详细介绍（英文模版非必填）'
                                        )}
                                        value={eTeacherName}
                                        suffix={eTeacherName && eTeacherName.length + '/200'}
                                        // maxLength={200}
                                        onChange={(e) => {
                                            this.setState({
                                                eTeacherName: e.target.value,
                                            });
                                        }}
                                    ></TextArea>
                                    <i className={styles.teacherLength}>
                                        {eTeacherName && eTeacherName.length}/200
                                    </i>
                                </div>
                            </p>
                            <p className={locale() == 'cn' ? styles.contentP : styles.contentEnP}>
                                <span>{trans('global.Image layout', '图片版式')}</span>
                                <div>
                                    <p className={styles.imgType}>
                                        <img src={ooo} alt="" />
                                        <img src={oot} alt="" />
                                        <img src={tt} alt="" />
                                    </p>
                                    <p>
                                        <Radio.Group
                                            onChange={this.changeImgType}
                                            value={imageType}
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <Radio value={1}>
                                                {trans('global.Image layout One', '3张横图')}
                                            </Radio>
                                            <Radio value={2}>
                                                {trans(
                                                    'global.Image layout Two',
                                                    '2张横图,一张竖图'
                                                )}
                                            </Radio>
                                            <Radio value={3}>
                                                {trans('global.Image layout Three', '2张竖图')}
                                            </Radio>
                                        </Radio.Group>
                                    </p>
                                </div>
                            </p>
                            <p className={locale() == 'cn' ? styles.contentP : styles.contentEnP}>
                                <span>{trans('global.upload image', '上传图片')}</span>
                                <div className={styles.clearfix}>
                                    {imageType ? (
                                        <>
                                            {fileList &&
                                            fileList.length >= 1 &&
                                            fileList[0] != null ? (
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        position: 'relative',
                                                        width: '196px',
                                                        height:
                                                            imageType == 1
                                                                ? '164px'
                                                                : imageType == 2
                                                                ? '116px'
                                                                : imageType == 3
                                                                ? '253px'
                                                                : '',
                                                    }}
                                                >
                                                    <img
                                                        style={{
                                                            display: 'inline-block',
                                                            width: '196px',
                                                            height:
                                                                imageType == 1
                                                                    ? '164px'
                                                                    : imageType == 2
                                                                    ? '116px'
                                                                    : imageType == 3
                                                                    ? '253px'
                                                                    : '',
                                                            marginRight: '10px',
                                                        }}
                                                        src={
                                                            fileList[0].url != ''
                                                                ? window.location.origin +
                                                                  fileList[0].url
                                                                : ''
                                                        }
                                                        alt=""
                                                    ></img>
                                                    <Icon
                                                        type="close-circle"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-7px',
                                                            right: '-7px',
                                                        }}
                                                        onClick={() => this.delImg(0)}
                                                    />
                                                </span>
                                            ) : (
                                                <ImgCrop
                                                    rotate
                                                    aspect={
                                                        imageType == 1
                                                            ? 196 / 164
                                                            : imageType == 2
                                                            ? 196 / 116
                                                            : imageType == 3
                                                            ? 196 / 253
                                                            : ''
                                                    }
                                                    className={styles.imgCrop}
                                                >
                                                    <Upload
                                                        className={
                                                            imageType == 1
                                                                ? styles.mSize
                                                                : imageType == 2
                                                                ? styles.sSize
                                                                : imageType == 3
                                                                ? styles.lSize
                                                                : ''
                                                        }
                                                        action="/api/upload_file"
                                                        listType="picture-card"
                                                        onPreview={this.handlePreview}
                                                        onChange={(info) =>
                                                            this.uploadFile(info, 0)
                                                        }
                                                        // onRemove={(file) => this.removeImg(file, 0)}
                                                        maxCount={1}
                                                    >
                                                        {fileList &&
                                                        fileList.length >= 1 &&
                                                        fileList[0] != null
                                                            ? null
                                                            : uploadButton}
                                                    </Upload>
                                                </ImgCrop>
                                            )}

                                            {fileList &&
                                            fileList.length >= 2 &&
                                            fileList[1] != null ? (
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        position: 'relative',
                                                        width: '196px',
                                                        height:
                                                            imageType == 1
                                                                ? '164px'
                                                                : imageType == 2
                                                                ? '116px'
                                                                : imageType == 3
                                                                ? '253px'
                                                                : '',
                                                        margin: '0 10px',
                                                    }}
                                                >
                                                    <img
                                                        style={{
                                                            display: 'inline-block',
                                                            width: '196px',
                                                            height:
                                                                imageType == 1
                                                                    ? '164px'
                                                                    : imageType == 2
                                                                    ? '116px'
                                                                    : imageType == 3
                                                                    ? '253px'
                                                                    : '',
                                                            marginLeft: '10px',
                                                        }}
                                                        src={
                                                            fileList[1].url != ''
                                                                ? window.location.origin +
                                                                  fileList[1].url
                                                                : ''
                                                        }
                                                        alt=""
                                                    ></img>
                                                    <Icon
                                                        type="close-circle"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-7px',
                                                            right: '-16px',
                                                        }}
                                                        onClick={() => this.delImg(1)}
                                                    />
                                                </span>
                                            ) : (
                                                <ImgCrop
                                                    rotate
                                                    aspect={
                                                        imageType == 1
                                                            ? 196 / 164
                                                            : imageType == 2
                                                            ? 196 / 116
                                                            : imageType == 3
                                                            ? 196 / 253
                                                            : ''
                                                    }
                                                >
                                                    <Upload
                                                        className={
                                                            imageType == 1
                                                                ? styles.mSize
                                                                : imageType == 2
                                                                ? styles.sSize
                                                                : imageType == 3
                                                                ? styles.lSize
                                                                : ''
                                                        }
                                                        action="/api/upload_file"
                                                        listType="picture-card"
                                                        onPreview={this.handlePreview}
                                                        onChange={(info) =>
                                                            this.uploadFile(info, 1)
                                                        }
                                                        // onRemove={(file) => this.removeImg(file, 1)}
                                                        maxCount={1}
                                                    >
                                                        {fileList &&
                                                        fileList.length >= 2 &&
                                                        fileList[1] != null
                                                            ? null
                                                            : uploadButton}
                                                    </Upload>
                                                </ImgCrop>
                                            )}

                                            {fileList &&
                                            fileList.length >= 3 &&
                                            fileList[2] != null ? (
                                                <span
                                                    style={{
                                                        display: 'inline-block',
                                                        position: 'relative',
                                                        width: '196px',
                                                        height:
                                                            imageType == 1
                                                                ? '164px'
                                                                : imageType == 2
                                                                ? '116px'
                                                                : imageType == 3
                                                                ? '253px'
                                                                : '',
                                                    }}
                                                >
                                                    <img
                                                        style={{
                                                            display: 'inline-block',
                                                            width: imageType == 3 ? 0 : '196px',
                                                            height:
                                                                imageType == 1
                                                                    ? '164px'
                                                                    : imageType == 2
                                                                    ? '260px'
                                                                    : imageType == 3
                                                                    ? 0
                                                                    : '',
                                                            marginLeft: '10px',
                                                        }}
                                                        src={
                                                            fileList[2].url != ''
                                                                ? window.location.origin +
                                                                  fileList[2].url
                                                                : ''
                                                        }
                                                        alt=""
                                                    ></img>
                                                    <Icon
                                                        type="close-circle"
                                                        style={{
                                                            position: 'absolute',
                                                            top: '-7px',
                                                            right: '-16px',
                                                            display:
                                                                imageType == 3
                                                                    ? 'none'
                                                                    : 'inline-block',
                                                        }}
                                                        onClick={() => this.delImg(2)}
                                                    />
                                                </span>
                                            ) : imageType == 1 || imageType == 2 ? (
                                                <ImgCrop
                                                    rotate
                                                    aspect={
                                                        imageType == 1
                                                            ? 196 / 164
                                                            : imageType == 2
                                                            ? 196 / 260
                                                            : imageType == 3
                                                            ? ''
                                                            : ''
                                                    }
                                                >
                                                    <Upload
                                                        className={
                                                            imageType == 1
                                                                ? styles.mSize
                                                                : imageType == 2
                                                                ? styles.SlSize
                                                                : imageType == 3
                                                                ? ''
                                                                : ''
                                                        }
                                                        action="/api/upload_file"
                                                        listType="picture-card"
                                                        onPreview={this.handlePreview}
                                                        onChange={(info) =>
                                                            this.uploadFile(info, 2)
                                                        }
                                                        // onRemove={(file) => this.removeImg(file, 2)}
                                                        maxCount={1}
                                                    >
                                                        {fileList &&
                                                        fileList.length >= 3 &&
                                                        fileList[2] != null
                                                            ? null
                                                            : uploadButton}
                                                    </Upload>
                                                </ImgCrop>
                                            ) : (
                                                ''
                                            )}
                                        </>
                                    ) : (
                                        ''
                                    )}

                                    <Modal
                                        visible={previewVisible}
                                        footer={null}
                                        onCancel={() => {
                                            this.setState({
                                                previewVisible: false,
                                            });
                                        }}
                                    >
                                        <img
                                            alt="example"
                                            style={{ width: '100%' }}
                                            src={previewImage}
                                        />
                                    </Modal>
                                </div>
                            </p>
                            <p
                                className={locale() == 'cn' ? styles.contentP : styles.contentEnP}
                                style={{ position: 'relative' }}
                            >
                                <span>
                                    {trans('global.upload cover', '上传封面')}
                                    {userSchoolId ? <i style={{ color: 'red' }}>*</i> : ''}
                                </span>
                                <div className={styles.customUpload}>
                                    <OssButton
                                        onChange={this.upload}
                                        acceptType=".jpg, .png"
                                        singleUpload={true}
                                    >
                                        {courseCover ? (
                                            <img
                                                src={courseCover}
                                                className={styles.logo}
                                                alt="封面"
                                            />
                                        ) : (
                                            <span className={styles.button}>
                                                <Icon type="plus" />
                                            </span>
                                        )}
                                    </OssButton>
                                </div>
                                <Icon
                                    type="close-circle"
                                    style={{
                                        position: 'absolute',
                                        top: '-5.5px',
                                        // left: '19.3%',
                                        left: locale() !== 'en' ? '19.3%' : '37.8%',
                                        display: courseCover ? 'inline-block' : 'none',
                                        zIndex: '10',
                                    }}
                                    onClick={() => {
                                        this.setState({
                                            courseCover: undefined,
                                        });
                                    }}
                                />
                            </p>
                        </div>
                    ) : (
                        <div style={{ margin: '45px auto 0', width: '970px' }}>
                            <p className={locale() == 'cn' ? styles.contentP : styles.contentEnP}>
                                <span>
                                    {trans('global.registration Restrictions', '报名限制')}
                                    <i style={{ color: 'red' }}>*</i>
                                </span>
                                <Radio.Group
                                    onChange={this.isReReg}
                                    value={limit}
                                    style={{ width: '75%' }}
                                >
                                    <Radio value={0}>
                                        {trans(
                                            'global.registration is prohibited',
                                            '禁止已上/已报名学生再次报名'
                                        )}
                                    </Radio>
                                    <Radio value={1}>
                                        {trans(
                                            'global.registration allowed',
                                            '允许已上/已报名学生再次报名'
                                        )}
                                    </Radio>
                                </Radio.Group>
                            </p>

                            <p className={locale() == 'cn' ? styles.contentP : styles.contentEnP}>
                                <span style={{ paddingLeft: '13px' }}>
                                    {trans('tc.base.material.cost', '材料费')}
                                    <i style={{ color: 'red' }}>*</i>
                                </span>
                                <Radio.Group onChange={this.changeCost} value={materialCost}>
                                    <Radio value={0}>
                                        {trans('global.No material fee', '无材料费')}
                                    </Radio>
                                    <br />
                                    <div style={{ display: 'flex', marginBottom: '-24px' }}>
                                        <Radio
                                            value={1}
                                            style={{ height: '32px', lineHeight: '32px' }}
                                        >
                                            {trans('global.flat material fee', '统一材料费')}
                                        </Radio>
                                        {materialCost == 1 ? (
                                            <p style={{ marginLeft: '30px', marginBottom: 0 }}>
                                                <span style={{ display: 'inline-block' }}>
                                                    {trans('tc.base.material.cost', '材料费')}
                                                    <Input
                                                        value={unite}
                                                        onChange={(e) =>
                                                            this.setState({
                                                                unite: Number(e.target.value),
                                                            })
                                                        }
                                                        style={{ width: '60px' }}
                                                    ></Input>
                                                    {trans('tc.base.yuan.period', '元/期')}
                                                </span>
                                            </p>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                    <br />
                                    {userSchoolId ? null : (
                                        <div style={{ display: 'flex' }}>
                                            <Radio
                                                value={2}
                                                style={{ height: '32px', lineHeight: '32px' }}
                                            >
                                                {trans(
                                                    'global.New and old students',
                                                    '新老学员不同'
                                                )}
                                            </Radio>
                                            {materialCost == 2 ? (
                                                <p
                                                    style={{
                                                        marginLeft: '30px',
                                                        marginBottom: 0,
                                                    }}
                                                >
                                                    <span style={{ display: 'inline-block' }}>
                                                        {trans('global.new student', '新学员')}
                                                        <Input
                                                            value={newCost}
                                                            onChange={(e) =>
                                                                this.setState({
                                                                    newCost: Number(e.target.value),
                                                                })
                                                            }
                                                            style={{ width: '60px' }}
                                                        ></Input>
                                                        {trans('tc.base.yuan.period', '元/期')}
                                                    </span>
                                                    &nbsp;&nbsp;
                                                    <span>
                                                        {trans('global.old student', '老学员')}
                                                        <Input
                                                            value={oldCost}
                                                            onChange={(e) =>
                                                                this.setState({
                                                                    oldCost: Number(e.target.value),
                                                                })
                                                            }
                                                            style={{ width: '60px' }}
                                                        ></Input>
                                                        {trans('tc.base.yuan.period', '元/期')}
                                                    </span>
                                                </p>
                                            ) : (
                                                ''
                                            )}
                                            <br />
                                        </div>
                                    )}
                                    {userSchoolId ? null : (
                                        <div style={{ display: 'flex' }}>
                                            <Radio
                                                value={3}
                                                style={{ height: '32px', lineHeight: '32px' }}
                                            >
                                                按班级收费
                                            </Radio>
                                            {materialCost == 3 ? (
                                                <p className={styles.classFeeModelList}>
                                                    {classFeeModelList?.map((item) => (
                                                        <span className={styles.feeItem}>
                                                            <span>
                                                                {/* {item.groupName} */}
                                                                {this.getGroupName(item.groupName)}
                                                            </span>
                                                            <InputNumber
                                                                style={{ width: '80px' }}
                                                                onChange={(value) =>
                                                                    this.classFeeModelListChange(
                                                                        value,
                                                                        item.groupId
                                                                    )
                                                                }
                                                                placeholder={trans(
                                                                    'global.Please enter the lesson fee',
                                                                    '请输入课时费'
                                                                )}
                                                                value={item.materialCost}
                                                            ></InputNumber>
                                                            <span>元/期</span>
                                                        </span>
                                                    ))}
                                                </p>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    )}
                                </Radio.Group>
                            </p>
                            {/* )} */}

                            {userSchoolId ? (
                                <>
                                    <p
                                        className={
                                            locale() == 'cn' ? styles.contentP : styles.contentEnP
                                        }
                                    >
                                        <span style={{ paddingLeft: '2px', lineHeight: '36px' }}>
                                            {trans('mobile.teachingLanguage', '授课语言')}
                                        </span>
                                        <Select
                                            placeholder="请选择授课语言"
                                            value={teachingLanguage}
                                            style={{ width: 150 }}
                                            onChange={(e) =>
                                                this.setState({
                                                    teachingLanguage: e,
                                                })
                                            }
                                        >
                                            {teacheringLanguage.map((item, index) => {
                                                return (
                                                    <Option value={item.id} key={item.id}>
                                                        {locale() == 'en' ? item.eName : item.name}
                                                    </Option>
                                                );
                                            })}
                                        </Select>
                                    </p>
                                    <p
                                        className={
                                            locale() == 'cn' ? styles.contentP : styles.contentEnP
                                        }
                                        style={{ display: 'flex' }}
                                    >
                                        <span style={{ paddingLeft: '2px', lineHeight: '36px' }}>
                                            {trans('mobile.languageRequirements', '英文要求')}
                                        </span>
                                        <div style={{ display: 'inline-block' }}>
                                            <Input
                                                placeholder="请输入英文要求（中文模版）"
                                                onChange={(e) =>
                                                    this.universalChange('languageRequirements', e)
                                                }
                                                value={languageRequirements}
                                                style={{ width: '250px', marginBottom: '15px' }}
                                            />
                                            <br />
                                            <Input
                                                placeholder="请输入英文要求（英文模版）"
                                                onChange={(e) =>
                                                    this.universalChange(
                                                        'enLanguageRequirements',
                                                        e
                                                    )
                                                }
                                                value={enLanguageRequirements}
                                                style={{ width: '250px' }}
                                            />
                                        </div>
                                    </p>
                                </>
                            ) : (
                                ''
                            )}
                            <p
                                className={locale() == 'cn' ? styles.contentP : styles.contentEnP}
                                style={{ position: 'relative' }}
                            >
                                <span>
                                    {trans('global.upload cover', '上传封面')}
                                    {userSchoolId ? <i style={{ color: 'red' }}>*</i> : ''}
                                </span>
                                <div className={styles.customFreeUpload}>
                                    <OssButton
                                        onChange={this.freeUpload}
                                        acceptType=".jpg, .png"
                                        singleUpload={true}
                                    >
                                        {freeCourseCover ? (
                                            <img
                                                src={freeCourseCover}
                                                className={styles.logo}
                                                alt="封面"
                                            />
                                        ) : (
                                            <span className={styles.button}>
                                                <Icon type="plus" />
                                            </span>
                                        )}
                                    </OssButton>
                                </div>
                                <Icon
                                    type="close-circle"
                                    style={{
                                        position: 'absolute',
                                        top: '-5.5px',
                                        left: locale() !== 'en' ? '22.9%' : '35.3%',
                                        display: freeCourseCover ? 'inline-block' : 'none',
                                        zIndex: '10',
                                    }}
                                    onClick={() => {
                                        this.setState({
                                            freeCourseCover: undefined,
                                        });
                                    }}
                                />
                            </p>

                            <Tabs defaultActiveKey="1" onChange={this.changeTabs} type="card">
                                <TabPane tab="课程介绍（中文）" key="1">
                                    <RichEditor
                                        height={500}
                                        placeholder="在这里请输入"
                                        language={locale() == 'en' ? 'en' : 'zh_CN'}
                                        initContent={this.state.freePlateContent}
                                        uploadImage={this.uploadImage}
                                        uploadMedia={this.uploadMedia}
                                        handleEditorChange={this.handleEditorChange}
                                        statusbar={false}
                                        uploadPasteWordImg={this.uploadPasteWordImg}
                                    />
                                </TabPane>
                                <TabPane tab="课程介绍（英文）" key="2">
                                    <RichEditor
                                        // style={{ width: '92%' }}
                                        height={500}
                                        placeholder="在这里请输入"
                                        // language="en"
                                        language={locale() == 'en' ? 'en' : 'zh_CN'}
                                        initContent={this.state.enFreePlateContent}
                                        uploadImage={this.uploadEnImage}
                                        uploadMedia={this.uploadEnMedia}
                                        handleEditorChange={this.handleEnEditorChange}
                                        statusbar={false}
                                        uploadPasteWordImg={this.uploadPasteWordImg}
                                    />
                                </TabPane>
                            </Tabs>
                        </div>
                    )}
                </Modal>
                {preVisible && (
                    <Modal
                        visible={preVisible}
                        className={styles.preview}
                        footer={null}
                        onCancel={() => this.setState({ preVisible: false })}
                        mask={true}
                        maskClosable={true}
                        maskStyle={{ background: 'rgba(204,204,204,0.4)' }}
                        // zIndex={1033}
                    >
                        <Spin tip="画报生成图片,下载中..." spinning={this.state.loading}>
                            <BaseInfor
                                id="preview"
                                classFeeShow={chooseCourseDetails?.classFeeShow}
                                materialFeeShow={chooseCourseDetails?.materialFeeShow}
                                {...this.state}
                                schoolId={schoolId}
                                userSchoolId={this.props.userSchoolId}
                                noToChinese={this.noToChinese}
                                hexToRgba={this.hexToRgba}
                                startTime={chooseCourseDetails?.startTime}
                                endTime={chooseCourseDetails?.endTime}
                                classDate={chooseCourseDetails.classDate}
                                courseIntroductionType={chooseCourseDetails?.courseIntroductionType}
                            ></BaseInfor>
                        </Spin>
                    </Modal>
                )}
            </>
        );
    }
}

module.exports = EditCourseInfor;
