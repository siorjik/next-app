import { PlusCircleOutlined } from '@ant-design/icons';

import { userCreateAppPath, usersAppPath } from '@/utils/paths';

export const usersMenu = [
  {
    label: 'List',
    path: usersAppPath,
    icon: <PlusCircleOutlined className='icons' />
  },
  {
    label: 'Create',
    path: userCreateAppPath,
    icon: <PlusCircleOutlined className='icons' />
  }
]
