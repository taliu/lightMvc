var RouteTable=require("./RouteTable");
module.exports=function(err,req,res,next){
	if(err){
		return next(err);
	}
	req.routeData=RouteTable.getRouteData(req.urlData.pathname);
	console.log("RouteModule:",req.routeData);
	next();
}
