import pymysql
from datetime import datetime
import jwt


class RecordModel:
    def __init__(self):
        self.db = pymysql.connect(host='localhost', user='root', password='qhrwl123', db='test', charset='utf8')
    
    def insert_record(self, id, content, keywords):
        with self.db.cursor() as cursor:
            sql = """
            INSERT INTO mind_recordv_1 (id, mind_time, open_close, content, sympathy, negative_content, keyword) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            mind_time = datetime.now()
            open_close = 1  # 기본값
            sympathy = 0  # 기본값
            negative_content = ""  # 기본값
            keywords_str = ', '.join(keywords)  # 문자 배열 합치기
            cursor.execute(sql, (id, mind_time, open_close, content, sympathy, negative_content, keywords_str))
        self.db.commit()