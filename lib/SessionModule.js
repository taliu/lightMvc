module.exports=function(err,req,res,next){
	if(err){
		return next(err);
	}
	var sessionName="nodemvc.ssid";
	var ssCache=new Cache();

	var sessionId=req.cookies[sessionName];
	if(!sessionId){
			var expiryDate=new Date(Date.now()+1000*60*20);
			res.cookie(sessionName,sessionId,{expires:expiryDate});
			ssCache.set(sessionId,{},expiryDate);
	}

	Object.defineProperty(req, "session", {  get: function() {
		return ssCache.get(sessionName);
	}});

	next();
};

function createSessionId(){
	return Math.ceil(Math.random()*Math.pow(10,10)+Date.now()).toString(16);
}


function SessionMgr(){
	var ssCache=new Cache();	
	this.get=function(key){
		return ssCache.get(key);
	}
	
	this.set=function(key,sessionVal,expiryDate){ 
		expiryDate=expiryDate||new Date(Date.now()+1000*60*20);
		ssCache.set(key,sessionVal,expiryDate);
	};


}

function Cache(){
	var store={};
	//定时清除过期键值对
	setInterval(function(){
		for(var key in store){
				if(store[key].expiryDate.getTime()<Date.now()){
					this.remove(key);
				}
		}
	},1000);

	this.set=function(key,val,expiryDate){ 
		expiryDate=expiryDate||new Date(2050,1,1);
		store[key]=new CacheItem(val,expiryDate);
		return this;
	};

	this.get=function(key){
		var item= store[key];
		return item&&item.val;
	};
	
	this.remove=function(key){
		delete store[key];
	}

	this.keys=function(){
			return Object.keys(store);
	}

	this.removeAll=function(){
		store={};
	}
}

function CacheItem(val,expiryDate){
		this.expiryDate =expiryDate;
		this.val=val;
}
