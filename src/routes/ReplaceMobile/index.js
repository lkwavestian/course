//调代课移动端
import React, { PureComponent } from 'react';
import ReplaceMobile from '../../components/ReplaceMobile';

export default class ReplaceMobileRouteIndex extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        console.log('routes/ReplaceMobile/index/render');

        const {
            match: { params },
        } = this.props;
        let cur = params.tabs ? params.tabs : '0';
        /* 
            cur 0：调代课初始页面 1：我提交的 2：我代的课 3：待我审批 4：我已审批 5：全部申请
        */
        return <ReplaceMobile cur={cur} />;
    }
}
