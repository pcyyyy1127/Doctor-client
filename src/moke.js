const Mock = require('mockjs')

const Random = Mock.Random

let Result ={
    code :200,
    message:'success',
    data:null
}

Mock.mock('/getCaptcha','get',()=>{

    Result.data = {
        keyCode: Random.string(32),
        captchaImg:Random.dataImage('120x40','p7n5w')

    }
    return Result

})


Mock.mock('/admin/userInfo','get',()=>{

    Result.data = {
        id:"1",
        username:"管理员",
        avatar:"https://img2.baidu.com/it/u=3144262592,4188609267&fm=26&fmt=auto"

    }
    return Result

})

// 因为mock不认识/login?username=xxx，所以用了正则表达式
Mock.mock(RegExp('/login*'), 'post',() => {

    Result.code = 200,
    Result.message = ""

    return Result
})


Mock.mock('/logout','post',()=>{

    return Result

})

Mock.mock('http://127.0.0.1:5001/sys/menu/nav', 'get', () => {

    let nav = [
        {
            name: 'archives',
            title: '健康档案',
            icon: 'el-icon-s-tools',
            path: '/archives',
            component: '/Archives',

        },
        {
            name: 'visit',
            title: '就诊信息',
            icon: 'el-icon-s-operation',
            component: '/visit',
            path: '/visit',

        },
        {
            name: 'followUp',
            title: '患者随访',
            icon: 'el-icon-s-operation',
            component: '/followUp',
            path: '/followUp',

        },

    ]

    let authoritys = ['sys:user:list', "sys:user:save", "sys:user:delete"]

    Result.data = {
        nav: nav,
        authoritys: authoritys
    }

    return Result
})
