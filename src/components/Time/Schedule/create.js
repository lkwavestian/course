// //新建作息活动
// import React, { PureComponent } from 'react';
// import { connect } from 'dva';
// import { Modal, Select, Input, Form, TimePicker, Checkbox, message } from 'antd';
// import moment from 'moment';
// import styles from './createCourse.less';
// import icon from '../../../icon.less';
// import { trans, locale } from '../../../utils/i18n';
// const { Option } = Select;
// const format = 'HH:mm';
// const CheckboxGroup = Checkbox.Group;
// class CreateCourse extends PureComponent {
//     constructor(props) {
//         super(props);
//         this.state = {
//             visible: false,
//             workType: '', //活动类型
//             workname: '', // 活动名字
//             englishName: '', // 英文名字
//             weekTime: '', // 应用范围
//             typeChangeNumber: '', // 时段
//             timeLength: '', // 展示时间（分钟数）
//             startChangeTime: '', // 编辑开始时间
//             endChangeTime: '', // 编辑结束时间
//             startCreateTime: '', // 新建作息开始时间
//             endCreatetime: '', // 新建作息结束时间
//             workText: '', // 活动名称
//             whatDay: '', // 日期
//             checkValue: false, // 是否横跨该时段
//             startNow: '', // 新建作息改变的开始时间(用来计算差值)
//             endNow: '', //新建作息改变的结束时间(用来计算差值)
//             editStartNow: '', // 编辑作息改变的开始时间(用来计算差值)
//             editEndNow: '', // 编辑作息改变的结束时间(用来计算差值)
//         };
//     }
//     // 开启新建作息活动
//     componentWillReceiveProps(nextProps) {
//         if (nextProps.courseVisible != this.props.courseVisible) {
//             this.setState({
//                 visible: nextProps.courseVisible,
//                 typeChangeNumber: '',
//                 editStartNow: '',
//                 editEndNow: '',
//             });
//         }
//     }

//     // 活动名字
//     workNameChange = (e) => {
//         this.setState({
//             workText: e.target.value,
//         });
//     };
//     // 英文名字
//     getenglishName = (e) => {
//         this.setState({
//             englishName: e.target.value,
//         });
//     };
//     // 禁止结束小时
//     donOpenEndEHoures = () => {
//         let hours = [];
//         for (var i = 23; i < 24; i++) {
//             hours.push(i);
//         }
//         return hours;
//     };
//     // 禁止开始小时
//     donOpenStartHoures = () => {
//         let hours = [];
//         for (let i = 0; i < 8; i++) {
//             hours.push(i);
//         }
//         debugger;
//         return hours;
//     };
//     // 禁止结束分钟
//     donOpenMinuts = (selectedHour) => {
//         var minutes = [];
//         if (selectedHour === 22) {
//             for (var i = 59; i > 0; i--) {
//                 minutes.push(i);
//             }
//         }
//         return minutes;
//     };

//     // 关闭新建作息活动
//     hideModal = () => {
//         const { offhandleClick } = this.props;
//         typeof offhandleClick == 'function' && offhandleClick();
//         this.props.form.resetFields();
//         this.setState({
//             typeChangeNumber: '',
//             editStartNow: '',
//             editEndNow: '',
//         });
//     };

//     // 删除当前作息
//     deteleBtn = () => {
//         const { dispatch, offhandleClick, nameid, getCalendarSource } = this.props;
//         dispatch({
//             type: 'time/deleteCalendar',
//             payload: {
//                 baseScheduleDetailId: nameid,
//             },
//         }).then(() => {
//             typeof getCalendarSource == 'function' && getCalendarSource();
//             typeof offhandleClick == 'function' && offhandleClick();
//             this.props.form.resetFields();
//         });
//     };
//     // 时段类型
//     workTypeChange = (value) => {
//         console.log(value, '时段');
//         this.setState({
//             typeChangeNumber: value,
//         });
//     };

//     // 日期选择
//     checkChange = (checkedValue) => {
//         this.setState({
//             whatDay: checkedValue,
//         });
//     };

//     // 是否横跨该时段
//     checkChangeValue = () => {
//         this.setState({
//             checkValue: !this.state.checkValue,
//         });
//     };

