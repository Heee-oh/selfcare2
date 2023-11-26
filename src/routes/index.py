from functools import wraps
from flask import Blueprint, jsonify, redirect, render_template, make_response, Flask, session, request
import pandas as pd
import pymysql
from .model_index import RecordModel,RecordData
from flask_jwt_extended import jwt_required, get_jwt_identity, jwt_refresh_token_required


index_bp = Blueprint('index', __name__)


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'access_token' not in session:
            print('access_token not in session')
            return redirect('/')
        return f(*args, **kwargs)
    
    return decorated_function

@index_bp.route('/demo')
# @login_required
def home():
    return render_template('index.html')

@index_bp.route('/wbs')
# @login_required
def wbs():
    data = pd.read_csv('resource/wbs.csv')
    data = data.fillna('')  # Replace NaN values with an empty string
    data_dict = data.to_dict('records')
    return render_template('wbs.html', data=data_dict)

# @index_bp.route('/community')
# def community():
#     db = pymysql.connect(host='localhost', user='root', password='1234', db='test', charset='utf8')
    
#     with db.cursor() as cursor:
#         sql = "SELECT * FROM mind_recordv_1"
#         cursor.execute(sql)
#         records = cursor.fetchall()

#     record_objects = [RecordData(record).serialize() for record in records]
#     return jsonify(record_objects)



# @app.route("/login")
# def homeindex():
#     # 세션에서 Access Token 가져오기
#     access_token = session.get('access_token')

#     # Access Token으로 유저 정보 가져오기
#     if access_token:
#         user_info = Oauth().userinfo("Bearer " + access_token)
#         return render_template('index.html', user_info=user_info) #수정하고 싶은 페이지로 
    
#     # 가져온 유저 정보를 이용하여 홈페이지를 렌더링합니다.
#     return redirect('/')
    