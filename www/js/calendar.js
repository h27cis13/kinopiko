// This is a JavaScript file
//ページを開いたときの処理
window.onload=function(){
    setCalendar();
};

//カレンダー
//カレンダー生成
function setCalendar(yy,mm){
    var yy,mm;
    //1番最初にページを開いたとき年月を変数yy,mmに付与する
    if(!yy && !mm) {
        yy=new Date().getFullYear();
        mm=new Date().getMonth();
        dd=new Date().getDate();
        mm++;
    }
    var y=new Date().getFullYear();
    var m=new Date().getMonth()+1;
    var d=new Date().getDate();
    var zdate=new Date(yy,mm-1,0);    //前月末
    var tdate=new Date(yy,mm,0);    //当月末
    var day;
    zedd=zdate.getDate();   //前月末日
    zedy=zdate.getDay();    //前月末曜日
    tedd=tdate.getDate();   //当月末日
    tedy=tdate.getDay();    //当月末曜日
    //カレンダーに埋める数字を配列daysに格納する
    var days=[];
    //前月末が土曜日以外
    if(zedy!=6){
        //前月最終日曜日から月末曜日までの日付
        for(var i=zedy;i>=0;i--){
            days[zedy-i]=(zedd-i);
        }
        //当月日付
        for(var i=1;i<=tedd;i++){
            days[zedy+i]=i;
        }
        //当月末が35番目までに終了
        if((zedy+tedd)<=34){
            //翌月日付
            for(var i=1;i<35-zedy-tedd;i++){
                days[zedy+tedd+i]=i;
            }
        //当月末が35番目を超えて終了
        }else if((zedy+tedd)>34){
            //翌月日付
            for(var i=1;i<42-zedy-tedd;i++){
                days[zedy+tedd+i]=i;
            }
        }
    //前月末が土曜日
    }else if(zedy==6){
        //当月日付
        for(var i=1;i<=tedd;i++){
            days[i-1]=i;
        }
        //翌月日付
        for(var i=0;i<35-tedd;i++){
            days[tedd+i]=i+1;
        }
    }
    //カレンダーの描画
    var out='<table border="1" align="center" width="100%" style="font-size: 54px;">';
    out+="<caption>";
    //去年へ移動リンク
    out+="<a href='#' yy='"+yy+"' mm='"+mm+"' onclick='backyy(this);return false;'>\<\<</a> ";
    //前月へ移動リンク
    out+="<a href='#' yy='"+yy+"' mm='"+mm+"' onclick='backmm(this);return false;'>\<</a> ";
    //表示している年と月
    out+=yy+'年'+mm+'月 ';
    //翌月へ移動リンク
    out+="<a href='#' yy='"+yy+"' mm='"+mm+"' onclick='nextmm(this);return false;'>\></a> ";
    //来年へ移動リンク
    out+="<a href='#' yy='"+yy+"' mm='"+mm+"' onclick='nextyy(this);return false;'>\>\></a>";
    out+="</caption>";
    var youbi=["日","月","火","水","木","金","土"];
    out+="<tr>";
    for(var i in youbi){
        if(i==0){
            out+="<td style='color:red' align='center'>"+youbi[i]+"</td>";
        }
        else if(i==6){
            out+="<td style='color:blue' align='center'>"+youbi[i]+"</td>";
        }
        else{
            out+="<td align='center'>"+youbi[i]+"</td>";
        }
    }
    //ここから配列daysの中身を展開していく行数を計算する
    var row=days.length/7;
    //行数分だけ回す
    for(var i=1; i<=row; i++) {
        out+="<tr>";
        //変動に対応できるように回す
        for(var j=7*i-6;j<=7*i;j++){
            //先月
            if(i==1 && days[j-1]>7){
                //振替休日
                if(((j%7)==2)&&((mm-1)==4 && days[j-1]==30)){
                    // あとでいろいろいじれるように属性やイベントを混ぜておく
                    out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:#ff8080' align='right'>"+days[j-1]+"</td>";
                }
                //日曜日と祝日
                else if(((j%7)==1)||((mm-1)==4 && days[j-1]==29)){
                    //属性やイベント
                    out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:#ff8080' align='right'>"+days[j-1]+"</td>";
                }else{
                    //属性やイベント
                    out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:gray' align='right'>"+days[j-1]+"</td>";
                }
            //来月
            }else if(i==row && days[j-1]<23){
                //祝日
                if((((mm-11)==1 && days[j-1]==1)||((mm+1)==5 && (days[j-1]>=3 && days[j-1]<=5))||((mm+1)==11 && days[j-1]==3))){
                    //属性やイベント
                    out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:#ff8080' align='right'>"+days[j-1]+"</td>";
                }
                //土曜日
                else if((j%7)==0){
                    //属性やイベント
                    out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:#8080ff' align='right'>"+days[j-1]+"</td>";
                }else{
                    //属性やイベント
                    out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:gray' align='right'>"+days[j-1]+"</td>";
                }
            //今月
            }else{
                //振替休日
                if(((((j%7)<5) && ((j%7)>1)) && (mm==5 && days[j-1]==6))||((j%7)==2) && ((mm==1 && days[j-1]==2)||(mm==2 && days[j-1]==12)||(mm==4 && days[j-1]==30)||(mm==5 && days[j-1]==6)||(mm==8 && days[j-1]==12)||(mm==11 && (days[j-1]==4||days[j-1]==24))||(mm==12 && days[j-1]==24))){
                    if(yy==y && mm==m && days[j-1]==d){
                        //属性やイベント
                        out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:red' align='right' bgcolor='#8db4e2'>"+days[j-1]+"</td>";
                    }else{
                        //属性やイベント
                        out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:red' align='right'>"+days[j-1]+"</td>";
                    }
                }
                //月曜日の祝日(成人式など)
                else if(((j%7)==2)&&(((days[j-1]>=8 && days[j-1]<=14)&&(mm==1 || mm==10))||((days[j-1]>=15 && days[j-1]<=21)&&(mm==7 || mm==9)))){
                    if(yy==y && mm==m && days[j-1]==d){
                        //属性やイベント
                        out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:red' align='right' bgcolor='#8db4e2'>"+days[j-1]+"</td>";
                    }else{
                        //属性やイベント
                        out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:red' align='right'>"+days[j-1]+"</td>";
                    }
                }
                //日曜日と祝日
                else if(((j%7)==1)||(mm==1 && days[j-1]==1)||(mm==2 && days[j-1]==11)||(mm==4 && days[j-1]==29)||(mm==5 && (days[j-1]>=3 && days[j-1]<=5))||(mm==8 && days[j-1]==11)||(mm==11 && (days[j-1]==3||days[j-1]==23))||(mm==12 && days[j-1]==23)){
                    if(yy==y && mm==m && days[j-1]==d){
                        //属性やイベント
                        out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:red' align='right' bgcolor='#8db4e2'>"+days[j-1]+"</td>";
                    }else{
                        //属性やイベント
                        out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:red' align='right'>"+days[j-1]+"</td>";
                    }
                }
                //土曜日
                else if((j%7)==0){
                    if(yy==y && mm==m && days[j-1]==d){
                        //属性やイベント
                        out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:blue' align='right' bgcolor='#8db4e2'>"+days[j-1]+"</td>";
                    }else{
                        //属性やイベント
                        out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' style='color:blue' align='right'>"+days[j-1]+"</td>";
                    }
                }
                //平日
                else{
                    if(yy==y && mm==m && days[j-1]==d){
                        //属性やイベント
                        out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' align='right' bgcolor='#8db4e2'>"+days[j-1]+"</td>";
                    }else{
                        //属性やイベント
                        out+="<td class='tdlink' row='"+i+"' yy='"+yy+"' mm='"+mm+"' dd='"+days[j-1]+"' onclick='show(this);return false;' align='right'>"+days[j-1]+"</td>";
                    }
                }
            }

        }
        out+="</tr>";
    }
    out+="</table>";
    //最後にhtmlへ渡す
    document.getElementById("result").innerHTML=out;
}
// 前月へ移動（年度をまたぐときはyyを調整する必要がある点に留意）
function backmm(e) {
  var yy = e.getAttribute('yy');
  var mm = e.getAttribute('mm');
  if(yy==2017 && mm==1){
  }
  else{
    if (mm != 1) {
      mm = mm-1;
    } else if (mm == 1) {
      mm = 12;
      yy = yy - 1;
    }
    setCalendar(yy, mm);
  }
}

