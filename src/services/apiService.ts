import axios from 'axios'

import { apiRefreshPath } from '@/utils/paths'

class ApiService {
  private axiosInstance = axios.create({ withCredentials: true, baseURL: process.env.API_HOST })
  private accessToken = ''
  private refreshCookie = ''

  constructor() {
    this.axiosInstance.interceptors.request.use(config => {
      if (this.accessToken && (config.headers.Authorization !== this.accessToken || !config.headers.Authorization)) {
        config.headers.Authorization = this.accessToken
      }

      if (this.refreshCookie && config.headers['Set-Cookie'] !== this.refreshCookie) {
        config.headers['Set-Cookie'] = this.refreshCookie
      }
    
      return config
    })
    
    this.axiosInstance.interceptors.response.use(config => {
      return config
    }, async (error) => {
      const originalRequest = error.config
    
      if (error.response!.status == 401 && originalRequest && !originalRequest.isRetry) {
        originalRequest.isRetry = true

        try {
          const tokens = await axios.get(`${process.env.API_HOST}${apiRefreshPath}`, { withCredentials: true })
  
          if (tokens && tokens.data) {
            await this.setAuth(tokens.data.accessToken)
            await this.setCookie(tokens.headers['set-cookie']![0])
  
            const res = await this.axiosInstance.request(originalRequest)

            if (res) return res.data
          }
        } catch (err) {
          throw err
        }
      } else if (error.response!.status == 400) {
        throw error
      }
    })
  }

  async setAuth(token: string) {
    this.accessToken = `Bearer ${token}`

    //this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }

  async setCookie(value: string) {
    this.refreshCookie = value

    //this.axiosInstance.defaults.headers.common['Set-Cookie'] = value
    axios.defaults.headers.common['Set-Cookie'] = value
  }

  async get(url: string, withData: boolean = true) {
    try {
      if (withData) {
        const res = await this.axiosInstance.get(url)

        if (res) return res.data
      } else return await this.axiosInstance.get(url)
    } catch (err) {
      throw err
    }
  }

  async post(url: string, fields: { [k: string]: string | number | boolean }, withData: boolean = true) {
    try {
      if (withData) {
        const res = await this.axiosInstance.post(url, fields)

        if (res) return res.data
      } else return await this.axiosInstance.post(url, fields)
    } catch (err) {
      throw err
    }
  }

  async put(url: string, fields: { [k: string]: string | number | boolean }) {
    try {
      const res = await this.axiosInstance.put(url, fields)

      if (res) return res.data
    } catch (err) {
      console.log('PUT error ', err.response.data)
      throw err
    }
  }

  async delete(url: string) {
    try {
      return (await this.axiosInstance.delete(url)).data
    } catch (err) {
      throw err
    }
  }

  clearSettings() {
    this.setAuth('')
    this.setCookie('')
  }
}

export default new ApiService()
