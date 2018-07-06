window.onload = function(){
    var oBox_tit = document.getElementById("img-tit"),
        oTit = oBox_tit.getElementsByClassName("tit"),//左侧分类
        oImg = document.getElementById("img-link"),//添加背景图片
        oBox_pic = document.getElementById("img-pic"),//图片的下标
        arrImg = [
            ["images/fresh1.jpg","images/fresh2.jpg","images/fresh3.jpg","images/fresh4.jpg"],
            ["images/aestheticism1.jpg","images/aestheticism2.jpg","images/aestheticism3.jpg","images/aestheticism4.jpg","images/aestheticism5.jpg"],
            ["images/literature1.jpg","images/literature2.jpg","images/literature3.jpg"],
            ["images/simple1.jpg","images/simple2.jpg"]
        ],
        len_tit = oTit.length,strArr=[],num = 0;
    for(var i = 0; i < len_tit; i++){
        strArr[i]=[];
        for(var j = 0; j < arrImg[i].length; j++){
            strArr[i][j] = "<li class='pic'>"+ (j+1) +"</li>";
        }
        strArr[i] = strArr[i].join("");
        oBox_pic.innerHTML = strArr[num];
        oTit[i].index = i;
        oTit[i].flag = false;
        oTit[i].startClass = oTit[i].className;
        oTit[num].className = oTit[num].startClass+" active";
        oImg.style.backgroundImage = "url("+ arrImg[num][0] +")";
        oTit[num].flag = true;
        changeImg(oTit[num]);
        oTit[i].onclick= function(){changeImg(this)};
    }
    function changeImg(This){
        oTit[num].className = oTit[num].startClass;
        num = This.index;
        oTit[num].className = oTit[num].startClass+" active";
        oImg.style.backgroundImage = "url("+ arrImg[num][0] +")";
        oTit[num].flag = true;
        if(oTit[num].flag){
            oBox_pic.innerHTML = strArr[num];
            var oPic = oBox_pic.getElementsByClassName("pic");
            var temp = 0;
            for(var k = 0; k < arrImg[num].length; k++){
                oPic[k].startClass = oPic[k].className;
                oPic[temp].className = oPic[temp].startClass + " active";
                oPic[k].index = k;
                oPic[k].onclick = function(){
                    oPic[temp].className =  oPic[temp].startClass;
                    temp = this.index;
                    oPic[temp].className =oPic[temp].startClass+  " active";
                    oImg.style.backgroundImage = "url("+ arrImg[num][temp] +")";
                };
            }
        }
    }
};

