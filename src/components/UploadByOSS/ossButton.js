//封装按钮-使用oss
import React, { PureComponent } from 'react';
import styles from './ossButton.less';
import { connect } from 'dva';
import { Form, message } from 'antd';

@connect((state) => ({
    ossAssumeResult: state.global.ossAssumeResult,
    uploadFileResponse: state.global.uploadFileResponse,
}))
class OssButton extends PureComponent {
    state = {
        file: [], //附件
    };

    //获取oss授权
    getOssAssume() {
        const { dispatch } = this.props;
        return dispatch({
            type: 'global/getOssAssume',
            payload: {
                type: '', //1:私有； 什么都不传：公有
            },
        });
    }

    //读取上传文件
    readFile = (file) => {
        const { onChange, beforeUpload } = this.props;
        let reader = new FileReader();
        reader.readAsDataURL(file);
        let self = this;
        if (beforeUpload && typeof beforeUpload == 'function') {
            let result = beforeUpload.call(this, file);
            if (!result) return false;
        }
        reader.onloadend = function () {
            self.uploadToOss(file); //日常使用oss
            // let fileInfo = {
            //     //本地走这个方法
            //     fileName: file.name,
            //     uuid: file.uuid,
            //     status: 'uploading',
            //     fileSize: file.size || 0,
            //     previewImage: 'https://assets.yungu.org/statics/0.0.1/fileCover/loading.gif',
            //     favicon:
            //         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgKsFZIAYNNkCwIkGpYrk4gpIKxnmcqTLlDQ&usqp=CAU',
            //     loginBackground:
            //         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-aI35vOoL6NXXrOGIDE87jntVhpQiGnY10g&usqp=CAU',
            //     loginLogo:
            //         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJ7Cb3KnorSoI16PhjFndwtDaZ_p64Fk4BFg&usqp=CAU',
            //     ccaIcon:
            //         'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQC_k_-vmG_eQjGc71EvpcgPLgUPZgTnt78vQ&usqp=CAU',
            // };
            // typeof onChange == 'function' && onChange.call(this, fileInfo);
        };
    };

    //上传附件--单个附件
    uploadFile = (e) => {
        let fileInfo = e.target.files && e.target.files[0];
        if (!fileInfo) return false;
        fileInfo.uuid = new Date().getTime();
        this.readFile(fileInfo);
    };

    //尝试多个上传--多个附件上传
    multipleUploadFile = (e) => {
        let fileInfo = e.target.files && e.target.files;
        if (!fileInfo) return false;
        for (let i = 0; i < fileInfo.length; i++) {
            fileInfo[i]['uuid'] = new Date().getTime() + i;
            this.readFile(fileInfo[i]);
        }
    };

    //oss读取文件
    uploadToOss = (files) => {
        const { onChange } = this.props;
        this.getOssAssume().then(() => {
            const { ossAssumeResult } = this.props;
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
                .multipartUpload(`${ossAssumeResult.ossPath}${files.uuid}_${files.name}`, files, {
                    progress: (p, _checkPoint) => {
                        let percent = parseInt(p * 100);
                        let fileInfo = {
                            fileName: files.name,
                            percent: percent,
                            uuid: files.uuid,
                            status: 'uploading',
                            fileSize: files.size || 0,
                            previewImage:
                                'https://assets.yungu.org/statics/0.0.1/fileCover/loading.gif',
                            favicon: 'https://assets.yungu.org/statics/0.0.1/fileCover/loading.gif',
                            loginBackground:
                                'https://assets.yungu.org/statics/0.0.1/fileCover/loading.gif',
                            loginLogo:
                                'https://assets.yungu.org/statics/0.0.1/fileCover/loading.gif',
                            ccaIcon: 'https://assets.yungu.org/statics/0.0.1/fileCover/loading.gif',
                        };
                        typeof onChange == 'function' && onChange.call(this, fileInfo);
                    },
                })
                .then((response) => {
                    if (response.res && response.res.status == '200') {
                        // let uploadUrl = response.res.requestUrls && response.res.requestUrls[0];
                        // let url = uploadUrl.split("?")[0];
                        let origin = ossAssumeResult.endpoint.split('//')[1];
                        let fileUrl = `https://${ossAssumeResult.bucketName}.${origin}/${ossAssumeResult.ossPath}${files.uuid}_${files.name}`;
                        let resObj = {
                            fileName: files.name,
                            fileSize: files.size || 0,
                            fileType: files.type || '',
                            fileUrl: fileUrl,
                            previewImage: fileUrl,
                            percent: 100,
                            uuid: files.uuid,
                            status: 'done',

                            favicon: fileUrl,
                            loginBackground: fileUrl,
                            loginLogo: fileUrl,
                            ccaIcon: fileUrl,
                        };
                        console.log('fileUrl', fileUrl);
                        typeof onChange == 'function' && onChange.call(this, resObj);
                        // this.uploadToServer({
                        //     fileName: files.name,
                        //     bucketName: ossAssumeResult.bucketName,
                        //     fileSize: files.size || 0,
                        //     fileType: files.type || '',
                        //     fileUrl: fileUrl,
                        //     percent: 100,
                        //     uuid: files.uuid,
                        // });
                    } else {
                        message.error('上传失败');
                    }
                })
                .catch((err) => {
                    message.error('哎呀，oss出错了~');
                });
        });
    };

    //上传附件到服务器
    uploadToServer = (payload) => {
        const { dispatch, onChange } = this.props;
        dispatch({
            type: 'global/payloadUploadFile',
            payload: payload,
            onSuccess: () => {
                const { uploadFileResponse } = this.props;
                typeof onChange == 'function' && onChange.call(this, uploadFileResponse);
            },
        });
    };

    componentDidMount() {
        let uploadIcon = document.querySelectorAll('.uploadButton');
        for (let i = 0; i < uploadIcon.length; i++) {
            let preSiblings = uploadIcon[i].previousElementSibling;
            if (preSiblings) {
                preSiblings.style.width = `${uploadIcon[i].offsetWidth}px`;
                preSiblings.style.height = `${uploadIcon[i].offsetHeight}px`;
            }
        }
    }

    render() {
        const { acceptType, singleUpload } = this.props;
        return (
            <div className={styles.uploadArea}>
                <Form method="post" encType="multipart/form-data">
                    <Form.Item>
                        <input
                            type="file"
                            name="file"
                            accept={acceptType || '*'}
                            multiple={singleUpload === true ? '' : 'multiple'}
                            className={styles.fileBtn}
                            onChange={
                                singleUpload === true ? this.uploadFile : this.multipleUploadFile
                            }
                            onClick={(e) => {
                                e.target.value = null;
                            }}
                        />
                        <div className={`${styles.uploadIcon} uploadButon`}>
                            {this.props.children}
                        </div>
                    </Form.Item>
                </Form>
            </div>
        );
    }
}

export default Form.create()(OssButton);
