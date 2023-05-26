import type { NextApiRequest, NextApiResponse } from 'next'

import apiService from '@/services/apiService'
import { apiUserCreatePasswordPath } from '@/utils/paths'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await apiService.post(apiUserCreatePasswordPath, req.body)

    res.status(200).json(result)
  } catch (err) {
    res.send(err.response.data)
  }
}
