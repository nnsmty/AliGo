import requests, re, csv, os, json
from my_fake_useragent import UserAgent

ua = UserAgent(family='chrome')
#
# def guge(kw):
#     url = 'http://translate.google.cn/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q='+kw
#     data = requests.get(url).text
#     a = re.findall(r'\[\[\["(.*?)\",',data)[0]
#     return a
def get_freight(ID):
    url = 'https://best.aliexpress.com/?lan=en'
    headers = {
        'User-Agent': ua.random()
    }
    res = requests.get(url=url, headers=headers, allow_redirects=False)
    cookie = res.headers['Set-Cookie']
    url2 = 'https://www.aliexpress.com/item/' + ID + '.html'
    headers = {
        'User-Agent': ua.random()
    }
    html = requests.get(url2, headers=headers).text
    categoryId = re.findall(r'"categoryId":(\d+),',html)[0]
    sellerAdminSeq = re.findall(r'"sellerAdminSeq":(\d+),',html)[0]
    storeNum = re.findall(r'"storeNum":(\d+),',html)[0]
    DeclaredName = re.findall(r'"keywords":"(.*?),',html)[0]
    DeclaredLocalName = DeclaredName
    all = re.findall(r'data:(.*?)glo"}},',html)[0]
    description = re.findall(r'"description":"(.*?)",',all)[0]
    tag_list = re.findall(r'"target":"(.*?)",',all)
    tags = ''
    for i in tag_list:
        tags += i+','
    try:
        Price = re.findall(r'"formatedActivityPrice":.*?\$(.*?)"', html)[0]
    except:
        Price = re.findall(r'"formatedPrice":.*?\$(.*?)"', html)[0]

    intl_common_forever = re.findall(r'intl_common_forever=(.*?);', cookie)[0]
    JSESSIONID = re.findall(r'JSESSIONID=(.*?);', cookie)[0]
    xman_t = re.findall(r'xman_t=(.*?);', cookie)[0]
    url1 = 'https://www.aliexpress.com/aeglodetailweb/api/store/header?itemId='+ID+'&categoryId='+categoryId+'&sellerAdminSeq='+sellerAdminSeq+'&storeNum='+storeNum+'&minPrice='+Price+'&maxPrice='+Price+'&priceCurrency=USD'
    data = {
        'itemId': ID,
        'categoryId': categoryId,
        'sellerAdminSeq': sellerAdminSeq,
        'storeNum': storeNum,
        'minPrice': Price,
        'maxPrice': Price,
        'priceCurrency': 'USD'
    }
    headers = {
        'accept': 'application/json,text/plain,*/*',
        'accept-encoding': 'gzip,deflate,br',
        'accept-language': 'zh-CN,zh;q=0.9',
        'cookie': 'ali_apache_id=11.251.144.15.1572861317639.195914.2; xman_us_f=x_locale=en_US&x_l=1&acs_rt=3c4a49826285416e94cea3b1b14ff7f8; aep_usuc_f=site=glo&c_tp=USD&region=CN&b_locale=en_US; cna=huNGFnz+B3MCAQFW8JqxGSXZ; _bl_uid=Rzk2023RkUI9Ud0OnoeboL3xew5R; _gid=GA1.2.1561212313.1572861319; _ga=GA1.2.568075396.1572861319; ali_apache_track=; acs_usuc_t=x_csrf=74h18mtskkq8&acs_rt=c0ad6160fed54cebaf3c468b6ae0ac8c; intl_locale=en_US; ali_apache_tracktmp=; XSRF-TOKEN=997eccd5-02f1-4557-879c-1f106b362dc2; _m_h5_tk=336654c967fb3263bdd2255b36d5342c_1573020491676; _m_h5_tk_enc=2689fb10be410429ff9f07e82bb4df2e; xman_t='+xman_t+'; xman_f=SBFZdj+BnZnmdUxf8la3Hfid1/3RCEPPHsKODWu0sPrIlNh7unmwpKvDqvIDXK4FTarMb21EZn0/BdUy4QWtQFqHxkfUf65sILG84gCidn+IfhufCKY3Kg==; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%0932966710197%0932958887589%0932986423876%0932966710197%0932986423876%0932999786359%0932885961437%094000145122144; intl_common_forever='+intl_common_forever+'; JSESSIONID='+JSESSIONID +'; isg=BGVlUHTfVKaWmLAHInwEd2DQdCGfohk089jvPWdKIRyrfoXwL_IpBPMfCKKt_jHs; l=dBSgfDS4qCVt2gopBOCwourza77OSIRAguPzaNbMi_5aN6_cnobOkI5onF96cjWfMHLB4HZmVQy9-etk2Csuuzu7w2mIAxDc.',
        'referer': 'https://www.aliexpress.com/',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user - agent': ua.random()
    }
    data = requests.get(url1,data=data,headers=headers,allow_redirects=False).text
    JSON = json.loads(data)
    country = JSON['freight']['sendGoodsCountry']
    shipping = JSON['freight']['freightAmount']['value']
    dict = {
        'Declared Name':DeclaredName.replace("'", ""),
        'Declared Local Name':DeclaredName.replace("'", ""),
        '*Tags':tags[:-1].replace("'", ""),
        'Description':description.replace("'", ""),
        '*Price':Price,
        '*Shipping':str(shipping),
        'Country Of Origin':country.replace("'", "")
    }
    return dict

