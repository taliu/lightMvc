var Mvc=require("lightmvc");

var app=Mvc();

//注册路由模板
app.addRouter("/{controller}/{action}/{id}",//路由模板
              {controller:"home",action:"index",id:1},//默认值
			  {id:/\d+/});//用正则表达式匹配来约束参数

app.listen(5566,function(){
	console.log("web server is listening on port 5566");
});

//使用中间件
app.use(function(err,req,res,next){
	console.log("--",req.method,req.url);
	console.log("cookies:",req.cookies);
	console.log("routeData:",req.routeData);
	next(err);
});


//设置视图文件存放路径, 视图文件后缀为 .html, 使用vash模板引擎( razor语法)
app.setViews(__dirname+"/views");
//设置控制器文件存放路径
app.setController(__dirname+"/controllers");
//设置静态文件存放路径
app.setStatic(__dirname+"/public");
//设置要进行压缩的文件类型,多个文件类型用 逗号隔开 如 css,html,js
app.setCompressFileExtension("css,html,htm,js");
//静态文件 最大过期时间 单位秒
app.setExpiresMaxAge(60*60*24);

//api
/*
req.urlData
req.session
req.cookies
req.form
req.routeData
req.files
req.query

res.cookie(name,val,opts)
res.view(model,viewName),
res.json(obj),
res.content(contentStr),
res.redirect(url),
res.httpNotFound(),
res.httpForbidden();
*/
