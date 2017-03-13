///// Called when app launch
$(function() {
  $("#LoginBtn").click(onLoginBtn);
  $("#RegisterBtn").click(onRegisterBtn);
  $("#SaveBtnRe").click(onSaveBtnRe);
  $("#UpdateBtnRe").click(onUpdateBtnRe);
  $("#YesBtn_logout").click(onLogoutBtn);
  $("#YesBtn_deleteRe").click(deleteRevenue);
  $("#SaveBtnSp").click(onSaveBtnSp);
  $("#UpdateBtnSp").click(onUpdateBtnSp);
  $("#YesBtn_deleteSp").click(deleteSpending);
  $("#SaveBtnSt").click(onSaveBtnSt);
  $("#UpdateBtnSt").click(onUpdateBtnSt);
  $("#YesBtn_deleteSt").click(deleteStock);
  $("#SaveBtnSc").click(onSaveBtnSc);
  $("#EditBtnSc").click(onEditBtnSc);
  $("#UpdateBtnSc").click(onUpdateBtnSc);
  $("#YesBtn_deleteSc").click(deleteSchedule);
});



var currentMemoID;
var MC = monaca.cloud;

function onRegisterBtn()
{
  var email = $("#reg_email").val();
  var password = $("#reg_password").val();
console.log(MC);
  MC.User.register(email, password)
    .done(function()
    {
      console.log('Registration is success!' + MC.User._oid);
      $.mobile.changePage('#CalendarPage');
    })
    .fail(function(err)
    {
        console.log('FAILED');
      alert('登録に失敗しました!');
      console.error(JSON.stringify(err));
    });
}

function onLoginBtn()
{
  var email = $("#login_email").val();
  var password = $("#login_password").val();
  var MC = monaca.cloud;
  MC.User.login(email, password)
    .done(function()
    {
      console.log('login: '  + MC.User._oid);
      getRevenueList();
      getSpendingList();
      getStockList();
      getScheduleList();
      $.mobile.changePage('#CalendarPage');
    })
    .fail(function(err)
    {
      alert('ログインに失敗しました: ' + err.message +'\n\n※何回やってもうまく出来ない場合は端末を再起動してください。');
      console.error(JSON.stringify(err));
    });
}

function onLogoutBtn()
{
  MC.User.logout()
    .done(function()
    {
      console.log('Logout is success!');
      $.mobile.changePage('#LoginPage2');
    })
    .fail(function(err)
    {
      alert('ログアウトに失敗しました!');
      console.error(JSON.stringify(err));
    });
}

//収入
function onSaveBtnRe()
{
  var year = yy;
  var month = mm;
  var breakdown = $("#breakdown").val();
  var revenue = $("#revenue2").val();
  var a = isNaN(revenue);
  if(breakdown != ''){
    if (revenue != '')
    {
      if (a === false){
        addRevenue(year,month,breakdown,revenue);
      }
      else{
        alert('数値を入力して下さい!');
      }
    }
    else{
      alert('数値を入力して下さい!');
    }
  }else{
    alert('項目を入力して下さい!');
  }
}

function addRevenue(year,month,breakdown,revenue) {
  var memo = monaca.cloud.Collection("Revenue");

  memo.insert({ year: year, month: month, breakdown: breakdown, revenue: revenue})
  .done(function(insertedItem)
  {
    console.log('Insert is success!');
    $("#year").val("");
    $("#month").val("");
    $("#breakdown").val("");
    $("#revenue").val("");

    // 挿入が成功したことを示すダイアログを表示する
    $("#okDialog_addRe").popup("open", {positionTo: "origin"}).click(function(event)
    {
      getRevenueList();
      $.mobile.changePage('#ListPageRe');
    });
  })
  .fail(function(err){
    if (err.code == -32602) {
      alert("コレクション「Revenue」が見つかりません!IDEからコレクションを作成してください。");
    } else {
      console.error(JSON.stringify(err));
      alert('挿入に失敗しました!');
    }
  })
}

function onShowLinkRe(id,breakdown,revenue)
{
  currentMemoID = id;
  $('#breakdown_edit').val(breakdown);
  $('#revenue_edit').val(revenue);
  $.mobile.changePage("#ShowPageRe");
}

