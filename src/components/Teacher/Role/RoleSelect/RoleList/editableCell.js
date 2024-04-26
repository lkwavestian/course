import React, { PureComponent } from 'react';
import { Table, Input, Button, Popconfirm, Form } from 'antd';
const EditableContext = React.createContext();

@Form.create()
export class EditableCell extends PureComponent {
    state = {
        editing: false,
    };

    toggleEdit = () => {
        const editing = !this.state.editing;
        this.setState({ editing }, () => {
            if (editing) {
                this.input.focus();
            }
        });
    };

    save = (e) => {
        const { record, handleSave } = this.props;
        this.form.validateFields((error, values) => {
            if (error && error[e.currentTarget.id]) {
                return;
            }
            this.toggleEdit();
            handleSave({ ...record, ...values });
        });
    };

    renderCell = (form) => {
        console.log('form :>> ', form);
        this.form = form;
        const { children, dataIndex, record, title } = this.props;
        const { editing } = this.state;
        console.log('editing :>> ', editing);
        return editing ? (
            <Form.Item style={{ margin: 0 }}>
                {form.getFieldDecorator(dataIndex, {
                    initialValue: record[dataIndex],
                })(
                    <Input
                        ref={(node) => (this.input = node)}
                        onPressEnter={this.save}
                        onBlur={this.save}
                    />
                )}
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{ paddingRight: 24 }}
                onClick={this.toggleEdit}
            >
                {children}
            </div>
        );
    };

    render() {
        console.log('this.props', this.props);
        const {
            editable,
            dataIndex,
            title,
            record,
            index,
            handleSave,
            children,
            form,
            ...restProps
        } = this.props;
        return (
            <td {...restProps}>
                {editable ? (
                    <EditableContext.Consumer>
                        {() => this.renderCell(form)}
                    </EditableContext.Consumer>
                ) : (
                    children
                )}
            </td>
        );
    }
}