//     // 完成
//     handleSubmit = (e) => {
//         const {
//             dispatch,
//             offhandleClick,
//             calendrDetail,
//             createModalType,
//             dateValue,
//             getCalendarSource,
//             nameid,
//         } = this.props;
//         const {
//             startChangeTime,
//             endChangeTime,
//             typeChangeNumber,
//             workText,
//             startCreateTime,
//             endCreateTime,
//             whatDay,
//             checkValue,
//             englishName,
//             editChangeValue,
//         } = this.state;
//         e.preventDefault();
//         console.log(calendrDetail, '完成');

//         this.props.form.validateFields((err, values) => {
//             if (!err) {
//                 if (values.endtime < values.starttime) {
//                     message.error('结束时间要大于开始时间');
//                     return false;
//                 } else {
//                     if (createModalType == 'edit') {
//                         dispatch({
//                             type: 'time/modifScheduleWork',
//                             payload: {
//                                 id: nameid,
//                                 name:
//                                     calendrDetail.type == 1 || typeChangeNumber == 1
//                                         ? null
//                                         : workText
//                                         ? workText
//                                         : calendrDetail.name,
//                                 ename:
//                                     calendrDetail.type == 1 || typeChangeNumber == 1
//                                         ? null
//                                         : calendrDetail.ename,
//                                 type: typeChangeNumber ? typeChangeNumber : calendrDetail.type,
//                                 weekDayList: values.week.map(Number),
//                                 startTime: startChangeTime
//                                     ? startChangeTime
//                                     : calendrDetail.startTime,
//                                 endTime: endChangeTime ? endChangeTime : calendrDetail.endTime,
//                             },
//                         }).then(() => {
//                             this.setState({
//                                 startTime: null,
//                                 endTime: null,
//                             });
//                             this.props.form.resetFields();
//                             typeof offhandleClick == 'function' && offhandleClick();
//                             typeof getCalendarSource == 'function' && getCalendarSource();
//                         });
//                     }

//                     if (createModalType == 'create') {
//                         dispatch({
//                             type: 'time/addScheduleText',
//                             payload: {
//                                 baseScheduleId: dateValue,
//                                 name: typeChangeNumber == 1 ? null : workText,
//                                 ename: typeChangeNumber == 1 ? null : englishName,
//                                 type: typeChangeNumber ? typeChangeNumber : 0,
//                                 weekDayList: whatDay
//                                     ? whatDay.map(Number)
//                                     : ['1', '2', '3', '4', '5'],
//                                 startTime: startCreateTime ? startCreateTime : '08:00',
//                                 endTime: endCreateTime ? endCreateTime : '10:00',
//                                 ifBreak: checkValue ? checkValue : false, // 是否允许横跨时段  true为允许， false为不允许
//                             },
//                         }).then(() => {
//                             this.setState({
//                                 startTime: '08:00',
//                                 endTime: '10:00',
//                                 typeChangeNumber: 0,
//                                 name: '',
//                             });
//                             this.props.form.resetFields();
//                             typeof offhandleClick == 'function' && offhandleClick();
//                             typeof getCalendarSource == 'function' && getCalendarSource();
//                         });
//                     }
//                 }
//             }
//         });
//     };

//     // 获取开始的时间
//     starttimechange = (time, timestring) => {
//         const { createModalType } = this.props;
//         if (createModalType == 'edit') {
//             this.setState({
//                 startChangeTime: timestring,
//                 editStartNow: time,
//             });
//         } else {
//             this.setState({
//                 startCreateTime: timestring,
//                 startNow: time,
//             });
//         }
//     };

