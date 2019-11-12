var user_img = [];
$(document).on('click','#left',function(){
    var index = $('#img').attr('name')
    if (index == 0){
        alert('First Img')
    }else{
        $('#img').attr('src',user_img[Number(index)-1])
        $('#img').attr('name',Number(index)-1)
    }
})
$(document).on('click','#right',function(){
    var index = $('#img').attr('name')
    if (index == user_img.length){
        alert('Finally Img')
    }else{
        $('#img').attr('src',user_img[Number(index)+1])
        $('#img').attr('name',Number(index)+1)
    }
})
$(document).on('click','#countrydata',function(){
    $('#country').html('<img src="images/wait.gif" style="width:100px;">')
    $('#user_img').html('')
    $('#start').html('')
    var id = $('#product_id').html();
    console.log('country',id)
    var host = window.location.host
    $.ajax({
        type: "POST",//传输方式
        url: "https://140.82.35.203/country/",//url
        data: {"id":id},//传输的数据
        success: function (data) {
            if (data == 'error'){
                $('#country').html('Get error please try again')
            }else if (data == 'No Feedback.'){
                $('#country').html('<p>No Feedback.</p>')
            }else{
                html = ''
                for (var i in data){
                    if (i == 'user_img'){
                        user_img = data[i]
                        $('#user_img').html('<a id="left" style="position:absolute;left:10px;"><img src="images/left.png"></a><img id="img"src="'+user_img[0]+'" style="width:300px;" name="0"><a id="right" style="position:absolute;left:280px;"><img src="images/right.png"></a>')
                    }else if(i == 'start_data'){
                        html1 = ''
                        for(var x in data[i]){
                            html1 += '<h3>'+data[i][x][0]+' : '+data[i][x][1]+'</h3>'
                        }
                        $('#start').html(html1)
                    }else{
                        html += '<p>'+i.toUpperCase()+' : '+data[i]+'</p>'
                    }
                }
                $('#country').html(html)
            }
        },
        //防止深度序列化。传递数组元素属性必设置为true！
        traditional: true,
        error: function (data) {
            alert(data);
        }
    });
})