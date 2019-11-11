from django.http import HttpResponse
from django.shortcuts import render
from . import ali_id
from .aliexpress import Data
from .models import *
import json, re, csv, os, base64, time
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from multiprocessing import Process


def index(request):
    index1 = len(Ali.objects.all()) // 15 + 1
    try:
        page = int(request.GET['page'])
    except:
        page = 1
    if page == 0:
        page = 1
    elif page < 0:
        page = -page
    up = page - 1
    next = page + 1
    len1 = len(Ali.objects.all())
    if (len1 // 15) * 15 == len1:
        index1 = len1 // 15
    else:
        index1 = len1 // 15 + 1
    index = []
    for i in range(1, index1 + 1):
        index.append(i)
    start = (page - 1) * 15
    end = page * 15
    data = Ali.objects.order_by('-id')[start:end]
    with open('./static/log/update.log') as f:
        log = f.read()
    f.close()
    log_list = log.split('\n')[-11:-1]
    log_list.reverse()
    return render(request, 'index.html', locals())


def get_data(request):
    id = request.GET['URL']
    try:
        ID = re.findall(r'/(\d+).html', id)[0]
    except:
        return HttpResponse('IDerror')
    try:
        list = ali_id.get_data(ID)
        dict = {
            "ID": ID,
            "data": list
        }
        write_csv(ID,list)
        return HttpResponse(json.dumps(dict), content_type="application/json")
    except:
        return HttpResponse('error')


def del_data(request):
    id = request.GET['ID']
    try:
        filename = './static/download/' + id + '.csv'
        type = os.path.exists(filename)
        if type == True:
            os.remove(filename)
        Ali.objects.filter(num=id).delete()
        return HttpResponse('ok')
    except:
        return HttpResponse('error')


def deta(request):
    id = request.GET['ID']
    data = Ali.objects.get(num=id)
    ID = data.num
    list = []
    str1 = data.data[2:]
    str2 = str1[:-2]
    a = str2.split('], [')
    for i in a:
        i = i[1:]
        i = i[:-1]
        list.append(i.split("', '"))
    dict = {
        "ID": ID,
        "data": list
    }
    return HttpResponse(json.dumps(dict), content_type="application/json")


def find_sql(request):
    id = request.GET['ID']
    try:
        data = Ali.objects.get(num=id)
        id = data.num
        title = data.title
        data = {
            "ID": id,
            "title": title,
        }
        return HttpResponse(json.dumps(data), content_type="application/json")
    except:
        return HttpResponse('error')


def create(request):
    return render(request, 'adminList.html')


@csrf_exempt
def save(request):
    try:
        bs1 = request.POST['data']
        bs2 = base64.urlsafe_b64decode(bs1)
        list1 = base64.urlsafe_b64decode(bs2).decode()
        id = request.POST['id']
        ref = request.META['HTTP_REFERER']
        dict = ali_id.get_freight(id)
        try:
            ref = re.findall(r'https://.*?/(.*?)/', ref)[0]
        except:
            ref = ''
        all_list = []
        str1 = list1[2:]
        str2 = str1[:-2]
        a = str2.split('],[')
        for i in a:
            i = i[1:]
            i = i[:-1]
            all_list.append(i.split('","'))
        showimg = ali_id.showimg(id)
        Stock = ''
        for i in range(len(all_list[0])):
            if all_list[0][i] == 'Stock':
                Stock = all_list[1][i]
        if ref == '':
            Ali.objects.filter(num=id).delete()
            title = all_list[1][0]
            data = Ali(num=id, data=all_list, title=title, stock=Stock, showimg=showimg, type='2', dict=dict)
            data.save()
            try:
                os.remove('./static/download/Ali/' + id + '.csv')
            except:
                pass
        else:
            try:
                Ali.objects.get(num=id)
                return HttpResponse('have')
            except:
                title = all_list[1][0]
                data = Ali(num=id, data=all_list, title=title, stock=Stock, showimg=showimg, type='1', dict=dict)
                data.save()
        return HttpResponse('ok')
    except:
        return HttpResponse('error')


@csrf_exempt
def Prepare(request):
    data = request.POST['ids']
    id = data.split('编号')[0]
    data = data.split('编号')[1]
    all_list = []
    list = data.split('分行')[:-1]
    for i in list:
        all_list.append(i.split('分列')[:-1])
    showimg = ali_id.showimg(id)
    try:
        Ali_Prepare.objects.filter(num=id).delete()
        title = all_list[1][0]
        data = Ali_Prepare(num=id, data=all_list, title=title, showimg=showimg)
        data.save()
    except:
        title = all_list[1][0]
        data = Ali_Prepare(num=id, data=all_list, title=title, showimg=showimg)
        data.save()
    return HttpResponse('ok')

@csrf_exempt
def download_csv(request):
    try:
        id = request.POST['id']
        data = Ali.objects.get(num=id)
        list = []
        str1 = data.data[2:]
        str2 = str1[:-2]
        a = str2.split('], [')
        for i in a:
            i = i[1:]
            i = i[:-1]
            list.append(i.split("', '"))
        write_csv(id,list)
        return HttpResponse('ok')
    except:
        return HttpResponse('error')

def write_csv(ID, list):
    filename = './static/download/csv/' + ID + '.csv'
    type = os.path.exists(filename)
    if type == True:
        os.remove(filename)
    out = open(filename, 'a', newline='')
    csv_writer = csv.writer(out, dialect='excel')
    for i in list:
        csv_writer.writerow(i)
    out.close()


def login(request):
    if request.method == 'GET':
        res = render(request, 'login.html')
        try:
            res.delete_cookie("user_info")
        except:
            pass
        try:
            ref = request.META['HTTP_REFERER']
            rl = re.findall(r'http://.*?:(.*?)/', ref)[0]
            if rl != '8000':
                rl = '/'
            else:
                rl = ref
        except:
            rl = '/'
        res.set_cookie('refer', rl)
        return res
    else:
        res = HttpResponse('asd')
        uname = request.POST['uname']
        upwd = request.POST['upw']
        if uname == 'admin' and upwd == '123456':
            res.set_cookie('user_info', str, max_age=60 * 60 * 24 * 30)
            return res
        else:
            return HttpResponse('error')


@csrf_exempt
def sel(request):
    name = request.POST['ids']
    id = request.POST['id']
    try:
        data = Ali.objects.get(num=id)
        list = []
        str1 = data.data[2:]
        str2 = str1[:-2]
        a = str2.split('], [')
        for i in a:
            i = i[1:]
            i = i[:-1]
            list.append(i.split("', '"))
    except:
        list = ali_id.get_data(id)
    list1 = []
    a = ''
    for i in range(len(list[0])):
        if list[0][i] == name:
            for x in list[1:]:
                if x[i] != a:
                    list1.append(x[i])
                    a = x[i]
    dict = {
        "list": list1
    }
    return HttpResponse(json.dumps(dict), content_type="application/json")


@csrf_exempt
def sel2(request):
    name = request.POST['ids']
    id = request.POST['id']
    try:
        data = Ali.objects.get(num=id)
        list = []
        str1 = data.data[2:]
        str2 = str1[:-2]
        a = str2.split('], [')
        for i in a:
            i = i[1:]
            i = i[:-1]
            list.append(i.split("', '"))
    except:
        list = ali_id.get_data(id)
    list1 = []
    for i in list:
        if name in i:
            list1.append(i)
    dict = {
        "list": list1
    }
    return HttpResponse(json.dumps(dict), content_type="application/json")


@csrf_exempt
def save2(request):
    try:
        name = request.POST['sel3']
        sel2 = request.POST['sel2']
        id = request.POST['id']
        inp = request.POST['in']
        data = Ali.objects.get(num=id)
        list = []
        str1 = data.data[2:]
        str2 = str1[:-2]
        a = str2.split('], [')
        for i in a:
            i = i[1:]
            i = i[:-1]
            list.append(i.split("', '"))
        for i in range(len(list[0])):
            if list[0][i] == name:
                for x in list:
                    if sel2 in x:
                        x[i] = inp
        data.data = list
        data.title = list[1][0]
        data.save()
        dict = {
            "ID": id,
            "data": list
        }
        return HttpResponse(json.dumps(dict), content_type="application/json")
    except:
        return HttpResponse('error')


@csrf_exempt
def edit(request):
    id = request.POST['id']
    data = Ali.objects.get(num=id)
    list = []
    str1 = data.data[2:]
    str2 = str1[:-2]
    a = str2.split('], [')
    for i in a:
        i = i[1:]
        i = i[:-1]
        list.append(i.split("', '"))
    dict = {
        "ID": id,
        "data": list
    }
    return HttpResponse(json.dumps(dict), content_type="application/json")


@csrf_exempt
def type(request):
    try:
        page = int(request.POST['page'])
    except:
        page = 1
    if page == 0:
        page = 1
    elif page < 0:
        page = -page
    start = (page - 1) * 5
    end = page * 5
    type = request.POST['type']
    if type == "Original data":
        data = Ali.objects.filter(type='1').order_by('-id')
    else:
        data = Ali.objects.filter(type='2').order_by('-id')
    list = []
    for i in data:
        list.append([i.num, i.title, i.showimg, i.stock])
    if len(data) == (len(data)//5) * 5:
        page = len(data)//5
    else:
        page = len(data)//5 +1
    dict = {
        "page": page,
        "len":  len(data),
        "data": list[start:end]
    }
    return HttpResponse(json.dumps(dict), content_type="application/json")


@csrf_exempt
def Json(request):
    ID = request.POST['id']
    data = Ali.objects.get(num=ID)
    list = []
    str1 = data.data[2:]
    str2 = str1[:-2]
    a = str2.split('], [')
    for i in a:
        i = i[1:]
        i = i[:-1]
        list.append(i.split("', '"))
    dict = {}
    start = 0
    end = 0
    for i in range(len(list[0])):
        list[0][i] = '_'.join(list[0][i].split(' '))
        if list[0][i] == 'Stock':
            start = i + 1
        elif list[0][i] == 'storeName':
            end = i - 1
    availQuantity = []
    for i in range(len(list[0])):
        for x in list[1:]:
            if i < start:
                dict[list[0][i]] = x[i]
            elif i > end:
                dict[list[0][i]] = x[i]
            elif start <= i <= end:
                list1 = []
                for y in range(start, end + 1):
                    list1.append(x[y])
                if list1 not in availQuantity:
                    availQuantity.append(list1)
    dict['availQuantity'] = availQuantity
    filename = './static/download/Json/' + ID + '.json'
    type = os.path.exists(filename)
    if type == True:
        os.remove(filename)
    with open(filename, "w") as f:
        json.dump(dict, f)
    return HttpResponse('ok')


@csrf_exempt
def Traversy(request):
    try:
        id = request.POST['id']
        dict = ali_id.get_freight(id)
        try:
            data = Ali.objects.get(num=id)
            return HttpResponse('have')
        except:
            list = ali_id.get_data(id)
            showimg = ali_id.showimg(id)
            title = list[1][0]
            Stock = ''
            for i in range(len(list[0])):
                if list[0][i] == 'Stock':
                    Stock = list[1][i]
            data = Ali(num=id, data=list, title=title, stock=Stock, showimg=showimg, type='1', dict=dict)
            data.save()
            return HttpResponse('ok')
    except:
        return HttpResponse('error')


@csrf_exempt
def checked_csv(request):
    try:
        bs1 = request.POST['data']
        bs2 = base64.urlsafe_b64decode(bs1)
        list1 = base64.urlsafe_b64decode(bs2).decode()
        list = []
        str1 = list1[2:]
        str2 = str1[:-2]
        a = str2.split('],[')
        for i in a:
            i = i[1:]
            i = i[:-1]
            list.append(i.split('","'))
        ID = request.POST['id']
        filename = './static/download/checked-csv/' + ID + '.csv'
        type = os.path.exists(filename)
        if type == True:
            os.remove(filename)
        out = open(filename, 'a', newline='')
        csv_writer = csv.writer(out, dialect='excel')
        for i in list:
            csv_writer.writerow(i)
        return HttpResponse('ok')
    except:
        return HttpResponse('error')

@csrf_exempt
def wish(request):
    try:
        id = request.POST['id']
        data = Ali.objects.get(num=id)
        list = []
        str1 = data.data[2:]
        str2 = str1[:-2]
        a = str2.split('], [')
        for i in a:
            i = i[1:]
            i = i[:-1]
            list.append(i.split("', '"))
        wish_csv(id,list)
        return HttpResponse('ok')
    except:
       return HttpResponse('error')

@csrf_exempt
def checked_wish_csv(request):
    try:
        bs1 = request.POST['data']
        bs2 = base64.urlsafe_b64decode(bs1)
        list1= base64.urlsafe_b64decode(bs2).decode()
        list = []
        str1 = list1[2:]
        str2 = str1[:-2]
        a = str2.split('],[')
        for i in a:
            i = i[1:]
            i = i[:-1]
            list.append(i.split('","'))
        ID = request.POST['id']
        wish_csv(ID,list)
        return HttpResponse('ok')
    except:
        return HttpResponse('error')


def wish_csv(ID,data_list):
    img_data_list = []
    for x in range(len(data_list[1:])):
        x += 1
        for y in range(len(data_list[0])):
            if data_list[0][y] == 'imgUrl':
                img_data_list.append(data_list[x][y])
    img = set(img_data_list)
    img_data_list = list(img)
    img_name_list = []
    for i in range(len(img_data_list)):
        img_name_list.append('Extra Image URL '+str(i))
    data = Ali.objects.get(num=ID)
    str1 = data.dict
    list2 = re.findall(r"'(.*?)': '(.*?)'",str1)
    dict = {}
    for i in list2:
        dict[i[0]] = i[1]
    showimg = data.showimg
    filename = './static/download/wish-csv/' + ID + '.csv'
    type = os.path.exists(filename)
    if type == True:
        os.remove(filename)
    out = open(filename, 'a', newline='',encoding='utf-8-sig')
    csv_writer = csv.writer(out, dialect='excel')
    name_data_list = ['Parent Unique ID','*Unique ID','*Product Name','Declared Name','Declared Local Name','Localized Price','Local Currency Code','Color','Size','*Quantity','*Tags','Description','Localized Shipping',
                 'Shipping Time(enter without " ", just the estimated days )','*Main Image URL','Clean Image URL']
    for i in img_name_list:
        name_data_list.append(i)
    for i in ['Pieces','Package Length ','Package Width ','Package Height ','Package Weight ','Country Of Origin','Contains Powder','Contains Liquid ','Contains Battery',' Contains Metal','Custom Declared Value','Custom HS Code']:
        name_data_list.append(i)
    csv_writer.writerow(name_data_list)
    for i in range(len(data_list[1:])):
        i += 1
        data_data_list = []
        for x in range(len(name_data_list)):
            if name_data_list[x] == 'Parent Unique ID':
                data_data_list.append(ID)
            elif name_data_list[x] == '*Unique ID':
                unique = str(ID)
                for y in range(len(data_list[0])):
                    if 'Color' in data_list[0][y] or 'color' in data_list[0][y]:
                        rem = re.findall(r'.*?(-\d+)',data_list[i][y])[-1]
                        # color = re.findall(r'(.*?)-\d+',data_list[i][y])[0]
                        unique += '_'+data_list[i][y].replace(rem, '')
                    elif 'Size' in data_list[0][y] or 'size' in data_list[0][y]:
                        rem = re.findall(r'.*?(-\d+)', data_list[i][y])[-1]
                        # size = re.findall(r'(.*?)-\d+',data_list[i][y])[0]
                        # unique += '_'+size
                        unique += '_'+data_list[i][y].replace(rem, '')
                data_data_list.append(unique)
            elif name_data_list[x] =='*Product Name':
                for y in range(len(data_list[0])):
                    if data_list[0][y] == 'product Name':
                        Name = data_list[i][y].replace('free shipping', '')
                        Name = Name.replace('Free Shipping', '')
                        Name = Name.replace('Free shipping', '')
                        Name = Name.replace('\\', '')
                        data_data_list.append(Name)
            elif name_data_list[x] =='Declared Name' or name_data_list[x] == 'Declared Local Name':
                data_data_list.append(dict['Declared Name'])
            elif name_data_list[x] == 'Pieces':
                data_data_list.append(' ')
            elif name_data_list[x] == 'Color':
                c = 1
                for y in range(len(data_list[0])):
                    if 'Color' in data_list[0][y] or 'color' in data_list[0][y]:
                        # color = re.findall(r'(.*?)-\d+',data_list[i][y])[0]
                        rem = re.findall(r'.*?(-\d+)', data_list[i][y])[-1]
                        data_data_list.append(data_list[i][y].replace(rem, ''))
                        c = 2
                if c == 1:
                    data_data_list.append(' ')
            elif name_data_list[x] == 'Size':
                s = 1
                for y in range(len(data_list[0])):
                    if 'Size' in data_list[0][y] or 'size' in data_list[0][y]:
                        # size = re.findall(r'(.*?)-\d+',data_list[i][y])[0]
                        rem = re.findall(r'.*?(-\d+)', data_list[i][y])[-1]
                        data_data_list.append(data_list[i][y].replace(rem, ''))
                        s = 2
                if s == 1:
                    data_data_list.append(' ')
            elif name_data_list[x] == '*Quantity':
                Q = 1
                for y in range(len(data_list[0])):
                    if data_list[0][y] == 'Inventory':
                        data_data_list.append(data_list[i][y])
                        Q = 2
                if Q == 1:
                    data_data_list.append('')
            elif name_data_list[x] == '*Tags':
                Name = dict['*Tags'].replace('free shipping', '')
                Name = Name.replace('Free Shipping', '')
                Name = Name.replace('Free shipping', '')
                Name = Name.replace('\\', '')
                data_data_list.append(Name)
            elif name_data_list[x] == 'Description':
                Name = dict['Description'].replace('free shipping', '')
                Name = Name.replace('Free Shipping', '')
                Name = Name.replace('Free shipping', '')
                Name = Name.replace('\\', '')
                data_data_list.append(Name)
                # data_data_list.append(dict['Description'])
            elif name_data_list[x] == 'Localized Price':
                try:
                    price = dict['*Price'].replace(',', '')
                    money = float(price)*7.0164
                    data_data_list.append('%.2f' % money)
                except:
                    price = dict['*Price'].replace(' ', '')
                    list1 = price.split('-')
                    price_list = []
                    for cc in list1:
                        money = '%.2f' % (float(cc) * 7.0164)
                        price_list.append(money)
                    price = '-'.join(price_list)
                    data_data_list.append(price)
            elif name_data_list[x] == 'Local Currency Code':
                data_data_list.append('CNY')
            elif name_data_list[x] == 'Localized Shipping':
                data_data_list.append('15')
            elif name_data_list[x] == '*Main Image URL':
                data_data_list.append(showimg)
            elif name_data_list[x] == 'Clean Image URL':
                data_data_list.append(showimg)
                for q in range(len(img_name_list)):
                    if img_data_list[q] == 'no images':
                        data_data_list.append('')
                    else:
                        data_data_list.append(img_data_list[q])
            elif name_data_list[x] == 'Country Of Origin':
                try:
                    data_data_list[x] = dict['Country Of Origin']
                except:
                    data_data_list.append(dict['Country Of Origin'])
            elif name_data_list[x] == 'Shipping Time(enter without " ", just the estimated days )':
                data_data_list.append('15-30')
            else:
                data_data_list.append(' ')
        print('datadata',data_data_list[7])
        csv_writer.writerow(data_data_list)
    out.close()


def order_json(request,id):
    try:
        list = ali_id.get_data(id)
        dict = {}
        start = 0
        end = 0
        for i in range(len(list[0])):
            list[0][i] = '_'.join(list[0][i].split(' '))
            if list[0][i] == 'Stock':
                start = i + 1
            elif list[0][i] == 'storeName':
                end = i - 1
        availQuantity = []
        for i in range(len(list[0])):
            for x in list[1:]:
                if i < start:
                    dict[list[0][i]] = x[i]
                elif i > end:
                    dict[list[0][i]] = x[i]
                elif start <= i <= end:
                    list1 = []
                    for y in range(start, end + 1):
                        list1.append(x[y])
                    if list1 not in availQuantity:
                        availQuantity.append(list1)
        dict['availQuantity'] = availQuantity
        dict2 = ali_id.get_freight(id)
        dict['freight'] = dict2
        return HttpResponse(json.dumps(dict), content_type="application/json")
    except:
        return HttpResponse('API call failed!Please check the item ID!')

@csrf_exempt
def imgViews(request):
    try:
        file_img = request.FILES.get('files', None)
        host = request.POST.get('host')
        file = save_image(host,file_img)
        return HttpResponse(file)
    except:
        return HttpResponse('error')

# 定义一个保存图片的方法
def save_image(host,files):
    name = (base64.b32encode(str(time.time()).encode('utf-8'))).decode('utf-8')
    filename = "%s.%s" % (name, files.name.split('.')[-1])
    full_filename = "%s/%s" % ('./static/upload/img', filename)
    with open(full_filename, 'wb+') as destination:
        for chunk in files.chunks():
            destination.write(chunk)
    return 'https://'+host+'/static/upload/img/'+filename

@csrf_exempt
def change_show(request):
    try:
        file_img = request.FILES.get('files', None)
        id = request.POST.get('ID')
        host = request.POST.get('host')
        file = save_image(host,file_img)
        data = Ali.objects.get(num = id)
        data.showimg=file
        data.save()
        return HttpResponse(file)
    except:
        return HttpResponse('error')

@csrf_exempt
def country(request):
    try:
        id = request.POST.get('id')
        try:
            import multiprocessing
            q = multiprocessing.Queue()
            p = Process(target=Data.get_page, args=(Data(),id,q))
            p.start()
            p.join()
            list1 = q.get()
        except:
            return HttpResponse('error')
        dict = {}
        for i in list1:
            dict[i[0]] = i[1]
        return HttpResponse(json.dumps(dict), content_type="application/json")
    except:
        return HttpResponse('error')