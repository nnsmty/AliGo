// Future JavaScript will go here/* 

/* $.ajax({
    url: 'https://140.82.35.203/static/download/Json/32964391329.json',
    type: "get",
    dataType: "json",
   
    success: function(data) {
        drawTable(data);
		alert(data);
    }
});  */


	
			   
			   

//var url = window.location.host;
//if (url == 'www.aliexpress.com'){
    function drawTable(data) {


        for (var i = 0; i < data.length; i++) {
            drawRow(data[i]);
        }
    }

    function drawRow(rowData) {
        var row = $("<tr />")
        $("#personDataTable").append(row);
        row.append($("<td>" + rowData.id + "</td>"));
        row.append($("<td>" + rowData.title + "</td>"));
        row.append($("<td>" + rowData.userId + "</td>"));
    }


    var current_url="";

    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        console.log("working1 " + tabs[0].url);

         current_url= tabs[0].url ;

         check_aliexpress_product (current_url);
         setlink();
    });

    function setlink() {



    //$("#link").text(current_url);
    $("#link").attr("href", current_url);
    split_to_get_id(current_url);



    }

    var url_to_id ;
    function split_to_get_id(current_url) {

        /* var pathArray = current_url.split('.html');

        var secondLevelLocation = pathArray[0] ;
        secondLevelLocation =pathArray.split('/');
        secondLevelLocation = pathArray[0] */ ;
        var url = current_url;
        url_to_id = getPageName(url);


    $("#product_id").text(url_to_id );
    get_prod_if(url_to_id);
    }


    //spliting the url to get product id
    function getPageName(url) {
        var index = url.lastIndexOf("/") + 1;
        var filenameWithExtension = url.substr(index);
        var filename = filenameWithExtension.split(".")[0];
        return filename;
    }

    function check_aliexpress_product (current_url){

            var pathArray = current_url.split('/');

        var secondLevelLocation = pathArray[3] ;
        //console.log(secondLevelLocation) ;
        if (secondLevelLocation=="item"){

                console.log("This is Ali Exprees Item") ;
                console.log("Its not a Aliexpress Product ") ;
                $("#header_text").text("Ali Express Product" );
                $("#header_id").css('background', 'Green');

        }else{

                    console.log("Its not a Aliexpress Product ") ;
                    $("#header_text").text("No Ali Express Product" );
                    $("#header_id").css('background', 'red');

                    $( "#all_data" ).hide();



        }



    }
    $( "#pro_i" ).click(function() {
    pro();
    });


    function pro(){
    //    var id = $('#product_id').html()
    //	alert(id)
            $("#header_text").text("Importing..." );
                $("#header_id").css('background', '#FF4747');


          $.ajax({
              type: "POST",//传输方式
              url: "https://140.82.35.203/Traversy/",//url
              data: {"id":url_to_id},//传输的数据
              success: function (data) {
                  if(data=='have'){
                     // alert('We already have its data!')

                      $("#header_text").text("Already Imported " );
                        $("#header_id").css('background', 'Red');
                  }else if(data == 'error'){
                      alert('Unknown error!')
                  }else{
                     // alert('Save Succeeded！')
                     $("#header_text").text("Successfully Imported " );
                    $("#header_id").css('background', 'Green');

                  }
              },
              //防止深度序列化。传递数组元素属性必设置为true！
              traditional: true,
              error: function (data) {
                  alert(data);
              }
            });






    }

    function get_prod_if(url_to_id){
    //get_product_in
           $(document).ready(function() {
                $.ajax({
                    type:'get',
                    url:'https://140.82.35.203/json/api/'+url_to_id,
                    success:function(data){
                        $('#stage').html('<p> Product Name : ' + data['product_Name'] + '</p>');
                        $('#stage').append('<p>Orders: ' + data['orders']+ '</p>');
                        $('#stage').append('<p> Reviews: ' + data['reviews']+ '</p>');
                        $('#stage').append('<p> Overview Rating: ' + data['overview-rating']+ '</p>');
                        $('#stage').append('<p> Stock: ' + data['Stock']+ '</p>');
                        $('#stage').append('<p> Tags: ' + data['freight']['*Tags']+ '</p>');
                        $('#stage').append('<p> Description: ' + data['freight']['Description']+ '</p>');
                        $('#stage').append('<p> Freight: ' + data['freight']['Declared Name']+ '</p>');
                        $('#stage').append('<p> Declared Local Name: ' + data['freight']['Declared Local Name']+ '</p>');
                        $('#stage').append('<p> Localized Shipping: ' + data['freight']['*Shipping']+ '</p>');
                        $('#stage').append('<p> Country Of Origin: ' + data['freight']['Country Of Origin']+ '</p>');
                        $('#stage').append('<p> StoreName: ' + data['storeName']+ '</p>');
                        $('#stage').append('<p> Followers: ' + data['followers']+ '</p>');
                        $('#stage').append('<p> Rating: ' + data['rating']+ '</p>');
                    },
                    error:function(){
                        alert("Request Error");
                    },
                    dataType:"json"
                });
    //               $.getJSON("https://140.82.35.203/static/download/Json/"+url_to_id+".json", function(jd) {
    //                  $('#stage').html('<p> Product Name : ' + jd.Stock + '</p>');
    //                  $('#stage').append('<p>Orders: ' + jd.orders+ '</p>');
    //                  $('#stage').append('<p> reviews: ' + jd.reviews+ '</p>');
    //               });


             });

    //		 alert("https://140.82.35.203/static/download/Json/"+url_to_id+".json");
    }
//}