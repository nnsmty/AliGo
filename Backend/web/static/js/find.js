$(function () {
    $(document).on('click','#edit',function(){
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
        for (var i in set) {
            header_html = '';
            body_html = '';
            header_html += '<tr>';
            for (var x in set){
                if (x != 0){
                    body_html += '<tr>';
                }
                for (var y in set[x]) {
                    if (x == 0) {
                        header_html += '<th>'+set[x][y]+'</th>';
                    }else{
                        body_html += '<th style="padding:0;"><textarea style="width:100px;height:150px;padding:0;overflow:hidden;">'+set[x][y]+'</textarea></th>'
                    }
                }if (x != 0){
                    body_html += '</tr>';
                }
            }
            header_html += '</tr>';
            $('#name').html(header_html);
            $('#data').html(body_html);
        }
    });
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
        let str = '';
        str += ID+'编号'
        for (var i in set){
            for (var x in set[i]){
                str += set[i][x]
                str += '分列'
            }
            str += '分行'
        }
//        console.log(str);
//        var b = new Base64();
//        console.log(b.encode(str));
        $.ajax({
            type: "POST",//传输方式
            url: "/save/",//url
            data: {"ids": str},//传输的数据
            success: function (data) {
                if (data == "error") {
                    alert("保存失败！");
                }else {
                    alert("保存成功！");
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
                    for (var i in set) {
                        header_html = '';
                        body_html = '';
                        header_html += '<tr>';
                        for (var x in set){
                            if (x != 0){
                                body_html += '<tr>';
                            }
                            for (var y in set[x]) {
                                if (x == 0) {
                                    header_html += '<th>'+set[x][y]+'</th>';
                                }else{
                                    body_html += '<th>'+set[x][y]+'</th>'
                                }
                            }if (x != 0){
                                body_html += '</tr>';
                            }
                        }
                        header_html += '</tr>';
                        $('#name').html(header_html);
                        $('#data').html(body_html);
                    }
                }
            },
            //防止深度序列化。传递数组元素属性必设置为true！
            traditional: true,
            error: function (data) {
                alert(data);
            }
        });
    });
})