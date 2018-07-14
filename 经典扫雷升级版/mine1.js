/**
 * 要实现的功能：
 *    1、点击开始游戏按钮--》生成地图（含雷的标记）；
 *    2 、鼠标左键事件leftClick：
 *            点击的当前位置是雷---》game Over 显示所有雷所在的位置后弹框提示我们游戏结束；
 *            点击当前位置非雷--》周围雷的个数--如果为0便以当前位置为中心向周围扩散直至雷数不为0；（遍历+递归）；
 *             旗帜标记排除当前位置是否有雷；
 *    3、 鼠标右键点击事件rightClick：
 *          点击的当前位置用小旗帜进行标记---（如果已经标记过了再次点击会取消标记）；如果雷所在位置全部被标记中了且上面显示的剩余小旗帜值同时也为0则game Success弹框提示我们排雷成功和花费的时间；
 *    4、点击弹框关闭按钮 退出当前结束的游戏界面
 *    5、点击弹框继续按钮 重新生成绘制地图
 *    6、点击弹框退出游戏按钮关闭页面退出游戏
 */
//游戏入口：gEntry, gLevel, gLevel_input,gLevel_span, gLevel_custom_input;
var colNum = [],rowNum = [],mineNum =[];
var totalNum, remainNum,temp = 0,date, n,isStart = true;
function MineClearance(mJson){
    this.rcmArr = mJson.rcmArr;
    this.gEntry = mJson.gEntry;
    this.gLev_ipt = mJson.gEntry.querySelectorAll(".types .level input");
    this.gLev_span = mJson.gEntry.querySelectorAll(".types .level span");
    this.gLev_csm_ipt = mJson.gEntry.querySelectorAll(".types .item_num input");
    this.btn_start = mJson.btn_start;
    this.mine_area = mJson.mine_area;
    this.mine_map = mJson.mine_area.querySelector(".mine_map");
    this.mine_remain_num = mJson.mine_area.querySelector("h3 .remain_num");
    this.modal_frame = mJson.modal_frame;
    this.modal_tips = mJson.modal_frame.querySelector(".modality_tips");
    this.btn_close = mJson.modal_frame.querySelector(".btn_close");
    this.btn_continue = mJson.modal_frame.querySelector(".btn_continue");
    this.btn_quit = mJson.modal_frame.querySelector(".btn_quit");
    this.entry();
    var This = this;
    //取消地图内部的鼠标右键默认菜单
    this.mine_area.oncontextmenu = function(){
        return false;
    };
    //鼠标点击左键和右键的事件
    this.mine_map.onmousedown = function(e){
        e=e|| window.event;
        var target = e.target;
        this.style.userSelect = "none";
        if(e.button === 0){
            This.leftClick(target);
        }
        if(e.button === 2){
            This.rightClick(target);
        }
    };
    //关闭当前已经结束的游戏
    this.btn_close.onclick = function () {
        this.parentNode.style.display = "none";
        This.mine_area.style.display = "none";
        This.gEntry.classList.remove("playing");
    };
    //继续按钮重新生成地图
    this.btn_continue.onclick = function(){
        This.modal_frame.style.display = "none";
        This.init();
    };
    //结束游戏后直接退出游戏关闭当前页面
    this.btn_quit.onclick = function(){
        window.close();
    }
}
MineClearance.prototype = {
    init : function(){
        this.entry();
        isStart = true;
        this.mine_area.style.display="block";
        if(isStart){
            this.drawMap();
            date = new Date();
        }
        isStart = false;
        this.gEntry.classList.add("playing");
    },
    entry : function () {
        var This = this;
        var gLev_len = this.gLev_ipt.length;
        var gLev_csm_len = this.gLev_csm_ipt.length;
        for(var i= 0;i<gLev_len;i++){
            if(i<gLev_len-1){
                this.gLev_csm_ipt[i].disabled = "disabled";
                rowNum.push(this.rcmArr[i][0]);
                colNum.push(this.rcmArr[i][1]);
                mineNum.push(this.rcmArr[i][2]);
                this.gLev_span[i].innerHTML = mineNum[i]+"个雷（"+rowNum[i]+"*"+colNum[i]+"平铺风格）";
            }
            this.gLev_ipt[i].index = i;
            this.gLev_ipt[i].onchange = function (){
                if(this.checked){
                    temp = this.index ;
                    if(temp < gLev_len-1){
                        for(var j = 0;j<gLev_csm_len;j++){
                            This.gLev_csm_ipt[j].disabled = "disabled";
                            This.gLev_csm_ipt[j].parentNode.classList.remove("item_num_active");
                        }
                    }
                    else{
                        for(var i=0;i<gLev_csm_len;i++){
                            This.gLev_csm_ipt[i].setAttribute("index",i);
                            This.gLev_csm_ipt[i].disabled = "";
                            This.gLev_csm_ipt[i].parentNode.classList.add("item_num_active");
                            This.gLev_csm_ipt[i].onfocus = function(){
                                this.onkeydown = function(e){
                                    e=e||window.event;
                                    var keyCode = e.keyCode;
                                    if((keyCode>=65&&keyCode<=90)|| (keyCode<=192&&keyCode>=186)||(keyCode<=222&&keyCode>=219)||(keyCode==32)){
                                        alert("你的输入不正确，请重新输入！");
                                    }
                                };
                            };
                            This.gLev_csm_ipt[i].onchange = function(e){
                                if(!this.value.match(/^[1-9]\d{0,2}$/g)||(this.value < +this.min || this.value>+this.max)){
                                    this.value = this.min;
                                }
                                switch(this.getAttribute("index")){
                                    case "0" : rowNum[gLev_len-1] = +this.value;break;
                                    case "1" : colNum[gLev_len-1] = +this.value;break;
                                    case "2" : mineNum[gLev_len-1] = +this.value;break;
                                    default :  break;
                                }
                                if(rowNum.length==gLev_len&&colNum.length==gLev_len&&mineNum.length==gLev_len){
                                    This.gLev_span[temp].innerHTML = mineNum[temp]+"个雷（"+rowNum[temp]+"*"+colNum[temp]+"平铺风格）";
                                    return rowNum,colNum,mineNum;
                                }
                            }
                        }
                    }
                }
            };


        }
    },
    drawMap : function () {
        var isMineArr = [];
        this.mine_map.innerHTML = "";
        totalNum = mineNum[temp];
        remainNum = totalNum;
        n=0;
        this.mine_remain_num.innerHTML = totalNum;
        for(var i=0;i<rowNum[temp];i++){
            for(var j =0;j<colNum[temp];j++){
                var aSpan = document.createElement("span");
                aSpan.classList.add(rowNum[temp]<15?"mine_dot54":"mine_dot31");
                aSpan.setAttribute("id","a"+i+"_"+j);
                aSpan.setAttribute("data-flag","1");
                this.mine_map.appendChild(aSpan);
                isMineArr.push({mine:false});
            }
        }
        var mine_dot = this.mine_map.querySelectorAll("span");
        var mine_width = parseFloat(cssStyle(mine_dot[0])["width"]);
        var mine_height = parseFloat(cssStyle(mine_dot[0])["height"]);
        this.mine_map.style.width = (mine_width+1)*colNum[temp] +"px";
        this.mine_map.style.height = (mine_height+1)*rowNum[temp] +"px";
        this.mine_map.parentNode.style.width =(mine_width+1)*colNum[temp]+280+"px";
        if(rowNum[temp]>14)this.mine_map.style.transform = "perspective(0px) rotateX(0deg)";
        while(totalNum){
            var random_index = Math.floor(Math.random()*mine_dot.length);
            if(!isMineArr[random_index].mine){
                isMineArr[random_index].mine = true;
                mine_dot[random_index].classList.add("mine");
                totalNum--;
            }
        }
    },
    leftClick : function(obj){
        var This = this;
        if(n==10&&remainNum==0){
            var newTime = new Date() - date;
            console.log("新的时间："+new Date());
            setTimeout(function(){
                This.modal_frame.style.display = "block";
                This.modal_tips.innerHTML = "恭喜您！你赢了，本次花费时间"+Math.round(newTime/1000)+"秒";
            },800);
            console.log(newTime);
        }
        var isMine = this.mine_map.querySelectorAll(".mine");
        if(obj&&obj.classList.contains("mine")){
            for(var i=0;i<isMine.length;i++){
                isMine[i].classList.add("mineShow");
            }
            setTimeout(function () {
                This.modal_frame.style.display = "block";
                This.modal_tips.innerHTML = "不好意思，你输了，下次走运！";
            },800);
        }else{
            var count = 0;
            if(!obj.classList.contains("flagShow")){
                var pos = obj&&obj.getAttribute("id").split("a")[1].split("_");
                var posX = pos&&+pos[0];
                var posY = pos&&+pos[1];
                for(var j=posX-1;j<=posX+1;j++){
                    for(var k=posY-1;k<=posY+1;k++){
                        var around_dot = document.getElementById("a"+j+"_"+k);
                        if(around_dot&&around_dot.classList.contains("mine")){
                            count++;
                        }
                    }
                }
                obj&&(obj.innerHTML = (count!=0)?count:"");
                obj&&obj.classList.add("num");
                if(count==0){
                    for(j=posX-1;j<=posX+1;j++){
                        for(k=posY-1;k<=posY+1;k++){
                            var nearby_dot = document.getElementById("a"+j+"_"+k);
                            if(nearby_dot&&nearby_dot.length!=0){
                                if(!nearby_dot.classList.contains("check")){
                                    nearby_dot.classList.add("check");
                                    this.leftClick(nearby_dot);
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    rightClick : function(obj){
        var This = this;
        if(!obj.classList.contains("num") ){
            if(obj && +obj.getAttribute("data-flag")){
                obj&&obj.classList.add("flagShow");
                obj.setAttribute("data-flag","0");
                remainNum--;
                if(obj.classList.contains("mine")){
                    n++;
                }
            }else{
                obj&&obj.classList.remove("flagShow");
                obj.setAttribute("data-flag","1");
                remainNum++;
                if(obj.classList.contains("mine")){
                    n--;
                }
            }
            if(obj && obj.classList.contains("mine") && obj.classList.contains("flagShow")){
                var mine_flag = this.mine_map.querySelectorAll(".flagShow");
                var mines = this.mine_map.querySelectorAll(".mine");
                if(mine_flag.length==10&&mines.length==10&&n==10){
                    var newTime = new Date() - date;
                    setTimeout(function(){
                        This.modal_frame.style.display = "block";
                        This.modal_tips.innerHTML = "恭喜您！你赢了，本次花费时间"+Math.round(newTime/1000)+"秒";
                    },800);
                }
                console.log("n得之="+n);
            }}
        this.mine_remain_num.innerHTML = remainNum;
    }
};
!function (){
    var mJson={
        "rcmArr" :[[10,10,10],[15,15,20],[18,30,50]],
        "gEntry" : document.getElementById('game_entry'),
        "mine_area" : document.getElementById('mine_area'),
        "modal_frame" : document.getElementById('modal_frame')
    };
    var btn_start = document.getElementById('btn_start');
    var mineFn = new MineClearance(mJson);
    btn_start.onclick = function () {
        mineFn.init.call(mineFn);
    }
}();
//获取元素样式
function cssStyle(obj){
    return window.getComputedStyle?window.getComputedStyle(obj):obj.currentStyle;
}