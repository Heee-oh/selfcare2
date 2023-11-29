import pymysql
from datetime import datetime
import jwt


class RecordModel:
    def __init__(self):
        self.db = pymysql.connect(host='localhost', user='root', password='1234', db='test', charset='utf8')
        
    def insert_record(self, id, content, keywords, situationi, anonymous, image_data, content_happy):
        with self.db.cursor() as cursor:
            sql = """
            INSERT INTO mind_record (id, mind_time, open_close, content, sympathy, situation, keyword, image, happy, comment_count) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """
            mind_time = datetime.now()
            open_close = anonymous  # 기본값
            sympathy = 0  # 기본값
            situation =  ', '.join(situationi)  # 기본값
            happy = content_happy
            keywords_str = ', '.join(keywords)  # 문자 배열 합치기
            comment_count = 0  # 기본값
            cursor.execute(sql, (id, mind_time, open_close, content, sympathy, situation, keywords_str, image_data, happy, comment_count))
        self.db.commit()

    def serialize(self):
        return {
            "id": self.id,
            "mind_time": self.mind_time,
            "open_close": self.open_close,
            "content": self.content,
            "sympathy": self.sympathy,
            "situation": self.situation,
            "keyword": self.keyword,
            "happy": self.happy,
            "image": self.image,
            "comment_count": self.comment_count 
        }
    
    # def get_all_records_open(self):
    #     with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
    #         sql = "SELECT * FROM mind_record WHERE open_close = 1 ORDER BY mr_id DESC"
    #         cursor.execute(sql)
    #         records = cursor.fetchall()

    #     return [RecordData(record) for record in records]

    def get_all_records_open(self, page=1, per_page=10):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT * FROM mind_record WHERE open_close = 1 ORDER BY mr_id LIMIT %s OFFSET %s"
            cursor.execute(sql, (per_page, (page - 1) * per_page))
            records = cursor.fetchall()

        return [RecordData(record) for record in records]


    def get_all_records(self):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT * FROM mind_record"
            cursor.execute(sql)
            records = cursor.fetchall()

        return [RecordData(record) for record in records]
    
    def get_all_like_records(self):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT * FROM mind_record ORDER BY sympathy DESC LIMIT 10"
            cursor.execute(sql)
            records = cursor.fetchall()

        return [RecordData(record) for record in records]
    
    def get_my_today_records(self):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT * FROM mind_record WHERE DATE(mind_time) = DATE(NOW())"
            cursor.execute(sql)
            records = cursor.fetchall()

        return [RecordData(record) for record in records]
    
    def delete_record(self, mr_id):
        try:
            with self.db.cursor() as cursor:
                sql = "DELETE FROM mind_record WHERE mr_id = %s"
                cursor.execute(sql, (mr_id,))
            self.db.commit()
            return True
        except:
            return False
        

    def get_record(self, mr_id):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT * FROM mind_record WHERE mr_id = %s"
            cursor.execute(sql, (mr_id,))
            record = cursor.fetchone()

        return RecordData(record)
    
    def update_sympathy(self, mr_id, increment):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            # Fetch the record
            sql = "SELECT sympathy FROM mind_record WHERE mr_id = %s"
            cursor.execute(sql, (mr_id,))
            record = cursor.fetchone()

            if record is None:
                return None

            new_sympathy = record['sympathy'] + 1 if increment else record['sympathy'] - 1

        # Update the sympathy value
            sql = "UPDATE mind_record SET sympathy = %s WHERE mr_id = %s"
            cursor.execute(sql, (new_sympathy, mr_id))
        self.db.commit()

        return new_sympathy
    

    # def serialize(self):
    #     return {
    #         "id": self.id,
    #         "mind_time": self.mind_time,
    #         "open_close": self.open_close,
    #         "content": self.content,
    #         "sympathy": self.sympathy,
    #         "negative_content": self.negative_content,
    #         "keywords_str": self.keywords_str
    #     }

class CommentModel:
    def __init__(self):
        self.db = pymysql.connect(host='localhost', user='root', password='1234', db='test', charset='utf8')

    def add_comment(self, post_user_id, mr_id, content):
        with self.db.cursor() as cursor:
            # Insert the new comment
            sql = """
            INSERT INTO comment_table (id, mr_id, comment)
            VALUES (%s, %s,%s)
            """
            cursor.execute(sql, (post_user_id, mr_id,content))
            self.db.commit()

            # Get the ID of the new comment
            new_comment_id = cursor.lastrowid

            # Update the comment count in the mind_record table
            sql = """
            UPDATE mind_record
            SET comment_count = comment_count + 1
            WHERE mr_id = %s
            """
            cursor.execute(sql, (mr_id,))
            self.db.commit()

        return new_comment_id
    


class RecordData :
    
    def __init__(self, record=None):
        if record:
            self.id = record['id']
            self.mr_id = record['mr_id']
            self.mind_time = record['mind_time']
            self.open_close = record['open_close'] 
            self.content = record['content']
            self.sympathy = record['sympathy']
            self.situation = record['situation']
            self.keyword = record['keyword']
            self.happy = record['happy']
            self.image = record['image']
            self.comment_count = record['comment_count']  
        else:
            self.id = None
            self.mr_id = None
            self.mind_time = None
            self.open_close = None
            self.content = None
            self.sympathy = None
            self.situation = None
            self.keyword = None
            self.happy = None
            self.image = None
            self.comment_count = None  

    def serialize(self):
        return {
            "id": self.id,
            "mr_id": self.mr_id,
            "mind_time": self.mind_time,
            "open_close": self.open_close,
            "content": self.content,
            "sympathy": self.sympathy,
            "situation": self.situation,
            "keyword": self.keyword,
            "happy": self.happy,
            "image": self.image,
            "comment_count": self.comment_count 
        }