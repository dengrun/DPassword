import { Model } from 'radiks';

export default class Group extends Model {
  static className = 'Group';

  static schema = {
    owner: String,            //所有者
    name: String,             //组名称
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