def showimg(ID):
    url = 'https://www.aliexpress.com/item/' + ID + '.html'
    headers = {
        'User-Agent': ua.random()
    }
    html = requests.get(url, headers=headers).text
    showimg_list = re.findall(r'"imagePathList":\[(.*?)],', html)[0]
    showimg = re.findall(r'"(.*?)"',showimg_list)[0]
    return showimg


def stock(ID):
    url = 'https://www.aliexpress.com/item/' + ID + '.html'
    headers = {
        'User-Agent': ua.random()
    }
    html = requests.get(url, headers=headers).text
    stock = re.findall(r'"totalAvailQuantity":(\d+)', html)[0]
    return stock


def get_data(ID):
    url = 'https://www.aliexpress.com/item/' + ID + '.html'
    headers = {
        'User-Agent': ua.random()
    }
    html = requests.get(url, headers=headers).text
    title1 = re.findall(r'"subject":"(.*?)",', html)[0]
    title = ''
    for c in title1:
        if c.isalpha():
            title += c
        elif c.isspace():
            title += c
        elif c.isdigit():
            title += c
        else:
            pass
    try:
        Price = re.findall(r'"formatedActivityPrice":.*?\$(.*?)"', html)[0]
        original = Price
    except:
        Price = 'no'
        original= re.findall(r'"formatedPrice":.*?\$(.*?)"', html)[0]
    formatedPrice = re.findall(r'"formatedPrice":.*?\$(.*?)"', html)[0]
    averageStar = re.findall(r'"averageStar":"(.*?)"', html)[0]
    Reviews = re.findall(r'"totalValidNum":(\d+)', html)[0]
    noInStock = re.findall(r'"totalAvailQuantity":(\d+)', html)[0]
    orders = re.findall(r'"tradeCount":(\d+)', html)[0]
    storeName = re.findall(r'"storeName":"(.*?)"', html)[0]
    storeNum = re.findall(r'"storeNum":(\d+)', html)[0]
    storeUrl = re.findall(r'"storeURL":"(.*?)"', html)[0]
    followers = re.findall(r'"followingNumber":(\d+)', html)[0]
    rating = re.findall(r'"positiveRate":"(.*?)"', html)[0]
    storeInfo = {
        'storeName': storeName.replace("'", ""),
        'storeUrl': 'https:' + storeUrl,
        'storeNumber': storeNum,
        "followers": followers,
        "rating": rating
    }
    data = re.findall(r'"skuPropertyName":"(.*?)","skuPropertyValues":(.*?)]', html)
    PData = {}
    for i in data:
        img = re.findall(r'"propertyValueDisplayName":"(.*?)",.*?"propertyValueIdLong":(\d+),', i[1])
        link = re.findall(r'"skuPropertyImageSummPath":"(.*?)_50x50.jpg",', i[1])
        if link != []:
            for x in range(len(img)):
                try:
                    PData[img[x][0] + '-' + img[x][1]] = link[x]
                except:
                    PData[img[x][0] + '-' + img[x][1]] = 'no img'
    if PData == {}:
        PData = 'None'
    dict = {}
    for i in data:
        a = re.findall('"propertyValueDisplayName":"(.*?)",.*?"propertyValueIdLong":(\d+),', i[1])
        dict[i[0]] = a
    # for i in data:
    # 	if 'Size' in i[0]:
    # 		size = re.findall('"propertyValueDisplayName":"(.*?)","propertyValueId":(\d+),', i[1])
    # 	elif 'Color' in i[0]:
    # 		color_data = re.findall(r'"propertyValueDisplayName":"(.*?)","propertyValueId":(\d+),',i[1])
    Quantity = re.findall(r'"skuPropIds":"(.*?)",.*?"availQuantity":(\d+),.*?}}', html)
    list1 = []
    for x in dict:
        for y in dict[x]:
            list1.append(y)
    e_inventory = []
    for x in Quantity:
        a_list = []
        for i in list1:
            if i[1] in re.split(',', x[0]):
                a_list.append(i[0] + '-' + i[1])
        a_list.append(x[1])
        e_inventory.append(a_list)
    e_dict = {}
    for i in e_inventory:
        e_dict[i[0]] = ''
    inventory = []
    for a in e_dict:
        for x in e_inventory:
            if a == x[0]:
                inventory.append(x)
    Description = re.findall(r'"attrName":"(.*?)".*?"attrValue":"(.*?)"', html)
    Description_data = {}
    for i in Description:
        Description_data[i[0]] = i[1]
    totalAvailQuantity = re.findall(r'"totalAvailQuantity":(\d+)', html)[0]

    sDic = {"product Name": title.replace("'", ""),
            "Original(US $)": original.replace("'", ""),
            "product Price(US $)": Price.replace("'", ""),
            "formatedPrice(US $)": formatedPrice.replace("'", ""),
            "overview-rating": averageStar.replace("'", ""),
            "reviews": Reviews.replace("'", ""),
            "orders": orders.replace("'", ""),
            # "totalAvailQuantity": totalAvailQuantity,
            "Stock": noInStock.replace("'", ""),
            # 'shippingType = ' : shippingType,
            # "orders":orders,
            "ColorInfo": PData,
            # "shippingInfo" : shippingInfo,
            # "deliveryTime" : deliveryTime,
            # "Recommended":Recommended
            # "Description":Description_data,
            "CInventory": inventory,
            "storeInfo": storeInfo,
            }
    name_list = []
    for i in dict:
        name_list.append(i)
    return to_2D(url, sDic, name_list)


