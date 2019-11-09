/* console.log("Single_ product 1");

var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.runtime.getURL('single_product.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

var s = document.createElement('script');
// TODO: add "script.js" to web_accessible_resources in manifest.json
s.src = chrome.runtime.getURL('jquery.min.js');
s.onload = function() {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);


 */


var url_im = chrome.runtime.getURL('icon_68.png') ;

var url=window.location.href;
var arr=url.split('.html')[0];
var pro_id=arr.split('/')[4];
var check_link_=arr.split('/')[3];




if(check_link_=="item"){

$( "body" ).append( $( '<a id="import_product_bottom" title="Push this product to AliGo" class="Go-fob"><img src='+url_im+' alt="Import product to AliGo"></a>') );



$( "#import_product_bottom" ).on( "click", function() {


							if (confirm('Are you sure to import this item?')){
				  $.ajax({
					  type: "POST",//传输方式
					  url: "https://140.82.35.203/Traversy/",//url
					  data: {"id":pro_id},//传输的数据
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
	
	
	
	
	
});

}