import pymysql
import time
from ali_id import stock


class Update(object):
    def __init__(self):
        # 连接数据库
        self.db = pymysql.connect("localhost", "root", "123456", "ali_data")
        # 创建游标
        self.cursor = self.db.cursor()

    def update_data(self):
        # 执行SQL语句
        self.cursor.execute("select num from Ali_ali")
        results = self.cursor.fetchall()
        sum = 0
        for i in results:
            try:
                a = stock(i[0])
            except:
                sum += 1
                continue
            self.cursor.execute("select data from Ali_ali where num = " + i[0])
            data = (self.cursor.fetchall())[0][0]
            list = []
            str1 = data[2:]
            str2 = str1[:-2]
            b = str2.split('], [')
            for z in b:
                z = z[1:]
                z = z[:-1]
                list.append(z.split("', '"))
            for y in range(len(list[0])):
                if list[0][y] == 'Stock':
                    for x in list[1:]:
                        x[y] = a
                    break
            s = str(list)
            try:
                # 执行SQL语句
                SQL = """update Ali_ali set stock = %s,data = "%s" where num = %s""" % (a, s, i[0])
                self.cursor.execute(SQL)
                # 提交到数据库执行
                self.db.commit()
            except:
                # 发生错误时回滚
                self.db.rollback()
                sum += 1
        if sum == 0:
            self.to_log('All Updated Successfully')
        else:
            self.to_log(str(sum) + ' Update failed')
        # 关闭数据库连接
        self.db.close()

    def to_log(self, str):
        str = time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time())) + ' ' + str + '\n'
        print(str)
        with open(r'../static/log/update.log', 'a') as f:
            f.write(str)
        f.close()


if __name__ == '__main__':
    while True:
        updata = Update()
        updata.update_data()
        time.sleep(5)
