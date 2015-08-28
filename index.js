var http=require("http");
var RouteTable=require("./lib/RouteTable");
var connact=require("./lib/connact");
RouteTable.addRouter("/{controller}/{action}/{id}",{controller:"home",action:"index",id:1},{id:/\d+/});
http.createServer(function(req,res){
	var ct=connact(req,res);
	ct.use(function(err,req,res,next){
		console.log("----",req.method,req.url);
		next();
	});
	ct.use(require("./lib/RequestDataModule"));
	ct.use(require("./lib/StaticFileModule"));
	ct.use(require("./lib/RouteModule"));
	ct.use(require("./lib/ActionResultModule"));
	ct.use(require("./lib/MvcHandleModule"));
	ct.use(function(err,req,res,next){
		console.log("query",req.query);
		console.log("url data",req.urlData);
		console.log("form",req.form);
		console.log("files",req.files);
		console.log("route data",req.routeData);
		res.end("hello world");
		next();
	});
	ct.done();
}).listen(5566,function(){
	console.log("web server listen at port 5566");
});

