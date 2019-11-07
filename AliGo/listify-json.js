$.ajax({
    url: 'https://jsonplaceholder.typicode.com/posts',
    type: "get",
    dataType: "json",
   
    success: function(data) {
        drawTable(data);
    }
});

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


function setlink() {

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


function split_to_get_id(current_url) {
	
	/* var pathArray = current_url.split('.html');	
	
	var secondLevelLocation = pathArray[0] ;
	secondLevelLocation =pathArray.split('/');
	secondLevelLocation = pathArray[0] */ ;
	var url = current_url;
	var myFilename = getPageName(url);


$("#product_id").text(myFilename );
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


	
	
    
