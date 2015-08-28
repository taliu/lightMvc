module.exports=function(err,req,res,next){
	if(err){
		return next(err);
	}
	for(var key in ActionResults){
		if(ActionResults.hasOwnProperty(key)){
			res[key]=ActionResults[key];
		}
	}
	next();
}

var ActionResults={

view:function (model,viewName){
	return function(req,res,next){
		viewName=viewName||req.routeData.action;
		var	viewModle=model;
		res.readFile(viewPagePath, { encoding: "utf-8" }, function (err, templ) {
				if(err){
					return next(err);
				}
				var tpl = vash.compile(templ);
				var html = tpl(viewModel);
				res.end(html);
		});
	};
},

content:function (contentStr,opts){
	return function(req,res,next){
		res.end(contentStr);
	};
},

httpNotFound:function (){
	 return function(req,res,next){
			res.statusCode=404;	
			res.setHeader('Content-Type', 'text/plain');
			res.end("404 Not Found");
	};
	
}
}
