# lightMvc
一个简单轻量的node mvc 框架，类似asp.net mvc.
## 开始
### 安装lightMvc
```
npm install lightmvc --save
```
### 使用

添加app.js 
```
var Mvc=require("lightmvc");
var app=Mvc();
//注册路由模板
app.addRouter("/{controller}/{action}/{id}",//路由模板
              {controller:"home",action:"index",id:1},//默认值
			  {id:/\d+/});//用正则表达式匹配来约束参数
			  
app.listen(5566,function(){
	console.log("web server is listening on port 5566");
});
```

我们要添加控制器和相应视图来处理不同的请求。

在controllers目录下添加一个控制器 home.js
```
 module.exports = function (req, res) {
     this.index = function (req,res) {
         var model = {
             title: "首页",
             content: "欢迎您使用"
         };
         return res.view(model);
     };
	 
	 this.post_index=function(){
			return "index方法名称添加post_前缀来处理post请求";
	 };
 };
```


在views目录下添加home/index.htm 视图文件,视图使用razor语法
```
<!DOCTYPE HTML>
<html lang="en-US">
<head>
<meta charset="UTF-8">
<title>@model.title</title>
</head>
<body>
@model.content
</body>
</html>
```
启动web服务
```
node app.js
```
现在你就可以访问： http://127.0.0.1:5566/home/index

## lightMvc api

### app
1. app.setViews(path)
设置视图文件存放路径, 视图文件后缀为 .html, 使用vash模板引擎( razor语法)

2. app.setController(path);
设置控制器文件存放路径

3. app.setStatic(path);
设置静态文件存放路径

4. app.setCompressFileExtension(extStr);
设置要进行压缩的文件类型,多个文件类型用 逗号隔开 如 css,html,js

5. app.setExpiresMaxAge(num);
静态文件 最大过期时间 单位秒

### req
1. req.urlData
2. req.session
3. req.cookies
4. req.form
5. req.routeData
6. req.files
7. req.query

### res
1. res.cookie(name,val,opts)
2. res.view(model,viewName),
3. res.json(obj),
4. res.content(contentStr),
5. res.redirect(url),
6. res.httpNotFound(),
7. res.httpForbidden();

具体例子请见demo