function onDeleteBtnRe(id)
{
  currentMemoID = id;
  $( "#yesNoDialog_deleteRe" ).popup("open", {positionTo: "origin"})
}

function deleteRevenue()
{
  console.log('yes');
  var memo = MC.Collection("Revenue");
  memo.findOne(MC.Criteria("_id==?", [currentMemoID]))
    .done(function(item)
    {
      console.log(JSON.stringify(item));
      item.delete()
      .done(function()
       {
          console.log("The Revenue is deleted!");
          getRevenueList();
          $.mobile.changePage("#ListPageRe");
       })
       .fail(function(err){
           console.log("Fail to delete the item.");
       });
      
    })
    .fail(function(err){
      console.error(JSON.stringify(err));
      alert('削除に失敗しました!');
    });
}

function onUpdateBtnRe()
{
  var new_breakdown = $("#breakdown_edit").val();
  var new_revenue = $("#revenue_edit").val();
  var id = currentMemoID;
  var a = isNaN(new_revenue);
  if(new_breakdown != ''){
    if (new_revenue != '')
    {
      if (a === false){
        editRevenue(id, new_breakdown, new_revenue);
      }
      else{
        alert('数値を入力して下さい!');
      }
    }
    else{
      alert('数値を入力して下さい!');
    }
  }else{
    alert('項目を入力して下さい!');
  }
}

function editRevenue(id, new_breakdown, new_revenue){
  var memo = MC.Collection("Revenue");
  memo.findMine(MC.Criteria("_id==?", [id]))
    .done(function(items, totalItems)
    {
      items.items[0].breakdown = new_breakdown;
      items.items[0].revenue = new_revenue;
      items.items[0].update()
        .done(function(updatedItem)
        {
          console.log('Updating is success!');
          //更新が成功したことを示すダイアログを表示する
          $( "#okDialog_editRe" ).popup("open", {positionTo: "origin"}).click(function(event)
          {
            getRevenueList();
            $.mobile.changePage("#ListPageRe");
          });
        })
        .fail(function(err){ console.error(JSON.stringify(err)); });
    })
    .fail(function(err){
      console.error(JSON.stringify(err));
    });
}

function getRevenueList() {
  console.log('Refresh List');
  var MC = monaca.cloud;
  var memo = MC.Collection("Revenue");
  memo.findMine()
    .done(function(items, totalItems)
    {
        console.log("all: " + JSON.stringify(items));
      $("#ListPageRe #TopListViewRe").empty();
      var list = items.items;
      sumRN = 0;
      sumRB = 0;
      for (var i in list)
      {
        var memo = list[i];
        var a=parseInt(memo.revenue);
        if(memo.year==yy && memo.month==mm){
            sumRN = sumRN + a;
        }
        else if((memo.year<=yy && memo.month<mm)||(memo.year<yy && memo.month>=mm)){
            sumRB = sumRB + a;
        }
      }
      Calculation();
      $li = $("<li><h3></h3><p></p></li>");
      $li.find("h3").text("合計金額");
      var textR="　"+(sumRN+sumB)+"円";
      $li.find("p").text(textR);
      document.getElementById('revenue').value = (sumRN+sumB);
      $("#TopListViewRe").prepend($li);
      $li = $("<li><h3></h3><p></p></li>");
      $li.find("h3").text("先月の残高");
      var textB="　"+sumB+"円";
      $li.find("p").text(textB);
      $("#TopListViewRe").prepend($li);
      for (var i in list)
      {
        var memo = list[i];
        if(memo.year==yy && memo.month==mm){
          var kane2="　"+memo.revenue+"円"
          $li = $("<li><a href='javascript:onShowLinkRe(\"" + memo._id + "\",\"" + memo.breakdown + "\",\"" + memo.revenue + "\")' class='show'><h3></h3><p></p></a><a href='javascript:onDeleteBtnRe(\"" + memo._id + "\")' class='delete'>Delete</a></li>");
          $li.find("h3").text(memo.breakdown);
          $li.find("p").text(kane2);
          $("#TopListViewRe").prepend($li);
        }
      }
      $("#ListPageRe #TopListViewRe").listview("refresh");
    })
  .fail(function(err){
    if (err.code == -32602) {
      alert("コレクション「Revenue」が見つかりません!IDEからコレクションを作成してください。");
    } else {
      console.error(JSON.stringify(err));
      alert('失敗しました!');
    }
  });
}

