'use strict';

angular.module('flowableModeler')  //这里的变量editor.html中左边控制面板右边属性可以用
    .controller('StencilController', ['$rootScope', '$scope', '$http', '$modal', '$timeout', '$window', 'editorManager',
        function ($rootScope, $scope, $http, $modal, $timeout, $window, editorManager) {

            var count = localStorage.getItem('count');
            console.log('localStorage.getItem(count)=' + count)
            var flag = false;
            var vae = true;//标记flag什么时候开始变化
            var vae2 = false //标记点击快捷工具箱的时候count是否发生变化
            var dataArr = [];//存放本流程中的所有表单权限

            let reg = new RegExp("(^|&)" + "token" + "=([^&]*)(&|$)", "i");
            let r = window.location.search.substr(1).match(reg);
            let rett = null;
            if (r != null) {
                rett = unescape(r[2]);
            }
            reg = new RegExp("(^|&)" + "tenant_id" + "=([^&]*)(&|$)", "i");
            r = window.location.search.substr(1).match(reg);
            let retTenantId = null;
            if (r != null) {
                retTenantId = unescape(r[2]);
            }

            //刚渲染完毕进行绑定判断
            var formId;
            listObj = [];
            // jQuery.ajax({
            //     type: 'GET',
            //     url: `/dev-bmp/proc_model/bind_form_model?proc_model_id=${editorManager.getModelId()}&tenantCode=${retTenantId}`,
            //     headers: {
            //         "blade-auth": rett,
            //         Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0"
            //     },
            //     success: function (result) {
            //         console.log("dsad" + result)
            //         if (result.code == 500 || result.code == 400) { //没有绑定表单
            //             jQuery('#myModal').modal('show');
            //             jQuery.ajax({
            //                 type: 'GET',
            //                 url: `/dev-bmp/proc_model/unbind_form_model?tenant_id=${retTenantId}`, //获取没有绑定表单的列表
            //                 headers: {
            //                     "blade-auth": rett,
            //                     Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0"
            //                 },
            //                 success: function (ret) {
            //
            //                     $scope.formObj = ret.obj;
            //                 },
            //                 error: function (err) {
            //                     console.log(err)
            //                 }
            //             })
            //         } else { //绑定了表单
            //             jQuery.ajax({
            //                 type: 'GET',
            //                 url: `/dev-bmp/proc_model/bind_form_model?proc_model_id=${editorManager.getModelId()}`,
            //                 headers: {
            //                     "blade-auth": rett,
            //                     Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0"
            //                 },
            //                 success: function (rets) {
            //                     var ret = JSON.parse(rets.obj)
            //
            //                     for (var i = 0; i < ret.list.length; i++) {
            //                         var listItem = {
            //                             name: ret.list[i].name,
            //                             key: ret.list[i].key,
            //                             model: ret.list[i].model,
            //                             type1: ret.list[i].type,
            //                             rulesType: ret.list[i].rules[0]
            //                         }
            //
            //                         listObj.push(listItem);
            //                     }
            //
            //                 },
            //                 error: function (ret) {
            //                     console.log(ret)
            //                 }
            //             })
            //         }
            //     },
            //     error: function (err) {
            //         console.log(err)
            //     }
            // });



            reg = new RegExp("(^|&)" + "formId" + "=([^&]*)(&|$)", "i");
            r = window.location.search.substr(1).match(reg);
            let retFormIdId = null;
            if (r != null) {
                retFormIdId = unescape(r[2]);
            }
            formId = retFormIdId;

            console.log("dasdasfas:"+retFormIdId);

            if (formId) {
                jQuery.ajax({
                    type: 'PATCH',
                    url: `/dev-api/asset-form/form_model/bind?proc_model_id=${editorManager.getModelId()}&form_model_id=${formId}`,
                    headers: {
                        "blade-auth": rett,
                        Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0"
                    },
                    success: function (result) {
                        jQuery.ajax({
                            type: 'GET',
                            url: `/dev-bmp/proc_model/bind_form_model?proc_model_id=${editorManager.getModelId()}`,
                            headers: {
                                "blade-auth": rett,
                                Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0"
                            },
                            success: function (rets) {

                                var ret = JSON.parse(rets.obj)

                                for (var i = 0; i < ret.list.length; i++) {
                                    var listItem = {
                                        name: ret.list[i].name,
                                        key: ret.list[i].key,
                                        model: ret.list[i].model,
                                        type1: ret.list[i].type,
                                        rulesType: ret.list[i].rules[0]
                                    }

                                    listObj.push(listItem);

                                }

                            },
                            error: function (ret) {
                                console.log(ret)
                            }
                        })
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
                jQuery('#myModal').modal('hide');
            }


            $scope.listChoose = function (id) {
                formId = id;
            }

            $scope.submitList = function () { //用户选择了一个表单之后
                if (formId) {
                    jQuery.ajax({
                        type: 'PATCH',
                        url: `/dev-api/asset-form/form_model/bind?proc_model_id=${editorManager.getModelId()}&form_model_id=${formId}`,
                        headers: {
                            "blade-auth": rett,
                            Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0"
                        },
                        success: function (result) {
                            jQuery.ajax({
                                type: 'GET',
                                url: `/dev-bmp/proc_model/bind_form_model?proc_model_id=${editorManager.getModelId()}`,
                                headers: {
                                    "blade-auth": rett,
                                    Authorization: "Basic c3dvcmQ6c3dvcmRfc2VjcmV0"
                                },
                                success: function (rets) {

                                    var ret = JSON.parse(rets.obj)

                                    for (var i = 0; i < ret.list.length; i++) {
                                        var listItem = {
                                            name: ret.list[i].name,
                                            key: ret.list[i].key,
                                            model: ret.list[i].model,
                                            type1: ret.list[i].type,
                                            rulesType: ret.list[i].rules[0]
                                        }

                                        listObj.push(listItem);

                                    }

                                },
                                error: function (ret) {
                                    console.log(ret)
                                }
                            })
                        },
                        error: function (err) {
                            console.log(err)
                        }
                    })
                    jQuery('#myModal').modal('hide');
                }
            }
            $scope.visibleChange = function (flag) {
                if ($scope.write && !flag) {
                    flag = true;
                }
            }


            $scope.propertyWindowState = {'collapsed': false};
            // Add reference to global header-config
            $scope.headerConfig = FLOWABLE.HEADER_CONFIG;

            $scope.propertyWindowState.toggle = function () { //属性框的折叠动画
                $scope.propertyWindowState.collapsed = !$scope.propertyWindowState.collapsed;
                $timeout(function () {
                    $window.dispatchEvent(new Event("resize"));
                }, 100);
            };

            // Code that is dependent on an initialised Editor is wrapped in a promise for the editor
            $scope.editorFactory.promise.then(function () {
                var stencilItemGroups = [];
                var findGroup = function (name, groupArray) {
                    for (var index = 0; index < groupArray.length; index++) {
                        if (groupArray[index].name === name) {
                            return groupArray[index];//左边分组
                        }
                    }
                    return null;
                };

                // Helper method: add a new group to an array of groups
                var addGroup = function (groupName, groupArray) {
                    var group = {name: groupName, items: [], paletteItems: [], groups: [], visible: true};
                    groupArray.push(group);
                    return group;
                };

                /*
                 StencilSet items
                 */
                var data = editorManager.getStencilData();  //引用editorManger.js中的属性方法

                var quickMenuDefinition = undefined;
                var ignoreForPaletteDefinition = undefined;

                if (data.namespace == 'http://b3mn.org/stencilset/cmmn1.1#') {
                    quickMenuDefinition = ['HumanTask', 'Association'];
                    ignoreForPaletteDefinition = ['CasePlanModel'];
                } else {
                    quickMenuDefinition = ['UserTask', 'EndNoneEvent', 'ExclusiveGateway',
                        'CatchTimerEvent', 'ThrowNoneEvent', 'TextAnnotation',//工具箱里面包含的控件
                        'SequenceFlow', 'Association'];
                    ignoreForPaletteDefinition = ['SequenceFlow', 'MessageFlow', 'Association', 'DataAssociation', 'DataStore', 'SendTask'];
                }

                var quickMenuItems = []; //工具箱里面的快捷键

                var morphRoles = [];
                for (var i = 0; i < data.rules.morphingRules.length; i++) {
                    var role = data.rules.morphingRules[i].role;
                    var roleItem = {'role': role, 'morphOptions': []};
                    morphRoles.push(roleItem)
                }

                // 初始化属性分组maps方便属性和分组对应和查找
                // "PROPERTY.GROUP.BASIC": "基本属性",
                // "PROPERTY.GROUP.FORM": "表单",
                // "PROPERTY.GROUP.ADVANCED": "高级",
                // "PROPERTY.GROUP.SIGNED": "会签",
                // "PROPERTY.GROUP.PARTICIPANT": "参与人",
                // "PROPERTY.GROUP.OTHERS": "其它",
                var groupMaps = {};
                jQuery.each(FLOWABLE.PROPERTY_GROUP_CONFIG, function (i, group) {
                    jQuery.each(group.items, function (j, item) {
                        groupMaps[item] = {id: group.id, name: group.name, order: group.order};
                        //id: "basic",name: "PROPERTY.GROUP.BASIC",order: 1
                    })
                })//属性分组id、名称、次序

                // console.log('view='+data.stencils[8].view) //#d1b575

                // data.stencils.length总的控件个数
                for (var stencilIndex = 0; stencilIndex < data.stencils.length; stencilIndex++) {
                    var currentGroupName = data.stencils[stencilIndex].groups[0]; //数组，各个分组名称以及控件个数

                    // data.stencils[stencilIndex].id=stencilIndex;//改变id值为数字
                    //每个控件的信息，以及所属的组
                    if (currentGroupName === 'Diagram' || currentGroupName === 'Form') {
                        continue;
                    }

                    var removed = false;
                    if (data.stencils[stencilIndex].removed) {
                        removed = true;
                    }

                    var currentGroup = undefined;
                    if (!removed) {
                        // Check if this group already exists. If not, we create a new one

                        if (currentGroupName !== null && currentGroupName !== undefined && currentGroupName.length > 0) {

                            currentGroup = findGroup(currentGroupName, stencilItemGroups); // Find group in root groups array
                            // console.log('currentGroup='+JSON.stringify(currentGroup))打印每一个group
                            if (currentGroup === null) {
                                currentGroup = addGroup(currentGroupName, stencilItemGroups);
                            }

                            // Add all child groups (if any)
                            for (var groupIndex = 1; groupIndex < data.stencils[stencilIndex].groups.length; groupIndex++) {
                                var childGroupName = data.stencils[stencilIndex].groups[groupIndex];
                                var childGroup = findGroup(childGroupName, currentGroup.groups);
                                if (childGroup === null) {
                                    childGroup = addGroup(childGroupName, currentGroup.groups);
                                }

                                // The current group variable holds the parent of the next group (if any),
                                // and is basically the last element in the array of groups defined in the stencil item
                                currentGroup = childGroup;

                            }

                        }
                    }


                    // Construct the stencil item
                    var stencilItem = {
                        'id': data.stencils[stencilIndex].id,
                        'name': data.stencils[stencilIndex].title,
                        'description': data.stencils[stencilIndex].description,
                        'icon': data.stencils[stencilIndex].icon,
                        'type': data.stencils[stencilIndex].type,
                        'roles': data.stencils[stencilIndex].roles,
                        'removed': removed,
                        'customIcon': false,
                        'canConnect': false,
                        'canConnectTo': false,
                        'canConnectAssociation': false,
                        'index': stencilIndex,
                        'visible': false,
                    };

                    if (data.stencils[stencilIndex].customIconId && data.stencils[stencilIndex].customIconId > 0) {
                        stencilItem.customIcon = true;
                        stencilItem.icon = data.stencils[stencilIndex].customIconId;
                    }

                    if (!removed) {
                        if (quickMenuDefinition.indexOf(stencilItem.id) >= 0) {
                            quickMenuItems[quickMenuDefinition.indexOf(stencilItem.id)] = stencilItem;
                        }
                    }

                    if (stencilItem.id === 'TextAnnotation' || stencilItem.id === 'BoundaryCompensationEvent') {
                        stencilItem.canConnectAssociation = true;
                    }
                    if (!data.stencils[stencilIndex].index) {  //为data.stencils[stencilIndex]加一个index值
                        data.stencils[stencilIndex].index = stencilItem.index
                    }
                    if (!data.stencils[stencilIndex].visible) {  //为data.stencils[stencilIndex]每个控件加一个visible值
                        data.stencils[stencilIndex].visible = stencilItem.visible
                    }
                    for (var i = 0; i < data.stencils[stencilIndex].roles.length; i++) {
                        var stencilRole = data.stencils[stencilIndex].roles[i];
                        if (data.namespace == 'http://b3mn.org/stencilset/cmmn1.1#') {
                            if (stencilRole === 'association_start') {
                                stencilItem.canConnect = true;
                            } else if (stencilRole === 'association_end') {
                                stencilItem.canConnectTo = true;
                            }

                        } else {
                            if (stencilRole === 'sequence_start') {
                                stencilItem.canConnect = true;
                            } else if (stencilRole === 'sequence_end') {
                                stencilItem.canConnectTo = true;
                            }
                        }

                        for (var j = 0; j < morphRoles.length; j++) {
                            if (stencilRole === morphRoles[j].role) {
                                if (!removed) {
                                    morphRoles[j].morphOptions.push(stencilItem);
                                }
                                stencilItem.morphRole = morphRoles[j].role;
                                break;
                            }
                        }
                    }

                    //if(stencilItem.index==1){
                    // stencilItem.removed=true;
                    //}

                    if (currentGroup) {
                        // Add the stencil item to the correct group
                        currentGroup.items.push(stencilItem);
                        if (ignoreForPaletteDefinition.indexOf(stencilItem.id) < 0) {
                            currentGroup.paletteItems.push(stencilItem);
                        }

                    } else {
                        // It's a root stencil element
                        if (!removed) {
                            stencilItemGroups.push(stencilItem);
                        }
                    }
                }//左边控制面板的分组
                //stencilItemGroups是所有的面板分组
                for (var i = 0; i < stencilItemGroups.length; i++) {
                    if (stencilItemGroups[i].paletteItems && stencilItemGroups[i].paletteItems.length == 0) {
                        stencilItemGroups[i].visible = false;
                    }
                }
                stencilItemGroups[2].visible = false;
                stencilItemGroups[4].visible = false;
                stencilItemGroups[7].visible = false;
                for (let it of stencilItemGroups[0].items) { //启动
                    if (it.index == 2 || it.index == 1) {
                        it.visible = true;
                    }
                }
                for (let it of stencilItemGroups[1].items) { //活动
                    if (it.index == 6 || it.index == 7 || it.index == 8) {
                        console.log(stencilItemGroups[1].items)
                        it.visible = true;
                    }
                }
                for (let it of stencilItemGroups[3].items) { //网关
                    if (it.index == 23 || it.index == 24) {
                        it.visible = true;
                    }
                }
                for (let it of stencilItemGroups[5].items) { //结束
                    if (it.index == 38 || it.index == 39) {
                        it.visible = true;
                    }
                }
                $scope.stencilItemGroups = stencilItemGroups;

                var containmentRules = [];
                for (var i = 0; i < data.rules.containmentRules.length; i++) {
                    var rule = data.rules.containmentRules[i];
                    containmentRules.push(rule);
                }
                $scope.containmentRules = containmentRules;

                // 删除由于自定义面板而不再可用的快速菜单项
                var availableQuickMenuItems = [];
                for (var i = 0; i < quickMenuItems.length; i++) {
                    if (quickMenuItems[i]) {
                        availableQuickMenuItems[availableQuickMenuItems.length] = quickMenuItems[i];
                    }
                }

                $scope.quickMenuItems = availableQuickMenuItems;
                $scope.morphRoles = morphRoles;


                $scope.overCallback = function (e, ui) {   //每拖出来一次执行的函数
                    if (vae) {
                        if (!flag) {
                            flag = true
                        } else {
                            flag = false
                        }
                    }
                    $scope.dragModeOver = true;
                    return flag;

                }


                /*
                 * 监听选择控件事件，更改属性
                 */

                editorManager.registerOnEvent(ORYX.CONFIG.EVENT_SELECTION_CHANGED, function (event) {
                    //点击控件时候发生的变化
                    var shapes = event.elements;
                    var canvasSelected = false;

                    if (shapes && shapes.length == 0) {  //当没有选择任何控件时候选择画布
                        shapes = [editorManager.getCanvas()];
                        canvasSelected = true;
                    }
                    if (shapes && shapes.length > 0) {
                        var selectedShape = shapes.first();
                        var stencil = selectedShape.getStencil();


                        if (shapes[0] && stencil.title() == '连线') {
                            //选择了连线控件，resourceId是线的id值
                        }

                        if ($rootScope.selectedElementBeforeScrolling && stencil.id().indexOf('BPMNDiagram') !== -1 && stencil.id().indexOf('CMMNDiagram') !== -1) {
                            // ignore canvas event because of empty selection when scrolling stops
                            return;
                        }

                        // Store previous selection
                        $scope.previousSelectedShape = $scope.selectedShape;


                        var selectedItem = {'title': stencil.title(), 'properties': [], 'type': ''};
                        if (stencil._jsonStencil.index - 5 == 1 || stencil._jsonStencil.index - 5 == 2 || stencil._jsonStencil.index - 5 == 3)
                            selectedItem.type = stencil._jsonStencil.index - 5;
                        if (canvasSelected) { //{title: "", properties: Array(0), auditData: {…}, propGroups: Array(3)}

                            selectedItem.auditData = {//如果选择了画布则为画布加上作者和时间
                                'author': $scope.modelData.createdByUser,
                                'createDate': $scope.modelData.createDate
                            };
                        }

                        //console.log(selectedItem) //还没为画布加上名字
                        var propGroups = {
                            others: {
                                name: 'PROPERTY.GROUP.OTHERS',
                                order: 99,
                                expanded: false,
                                properties: []
                            }
                        };

                        // Gather properties of selected item
                        var properties = stencil.properties();//右边属性值
                        //  if(flag){ //只有flag为true时候才进行标记的变化
                        //        count++;
                        //        selectedShape.properties._object['oryx-overrideid']=editorManager.getModel().childShapes[editorManager.getModel().childShapes.length-1].resourceId;
                        //        flag=false;
                        //        // vae2=false
                        // }
                        console.log(selectedShape)

                        if (!selectedShape.properties._object['oryx-overrideid']) {
                            selectedShape.properties._object['oryx-overrideid'] = selectedShape.resourceId
                        }
                        for (var i = 0; i < properties.length; i++) {
                            var property = properties[i];


                            if (property.popular() == false) continue;
                            var key = property.prefix() + "-" + property.id();


                            if (key === 'oryx-name') {  //oryx-name就是名称
                                // selectedShape.properties.set(key) =selectedShape._stencil._jsonStencil.title
                                // selectedShape.properties._object.name=selectedShape._stencil._jsonStencil.title
                                selectedItem.title = selectedShape.properties.get(key)
                            }
                            // First we check if there is a config for 'key-type' and then for 'type' alone
                            var propertyConfig = FLOWABLE.PROPERTY_CONFIG[key + '-' + property.type()];

                            if (propertyConfig === undefined || propertyConfig === null) {
                                propertyConfig = FLOWABLE.PROPERTY_CONFIG[property.type()];
                            }

                            if (propertyConfig === undefined || propertyConfig === null) {
                                console.log('WARNING: no property configuration defined for ' + key + ' of type ' + property.type());
                            } else {

                                if (selectedShape.properties.get(key) === 'true') {
                                    selectedShape.properties.set(key, true);
                                }

                                if (FLOWABLE.UI_CONFIG.showRemovedProperties == false && property.isHidden()) {
                                    continue;
                                }

                                var k = property._stencil._jsonStencil.index - 5;
                                if (k == 1 || k == 2 || k == 3) {
                                    selectedShape.properties._object['oryx-documentation'] = k;
                                }

                                //selectedShape.properties._object['oryx-authority']=listObj; //从后台获取的值将其赋值给它

                                var currentProperty = {
                                    'key': key,
                                    'title': property.title(),//属性名称
                                    'description': property.description(),
                                    'type': property.type(),
                                    'mode': 'read',
                                    'hidden': property.isHidden(),
                                    'value': selectedShape.properties.get(key),
                                    'name': stencil.title(),
                                    'index': property._stencil._jsonStencil.index,
                                    'type': selectedShape.properties._object['oryx-documentation'],
                                    'id': selectedShape.properties._object['oryx-overrideid'],
                                };

                                if ((currentProperty.type === 'complex' || currentProperty.type === 'multiplecomplex') && currentProperty.value && currentProperty.value.length > 0) {
                                    try {
                                        currentProperty.value = JSON.parse(currentProperty.value);
                                    } catch (err) {
                                        // ignore
                                    }
                                }

                                if (propertyConfig.readModeTemplateUrl !== undefined && propertyConfig.readModeTemplateUrl !== null) {
                                    currentProperty.readModeTemplateUrl = propertyConfig.readModeTemplateUrl + '?version=' + $rootScope.staticIncludeVersion;
                                }
                                if (propertyConfig.writeModeTemplateUrl !== null && propertyConfig.writeModeTemplateUrl !== null) {
                                    currentProperty.writeModeTemplateUrl = propertyConfig.writeModeTemplateUrl + '?version=' + $rootScope.staticIncludeVersion;
                                }

                                if (propertyConfig.templateUrl !== undefined && propertyConfig.templateUrl !== null) {
                                    currentProperty.templateUrl = propertyConfig.templateUrl + '?version=' + $rootScope.staticIncludeVersion;
                                    currentProperty.hasReadWriteMode = false;
                                } else {
                                    currentProperty.hasReadWriteMode = true;
                                }

                                if (currentProperty.value === undefined
                                    || currentProperty.value === null
                                    || currentProperty.value.length == 0) {
                                    currentProperty.noValue = true;
                                }
                                // if(currentProperty.key=='oryx-name'){ //如果选择了画布
                                //      currentProperty.flag=true
                                // }

                                var propGroup = groupMaps[property.id()];


                                if (propGroup) {
                                    if (!propGroups[propGroup.id]) { //0: {name: "PROPERTY.GROUP.OTHERS", order: 99, expanded: false, properties: Array(1), $$hashKey: "object:2279"}
                                        propGroups[propGroup.id] = {
                                            name: propGroup.name,
                                            order: propGroup.order,
                                            expanded: propGroup.id == 'basic',//只有基础属性一栏会打开
                                            properties: []
                                        };
                                    }
                                    propGroups[propGroup.id].properties.push(currentProperty);
                                } else {
                                    propGroups.others.properties.push(currentProperty);
                                }
                                // selectedItem.properties.push(currentProperty);
                            }
                        }

                        //创建属性分组
                        selectedItem.propGroups = [];
                        for (var groupIndex in propGroups) { //这个时候就将对应的属性分组好了
                            selectedItem.propGroups.push(propGroups[groupIndex]);
                        }


                        // Need to wrap this in an $apply block, see http://jimhoskins.com/2012/12/17/angularjs-and-apply.html
                        $scope.safeApply(function () {
                            $scope.selectedItem = selectedItem;
                            $scope.selectedShape = selectedShape;
                        });

                    } else {
                        $scope.safeApply(function () {
                            $scope.selectedItem = {};
                            $scope.selectedShape = null;
                        });
                    }
                });
                // var obj;
                editorManager.registerOnEvent(ORYX.CONFIG.EVENT_SELECTION_CHANGED, function (event) {

                    FLOWABLE.eventBus.dispatch(FLOWABLE.eventBus.EVENT_TYPE_HIDE_SHAPE_BUTTONS);


                    var shapes = event.elements;


                    if (shapes && shapes.length == 1) {

                        var selectedShape = shapes.first();


                        var a = editorManager.getCanvas().node.getScreenCTM();//获得矩阵变形后的坐标
                        var absoluteXY = selectedShape.absoluteXY();

                        absoluteXY.x *= a.a;
                        absoluteXY.y *= a.d;

                        var additionalIEZoom = 1;
                        if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
                            var ua = navigator.userAgent;
                            if (ua.indexOf('MSIE') >= 0) {
                                //IE 10 and below
                                var zoom = Math.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
                                if (zoom !== 100) {
                                    additionalIEZoom = zoom / 100
                                }
                            }
                        }

                        if (additionalIEZoom === 1) {
                            absoluteXY.y = absoluteXY.y - jQuery("#canvasSection").offset().top + 5;
                            absoluteXY.x = absoluteXY.x - jQuery("#canvasSection").offset().left;

                        } else {
                            var canvasOffsetLeft = jQuery("#canvasSection").offset().left;
                            var canvasScrollLeft = jQuery("#canvasSection").scrollLeft();
                            var canvasScrollTop = jQuery("#canvasSection").scrollTop();

                            var offset = a.e - (canvasOffsetLeft * additionalIEZoom);
                            var additionaloffset = 0;
                            if (offset > 10) {
                                additionaloffset = (offset / additionalIEZoom) - offset;
                            }
                            absoluteXY.y = absoluteXY.y - (jQuery("#canvasSection").offset().top * additionalIEZoom) + 5 + ((canvasScrollTop * additionalIEZoom) - canvasScrollTop);
                            absoluteXY.x = absoluteXY.x - (canvasOffsetLeft * additionalIEZoom) + additionaloffset + ((canvasScrollLeft * additionalIEZoom) - canvasScrollLeft);
                        }

                        var bounds = new ORYX.Core.Bounds(a.e + absoluteXY.x, a.f + absoluteXY.y, a.e + absoluteXY.x + a.a * selectedShape.bounds.width(), a.f + absoluteXY.y + a.d * selectedShape.bounds.height());
                        var shapeXY = bounds.upperLeft();

                        var stencilItem = $scope.getStencilItemById(selectedShape.getStencil().idWithoutNs());
                        var morphShapes = [];
                        if (stencilItem && stencilItem.morphRole) {
                            for (var i = 0; i < $scope.morphRoles.length; i++) {
                                if ($scope.morphRoles[i].role === stencilItem.morphRole) {
                                    morphShapes = $scope.morphRoles[i].morphOptions;
                                }
                            }
                        }

                        var x = shapeXY.x;
                        if (bounds.width() < 48) {
                            x -= 24;
                        }

                        if (morphShapes && morphShapes.length > 0) {
                            // In case the element is not wide enough, start the 2 bottom-buttons more to the left
                            // to prevent overflow in the right-menu

                            var morphButton = document.getElementById('morph-button');
                            morphButton.style.display = "block";
                            morphButton.style.left = x + 24 + 'px';
                            morphButton.style.top = (shapeXY.y + bounds.height() + 2) + 'px';
                        }

                        var deleteButton = document.getElementById('delete-button');
                        deleteButton.style.display = "block";
                        deleteButton.style.left = x + 'px';
                        deleteButton.style.top = (shapeXY.y + bounds.height() + 2) + 'px';
                        var editable = selectedShape._stencil._jsonStencil.id.endsWith('CollapsedSubProcess');
                        var editButton = document.getElementById('edit-button');
                        if (editable) {
                            editButton.style.display = "block";
                            if (morphShapes && morphShapes.length > 0) {
                                editButton.style.left = x + 24 + 24 + 'px';
                            } else {
                                editButton.style.left = x + 24 + 'px';
                            }
                            editButton.style.top = (shapeXY.y + bounds.height() + 2) + 'px';

                        } else {
                            editButton.style.display = "none";
                        }

                        if (stencilItem && (stencilItem.canConnect || stencilItem.canConnectAssociation)) {
                            var quickButtonCounter = 0;
                            var quickButtonX = shapeXY.x + bounds.width() + 5;
                            var quickButtonY = shapeXY.y - 5;
                            var buttonHeight = 23;
                            jQuery('.Oryx_button').each(function (i, obj) {
                                if (obj.id !== 'morph-button' && obj.id != 'delete-button' && obj.id !== 'edit-button') {
                                    quickButtonCounter++;
                                    if (quickButtonCounter > 3) {
                                        quickButtonX = shapeXY.x + bounds.width() + 5;
                                        quickButtonY += buttonHeight;
                                        quickButtonCounter = 1;

                                    } else if (quickButtonCounter > 1) {
                                        quickButtonX += buttonHeight;
                                    }

                                    obj.style.display = "block";
                                    obj.style.left = quickButtonX + 'px';
                                    obj.style.top = quickButtonY + 'px';
                                }
                            });
                        }
                    }
                });

                if (!$rootScope.stencilInitialized) {
                    FLOWABLE.eventBus.addListener(FLOWABLE.eventBus.EVENT_TYPE_HIDE_SHAPE_BUTTONS, function (event) {
                        jQuery('.Oryx_button').each(function (i, obj) {
                            obj.style.display = "none";
                        });
                    });

                    /*
                     * Listen to property updates and act upon them
                     */
                    FLOWABLE.eventBus.addListener(FLOWABLE.eventBus.EVENT_TYPE_PROPERTY_VALUE_CHANGED, function (event) {
                        if (event.property && event.property.key) {
                            // If the name property is been updated, we also need to change the title of the currently selected item
                            if (event.property.key === 'oryx-name' && $scope.selectedItem !== undefined && $scope.selectedItem !== null) {
                                $scope.selectedItem.title = event.newValue;
                            }

                            // Update "no value" flag
                            event.property.noValue = (event.property.value === undefined
                                || event.property.value === null
                                || event.property.value.length == 0);
                        }
                    });

                    FLOWABLE.eventBus.addListener(FLOWABLE.eventBus.EVENT_TYPE_SHOW_VALIDATION_POPUP, function (event) {
                        // Method to open validation dialog
                        var showValidationDialog = function () {
                            $rootScope.currentValidationId = event.validationId;
                            $rootScope.isOnProcessLevel = event.onProcessLevel;

                            _internalCreateModal({template: 'editor-app/popups/validation-errors.html?version=' + Date.now()}, $modal, $rootScope);
                        };

                        showValidationDialog();
                    });

                    FLOWABLE.eventBus.addListener(FLOWABLE.eventBus.EVENT_TYPE_NAVIGATE_TO_PROCESS, function (event) {
                        var modelMetaData = editorManager.getBaseModelData();

                        $rootScope.editorHistory.push({
                            id: modelMetaData.modelId,
                            name: modelMetaData.name,
                            type: 'bpmnmodel'
                        });

                        $window.location.href = "../editor/#/editor/" + event.processId;
                    });

                    $rootScope.stencilInitialized = true;
                }

                $scope.morphShape = function () { //新建一个用户控件
                    $scope.safeApply(function () {

                        var shapes = editorManager.getSelection(); //引用别的文件中的属性方法

                        if (shapes && shapes.length == 1) {
                            $rootScope.currentSelectedShape = shapes.first();
                            var stencilItem = $scope.getStencilItemById($rootScope.currentSelectedShape.getStencil().idWithoutNs());
                            var morphShapes = [];
                            for (var i = 0; i < $scope.morphRoles.length; i++) {
                                if ($scope.morphRoles[i].role === stencilItem.morphRole) {
                                    morphShapes = $scope.morphRoles[i].morphOptions.slice();
                                }
                            }

                            // Method to open shape select dialog (used later on)
                            var showSelectShapeDialog = function () {
                                $rootScope.morphShapes = morphShapes;
                                _internalCreateModal({
                                    backdrop: false,
                                    keyboard: true,
                                    template: 'editor-app/popups/select-shape.html?version=' + Date.now()
                                }, $modal, $rootScope);
                            };

                            showSelectShapeDialog();
                        }
                    });
                };

                $scope.deleteShape = function () { //点击工具箱里面的删除按钮时候发生的变化
                    FLOWABLE.TOOLBAR.ACTIONS.deleteItem({'$scope': $scope, 'editorManager': editorManager});
                };

                $scope.quickAddItem = function (newItemId) { //点击工具箱控件时候发生的变化
                    flag = true;
                    $scope.safeApply(function () {

                        // if(newItemId=='SequenceFlow'||newItemId=='Association'||newItemId=='TextAnnotation'){
                        //   vae2=false
                        // }else{
                        //   vae2=true;
                        // }

                        var shapes = editorManager.getSelection();
                        if (shapes && shapes.length == 1) {
                            $rootScope.currentSelectedShape = shapes.first();

                            var containedStencil = undefined;
                            var stencilSets = editorManager.getStencilSets().values();
                            for (var i = 0; i < stencilSets.length; i++) {
                                var stencilSet = stencilSets[i];
                                var nodes = stencilSet.nodes();
                                for (var j = 0; j < nodes.length; j++) {
                                    if (nodes[j].idWithoutNs() === newItemId) {
                                        containedStencil = nodes[j];
                                        break;
                                    }
                                }
                            }

                            if (!containedStencil) return;

                            var option = {
                                type: $scope.currentSelectedShape.getStencil().namespace() + newItemId,
                                namespace: $scope.currentSelectedShape.getStencil().namespace()
                            };
                            option['connectedShape'] = $rootScope.currentSelectedShape;
                            option['parent'] = $rootScope.currentSelectedShape.parent;
                            option['containedStencil'] = containedStencil;

                            var args = {sourceShape: $rootScope.currentSelectedShape, targetStencil: containedStencil};
                            var targetStencil = editorManager.getRules().connectMorph(args);

                            // Check if there can be a target shape
                            if (!targetStencil) {
                                return;
                            }

                            option['connectingType'] = targetStencil.id();

                            var command = new FLOWABLE.CreateCommand(option, undefined, undefined, editorManager.getEditor());

                            editorManager.executeCommands([command]);
                        }
                    });
                };

                $scope.editShape = function () { //编辑这个控件的外形

                    editorManager.edit($scope.selectedShape.resourceId);
                }

            }); // end of $scope.editorFactory.promise block

            /* Click handler for clicking a property */
            $scope.propertyClicked = function (prop) { //属性展开可编辑

                if (!prop.hidden) {
                    prop.mode = "write";
                }
            };

            /* Helper method to retrieve the template url for a property */
            $scope.getPropertyTemplateUrl = function (prop) { //函数名称是控制器

                return prop.templateUrl;
            };//获得普通属性
            $scope.getPropertyReadModeTemplateUrl = function (prop) {

                //获得可读属性
                return prop.readModeTemplateUrl;
            };
            $scope.getPropertyWriteModeTemplateUrl = function (prop) {
                //打印出要请求的html页面 editor-app/configuration/properties/string-property-write-mode-template.html?version=1564108721074
                return prop.writeModeTemplateUrl;
            };

            function dubRemove(arr) { //数组去重
                let res = [];
                let repeat = [];
                for (let i = 0; i < arr.length; i++) {
                    let formItemKey = arr[i].act_id + arr[i].form_item_key;
                    if (!repeat[formItemKey]) {
                        res.push(arr[i]);
                        repeat[formItemKey] = 1
                    } else {
                        for (let k = 0; k < i; k++) {
                            if ((arr[k].act_id + arr[k].form_item_key) == formItemKey) {
                                res.splice(arr[k], 1);//删除数组中某一项
                            }
                        }
                        res.push(arr[i]);
                        repeat[formItemKey] = 1
                    }
                }
                return res;
            }


            /* Method available to all sub controllers (for property controllers) to update the internal Oryx model */
            $scope.updatePropertyInModel = function (property, shapeId) {
                var shape = $scope.selectedShape;
                // Some updates may happen when selected shape is already changed, so when an additional
                // shapeId is supplied, we need to make sure the correct shape is updated (current or previous)
                if (shapeId) {

                    if (shape.id != shapeId && $scope.previousSelectedShape && $scope.previousSelectedShape.id == shapeId) {
                        shape = $scope.previousSelectedShape;
                    } else {
                        shape = null;
                    }
                }

                if (!shape) {
                    return;
                }

                var key = property.key;
                var newValue = property.value;
                var oldValue = shape.properties.get(key);

                if (newValue != oldValue) {
                    var commandClass = ORYX.Core.Command.extend({
                        construct: function () {
                            this.key = key;
                            this.oldValue = oldValue;
                            this.newValue = newValue;
                            this.shape = shape;
                            this.facade = editorManager.getEditor();
                        },
                        execute: function () {
                            this.shape.setProperty(this.key, this.newValue);
                            this.facade.getCanvas().update();
                            this.facade.updateSelection();
                        },
                        rollback: function () {
                            this.shape.setProperty(this.key, this.oldValue);
                            this.facade.getCanvas().update();
                            this.facade.updateSelection();
                        }
                    });
                    // Instantiate the class
                    var command = new commandClass();

                    // Execute the command
                    editorManager.executeCommands([command]);
                    editorManager.handleEvents({
                        type: ORYX.CONFIG.EVENT_PROPWINDOW_PROP_CHANGED,
                        elements: [shape],
                        key: key
                    });

                    if (key == 'oryx-formproperties') {
                        var formprop = newValue.formProperties


                        var singleItem = {}
                        for (var i = 0; i < formprop.length; i++) {  //保存每个节点的id值
                            var auth = 3
                            console.log(formprop[i])
                            if (formprop[i].writable == 1) {
                                auth = 1;
                            }
                            if (formprop[i].writable == 2) {
                                auth = 2;
                            }
                            if (formprop[i].writable == 3) {
                                auth = 3;
                            }
                            if (formprop[i].writable == 4) {
                                auth = 4;
                            }
                            var singleItem = {
                                'act_id': property.id,
                                "form_item_key": formprop[i].key,
                                "authority": auth
                            }
                            dataArr.push(singleItem)
                        }
                        $scope.dataArr1 = dubRemove(dataArr)
                        console.log(dataArr)
                    }
                    // Switch the property back to read mode, now the update is done
                    property.mode = 'read';

                    // Fire event to all who is interested
                    // Fire event to all who want to know about this
                    var event = {
                        type: FLOWABLE.eventBus.EVENT_TYPE_PROPERTY_VALUE_CHANGED,
                        property: property,
                        oldValue: oldValue,
                        newValue: newValue
                    };
                    FLOWABLE.eventBus.dispatch(event.type, event);
                } else {
                    // Switch the property back to read mode, no update was needed
                    property.mode = 'read';
                }

            };

            /**
             * Helper method that searches a group for an item with the given id.
             * If not found, will return undefined.
             */
            $scope.findStencilItemInGroup = function (stencilItemId, group) {

                var item;

                // Check all items directly in this group
                for (var j = 0; j < group.items.length; j++) {
                    item = group.items[j];
                    if (item.id === stencilItemId) {
                        return item;
                    }
                }

                // Check the child groups
                if (group.groups && group.groups.length > 0) {
                    for (var k = 0; k < group.groups.length; k++) {
                        item = $scope.findStencilItemInGroup(stencilItemId, group.groups[k]);
                        if (item) {
                            return item;
                        }
                    }
                }

                return undefined;
            };

            /**
             * Helper method to find a stencil item.
             */
            $scope.getStencilItemById = function (stencilItemId) {
                for (var i = 0; i < $scope.stencilItemGroups.length; i++) {
                    var element = $scope.stencilItemGroups[i];

                    // Real group
                    if (element.items !== null && element.items !== undefined) {
                        var item = $scope.findStencilItemInGroup(stencilItemId, element);
                        if (item) {
                            return item;
                        }
                    } else { // Root stencil item
                        if (element.id === stencilItemId) {
                            return element;
                        }
                    }
                }
                return undefined;
            };

            /*
             * DRAG AND DROP FUNCTIONALITY
             */

            $scope.dropCallback = function (event, ui) {
                editorManager.handleEvents({
                    type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                    highlightId: "shapeRepo.attached"
                });
                editorManager.handleEvents({
                    type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                    highlightId: "shapeRepo.added"
                });

                editorManager.handleEvents({
                    type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                    highlightId: "shapeMenu"
                });

                FLOWABLE.eventBus.dispatch(FLOWABLE.eventBus.EVENT_TYPE_HIDE_SHAPE_BUTTONS);

                if ($scope.dragCanContain) {

                    var item = $scope.getStencilItemById(ui.draggable[0].id);

                    var pos = {x: event.pageX, y: event.pageY};

                    var additionalIEZoom = 1;
                    if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
                        var ua = navigator.userAgent;
                        if (ua.indexOf('MSIE') >= 0) {
                            //IE 10 and below
                            var zoom = Math.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
                            if (zoom !== 100) {
                                additionalIEZoom = zoom / 100;
                            }
                        }
                    }

                    var screenCTM = editorManager.getCanvas().node.getScreenCTM();

                    // Correcting the UpperLeft-Offset
                    pos.x -= (screenCTM.e / additionalIEZoom);
                    pos.y -= (screenCTM.f / additionalIEZoom);
                    // Correcting the Zoom-Factor
                    pos.x /= screenCTM.a;
                    pos.y /= screenCTM.d;

                    // Correcting the ScrollOffset
                    pos.x -= document.documentElement.scrollLeft;
                    pos.y -= document.documentElement.scrollTop;

                    var parentAbs = $scope.dragCurrentParent.absoluteXY();
                    pos.x -= parentAbs.x;
                    pos.y -= parentAbs.y;

                    var containedStencil = undefined;
                    var stencilSets = editorManager.getStencilSets().values();

                    for (var i = 0; i < stencilSets.length; i++) {
                        var stencilSet = stencilSets[i];

                        var nodes = stencilSet.nodes(); //控制面板上的所有结点


                        for (var j = 0; j < nodes.length; j++) {
                            if (nodes[j].idWithoutNs() === ui.draggable[0].id) {
                                containedStencil = nodes[j];
                                break;
                            }
                        }

                        if (!containedStencil) {
                            var edges = stencilSet.edges();
                            for (var j = 0; j < edges.length; j++) {
                                if (edges[j].idWithoutNs() === ui.draggable[0].id) {
                                    containedStencil = edges[j];
                                    break;
                                }
                            }
                        }
                    }

                    if (!containedStencil) return;

                    if ($scope.quickMenu) {
                        var shapes = editorManager.getSelection();
                        if (shapes && shapes.length == 1) {
                            var currentSelectedShape = shapes.first();

                            var option = {};
                            option.type = currentSelectedShape.getStencil().namespace() + ui.draggable[0].id;
                            option.namespace = currentSelectedShape.getStencil().namespace();
                            option.connectedShape = currentSelectedShape;
                            option.parent = $scope.dragCurrentParent;
                            option.containedStencil = containedStencil;

                            // If the ctrl key is not pressed,
                            // snapp the new shape to the center
                            // if it is near to the center of the other shape
                            if (!event.ctrlKey) {
                                // Get the center of the shape
                                var cShape = currentSelectedShape.bounds.center();
                                // Snapp +-20 Pixel horizontal to the center
                                if (20 > Math.abs(cShape.x - pos.x)) {
                                    pos.x = cShape.x;
                                }
                                // Snapp +-20 Pixel vertical to the center
                                if (20 > Math.abs(cShape.y - pos.y)) {
                                    pos.y = cShape.y;
                                }
                            }

                            option.position = pos;

                            if (containedStencil.idWithoutNs() !== 'SequenceFlow' && containedStencil.idWithoutNs() !== 'Association' &&
                                containedStencil.idWithoutNs() !== 'MessageFlow' && containedStencil.idWithoutNs() !== 'DataAssociation') {

                                var args = {sourceShape: currentSelectedShape, targetStencil: containedStencil};
                                var targetStencil = editorManager.getRules().connectMorph(args);
                                if (!targetStencil) { // Check if there can be a target shape
                                    return;
                                }
                                option.connectingType = targetStencil.id();
                            }

                            var command = new FLOWABLE.CreateCommand(option, $scope.dropTargetElement, pos, editorManager.getEditor());

                            editorManager.executeCommands([command]);
                        }

                    } else {
                        var canAttach = false;
                        if (containedStencil.idWithoutNs() === 'BoundaryErrorEvent' || containedStencil.idWithoutNs() === 'BoundaryTimerEvent' ||
                            containedStencil.idWithoutNs() === 'BoundarySignalEvent' || containedStencil.idWithoutNs() === 'BoundaryMessageEvent' ||
                            containedStencil.idWithoutNs() === 'BoundaryCancelEvent' || containedStencil.idWithoutNs() === 'BoundaryCompensationEvent') {

                            // Modify position, otherwise boundary event will get position related to left corner of the canvas instead of the container
                            pos = editorManager.eventCoordinates(event);
                            canAttach = true;
                        }

                        var option = {};
                        option['type'] = $scope.modelData.model.stencilset.namespace + item.id;
                        option['namespace'] = $scope.modelData.model.stencilset.namespace;
                        option['position'] = pos;
                        option['parent'] = $scope.dragCurrentParent;

                        var commandClass = ORYX.Core.Command.extend({
                            construct: function (option, dockedShape, canAttach, position, facade) {
                                this.option = option;
                                this.docker = null;
                                this.dockedShape = dockedShape;
                                this.dockedShapeParent = dockedShape.parent || facade.getCanvas();
                                this.position = position;
                                this.facade = facade;
                                this.selection = this.facade.getSelection();
                                this.shape = null;
                                this.parent = null;
                                this.canAttach = canAttach;
                            },
                            execute: function () {
                                if (!this.shape) {
                                    this.shape = this.facade.createShape(option);
                                    this.parent = this.shape.parent;
                                } else if (this.parent) {
                                    this.parent.add(this.shape);
                                }

                                if (this.canAttach && this.shape.dockers && this.shape.dockers.length) {
                                    this.docker = this.shape.dockers[0];

                                    this.dockedShapeParent.add(this.docker.parent);

                                    // Set the Docker to the new Shape
                                    this.docker.setDockedShape(undefined);
                                    this.docker.bounds.centerMoveTo(this.position);
                                    if (this.dockedShape !== this.facade.getCanvas()) {
                                        this.docker.setDockedShape(this.dockedShape);
                                    }
                                    this.facade.setSelection([this.docker.parent]);
                                }

                                this.facade.getCanvas().update();
                                this.facade.updateSelection();

                            },
                            rollback: function () {
                                if (this.shape) {
                                    this.facade.setSelection(this.selection.without(this.shape));
                                    this.facade.deleteShape(this.shape);
                                }
                                if (this.canAttach && this.docker) {
                                    this.docker.setDockedShape(undefined);
                                }
                                this.facade.getCanvas().update();
                                this.facade.updateSelection();

                            }
                        });

                        // Update canvas
                        var command = new commandClass(option, $scope.dragCurrentParent, canAttach, pos, editorManager.getEditor());
                        editorManager.executeCommands([command]);

                        // Fire event to all who want to know about this
                        var dropEvent = {
                            type: FLOWABLE.eventBus.EVENT_TYPE_ITEM_DROPPED,
                            droppedItem: item,
                            position: pos
                        };
                        FLOWABLE.eventBus.dispatch(dropEvent.type, dropEvent);
                    }
                }
                $scope.dragCurrentParent = undefined;
                $scope.dragCurrentParentId = undefined;
                $scope.dragCurrentParentStencil = undefined;
                $scope.dragCanContain = undefined;
                $scope.quickMenu = undefined;
                $scope.dropTargetElement = undefined;
            };


            $scope.outCallback = function (event, ui) {
                $scope.dragModeOver = false;
            };

            $scope.startDragCallback = function (event, ui) {
                console.log(6666)
                $scope.dragModeOver = false;
                $scope.quickMenu = false;
                if (!ui.helper.hasClass('stencil-item-dragged')) {
                    ui.helper.addClass('stencil-item-dragged');
                }
            };

            $scope.startDragCallbackQuickMenu = function (event, ui) {
                console.log(event)
                // if(event.currentTarget.id=='SequenceFlow'||event.currentTarget.id=='Association'||event.currentTarget.id=='TextAnnotation'){
                //   vae=false
                // }
                $scope.dragModeOver = false;
                $scope.quickMenu = true;
            };

            $scope.dragCallback = function (event, ui) {

                if (event.currentTarget.id != 'SequenceFlow' && event.currentTarget.id != 'Association' && event.currentTarget.id != 'TextAnnotation') {
                    vae = true
                }
                if ($scope.dragModeOver != false) {

                    var coord = editorManager.eventCoordinatesXY(event.pageX, event.pageY);

                    var additionalIEZoom = 1;
                    if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
                        var ua = navigator.userAgent;
                        if (ua.indexOf('MSIE') >= 0) {
                            //IE 10 and below
                            var zoom = Math.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
                            if (zoom !== 100) {
                                additionalIEZoom = zoom / 100
                            }
                        }
                    }

                    if (additionalIEZoom !== 1) {
                        coord.x = coord.x / additionalIEZoom;
                        coord.y = coord.y / additionalIEZoom;
                    }

                    var aShapes = editorManager.getCanvas().getAbstractShapesAtPosition(coord);

                    if (aShapes.length <= 0) {
                        if (event.helper) {
                            $scope.dragCanContain = false;
                            return false;
                        }
                    }

                    if (aShapes[0] instanceof ORYX.Core.Canvas) {
                        editorManager.getCanvas().setHightlightStateBasedOnX(coord.x);
                    }

                    if (aShapes.length == 1 && aShapes[0] instanceof ORYX.Core.Canvas) {
                        var item = $scope.getStencilItemById(event.target.id);//获取拖拽出来的名字

                        var parentCandidate = aShapes[0];

                        if (item.id === 'Lane' || item.id === 'BoundaryErrorEvent' || item.id === 'BoundaryMessageEvent' ||
                            item.id === 'BoundarySignalEvent' || item.id === 'BoundaryTimerEvent' ||
                            item.id === 'BoundaryCancelEvent' || item.id === 'BoundaryCompensationEvent' ||
                            item.id === 'EntryCriterion') {

                            $scope.dragCanContain = false;

                            // Show Highlight
                            editorManager.handleEvents({
                                type: ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
                                highlightId: 'shapeRepo.added',
                                elements: [parentCandidate],
                                style: ORYX.CONFIG.SELECTION_HIGHLIGHT_STYLE_RECTANGLE,
                                color: ORYX.CONFIG.SELECTION_INVALID_COLOR
                            });

                        } else {
                            $scope.dragCanContain = true;
                            $scope.dragCurrentParent = parentCandidate;
                            $scope.dragCurrentParentId = parentCandidate.id;

                            editorManager.handleEvents({
                                type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                                highlightId: "shapeRepo.added"
                            });
                        }

                        editorManager.handleEvents({
                            type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                            highlightId: "shapeRepo.attached"
                        });

                        return false;

                    } else {
                        var item = $scope.getStencilItemById(event.target.id);

                        var parentCandidate = aShapes.reverse().find(function (candidate) {
                            return (candidate instanceof ORYX.Core.Canvas
                                || candidate instanceof ORYX.Core.Node
                                || candidate instanceof ORYX.Core.Edge);
                        });

                        if (!parentCandidate) {
                            $scope.dragCanContain = false;
                            return false;
                        }

                        if (item.type === "node") {

                            // check if the draggable is a boundary event and the parent an Activity
                            var _canContain = false;
                            var parentStencilId = parentCandidate.getStencil().id();

                            if ($scope.dragCurrentParentId && $scope.dragCurrentParentId === parentCandidate.id) {
                                return false;
                            }

                            var parentItem = $scope.getStencilItemById(parentCandidate.getStencil().idWithoutNs());
                            if (parentItem.roles.indexOf('Activity') > -1) {
                                if (item.roles.indexOf('IntermediateEventOnActivityBoundary') > -1
                                    || item.roles.indexOf('EntryCriterionOnItemBoundary') > -1
                                    || item.roles.indexOf('ExitCriterionOnItemBoundary') > -1) {
                                    _canContain = true;
                                }

                            } else if (parentItem.roles.indexOf('StageActivity') > -1) {
                                if (item.roles.indexOf('EntryCriterionOnItemBoundary') > -1
                                    || item.roles.indexOf('ExitCriterionOnItemBoundary') > -1) {
                                    _canContain = true;
                                }

                            } else if (parentItem.roles.indexOf('StageModelActivity') > -1) {
                                if (item.roles.indexOf('ExitCriterionOnItemBoundary') > -1) {
                                    _canContain = true;
                                }

                            } else if (parentCandidate.getStencil().idWithoutNs() === 'Pool') {
                                if (item.id === 'Lane') {
                                    _canContain = true;
                                }
                            }

                            if (_canContain) {
                                editorManager.handleEvents({
                                    type: ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
                                    highlightId: "shapeRepo.attached",
                                    elements: [parentCandidate],
                                    style: ORYX.CONFIG.SELECTION_HIGHLIGHT_STYLE_RECTANGLE,
                                    color: ORYX.CONFIG.SELECTION_VALID_COLOR
                                });

                                editorManager.handleEvents({
                                    type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                                    highlightId: "shapeRepo.added"
                                });

                            } else {
                                for (var i = 0; i < $scope.containmentRules.length; i++) {
                                    var rule = $scope.containmentRules[i];
                                    if (rule.role === parentItem.id) {
                                        for (var j = 0; j < rule.contains.length; j++) {
                                            if (item.roles.indexOf(rule.contains[j]) > -1) {
                                                _canContain = true;
                                                break;
                                            }
                                        }

                                        if (_canContain) {
                                            break;
                                        }
                                    }
                                }

                                // Show Highlight
                                editorManager.handleEvents({
                                    type: ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
                                    highlightId: 'shapeRepo.added',
                                    elements: [parentCandidate],
                                    color: _canContain ? ORYX.CONFIG.SELECTION_VALID_COLOR : ORYX.CONFIG.SELECTION_INVALID_COLOR
                                });

                                editorManager.handleEvents({
                                    type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                                    highlightId: "shapeRepo.attached"
                                });
                            }

                            $scope.dragCurrentParent = parentCandidate;
                            $scope.dragCurrentParentId = parentCandidate.id;
                            $scope.dragCurrentParentStencil = parentStencilId;
                            $scope.dragCanContain = _canContain;

                        } else {
                            var canvasCandidate = editorManager.getCanvas();
                            var canConnect = false;

                            var targetStencil = $scope.getStencilItemById(parentCandidate.getStencil().idWithoutNs());
                            if (targetStencil) {
                                var associationConnect = false;
                                if (stencil.idWithoutNs() === 'Association' && (curCan.getStencil().idWithoutNs() === 'TextAnnotation' || curCan.getStencil().idWithoutNs() === 'BoundaryCompensationEvent')) {
                                    associationConnect = true;
                                } else if (stencil.idWithoutNs() === 'DataAssociation' && curCan.getStencil().idWithoutNs() === 'DataStore') {
                                    associationConnect = true;
                                }

                                if (targetStencil.canConnectTo || associationConnect) {
                                    canConnect = true;
                                }
                            }

                            //Edge
                            $scope.dragCurrentParent = canvasCandidate;
                            $scope.dragCurrentParentId = canvasCandidate.id;
                            $scope.dragCurrentParentStencil = canvasCandidate.getStencil().id();
                            $scope.dragCanContain = canConnect;

                            // Show Highlight
                            editorManager.handleEvents({
                                type: ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
                                highlightId: 'shapeRepo.added',
                                elements: [canvasCandidate],
                                color: ORYX.CONFIG.SELECTION_VALID_COLOR
                            });

                            editorManager.handleEvents({
                                type: ORYX.CONFIG.EVENT_HIGHLIGHT_HIDE,
                                highlightId: "shapeRepo.attached"
                            });
                        }
                    }
                }
            };

            $scope.dragCallbackQuickMenu = function (event, ui) {
                flag = true;
                if ($scope.dragModeOver != false) {
                    var coord = editorManager.eventCoordinatesXY(event.pageX, event.pageY);

                    var additionalIEZoom = 1;
                    if (!isNaN(screen.logicalXDPI) && !isNaN(screen.systemXDPI)) {
                        var ua = navigator.userAgent;
                        if (ua.indexOf('MSIE') >= 0) {
                            //IE 10 and below
                            var zoom = Math.round((screen.deviceXDPI / screen.logicalXDPI) * 100);
                            if (zoom !== 100) {
                                additionalIEZoom = zoom / 100
                            }
                        }
                    }

                    if (additionalIEZoom !== 1) {
                        coord.x = coord.x / additionalIEZoom;
                        coord.y = coord.y / additionalIEZoom;
                    }

                    var aShapes = editorManager.getCanvas().getAbstractShapesAtPosition(coord);

                    if (aShapes.length <= 0) {
                        if (event.helper) {
                            $scope.dragCanContain = false;
                            return false;
                        }
                    }

                    if (aShapes[0] instanceof ORYX.Core.Canvas) {
                        editorManager.getCanvas().setHightlightStateBasedOnX(coord.x);
                    }

                    var stencil = undefined;
                    var stencilSets = editorManager.getStencilSets().values();
                    for (var i = 0; i < stencilSets.length; i++) {
                        var stencilSet = stencilSets[i];
                        var nodes = stencilSet.nodes();
                        for (var j = 0; j < nodes.length; j++) {
                            if (nodes[j].idWithoutNs() === event.target.id) {
                                stencil = nodes[j];
                                break;
                            }
                        }

                        if (!stencil) {
                            var edges = stencilSet.edges();
                            for (var j = 0; j < edges.length; j++) {
                                if (edges[j].idWithoutNs() === event.target.id) {
                                    stencil = edges[j];
                                    break;
                                }
                            }
                        }
                    }

                    var candidate = aShapes.last();

                    var isValid = false;
                    if (stencil.type() === "node") {
                        //check containment rules
                        var canContain = editorManager.getRules().canContain({
                            containingShape: candidate,
                            containedStencil: stencil
                        });

                        var parentCandidate = aShapes.reverse().find(function (candidate) {
                            return (candidate instanceof ORYX.Core.Canvas
                                || candidate instanceof ORYX.Core.Node
                                || candidate instanceof ORYX.Core.Edge);
                        });

                        if (!parentCandidate) {
                            $scope.dragCanContain = false;
                            return false;
                        }

                        $scope.dragCurrentParent = parentCandidate;
                        $scope.dragCurrentParentId = parentCandidate.id;
                        $scope.dragCurrentParentStencil = parentCandidate.getStencil().id();
                        $scope.dragCanContain = canContain;
                        $scope.dropTargetElement = parentCandidate;
                        isValid = canContain;

                    } else { //Edge
                        var shapes = editorManager.getSelection();
                        if (shapes && shapes.length == 1) {
                            var currentSelectedShape = shapes.first();
                            var curCan = candidate;
                            var canConnect = false;
                            var targetStencil = $scope.getStencilItemById(curCan.getStencil().idWithoutNs());
                            if (targetStencil) {
                                var associationConnect = false;
                                if (stencil.idWithoutNs() === 'Association' && (curCan.getStencil().idWithoutNs() === 'TextAnnotation' || curCan.getStencil().idWithoutNs() === 'BoundaryCompensationEvent')) {
                                    associationConnect = true;
                                } else if (stencil.idWithoutNs() === 'DataAssociation' && curCan.getStencil().idWithoutNs() === 'DataStore') {
                                    associationConnect = true;
                                }

                                if (targetStencil.canConnectTo || associationConnect) {
                                    while (!canConnect && curCan && !(curCan instanceof ORYX.Core.Canvas)) {
                                        candidate = curCan;
                                        //check connection rules
                                        canConnect = editorManager.getRules().canConnect({
                                            sourceShape: currentSelectedShape,
                                            edgeStencil: stencil,
                                            targetShape: curCan
                                        });
                                        curCan = curCan.parent;
                                    }
                                }
                            }
                            var parentCandidate = editorManager.getCanvas();

                            isValid = canConnect;
                            $scope.dragCurrentParent = parentCandidate;
                            $scope.dragCurrentParentId = parentCandidate.id;
                            $scope.dragCurrentParentStencil = parentCandidate.getStencil().id();
                            $scope.dragCanContain = canConnect;
                            $scope.dropTargetElement = candidate;
                        }

                    }

                    editorManager.handleEvents({
                        type: ORYX.CONFIG.EVENT_HIGHLIGHT_SHOW,
                        highlightId: 'shapeMenu',
                        elements: [candidate],
                        color: isValid ? ORYX.CONFIG.SELECTION_VALID_COLOR : ORYX.CONFIG.SELECTION_INVALID_COLOR
                    });
                }
            };

        }]);

