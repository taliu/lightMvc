var Cache=require("./Cache");
var ssCache=new Cache();

module.exports=function(err,req,res,next){
	if(err){
		return next(err);
	}
	var sessionName="nodemvc.ssid";

	var sessionId=req.cookies[sessionName];
	var expiryDate=new Date(Date.now()+1000*60*20);
	if(!sessionId){
			sessionId=createSessionId();
			res.cookie(sessionName,sessionId,{expires:expiryDate});
			ssCache.set(sessionId,{},expiryDate);
	}

	if(!ssCache.get(sessionId)){
			ssCache.set(sessionId,{},expiryDate);
	}

	//更新过期时间  滑动过期 
	var item=ssCache.getItem(sessionId);
	if(item.expiryDate.getTime()-Date.now()<1000*60*10){
		item.expiryDate=expiryDate;
		res.cookie(sessionName,sessionId,{expires:expiryDate});
	}

	Object.defineProperty(req, "session", {  get: function() {
		return ssCache.get(sessionId);
	}});

	next();
};

function createSessionId(){
	return Math.ceil(Math.random()*Math.pow(10,10)+Date.now()).toString(16);
}


