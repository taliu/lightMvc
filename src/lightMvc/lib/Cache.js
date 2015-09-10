function Cache(){
	var store={};
	var self=this;
	//定时清除过期键值对
	setInterval(function(){
		for(var key in store){
				if(store[key].expiryDate.getTime()<Date.now()){
					console.log("remove session id:",key);
					self.remove(key);
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

	this.getItem=function(key){
		return store[key];
	}
}

function CacheItem(val,expiryDate){
		this.expiryDate =expiryDate;
		this.val=val;
}

module.exports=Cache;