// 翌月へ移動
function nextmm(e) {
  var yy = e.getAttribute('yy');
  var mm = e.getAttribute('mm');
  if(yy==2101 && mm==12){
  }
  else{
    if (mm != 12) {
      mm = parseInt(mm) + 1; // mm-(-1)でも同じだがparseIntを使ってみた
    } else if (mm == 12) {
      mm = 1;
      yy = parseInt(yy) + 1;
    }
    setCalendar(yy, mm);
  }
}

//去年へ移動
function backyy(e){
    var yy=e.getAttribute('yy');
    var mm=e.getAttribute('mm');
    if(yy==2017){
      yy=2017;
      mm=1;
      setCalendar(yy,mm);
    }
    else{
      yy--;
      setCalendar(yy,mm);
    }
}

//来年へ移動
function nextyy(e){
    var yy=e.getAttribute('yy');
    var mm=e.getAttribute('mm');
    if(yy==2101){
      yy=2101;
      mm=12;
      setCalendar(yy,mm);
    }
    else{
      yy++;
      setCalendar(yy,mm);
    }
}
//日付をクリックしたときに日付を保持させる
function show(e) {
    var row=e.getAttribute('row');
    yy=e.getAttribute('yy');
    mm=e.getAttribute('mm');
     dd=e.getAttribute('dd');
    //クリック対象が1行目かつ前月の日付  
    if(row == 1 && dd>7){
        if (mm!=1){
            mm--;
        }else if(mm==1){
            yy--;
            mm=12;
        }
    }
    //クリック対象が最終行かつ翌月の日付
    if((row==5 || row==6) && dd<7){
        if(mm!=12){
            mm++;
        }else if(mm==12){
            yy++;
            mm=1;
        }
    }
    //ラジオボタンで行き先を決める
    if(document.choice.householdaccount.checked){
        getRevenueList();
        document.location.href = "#HouseholdAccountPage";
        printDayH(yy,mm,dd);
    }  
    else if(document.choice.schedulemanagement.checked){
        document.location.href = "#ListPageSc";
        printDayS(yy,mm,dd);
    }
}

//家計簿
function printDayH(yy,mm,dd){
    //表示している年と月
    out=yy+'年'+mm+'月';
    getRevenueList();
    getSpendingList();
    document.getElementById("printDayH").innerHTML=out;
}

//スケジュール
function printDayS(yy,mm,dd){
    //表示している年と月
    out=yy+'年'+mm+'月'+dd+'日';
    document.getElementById("printDayS").innerHTML=out;
}