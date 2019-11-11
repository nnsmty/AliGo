$(function (){
    // 查看详情
    $(document).on('click','.look',function(){
        var id = $(this).val();
        //1.创建xhr对象
        var xhr = createXhr();
        var url = "/detalis?ID="+id;
        //2.创建请求
        xhr.open('get',url,true);
        //3.设置回调函数
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4 && xhr.status == 200){
                var str = xhr.responseText;
                if ( str == 'error') {
                    alert('Unknown Error！');
                }else {
                    var JsonData = JSON.parse(str);
                    var ID = JsonData["ID"];
                    header_html = '';
                    body_html = '';
                    header_html += '<tr>';
                    choose_html = '<select id="sel"><option value="" style="display: none"></option>';
                    for (var i in JsonData["data"][0]){
                        choose_html += '<option value ="'+JsonData["data"][0][i]+'">'+JsonData["data"][0][i]+'</option>'
                    }
                    choose_html += '</select><span id="sp"></span>';
                    for (var x in JsonData["data"]){
                        if (x != 0){
                            body_html += '<tr>';
                        }
                        for (var y in JsonData["data"][x]) {
                            if (x == 0) {
                                header_html += '<th>'+JsonData["data"][x][y]+'</th>';
                            }else{
                                if (JsonData["data"][0][y] == "imgUrl"){
                                    body_html += '<th>'+JsonData["data"][x][y]+'<img src="'+JsonData["data"][x][y]+'"></th>'
                                }else{
                                    body_html += '<th>'+JsonData["data"][x][y]+'</th>'
                                }
                            }
                        }if (x != 0){
                            body_html += '</tr>';
                        }
                    }
                    header_html += '</tr>';
                    $('#name').html(header_html);
                    $('#data').html(body_html);
                    $('#choose').html(choose_html);
                }
                var downHtml = '';
                downHtml += '<a href="https://www.aliexpress.com/item/'+ID+'.html"><span class="layui-btn layui-btn-danger" id="thisId">'+ID+'</span></a>'
                downHtml += '&nbsp;<button class="layui-btn Download_CSV" value="'+ID+'"><i class="layui-icon"></i>DownLoad CSV File</button>&nbsp;<button class="layui-btn" id="csv"><i class="layui-icon"></i>Save</button>&nbsp;<button class="layui-btn" id="edit"><i class="layui-icon"></i>Edit</button>'
                $('#save').html(downHtml);
            }
        };
        //4.发送请求
        xhr.send(null)
        $('#pg').html('');
    })
    // 删除
    $(document).on('click','.del',function(){
        if (confirm('Are you sure to Delete?')){
            var id = $(this).val();
            //1.创建xhr对象
            var xhr = createXhr();
            var url = '/del?ID='+id;
            //2.创建请求
            xhr.open('get',url,true);
            //3.设置回调函数
            xhr.onreadystatechange = function () {
                if(xhr.readyState == 4 && xhr.status == 200){
                    var str = xhr.responseText;
                    if (str == 'ok') {
                        alert('Delete Succeeded！');
                        window.location.reload()
                    }else {
                        alert('Delete Failed！');
                    }
                }
            };
            //4.发送请求
            xhr.send(null)
        }
    });
    //保存未修改
    $(document).on('click','#csv',function(){
        var ID = $('#thisId').html();
        var set = [];
        $('table th')
        $('table tr').each(function() {
            var row = [];
            $(this).find('th').each(function() {
                if ($(this).find("textarea").length>0){
                    let thisInputVal = $(this).find("textarea").val();
                    row.push(thisInputVal);
                }else{
                    row.push($(this).text());
                }
            });
            set.push(row);
        });
        var str = $.base64.encode(JSON.stringify(set));
        var bs = $.base64.encode(str);
        $.ajax({
            type: "POST",//传输方式
            url: "/save/",//url
            data: {"data":bs,"id":ID},//传输的数据
            success: function (data) {
                if (data == "error") {
                    alert("Save Failed！");
                }else if (data == "have") {
                    alert("We already have its data!")
                }else {
                    alert("Save Succeeded！");
                    window.location.href=('/');
                }
            },
            //防止深度序列化。传递数组元素属性必设置为true！
            traditional: true,
            error: function (data) {
                alert(data);
            }
        });
    });
    // 全选
    $(document).on('click','#all',function(){
        var type = $('#all').is(':checked');
        $('input[type="checkbox"]').prop('checked',type);
    });
    // 全选和取消全选
    $(document).on('click','input[name="a"]',function(){
        var a = $('input[name="a"]:checked').length;
        var b = $('input[name="a"]').length;
        if (a != b){
            $('#all').prop('checked',false);
        }else{
            $('#all').prop('checked',true);
        }
    });
    // 编辑监听
    $(document).on('input propertychange','textarea',function(){
        var cl = $(this).attr('class');
        var aa = $(this)['0']['classList']
        var cla = aa[0];
        var ca = aa[1];
        var che = $('input[name="a"].'+ca).is(':checked');
        var val = $(this).val();
        var type = $('#all').is(':checked');
        var type_list = $('input[type="checkbox"]').is(':checked');
        if (type == true) {
            $('.'+cla).html(val);
            $('.'+cla).val(val);
        }else if(type != true && che != false){
            var a = $('input[name="a"]:checked').length;
            for (var i=0;i<a;i++){
                var obj = $('input[name="a"]:checked')[i];
                $('.'+cla+'.'+obj.value).html(val);
                $('.'+cla+'.'+obj.value).val(val);
            }
        }
    });
    // 编辑
    $(document).on('click','#edit',function(){
        $('#choose').html('');
        var id = $('#thisId').html();
        $.ajax({
            type: "POST",//传输方式
            url: "/edit/",//url
            data: {"id":id},//传输的数据
            success: function (data) {
                var set = data['data']
                for (var i in set) {
                    header_html = '<button class="layui-btn checked-csv"><i class="layui-icon"></i>Download Checked CSV</button><br><button class="layui-btn layui-btn-danger checked-wish-csv"><i class="layui-icon"></i>Download Checked Wish CSV</button><br><input type="checkbox" id="all" >Select All';
                    var list = $("#name tr th").html();
                    body_html = '';
                    header_html += '<tr>';
                    for (var x in set){
                        if (x != 0){
                            body_html += '<input type="checkbox" name="a" value="'+x+'" class="'+x+'">'
                            body_html += '<tr>';
                        }
                        for (var y in set[x]) {
                            if (x == 0) {
                                header_html += '<th>'+set[x][y]+'</th>';
                            }else{
                                if (set[0][y] == 'imgUrl'){
                                    body_html += '<th style="padding:0;"><textarea style="width:100px;height:150px;padding:0;overflow:hidden;" class="x'+y+' '+x+'" value="'+set[x][y]+'">'+set[x][y]+'</textarea><img src="'+set[x][y]+'"></th>'
                                }else if (set[0][y] == 'Original(US $)'){
                                    body_html += '<th style="padding:0;">'+set[x][y]+'</th>'
                                }else{
                                    body_html += '<th style="padding:0;"><textarea style="width:100px;height:150px;padding:0;overflow:hidden;" class="x'+y+' '+x+'" value="'+set[x][y]+'">'+set[x][y]+'</textarea></th>'
                                }
                            }
                        }if (x != 0){
                            body_html += '</tr>';
                        }
                    }
                    header_html += '</tr>';
                    $('#name').html(header_html);
                    $('#data').html(body_html);
                }
            },
            //防止深度序列化。传递数组元素属性必设置为true！
            traditional: true,
            error: function (data) {
                alert(data);
            }
        });
    });
    // 查找
    $(document).on('click','#search',function(){
        var num = $('#num').val();
        if (num == '' ) {
            alert('Please Enter ID！');
        }else {
            //1.创建xhr对象
            var xhr = createXhr();
            var url = "/find_sql?ID="+num;
            //2.创建请求
            xhr.open('get',url,true);
            //3.设置回调函数
            xhr.onreadystatechange = function () {
                if(xhr.readyState == 4 && xhr.status == 200){
                    var str = xhr.responseText;
                    if (str == 'error') {
                        alert('Nothingness！');
                    }else {
                        var JsonData = JSON.parse(str);
                        $('#name').html('<tr><th>ID</th><th>title</th><th>操作</th></tr>');
                        $('#data').html('<tr><th>'+JsonData["ID"]+'</th><th>'+JsonData["title"]+'</th><th><button class="look" value="'+JsonData["ID"]+'">查看</button><button class="del" value="'+JsonData["ID"]+'">删除</button></th></tr>');
                        $('#pg').html('');
                        $('#save').html('<button class="layui-btn"  id="create"><i class="layui-icon"></i>Add</button>');
                    }
                }

            };
            //4.发送请求
            xhr.send(null)
        };
    });
    // 添加
    $(document).on('click','#create',function(){
        window.open('/create/');
    })
    $(document).on('click','#Con',function(){
        if (confirm('Are you sure to modify?')){
            var sel3 = $('#sel3').val();
            var sel2 = $('#sel2').val();
            var id = $('#thisId').html();
            var inp = $('#Ma').val();
            $.ajax({
                type: "POST",//传输方式
                url: "/save2/",//url
                data: {"sel2": sel2,"sel3":sel3,"in":inp,"id":id},//传输的数据
                success: function (data) {
                    if (data == 'error') {
                        alert('Unknown Error！');
                    }else {
                        var ID = data["ID"];
                        header_html = '';
                        body_html = '';
                        header_html += '<tr>';
                        choose_html = '<select id="sel"><option value="" style="display: none"></option>';
                        for (var i in data["data"][0]){
                            choose_html += '<option value ="'+data["data"][0][i]+'">'+data["data"][0][i]+'</option>'
                        }
                        choose_html += '</select><span id="sp"></span>';
                        for (var x in data["data"]){
                            if (x != 0){
                                body_html += '<tr>';
                            }
                            for (var y in data["data"][x]) {
                                if (x == 0) {
                                    header_html += '<th>'+data["data"][x][y]+'</th>';
                                }else{
                                    body_html += '<th>'+data["data"][x][y]+'</th>'
                                }
                            }if (x != 0){
                                body_html += '</tr>';
                            }
                        }
                        header_html += '</tr>';
                        $('#name').html(header_html);
                        $('#data').html(body_html);
                        $('#choose').html(choose_html);
                    }
                },
                //防止深度序列化。传递数组元素属性必设置为true！
                traditional: true,
                error: function (data) {
                    alert(data);
                }
            });
        }
    })
    // 编辑选择框
    $(document).on('change','#sel3',function(){
        $('#in2').html('<input type="text" style="width:300px;" id="Ma"><button id="Con">Confirm revision</button>')
    })
    $(document).on('change','#sel2',function(){
        var sel = $('#sel2').val();
        var id = $('#thisId').html();
        var html = '';
        var set = [];
        $('#name tr th').each(function() {
            var thisInputVal = $(this).html();
            set.push(thisInputVal);
        })
        $.ajax({
            type: "POST",//传输方式
            url: "/sel2/",//url
            data: {"ids": sel,"id":id},//传输的数据
            success: function (data) {
                for (var i in data['list']){
                    html += '<tr>'
                    for (var x in data['list'][i]){
                        console.log(set[x])
                        if (set[x] == 'imgUrl'){
                            html += '<th>'+data['list'][i][x]+'<img src="'+data['list'][i][x]+'"></th>';
                        }else{
                            html += '<th>'+data['list'][i][x]+'</th>';
                        }
//                        html += '<th>'+data['list'][i][x]+'</th>';
                    }
                    html += '</tr>'
                }
                $('#abc').html('');
                $('#data').html(html);
            },
            //防止深度序列化。传递数组元素属性必设置为true！
            traditional: true,
            error: function (data) {
                alert(data);
            }
        });
        html1 = '<select id="sel3"><option value="" style="display: none"></option>'
        $('#name tr th').each(function() {
            html1 += '<option value ="'+$(this).html()+'">'+$(this).html()+'</option>'
        });
        html1 += '</select><span id="in2"><span>'
        $('#inp').html(html1)
    });
    $(document).on('change','#sel',function(){
        var sel = $('#sel').val();
        var id = $('#thisId').html();
        $.ajax({
            type: "POST",//传输方式
            url: "/sel/",//url
            data: {"ids": sel,"id":id},//传输的数据
            success: function (data) {
                 html = '<select id="sel2"> <option value="" style="display: none"></option>'
                for (var i in data['list']){
                    html += '<option value ="'+data['list'][i]+'">'+data['list'][i]+'</option>'
                }
                html += '</select><span id="inp"></span>'
                $('#sp').html(html);
            },
            //防止深度序列化。传递数组元素属性必设置为true！
            traditional: true,
            error: function (data) {
                alert(data);
            }
        });
    })
    // 启动爬虫
    $(document).on('click','#button',function(){
        var url = $('#ID').val();
        //1.创建xhr对象
        var xhr = createXhr();
        var url = '/find?URL='+url;
        //2.创建请求
        xhr.open('get',url,true);
        //3.设置回调函数
        xhr.onreadystatechange = function () {
            if(xhr.readyState == 4 && xhr.status == 200){
                var str = xhr.responseText;
                if ( str == 'error') {
                    alert('Unknown error!');
                }else if ( str == 'IDerror') {
                    alert('Incorrect input！')
                }else {
                    var JsonData = JSON.parse(str);
                    var ID = JsonData["ID"];
                    header_html = '';
                    body_html = '';
                    header_html += '<tr>';
//                    choose_html = '<select id="sel"><option value="" style="display: none"></option>';
//                    for (var i in JsonData["data"][0]){
//                        choose_html += '<option value ="'+JsonData["data"][0][i]+'">'+JsonData["data"][0][i]+'</option>'
//                    }
//                    choose_html += '</select><span id="sp"></span>';
                    for (var x in JsonData["data"]){
                        if (x != 0){
                            body_html += '<tr>';
                        }
                        for (var y in JsonData["data"][x]) {
                            if (x == 0) {
                                header_html += '<th>'+JsonData["data"][x][y]+'</th>';
                            }else{
                                if (JsonData["data"][0][y] == 'imgUrl'){
                                    body_html += '<th>'+JsonData["data"][x][y]+'<img src="'+JsonData["data"][x][y]+'"></th>'
                                }else{
                                    body_html += '<th>'+JsonData["data"][x][y]+'</th>'
                                }
                            }
                        }if (x != 0){
                            body_html += '</tr>';
                        }

                    }
                    header_html += '</tr>';
                    $('#name').html(header_html);
                    $('#data').html(body_html);
//                    $('#choose').html(choose_html);
                    var downHtml = '';
                    downHtml += '<span class="layui-btn layui-btn-danger" id="thisId">'+ID+'</span>'
                    downHtml += '&nbsp;&nbsp;<a href="/static/download/csv/'+ID+'.csv"><button class="layui-btn"><i class="layui-icon"></i>DownLoad CSV File</button></a>&nbsp;&nbsp;<button class="layui-btn" id="csv"><i class="layui-icon"></i>Save</button>'
                    $('#down').html(downHtml);
                }

            }
        };
        //4.发送请求
        xhr.send(null)
    });
    // 已修改和未修改的数据展示
    $(document).on('change','#type',function(){
        var type = $('#type').val();
        if (type == 'all') {
            location.reload()
        }else{

            $('input[id="CSV_ALL"]').prop('checked',false);
            $.ajax({
                type: "POST",//传输方式
                url: "/type/",//url
                data: {"type": type},//传输的数据
                success: function (data) {
                    console.log(data['data']);
                    html = ''
                    for (var i in data['data']){
                        console.log(i)
                        html += '<tr><th><input type="checkbox" value="'+data['data'][i][0]+'" class="download_csv"></th>'
                        html += '<th><a href="https://www.aliexpress.com/item/'+data['data'][i][0]+'.html">'+data['data'][i][0]+'</a></th>'
                        html += '<th>'+data['data'][i][1]+'<a class="change_img" name="'+ data['data'][i][0] +'"><img id="'+ data['data'][i][0] +'" src="'+data['data'][i][2]+'"></a><input class="upshow_img" name="'+ data['data'][i][0] +'" style="float:right;display:none;" type="file" accept="image/gif, image/jpg, image/png"></th>'
                        html += '<th>'+data['data'][i][3]+'</th>'
                        html += '<th>'
                        html += '<button class="layui-btn JsonData" value="'+ data['data'][i][0] +'">JsonData</button>&nbsp;'
                        html += '<button class="layui-btn layui-btn-danger look" value="'+ data['data'][i][0] +'">Details</button>&nbsp;'
                        html += '<button class="layui-btn del" value="'+ data['data'][i][0] +'">Delete</button>&nbsp;'
                        html += '<button class="layui-btn layui-btn-danger Download_CSV" value="'+ data['data'][i][0] +'">Download CSV</button>&nbsp;'
                        html += '<button class="layui-btn en" value="'+ data['data'][i][0] +'">Download Checked CSV</button>&nbsp;'
                        html += '<button class="layui-btn layui-btn-danger wish" value="'+ data['data'][i][0] +'">Download Wish CSV</button>'
                        html += '</th></tr>'
                    }
                    $('#data').html(html)
                    html = '&nbsp;&nbsp;&nbsp;&nbsp;<button class="layui-btn" id="type_up" style="background-image: linear-gradient(#fbb2d0, #e779aa)"><strong style="font-size:15px;">Previous</strong></button>&nbsp;&nbsp;'
                    html += '<span>'
                    html += '<strong style="font-size:15px;">Page</strong>&nbsp;&nbsp;'
                    html += '<strong style="font-size:15px;" id="index">1</strong>&nbsp;&nbsp;'
                    html += '<strong style="font-size:15px;">of</strong>&nbsp;&nbsp;'
                    html += '<strong style="font-size:15px;">'+data['page']+'</strong>'
                    html += '</span>&nbsp;&nbsp;&nbsp;'
                    html += '<button class="layui-btn" id="type_next" style="background-image: linear-gradient(#fbb2d0, #e779aa)"><strong style="font-size:15px;">Next</strong></button>&nbsp;'
                    html += '<strong style="font-size:15px;">'
                    html += 'Total&nbsp;'
                    html += '<span id="all">'+data['page']+'</span>'
                    html += '&nbsp;Pages&nbsp;&nbsp;&nbsp;&nbsp;'
                    html += '</strong>'
                    html += '<strong style="font-size:15px;">&nbsp;Go to Page</strong>&nbsp;'
                    html += '<input type="text" id="type_pag" style="width:30px;">&nbsp;<button style="background-image: linear-gradient(#fbb2d0, #e779aa);border-color: #fbb2d0;color:#fff;font-size: 12px;height: 20px;line-height: 10px;padding: 0 5px;" id="type_go">GO</button>&nbsp;&nbsp;&nbsp;&nbsp;'
                    html += '&nbsp;<strong style=" font-size:15px;">There are '+data['len']+' pieces of data</strong>'
                    $('#pg').html(html)
                },
                //防止深度序列化。传递数组元素属性必设置为true！
                traditional: true,
                error: function (data) {
                    alert(data);
                }
            });
        }
    });
    // type分页
    $(document).on('click','#type_up',function(){
        console.log('aaaaaaa');
        $('input[id="CSV_ALL"]').prop('checked',false);
        var index = $('#index').html();
        if ( index == 1 ) {
            alert('This is the first page！')
        }else{
            var type = $('#type').val();
            page = index - 1;
            $.ajax({
                type: "POST",//传输方式
                url: "/type/",//url
                data: {"type": type,"page":page},//传输的数据
                success: function (data) {
                    console.log(data['data']);
                    html = ''
                    for (var i in data['data']){
                        html += '<tr><th><input type="checkbox" value="'+data['data'][i][0]+'" class="download_csv"></th>'
                        html += '<th><a href="https://www.aliexpress.com/item/'+data['data'][i][0]+'.html">'+data['data'][i][0]+'</a></th>'
                        html += '<th>'+data['data'][i][1]+'<img src="'+data['data'][i][2]+'"></th>'
                        html += '<th>'+data['data'][i][3]+'</th>'
                        html += '<th>'
                        html += '<button class="layui-btn JsonData" value="'+ data['data'][i][0] +'">JsonData</button>&nbsp;'
                        html += '<button class="layui-btn layui-btn-danger look" value="'+ data['data'][i][0] +'">Details</button>&nbsp;'
                        html += '<button class="layui-btn del" value="'+ data['data'][i][0] +'">Delete</button>&nbsp;'
                        html += '<button class="layui-btn layui-btn-danger Download_CSV" value="'+ data['data'][i][0] +'">Download CSV</button>&nbsp;'
                        html += '<button class="layui-btn en" value="'+ data['data'][i][0] +'">Download Checked CSV</button>&nbsp;'
                        html += '<button class="layui-btn layui-btn-danger wish" value="'+ data['data'][i][0] +'">Download Wish CSV</button>'
                        html += '</th></tr>'
                    }
                    $('#data').html(html)
                    html = '&nbsp;&nbsp;&nbsp;&nbsp;<button class="layui-btn" id="type_up" style="background-image: linear-gradient(#fbb2d0, #e779aa)"><strong style="font-size:15px;">Previous</strong></button>&nbsp;&nbsp;'
                    html += '<span>'
                    html += '<strong style="font-size:15px;">Page</strong>&nbsp;&nbsp;'
                    html += '<strong style="font-size:15px;" id="index">'+(Number(index)-1)+'</strong>&nbsp;&nbsp;'
                    html += '<strong style="font-size:15px;">of</strong>&nbsp;&nbsp;'
                    html += '<strong style="font-size:15px;">'+data['page']+'</strong>'
                    html += '</span>&nbsp;&nbsp;&nbsp;'
                    html += '<button class="layui-btn" id="type_next" style="background-image: linear-gradient(#fbb2d0, #e779aa)"><strong style="font-size:15px;">Next</strong></button>&nbsp;'
                    html += '<strong style="font-size:15px;">'
                    html += 'Total&nbsp;'
                    html += '<span id="all">'+data['page']+'</span>'
                    html += '&nbsp;Pages&nbsp;&nbsp;&nbsp;&nbsp;'
                    html += '</strong>'
                    html += '<strong style="font-size:15px;">&nbsp;Go to Page</strong>&nbsp;'
                    html += '<input type="text" id="type_pag" style="width:30px;">&nbsp;<button style="background-image: linear-gradient(#fbb2d0, #e779aa);border-color: #fbb2d0;color:#fff;font-size: 12px;height: 20px;line-height: 10px;padding: 0 5px;" id="type_go">GO</button>&nbsp;&nbsp;&nbsp;&nbsp;'
                    html += '&nbsp;<strong style=" font-size:15px;">There are '+data['len']+' pieces of data</strong>'
                    $('#pg').html(html)
                },
                //防止深度序列化。传递数组元素属性必设置为true！
                traditional: true,
                error: function (data) {
                    alert(data);
                }
            });
        }
    })
    $(document).on('click','#type_next',function(){
        $('input[id="CSV_ALL"]').prop('checked',false);
        var index = $('#index').html();
        var all = $('#all').html();
        if ( index == all ) {
            alert('This is the last page！')
        }else{
            var type = $('#type').val();
            page = Number(index) + 1;
            $.ajax({
                type: "POST",//传输方式
                url: "/type/",//url
                data: {"type": type,"page":page},//传输的数据
                success: function (data) {
                    console.log(data['data']);
                    html = ''
                    for (var i in data['data']){
                        html += '<tr><th><input type="checkbox" value="'+data['data'][i][0]+'" class="download_csv"></th>'
                        html += '<th><a href="https://www.aliexpress.com/item/'+data['data'][i][0]+'.html">'+data['data'][i][0]+'</a></th>'
                        html += '<th>'+data['data'][i][1]+'<img src="'+data['data'][i][2]+'"></th>'
                        html += '<th>'+data['data'][i][3]+'</th>'
                        html += '<th>'
                        html += '<button class="layui-btn JsonData" value="'+ data['data'][i][0] +'">JsonData</button>&nbsp;'
                        html += '<button class="layui-btn layui-btn-danger look" value="'+ data['data'][i][0] +'">Details</button>&nbsp;'
                        html += '<button class="layui-btn del" value="'+ data['data'][i][0] +'">Delete</button>&nbsp;'
                        html += '<button class="layui-btn layui-btn-danger Download_CSV" value="'+ data['data'][i][0] +'">Download CSV</button>&nbsp;'
                        html += '<button class="layui-btn en" value="'+ data['data'][i][0] +'">Download Checked CSV</button>&nbsp;'
                        html += '<button class="layui-btn layui-btn-danger wish" value="'+ data['data'][i][0] +'">Download Wish CSV</button>'
                        html += '</th></tr>'
                    }
                    $('#data').html(html)
                    html = '&nbsp;&nbsp;&nbsp;&nbsp;<button class="layui-btn" id="type_up" style="background-image: linear-gradient(#fbb2d0, #e779aa)"><strong style="font-size:15px;">Previous</strong></button>&nbsp;&nbsp;'
                    html += '<span>'
                    html += '<strong style="font-size:15px;">Page</strong>&nbsp;&nbsp;'
                    html += '<strong style="font-size:15px;" id="index">'+(Number(index)+1)+'</strong>&nbsp;&nbsp;'
                    html += '<strong style="font-size:15px;">of</strong>&nbsp;&nbsp;'
                    html += '<strong style="font-size:15px;">'+data['page']+'</strong>'
                    html += '</span>&nbsp;&nbsp;&nbsp;'
                    html += '<button class="layui-btn" id="type_next" style="background-image: linear-gradient(#fbb2d0, #e779aa)"><strong style="font-size:15px;">Next</strong></button>&nbsp;'
                    html += '<strong style="font-size:15px;">'
                    html += 'Total&nbsp;'
                    html += '<span id="all">'+data['page']+'</span>'
                    html += '&nbsp;Pages&nbsp;&nbsp;&nbsp;&nbsp;'
                    html += '</strong>'
                    html += '<strong style="font-size:15px;">&nbsp;Go to Page</strong>&nbsp;'
                    html += '<input type="text" id="type_pag" style="width:30px;">&nbsp;<button style="background-image: linear-gradient(#fbb2d0, #e779aa);border-color: #fbb2d0;color:#fff;font-size: 12px;height: 20px;line-height: 10px;padding: 0 5px;" id="type_go">GO</button>&nbsp;&nbsp;&nbsp;&nbsp;'
                    html += '&nbsp;<strong style=" font-size:15px;">There are '+data['len']+' pieces of data</strong>'
                    $('#pg').html(html)
                },
                //防止深度序列化。传递数组元素属性必设置为true！
                traditional: true,
                error: function (data) {
                    alert(data);
                }
            });
        }
    })
    $(document).on('click','#type_go',function(){
        $('input[id="CSV_ALL"]').prop('checked',false);
        var all = $('#all').html();
        var pag = $('#type_pag').val();
        if ($.isNumeric(pag) == false) {
            alert('Please enter the correct number of pages!');
        }else if (pag > all ) {
            alert('Out of range!')
        }else if (pag < 1) {
            alert('Out of range!');
        }else{
            var type = $('#type').val();
            $.ajax({
                type: "POST",//传输方式
                url: "/type/",//url
                data: {"type": type,"page":pag},//传输的数据
                success: function (data) {
                    console.log(data['data']);
                    html = ''
                    for (var i in data['data']){
                        html += '<tr><th><input type="checkbox" value="'+data['data'][i][0]+'" class="download_csv"></th>'
                        html += '<th><a href="https://www.aliexpress.com/item/'+data['data'][i][0]+'.html">'+data['data'][i][0]+'</a></th>'
                        html += '<th>'+data['data'][i][1]+'<img src="'+data['data'][i][2]+'"></th>'
                        html += '<th>'+data['data'][i][3]+'</th>'
                        html += '<th>'
                        html += '<button class="layui-btn JsonData" value="'+ data['data'][i][0] +'">JsonData</button>&nbsp;'
                        html += '<button class="layui-btn layui-btn-danger look" value="'+ data['data'][i][0] +'">Details</button>&nbsp;'
                        html += '<button class="layui-btn del" value="'+ data['data'][i][0] +'">Delete</button>&nbsp;'
                        html += '<button class="layui-btn layui-btn-danger Download_CSV" value="'+ data['data'][i][0] +'">Download CSV</button>&nbsp;'
                        html += '<button class="layui-btn en" value="'+ data['data'][i][0] +'">Download Checked CSV</button>&nbsp;'
                        html += '<button class="layui-btn layui-btn-danger wish" value="'+ data['data'][i][0] +'">Download Wish CSV</button>'
                        html += '</th></tr>'
                    }
                    $('#data').html(html)
                    html = '&nbsp;&nbsp;&nbsp;&nbsp;<button class="layui-btn" id="type_up" style="background-image: linear-gradient(#fbb2d0, #e779aa)"><strong style="font-size:15px;">Previous</strong></button>&nbsp;&nbsp;'
                    html += '<span>'
                    html += '<strong style="font-size:15px;">Page</strong>&nbsp;&nbsp;'
                    html += '<strong style="font-size:15px;" id="index">'+(Number(index)+1)+'</strong>&nbsp;&nbsp;'
                    html += '<strong style="font-size:15px;">of</strong>&nbsp;&nbsp;'
                    html += '<strong style="font-size:15px;">'+data['page']+'</strong>'
                    html += '</span>&nbsp;&nbsp;&nbsp;'
                    html += '<button class="layui-btn" id="type_next" style="background-image: linear-gradient(#fbb2d0, #e779aa)"><strong style="font-size:15px;">Next</strong></button>&nbsp;'
                    html += '<strong style="font-size:15px;">'
                    html += 'Total&nbsp;'
                    html += '<span id="all">'+data['page']+'</span>'
                    html += '&nbsp;Pages&nbsp;&nbsp;&nbsp;&nbsp;'
                    html += '</strong>'
                    html += '<strong style="font-size:15px;">&nbsp;Go to Page</strong>&nbsp;'
                    html += '<input type="text" id="type_pag" style="width:30px;">&nbsp;<button style="background-image: linear-gradient(#fbb2d0, #e779aa);border-color: #fbb2d0;color:#fff;font-size: 12px;height: 20px;line-height: 10px;padding: 0 5px;" id="type_go">GO</button>&nbsp;&nbsp;&nbsp;&nbsp;'
                    html += '&nbsp;<strong style=" font-size:15px;">There are '+data['len']+' pieces of data</strong>'
                    $('#pg').html(html)
                },
                //防止深度序列化。传递数组元素属性必设置为true！
                traditional: true,
                error: function (data) {
                    alert(data);
                }
            });
        }
    })
    // Json数据
    $(document).on('click','.JsonData',function(){
        var id = $(this).val();
        $.ajax({
            type: "POST",//传输方式
            url: "/Json/",//url
            data: {"id":id},//传输的数据
            success: function (data) {
                window.open('/static/download/Json/'+id+'.json')
            },
            //防止深度序列化。传递数组元素属性必设置为true！
            traditional: true,
            error: function (data) {
                alert(data);
            }
        })
    })
    // 首页下载CSV按钮
    $(document).on('click','.Download_CSV',function(){
        var id = $(this).val()
        $.ajax({
            type: "POST",//传输方式
            url: "/download_csv/",//url
            data: {"id":id},//传输的数据
            success: function (data) {
                if(data == 'ok'){
                    window.open('/static/download/csv/'+ id +'.csv')
                }else {
                    alert('Unknow Error')
                }
            },
            //防止深度序列化。传递数组元素属性必设置为true！
            traditional: true,
            error: function (data) {
                alert(data);
            }
        });
    });
    // 全选和取消
    $(document).on('click','#CSV_ALL',function(){
        var type = $('#CSV_ALL').is(':checked');
        $('input[class="download_csv"]').prop('checked',type);
    });
    $(document).on('click','input[class="download_csv"]',function(){
        var a = $('input[class="download_csv"]:checked').length;
        var b = $('input[class="download_csv"]').length;
        if (a != b){
            $('#CSV_ALL').prop('checked',false);
        }else{
            $('#CSV_ALL').prop('checked',true);
        }
    });
    // 批量下载
    $(document).on('click','#ALL_CSV',function(){
        $('input[class="download_csv"]:checked').each(function() {
            var id = $(this).val();
            $.ajax({
                type: "POST",//传输方式
                url: "/download_csv/",//url
                data: {"id":id},//传输的数据
                success: function (data) {
                    if(data == 'ok'){
                        window.open('/static/download/csv/'+ id +'.csv')
                    }else {
                        alert(id+'Download Failed')
                    }
                },
                //防止深度序列化。传递数组元素属性必设置为true！
                traditional: true,
                error: function (data) {
                    alert(data);
                }
            });
        })
    })
    // 选择下载csv
    $(document).on('click','.en',function(){
        $('#choose').html('');
        var ID = $(this).val();
        $.ajax({
            type: "POST",//传输方式
            url: "/edit/",//url
            data: {"id":ID},//传输的数据
            success: function (data) {
                var set = data['data']
                for (var i in set) {
                    header_html = '<button class="layui-btn checked-csv"><i class="layui-icon"></i>Download Checked CSV</button><br><button class="layui-btn layui-btn-danger checked-wish-csv"><i class="layui-icon"></i>Download Checked Wish CSV</button><br><input type="checkbox" id="all" >Select All';
                    var list = $("#name tr th").html();
                    body_html = '';
                    header_html += '<tr>';
                    for (var x in set){
                        if (x != 0){
                            body_html += '<input type="checkbox" name="a" value="'+x+'" class="'+x+'">'
                            body_html += '<tr>';
                        }
                        for (var y in set[x]) {
                            if (x == 0) {
                                header_html += '<th>'+set[x][y]+'</th>';
                            }else{
                                if (set[0][y] == 'imgUrl'){
                                    body_html += '<th style="padding:0;"><textarea style="width:100px;height:150px;padding:0;overflow:hidden;" class="x'+y+' '+x+'" value="'+set[x][y]+'">'+set[x][y]+'</textarea><img src="'+set[x][y]+'"></th>'
                                }else if (set[0][y] == 'Original(US $)'){
                                    body_html += '<th style="padding:0;">'+set[x][y]+'</th>'
                                }else{
                                    body_html += '<th style="padding:0;"><textarea style="width:100px;height:150px;padding:0;overflow:hidden;" class="x'+y+' '+x+'" value="'+set[x][y]+'">'+set[x][y]+'</textarea></th>'
                                }
                            }
                        }if (x != 0){
                            body_html += '</tr>';
                        }
                    }
                    header_html += '</tr>';
                    $('#name').html(header_html);
                    $('#data').html(body_html);
                    var downHtml = '';
                    downHtml += '<a href="https://www.aliexpress.com/item/'+ID+'.html"><span class="layui-btn layui-btn-danger" id="thisId">'+ID+'</span></a>'
                    downHtml += '&nbsp;<button class="layui-btn Download_CSV" value="'+ID+'"><i class="layui-icon"></i>DownLoad CSV File</button>&nbsp;<button class="layui-btn" id="csv"><i class="layui-icon"></i>Save</button>&nbsp;<button class="layui-btn" id="edit"><i class="layui-icon"></i>Edit</button>'
                    $('#save').html(downHtml);
                }
            },
            //防止深度序列化。传递数组元素属性必设置为true！
            traditional: true,
            error: function (data) {
                alert(data);
            }
        });
    });
    $(document).on('click','.checked-csv',function(){
        var ID = $('#thisId').html()
        var set = []
        var pow = []
        $('#name tr th').each(function() {
            pow.push($(this).html())
        })
        set.push(pow)
        $('input[name="a"]:checked').each(function() {
            var pow = []
            var c = $(this).attr('class')
            $('.'+c).each(function () {
                if ( $(this)[0]['tagName'] != 'INPUT' ){
                    pow.push($(this).val())
                }
            })
            set.push(pow)
        })
        var str = $.base64.encode(JSON.stringify(set));
        var bs = $.base64.encode(str);
        $.ajax({
            type: "POST",//传输方式
            url: "/checked_csv/",//url
            data: {"data":bs,"id":ID},//传输的数据
            success: function (data) {
                if (data == 'ok'){
                    window.open('/static/download/checked-csv/'+ID+'.csv')
//                    window.location.href='/static/download/checked-csv/'+ID+'.csv'
                }
            },
            //防止深度序列化。传递数组元素属性必设置为true！
            traditional: true,
            error: function (data) {
                alert(data);
            }
        });
    });
    // 查看更新日志
    $(document).on('click','#log',function(){
        var type = $('#log').html()
        if ( type == 'Update log'){
            $('#log').html('Close log')
            $('#log_data').css('display','block');
        }else{
            $('#log').html('Update log')
            $('#log_data').css('display','none');
        }
    })
    // 选择下载WISH csv
    $(document).on('click','.wish',function(){
        var ID = $(this).val();
        $.ajax({
            type: "POST",//传输方式
            url: "/wish/",//url
            data: {"id":ID},//传输的数据
            success: function (data) {
                if (data == 'ok'){
                    window.open('/static/download/wish-csv/'+ID+'.csv')
                }else{
                    alert('Server Internal Error!')
                }
            },
            //防止深度序列化。传递数组元素属性必设置为true！
            traditional: true,
            error: function (data) {
                alert(data);
            }
        });
    });
    $(document).on('click','.checked-wish-csv',function(){
        var ID = $('#thisId').html()
        var set = []
        var pow = []
        $('#name tr th').each(function() {
            pow.push($(this).html())
        })
        set.push(pow)
        $('input[name="a"]:checked').each(function() {
            var pow = []
            var c = $(this).attr('class')
            $('.'+c).each(function () {
                if ( $(this)[0]['tagName'] != 'INPUT' ){
                    pow.push($(this).val())
                }
            })
            set.push(pow)
        })
        var str = $.base64.encode(JSON.stringify(set));
        var bs = $.base64.encode(str);
        $.ajax({
            type: "POST",//传输方式
            url: "/checked-wish-csv/",//url
            data: {"data":bs,"id":ID},//传输的数据
            success: function (data) {
                if (data == 'ok'){
                    window.open('/static/download/wish-csv/'+ID+'.csv')
                }else{
                    alert('Server Internal Error!')
                }
            },
            //防止深度序列化。传递数组元素属性必设置为true！
            traditional: true,
            error: function (data) {
                alert(data);
            }
        });
    });
    $('#upload').click(function () {
        // 创建一个表单对象（用于存储要发送的data数据）
        form_data = new FormData;
        // 参数1：后端请求时要获取的参数, 参数2：图片文件File对象
        form_data.append("files", $("#upimg")[0].files[0]);
        var host = window.location.host
        form_data.append("host",host)
        // 向后端发送 ajax 请求
        $.ajax({
            url: "/img/",
            type: "POST",//传输方式
            contentType: false,        // 告诉jQuery不要去设置Content-Type请求头
            processData: false,        // 告诉jQuery不要去处理发送的数据
            data: form_data,
            success: function(data){
                if (data == 'error') {
                    alert('Upload Error!')
                }else{
                    alert('ImgUrl:'+data)
                }
            }, error: function(data){
                console.log(data);
            }
        })
    })
    $(document).on('click','.change_img',function(){
        console.log('aaa');
        var name = $(this)['0']['name'];
        console.log(name)
        $('input[name="'+name+'"]').click();
    })
    $(document).on('change','.upshow_img',function(){
        // 创建一个表单对象（用于存储要发送的data数据）
        var id = $(this)['0']['name']
        var host = window.location.host
        form_data = new FormData;
        // 参数1：后端请求时要获取的参数, 参数2：图片文件File对象
        form_data.append("files", $(this)[0].files[0]);
        form_data.append("ID", id);
        form_data.append("host", host);
        // 向后端发送 ajax 请求
        $.ajax({
            url: "/show_img/",
            method: "POST",//传输方式
            contentType: false,        // 告诉jQuery不要去设置Content-Type请求头
            processData: false,        // 告诉jQuery不要去处理发送的数据
            data: form_data,
            success: function(data){
                if (data == 'error') {
                    alert('Upload Error!')
                }else{
                    $('#'+id).attr('src',data)
                }
            }, error: function(data){
                console.log(data);
            }
        })
    })
});
