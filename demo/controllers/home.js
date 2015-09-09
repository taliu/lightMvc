module.exports = function (req, res) {

	this.welcome=function(){

		return "welcome to use node mvc 1.0.0";
	}

    this.index = function (req,res) {

		if(req.session.userInfo==null){
			return res.redirect("/account/login");
		}

        var model = {
            title: "首页",
            content: "欢迎"+ req.session.userInfo.username +" 登入"
        };

        return res.view(model);
    };
};
