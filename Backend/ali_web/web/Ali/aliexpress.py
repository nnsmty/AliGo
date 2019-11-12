import requests, csv, re, random, threading, json, socket
from lxml import etree
from threading import Thread
from my_fake_useragent import UserAgent

requests.packages.urllib3.disable_warnings()
ua = UserAgent(family='chrome')
# socket.setdefaulttimeout(5)



def get_id(id):
    url = 'https://www.aliexpress.com/item/' + id + '.html'
    headers = {
        'User-Agent': ua.random()
    }
    while True:
        try:
            html = requests.get(url, headers=headers, verify=False, timeout=5).text
            break
        except:
            pass
    ownerMemberId = re.findall(r'"sellerAdminSeq":([0-9]*)', html)[0]
    productId = re.findall(r'"productId":([0-9]*)', html)[0]
    return productId, ownerMemberId


class Data(object):

    def __init__(self):
        self.country_data = {}
        self.color_data = {}
        self.size_data = {}
        self.date_data = {}
        self.country_color = {}

    def get_page(self, id, q):
        page = 1
        id, ownerId = get_id(id)
        url = 'https://feedback.aliexpress.com/display/productEvaluation.htm'
        data = {
            'ownerMemberId': ownerId,
            'memberType': 'seller',
            'productId': id,
            'companyId': ' ',
            'evaStarFilterValue': 'all Stars',
            'evaSortValue': 'sortdefault@feedback',
            'page': str(page),
            'currentPage': str(page - 1),
            'startValidDate': '',
            'i18n': 'true',
            'withPictures': 'false',
            'withPersonalInfo': 'false',
            'withAdditionalFeedback': 'false',
            'onlyFromMyCountry': 'false',
            'version': '',
            'isOpened': 'true',
            'translate': ' Y ',
            'jumpToTop': 'true',
            'v': '2',
        }
        headers = {
            'User-Agent': ua.random(),
            'cookie': 'ali_apache_id=11.227.32.217.1569379987988.424492.8; acs_usuc_t=x_csrf=161jzy60e6qad&acs_rt=9f935d74248b45919a66d764db5eb21c; xman_t=UMY5uhXGUQQV/rdfvEaGe24+ngMwT71a8WTbqes3kqa1+IUmJnXM7ZTHCXowL/YO; xman_f=A3kS/JRQ8SC3AD+EIchTBfoE+Q71cPkDKbbJaOvolM1QiUhD0V/IOQeuMoJZHkzVM58rTcmp2lk1pVd6g+eL0e38MfDtoRhR9JKMYGex3GTu3oN/L3bLiw==; cna=TvXnFePWd0cCAW8SXRdKJrkH; xman_us_f=x_locale=en_US&x_l=1; intl_locale=en_US; aep_usuc_f=site=glo&c_tp=USD&region=CN&b_locale=en_US; intl_common_forever=Tb3fTl7F5HQw7X39BFzH6EgvkB8jGdDFumj+9GkXejZ79zVzS50abw==; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%0932757783126; _m_h5_tk=11718843ef01f7244e4d6fa4f8d1d2fa_1569388590513; _m_h5_tk_enc=932cbe473d8ab10abda4e962bae9da3e; _ga=GA1.2.1129709654.1569380310; _gid=GA1.2.856730577.1569380310; _gat=1; ali_apache_track=; ali_apache_tracktmp=; isg=BE9PkmGJTsz6I0q-DRyEopcy3uOZ3KP6Z7g9N2Fc677FMG8yaUQz5k0iMiArU3sO; JSESSIONID=4B32D63B93D36E15A57C01F97D97B90A; l=cBgMe_HRqK_zfh02BOCanurza77OSIRYYuPzaNbMi_5Bt6T6xM7Ok1yQUF96VjWdtRYB402lRpJ9-etkZGBZJJ37w2mC.',
        }
        while True:
            try:
                html = requests.post(url, data=data, headers=headers, verify=False, timeout=5).text
                break
            except:
                pass
        
        prease_html = etree.HTML(html)
        try:
            no = prease_html.xpath('//html/body/div/div/strong/text()')[0]
            print(no)
            q.put('No Feedback.')
        except:
            page = prease_html.xpath('//*[@id="feedback-list"]/div[1]/span/em/text()')[0]    
            page = (int(page) // 10) + 1

            t_list = []
            # 设置线程上线
            self.thread_max = threading.BoundedSemaphore(500)
            for i in range(1,page):
                # 如果线程达到最大值则等待前面线程跑完空出线程位置
                self.thread_max.acquire()
                t = Thread(target=self.get_country, args=(i, id, ownerId))
                t.start()
                t_list.append(t)
            for t in t_list:
                t.join()

            # user_data = {}
            # user_data['country_data'] = self.sort(self.country_data)
            # user_data['color_data'] = self.sort(self.color_data)
            # user_data['size_data'] = self.sort(self.size_data)
            q.put(self.sort(self.country_data))

    def get_country(self, page, id, ownerId):
        url = 'https://feedback.aliexpress.com/display/productEvaluation.htm'
        data = {
            'ownerMemberId': ownerId,
            'memberType': 'seller',
            'productId': id,
            'companyId': ' ',
            'evaStarFilterValue': 'all Stars',
            'evaSortValue': 'sortdefault@feedback',
            'page': str(page),
            'currentPage': str(page - 1),
            'startValidDate': '',
            'i18n': 'true',
            'withPictures': 'false',
            'withPersonalInfo': 'false',
            'withAdditionalFeedback': 'false',
            'onlyFromMyCountry': 'false',
            'version': '',
            'isOpened': 'true',
            'translate': ' Y ',
            'jumpToTop': 'true',
            'v': '2',
        }
        headers = {
            'User-Agent': ua.random(),
            'cookie': 'ali_apache_id=11.227.32.217.1569379987988.424492.8; acs_usuc_t=x_csrf=161jzy60e6qad&acs_rt=9f935d74248b45919a66d764db5eb21c; xman_t=UMY5uhXGUQQV/rdfvEaGe24+ngMwT71a8WTbqes3kqa1+IUmJnXM7ZTHCXowL/YO; xman_f=A3kS/JRQ8SC3AD+EIchTBfoE+Q71cPkDKbbJaOvolM1QiUhD0V/IOQeuMoJZHkzVM58rTcmp2lk1pVd6g+eL0e38MfDtoRhR9JKMYGex3GTu3oN/L3bLiw==; cna=TvXnFePWd0cCAW8SXRdKJrkH; xman_us_f=x_locale=en_US&x_l=1; intl_locale=en_US; aep_usuc_f=site=glo&c_tp=USD&region=CN&b_locale=en_US; intl_common_forever=Tb3fTl7F5HQw7X39BFzH6EgvkB8jGdDFumj+9GkXejZ79zVzS50abw==; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%0932757783126; _m_h5_tk=11718843ef01f7244e4d6fa4f8d1d2fa_1569388590513; _m_h5_tk_enc=932cbe473d8ab10abda4e962bae9da3e; _ga=GA1.2.1129709654.1569380310; _gid=GA1.2.856730577.1569380310; _gat=1; ali_apache_track=; ali_apache_tracktmp=; isg=BE9PkmGJTsz6I0q-DRyEopcy3uOZ3KP6Z7g9N2Fc677FMG8yaUQz5k0iMiArU3sO; JSESSIONID=4B32D63B93D36E15A57C01F97D97B90A; l=cBgMe_HRqK_zfh02BOCanurza77OSIRYYuPzaNbMi_5Bt6T6xM7Ok1yQUF96VjWdtRYB402lRpJ9-etkZGBZJJ37w2mC.',
        }
        while True:
            try:
                html = requests.post(url, data=data, headers=headers, verify=False, timeout=5).text
                break
            except:
                pass
        prease_html = etree.HTML(html)
        date_list = prease_html.xpath(
            '// *[ @ id = "transction-feedback"] / div[5] / div / div[2] / div[3] / dl / dt / span[2] / text()')
        for date in date_list:
            date = date.split(' ')[1] + ' ' + date.split(' ')[2]
            try:
                self.date_data[date] += 1
            except:
                self.date_data[date] = 1
        country_list1 = prease_html.xpath('//div[@class="user-country"]/b/@class')
        country_list = []
        for i in country_list1:
            x = i.split(' ')[1]
            country_list.append(x.split('_')[1])
        # print(country_list)
        color_list = prease_html.xpath('//div[@class="user-order-info"]/span[1]/text()')[1::2]
        Logistics_list = prease_html.xpath('//div[@class="user-order-info"]/span[3]/text()')[1::2]
        if Logistics_list == []:
            size_list = []
        else:
            size_list = prease_html.xpath('//div[@class="user-order-info"]/span[2]/text()')[1::2]
        # for i in range(len(country_list)):
        #     key = country_list[i] + ' ' + color_list[i]
        #     try:
        #         self.country_color[key] += 1
        #     except:
        #         self.country_color[key] = 1
        for country in country_list:
            try:
                self.country_data[country] += 1
            except:
                self.country_data[country] = 1
        for color in color_list:
            try:
                self.color_data[color] += 1
            except:
                self.color_data[color] = 1
        for size in size_list:
            try:
                self.size_data[size] += 1
            except:
                self.size_data[size] = 1
        # 任务跑完移除线程
        self.thread_max.release()

    def sort(self, items):
        list = [(k, items[k]) for k in sorted(items.keys())]
        return sorted(list, key=lambda x: x[1], reverse=True)

    def get_cookie(self):
        url = 'https://best.aliexpress.com/?lan=en'
        headers = {
            'User-Agent': ua.random()
        }
        res = requests.get(url=url, headers=headers, allow_redirects=False, timeout=5)
        cookie = res.headers['Set-Cookie']
        self.intl_common_forever = re.findall(r'intl_common_forever=(.*?);', cookie)[0]
        self.JSESSIONID = re.findall(r'JSESSIONID=(.*?);', cookie)[0]
        self.xman_t = re.findall(r'xman_t=(.*?);', cookie)[0]
        return (self.intl_common_forever,self.JSESSIONID,self.xman_t)

    def get_c(self,ID):
        intl_common_forever, JSESSIONID, xman_t = self.get_cookie()
        url = 'https://ilogisticsaddress.aliexpress.com/AjaxQueryCountries?callback=__zoro_request_4'
        headers = {
            'accept': '*/*',
            'accept-encoding': 'gzip,deflate,br',
            'accept-language': 'zh-CN,zh;q=0.9',
            'cookie': 'ali_apache_id=11.251.144.15.1572861317639.195914.2; xman_us_f=x_locale=en_US&x_l=1&acs_rt=3c4a49826285416e94cea3b1b14ff7f8; aep_usuc_f=site=glo&c_tp=USD&region=CN&b_locale=en_US; cna=huNGFnz+B3MCAQFW8JqxGSXZ; _bl_uid=Rzk2023RkUI9Ud0OnoeboL3xew5R; _gid=GA1.2.1561212313.1572861319; _ga=GA1.2.568075396.1572861319; ali_apache_track=; acs_usuc_t=x_csrf=74h18mtskkq8&acs_rt=c0ad6160fed54cebaf3c468b6ae0ac8c; intl_locale=en_US; ali_apache_tracktmp=; XSRF-TOKEN=997eccd5-02f1-4557-879c-1f106b362dc2; _m_h5_tk=336654c967fb3263bdd2255b36d5342c_1573020491676; _m_h5_tk_enc=2689fb10be410429ff9f07e82bb4df2e; xman_t=' + xman_t + '; xman_f=SBFZdj+BnZnmdUxf8la3Hfid1/3RCEPPHsKODWu0sPrIlNh7unmwpKvDqvIDXK4FTarMb21EZn0/BdUy4QWtQFqHxkfUf65sILG84gCidn+IfhufCKY3Kg==; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%0932966710197%0932958887589%0932986423876%0932966710197%0932986423876%0932999786359%0932885961437%094000145122144; intl_common_forever=' + intl_common_forever + '; JSESSIONID=' + JSESSIONID + '; isg=BGVlUHTfVKaWmLAHInwEd2DQdCGfohk089jvPWdKIRyrfoXwL_IpBPMfCKKt_jHs; l=dBSgfDS4qCVt2gopBOCwourza77OSIRAguPzaNbMi_5aN6_cnobOkI5onF96cjWfMHLB4HZmVQy9-etk2Csuuzu7w2mIAxDc.',
            'referer': 'https://www.aliexpress.com/item/'+ID+'.html',
            'User-Agent': ua.random()
        }
        data = requests.get(url,headers= headers,timeout=5).text
        data = data[18:]
        data = data[:-1]
        JSON = json.loads(data)
        country = JSON['countries']
        list1 = re.findall(r"'c': '(.*?)',",str(country))
        list2 = []
        for i in list1:
            if i not in list2:
                list2.append(i)
        return list2

    def get_postage(self,ID):
        self.dict={}
        url2 = 'https://www.aliexpress.com/item/' + ID + '.html'
        headers = {
            'User-Agent': ua.random()
        }
        html = requests.get(url2, headers=headers,timeout=5).text
        sellerAdminSeq = re.findall(r'"sellerAdminSeq":(\d+),', html)[0]
        self.get_this(ID,sellerAdminSeq,'US')
        # c_list = self.get_c(ID)
        # t_list = []
        # # 设置线程上线
        # self.thread_max = threading.BoundedSemaphore(500)
        # for i in c_list:
        #     # 如果线程达到最大值则等待前面线程跑完空出线程位置
        #     self.thread_max.acquire()
        #     t = Thread(target=self.get_this, args=(ID, sellerAdminSeq, i))
        #     t.start()
        #     t_list.append(t)
        # for t in t_list:
        #     t.join()
        return self.dict

    def get_this(self,ID,Seq,c):
        self.get_cookie()
        url = 'https://www.aliexpress.com/aeglodetailweb/api/logistics/freight?productId='+ID+'&count=1&country='+c+'&provinceCode=&cityCode=&tradeCurrency=USD&sellerAdminSeq='+Seq+'&userScene=PC_DETAIL_SHIPPING_PANEL'
        headers = {
            'accept': 'application/json,text/plain,*/*',
            'accept-encoding': 'gzip,deflate,br',
            'accept-language': 'zh-CN,zh;q=0.9',
            'cookie': 'ali_apache_id=11.251.144.15.1572861317639.195914.2; xman_us_f=x_locale=en_US&x_l=1&acs_rt=3c4a49826285416e94cea3b1b14ff7f8; aep_usuc_f=site=glo&c_tp=USD&region=CN&b_locale=en_US; cna=huNGFnz+B3MCAQFW8JqxGSXZ; _bl_uid=Rzk2023RkUI9Ud0OnoeboL3xew5R; _gid=GA1.2.1561212313.1572861319; _ga=GA1.2.568075396.1572861319; ali_apache_track=; acs_usuc_t=x_csrf=74h18mtskkq8&acs_rt=c0ad6160fed54cebaf3c468b6ae0ac8c; intl_locale=en_US; ali_apache_tracktmp=; XSRF-TOKEN=997eccd5-02f1-4557-879c-1f106b362dc2; _m_h5_tk=336654c967fb3263bdd2255b36d5342c_1573020491676; _m_h5_tk_enc=2689fb10be410429ff9f07e82bb4df2e; xman_t=' + self.xman_t + '; xman_f=SBFZdj+BnZnmdUxf8la3Hfid1/3RCEPPHsKODWu0sPrIlNh7unmwpKvDqvIDXK4FTarMb21EZn0/BdUy4QWtQFqHxkfUf65sILG84gCidn+IfhufCKY3Kg==; aep_history=keywords%5E%0Akeywords%09%0A%0Aproduct_selloffer%5E%0Aproduct_selloffer%0932966710197%0932958887589%0932986423876%0932966710197%0932986423876%0932999786359%0932885961437%094000145122144; intl_common_forever=' + self.intl_common_forever + '; JSESSIONID=' + self.JSESSIONID + '; isg=BGVlUHTfVKaWmLAHInwEd2DQdCGfohk089jvPWdKIRyrfoXwL_IpBPMfCKKt_jHs; l=dBSgfDS4qCVt2gopBOCwourza77OSIRAguPzaNbMi_5aN6_cnobOkI5onF96cjWfMHLB4HZmVQy9-etk2Csuuzu7w2mIAxDc.',
            'referer': 'https://www.aliexpress.com/item/'+ID+'.html',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'User-Agent': ua.random()
        }
        res = requests.get(url=url, headers=headers, allow_redirects=False,timeout=5)
        cookie = res.headers['Set-Cookie']
        try:
            self.JSESSIONID = re.findall(r'JSESSIONID=(.*?);', cookie)[0]
        except:
            pass
        JSON = json.loads(res.text)
        try:
            data_list = JSON['body']['freightResult']
            for x in data_list:
                try:
                    if self.dict[x['company']] < x['freightAmount']['value']:
                        self.dict[x['company']] = x['freightAmount']['value']
                except:
                    self.dict[x['company']] = x['freightAmount']['value']
                # self.dict['sendGoodsCountry'] = x['sendGoodsCountry']
        except:
            pass

# if __name__ == '__main__':
#     data=Data()
    # id = input('请输入')
    # dict = data.get_page('32881981068')
    # dict = data.get_postage('4000114931935')
    # print(dict)
