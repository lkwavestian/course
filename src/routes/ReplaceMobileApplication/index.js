//场地管理
import React, { PureComponent } from 'react';
import ReplaceMobileApplication from '../../components/ReplaceMobileApplication';

export default class ReplaceMobileApplicationRouteIndex extends PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            match: { params },
        } = this.props;
        let cur = params.tabs ? params.tabs : '0';

        /* 
            cur 0：调代课申请 1：代课页面 2：换课页面
        */

        return <ReplaceMobileApplication cur={cur} />;
    }
}