var FLOWABLE = FLOWABLE || {};
//create command for undo/redo
FLOWABLE.CreateCommand = ORYX.Core.Command.extend({
    construct: function (option, currentReference, position, facade) {
        this.option = option;
        this.currentReference = currentReference;
        this.position = position;
        this.facade = facade;
        this.shape;
        this.edge;
        this.targetRefPos;
        this.sourceRefPos;
        /*
         * clone options parameters
         */
        this.connectedShape = option.connectedShape;
        this.connectingType = option.connectingType;
        this.namespace = option.namespace;
        this.type = option.type;
        this.containedStencil = option.containedStencil;
        this.parent = option.parent;
        this.currentReference = currentReference;
        this.shapeOptions = option.shapeOptions;
    },
    execute: function () {

        if (this.shape) {
            if (this.shape instanceof ORYX.Core.Node) {
                this.parent.add(this.shape);
                if (this.edge) {
                    this.facade.getCanvas().add(this.edge);
                    this.edge.dockers.first().setDockedShape(this.connectedShape);
                    this.edge.dockers.first().setReferencePoint(this.sourceRefPos);
                    this.edge.dockers.last().setDockedShape(this.shape);
                    this.edge.dockers.last().setReferencePoint(this.targetRefPos);
                }

                this.facade.setSelection([this.shape]);

            } else if (this.shape instanceof ORYX.Core.Edge) {
                this.facade.getCanvas().add(this.shape);
                this.shape.dockers.first().setDockedShape(this.connectedShape);
                this.shape.dockers.first().setReferencePoint(this.sourceRefPos);
            }
        } else {
            this.shape = this.facade.createShape(this.option);
            this.edge = (!(this.shape instanceof ORYX.Core.Edge)) ? this.shape.getIncomingShapes().first() : undefined;
        }

        if (this.currentReference && this.position) {

            if (this.shape instanceof ORYX.Core.Edge) {

                if (!(this.currentReference instanceof ORYX.Core.Canvas)) {
                    this.shape.dockers.last().setDockedShape(this.currentReference);

                    if (this.currentReference.getStencil().idWithoutNs() === 'TextAnnotation') {
                        var midpoint = {};
                        midpoint.x = 0;
                        midpoint.y = this.currentReference.bounds.height() / 2;
                        this.shape.dockers.last().setReferencePoint(midpoint);
                    } else {
                        this.shape.dockers.last().setReferencePoint(this.currentReference.bounds.midPoint());
                    }
                } else {
                    this.shape.dockers.last().bounds.centerMoveTo(this.position);
                }
                this.sourceRefPos = this.shape.dockers.first().referencePoint;
                this.targetRefPos = this.shape.dockers.last().referencePoint;

            } else if (this.edge) {
                this.sourceRefPos = this.edge.dockers.first().referencePoint;
                this.targetRefPos = this.edge.dockers.last().referencePoint;
            }
        } else {
            var containedStencil = this.containedStencil;
            var connectedShape = this.connectedShape;
            var bc = connectedShape.bounds;
            var bs = this.shape.bounds;

            var pos = bc.center();
            if (containedStencil.defaultAlign() === "north") {
                pos.y -= (bc.height() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET + (bs.height() / 2);
            } else if (containedStencil.defaultAlign() === "northeast") {
                pos.x += (bc.width() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.width() / 2);
                pos.y -= (bc.height() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.height() / 2);
            } else if (containedStencil.defaultAlign() === "southeast") {
                pos.x += (bc.width() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.width() / 2);
                pos.y += (bc.height() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.height() / 2);
            } else if (containedStencil.defaultAlign() === "south") {
                pos.y += (bc.height() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET + (bs.height() / 2);
            } else if (containedStencil.defaultAlign() === "southwest") {
                pos.x -= (bc.width() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.width() / 2);
                pos.y += (bc.height() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.height() / 2);
            } else if (containedStencil.defaultAlign() === "west") {
                pos.x -= (bc.width() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET + (bs.width() / 2);
            } else if (containedStencil.defaultAlign() === "northwest") {
                pos.x -= (bc.width() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.width() / 2);
                pos.y -= (bc.height() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET_CORNER + (bs.height() / 2);
            } else {
                pos.x += (bc.width() / 2) + ORYX.CONFIG.SHAPEMENU_CREATE_OFFSET + (bs.width() / 2);
            }

            // Move shape to the new position
            this.shape.bounds.centerMoveTo(pos);

            // Move all dockers of a node to the position
            if (this.shape instanceof ORYX.Core.Node) {
                (this.shape.dockers || []).each(function (docker) {
                    docker.bounds.centerMoveTo(pos);
                });
            }

            //this.shape.update();
            this.position = pos;

            if (this.edge) {
                this.sourceRefPos = this.edge.dockers.first().referencePoint;
                this.targetRefPos = this.edge.dockers.last().referencePoint;
            }
        }

        this.facade.getCanvas().update();
        this.facade.updateSelection();

    },
    rollback: function () {
        this.facade.deleteShape(this.shape);
        if (this.edge) {
            this.facade.deleteShape(this.edge);
        }
        //this.currentParent.update();
        this.facade.setSelection(this.facade.getSelection().without(this.shape, this.edge));
    }

});

