import pymysql
from datetime import datetime
import jwt


class RecordModel:
    def __init__(self):
        self.db = pymysql.connect(host='localhost', user='root', password='1234', db='test', charset='utf8')
        
    def insert_record(self, id, content, keywords):
        with self.db.cursor() as cursor:
            sql = """
            INSERT INTO mind_record (id, mind_time, open_close, content, sympathy, negative_content, keyword) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """
            mind_time = datetime.now()
            open_close = 1  # 기본값
            sympathy = 0  # 기본값
            negative_content = ""  # 기본값
            keywords_str = ', '.join(keywords)  # 문자 배열 합치기
            cursor.execute(sql, (id, mind_time, open_close, content, sympathy, negative_content, keywords_str))
        self.db.commit()
    
    def serialize(self):
        return {
            "id": self.id,
            "mind_time": self.mind_time,
            "open_close": self.open_close,
            "content": self.content,
            "sympathy": self.sympathy,
            "negative_content": self.negative_content,
            "keywords_str": self.keywords_str
        }

class RecordData :
    
    def __init__(self, record=None):
        if record:
            self.id = record['id']
            self.mind_time = record['mind_time']
            self.open_close = record['open_close'] 
            self.content = record['content']
            self.sympathy = record['sympathy']
            self.negative_content = record['negative_content']
            self.keyword = record['keyword']
        else:
            self.id = None
            self.mind_time = None
            self.open_close = None
            self.content = None
            self.sympathy = None
            self.negative_content = None
            self.keyword = None


    def serialize(self):
        return {
            "id": self.id,
            "mind_time": self.mind_time,
            "open_close": self.open_close,
            "content": self.content,
            "sympathy": self.sympathy,
            "negative_content": self.negative_content,
            "keyword": self.keyword
        }