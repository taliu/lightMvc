var http=require("http");
var RouteTable=require("./lib/RouteTable");
var connact=require("./lib/connact");
var config=require("./lib/config");

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

//设置视图文件存放路径, 视图文件后缀为 .html, 使用vash模板引擎( razor语法)
Mvc.setViews=function(path){
	//把path中结尾的 '/' '\'删除
	path=path.replace(/[\/\\]$/,"");
	config.viewPath=path;
}

//设置控制器文件存放路径
Mvc.setController=function(path){
	path=path.replace(/[\/\\]$/,"");
	config.controllerPath=path;
};

//设置静态文件存放路径
Mvc.setStatic=function(path){
	path=path.replace(/[\/\\]$/,"");
	config.staticFilePath=path;
}
//设置要进行压缩的文件类型,多个文件类型用 逗号隔开 如 css,html,js
Mvc.setCompressFileExtension=function(fileExts){
	config.compressFileExtension=fileExts;
}

//静态文件 最大过期时间 单位秒
Mvc.setExpiresMaxAge=function(maxAge){
	config.expiresMaxAge=+maxAge;
}
