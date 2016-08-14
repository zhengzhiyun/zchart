/* 
* @Author: anchen
* @Date:   2016-08-14 17:48:12
* @Last Modified by:   anchen
* @Last Modified time: 2016-08-14 17:48:40
*/

function Draw(x, y, da, Id, dataFrom, type) {
    this.x = x;
    this.y = y;
    this.da = da;
    this.dataFrom = dataFrom;
    this.box = document.getElementById(Id);
    this.xData = [];
    this.yData = [];
    this.data = [];
    this.timer = null;
    this.showNum = 1;
    this.type = type;
    this.getJSON();
}
// 获得数据
Draw.prototype.getJSON = function() {
    var _this = this;
    // 将JSON数据传入网页中
    $.getJSON(this.dataFrom, function(json){
        for(var j = 0; j < json[0].length; j++) {
            if (json[0][j][_this.x] && json[0][j][_this.y] && json[0][j][_this.da]) {
                _this.xData.push(json[0][j][_this.x]);
            } else {
                alert('没有正确传递参数');
                return;
            }
        };
        for(var i = 0; i < json.length; i++) {
            var thData = [];
            for(var b = 0; b < json[i].length; b++) {
                thData.push(json[i][b][_this.da]);
                if(b == 0) {
                    _this.yData.push(json[i][0][_this.y]);
                };
            };
            _this.data.push(thData);
        };
        // 定义一个画布
        _this.box.innerHTML = "<canvas id='canvas' class='canvas' width='500px' height='400px'></canvas>"
        // 画布下的按钮 点击按钮可以变换月份 ，点击换色可以变换颜色
        for(var i = 0;i < _this.data.length; i++) {
            $(_this.box).append("<div>" + _this.yData[i] + "</div>");
            $(_this.box).children().eq(i + 1).css({
                "position" : "absolute",
                "width" : "80",
                "height" : "30",
                "color" : "#fff",
                "background-color" : "#3cf",
                "border-radius" : "5",
                "text-align" : "center",
                "line-height" : "30px",
                "cursor" : "pointer",
                "bottom" : 0,
                "left" : i * 100
            })
        };
        _this.showDraw(1, 'canvas');
        $(_this.box).children("div").on("click", function() {
            _this.showDraw($(this).index(), 'canvas');
        });
    })
}
// 饼状图
Draw.prototype.drawCircle = function(canvasId, data, color_arr) {
    var pi2 = Math.PI * 2;
    var canvas = document.getElementById(canvasId);
    var c = canvas.getContext("2d");
    var startAgl = 0;
    for(var i = 0; i < data.length; i++) {
        agl = data[i] * pi2 + startAgl;
        c.fillStyle = color_arr[i];
        c.beginPath();
        c.moveTo(200, 200);
        c.arc(200, 200, 150, startAgl, agl, false);
        c.lineTo(200, 200);
        c.fill();
        c.fillRect(400, 50 + 18 * i, 16, 16);
        c.fillStyle = "#000000";
        c.fillText(this.xData[i] + " " +  data[i] * 100 + "%", 420, 62 + 18 * i);
        startAgl = agl;
        c.closePath();
        if (this.showNum > 0) {
            c.beginPath();
            c.moveTo(200,200);
            c.arc(200, 200, 300, 0, this.showNum * pi2);
            c.strokeStyle = "#fff";
            c.fillStyle = "#fff";
            c.fill();
        };
    }
}
Draw.prototype.drawText = function (canvasId, data, color_arr) {
    var pi2 = Math.PI * 2;
    var canvas = document.getElementById(canvasId);    
    var c = canvas.getContext("2d");
    var startAgl = 0;
    var agl;
   for(var i = 0; i< data.length; i++){ 
       agl = data[i] * pi2 + startAgl;
       var x = 150 * Math.cos(startAgl) + 200;
       var y = - 4 + 150 * Math.sin(startAgl) + 200;
      if (startAgl >= 0 && startAgl < Math.PI / 4 || startAgl >= Math.PI / 4 * 7 && startAgl < Math.PI * 2) {
            c.fillText(data[i] * 100 + "%", x - 50, y + 30);
        } else if(startAgl >= Math.PI / 4 && startAgl < Math.PI / 4 * 3) {
            c.fillText(data[i] * 100 + "%", x - 50, y - 30);
        } else if(startAgl >= Math.PI / 4 * 3 && startAgl < Math.PI / 4 * 5) {
            c.fillText(data[i] * 100 + "%", x, y - 20);
        } else {
            c.fillText(data[i] * 100 + "%", x, y + 30);
        }
        startAgl = agl;
    };
}
// 环状图
Draw.prototype.drawAnnular = function (canvasId, data, color_arr) {
    var pi2 = Math.PI * 2;
    var canvas  = document.getElementById(canvasId);
    var c = canvas.getContext("2d");
    var agl;
    for(var i = 0; i < data.length; i++) {
        agl = data[i] * pi2;
        c.fillStyle = color_arr[i];
        c.beginPath();
        c.moveTo(200, 200);
        c.arc(200, 200, 150 - i * 15, 0, agl, false);
        c.lineTo(200, 200);
        c.fill();
        c.fillRect(400, 50 + 18 * i, 16, 16);
        c.fillStyle = "#000000";
        c.fillText(this.xData[i] + " " + parseInt(data[i] * 100) + "%", 420, 62 + 18 * i);
        c.closePath();
        c.beginPath();
        c.moveTo(200, 200);
        c.arc(200, 200, 150 - i * 15 - 10, 0, pi2);
        c.strokeStyle = "#fff";
        c.fillStyle = "#fff";
        c.fill();
        c.closePath();
        if(this.showNum > 0) {
            c.beginPath();
            c.moveTo(200, 200);
            c.strokeStyle = "#fff";
            c.fillStyle = "#fff";
            c.arc(200, 200, 300, 0, this.showNum * pi2, false);
            c.fill();
            c.closePath();
        }
    }
}
// 环状图的书写数据
Draw.prototype.annularText = function (canvasId, data, color_arr) {
    var pi2 = Math.PI * 2;
    var canvas = document.getElementById(canvasId);    
    var c = canvas.getContext("2d");
    var agl;
    c.fillStyle = "#000"
    for(var i = 0; i < data.length; i++){ 
        agl = data[i] * pi2;
        var x = (150 - i *　15) * Math.cos(agl) + 200;
        var y = (150 - i *　15) * Math.sin(agl) + 200;
        c.fillStyle = color_arr[i];
        if (agl >= 0 && agl < Math.PI / 4 || agl >= Math.PI / 4 * 7 && agl < Math.PI * 2) {
            c.fillText(parseInt(data[i] * 100) + "%", x - 18, y + 10);
        } else if(agl >= Math.PI / 4 && agl < Math.PI / 4 * 3) {
            c.fillText(parseInt(data[i] * 100) + "%", x - 25, y - 2);
        } else if(agl >= Math.PI / 4 * 3 && agl < Math.PI / 4 * 5) {
            c.fillText(parseInt(data[i] * 100) + "%", x, y - 5);
        } else {
            c.fillText(parseInt(data[i] * 100) + "%", x + 3, y + 7);
        } 
    }
}
// 显示画布
Draw.prototype.showDraw = function(clickNum, canvasId) {
    var _this = this;
    var canvas = document.getElementById(canvasId);  
    var ctx = canvas.getContext('2d');  
    ctx.clearRect(0, 0, 500, 400);
    if (this.timer) {
        return;
    };
    $(this.box).children().eq(clickNum).css({
        "background-color" : "blue"
    })
    $(this.box).children().eq(clickNum).siblings("div").css({
        "background-color" : "lightblue"
    })
    for (var i = 0; i < _this.data.length; i++) {
        var num = i + 1;
        $(_this.box).children().eq(i).html(_this.yData[i - 1]);
    };
    if (this.type == "annular" || this.type == "pie") {
        $(this.box).children().eq(clickNum).html("换色");
    };
    // 颜色
    var color_arr = [];
    for (var i = 0; i < this.data.length; i++) {
        var rColor = Math.floor(Math.random() * 256);
        var gColor = Math.floor(Math.random() * 256);
        var bColor = Math.floor(Math.random() * 256);
        if (rColor == 255 && bColor == 255 & gColor == 255) {
            var rColor = Math.floor(Math.random() * 256);
            var gColor = Math.floor(Math.random() * 256);
            var bColor = Math.floor(Math.random() * 256);
        };
        var color = "rgb(" + rColor + ", " + gColor + ", " + bColor +")";
        color_arr.push(color);
     };
     // 动画
    this.timer = setInterval(function() {
        if (_this.showNum < 0) {
            clearInterval(_this.timer);
            _this.showNum = 1;
            if (_this.type == "pie") {
                _this.drawText("canvas", _this.data[clickNum - 1], color_arr);
            } else if (_this.type == "annular") {
                _this.annularText("canvas", _this.data[clickNum - 1], color_arr);
            }
            _this.timer = null;
         } else {
            _this.showNum -= 0.05;
            if (_this.type == "pie") {
                _this.drawCircle("canvas", _this.data[clickNum - 1], color_arr);
            } else if (_this.type == "annular") {
                _this.drawAnnular("canvas", _this.data[clickNum - 1], color_arr);
            } else if (_this.type == "line") {
                clearInterval(_this.timer);
                _this.timer = null;
                _this.drawLine("canvas", _this.data[clickNum - 1]);
            } else {
                clearInterval(_this.timer);
                _this.timer = null;
                _this.drawDotted("canvas", _this.data[clickNum - 1], color_arr);
            }
        }
    }, 20)
}
// 调用新函数
function C(x, y, da, Id, dataFrom, type) {
    return (new Draw(x, y, da, Id, dataFrom, type));
}
window.C = C;