//支出
function onSaveBtnSp()
{
  var year = yy;
  var month = mm;
  var breakdown = $("#breakdownSp").val();
  var spending = $("#spending2").val();
  var a = isNaN(spending);
  if(breakdown != ''){
    if (spending != '')
    {
      if (a === false){
        addSpending(year,month,breakdown,spending);
      }
      else{
        alert('数値を入力して下さい!');
      }
    }
    else{
      alert('数値を入力して下さい!');
    }
  }else{
    alert('項目を入力して下さい!');
  }
}

function addSpending(year,month,breakdown,spending) {
  var memo = monaca.cloud.Collection("Spending");

  memo.insert({ year: year, month: month, breakdown: breakdown, spending: spending})
  .done(function(insertedItem)
  {
    console.log('Insert is success!');
    $("#year").val("");
    $("#month").val("");
    $("#breakdown").val("");
    $("#spending").val("");

    //更新が成功したことを示すダイアログを表示する
    $("#okDialog_addSp").popup("open", {positionTo: "origin"}).click(function(event)
    {
      getSpendingList();
      $.mobile.changePage('#ListPageSp');
    });
  })
  .fail(function(err){
    if (err.code == -32602) {
      alert("コレクション「Spending」が見つかりません!IDEからコレクションを作成してください。");
    } else {
      console.error(JSON.stringify(err));
      alert('挿入に失敗しました!');
    }
  })
}

function onShowLinkSp(id,breakdown,spending)
{
  currentMemoID = id;
  $('#breakdown_editSp').val(breakdown);
  $('#spending_edit').val(spending);
  $.mobile.changePage("#ShowPageSp");
}

function onDeleteBtnSp(id)
{
  currentMemoID = id;
  $( "#yesNoDialog_deleteSp" ).popup("open", {positionTo: "origin"})
}

function deleteSpending()
{
  console.log('yes');
  var memo = MC.Collection("Spending");
  memo.findOne(MC.Criteria("_id==?", [currentMemoID]))
    .done(function(item)
    {
      console.log(JSON.stringify(item));
      item.delete()
      .done(function()
       {
          console.log("The spending is deleted!");
          getSpendingList();
          $.mobile.changePage("#ListPageSp");
       })
       .fail(function(err){
           console.log("Fail to delete the item.");
       });
      
    })
    .fail(function(err){
      console.error(JSON.stringify(err));
      alert('削除に失敗しました!');
    });
}

function onUpdateBtnSp()
{
  var new_breakdown = $("#breakdown_editSp").val();
  var new_spending = $("#spending_edit").val();
  var id = currentMemoID;
  var a = isNaN(new_spending);
  if(new_breakdown != ''){
    if (new_spending != '')
    {
      if (a === false){
        editSpending(id, new_breakdown, new_spending);
      }
      else{
        alert('数値を入力して下さい!');
      }
    }
    else{
      alert('数値を入力して下さい!');
    }
  }else{
    alert('項目を入力して下さい!');
  }
}

function editSpending(id, new_breakdown, new_spending){
  var memo = MC.Collection("Spending");
  memo.findMine(MC.Criteria("_id==?", [id]))
    .done(function(items, totalItems)
    {
      items.items[0].breakdown = new_breakdown;
      items.items[0].spending = new_spending;
      items.items[0].update()
        .done(function(updatedItem)
        {
          console.log('Updating is success!');
          //更新が成功したことを示すダイアログを表示する
          $( "#okDialog_editSp" ).popup("open", {positionTo: "origin"}).click(function(event)
          {
            getSpendingList();
            $.mobile.changePage("#ListPageSp");
          });
        })
        .fail(function(err){ console.error(JSON.stringify(err)); });
    })
    .fail(function(err){
      console.error(JSON.stringify(err));
    });
}

