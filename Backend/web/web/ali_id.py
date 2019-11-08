import requests,re,csv,os
def get_data(ID):
	url = 'https://www.aliexpress.com/item/'+ID+'.html'
	html = requests.get(url).text
	title = re.findall(r'"subject":"(.*?)"',html)[0]
	try:
		Price = re.findall(r'"formatedActivityPrice":"(.*?)"',html)[0]
	except:
		Price = 'no'
	formatedPrice = re.findall(r'"formatedPrice":"(.*?)"',html)[0]
	averageStar = re.findall(r'"averageStar":"(.*?)"',html)[0]
	Reviews = re.findall(r'"totalValidNum":(\d+)',html)[0]
	noInStock = re.findall(r'"totalAvailQuantity":(\d+)',html)[0]
	orders = re.findall(r'"tradeCount":(\d+)',html)[0]
	PData = {}
	color = re.findall(r'1,"skuPropertyValueTips":"(.*?)"',html)
	color_img = re.findall(r'"skuPropertyImageSummPath":"(.*?)"',html)
	for i in range(len(color)):
		PData[color[i]] = color_img[i]
	if PData == {}:
		PData = 'None'
	storeName = re.findall(r'"storeName":"(.*?)"',html)[0]
	storeNum = re.findall(r'"storeNum":(\d+)',html)[0]
	storeUrl = re.findall(r'"storeURL":"(.*?)"',html)[0]
	followers = re.findall(r'"followingNumber":(\d+)',html)[0]
	rating = re.findall(r'"positiveRate":"(.*?)"',html)[0]
	storeInfo = {
		'storeName':storeName,
		'storeUrl':'https:'+storeUrl,
		'storeNumber':storeNum,
		"followers": followers,
		"rating": rating
	}
	data = re.findall(r'"skuPropertyName":"(.*?)","skuPropertyValues":(.*?)]',html)
	dict = {}
	for i in data:
		a = re.findall('"propertyValueDisplayName":"(.*?)","propertyValueId":(\d+),', i[1])
		dict[i[0]] = a
	# print(dict)
	# for i in data:
	# 	if 'Size' in i[0]:
	# 		size = re.findall('"propertyValueDisplayName":"(.*?)","propertyValueId":(\d+),', i[1])
	# 	elif 'Color' in i[0]:
	# 		color_data = re.findall(r'"propertyValueDisplayName":"(.*?)","propertyValueId":(\d+),',i[1])
	Quantity = re.findall(r'"skuAttr":"(.*?)",.*?"availQuantity":(\d+),.*?}}',html)
	# print(Quantity)
	list1 = []
	for x in dict:
		for y in dict[x]:
			list1.append(y)
	# print(list1)
	inventory = []
	for x in Quantity:
		a_list = []
		for i in list1:
			if i[1] in re.split('[:;#]',x[0]):
				a_list.append(i[0])
		a_list.append(x[1])
		inventory.append(a_list)

	Description = re.findall(r'"attrName":"(.*?)".*?"attrValue":"(.*?)"',html)
	Description_data = {}
	for i in Description:
		Description_data[i[0]] = i[1]
	totalAvailQuantity = re.findall(r'"totalAvailQuantity":(\d+)',html)[0]

	sDic = {'product Name' : title,
			'product Price' : Price,
			"formatedPrice": formatedPrice,
			'overview-rating' : averageStar,
			'reviews' : Reviews,
			'orders' : orders,
			'totalAvailQuantity': totalAvailQuantity,
			'Stock' : noInStock,
			# 'shippingType = ' : shippingType,
			# "orders":orders,
			"ColorInfo":PData,
			# "shippingInfo" : shippingInfo,
			# "deliveryTime" : deliveryTime,
			# "Recommended":Recommended
			# "Description":Description_data,
			"CInventory":inventory,
			"storeInfo": storeInfo,
			}
	name_list = []
	for i in dict:
		name_list.append(i)
	write_csv(ID,sDic,name_list)
	return product_data(sDic,name_list)

def product_data(sDic,Name_list):
	name_list = ['product Name','product Price',"formatedPrice",'overview-rating','reviews','orders','Stock']
	for i in Name_list:
		name_list.append(i)
	if len(Name_list) == 0:
		for x in ['totalAvailQuantity', 'storeName', 'storeUrl', 'storeNumber', 'followers', 'rating']:
			name_list.append(x)
	else:
		for x in ['Inventory','totalAvailQuantity','imgUrl','storeName','storeUrl','storeNumber','followers','rating']:
			name_list.append(x)

	dict = {
		'name':name_list,
		'data':sDic
	}
	return dict

def write_csv(ID,sDic,Name_list):
	filename = './static/download/'+ID+'.csv'
	type = os.path.exists(filename)
	if type == True:
		os.remove(filename)
	out = open(filename, 'a', newline='')
	csv_writer = csv.writer(out, dialect='excel')
	name_list = ['product Name', 'product Price', "formatedPrice", 'overview-rating', 'reviews', 'orders', 'Stock']
	for i in Name_list:
		name_list.append(i)
	if len(Name_list) == 0:
		for x in ['totalAvailQuantity', 'storeName', 'storeUrl', 'storeNumber', 'followers', 'rating']:
			name_list.append(x)
	else:
		for x in ['Inventory', 'totalAvailQuantity', 'imgUrl', 'storeName', 'storeUrl', 'storeNumber', 'followers',
				  'rating']:
			name_list.append(x)
	csv_writer.writerow(name_list)
	data = sDic
	for i in range(len(data["CInventory"])):
		data_list = []
		b = data["CInventory"][i]
		index = len(data["CInventory"][i]) + 6
		index1 = index + 1
		for x in range(len(name_list)):
			if x < 7:
				data_list.append(data[name_list[x]])
			elif x == 7:
				for a in range(len(b)):
					data_list.append(b[a])
			elif index1 < x:
				if name_list[x] == 'imgUrl':
					if data["ColorInfo"] == "None":
						data_list.append('no images')
					else:
						for c in data["ColorInfo"]:
							for k in b:
								if c == k:
									data_list.append(data["ColorInfo"][c])
				else:
					data_list.append(data["storeInfo"][name_list[x]])
			elif index < x:
				data_list.append(data[name_list[x]])
		csv_writer.writerow(data_list)


# if __name__ == '__main__':
#     print(get_data(input('输入')))