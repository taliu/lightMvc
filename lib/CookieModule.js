var cookie = require("cookie");
module.exports = function (err, req, res, next) {
    if (err) {
        return next(err);
    }
    req.cookies = cookie.parse(req.headers.cookie || "");

    var cookieBuff = {};
    res.cookie = function (name, val, options) {
        if (name) {
            cookieBuff[name] = cookie.serialize(name, val, options);
        }
    };
    res.clearCookie = function (name) {
        res.cookie(name, "", { expires: new Date(1997, 9, 9) });
    };
    res.sendCookies = function () {
        if (cookieBuff.hasOwnProperty()) {
            return;
        }
        var arr = [];
        for (var key in cookieBuff) {
            arr.push(cookieBuff[key]);
        }
        cookieBuff = {};
        res.setHeader("Set-Cookie", arr);
    };

    next();
};
