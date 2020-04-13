import { Model } from 'radiks';

export default class Password extends Model {
  static className = 'Password';

  static schema = {
    owner: String,            //所有者
    title: String,            //密码标题
    password: String,         //密码
    userGroupId: {            //用户组
      type: String,
      decrypted: true,
    },
    create_time: {            //创建时间
      type: String,
      decrypted: true
    },
    update_time: {            //最后更新时间
      type: String,
      decrypted: true
    }
  }

  static defaults = {
    content: ""
  }
}