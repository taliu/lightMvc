var config=require("./config");
var fs=require("fs");
var vash = require('vash');
module.exports=function(err,req,res,next){
	if(err){
		return next(err);
	}
	if(req.routeData==null){
		return res.httpNotFound()(req,res,next);
	}
	var controllerPath=config.controllerPath+"/"+req.routeData.controller+".js";
	fs.exists(controllerPath,function(exists){
		if(exists){
			var Controller=require(controllerPath);
			var action=getAction(req.routeData.action,new Controller(req,res));	
			var actionResult=action(req,res);
			//如果返回的不是方法，则包装成方法
			if(!(actionResult instanceof Function)){ 
				var val=actionReuslt;
				actionReuslt=res.content(val);
			}
			actionReuslt(req,res,next)
		}else{
			res.httpNotFound()(req,res,next);
		}
	});
}

function getAction(actionName,controller){
	actionName=actionName.toLowerCase();
	for(var key in controller){
		var method=controller[key];
		if(method instanceof Function){
			if(actionName==key.toLowerCase()){
				return method.bind(controller);
			}
		}
	}
	return 	res.httpNotFound;
}


