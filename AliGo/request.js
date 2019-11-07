

$(".gallery.product-card.middle-place").find("a" , "div").click(function(){
  if (confirm('Are you sure to import this item?')){
	  var grandParent = $(this).parent();
	  var id = grandParent.attr('data-product-id');
	  $.ajax({
		  type: "POST",//传输方式
		  url: "http://140.82.35.203:8000/Traversy/",//url
		  data: {"id":id},//传输的数据
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
   }
});

}


