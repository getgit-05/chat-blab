import axios from "axios"

export const axiosInstance=axios.create({
    baseURL:"https://chat-blab.onrender.com/api",
    withCredentials:true,
})