/* eslint-disable n/no-process-env */

import axios, { AxiosError } from "axios"
import { redirect } from "next/navigation"

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  withCredentials: true,
})

axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error instanceof AxiosError) {
      if (error.status === 401) {
        if (typeof window !== "undefined") {
          // window.location.href = "/sign-in"
        } else {
          redirect("/sign-in")
        }
      }
    }
    return await Promise.reject(error)
  }
)

export default axiosInstance
