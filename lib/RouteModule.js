module.exports=function(err,req,res,next){
	if(err){
		return next(err);
	}
	next();
}
function Router(pattern,defaultOpts,constraintOpts){
	this._pattern=pattern;
	this._default=defaultOpts;
	this._constraint=constraintOpts;
	this.getRouteData=function(virtualPath){
		var paramNames=[];
		var patternStr=this._pattern.replace(/\{\w+\}/ig,function(pt){
				var paramName=pt.substring(1,pt.length-1);
				paramNames.push(paramName);
				var constraint=getConstraint( constraintOpts[paramName]);
				return  constraint||'(\\w+)';
				});
		if(new RegExp("^"+patternStr+"$","i").test(virtualPath)){
			var params={};
			paramNames.forEach(function(pm,index){
					params[pm]=RegExp["$"+(index+1)];
					});
			   return extend(defaultOpts,params);
		}else{
			return null;
		}
	}
	function getConstraint(ct){
		if(!ct){
			return null;
		}
		var s=ct;
		if(ct instanceof RegExp){
			s=ct.toString();
			s=s.substring(s.indexOf("/")+1,s.lastIndexOf("/"));
		}
		if(s[0]!=="("){
			s="("+s+")";
		}
		return s;
	}
}
function extend(objA,objB){
	var obj={};
	for(var key in objA){
		obj[key]=objA[key];
	}
	for(var key in objB){
		obj[key]=objB[key];
	}
	return obj;
}
//for test:
//var r=new Router("/{action}/{controller}/{id}",{controller:"home",action:"index",id:1},{id:/\d+/});
//r.getRouteData("/love/you/100")
