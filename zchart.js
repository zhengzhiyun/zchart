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
Draw.prototype.getJSON = function() {
    var _this = this;
    $.getJSON(this.dataFrom, function(json){
        for (var j = 0; j < json[0].length; j++) {
            if (json[0][j][_this.x] && json[0][j][_this.y] && json[0][j][_this.da]) {
                _this.xData.push(json[0][j][_this.x]);
            } else {
                console.log("没有正确传递参数");
                return;
            }
        };
        for (var i = 0; i < json.length; i++) {
            var thData = [];
            for (var b = 0; b < json[i].length; b++) {
                thData.push(json[i][b][_this.da]);
                if (b == 0) {
                    _this.yData.push(json[i][0][_this.y]);
                };
            };
            _this.data.push(thData);
        };
        _this.box.innerHTML = "<canvas id='canvas' class='canvas' width='600px' height='400px'></canvas>"
        for (var i = 0; i < _this.data.length; i++) {
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
                "bottom" : - 30,
                "left" : i * 100
            })
        };
        _this.showDraw(1);
        $(_this.box).children("div").on("click", function() {
            _this.showDraw($(this).index());
        });
    });
}
Draw.prototype.showDraw = function(clickNum) {
    var _this = this;
    if (this.timer) {
        return;
    };
    this.clearDraw("canvas");
    
    $(this.box).children().eq(clickNum).css({
        "background-color" : "#39f"
    })
    $(this.box).children().eq(clickNum).siblings("div").css({
        "background-color" : "#3cf"
    })
    for (var i = 0; i < _this.data.length; i++) {
        var num = i + 1;
        $(_this.box).children().eq(i).html(_this.yData[i - 1]);
    };
    if (this.type == "annular" || this.type == "pie") {
        $(this.box).children().eq(clickNum).html("换色");
    };
    
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
// 环状图
Draw.prototype.drawAnnular = function (canvasId, data, color_arr) {
        var pi2 = Math.PI * 2;
        var canvas = document.getElementById(canvasId);    
        var c = canvas.getContext("2d");
        var agl;
        for(var i = 0; i < data.length; i++){ 
            agl = data[i] * pi2;
            c.fillStyle = color_arr[i];
            c.beginPath();
            c.moveTo(200,200);
            c.arc(200, 200, 150 - i *　15, 0, agl, false);
            c.lineTo(200,200);
            c.fill();
            //右侧图信息
            c.fillRect(400, 50 + 18 * i,16,16);
            c.fillStyle = "#000000";
            c.fillText(this.xData[i] + " " + parseInt(data[i] * 100) + "%", 420, 62 + 18 * i);
            c.closePath();
            c.beginPath();
            c.moveTo(200,200);
            c.arc(200, 200, 150 - i * 15 - 10, 0,  pi2);
            c.strokeStyle = "#fff";
            c.fillStyle = "#fff";
            c.fill();
            c.closePath();
            if (this.showNum > 0) {
                c.beginPath();
                c.moveTo(200,200);
                c.strokeStyle = "#fff";
                c.fillStyle = "#fff";
                c.arc(200, 200, 300, 0, this.showNum * pi2, false);
                c.fill();
                c.closePath();
            };

        }
}
// 在圆上写数据 
Draw.prototype.annularText = function (canvasId, data, color_arr) {
        var pi2 = Math.PI * 2;
        var canvas = document.getElementById(canvasId);    
        var c = canvas.getContext("2d");
        var agl;
        c.fillStyle = "#000"
        for(var i = 0; i < data.length; i++){ 
            //饼图
            agl = data[i] * pi2;
            var x = (150 - i *　15) * Math.cos(agl) + 200;
            var y = (150 - i *　15) * Math.sin(agl) + 200;
            c.fillStyle = color_arr[i];
            // c.fillText(data[i] * 100 + "%", x, y - 20);
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
// 饼状图
Draw.prototype.drawCircle = function(canvasId, data, color_arr) {
    var pi2 = Math.PI * 2;
    var canvas = document.getElementById(canvasId);    
    var c = canvas.getContext("2d");
    var startAgl = 0;
    var agl;
    for(var i = 0; i < data.length; i++){ 
        //饼图
        agl = data[i] * pi2 + startAgl;
        c.fillStyle = color_arr[i];
        c.beginPath();
        c.moveTo(200,200);
        c.arc(200, 200, 150, startAgl, agl, false);
        c.lineTo(200,200);
        c.fill();
        //右侧图信息
        c.fillRect(400, 50 + 18 * i,16,16);
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
// 在圆上写数据 
Draw.prototype.drawText = function(canvasId, data, color_arr, xData) {
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
// 坐标轴
Draw.prototype.drawCoordinate = function(canvasId) {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    context.strokeStyle = "#000";
    context.fillStyle = "#000";
    context.moveTo(20, 0);
    context.lineTo(20, 380);
    context.lineTo(600, 380);
    context.moveTo(0, 20);
    context.lineTo(20, 0);
    context.lineTo(40, 20);
    context.moveTo(580, 360);
    context.lineTo(600, 380);
    context.lineTo(580, 400);
    context.moveTo(20, 0);
    context.lineTo(30, 0);
    context.moveTo(20, 400 * 0.8);
    context.lineTo(30, 400 * 0.8);
    context.moveTo(20, 400 * 0.6);
    context.lineTo(30, 400 * 0.6);
    context.moveTo(20, 400 * 0.4);
    context.lineTo(30, 400 * 0.4);
    context.moveTo(20, 400 * 0.2);
    context.lineTo(30, 400 * 0.2);
    context.fillText("0%", 0, 400 * 1 - 10) ;
    context.fillText("20%", 0, 400 * 0.8 + 6) ;
    context.fillText("40%", 0, 400 * 0.6 + 6) ;
    context.fillText("60%", 0, 400 * 0.4 + 6) ;
    context.fillText("80%", 0, 400 * 0.2 + 6) ;
    context.fillText("100%", 0, 400 * 0 + 10) ;
    context.stroke();
} 
// 画直线
Draw.prototype.drawLine = function(canvasId, data) {
    var _this = this;
    this.clearDraw("canvas");
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    var dataNum = [];
    var pWidth = 600;
    var pHeight = 400;
    var maxNum = 1;
    this.drawCoordinate("canvas");
    var dataWidth = pWidth / (data.length + 1);
    for (var i = 0; i < data.length; i++) {
        context.fillRect(500, 50 + 18 * i,16,16);
        context.fillStyle = "#000000";
        context.fillText(this.xData[i] + " " +  parseInt(data[i] * 100) + "%", 520, 62 + 18 * i);
        if (i == 0) {
            context.moveTo(dataWidth, pHeight - data[0] / maxNum * pHeight);
        } else {
            context.lineTo(dataWidth * i, pHeight - data[i] / maxNum * pHeight);

        }
        context.stroke();
    };
    for (var i = 0; i < data.length; i++) {
        if (i == 0) {
            context.moveTo(dataWidth, 400);
            context.fillText(this.xData[i], dataWidth, pHeight - data[0] / maxNum * pHeight);
        } else {
            context.fillText(this.xData[i], dataWidth * i, pHeight - data[i] / maxNum * pHeight);

        }
        context.stroke();
    };
    for (var i = 0; i < data.length; i++) {
        if (i == 0) {
            context.moveTo(dataWidth, 400);
            context.fillText(this.xData[i], dataWidth, pHeight - data[0] / maxNum * pHeight);
        } else {
            context.fillText(this.xData[i], dataWidth * i, pHeight - data[i] / maxNum * pHeight);

        }
        context.stroke();
    };
}
// 清除画布
Draw.prototype.clearDraw = function (canvasId) {
        var pi2 = Math.PI * 2;
        var canvas = document.getElementById(canvasId);    
        var c = canvas.getContext("2d");
        c.beginPath();
        c.arc(200, 200, 1000, 0, this.showNum * pi2);
        c.strokeStyle = "#fff";
        c.fillStyle = "#fff";
        c.fill();
}
// 折线图
Draw.prototype.drawDotted = function (canvasId, data, color_arr) {
    var dotBox = document.getElementById(canvasId);
    this.drawCoordinate("canvas");
    var maxWidth = 600;
    var maxHeight = 400;
    var dWidth = 600 / data.length;
    var aWidth = parseInt(dWidth * 0.8);
    var aMargin = parseInt(dWidth * 0.2);
    for (var i = 0; i < data.length; i++) {
        $(this.box).append("<h4><b></b></h4>");
        $(this.box).children("h4").eq(i).css({
            "width" : 20,
            "height" : 20,
            "border-radius" : "50%",
            "background-color" : color_arr[i],
            "position" : "absolute",
            "left" : aMargin + i * dWidth + 5,
            "bottom" : data[i] * maxHeight -20,
            "cursor" : "pointer"
        })
        if (data[i] * maxHeight -20 > 300) {
            $(this.box).children("h4").eq(i).children().css({
                "display" : "none",
                "width" : 100,
                "height" : 30,
                "position" : "absolute",
                "left" : -30,
                "bottom" : -40,
                "text-align" : "center",
                "line-height" : "30px",
                "border-radius" : "5px",
                "background-color" : color_arr[i],
                "color" : "#fff"
            })
        } else {
            $(this.box).children("h4").eq(i).children().css({
                "display" : "none",
                "width" : 100,
                "height" : 30,
                "position" : "absolute",
                "left" : -30,
                "bottom" : 30,
                "text-align" : "center",
                "line-height" : "30px",
                "border-radius" : "5px",
                "background-color" : color_arr[i],
                "color" : "#fff"
            })
        }
        $(this.box).children("h4").eq(i).children().html(this.xData[i] + ":" + data[i]);
    };
    $(this.box).children("h4").hover(function(){
        $(this).children().css({
            "display" : "block"
        })
    }, function() {
        $(this).children().css({
            "display" : "none"
        })
    })
}
function C(x, y, da, Id, dataFrom, type) {
    return (new Draw(x, y, da, Id, dataFrom, type));
}
window.C = C;