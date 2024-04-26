import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import styles from './index.less';
import moment from 'moment';
import { Row, Col,Checkbox, Select, Input, Pagination, message, Dropdown, Menu, Modal, DatePicker, Popover } from 'antd';
import icon from '../../../../icon.less';
import { trans } from '../../../../utils/i18n';
import { formatTimeSafari } from '../../../../utils/utils';

export default class SemesterGrid extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isShowCreat : false, //新建学期弹窗显隐
            semesterCName:'', // 新建学期中文名
            semesterEName  : '', //新建学期英文名
            semesterEndTime : '', // 新建学期的结束时间
            creatSemesterStartTime : '', // 新建学期的开始时间
            schoolYearDetail :'' ,// 学年的详情
            isShowEdit : false, // 编辑学年弹窗显隐
            editSchoolYearCname : '', // 编辑学年--学年中文名
            editSchoolYearEname : '', // 编辑学年信息--学年中文名
            editEndTime : '', // 编辑学年信息--学年结束时间
            editSemesterCname : '', // 编辑学年--学期中文名
            editSemesterEname : '', // 编辑学年--学期英文名
            editSemesterEndTime : '', // 编辑学年--学期结束时间
            editSemesterStartTime : '', // 编辑学年--学期开始时间
            editId : '', //储存修改的id
            editIndex: ''
        }
    }
    // 格式化日期
    formatDate  = (date,type) => {
        var date = new Date(formatTimeSafari(date) );
        var YY = date.getFullYear() + '-';
        var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        if(type == 'noInfo') return YY + 7 + '-' + 11 
        if(type == 'hasInfo') return YY + MM + (DD+1)
        return YY + MM + DD ;
    }

    // 新建学期弹窗显示
    showCreat  (detail)  {
        const { schoolYearListInfo } = this.props;
        let creatSemesterStartTime = '';
        let currentEnd = '';
        schoolYearListInfo && schoolYearListInfo.length>0 && schoolYearListInfo.map((item)=>{
            item.semesterOutputModels && item.semesterOutputModels.length>0 && item.semesterOutputModels.map((el)=>{
                if(el.current) currentEnd =el.endTime;
                            creatSemesterStartTime = this.formatDate(currentEnd,'hasInfo')
            })
        })
        this.setState({
            isShowCreat : true,
            creatSemesterStartTime,
            schoolYearDetail : detail
        })
    }

    // 新建学期弹窗显示
    cancelCreat =() => {
        this.setState({
            isShowCreat : false
        })
    }

    // 新建学期二次确认
    confirmSemester = () => {
        Modal.confirm({
            title: <span className = {styles.confirmText}>新建学期后将无法删除，确定继续吗？</span>,
            okText: '确认',
            cancelText: '取消',
            onOk : this.creatSemester
        })

    }

    // 新建学期
    creatSemester = () => {
        const { dispatch, schoolId, companyId} = this.props;
        const {semesterCName, semesterEName, semesterEndTime, creatSemesterStartTime, schoolYearDetail} = this.state;
        this.setState({
            isShowCreat : false,
        })
        dispatch({
            type : 'organize/createSemester',
            payload:{
                name : semesterCName,
                enName :semesterEName,
                startTime :creatSemesterStartTime,
                endTime :semesterEndTime,
                // companyId,
                schoolId,
                schoolYearId :schoolYearDetail.id,
            }
        })
    }
    
    // 开启学年二次确认
    startYearHandle (id)  {
        
        Modal.confirm({
            title: <span className = {styles.confirmText}>开启新学年后无法撤回，确定开启新学年吗？</span>,
            okText: '确认',
            cancelText: '取消',
            onOk : this.creatSchoolYear.bind(this,id)
        })
    }

    // 开启学年
    creatSchoolYear (id) {
        const { dispatch, schoolId } = this.props;
        dispatch({
            type: 'organize/startSchoolYear',
            payload: {
                schoolYearId : id,
                schoolId,
            }
        })
    }

    // 启动学期
    startSemesterHandle (id)  {
        Modal.confirm({
            title: <span className = {styles.confirmText}>开启新学期后无法撤回，确定开启新学期吗？</span>,
            okText: '确认',
            cancelText: '取消',
            onOk : this.sureForSemester.bind(this,id)
        })
        
    }

    sureForSemester (id) {
        const { dispatch, schoolId } = this.props;
        dispatch({
            type:'organize/startSemester',
            payload : {
                semesterId:id,
                schoolId ,
            }
        })
    }


    // 设置新建学期的中文名
    changeSemesterCName = (e) => {
        this.setState({
            semesterCName : e.target.value
        })
    }

    // 设置新建学期的英文名
    changeSemesterEName= (e) => {
        this.setState({
            semesterEName : e.target.value
        })
    }

    //
    changeEnd = (date,dateString) => {
        this.setState({
            semesterEndTime : dateString
        })
    }

    editSchoolYear (index)  {
        this.setState({
            isShowEdit : true,
            editIndex: index
            //schoolYearDetail : detail
        },()=>{
        })
    }
    cancelEdit = () => {
        this.setState({
            isShowEdit : false
        })
    }
    // 编辑学年信息--学年中文名
    editAdemicCname = (e) => {
        this.setState({
            editSchoolYearCname : e.target.value
        })
    }
    
    // 编辑学年信息--学年英文名
    editAdemicEname = (e) => {
        this.setState({
            editSchoolYearEname : e.target.value
        })
    }

    // 编辑学年信息--学年结束时间
    changeEditDateEnd = (date,dateString) => {
        this.setState({
            editEndTime : dateString
        })
    }

    // 编辑学年--学期中文名
    editSemesterCh (id,e) {
        const { }
        const {schoolYearDetail} = this.state;
        this.setState({
            editSemesterCname : e.target.value
        })
        this.props.dispatch({
            type : 'organize/updateSchoolYear',
            payload:{
                schoolYearId : schoolYearDetail.id,
                semesterId : id,
                semesterCname : e.target.value
            }
            
        })
        
    }

    // 编辑学年--学期英文名
    editSemesterEn (id,e) {
        const {schoolYearDetail} = this.state;
        this.setState({
            editSemesterEname : e.target.value
        })
        this.props.dispatch({
            type : 'organize/updateSchoolYear',
            payload:{
                schoolYearId : schoolYearDetail.id,
                semesterId : id,
                semesterEname : e.target.value
            }
        })
    }

    // 编辑学年--学期结束时间
    endSemesterEdit  (id,date,dateString)  {
        const {schoolYearDetail} = this.state;
        this.setState({
            editSemesterEndTime : dateString
        })
        this.props.dispatch({
            type : 'organize/updateSchoolYear',
            payload:{
                schoolYearId : schoolYearDetail.id,
                semesterId : id,
                semesterEndTime : dateString
            }
            
        })
    }
    
    // 编辑学年--学期开始时间
    startSemesterEdit (id,date,dateString) {
        const {schoolYearDetail} = this.state;
        this.setState({
            editSemesterStartTime : dateString
        })
        this.props.dispatch({
            type : 'organize/updateSchoolYear',
            payload:{
                schoolYearId : schoolYearDetail.id,
                semesterId : id,
                semesterStartTime : dateString
            }
            
        })
    }

    // 编辑学年--取消
    cancelBtn = () => {
        this.setState({
            isShowEdit : false
        },()=>{
            this.props.getSchoolYearList()
        })
    }

    // 编辑学年--确认
    editComfrim = () => {
        const { dispatch, schoolYearListInfo, schoolId, companyId } = this.props;
        const { schoolYearDetail, 
            editSchoolYearCname, 
            editSchoolYearEname, 
            editEndTime,
            editSemesterCname,
            editId,
        } = this.state;

    



        let payloadSchoolYear ={}
        schoolYearListInfo && schoolYearListInfo.length>0 && schoolYearListInfo.map((item)=>{
            if(schoolYearDetail.id == item.id) {
                payloadSchoolYear = item;
            }
        })
        dispatch({
            type : 'organize/editSchoolYear',
            payload:{
                name : editSchoolYearCname ? editSchoolYearCname : schoolYearDetail.name,
                enName : editSchoolYearEname ? editSchoolYearEname : schoolYearDetail.ename,
                startTime : payloadSchoolYear.startTime,
                endTime :editEndTime ? editEndTime : schoolYearDetail.endTime,
                schoolId ,
                id : payloadSchoolYear.id,
                semesterInputModelList : payloadSchoolYear.semesterOutputModels
            },
            onSuccess : () => {
                this.setState({
                    isShowEdit : false
                },()=>{
                    this.props.getSchoolYearList()
                })
            }
        })
    }

    render () {
        const { isShowCreat, creatSemesterStartTime, isShowEdit, schoolYearDetail, editSemesterCname } = this.state;
        const { schoolYearListInfo } = this.props;
        console.log(schoolYearDetail,'schoolYearDetail')
        const dateFormat = 'YYYY - MM - DD';
        let now = this.formatDate(new Date(),'noInfo')
        let currentSchoolYear = ''
        let year = schoolYearListInfo && schoolYearListInfo.length>0 && schoolYearListInfo[0].schoolYearId + 1 || '';
        schoolYearListInfo && schoolYearListInfo.length>0 && schoolYearListInfo.map((item)=>{
            if(item.current) currentSchoolYear = item.endTime
        })
        let nextDay = this.formatDate(currentSchoolYear,'hasInfo')
        let ceratStart = schoolYearListInfo && schoolYearListInfo.length == 0 ? now : nextDay;
        let next = '';
        return <div className = {styles.content}>
            {
                schoolYearListInfo && schoolYearListInfo.length>0 && schoolYearListInfo.map((item,index) => {

                    let arr = [...item.semesterOutputModels]
                    let last = arr.pop()
                    
            return (<div className = {styles.grid}>
                <div className = {styles.schoolYear}>
                    <span className = {styles.title}>{item.name} &nbsp; {item.ename}</span>
                    <span className = {styles.timeRange}><i className = {icon.iconfont}>&#xe62a;</i> &nbsp;{this.formatDate(item.startTime)} ~ {this.formatDate(item.endTime)}</span>
                    {
                        schoolYearListInfo[0].current? "" : index == 0 ? <div>
                            <Popover 
                                content = {<div className = {styles.popoverContent}>
                                    <div className = {styles.term}>启动新学年需要满足以下2个条件:</div>
                                    <div className = {styles.first}>1. 完成行政班升年级设置 <span className = {styles.set}>前往设置</span></div>
                                    <div className = {styles.second}>2. 最高年级学生已毕业 <span className = {styles.set1}>前往设置</span></div>
                                </div>}
                                placement = 'bottom'
                            >
                                <span className = {styles.info}><i className = {icon.iconfont}>&#xe7f3;</i></span>
                            </Popover>

                            <span className = {styles.startYear} onClick = {this.startYearHandle.bind(this,item.id)}>{trans('global.startYear', '启动学年')}</span>
                        </div> : ''
                    }
                    {
                        item.current && <span className = {styles.currentYear}>{trans('global.currentYear', '当前学年')}</span>
                    }
                    { index == 0 ? <span className = {styles.edit} onClick = {this.editSchoolYear.bind(this,index)}>编辑</span> : ''}
                </div>
                <div className = {styles.semester}>
                    {
                        item.semesterOutputModels && item.semesterOutputModels.length>0 && item.semesterOutputModels.map((el,num) => {
                            if(el.current) {
                                next = num+1
                            }
                            let listHeight = 1 / (item.semesterOutputModels.length) * 100 + '%';
                            return (<Row className = {styles.rowStyle} style={{ height: listHeight }} key={num}>
                                <Col span={20} key = {num}>
                                    <span className = {styles.semesterName}>{el.name}</span>
                                    <span className = {styles.semesterTime}><i className = {icon.iconfont}>&#xe62a;</i> &nbsp;{this.formatDate(el.startTime)} ~ {this.formatDate(el.endTime)}</span>
                                    {
                                        el.current && <span className = {styles.currentSemester}>{trans('global.currentSemester', '当前学期')}</span>
                                    }
                                    {
                                        num == next && item.current &&  <span className = {styles.startSemester} onClick = {this.startSemesterHandle.bind(this,el.id)}>{trans('global.Start semester','启动学期')}</span>
                                    }
                                    {
                                        el.current && last.endTime < item.endTime &&  <span className = {styles.creatSemester} onClick = {this.showCreat.bind(this,item)}>{trans(
                                            'global.createSemester',
                                            '+ 新建学期'
                                        )}</span>
                                    } 

                                </Col>
                            </Row>)
                        })
                    }
                </div>
                {
                    <Modal 
                        title ={<span>{trans(
                            'global.createSemester',
                            '+ 新建学期'
                        )}</span>}
                        visible = {isShowCreat}
                        onCancel = {this.cancelCreat}
                        className = {styles.semesterModal}
                        footer= {null}
                    >
                        <div className = {styles.modalContent}>
                            <div className = {styles.semesterCName}>
                                <span className = {styles.title}>学期中文名</span><Input onChange = {this.changeSemesterCName}></Input>
                            </div>
                            <div className = {styles.semesterCName}>
                                <span className = {styles.title}>{trans('global.SemesterEnglishName','学期英文名')}</span><Input onChange = {this.changeSemesterEName}></Input>
                            </div>
                            <div className = {styles.timeRange}>
                                <span className = {styles.title}>{trans('global.Period', '时间周期')}</span>
                                <div className = {styles.pick}>
                                    <DatePicker
                                        defaultValue = {moment(creatSemesterStartTime, dateFormat)} 
                                        disabled={true}
                                    ></DatePicker> 
                                    <span className = {styles.to}>至</span>
                                    <DatePicker
                                        onChange = {this.changeEnd}
                                    ></DatePicker>
                                </div>
                            </div>
                            <div className = {styles.btns}>
                                <span className = {styles.cancelBtn} onClick = {this.cancelCreat}>取消</span>
                                <span className = {styles.okBtn} onClick = {this.confirmSemester}>确定</span>
                            </div>
                        </div>
                    </Modal>
                }
                {
                    <Modal
                        title ={<span>编辑{schoolYearDetail.schoolYearId}学年</span>}
                        visible = {isShowEdit}
                        onCancel = {this.cancelBtn}
                        className = {styles.editYearModal}
                        footer= {null}
                        width='950px'
                    >
                        <div className = {styles.modalContent}>
                            <div className = {styles.academicName}>
                                <span className = {styles.title}>{trans('global.yearName', '学年中文名')}</span><Input onChange = {this.editAdemicCname} defaultValue = {schoolYearDetail.name}></Input>
                            </div>
                            <div className = {styles.academicName}>
                                <span className = {styles.title}>{trans('global.yearEname', '学年英文名')}</span><Input onChange = {this.editAdemicEname} defaultValue = {schoolYearDetail.ename}></Input>
                            </div>
                            <div className = {styles.timeRange}>
                                <span className = {styles.title}>{trans('global.Period', '时间周期')}</span>
                                <div className = {styles.pick}>
                                    <DatePicker 
                                        defaultValue = {moment(this.formatDate(schoolYearDetail.startTime), dateFormat)} 
                                        disabled={true}
                                    ></DatePicker> 
                                    <span className = {styles.to}>至</span>
                                    <DatePicker 
                                    onChange = {this.changeEditDateEnd}
                                    defaultValue = {moment(this.formatDate(schoolYearDetail.endTime),dateFormat)}
                                    ></DatePicker>
                                </div>
                                
                            </div>
                        </div>
                        <span className = {styles.academicInfo}>{trans('global.SemesterInformation', '学期信息')}</span>
                        <i className = {styles.line}></i>
                        {
                            schoolYearDetail && schoolYearDetail.semesterOutputModels && 
                            schoolYearDetail.semesterOutputModels.length > 0 &&
                            schoolYearDetail.semesterOutputModels.map((obj,order)=>{
                                return <div className = {styles.semesterStage}>
                                            <Input onChange = {this.editSemesterCh.bind(this,obj.id)} defaultValue = {obj.name} key = {obj.id}></Input>
                                            <Input onChange = {this.editSemesterEn.bind(this,obj.id )} defaultValue = {obj.ename}></Input>
                                            <div className = {styles.semesterTime}>
                                                <DatePicker 
                                                    onChange = {this.startSemesterEdit.bind(this,obj.id)}
                                                    defaultValue = { moment(this.formatDate(obj.startTime), dateFormat)} 
                                                    disabled={order == 0 ? true : false}
                                                ></DatePicker>
                                                <span>至</span>
                                                <DatePicker 
                                                onChange = {this.endSemesterEdit.bind(this,obj.id)}
                                                defaultValue = { moment(this.formatDate(obj.endTime), dateFormat)} 
                                                ></DatePicker>
                                            </div>
                                        </div>
                         })}
                        <div className = {styles.btns}>
                            <span className = {styles.cancelBtn} onClick = {this.cancelBtn}>取消</span>
                            <span className = {styles.okBtn} onClick = {this.editComfrim}>确定</span>
                        </div>
                    </Modal>
                }
            </div>)
        })
            }
        </div>
    }
}
