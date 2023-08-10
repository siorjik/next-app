import { FormInstance } from 'antd'

export default (val: string, form: FormInstance, field: string) => {
  if (isNaN(+val)) form.setFieldValue(field, val.substring(0, val.length - 1))
}