# return product_data(url,sDic,name_list)

def to_json(id, dict):
    filename = './static/download/Json/' + id + '.json'
    with open(filename, "w") as f:
        json.dump(dict, f)


def product_data(url, sDic, Name_list):
    name_list = ["product Name","Original(US $)", "product Price(US $)", "formatedPrice(US $)", "overview-rating", "reviews", "orders",
                 "Stock"]
    for i in Name_list:
        name_list.append(i)
    if len(Name_list) == 0:
        for x in ["storeName", "storeUrl", "storeNumber", "followers", "rating"]:
            name_list.append(x)
    else:
        for x in ["Inventory", "imgUrl", "storeName", "storeUrl", "storeNumber", "followers", "rating"]:
            name_list.append(x)

    dict = {
        "ID": re.findall(r'/(\d+).html', url)[0],
        "name": name_list,
        "data": sDic
    }
    return dict


def write_csv(url, sDic, Name_list):
    ID = re.findall(r'/(\d+).html', url)[0]
    filename = './static/download/' + ID + '.csv'
    type = os.path.exists(filename)
    if type == True:
        os.remove(filename)
    out = open(filename, 'a', newline='')
    csv_writer = csv.writer(out, dialect='excel')
    name_list = ['product Name','Original(US $)', 'product Price(US $)', "formatedPrice(US $)", 'overview-rating', 'reviews', 'orders',
                 'Stock']
    for i in Name_list:
        name_list.append(i)
    if len(Name_list) == 0:
        for x in ['storeName', 'storeUrl', 'storeNumber', 'followers', 'rating']:
            name_list.append(x)
    else:
        for x in ['Inventory', 'imgUrl', 'storeName', 'storeUrl', 'storeNumber', 'followers',
                  'rating']:
            name_list.append(x)
    csv_writer.writerow(name_list)
    data = sDic
    for i in range(len(data["CInventory"])):
        data_list = []
        b = data["CInventory"][i]
        index = len(data["CInventory"][i]) + 7
        index1 = index + 1
        for x in range(len(name_list)):
            if x < 8:
                data_list.append(data[name_list[x]])
            elif x == 8:
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


def to_2D(url, sDic, Name_list):
    ID = re.findall(r'/(\d+).html', url)[0]
    all_list = []
    name_list = ['product Name', 'Original(US $)', 'product Price(US $)', "formatedPrice(US $)", 'overview-rating', 'reviews', 'orders',
                 'Stock']
    for i in Name_list:
        name_list.append(i)
    if len(Name_list) == 0:
        for x in ['storeName', 'storeUrl', 'storeNumber', 'followers', 'rating']:
            name_list.append(x)
    else:
        for x in ['Inventory', 'imgUrl', 'storeName', 'storeUrl', 'storeNumber', 'followers',
                  'rating']:
            name_list.append(x)
    all_list.append(name_list)
    data = sDic

    for i in range(len(data["CInventory"])):
        data_list = []
        b = data["CInventory"][i]
        index = len(data["CInventory"][i]) + 7
        index1 = index
        for x in range(len(name_list)):
            if x < 8:
                data_list.append(data[name_list[x]])
            elif x == 8:
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
                if name_list[x] != 'imgUrl':
                    data_list.append(data[name_list[x]])
        all_list.append(data_list)
    return all_list

# if __name__ == '__main__':
#     print(get_data(input('输入')))
