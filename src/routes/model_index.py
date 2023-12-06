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
    
    # def get_all_records_open(self):
    #     with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
    #         sql = "SELECT * FROM mind_record WHERE open_close = 1 ORDER BY mr_id DESC"
    #         cursor.execute(sql)
    #         records = cursor.fetchall()

    #     return [RecordData(record) for record in records]

    def get_all_records_open(self, page=1, per_page=10):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT * FROM mind_record WHERE open_close = 1 ORDER BY mr_id DESC LIMIT %s OFFSET %s"
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
    def get_my_today_records(self, id):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            # sql = "SELECT * FROM mind_record WHERE DATE(mind_time) = DATE(NOW())"
            sql = "SELECT * FROM mind_record WHERE DATE(mind_time) = DATE(NOW()) AND id = %s"
            cursor.execute(sql,(id,))
            records = cursor.fetchall()

        return [RecordData(record) for record in records]
        
    # def get_my_today_records(self):
    #     with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
    #         sql = "SELECT * FROM mind_record WHERE DATE(mind_time) = DATE(NOW())"
    #         cursor.execute(sql)
    #         records = cursor.fetchall()

    #     return [RecordData(record) for record in records]
    
    # 특정 게시물 삭제 (mr_id)
    def delete_record(self, mr_id):
        try:
            with self.db.cursor() as cursor:
                sql = "DELETE FROM mind_record WHERE mr_id = %s"
                cursor.execute(sql, (mr_id,))
            self.db.commit()
            return True
        except:
            return False
        
    # 특정 게시물 get
    def get_record(self, mr_id):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT * FROM mind_record WHERE mr_id = %s"
            cursor.execute(sql, (mr_id,))
            record = cursor.fetchone()

        return RecordData(record)
    
    #좋아요 
    def update_sympathy(self, mr_id, increment):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            # Fetch the record
            sql = "SELECT sympathy FROM mind_record WHERE mr_id = %s"
            cursor.execute(sql, (mr_id,))
            record = cursor.fetchone()

            if record is None:
                return None

            new_sympathy = record['sympathy'] + 1 if increment else record['sympathy'] - 1

 
            sql = "UPDATE mind_record SET sympathy = %s WHERE mr_id = %s"
            cursor.execute(sql, (new_sympathy, mr_id))
        self.db.commit()

        return new_sympathy
    
    def get_like(self, mr_id):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT sympathy FROM mind_record WHERE mr_id = %s"
            cursor.execute(sql, (mr_id,))
            result = cursor.fetchone()
            if result:
                return result['sympathy']
            else:
                return None
    
    def update_record(self, mr_id, content, keywords, situationi, anonymous, image_data, content_happy):
        with self.db.cursor() as cursor:
            sql = """
            UPDATE mind_record
            SET content = %s, situation = %s, keyword = %s, image = %s, happy = %s, open_close = %s, mind_time = %s
            WHERE mr_id = %s
            """
            mind_time = datetime.now()
            open_close = anonymous  # 기본값
            situation =  ', '.join(situationi)  # 기본값
            keywords_str = ', '.join(keywords)  # 문자 배열 합치기
            cursor.execute(sql, (content, situation, keywords_str, image_data, content_happy, open_close, mind_time,mr_id))
        self.db.commit()
    
        
    # 년도, 달에 따른 게시물 가져오기
    def get_records_by_month(self, year, month, user_id):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT * FROM mind_record WHERE YEAR(mind_time) = %s AND MONTH(mind_time) = %s AND id = %s"
            cursor.execute(sql, (year, month, user_id))
            records = cursor.fetchall()

        return [RecordData(record) for record in records]

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
 
            sql = """
            INSERT INTO comment_table (id, mr_id, comment)
            VALUES (%s, %s,%s)
            """
            cursor.execute(sql, (post_user_id, mr_id,content))
            self.db.commit()


            new_comment_id = cursor.lastrowid

            sql = """
            UPDATE mind_record
            SET comment_count = comment_count + 1
            WHERE mr_id = %s
            """
            cursor.execute(sql, (mr_id,))
            self.db.commit()

        return new_comment_id
    
    def get_comment(self, mr_id):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT * FROM comment_table WHERE mr_id = %s ORDER BY comment_id"
            cursor.execute(sql, (mr_id,))
            comments = cursor.fetchall()

        return [CommentData(comment) for comment in comments]
    
        
    # id에 따른 사용자의 댓글 삭제 
    def delete_comment(self, comment_id):
        try:
            with self.db.cursor() as cursor:
                sql = "DELETE FROM comment_table WHERE comment_id = %s"
                cursor.execute(sql, (comment_id,))
            self.db.commit()

            return True
        except:
            return False
        
class CommentData:
    def __init__(self, comment=None):
        if comment:
            self.id = comment['id']
            self.mr_id = comment['mr_id']
            self.comment = comment['comment']
            self.comment_id = comment['comment_id']
        else:
            self.id = None
            self.mr_id = None
            self.comment = None
            self.comment_id = None

        # Add any additional methods or properties as needed

    def serialize(self):
        return {
            "id": self.id,
            "mr_id": self.mr_id,
            "comment": self.comment,
            "comment_id": self.comment_id
        }



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