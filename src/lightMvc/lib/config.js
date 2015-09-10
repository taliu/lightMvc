var cwd=process.cwd();
module.exports={
	viewPath:cwd+"/views",
	controllerPath:cwd+"/controllers",
	staticFilePath: cwd+"/public",
	compressFileExtension:"css,html,htm,js",
	expiresMaxAge:24*60*60//静态文件 最大过期时间
};
