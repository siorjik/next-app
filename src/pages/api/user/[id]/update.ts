import type { NextApiRequest, NextApiResponse } from 'next'

import apiService from '@/services/apiService'
import { getApiUserUpdatePath } from '@/utils/paths'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result = await apiService.put(getApiUserUpdatePath(req.query.id as string), req.body)
  
    res.status(200).json(result)
  } catch (err) {
    res.send(err.response.data)
  }
}
