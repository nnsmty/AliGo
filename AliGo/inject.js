		var s = document.createElement('script');
			// TODO: add "script.js" to web_accessible_resources in manifest.json
			s.src = chrome.runtime.getURL('jquery.min.js');
			s.onload = function() {
				this.remove();
			};
			(document.head || document.documentElement).appendChild(s);
			  
					var s = document.createElement('script');
			// TODO: add "script.js" to web_accessible_resources in manifest.json
			s.src = chrome.runtime.getURL('search_product.js');
			s.onload = function() {
				this.remove();
			};
			(document.head || document.documentElement).appendChild(s);

			