function getSpendingList() {
  console.log('Refresh List');
  var MC = monaca.cloud;
  var memo = MC.Collection("Spending");
  memo.findMine()
    .done(function(items, totalItems)
    {
        console.log("all: " + JSON.stringify(items));
      $("#ListPageSp #TopListViewSp").empty();
      var list = items.items;
      sumSN = 0;
      sumSB = 0;
      for (var i in list)
      {
        var memo = list[i];
        var b=parseInt(memo.spending);
        if(memo.year==yy && memo.month==mm){
            sumSN = sumSN + b;
        }
        else if((memo.year<=yy && memo.month<mm)||(memo.year<yy && memo.month>=mm)){
            sumSB = sumSB + b;
        }
      }
      Calculation();
      $li = $("<li><h3></h3><p></p></li>");
      $li.find("h3").text("合計金額");
      var textS="　"+sumSN+"円";
      $li.find("p").text(textS);
      document.getElementById('spending').value = sumSN;
      $("#TopListViewSp").prepend($li);
      for (var i in list)
      {
        var memo = list[i];
        if(memo.year==yy && memo.month==mm){
          var kane2="　"+memo.spending+"円"
          $li = $("<li><a href='javascript:onShowLinkSp(\"" + memo._id + "\",\"" + memo.breakdown + "\",\"" + memo.spending + "\")' class='show'><h3></h3><p></p></a><a href='javascript:onDeleteBtnSp(\"" + memo._id + "\")' class='delete'>Delete</a></li>");
          $li.find("h3").text(memo.breakdown);
          $li.find("p").text(kane2);
          $("#TopListViewSp").prepend($li);
        }
      }
      $("#ListPageSp #TopListViewSp").listview("refresh");
    })
  .fail(function(err){
    if (err.code == -32602) {
      alert("コレクション「Spending」が見つかりません!IDEからコレクションを作成してください。");
    } else {
      console.error(JSON.stringify(err));
      alert('失敗しました!');
    }
  });
}

//算出
function Calculation()
{
  sumB = sumRB - sumSB;
  sumN = sumRN - sumSN + sumB;
  document.getElementById('balance').value = sumN;
}

//ストック
function onSaveBtnSt()
{
  var product = $("#product").val();
  var number = $("#number").val();
  if (product != '' || number != '')
  {
    addStock(product,number);
  }
}

function addStock(product,number) {
  var memo = MC.Collection("Stock");

  memo.insert({ product: product, number: number})
  .done(function(insertedItem)
  {
    console.log('Insert is success!');
    $("#product").val("");
    $("#number").val("");

    // 挿入が成功したことを示すダイアログを表示する
    $("#okDialog_addSt").popup("open", {positionTo: "origin"}).click(function(event)
    {
      getStockList();
      $.mobile.changePage('#StockManagementPage');
    });
  })
  .fail(function(err){
    if (err.code == -32602) {
      alert("コレクション「Stock」が見つかりません!IDEからコレクションを作成してください。");
    } else {
      console.error(JSON.stringify(err));
      alert('追加に失敗しました!');
    }
  })
}

function onShowLinkSt(id,product,number)
{
  currentMemoID = id;
  $('#product_edit').val(product);
  $('#number_edit').val(number);
  $.mobile.changePage("#EditPageSt");
}

function onDeleteBtnSt(id)
{
  currentMemoID = id;
  $( "#yesNoDialog_deleteSt" ).popup("open", {positionTo: "origin"})
}

function deleteStock()
{
  console.log('yes');
  var memo = MC.Collection("Stock");
  memo.findOne(MC.Criteria("_id==?", [currentMemoID]))
    .done(function(item)
    {
      console.log(JSON.stringify(item));
      item.delete()
      .done(function()
       {
          console.log("The stock is deleted!");
          getStockList();
          $.mobile.changePage("#StockManagementPage");
       })
       .fail(function(err){
           console.log("Fail to delete the item.");
       });
      
    })
    .fail(function(err){
      console.error(JSON.stringify(err));
      alert('削除に失敗しました!');
    });
}

function onUpdateBtnSt()
{
  var new_product = $("#product_edit").val();
  var new_number = $("#number_edit").val();
  var id = currentMemoID;
  if (new_number != '') {
    editStock(id, new_product, new_number);
  }
}

