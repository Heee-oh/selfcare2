from tinydb import TinyDB, Query
import pymysql


import json



class UserModel:
    def __init__(self):
        self.db = pymysql.connect(host='127.0.0.1', user='root', password='qhrwl123', db='test', charset='utf8')

    def upsert_user(self, user):
        with self.db.cursor() as cursor:
            sql = "INSERT INTO users (id, nickname, profile, thumbnail) VALUES (%s, %s, %s, %s) ON DUPLICATE KEY UPDATE nickname=%s, profile=%s, thumbnail=%s"
            cursor.execute(sql, (user.id, user.nickname, user.profile, user.thumbnail, user.nickname, user.profile, user.thumbnail))
        self.db.commit()

    def get_user(self, user_id):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            sql = "SELECT * FROM users WHERE id=%s"
            cursor.execute(sql, (user_id,))
            result = cursor.fetchone()
        return UserData.deserialize(result) if result else None

    def remove_user(self, user_id):
        with self.db.cursor() as cursor:
            sql = "DELETE FROM users WHERE id=%s"
            cursor.execute(sql, (user_id,))
        self.db.commit()

# class UserModel:

#     def __init__(self, path='db.json'):
#         self.db = TinyDB(path)
        

#     def upsert_user(self, user):
#         if not self.db.search(Query().id == user.id):
#             self.db.insert(user.serialize())

#     def get_user(self, user_id):
#         user = self.db.search(Query().id == user_id)
#         return UserData.deserialize(user[0])

#     def remove_user(self, user_id):
#         self.db.remove(Query().id == user_id)


class UserData:
    # def __init__(self, user=None):
    #    if user and 'kakao_account' in user and 'profile' in user['kakao_account']:
    #        user_info = user['kakao_account']['profile']
    #        self.id = user['id']
    #        self.nickname = user_info['nickname']
    #        self.profile = user_info['profile_image_url']
    #        self.thumbnail = user_info['thumbnail_image_url']
    #    else:
    #        self.id = None
    #        self.nickname = None
    #        self.profile = None
    #        self.thumbnail = None
    
    def __init__(self, user=None):
        if user:
            user_info = user['kakao_account']['profile']
            self.id = user['id']
            self.nickname = user_info['nickname']
            self.profile = user_info['profile_image_url'] 
            self.thumbnail = user_info['thumbnail_image_url']
        else:
            self.id = None
            self.nickname = None
            self.profile = None
            self.thumbnail = None

    def __str__(self):
        return "<UserData>(id:%s, nickname:%s)" \
                % (self.id, self.nickname)

    def serialize(self):
        return {
            "id": self.id,
            "nickname": self.nickname,
            "profile": self.profile,
            "thumbnail": self.thumbnail
        }

    @staticmethod
    def deserialize(user_data):
        user = UserData()
        user.id = user_data['id']
        user.nickname = user_data['nickname']
        user.profile = user_data['profile']
        user.thumbnail = user_data['thumbnail']
        return user