var config = require("./config");
var fs = require("fs");
var vash = require('vash');
var mime = require('mime-types');
module.exports = function (err, req, res, next) {
    if (err) {
        return next(err);
    }
    for (var key in ActionResults) {
        if (ActionResults.hasOwnProperty(key)) {
            res[key] = ActionResults[key];
        }
    }
    next();
}

var ActionResults = {
    view: function (model, viewName) {
        return function (req, res, next) {
            viewName = viewName || req.routeData.action;
            var viewModle = model;
            var viewPagePath = config.viewPath + "/" + req.routeData.controller + "/" + viewName + ".htm";
            fs.readFile(viewPagePath, { encoding: "utf-8" }, function (err, templ) {
                if (err) {
                    return next(err);
                }
                var tpl = vash.compile(templ);
                var html = tpl(viewModle);
                res.statusCode = 200;
                res.setHeader('Content-Type', mime.contentType('.html'));
                res.sendCookies();
                res.end(html);
            });
        };
    },

    content: function (contentStr, opts) {
        return function (req, res, next) {
            res.end(contentStr);
        };
    },

    redirect: function (url) {
        return function (req, res, next) {
            res.statusCode = 302;
            res.setHeader("Location", url);
            res.sendCookies();
            res.end();
        };
    },
    json: function (obj) {
        return function (req, res, next) {
            res.statusCode = 200;
            res.setHeader('Content-Type', mime.contentType('.json'));
            res.sendCookies();
            res.end(JSON.stringify(obj));
        };
    },

    httpNotFound: function () {
        return function (req, res, next) {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.sendCookies();
            res.end("404 Not Found");
        };
    },

    httpForbidden: function () {
        return function (req, res, next) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            res.sendCookies();
            res.end("403 Forbidden");
        };
    }
}
