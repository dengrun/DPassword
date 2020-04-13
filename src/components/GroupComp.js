import React, { Component } from 'react';
import moment from 'moment'; 
import {
  Person,
} from 'blockstack';
import { UserGroup } from 'radiks';
import Group from '../models/Group.js';
import GroupUser from '../models/GroupUser.js';

class GroupComp extends Component {
  constructor(props){
    super();

    this.state = {
      groupname: '',
      grouplist: [
        
      ],
      selectedgroup: '',
      group: new Group(),
      inviteuser: '',
      invitationID: ''
    };
  }
    
    groupnameChange(e) {
      this.setState({ groupname: e.target.value })
    }

    //保存组信息
    async saveGroup(groupCreate){
      let today = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      const group = new Group({
        owner: JSON.parse(localStorage.getItem('blockstack-session')).userData.username,
        groupid: groupCreate._id,
        signingkeyid: groupCreate.attrs.signingKeyId,
        privatekey: groupCreate.privateKey,
        name: groupCreate.attrs.name,
        create_time: today,
        update_time: today
      });
      console.log(group)
      await group.save()
    }

    //保存自定义组用户信息
    async saveGroupUser(groupCreate){
      let today = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      const groupuser = new GroupUser({
        owner: JSON.parse(localStorage.getItem('blockstack-session')).userData.username,
        groupid: groupCreate._id,
        membername: JSON.parse(localStorage.getItem('blockstack-session')).userData.username,
        create_time: today,
        update_time: today
      });
      console.log(groupuser)
      await groupuser.save()
    }

    //创建组
    async createGroup(e) {
      console.log(this.state.groupname);
      const group = new UserGroup({ name: this.state.groupname });
      const groupCreate = await group.create();
      
      console.log('创建组');
      console.log(groupCreate);
      await this.saveGroup(groupCreate);

      await this.saveGroupUser(groupCreate);

      this.state.grouplist.push(this.state.groupname);
    }

    async componentDidMount() {
      //读取用户组
      const fetchGroupUserResult = await GroupUser.fetchList({});
      
      console.log(fetchGroupUserResult);

      let result=[];
      for(let i=0;i<fetchGroupUserResult.length;i++){
        console.log(fetchGroupUserResult[i].attrs.groupid);
        const fetchGroupResult = await Group.findOne({"groupid": fetchGroupUserResult[i].attrs.groupid})
        let tmpitem = {
          ...fetchGroupUserResult[i].attrs,
          name: fetchGroupResult.attrs.name
        }
        result.push(tmpitem);
      }

      

        console.log(result);
        console.log(result.length);

      if (result.length>0){
        this.setState({
          grouplist: result,
          selectedgroup: result[0].name || ''
        });
      }
        


        
      
      
    }
  
    //邀请用户
    async inviteUser() {
      const group = await UserGroup.findById(this.state.selectedgroup);

      console.log(group);

      const fetchGroupResult = await Group.findOne({"groupid": this.state.selectedgroup})

      console.log(fetchGroupResult);

      group.privateKey = fetchGroupResult.attrs.privatekey;
      group.groupname = fetchGroupResult.attrs.name;
      console.log(group);

      const invitation = await group.makeGroupMembership(this.state.inviteuser);
      console.log(invitation)
      this.setState({invitationID:invitation._id})
    }

    selectedChange(e) {
      console.log(e.target.value);
      this.setState({ selectedgroup: e.target.value })
    }
  
    inviteuserChange(e) {
      this.setState({ inviteuser: e.target.value })
    }
  render() {
    
    return (
      <div>
        <select class="selectpicker" onChange={e => this.selectedChange(e)}>
          {this.state.grouplist.map((v, i) =>
            <option value={v.groupid}>{v.name}</option>
          )}
        </select>
    

        <label>组名</label>
        <input value={this.state.groupname} onChange={e => this.groupnameChange(e)}></input>
        <button onClick={e => this.createGroup(e)}>创建组</button>

        <label>用户</label>
        <input value={this.state.inviteuser} onChange={e => this.inviteuserChange(e)}></input>
        <button onClick={e => this.inviteUser(e)}>邀请</button>
        <p>{this.state.invitationID}</p>
{this.state.selectedgroup}
      </div>
    )
  }
}

export default GroupComp;