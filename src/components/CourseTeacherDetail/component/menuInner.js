import React from 'react';
import { Icon } from 'antd';
import { Dropdown, Menu, Button } from 'antd';

function MenuInner(props) {
    return (
        <Dropdown
            disabled={props.effecticveDisabled}
            overlay={
                <Menu>
                    {props.menuItem.map((el, i) => (
                        <Menu.Item key={i} onClick={() => props.switchStatus(i)}>
                            <span>{el}</span>
                        </Menu.Item>
                    ))}
                </Menu>
            }
        >
            <Button style={{ borderRadius: '8px', margin: '0 10px', padding: '0 8px' }}>
                {props.title}
                <Icon type="down" />
            </Button>
        </Dropdown>
    );
}

export default MenuInner;
