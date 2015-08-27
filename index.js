var http=require("http");
var connact=require("./lib/connact");
http.createServer(function(req,res){
	var ct=connact(req,res);
	ct.use(require("./lib/RequestDataModule"));
	ct.use(require("./lib/StaticFileModule"));
	ct.use(function(err,req,res,next){
		console.log("query",req.query);
		console.log("url data",req.urlData);
		console.log("form",req.form);
		console.log("files",req.files);
		res.end("hello world");
		next();
	});
	ct.done();
}).listen(5566,function(){
	console.log("web server listen at port 5566");
});

