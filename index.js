var http=require("http");
var RouteTable=require("./lib/RouteTable");
var connact=require("./lib/connact");
var config=require("./lib/config");

//req.urlData,req.session,req.form,req.routeData,req.files,req.query
//res.view(),res.json(),res.content(),res.httpNotFound(),res.httpForbidden();

module.exports=function(){
	return Mvc;
}

function Mvc(req,res){
	var ct=connact(req,res);
		ct.use(require("./lib/RequestDataModule"))
			.use(require("./lib/CookieModule"))
			.use(require("./lib/SessionModule"))
			.use(require("./lib/StaticFileModule"))
			.use(require("./lib/RouteModule"))
			.use(require("./lib/ActionResultModule"))
			.use(require("./lib/MvcHandleModule"))
			.done();
}


Mvc.listen=function(){
 var server = http.createServer(Mvc);
   return server.listen.apply(server, arguments);
}

Mvc.addRouter=function(pattern, defaultOpts, constraintOpts){
		//RouteTable.addRouter("/{controller}/{action}/{id}",{controller:"home",action:"index",id:1},{id:/\d+/});
		RouteTable.addRouter(pattern, defaultOpts, constraintOpts);
};

Mvc.setViews=function(path){
	//把path中结尾的 '/' '\'删除
	path=path.replace(/[\/\\]$/,"");
	config.viewPath=path;
}

Mvc.setController=function(path){
	path=path.replace(/[\/\\]$/,"");
	config.controllerPath=path;
};

Mvc.setStatic=function(path){
	path=path.replace(/[\/\\]$/,"");
	config.staticFilePath=path;
}
