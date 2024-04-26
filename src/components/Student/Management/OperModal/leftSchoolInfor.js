//转移学生
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './commonModal.less';
import { Modal, Icon, Button, Form } from 'antd';
import { trans } from '../../../../utils/i18n';
const { confirm } = Modal;

@connect((state) => ({
    orgCompletePath: state.teacher.orgCompletePath,
    downloadExcel: state.student.downloadExcel,
}))
class LeftSchoolInfor extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            orgCompletePath: '',
            fileName: null,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.leftSchoolInforVisible != this.props.leftSchoolInforVisible) {
            let { treeId } = this.props;
            if (nextProps.leftSchoolInforVisible && treeId) {
                this.getPathByTreeId(treeId);
            }
        }
    }

    handleCancel = () => {
        const { hideModal } = this.props;
        typeof hideModal == 'function' && hideModal.call(this, 'leftSchoolInfor');
        let getForm = document.getElementById('uploadForm');
        getForm.reset();
        this.setState({
            orgCompletePath: '',
            fileName: '',
        });
    };

    //根据树节点id获取路径
    getPathByTreeId(id) {
        const { dispatch } = this.props;
        dispatch({
            type: 'teacher/getPathByTreeId',
            payload: {
                nodeId: id,
            },
            onSuccess: () => {
                let { orgCompletePath } = this.props;
                this.setState({
                    orgCompletePath,
                });
            },
        });
    }

    downloadUrl = () => {
        let { treeId } = this.props;
        let downloadUrl = `${location.protocol}//${location.host}/api/teaching/studentStatus/manager/download/template?nodeId=${treeId}`;
        location.href = downloadUrl;
    };

    handleSubmit = () => {
        let self = this;
        let { statusType, selectSchoolId } = this.props;
        confirm({
            title: trans('student.confirmUploadFile', '您确定要提交所上传的文件嘛？'),
            onOk() {
                let { dispatch, treeId } = self.props;
                let data = new FormData();
                let fileList = document.getElementById('uploadBtn');
                let files = fileList && fileList.files[0];
                console.log(fileList, files, 'filesfiles');
                data.append('file', files);
                console.log(data, '///data');
                data.nodeId = treeId;
                data.type = statusType == 1 ? 1 : 2;
                data.schoolId = selectSchoolId;
                dispatch({
                    type: 'student/graduationDestination',
                    payload: data,
                    onSuccess: () => {
                        self.handleCancel();
                        const { fetchTreeNodeDetail, getTreeOrg } = self.props;
                        typeof fetchTreeNodeDetail == 'function' &&
                            fetchTreeNodeDetail.call(self, 1);
                        typeof getTreeOrg == 'function' && getTreeOrg.call(self);
                    },
                });
            },
        });
    };

    render() {
        let { leftSchoolInforVisible, statusType } = this.props;
        let { orgCompletePath } = this.state;
        let currentUrl = window.location.href;
        currentUrl = currentUrl.replace(/(\?|&)ticket\=([0-9A-z]+?&|[0-9A-z]+)/gi, '');
        let homePageUrl =
            currentUrl.indexOf('yungu.org') > -1
                ? 'https://profile.yungu.org'
                : 'https://student-profile.daily.yungu-inc.org';
        let downloadUrl = `${homePageUrl}/api/teaching/studentStatus/manager/download/template`;
        return (
            <Modal
                visible={leftSchoolInforVisible}
                title={
                    statusType == 1
                        ? trans('student.leftSchoolInformation', '设置学生毕业')
                        : trans('student.leftSchoolInformationTitle', '设置离校信息')
                }
                footer={null}
                onCancel={this.handleCancel}
            >
                <div className={styles.LeftSchoolInfor}>
                    <div className={styles.item}>
                        <span className={styles.title}>
                            {trans('student.leftSchoolGrade', '离校年级')}:
                        </span>
                        <span className={styles.desc}>
                            {orgCompletePath ? (
                                orgCompletePath.replace(/\//g, '-')
                            ) : (
                                <Icon
                                    type="loading"
                                    style={{ color: '#3B6ff5', marginLeft: '6px' }}
                                />
                            )}
                        </span>
                    </div>
                    <div className={`${styles.item} ${styles.other}`}>
                        <span className={styles.title}>
                            {trans('student.important.leftSchool', '导入离校学生信息')}
                        </span>
                        <span className={styles.desc}>
                            <span className={styles.fileBtn}>
                                <Form
                                    id="uploadForm"
                                    layout="inline"
                                    method="post"
                                    className={styles.form}
                                    encType="multipart/form-data"
                                >
                                    <input
                                        id="uploadBtn"
                                        name="file"
                                        type="file"
                                        accept=".xls,.xlsx"
                                    />
                                </Form>
                            </span>
                        </span>
                        <span className={styles.download}>
                            <span className={styles.grey}>
                                {trans('student.download.before', '文件模板请')}
                            </span>
                            <a onClick={this.downloadUrl}>
                                {trans('student.download.after', '点击下载')}
                            </a>
                        </span>
                    </div>

                    <div className={styles.pDesc}>
                        <Icon type="info-circle" theme="filled" className={styles.icon} />
                        {trans('student.download.describe', '导入文件提示')}
                    </div>
                    <div className={styles.btnBox}>
                        <Button onClick={this.handleCancel} className={styles.btn}>
                            {trans('global.cancel', '取消')}
                        </Button>
                        <Button onClick={this.handleSubmit} type="primary" className={styles.btn}>
                            {trans('global.confirm', '确定')}
                        </Button>
                    </div>
                </div>
            </Modal>
        );
    }
}

export default LeftSchoolInfor;
