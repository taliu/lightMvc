//RouteTable 路由表
module.exports=(function (){
	var routeTable=[];
	function getRouteData(virtualPath){
		for(var i=0; i< routeTable.length;i++){
			var data=routeTable[i].getRouteData(virtualPath);
			if(data){
				return data;
			}
		}
		return null;
	};
	function addRouter(pattern,defaultOpts,constraintOpts){
		routeTable.push(new Router(pattern,defaultOpts,constraintOpts));
		if(defaultOpts){
			for(var key in defaultOpts){
				var val=defaultOpts[key];
				if(val!==null&&val!== undefined){
					var arr=pattern.split("{"+key+"}");
					if(arr.length==2){
						var pt=arr[0];
						if(pt[pt.length-1]=="/"){
							pt=pt+"?";
						}
						pt&&routeTable.push(new Router(pt,defaultOpts,constraintOpts));
					}
				}
			}
		}
	};
	return {getRouteData:getRouteData,addRouter:addRouter};
}());

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
	objA=objA||{};
	objB=objB||{};
	var obj={};
	for(var key in objA){
		obj[key]=objA[key];
	}
	for(var key in objB){
		obj[key]=objB[key];
	}
	return obj;
}
