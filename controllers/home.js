module.exports=function(req,res){
	this.index=function(){
		var model={
			title:"welcome",
			content:"welcome to node mvc"+Date.now()
		};
		res.cookie("ssid","123456789");
		res.cookie("data",["12",23]);
		return res.view(model);
	};
	this.post_index=function(){
		return res.content("it is a post request for index");
	};
	this.get_index = function () {
	    return res.content("it is a get request for index");
	};

	this.apple=function(){
			return	res.content("I like eat apple");
	}
	
	this.bananas=function(){
			return	res.json([
			{name:"china",color:"yellow"},
			{name:"japan",color:"yellow"},
			{name:"韩国",color:"yellow"},
			]);
	};

	this.banana=function(){
			return	res.redirect("/home/bananas");
	};
	
	this.version=function(){
		return "node mvc vesion: 1.0.0";
	};
	this.error=function(){
	};
};
