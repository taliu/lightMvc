var zlib = require('zlib');
var fs = require("fs");
var path = require("path");
var mime = require('mime-types');
var config = require("./config");
var crypto=require("crypto");
module.exports = function (err, req, res, next) {
    if (err) {
        return next(err);
    }
    var realPath = config.staticFilePath + req.urlData.pathname;
    //console.log("realPath:", realPath);
    fs.stat(realPath, function (err, stats) {
        if (!err && stats.isFile()) {
            fs.readFile(realPath, function (err, file) {
                if (err) {
                    next(err);
                } else {
				   setHeaders(req,res,stats,file,function(err){
						   if(!err){
								   res.end();
						   }else{
							next(err);
						   }
				   });
                }
            });
        } else {
            if (err && err.code != 'ENOENT') {//ENOFILE meam No such file or directory
                next(err);
            } else {
                next();
            }
        }
    });
}

function setHeaders(req,res,stats,fileData,callback){
	var compressFileExtension=config.compressFileExtension||"";
	var fileExtArr=compressFileExtension.split(",").map(function(i){ return i.toLowerCase();});
	var maxAge=(config.expiresMaxAge)||0;

	var lastModified = stats.mtime.toUTCString();
	var etag= md5(fileData);
		if(req.headers["if-modified-since"]==lastModified || req.headers["if-none-match"]==etag){
			res.statusCode = 304;
			return callback();
	}
    res.setHeader("Last-Modified", lastModified);
    res.setHeader("ETag", etag);

	res.setHeader('Cache-Control', 'public, max-age='+maxAge); 
	res.setHeader("Expires", new Date(Date.now()+maxAge*1000).toUTCString());
	
	var contentType = mime.contentType(path.extname(req.urlData.pathname));
	res.statusCode = 200;
	res.setHeader('Content-Type', contentType);

	res.setHeader('Content-Length', fileData.length);

	var acceptEncoding = req.headers['accept-encoding'] || "";
	var ext=path.extname(req.urlData.pathname).substr(1).toLowerCase();
	if(acceptEncoding&&fileExtArr.indexOf(ext)!=-1){
		if(acceptEncoding.indexOf("gzip")!=-1){
					zlib.gzip(fileData.toString(),function(err, buffer) {
							if (!err) {
							res.setHeader('Content-Length', buffer.length);
								res.setHeader('Content-Encoding', 'gzip')
								res.write(buffer);
							}
								callback(err);
					});
		}else if(acceptEncoding.indexOf("deflate")!=-1){
					zlib.deflate(fileData.toString(),function(err, buffer) {
							if (!err) {
							res.setHeader('Content-Length', buffer.length);
								res.setHeader('Content-Encoding', 'deflate')
								res.write(buffer);
							}
								callback(err);
					});

			}else{
				res.write(fileData);
				callback();	
			}
	}else{
		res.write(fileData);
		callback();	
	}

 
}


function md5(buff){
var md5 = crypto.createHash('md5');
md5.update(buff);
var result=md5.digest('hex');
return result;
}
