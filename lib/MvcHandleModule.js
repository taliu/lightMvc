var config = require("./config");
var fs = require("fs");
module.exports = function (err, req, res, next) {
    if (err) {
        return next(err);
    }
    if (req.routeData == null) {
        return res.httpNotFound()(req, res, next);
    }
    var controllerPath = config.controllerPath + "/" + req.routeData.controller + ".js";
    fs.exists(controllerPath, function (exists) {
        if (exists) {
            var Controller = require(controllerPath);
            var action = getAction(req.routeData.action, new Controller(req, res));
            var actionResult = action(req, res);
            //如果返回的不是方法，则包装成方法
            if (!(actionResult instanceof Function)) {
                var val = actionResult;
                if (val === undefined) {
                    return next(new Error(req.routeData.controller + "." + req.routeData.action + "方法无返回值"));
                }
                actionResult = res.content(val);
            }
            actionResult(req, res, next)
        } else {
            res.httpNotFound()(req, res, next);
        }
    });

    //支持方法名称前面添加get_,post_来指定处理get或post请求。
    function getAction(actionName, controller) {
        var actionNameLc = actionName.toLowerCase();
        var methodNames = Object.keys(controller).filter(function (key) { return (controller[key] instanceof Function); });
        //优先匹配带有get_，post_前缀的方法
        var m = req.method.toLowerCase();
        var preActoinNameLc = m + "_" + actionNameLc;
        for (var i in methodNames) {
            var mName = methodNames[i];
            var mNameLc = mName.toLowerCase();
            if (mNameLc== preActoinNameLc) {
                return controller[mName].bind(controller);
            }
        }
        //匹配没有前缀的方法
        var ms = ["get","post","put","delete"];
        for (var i in methodNames) {
            var mName = methodNames[i];
            var mNameLc = mName.toLowerCase();
            if (actionNameLc === mNameLc) {
                if (ms.indexOf(mNameLc.split("_")[0]) != -1) {//不能通过url 访问有前缀的方法 如 /home/post_user
                        return res.httpForbidden;
                }
                return controller[mName].bind(controller);
            }
        }
         return res.httpNotFound;
    }

}

