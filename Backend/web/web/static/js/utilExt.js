layui.define(["jquery", "layer","form"] , function(exports){ //提示：模块也可以依赖其它模块，如：layui.define('layer', callback);
	var $ = layui.jquery , form = layui.form ,layer = layui.layer;
	var obj = {
	
	/**cookie對象*/	  
	cookie : function(key, value, options) {
		if (arguments.length > 1 && (value === null || typeof value !== "object")) {
			options = $.extend({}, options);
			if (value === null) {
				options.expires = -1;
			}
			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}
//					return (document.cookie = [ encodeURIComponent(key), '=', options.raw ? String(value) : encodeURIComponent(String(value)), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : '' ].join(''));
			return (document.cookie = [ encodeURIComponent(key), '=', options.raw ? String(value) : encodeURIComponent(String(value)), options.expires ? '; expires=' + options.expires.toUTCString() : '', '; path=/', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : '' ].join(''));
		}
		options = value || {};
		var result, decode = options.raw ? function(s) {
			return s;
		} : decodeURIComponent;
		return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
	},	  
	
	/**获取cookie*/
  	getCookie:function(name)
	{
		var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		if(arr=document.cookie.match(reg))
			return unescape(arr[2]);
		return null;
	},
	
	/**获取唯一ID*/
	getUUID:function (){
		  var len=32;//32长度
		  var radix=16;//16进制
		  var chars='0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');var uuid=[],i;radix=radix||chars.length;if(len){for(i=0;i<len;i++)uuid[i]=chars[0|Math.random()*radix];}else{var r;uuid[8]=uuid[13]=uuid[18]=uuid[23]='-';uuid[14]='4';for(i=0;i<36;i++){if(!uuid[i]){r=0|Math.random()*16;uuid[i]=chars[(i==19)?(r&0x3)|0x8:r];}}}
		  return uuid.join('');
	},
    

	//msg成功提示
    layerMsgS: function (text) {
        parent.layer.msg(text, {icon: 1});
    },
    //msg错误提示
    layerMsgE: function (text) {
    	parent.layer.msg(text, {icon: 2});
    },
    //msg信息提示
    layerMsgI: function (text) {
    	parent.layer.msg(text, {icon: 6});
    },
    
	//成功提示
    layerAlertS: function (text, title) {
        parent.layer.alert(text, { title: title, icon: 1, time: 5000, resize: false, zIndex: layer.zIndex, anim: Math.ceil(Math.random() * 6) });
    },
    //错误提示
    layerAlertE: function (text, title) {
        parent.layer.alert(text, { title: title, icon: 2, time: 5000, resize: false, zIndex: layer.zIndex, anim: Math.ceil(Math.random() * 6) });
    },
    //信息提示
    layerAlertI: function (text) {
        parent.layer.alert(text, { time: 5000, resize: false, zIndex: layer.zIndex, anim: Math.ceil(Math.random() * 6) });
        return;
    },
    //询问
    layerConfirm:function(text,callback){
    	layer.confirm(text, {icon: 3, title:'提示' , anim: Math.ceil(Math.random() * 6)}, function(index){
    		layer.close(index);
    		if(callback)
    			callback(index);
    		});
    },
    
    //打开页面
    /**
     * 打开对话框页面
     * @parem url 打开的地址
     * @parem title 对话框标题
     * @parem btn 按钮【可空】
     * @parem area 对话框大小【如：["600px", "90%"] ， 可空】
     * @parem full 是否全屏
     * @parem topFull 是否parent一层弹出
     * @parem callback 表单提交后，后台返回时的回调函数
     * @parem preFun 提交表单前函数，返回true时可提交，返回false不提交表单
     */
    open: function(url, title, btn, area, full, topFull,callback , preFun) {
        var param = {
            type: 2,
            title: title,
            closeBtn: 1,
            shade: 0.1,
            maxmin: true,
            area: area ? area: ["600px", "90%"],
            btn: btn ? btn: ["保存", "关闭"],
            content: url,
            yes: function(index_, layero) {
            	var form_ = layer.getChildFrame("form");
            	var v_ = obj.verify(form_);
            	if(v_){
            		form.render();
            		return false;
            	}
            	
            	//回调preFun函数
                if(preFun){
                	var pre = preFun(index_ , form_);
                	if(pre ==false){
                		return false;
                	}
                }
            	
                var array = form_.serializeArray();
                var action_ = form_.attr("action");
                var fd = {};
                $.each(array,
                function() {
                    fd[this.name] = this.value
                });
                //obj.submit(url, fd);
                
                
                
                $.post(action_,fd,function(d){
            		if(callback){
            			callback(index_,d);
            		}
            	},"json");
                
            },
            btn2: function(index, layero) {
//                var formObj = layer.getChildFrame("form");
//                formObj[0].reset();
//                return false
            	layer.close(index);
            }
        };
        if (topFull) {
        	top.layer.full(top.layer.open(param))
        } else {
            if (full) {
            	layer.full(layer.open(param))
            } else {
            	layer.open(param)
            }
        }
    },
    
    
  //打开查看页面
    /**
     * 打开对话框页面
     * @parem url 打开的地址
     * @parem title 对话框标题
     * @parem area 对话框大小【如：["600px", "90%"] ， 可空】
     * @parem full 是否全屏
     * @parem topFull 是否parent一层弹出
     */
    open_: function(url, title,  area, full, topFull) {
        var param = {
            type: 2,
            title: title,
            closeBtn: 1,
            shade: 0.1,
            maxmin: true,
            area: area ? area: ["600px", "90%"],
            btn:  ["关闭"],
            content: url,
            yes: function(index_, layero) {
            	layer.close(index_);
            }
        };
        if (topFull) {
        	top.layer.full(top.layer.open(param))
        } else {
            if (full) {
            	layer.full(layer.open(param))
            } else {
            	layer.open(param)
            }
        }
    },
    
    
    /**
     * 验证对象下的表单域元素
     */
    verify: function(form_){
    	var verify = {
		          required: [
		            /[\S]+/
		            ,'必填项不能为空'
		          ]
		          ,phone: [
		            /^1\d{10}$/
		            ,'请输入正确的手机号'
		          ]
		          ,email: [
		            /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
		            ,'邮箱格式不正确'
		          ]
		          ,url: [
		            /(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/
		            ,'链接格式不正确'
		          ]
		          ,number: [
		            /^\d+$/
		            ,'只能填写数字'
		          ]
		          ,date: [
		            /^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/
		            ,'日期格式不正确'
		          ]
		          ,identity: [
		            /(^\d{15}$)|(^\d{17}(x|X|\d)$)/
		            ,'请输入正确的身份证号'
		          ]
    	};
    	var stop = false ,
    	DANGER = 'layui-form-danger' , 
    	verifyElem = form_.find('*[lay-verify]') ; //获取需要校验的元素
    	//开始校验
        layui.each(verifyElem, function(_, item){
        	
	          var othis = $(this), ver = othis.attr('lay-verify').split('|');
	          var tips = '', value = othis.val();
	          othis.removeClass(DANGER);
	          
	          var hasRequired_=false;
	          layui.each(ver, function(_, thisVer){
	        	  if("required"===thisVer){
	        		  hasRequired_=true;
	        	  }
	          });
	          
	          layui.each(ver, function(_, thisVer){
		            var isFn = typeof verify[thisVer] === 'function';
//		            if(verify[thisVer] && (isFn ? tips = verify[thisVer](value, item) : !verify[thisVer][0].test(value)) ){
		            if( (hasRequired_==true || value) && verify[thisVer] && (isFn ? tips = verify[thisVer](value, item) : !verify[thisVer][0].test(value)) ){
		              layer.msg(tips || verify[thisVer][1], {
		                icon: 5
		                ,shift: 6
		              });
		              item.focus();
		              othis.addClass(DANGER);
		              return stop = true;
		            }
	          });
	          if(stop) return stop;
        });
        return stop;
    	
    },
    
    //提交
    submit: function(url, data,fun) {
    	$.post(url,data,function(d){
    		if(fun)
    			fun(d);
    	},"json");
    	
//        $.ajax({
//            type: "post",
//            url: url,
//            data: data,
//            success: function(result) {}
//        })
    },
    
    /**
	 * @author 
	 * 
	 * 增加formatString功能
	 * 
	 * 使用方法：$.formatString('字符串{0}字符串{1}字符串','第一个变量','第二个变量');
	 * 
	 * @returns 格式化后的字符串
	 */
	formatString : function(str) {
		for ( var i = 0; i < arguments.length - 1; i++) {
			arguments[i + 1]=arguments[i + 1]?arguments[i + 1]:"";
			str = str.replace("{" + i + "}", arguments[i + 1]);
		}
		return str;
	},
	
	/**
	 * 序列化form内元素为json对象
	 */
	serialize : function(formID){
		var array = $("#"+formID).serializeArray();
        var fd = {};
        $.each(array,
        function() {
            fd[this.name] = this.value
        });
        return fd;
	},
	
	/**
	 * 地区级联动作
	 * @param provinceID
	 * @param cityID
	 * @param countyID
	 * @param townshipID
	 * @param villageID
	 */
	changeArea : function(provinceID , cityID , countyID , townshipID , villageID){
		var $province = $("#"+provinceID);	//省
		var $city = $("#"+cityID);					//市
		var $county = $("#"+countyID);		//县
		var $township = $("#"+townshipID);	//乡
//		var $village = $("#"+villageID);			//村
		
		//省
		form.on('select('+provinceID+')', function (data) {
//            console.info(data);
            var province = data.value;
            $.ajax({
				type: "POST",
				url: base + "/admin/district/getDistrictByProvince",
					data: {
						'provinceID':province
			        },
					dataType: 'json',
					contentType: "application/x-www-form-urlencoded; charset=utf-8",
					success: function(data){
						var city,county,township,village;
						city = data.city;
						county = data.county;
						township = data.township;
						village = data.village;
						
						addArea(cityID ,city);
						addArea(countyID ,county);
						addArea(townshipID ,township);
						addArea(villageID ,village);
						
						form.render("select");//重新渲染
					}
			});
        });
		
		//省变化
//		$province.change(function(){
//			var province = $(this).val();
//			$.ajax({
//				type: "POST",
//				url: base + "/admin/district/getDistrictByProvince",
//					data: {
//						'provinceID':province
//			        },
//					dataType: 'json',
//					contentType: "application/x-www-form-urlencoded; charset=utf-8",
//					success: function(data){
//						var city,county,township,village;
//						city = data.city;
//						county = data.county;
//						township = data.township;
//						village = data.village;
//						
//						addArea(cityID ,city);
//						addArea(countyID ,county);
//						addArea(townshipID ,township);
//						addArea(villageID ,village);
//						
//						form.render("select");//重新渲染
//					}
//			});
//		});
		
		//市
		form.on('select('+cityID+')', function (data) {
//          console.info(data);
          var city = data.value;
          $.ajax({
				type: "POST",
				url: base + "/admin/district/getDistrictByCity",
					data: {
						'cityID':city
			        },
					dataType: 'json',
					contentType: "application/x-www-form-urlencoded; charset=utf-8",
					success: function(data){
						var county,township,village;
						county = data.county;
						township = data.township;
						village = data.village;
						
						addArea(countyID ,county);
						addArea(townshipID ,township);
						addArea(villageID ,village);
						
						form.render("select");//重新渲染
					}
			});
      });
		
		//市变化
//		$city.change(function(){
//			var city = $(this).val();
//			$.ajax({
//				type: "POST",
//				url: base + "/admin/district/getDistrictByCity",
//					data: {
//						'cityID':city
//			        },
//					dataType: 'json',
//					contentType: "application/x-www-form-urlencoded; charset=utf-8",
//					success: function(data){
//						var county,township,village;
//						county = data.county;
//						township = data.township;
//						village = data.village;
//						
//						addArea(countyID ,county);
//						addArea(townshipID ,township);
//						addArea(villageID ,village);
//						
//						form.render("select");//重新渲染
//					}
//			});
//		});
		
		//县
		form.on('select('+countyID+')', function (data) {
//          console.info(data);
          var county = data.value;
          $.ajax({
				type: "POST",
				url: base + "/admin/district/getDistrictByCountry",
					data: {
						'countryID':county
			        },
					dataType: 'json',
					contentType: "application/x-www-form-urlencoded; charset=utf-8",
					success: function(data){
						var township,village;
						township = data.township;
						village = data.village;
						
						addArea(townshipID ,township);
						addArea(villageID ,village);
						
						form.render("select");//重新渲染
					}
			});
      });
		
		//县区变化
//		$county.change(function(){
//			var county = $(this).val();
//			$.ajax({
//				type: "POST",
//				url: base + "/admin/district/getDistrictByCountry",
//					data: {
//						'countryID':county
//			        },
//					dataType: 'json',
//					contentType: "application/x-www-form-urlencoded; charset=utf-8",
//					success: function(data){
//						var township,village;
//						township = data.township;
//						village = data.village;
//						
//						addArea(townshipID ,township);
//						addArea(villageID ,village);
//						
//						form.render("select");//重新渲染
//					}
//			});
//		});
		
		form.on('select('+townshipID+')', function (data) {
//          console.info(data);
          var township = data.value;
          $.ajax({
				type: "POST",
				url: base + "/admin/district/getDistrictByTownship",
					data: {
						'townshipID':township
			        },
					dataType: 'json',
					contentType: "application/x-www-form-urlencoded; charset=utf-8",
					success: function(data){
						var village;
						village = data.village;
						
						addArea(villageID ,village);
						
						form.render("select");//重新渲染
					}
			});
      });
		
		//村镇乡街道 变化
//		$township.change(function(){
//			var township = $(this).val();
//			$.ajax({
//				type: "POST",
//				url: base + "/admin/district/getDistrictByTownship",
//					data: {
//						'townshipID':township
//			        },
//					dataType: 'json',
//					contentType: "application/x-www-form-urlencoded; charset=utf-8",
//					success: function(data){
//						var village;
//						village = data.village;
//						
//						addArea(villageID ,village);
//						
//						form.render("select");//重新渲染
//					}
//			});
//		});
		
		function addArea(selectId,data){
			$("#" + selectId).empty();
			if(data && data.length>0){
				var area;
				$.each(data, function(index) {
					area = data[index];
					$("#" + selectId).append("<option value='" + area.id + "'>" + area.name + "</option>"); 
				});
			}else{
				$("#" + selectId).append("<option value=''>无</option>"); 
			}
		}

	} ,
	
	/**
	 * 设置默认区域
	 * @param area
	 * @param provinceID
	 * @param cityID
	 * @param countyID
	 * @param townshipID
	 * @param villageID
	 */
	setDefaultArea : function(area , provinceID , cityID , countyID , townshipID , villageID){
		if(!area){
			return;
		}
		addArea(provinceID , area.province , area.provinceCode);
		addArea(cityID , area.city, area.cityCode);
		addArea(countyID , area.county , area.countyCode);
		addArea(townshipID , area.township , area.townshipCode);
		addArea(villageID , area.village , area.villageCode);
		
		form.render("select");//重新渲染
		
		function addArea(selectId,data , defVal){
			$("#" + selectId).empty();
			if(data && data.length>0){
				var area , def;
				$.each(data, function(index) {
					area = data[index];
					def="";
					if(area.id == defVal){
						def = "selected";
					}
					$("#" + selectId).append("<option "+def+" value='" + area.id + "'>" + area.name + "</option>"); 
				});
			}else{
				$("#" + selectId).append("<option value=''>无</option>"); 
			}
			
		}

	}
    
  };
  
  //输出utilExt接口
  exports('utilExt', obj);
}); 