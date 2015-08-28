var config=require("./config");
var fs=require("fs");
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
				var val=actionResult;
				if(val===undefined){
					return next(new Error(req.routeData.controller+"."+req.routeData.action+"方法无返回值"));
				}
				actionResult=res.content(val);
			}
			actionResult(req,res,next)
		}else{
			res.httpNotFound()(req,res,next);
		}
	});

function getAction(actionName,controller){
	actionName=actionName.toLowerCase();
	for(var key in controller){
		var method=controller[key];
		if(method instanceof Function){
			var keyLc=key.toLowerCase();
			//支持方法名称前面添加get,post来指定处理get或post请求。名称一定要为驼峰式.如 getBookList
			var m=req.method.toLowerCase();
			console.log("get action:",actionName,keyLc,m);
			if(keyLc.indexOf(m)==0){
					var firstLetter=key[m.length];
					if(firstLetter!=firstLetter.toLowerCase()
					    && keyLc.substr(m.length)==actionName){
							return method.bind(controller);
					}
			}else if(actionName==keyLc){
							return method.bind(controller);
			}
		}
	}
	return 	res.httpNotFound;
}

}