//     // 获取结束的时间
//     endtimechange = (time, timestring) => {
//         const { createModalType } = this.props;
//         if (createModalType == 'edit') {
//             this.setState({
//                 endChangeTime: timestring,
//                 editEndNow: time,
//             });
//         } else {
//             this.setState({
//                 endCreateTime: timestring,
//                 endNow: time,
//             });
//         }
//     };
//     render() {
//         const {
//             creatcoursething,
//             createModalType,
//             calendrDetail,
//             collection,
//             form: { getFieldDecorator },
//         } = this.props;
//         const {
//             visible,
//             typeChangeNumber,
//             startNow,
//             endNow,
//             editEndNow,
//             editStartNow,
//             endCreateTime,
//             startCreateTime,
//         } = this.state;
//         const optionsWithDisabled = [
//             { label: '周一', value: '1' },
//             { label: '周二', value: '2' },
//             { label: '周三', value: '3' },
//             { label: '周四', value: '4' },
//             { label: '周五', value: '5' },
//             { label: '周六', value: '6' },
//             { label: '周天', value: '7' },
//         ];
//         const optionValueType = [
//             { value: 0, text: '作息' },
//             { value: 1, text: '上课时段' },
//             { value: 2, text: '公共活动' },
//         ];
//         var newData = this.props.calendrDetail || {};
//         if (newData && newData.endTime && newData.startTime) {
//             var oldTime = newData.endTime.split(':');
//             var newTime = newData.startTime.split(':');
//             var nowTime = (oldTime[0] - newTime[0]) * 60 + (oldTime[1] - newTime[1]);
//         }
//         return (
//             <Modal
//                 visible={visible}
//                 title={
//                     createModalType == 'create'
//                         ? trans('global.createSchedule', 'Add')
//                         : trans('global.editSchedule', 'Edit')
//                 }
//                 footer={null}
//                 keyboard={true}
//                 width={620}
//                 onCancel={this.hideModal}
//             >
//                 <Form layout="inline" onSubmit={this.handleSubmit}>
//                     <Form.Item label="作息类型">
//                         {getFieldDecorator('edittype', {
//                             rules: [{ required: true, message: '请选择时段' }],
//                             initialValue:
//                                 createModalType == 'create' ? this.state.placeholder : collection,
//                         })(
//                             <Select
//                                 style={{ width: 110 }}
//                                 onChange={this.workTypeChange}
//                                 placeholder={'请选择时段'}
//                             >
//                                 {optionValueType.map((item, index) => {
//                                     return (
//                                         <Option key={item.value} value={item.value}>
//                                             {item.text}
//                                         </Option>
//                                     );
//                                 })}
//                             </Select>
//                         )}
//                     </Form.Item>
//                     {createModalType == 'edit' ? (
//                         typeChangeNumber >= 0 ? (
//                             typeChangeNumber == 2 || typeChangeNumber == 0 ? (
//                                 <div style={{ display: 'flex' }}>
//                                     <div style={{ flex: 1 }}>
//                                         <Form.Item label="名称">
//                                             {getFieldDecorator('workname', {
//                                                 rules: [
//                                                     { required: true, message: '请输入活动名称' },
//                                                 ],
//                                                 initialValue:
//                                                     createModalType == 'edit'
//                                                         ? calendrDetail.name
//                                                         : '',
//                                             })(
//                                                 <Input
//                                                     style={{ width: 150 }}
//                                                     placeholder="请输入"
//                                                     onChange={this.workNameChange}
//                                                 />
//                                             )}
//                                         </Form.Item>
//                                     </div>
//                                     <div style={{ flex: 1 }}>
//                                         <Form.Item label={trans('charge.enName', '英文名称')}>
//                                             {getFieldDecorator('englishname', {
//                                                 rules: [
//                                                     { required: true, message: '请输入英文名称' },
//                                                 ],
//                                                 initialValue:
//                                                     createModalType == 'edit'
//                                                         ? calendrDetail.eName
//                                                         : '',
//                                             })(
//                                                 <Input
//                                                     style={{ width: 150 }}
//                                                     placeholder="请输入"
//                                                     onChange={this.getenglishName}
//                                                 />
//                                             )}
//                                         </Form.Item>
//                                     </div>
//                                 </div>
//                             ) : (
//                                 ''
//                             )
//                         ) : collection == '2' || collection == '0' ? (
//                             <div style={{ display: 'flex' }}>
//                                 <div style={{ flex: 1 }}>
//                                     <Form.Item label="名称">
//                                         {getFieldDecorator('workname', {
//                                             rules: [{ required: true, message: '请输入活动名称' }],
//                                             initialValue:
//                                                 createModalType == 'edit' ? calendrDetail.name : '',
//                                         })(
//                                             <Input
//                                                 style={{ width: 150 }}
//                                                 placeholder="请输入"
//                                                 onChange={this.workNameChange}
//                                             />
//                                         )}
//                                     </Form.Item>
//                                 </div>
//                                 <div style={{ flex: 1 }}>
//                                     <Form.Item label={trans('charge.enName', '英文名称')}>
//                                         {getFieldDecorator('englishname', {
//                                             rules: [{ required: true, message: '请输入英文名称' }],
//                                             initialValue:
//                                                 createModalType == 'edit'
//                                                     ? calendrDetail.eName
//                                                     : '',
//                                         })(
//                                             <Input
//                                                 style={{ width: 150 }}
//                                                 placeholder="请输入"
//                                                 onChange={this.getenglishName}
//                                             />
//                                         )}
//                                     </Form.Item>
//                                 </div>
//                             </div>
//                         ) : (
//                             ''
//                         )
//                     ) : typeChangeNumber == 2 || typeChangeNumber == 0 ? (
//                         <div style={{ display: 'flex' }}>
//                             <div style={{ flex: 1 }}>
//                                 <Form.Item label="名称">
//                                     {getFieldDecorator('workname', {
//                                         rules: [{ required: true, message: '请输入活动名称' }],
//                                         initialValue: this.state.placeholder,
//                                     })(
//                                         <Input
//                                             style={{ width: 150 }}
//                                             placeholder="请输入"
//                                             onChange={this.workNameChange}
//                                         />
//                                     )}
//                                 </Form.Item>
//                             </div>
//                             <div style={{ flex: 1 }}>
//                                 <Form.Item label={trans('charge.enName', '英文名称')}>
//                                     {getFieldDecorator('englishname', {
//                                         rules: [{ required: true, message: '请输入英文名称' }],
//                                         initialValue: this.state.placeholder,
//                                     })(
//                                         <Input
//                                             style={{ width: 150 }}
//                                             placeholder="请输入"
//                                             onChange={this.getenglishName}
//                                         />
//                                     )}
//                                 </Form.Item>
//                             </div>
//                         </div>
//                     ) : (
//                         ''
//                     )}
//                     {createModalType == 'edit' ? (
//                         <div style={{ display: 'flex' }}>
//                             <div style={{ flex: 1 }}>
//                                 <Form.Item label="起止时间">
//                                     {getFieldDecorator('starttime', {
//                                         rules: [{ required: true, message: '请选择开始时间' }],
//                                         initialValue:
//                                             createModalType == 'edit'
//                                                 ? moment(
//                                                       calendrDetail && calendrDetail.startTime,
//                                                       format
//                                                   )
//                                                 : moment('08:00', format),
//                                     })(
//                                         <TimePicker
//                                             format={format}
//                                             onChange={this.starttimechange}
//                                             disabledHours={this.donOpenStartHoures}
//                                         />
//                                     )}
//                                 </Form.Item>
//                             </div>
//                             <div style={{ flex: 0.1, marginLeft: '10px', lineHeight: '50px' }}>
//                                 -
//                             </div>
//                             <div style={{ flex: 1 }}>
//                                 <Form.Item>
//                                     {getFieldDecorator('endtime', {
//                                         rules: [{ required: true, message: '请选择结束时间' }],
//                                         initialValue:
//                                             createModalType == 'edit'
//                                                 ? moment(
//                                                       calendrDetail && calendrDetail.endTime,
//                                                       format
//                                                   )
//                                                 : moment('10:00', format),
//                                     })(
//                                         <TimePicker
//                                             format={format}
//                                             onChange={this.endtimechange}
//                                             disabledHours={this.donOpenEndEHoures}
//                                             disabledMinutes={this.donOpenMinuts}
//                                         />
//                                     )}
//                                 </Form.Item>
//                             </div>
//                             <div style={{ flex: 2, lineHeight: '50px' }}>
//                                 共
//                                 {editStartNow && editEndNow
//                                     ? Math.round(Math.abs((editEndNow - editStartNow) / 1000 / 60))
//                                     : nowTime}
//                                 分钟
//                             </div>
//                         </div>
//                     ) : (
//                         <div style={{ display: 'flex' }}>
//                             <div style={{ flex: 1 }}>
//                                 <Form.Item label="起止时间">
//                                     {getFieldDecorator('starttime', {
//                                         rules: [{ required: true, message: '请选择开始时间' }],
//                                         initialValue: startCreateTime
//                                             ? moment(startCreateTime, format)
//                                             : moment('08:00', format),
//                                     })(
//                                         <TimePicker
//                                             minuteStep={5}
//                                             format={format}
//                                             onChange={this.starttimechange}
//                                             disabledHours={this.donOpenStartHoures}
//                                         />
//                                     )}
//                                 </Form.Item>
//                             </div>
//                             <div style={{ flex: 0.1, marginLeft: '10px', lineHeight: '50px' }}>
//                                 -
//                             </div>
//                             <div style={{ flex: 1 }}>
//                                 <Form.Item>
//                                     {getFieldDecorator('endtime', {
//                                         rules: [{ required: true, message: '请选择结束时间' }],
//                                         initialValue: endCreateTime
//                                             ? moment(endCreateTime, format)
//                                             : moment('10:00', format),
//                                     })(
//                                         <TimePicker
//                                             minuteStep={5}
//                                             format={format}
//                                             onChange={this.endtimechange}
//                                             disabledHours={this.donOpenEndEHoures}
//                                             disabledMinutes={this.donOpenMinuts}
//                                         />
//                                     )}
//                                 </Form.Item>
//                             </div>
//                             <div style={{ flex: 2, lineHeight: '50px' }}>
//                                 共
//                                 {startNow && endNow
//                                     ? Math.round(Math.abs((endNow - startNow) / 1000 / 60))
//                                     : '120'}
//                                 分钟
//                             </div>
//                         </div>
//                     )}
//                     <Form.Item label="应用范围">
//                         {getFieldDecorator('week', {
//                             rules: [{ required: true, message: '请输入日期' }],
//                             initialValue:
//                                 createModalType == 'edit'
//                                     ? creatcoursething && creatcoursething.weekDay
//                                         ? [`${creatcoursething.weekDay}`]
//                                         : ''
//                                     : ['1', '2', '3', '4', '5'],
//                         })(
//                             createModalType == 'edit' ? (
//                                 <CheckboxGroup options={optionsWithDisabled} disabled />
//                             ) : (
//                                 <CheckboxGroup
//                                     options={optionsWithDisabled}
//                                     onChange={this.checkChange}
//                                 />
//                             )
//                         )}
//                     </Form.Item>
//                     <Form.Item style={{ display: 'flex' }}>
//                         <span style={{ flex: 4 }}>
//                             {createModalType == 'create' ? (
//                                 typeChangeNumber == 1 || typeChangeNumber == 2 ? (
//                                     <span style={{ marginLeft: 380 }}></span>
//                                 ) : (
//                                     <span className={styles.righticon}>
//                                         <Checkbox onChange={this.checkChangeValue}>
//                                             不允许连排课程横跨该时段
//                                         </Checkbox>
//                                     </span>
//                                 )
//                             ) : (
//                                 <span className={styles.icon} onClick={this.deteleBtn}>
//                                     <i className={icon.iconfont + ' ' + styles.deleteRow}>
//                                         &#xe739;
//                                     </i>
//                                     删除当前作息活动
//                                 </span>
//                             )}
//                         </span>
//                         <span style={{ flex: 1 }}>
//                             <span
//                                 className={styles.modalBtn + ' ' + styles.cancelBtn}
//                                 onClick={this.hideModal}
//                             >
//                                 取消
//                             </span>
//                             <span
//                                 className={styles.modalBtn + ' ' + styles.submitBtn}
//                                 onClick={this.handleSubmit}
//                             >
//                                 完成
//                             </span>
//                         </span>
//                     </Form.Item>
//                 </Form>
//             </Modal>
//         );
//     }
// }

// function mapStateToProps(state) {
//     return {
//         deleteCalendar: state.time.deleteCalendar,
//         addScheduleText: state.time.addScheduleText,
//         modifScheduleWork: state.time.modifScheduleWork,
//         calendrDetail: state.time.calendrDetail || {},
//     };
// }
// export default connect(mapStateToProps)(Form.create()(CreateCourse));