function editStock(id, new_product, new_number){
  var memo = MC.Collection("Stock");
  memo.findMine(MC.Criteria("_id==?", [id]))
    .done(function(items, totalItems)
    {
      items.items[0].product = new_product;
      items.items[0].number = new_number;
      items.items[0].update()
        .done(function(updatedItem)
        {
          console.log('Updating is success!');
          //更新が成功したことを示すダイアログを表示する
          $( "#okDialog_editSt" ).popup("open", {positionTo: "origin"}).click(function(event)
          {
            getStockList();
            $.mobile.changePage("#StockManagementPage");
          });
        })
        .fail(function(err){ console.error(JSON.stringify(err)); });
    })
    .fail(function(err){
      console.error(JSON.stringify(err));
    });
}

function getStockList() {
  console.log('Refresh List');
  var MC = monaca.cloud;
  var memo = MC.Collection("Stock");
  memo.findMine()
    .done(function(items, totalItems)
    {
        console.log("all: " + JSON.stringify(items));
      $("#StockManagementPage #TopListViewSt").empty();
      var list = items.items;

      for (var i in list)
      {
        var memo = list[i];
        var kazu = "　×"+memo.number;
        $li = $("<li><a href='javascript:onShowLinkSt(\"" + memo._id + "\",\"" + memo.product + "\",\"" + memo.number + "\")' class='show'><h3></h3><p></p></a><a href='javascript:onDeleteBtnSt(\"" + memo._id + "\")' class='delete'>Delete</a></li>");
        $li.find("h3").text(memo.product);
        $li.find("p").text(kazu);
        $("#TopListViewSt").prepend($li);
      }
      if (list.length == 0) {
        $li = $("<li>商品が見つかりません</li>");
        $("#TopListViewSt").prepend($li);
      }
      $("#StockManagementPage #TopListViewSt").listview("refresh");
    })
  .fail(function(err){
    if (err.code == -32602) {
      alert("コレクション「Stock」が見つかりません!IDEからコレクションを作成してください。");
    } else {
      console.error(JSON.stringify(err));
      alert('失敗しました!');
    }
  });
}

//スケジュール
function onSaveBtnSc()
{
  var time = $("#time").val();
  var time2 = $("#time2").val();
  var title = $("#title").val();
  var content = $("#content").val();
  var year = yy;
  var month = mm;
  var day = dd;
  if (title != '')
  {
    addSchedule(time,time2,title,content,year,month,day);
  }
}

function addSchedule(time,time2,title,content,year,month,day) {
  var memo = MC.Collection("Schedule");
  var ji = 0;
  var hun = 0;
  if(time<10){
      ji += time;
  }
  else{
      ji = time;
  }
  if(time2<10){
      hun += time2;
  }
  else{
      hun = time2;
  }

  memo.insert({ year: year, month: month, day: day, time: ji, time2: hun, title: title, content: content})
  .done(function(insertedItem)
  {
    console.log('Insert is success!');
    $("#time").val("");
    $("#time2").val("");
    $("#title").val("");
    $("#content").val("");

    // display a dialog stating that the inserting is success
    $("#okDialog_addSc").popup("open", {positionTo: "origin"}).click(function(event)
    {
      getScheduleList();
      $.mobile.changePage('#ListPageSc');
    });
  })
  .fail(function(err){
    if (err.code == -32602) {
      alert("コレクション「Schedule」が見つかりません!IDEからコレクションを作成してください。");
    } else {
      console.error(JSON.stringify(err));
      alert('挿入に失敗しました!');
    }
  })
}

function onShowLinkSc(id,time,time2,title,content,year,month,day)
{
  currentMemoID = id;
  $("#time_show").text(time);
  $("#time2_show").text(time2);
  $("#title_show").text(title);
  $("#content_show").text(content);
  $.mobile.changePage("#ShowPageSc");
}

function onDeleteBtnSc(id)
{
  currentMemoID = id;
  $( "#yesNoDialog_deleteSc" ).popup("open", {positionTo: "origin"})
}

