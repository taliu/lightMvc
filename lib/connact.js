function connact(req,res){
	var callbacks=[];
	function use(fn){
		callbacks.push(fn);
		return this;
	}
	var index=-1;
	function call(err){
		if(!err){
			index++;
			if(index<callbacks.length){
				callbacks[index](err,req,res,call)
			}
		}else{
			console.log("error:",err);
			throw err;
		}
	}
	return {
		use:use,
		done:call
	}
}
module.exports=connact;

