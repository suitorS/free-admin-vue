import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import {LoginUsers, Users} from "./data/user";

let _Users = Users;

var host = window.location.origin;
var http = host + "/free-admin";

export default {

    /**
     * mock bootstrap
     */
    bootstrap() {
        let mock = new MockAdapter(axios);

        // mock success request
        mock.onGet("/success").reply(200, {
            msg: "success"
        });

        // mock error request
        mock.onGet("/error").reply(500, {
            msg: "failure"
        });

        // 登录
        mock.onPost("/login").reply((config) => {
            let {username, password} = JSON.parse(config.data);
            return new Promise((resolve, reject) => {
                let user = null;
                setTimeout(() => {
                    let hasUser = LoginUsers.some((u) => {
                        if (u.username === username && u.password === password) {
                            user = JSON.parse(JSON.stringify(u));
                            user.password = undefined;
                            return true;
                        }
                    });

                    if (hasUser) {
                        resolve([200, {code: 200, msg: "请求成功", user}]);
                    } else {
                        resolve([200, {code: 500, msg: "账号或密码错误"}]);
                    }
                }, 1000);
            });
        });

        // 获取用户列表
        mock.onGet("/user/list").reply((config) => {
            let {name} = config.params;
            let mockUsers = _Users.filter((user) => {
                if (name && user.name.indexOf(name) == -1) {
                    return false;
                }
                return true;
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        users: mockUsers
                    }]);
                }, 1000);
            });
        });

        // 获取用户列表（分页）
        mock.onGet("/user/listpage").reply((config) => {
            let {page, name} = config.params;
            let mockUsers = _Users.filter((user) => {
                if (name && user.name.indexOf(name) == -1) {
                    return false;
                }
                return true;
            });
            let total = mockUsers.length;
            mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        users: mockUsers
                    }]);
                }, 1000);
            });
        });

        // 删除用户
        mock.onGet("/user/remove").reply((config) => {
            let {id} = config.params;
            _Users = _Users.filter((u) => u.id !== id);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: "删除成功"
                    }]);
                }, 500);
            });
        });

        // 批量删除用户
        mock.onGet("/user/batchremove").reply((config) => {
            let {ids} = config.params;
            ids = ids.split(",");
            _Users = _Users.filter((u) => !ids.includes(u.id));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: "删除成功"
                    }]);
                }, 500);
            });
        });

        // 编辑用户
        mock.onGet("/user/edit").reply((config) => {
            let {id, name, addr, age, birth, sex} = config.params;
            _Users.some((u) => {
                if (u.id === id) {
                    u.name = name;
                    u.addr = addr;
                    u.age = age;
                    u.birth = birth;
                    u.sex = sex;
                    return true;
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: "编辑成功"
                    }]);
                }, 500);
            });
        });

        // 新增用户
        mock.onGet("/user/add").reply((config) => {
            let {name, addr, age, birth, sex} = config.params;
            _Users.push({
                name: name,
                addr: addr,
                age: age,
                birth: birth,
                sex: sex
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: "新增成功"
                    }]);
                }, 500);
            });
        });

        var Enums = {
            AttributeType: ["INT", "STRING", "BOOLEAN", "FLOAT", "DOUBLE", "DATE", "TIME", "DATETIME"]
        };

        // 获取Enum
        mock.onGet("/enum").reply((config) => {
            let {name} = config.params;
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        resolve([200, Enums[name]]);
                    } catch (e) {
                        resolve([200, {
                            code: 200,
                            msg: "没有相关数据",
                            data: []
                        }]);
                    }
                }, 500);
            });
        });

        // 创建class
        mock.onPost("/createClass").reply((config) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        resolve([200, {
                            code: 200,
                            msg: "操作成功",
                            data: []
                        }]);
                    } catch (e) {
                        resolve([200, {
                            code: 200,
                            msg: "没有相关数据",
                            data: []
                        }]);
                    }
                }, 500);
            });
        });

        /**
         * 获取class
         */
        mock.onPost("/get").reply((config) => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        resolve([200, {
                            code: 200,
                            msg: "操作成功",
                            data: []
                        }]);
                    } catch (e) {
                        resolve([200, {
                            code: 200,
                            msg: "没有相关数据",
                            data: []
                        }]);
                    }
                }, 500);
            });
        });

        /**
         * 查询归属地址
         */
        mock.onGet(`${http}/phone/from`).reply((config) => {

            var data = {
                "code": null,
                "data": {"carrier": "移动", "cityName": "绵阳市", "provinceName": "四川"},
                "msg": "操作成功!",
                "other": null,
                "success": true
            };

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    try {
                        resolve([200, data]);
                    } catch (e) {
                        resolve([200, data]);
                    }
                }, 500);
            });
        });

    }
};
