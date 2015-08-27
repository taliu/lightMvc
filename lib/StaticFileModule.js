var fs=require("fs");
var path=require("path");
var mime = require('mime-types');
var config=require("./config");
module.exports=function(err,req,res,next){
	if(err){
		return next(err);
	}
	var realPath=config.staticFilePath+req.urlData.pathname;
	console.log("realPath:",realPath);
	fs.stat(realPath,function(err,stats){
			if(!err&&stats.isFile()){
				fs.readFile(realPath, "binary", function (err, file) {
					if (err) {
						next(err);
					} else {
						var contentType=mime.contentType(path.extname(req.urlData.pathname)); 
						console.log(contentType);
						res.statusCode=200;	
						res.setHeader('Content-Type', contentType);
						res.write(file, "binary");
						res.end();
					}
					});
			}else{
				 if(err&&err.code != 'ENOENT') {//ENOFILE meam No such file or directory
					next(err);
				 }else{
					next();
				 }
			}
	});
}
