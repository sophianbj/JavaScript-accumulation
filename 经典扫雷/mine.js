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
var game_theme = document.querySelector(".game_theme");
var btn_start = document.getElementById("btn_start");
var mine_area = document.getElementById("mine_area");
var mine_map = mine_area.querySelector(".mine_map");
var mine_remain_num = mine_area.querySelector("h3 .remain_num");
var modal_frame = document.getElementById("modal_frame");
var modal_tips = modal_frame.querySelector(".modality_tips");
var btn_close = modal_frame.querySelector(".btn_close");
var btn_quit = modal_frame.querySelector(".btn_quit");
var btn_continue = modal_frame.querySelector(".btn_continue");
var colNum = 10;
var rowNum = 10;
var totalNum ;
var remainNum;
var isStart = true;
var date;
var n ;
bind();
function bind(){
    //取消地图内部的鼠标右键默认菜单
    mine_area.oncontextmenu = function(){
        return false;
    };
    //点击开始游戏按钮生成地图
    btn_start.onclick = init;
    //鼠标点击左键和右键的事件
    mine_map.onmousedown = function(e){
        e=e|| window.event;
        this.style.userSelect = "none";
        var target = e.target;
        if(e.button === 0){
            leftClick(target);
        }
        if(e.button === 2){
            rightClick(target);
        }
    };
    //关闭当前已经结束的游戏
    btn_close.onclick = function () {
        this.parentNode.style.display = "none";
        mine_area.style.display = "none";
        btn_start.classList.remove("playing");
        game_theme.classList.remove("playing");
    };
    //继续按钮重新生成地图
    btn_continue.onclick = function(){
        modal_frame.style.display = "none";
        init();
    };
    //结束游戏后直接退出游戏关闭当前页面
    btn_quit.onclick = function(){
        window.close();
    }
}
//生成地图初始化
function init(){
    isStart = true;
    mine_area.style.display="block";
    if(isStart){
        drawMap();
        date = new Date();
    }
    isStart = false;
    btn_start.classList.add("playing");
    game_theme.classList.add("playing");
}
//绘制我们所需的地图
function drawMap(){
    var isMineArr = [];
    mine_map.innerHTML = "";
    totalNum = 10;
    remainNum =10;
    n=0;
    mine_remain_num.innerHTML = totalNum;
    for(var i=0;i<rowNum;i++){
        for(var j =0;j<colNum;j++){
            var aSpan = document.createElement("span");
            aSpan.classList.add("mine_dot");
            aSpan.setAttribute("id","a"+i+"_"+j);
            aSpan.setAttribute("data-flag","1");
            mine_map.appendChild(aSpan);
            isMineArr.push({mine:false});
        }
    }
    var mine_dot = mine_map.querySelectorAll("span");
    while(totalNum){
        var random_index = Math.floor(Math.random()*mine_dot.length);
        if(!isMineArr[random_index].mine){
            isMineArr[random_index].mine = true;
            mine_dot[random_index].classList.add("mine");
            totalNum--;
        }
    }
}
//鼠标左键点击事件
function leftClick(obj){
    if(n==10&&remainNum==0){
        var newTime = new Date() - date;
        console.log("新的时间："+new Date());
        setTimeout(function(){
            modal_frame.style.display = "block";
            modal_tips.innerHTML = "恭喜您！你赢了，本次花费时间"+Math.round(newTime/1000)+"秒";
        },800);
        console.log(newTime);
    }
    var isMine = mine_map.querySelectorAll(".mine");
    if(obj&&obj.classList.contains("mine")){
        for(var i=0;i<isMine.length;i++){
            isMine[i].classList.add("mineShow");
        }
        setTimeout(function () {
            modal_frame.style.display = "block";
            modal_tips.innerHTML = "不好意思，你输了，下次走运！";
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
                                leftClick(nearby_dot);
                            }
                        }
                    }
                }
            }
        }
    }
}
//鼠标右键点击事件
function rightClick(obj){
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
        var mine_flag = mine_map.querySelectorAll(".flagShow");
        var mines = mine_map.querySelectorAll(".mine");
        if(mine_flag.length==10&&mines.length==10&&n==10){
            var newTime = new Date() - date;
            setTimeout(function(){
                modal_frame.style.display = "block";
                modal_tips.innerHTML = "恭喜您！你赢了，本次花费时间"+Math.round(newTime/1000)+"秒";
            },800);
        }
        console.log("n得之="+n);
    }}
    mine_remain_num.innerHTML = remainNum;

}