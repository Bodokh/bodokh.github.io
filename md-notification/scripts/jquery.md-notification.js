/// <reference path="jquery.min.js" />
//Written by Eran Bodokh
// Options
// bool timeStamp
// string customTimeStamp
// Action[] actions {name,mdIcon,link}
// string footer
// string header
// string subheader
// string body
// string imgUrl
// string position [top,bottom,left,right,top-right,top-left,bottom-left,bottom-right]

; (function ($, window, document, undefined) {

    var activeNotifications = [];
    //Globals
    var timeHide, timeClose, timeShow;
    function GetAmPmTime() {
        var date = new Date();
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }
    function GetNotificationPos(position) {
        switch (position) {
            case "bottom":
                return "left:0;right:0;top:auto; bottom:15px; transform-origin : center bottom;" +
                "-webkit-transform:scale(0) translate(0,100px);" +
                "transform:scale(0) translate(0,100px);";
            case "bottom-right":
                return "right:15px;top:auto; bottom:15px; transform-origin : right bottom;" +
                "-webkit-transform:scale(0) translate(100px,100px);" +
                "transform:scale(0) translate(100px,100px);";
            case "bottom-left":
                return "left:15px;top:auto; bottom:15px; transform-origin : left bottom;" +
    "-webkit-transform:scale(0) translate(-100px,100px);" +
    "transform:scale(0) translate(-100px,100px);";
            case "top":
                return "left:0;right:0;top:15px;transform-origin : center top;" +
    "-webkit-transform:scale(0) translate(0,-100px);" +
    "transform:scale(0) translate(0,-100px);";
            case "top-right":
                return "right:15px;top:15px;transform-origin : right top;" +
    "-webkit-transform:scale(0) translate(100px,-100px);" +
    "transform:scale(0) translate(100px,-100px);";
            case "top-left":
                return "left:15px;top:15px;transform-origin : left top;" +
    "-webkit-transform:scale(0) translate(-100px,-100px);" +
    "transform:scale(0) translate(-100px,-100px);";
        }
        return "";
    }
    var CloseNotification = function (item, _timeout) {
        HideNotification(item, _timeout);
        timeClose = setTimeout(function () {
            $(item).remove();
        }, _timeout + 200);
    };

    var HideNotification = function (item, _timeout) {
        timeHide = setTimeout(function () {
            item.removeClass("active");
            $(item).find(".md-progress").removeClass("active");
        }, _timeout);
    };
    var ShowNotification = function (item) {
        timeShow = setTimeout(function () {
            $(item).addClass("active");
            $(item).find(".md-progress").addClass("active");
        }, 0);
    };
    //Returns the html for a notification
    var GenereateNotificationHTML = function (_settings) {
        var html = '<div class="md-notification-container" style="' + (GetNotificationPos(_settings.position)) + '">';
        html += (_settings.dismiss ? '<a class="md-notification-close" data-target="md-notification-generated" data-dismiss="md-notification"><i class="material-icons">close</i></a>' : '');
        html += (_settings.imgUrl != null ? ('<div class="md-img-container">' + '<img src="' + (_settings.imgUrl) + '" /></div>') : '');
        html += '<div class="md-notification-content" ' + (_settings.imgUrl == null ? 'style="width:100%;"' : '') + '>'
        + (_settings.timeStamp ? '<p class="md-notification-time">' + (_settings.customTimeStamp == null ? GetAmPmTime() : _settings.customTimeStamp) + '</p>' : '')
        + '<h3>' + (_settings.header) + '</h3>'
        + (_settings.subHeader != null ? '<h4>' + _settings.subHeader + '</h4>' : '')
        + '<p>' + (_settings.body) + '</p>';
        if (_settings.actions != null) {
            html += '<div class="md-notification-options">';
            for (var i = 0; i < _settings.actions.length; i++) {
                html += '<div class="md-notification-option"><a href="' + (_settings.actions[i].link) + '">' +
                    ((_settings.actions[i].mdIcon) != null ? ('<i class="material-icons">' + (_settings.actions[i].mdIcon) + '</i> ') : '')
                    + (_settings.actions[i].name) + '</a></div>'
            }
            html += "</div>"
        }
        html += _settings.footer != null ? '<p>' + _settings.footer + '</p>' : '';
        html += '</div>';
        if (_settings.progressBar) {
            html += "<div class='md-progress' style='-webkit-transition:width " + _settings.timeOut + "ms linear;transition:width " + _settings.timeOut + "ms linear;'></div>";
        }
        html += '</div>';
        return html;
    };


    var methods = {
        init: function (options) {
            var settings = $.extend({
                timeStamp: false,
                actions: null,
                header: "",
                subHeader: null,
                body: "",
                imgUrl: null,
                footer: null,
                customTimeStamp: null,
                position: "top",
                timeOut: 5000,
                dismiss: false,
                progressBar: false
            }, options);
            //Generate Click Event
            var item;
            if (this[0].tagName == "BODY") {
                var html = GenereateNotificationHTML(settings);
                item = $(html).appendTo("body");
                ShowNotification(item);
                CloseNotification(item, settings.timeOut);
            } else if (!this.hasClass("md-notification-container")) {
                this.click(function () {
                    var html = GenereateNotificationHTML(settings);
                    item = $(html).appendTo("body");
                    //Animate element In
                    ShowNotification(item);
                    //Animate ElementOut
                    CloseNotification(item, settings.timeOut);
                });
            }
            $("[data-dismiss='md-notification']").click(function () {
                if ($(this).attr("data-target") == "md-notification-generated") {
                    CloseNotification(item, 0);
                }
                else {
                    CloseNotification($(this).parents(".md-notification-container"), 0);
                }
            });

            return this;
        },
        show: function (_timeOut) {
            ShowNotification(this);
            CloseNotification(this, _timeOut);
            return this;
        },
        hide: function () {
            HideNotification(this, 0);
            return this;
        },
        close: function () {
            CloseNotification(this, 0);
            return this;
        }
    };

    $.fn.mdNotify = function (methodOrOptions) {
        if (methods[methodOrOptions]) {
            return methods[methodOrOptions].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof methodOrOptions === 'object' || !methodOrOptions) {
            // Default to "init"
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + methodOrOptions + ' does not exist on jQuery.mdNotify');
        }
    };
}(jQuery));