import { Model } from 'radiks';

export default class GroupUser extends Model {
  static className = 'GroupUser';

  static schema = {
    owner: String,            //所有者
    name: String,             //组名称
    membername: String,       //组成员
    create_time: {            //创建时间
      type: String,
      decrypted: true
    },
    update_time: {            //最后更新时间
      type: String,
      decrypted: true
    }
  }
}