module.exports=function(req,res){

	this.login=function(){
		return res.view();	
	};

	this.post_login=function(){
		if(req.form.username=="taliu"&&req.form.password=="123"){
			req.session.userInfo={username:req.form.username,password:req.form.password};
			return res.redirect("/");
		}else{
			var model={
				username:req.form.username,
				error:"用户名或密码错误"
			};
			return res.view(model);
		}
	};

	this.logout=function(){
		req.session.userInfo=null;
		return res.redirect("/account/login");
	};
}
