import axios from "axios";
import Element from 'element-ui'
import router from "./router";
import qs from 'qs';
axios.defaults.baseURL = "http://127.0.0.1:5001"

const request = axios.create({
    timeout: 5000,

})
request.interceptors.request.use(config => {
    config.headers['token'] = localStorage.getItem("token") // 请求头带上token

    if (config.url =="/auth/oauth/token"){
        config.data = qs.stringify(config.data)
    }


    return config
})
request.interceptors.response.use(response => {
        let res = response.data;


        if (res.message === "success") {
            return response
        } else {
            Element.Message.error(!res.msg? res.message : '系统异常！', {duration: 3 * 1000})
            console.log("-----------------------")
            console.log(res.message);
            return Promise.reject(response.data.message)
        }
    },
    error => {
        console.log(error.response)
        if (error.response.url =="auth/oauth/token"){
            error.message = error.response.data.data.error_description
        }

        if(error.response.status === 401) {
            error.message = error.response.data.data
            router.push("/login")
            Element.Message.error(error.message, {duration: 3 * 1000})
            return Promise.reject(error)
        }

        if(error.response.status === 504) {
            error.message = error.response.data.data
            Element.Message.error("请求超时,请联系管理员", {duration: 3 * 1000})
            return Promise.reject(error)
        }

        else if(error.response.data) {
            error.message = error.response.data.data.error_description
        }

        Element.Message.error(error.message, {duration: 3 * 1000})
        return Promise.reject(error)
    }
)
export default request
