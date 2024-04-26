//侧边栏
import 'rc-drawer/assets/index.css';
import React, { PureComponent } from 'react';
import DrawerMenu from 'rc-drawer';
import SiderMenu from './SiderMenu';
import { styles } from './index.less';

export default class SiderMenuWrapper extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { onCollapse, collapsed } = this.props;
        return (
            <div>
                <DrawerMenu
                    getContainer={null}
                    level={null}
                    handler={false}
                    onHandleClick={() => {
                        onCollapse(!collapsed);
                    }}
                    open={!collapsed}
                    onMaskClick={() => {
                        onCollapse(true);
                    }}
                >
                    <SiderMenu {...this.props} />
                </DrawerMenu>
            </div>
        );
    }
}
