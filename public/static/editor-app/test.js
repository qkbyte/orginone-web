var node= [
        {
            "id": 17,
            "roleGroupName": "默认分组",
            "isDeleted": -1,
            "addTime": "",
            "sceneCode": "89371977-b1b4-11e9-8d9b-005056c00001",
            "sceneRoles": [
                {
                    "id": 27,
                    "roleName": "scene_admin",
                    "roleNameZh": "组织管理员",
                    "roleDescription": "",
                    "status": true,
                    "applicableUnitLevel": "",
                    "productCode": "",
                    "enableTime": "2019-07-29 11:54:17",
                    "disableTime": "",
                    "updatedTime": "",
                    "createdTime": "2019-07-29 11:54:17",
                    "groupId": 17,
                    "roleDefault": 0,
                    "sceneCode": "89371977-b1b4-11e9-8d9b-005056c00001",
                    "checked": 0
                },
                {
                    "id": 35,
                    "roleName": "scene_normal",
                    "roleNameZh": "系统开发者",
                    "roleDescription": "",
                    "status": true,
                    "applicableUnitLevel": "",
                    "productCode": "",
                    "enableTime": "2019-07-30 09:49:27",
                    "disableTime": "",
                    "updatedTime": "",
                    "createdTime": "2019-07-30 09:49:27",
                    "groupId": 17,
                    "roleDefault": 0,
                    "sceneCode": "89371977-b1b4-11e9-8d9b-005056c00001",
                    "checked": 0
                }
            ]
        },
        {
            "id": 18,
            "roleGroupName": "开发小组",
            "isDeleted": -1,
            "addTime": "",
            "sceneCode": "89371977-b1b4-11e9-8d9b-005056c00001",
            "sceneRoles": [
                {
                    "id": 28,
                    "roleName": "scene_default",
                    "roleNameZh": "终端普通用户",
                    "roleDescription": "",
                    "status": true,
                    "applicableUnitLevel": "",
                    "productCode": "",
                    "enableTime": "2019-07-29 11:54:17",
                    "disableTime": "",
                    "updatedTime": "",
                    "createdTime": "2019-07-29 11:54:17",
                    "groupId": 18,
                    "roleDefault": 1,
                    "sceneCode": "89371977-b1b4-11e9-8d9b-005056c00001",
                    "checked": 0
                }
            ]
        }
    ]


function dubRemove(arr){
        let res=[];
        let repeat=[];
        for(let i=0;i<arr.length;i++){
            let name=arr[i].name;
            if(!repeat[name]){
                res.push(arr[i]);
                repeat[name]=1
            }
        }
        return res;
}
let arr=[];

 function unflatten(data) {
    var result = {};
    let obj={}
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 
                 recurse(cur[i], prop + "[" + i + "]");
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                if(cur.roleGroupName){
                    obj={id:cur.id,name:cur.roleGroupName,pId:0}
                }else{
                    obj={id:cur.id,name:cur.roleNameZh,pId:cur.groupId}
                }
                
                arr.push(obj);
              
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return arr;
}

console.log(dubRemove(unflatten(node)))