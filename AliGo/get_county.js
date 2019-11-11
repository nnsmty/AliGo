$(document).on('click','#countrydata',function(){
    $('#country').html('<img src="images/wait.gif" style="width:100px;">')
    var id = $('#product_id').html();
    console.log('country',id)
    var host = window.location.host
    $.ajax({
        type: "POST",//传输方式
        url: "https://140.82.35.203/country/",//url
        data: {"id":id},//传输的数据
        success: function (data) {
            if (data == 'error'){
                alert('Get error please try again')
                $('#country').html('')
            }else{
                html = ''
                for (var i in data){
                    html += '<p>'+i.toUpperCase()+' : '+data[i]+'</p>'
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