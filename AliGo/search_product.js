

  
	




// listen if Tab URL change 


console.log("Hello world 21");
//$('.place-container').attr('src','second.jpg');
//$('.place-container').attr('src','second.jpg');
//$(".list-item").css('background', 'Green');
//$(".place-container").css('background', 'red');
//$('.place-container').css("height","254px");

//append header 
//Epackt detail in product detail
 //$(".product-img" ).append( "<div id='DIV_1'>	<span id='SPAN_2'>ePacket</span><span id='SPAN_3'>Free</span></div>" );
 
 //hover button 
//	var url_im = chrome.runtime.getURL('icon_68.png') ;  
	//$(".gallery.product-card.middle-place" ).append( '<a class="import" title="Push this product to Ali Go" id="A_1"><img  src=" '+ url_im+'" alt="Import product to Ali Go" id="IMG_2" /></a>');
	

	
	//var img_url = chrome.runtime.getURL('icon.png');
	//$('#IMG_2').attr('src',chrome.runtime.getURL('icon_68.png'));
 //$('.list-item').css("border:1px solid"," rgb(110, 117, 141)");
 //$('.list-item').css("padding-right:","16px");
 //$('.list-item').css("padding-bottom:","16px");
 
 
 
 //when atom are load more 
 
 
 
 
 
/* $("#DIV_1").click(function(){
 console.log("Added");
 
}); */

/*  $(document).ready(function() { 
            $("#DIV_1").on("click", function() { 
                console.log("Added");
				
            }); 
        });  */
		
		
		$('.list-item').on('click','div', function() {
				
				var product_id_1= $(this).attr('data-product-id') ; 
				
					console.log($('.import').attr('id'));
					console.log(product_id_1);
		
	
			
		//	$('.btn-unapprove').click(function(){    
		//	alert($(this).closest('div.pane.alt').attr('id'));
		//		});
			
			
		//alert("Hello") ; // Or make($(this)); if you still want that extra function
		//var spans = $( "data-product-id" );
	//	alert($(this).attr('data-product-id'));
	//	console.log($(this).attr('data-product-id'));
	//	alertify.success('Product Imported ');
		

			
		}); 
		

		
		
		
		
/* $('.list-items').one('DOMSubtreeModified', function(event) {
	
    // dos tuff
			var parent = document.querySelector('.gallery.product-card.middle-place');

			if (parent.querySelector('.import') == null) {
				
				console.log("exist");
				// .. it exists as a child
			}else if (parent.querySelector('.import') !== null) {
				$(".gallery.product-card.middle-place" ).append( '<a class="import" title="Push this product to Ali Go" id="A_1"><img  src=" '+ url_im+'" alt="Import product to Ali Go" id="IMG_2" /></a>');
			}
	 
	//$(".gallery.product-card.middle-place" ).append( '<a class="import" title="Push this product to Ali Go" id="A_1"><img  src=" '+ url_im+'" alt="Import product to Ali Go" id="IMG_2" /></a>');
	
	
	console.log("load");
}); */
 
	
	
//alert($(".list-items .list-item").children().length);
var texts = [];
var lenght_product =$(".list-items .list-item").children().length ;
console.log(lenght_product);


$('.list-items').on('DOMSubtreeModified', function(event) {
	
 check ();

});



function check (){




$(function() {
    $('.list-items .gallery.product-card.middle-place').each(function(){
		
		var rr= $(this).attr('data-product-id'); 
		
		if(jQuery.inArray(rr, texts) !== -1){
			
			 console.log("no");
		}else{	

		
			texts.push($(this).attr('data-product-id'));
			
			 $(".product-img" ).append( "<div id='DIV_1'>	<span id='SPAN_2'>ePacket</span><span id='SPAN_3'>Free</span></div>" );
 
			$(this).append( '<a id="'+rr+'"  class="import" title="Push this product to Ali Go" onClick="pro(\'' + rr + '\')""><img  src=" '+ url_im+'" alt="Import product to Ali Go " id="IMG_2" /></a>');
			
		/* 			if(!$(".gallery.product-card.middle-place").hasClass(".import")){
			$(".gallery.product-card.middle-place" ).append( '<a class="import" title="Push this product to Ali Go" id="A_1"><img  src=" '+ url_im+'" alt="Import product to Ali Go" id="IMG_2" /></a>');
				}
				 */
				
		/* 	if(	$(".list-items a").hasClass( ".import" )){
				console.log("already Has");
			}else{
				$(".gallery.product-card.middle-place" ).append( '<a class="import" title="Push this product to Ali Go" id="A_1"><img  src=" '+ url_im+'" alt="Import product to Ali Go" id="IMG_2" /></a>');
	
			} */
			
		}
		
		
       
    });
	
	
	
	
/* 	var allUser = $('.list-items .gallery.product-card.middle-place').map(function () {
    return $(this).attr('data-product-id');
}).get();

console.log(allUser);
	
    alert(allUser); */

   // alert("yes"+texts);
	//console.log(texts);
	
});
	

}
		




function pro(pro){
	
	
	if (confirm('Are you sure to import this item?')){
	  $.ajax({
		  type: "POST",//传输方式
		  url: "https://140.82.35.203/Traversy/",//url
		  data: {"id":pro},//传输的数据
		  success: function (data) {
			  if(data=='have'){
				  alert('We already have its data!')
			  }else if(data == 'error'){
				  alert('Unknown error!')
			  }else{
				  alert('Save Succeeded！')
			  }
		  },
		  //防止深度序列化。传递数组元素属性必设置为true！
		  traditional: true,
		  error: function (data) {
			  alert(data);
		  }
		});
	}
	
	



}





	
		
		
		
		

		
	