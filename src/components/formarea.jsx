import React from "react";
import axios from "axios"
import { Button,MessageBox,Message, Notification, Dialog,Form,Input } from 'element-react';
import btn_area from '../img/btn_area.png';
import btn from '../img/btn.png';
// const onClick=()=>{
//     MessageBox.prompt('请输入邮箱', '提示', {
//       inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
//       inputErrorMessage: '邮箱格式不正确'
//     }).then(({ value }) => {
//       Message({
//         type: 'success',
//         message: '你的邮箱是: ' + value
//       });
//     }).catch(() => {
//       Message({
//         type: 'info',
//         message: '取消输入'
//       });
//     });
//   }

export  class Formarea extends React.Component {
    constructor(){
      super(); 
      this.state ={
        dialogVisible: false,
        phoneNumber:"",
        code:"",
        // URL: "https://jr.tuniu.com/opl/promotion/getGift",
        // URL2: "https://jr.tuniu.com/opl/promotion/sendMessage",  //验证码

        URL: "http://jr.tuniu.com:8181/opl/promotion/getGift",
        URL2: "http://jr.tuniu.com:8181/opl/promotion/sendMessage",  //验证码   

        timeout:"",

      }
    }
    //弹出窗口
    popupWin(){
        if(!this.checkPhone(this.state.phoneNumber)){
            MessageBox.msgbox({
                title: '提示',
                message: '错误的手机号码',
                type:"error",
                showCancelButton: false
              }).then((action)=>{
                  console.log(action)
                  document.getElementById("phoneNumber").focus();
              });
              return;
        }
        //验证手机验证码
        this.setState({ dialogVisible: true });
        this.sendCode(); //窗口一打开自动就发一条短信

    }
    //确定领取
    getCoupon2() {

        //this.setState({ dialogVisible: false })
        let code = this.state.code;
        if (code == "") {   
          MessageBox.alert('请输入验证码', '提示');
          return;
        }

  
        //return;
        let request = {
          smsCode: code, // 验证码 必填 String
          phoneNum: this.state.phoneNumber, //手机号，必填
          type: 1, // 类型，非必填 1 促销短信验证码  用于统计
          desc: "" // 活动描述， 非必填
        };
  
  
        axios.post(this.state.URL, request).then(response => {
           
            if (response.data.success) {
              //console.log( this.data)
              // alert("恭喜您领取成功。");
                MessageBox.alert('恭喜您领取成功。', '提示').then(() => {
                    //if (platform == 1) {
                    location.href = "http://jr.tuniu.com/opl/couponList"; //pc
                    //} else {
                    //location.href = "http://8.m.tuniu.com/xdm/m/index/ticket"; //Msite
                    //}
                });
            }else{
                MessageBox.alert(response.data.msg, '提示')             
            }
          }).catch(error => {
                MessageBox.alert("发生了网络错误.请稍后再试.", '提示');
                //console.log(error);
          });
      }
    sendCode(){
        if(this.state.timeout!=""){
            return;
        }
        
        let req={
            phone:this.state.phoneNumber,  // 电话号码   
            type:2 // 1：开通实名，2：添加代扣卡
        }
       axios.post(this.state.URL2,req).then(response => {
           if (response.data.success) {
                Notification({
                    title: '成功',
                    message: '验证码已发送到您的手机，请查收.'+ this.state.code,
                    type: 'success'
                });  
           }else{           
               this.setState({timeout:""}); 
                 Message({
                    type: 'error',
                    message: '发生了网络错误'
                });
           }
        });

        let i=0, second=60; //倒计时多少秒
        let to=setInterval(_=>{
            if(i<second){              
                this.setState({timeout:(second-i)});
                i++;
            }else{
                clearInterval(to);
                this.setState({timeout:""});                
                i=0;                   
            }	
        },1000);

    

    }
    checkPhone(phone) {
        if (!/^1[345789]\d{9}$/.test(phone)) {
          return false;
        }
        return true;
    }
    render(){
        return(
           
            <div className="formarea">
                    <div><img src={btn_area} /></div>
                    <div className="operate">
                        <input type="text" value={this.state.phoneNumber} className="phoneNumber" id="phoneNumber" placeholder="请输入您的手机号码" maxLength="11" onChange={(event)=>{ this.setState({phoneNumber: event.target.value})}} />
                        <img onClick={ () => this.popupWin() } src={btn} />
                    </div>
                       <Dialog
                        title="请输入验证码"
                        size="tiny"
                        top="30%"
                        className="codeArea" 
                        visible={ this.state.dialogVisible }
                        onCancel={ () => this.setState({ dialogVisible: false }) }
                        lockScroll={ true }
                        closeOnClickModal={false}
                        >
                            <Dialog.Body>
                                
                                        <input type="text" value={this.state.code}  placeholder="请输入验证码" onChange={(event)=>{ this.setState({code:event.target.value})}} className="codeInput" maxLength="6"/>
                                                                        
                                        <Button onClick={ () => this.sendCode()}>获取验证码{this.state.timeout}</Button>
                                        
                                
                            </Dialog.Body>
                            <Dialog.Footer className="dialog-footer" style={{textAlign: "right"}}>
                                {/* <Button onClick={ () => this.setState({ dialogVisible: false }) }>取消</Button> */}
                                <Button type="primary" onClick={ () => this.getCoupon2() }>确定领取</Button>
                            </Dialog.Footer>
                        </Dialog>
          </div>      
           

            
            
        )
    }
}



// export const Formarea1=(props)=>{  
//     console.log(props);    
//     return (
//         <div className="formarea">
//             <div><img src={btn_area} /></div>
//             <div className="operate">
//                 <input type="text" maxLength="11"/>
//                 <img onClick={props.onClick} src={btn} />
//             </div>
//         </div>
//      )
// }