function deleteSchedule()
{
  console.log('yes');
  var memo = MC.Collection("Schedule");
  memo.findOne(MC.Criteria("_id==?", [currentMemoID]))
    .done(function(item)
    {
      console.log(JSON.stringify(item));
      item.delete()
      .done(function()
       {
          console.log("The Schedule is deleted!");
          getScheduleList();
          $.mobile.changePage("#ListPageSc");
       })
       .fail(function(err){
           console.log("Fail to delete the item.");
       });
      
    })
    .fail(function(err){
      console.error(JSON.stringify(err));
      alert('Insert failed!');
    });
}

function onEditBtnSc()
{
  var time = $("#time_show").text();
  var time2 = $("#time2_show").text();
  var title = $("#title_show").text();
  var content = $("#content_show").text();
  $("#time_edit").val(time);
  $("#time2_edit").val(time2);
  $("#title_edit").val(title);
  $("#content_edit").text(content);
  $.mobile.changePage("#EditPageSc");
}

function onUpdateBtnSc()
{
  var new_time = $("#time_edit").val();
  var new_time2 = $("#time2_edit").val();
  var new_title = $("#title_edit").val();
  var new_content = $("#content_edit").val();
  var id = currentMemoID;
  if (new_title != '') {
    editSchedule(id, new_time, new_time2, new_title, new_content);
  }
}

function editSchedule(id, new_time, new_time2, new_title, new_content){
  var memo = MC.Collection("Schedule");
    var new_ji = 0;
    var new_hun = 0;
    if(new_time<10){
      new_ji += new_time;
    }
    else{
      new_ji = new_time;
    }
    if(new_time2<10){
      new_hun += new_time2;
    }
    else{
      new_hun = new_time2;
    }
  memo.findMine(MC.Criteria("_id==?", [id]))
    .done(function(items, totalItems)
    {
      items.items[0].time = new_ji;
      items.items[0].time2 = new_hun;
      items.items[0].title = new_title;
      items.items[0].content = new_content;
      items.items[0].update()
        .done(function(updatedItem)
        {
          console.log('Updating is success!');
          //display a dialog stating that the updating is success
          $( "#okDialog_editSc" ).popup("open", {positionTo: "origin"}).click(function(event)
          {
            getScheduleList();
            $.mobile.changePage("#ListPageSc");
          });
        })
        .fail(function(err){ console.error(JSON.stringify(err)); });
    })
    .fail(function(err){
      console.error(JSON.stringify(err));
    });
}

function getScheduleList() {
  console.log('Refresh List');
  var MC = monaca.cloud;
  var memo = MC.Collection("Schedule");
  memo.findMine()
    .done(function(items, totalItems)
    {
        console.log("all: " + JSON.stringify(items));
      $("#ListPageSc #TopListViewSc").empty();
      var list = items.items;

      for (var i in list)
      {
        var memo = list[i];
        var d = new Date(memo._createdAt);
        var date =  memo.year + "/" + memo.month + "/" + memo.day;
        var ti = memo.time + ':' + memo.time2 + '~';
        $li = $("<li><a href='javascript:onShowLinkSc(\"" + memo._id + "\",\"" + memo.time +  "\",\"" + memo.time2 +  "\",\"" + memo.title + "\",\"" + memo.content + "\",\"" + memo.year + "\",\"" + memo.month + "\",\"" + memo.day + "\")' class='show'><h2></2><h4></h4><p></p></a><a href='javascript:onDeleteBtnSc(\"" + memo._id + "\")' class='delete'>Delete</a></li>");
        $li.find("h2").text(date);
        $li.find("p").text(memo.title);
        $li.find("h4").text(ti);
        $("#TopListViewSc").prepend($li);
      }
       
      if (list.length == 0) {
        $li = $("<li>予定はありません</li>");
        $("#TopListViewSc").prepend($li);
      }
      $("#ListPageSc #TopListViewSc").listview("refresh");
    })
  .fail(function(err){
    if (err.code == -32602) {
      alert("コレクション「Schedule」が見つかりません!IDEからコレクションを作成してください。");
    } else {
      console.error(JSON.stringify(err));
      alert('失敗しました!');
    }
  });
}