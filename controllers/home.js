module.exports = function (req, res) {
    this.index = function () {
		req.session.count=req.session.count||0;
		req.session.count++;
        var model = {
            title: "welcome",
            content: 	req.session.count+" welcome to node mvc" + Date.now()
        };
		console.log("cookies:",req.cookies);
		//console.log("header cookies:",req.headers.cookie);
	   
        res.cookie("ssid", "123456789",{expires:new Date(2050,1,1)});
		res.cookie("flag","我是这的主人");
        return res.view(model);
    };

    this.post_index = function () {
        return res.content("it is a post request for index");
    };

    this.apple = function () {
        return res.content("I like eat apple");
    }

    this.bananas = function () {
        return res.json([
        { name: "china", color: "yellow" },
        { name: "japan", color: "yellow" },
        { name: "韩国", color: "yellow" },
        ]);
    };

    this.banana = function () {
        return res.redirect("/home/bananas");
    };

    this.version = function () {
        return "node mvc vesion: 1.0.0";
    };
    this.error = function () {
    };
};
