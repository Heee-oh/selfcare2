import pymysql
from datetime import datetime


class LikeData:
    def __init__(self):
        self.db = pymysql.connect(host='localhost',
                                  user='root',
                                  password='qhrwl123',
                                  db='test',
                                  charset='utf8')

            
    def get_user_like(self, user_id, mr_id):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:  # Use DictCursor
            sql = """
            SELECT *
            FROM `like`
            WHERE user_id = %s AND mr_id = %s
            """
            cursor.execute(sql, (user_id, mr_id))
            result = cursor.fetchone()
            if result:
                return result  # Return the result directly
            else:
                return None
        
    def add_like(self, user_id, mr_id):
        with self.db.cursor() as cursor:
            sql = """
            INSERT INTO `like` (user_id, mr_id, like_ox)
            VALUES (%s, %s, %s)
            """
            like = 1
            cursor.execute(sql, (user_id, mr_id, like))
            self.db.commit()
            
            new_like_id = cursor.lastrowid
            
            sql = """
            UPDATE mind_record
            SET sympathy = sympathy + 1
            WHERE mr_id = %s
            """
            cursor.execute(sql, (mr_id,))
            self.db.commit()
            
            return new_like_id
        
    def un_like(self, user_id, mr_id):
        with self.db.cursor() as cursor:
            
            sql = """
            UPDATE `like`
            SET like_ox = 0
            WHERE mr_id = %s AND user_id = %s
            """
            cursor.execute(sql, (mr_id,user_id,))
            self.db.commit()
            
            sql = """
            UPDATE mind_record
            SET sympathy = sympathy - 1
            WHERE mr_id = %s
            """
            cursor.execute(sql, (mr_id,))
            self.db.commit()

    def like(self, user_id, mr_id):
        with self.db.cursor() as cursor:
            
            sql = """
            UPDATE `like`
            SET like_ox = 1
            WHERE mr_id = %s AND user_id = %s
            """
            cursor.execute(sql, (mr_id,user_id,))
            self.db.commit()
            
            sql = """
            UPDATE mind_record
            SET sympathy = sympathy + 1
            WHERE mr_id = %s
            """
            cursor.execute(sql, (mr_id,))
            self.db.commit()
    
    def get_first_like(self, mr_id, user_id):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = """
            SELECT *
            FROM `like`
            WHERE mr_id = %s AND user_id = %s
            """
            cursor.execute(sql, (mr_id,user_id))
            result = cursor.fetchone()
            if result:
                return result
            else:
                return None
            
    def serialize(self):
        return {
            "like_ox": self.like_ox,
            "mr_id": self.mr_id,
            "user_id": self.user_id,
        }