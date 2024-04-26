import React, { PureComponent } from 'react';
import styles from './index.less';
import { connect } from 'dva';
import { Form, Button } from 'antd';
import { trans, locale } from '../../utils/i18n';
import { getUrlSearch } from '../../utils/utils';
import lodash from 'lodash';
import PrintBaseInfor from './printBaseInfor';

@connect((state) => ({
    getLotsDetail: state.courseBaseDetail.getLotsDetail,
    chooseCourseDetails: state.choose.chooseCourseDetails,
    currentUser: state.global.currentUser,
}))
@Form.create()
class PrintCourseSelection extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            chooseCoursePlanId: getUrlSearch('chooseCoursePlanId'),
            coursePlanningIds: getUrlSearch('coursePlanningIds'),
            userSchoolId: getUrlSearch('userSchoolId'),
        };
    }

    componentDidMount() {
        document.title = '选课管理';
        const { dispatch } = this.props;
        dispatch({
            type: 'courseBaseDetail/getLotsDetail',
            payload: {
                chooseCoursePlanId: this.state.chooseCoursePlanId,
                coursePlanningIds: this.state.coursePlanningIds,
            },
        });

        dispatch({
            type: 'choose/chooseCourseDetails',
            payload: {
                id: this.state.chooseCoursePlanId,
            },
        });
    }

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

    render() {
        const { getLotsDetail, chooseCourseDetails, currentUser } = this.props;
        let schoolId = currentUser.currentUser;
        return (
            <div className={styles.printContent}>
                {getLotsDetail &&
                    getLotsDetail.length > 0 &&
                    getLotsDetail.map((item, index) => (
                        <PrintBaseInfor
                            chooseCoursePlanId={this.state.chooseCoursePlanId}
                            className="printPage"
                            noToChinese={this.noToChinese}
                            hexToRgba={this.hexToRgba}
                            courseIntroductionType={
                                this.props.chooseCourseDetails.courseIntroductionType
                            }
                            schoolId={schoolId}
                            {...item}
                            userSchoolId={this.state.userSchoolId}
                            classFeeShow={chooseCourseDetails.classFeeShow}
                            materialFeeShow={chooseCourseDetails.materialFeeShow}
                            startTime={chooseCourseDetails.startTime}
                            endTime={chooseCourseDetails.endTime}
                        ></PrintBaseInfor>
                    ))}
                <span id="export" className={styles.export} onClick={() => window.print()}>
                    导出
                </span>
            </div>
        );
    }
}

module.exports = PrintCourseSelection;
