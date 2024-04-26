import React, { PureComponent } from 'react';
import { getUrlSearch } from '../../utils/utils';
import { isMobile } from 'react-device-detect';

export default class ReplaceRedirect extends PureComponent {
    componentDidMount() {
        const { history } = this.props;
        let requestId = getUrlSearch('requestId');
        console.log('requestId :>> ', requestId);
        console.log('isMobile :>> ', isMobile);
        if (isMobile) {
            if (requestId) {
                history.push(`/replace/mobile/application/index?requestId=${requestId}`);
            } else {
                history.push(`/replace/mobile/index`);
            }
        } else {
            if (requestId) {
                history.push(`/replace/index/application?requestId=${requestId}`);
            } else {
                history.push(`/replace/index`);
            }
        }
    }
    render() {
        return <div style={{ width: '100%', height: '100%', backgroundColor: '#fff' }}></div>;
    }
}
