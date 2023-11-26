from functools import wraps
from flask import Blueprint, jsonify, redirect, render_template, make_response, Flask, session, request
import pandas as pd
import pymysql
from .model_index import RecordModel,RecordData
from flask_jwt_extended import jwt_required, get_jwt_identity, jwt_refresh_token_required


record = Blueprint('record', __name__)




@record.route('/test')
# @jwt_required
def test():
    return render_template('home.html')

@record.route('/test1')
# @jwt_required
def test1():
    return render_template('record_keyword.html')

@record.route('/test2')
# @jwt_required
def test2():
    return render_template('record_ situation.html')

@record.route('/test3')
# @jwt_required
def test3():
    return render_template('record_simple.html')

@record.route('/test4')
# @jwt_required
def test4():
    return render_template('record_3happy_reason.html')

@record.route('/test5')
# @jwt_required
def test5():
    return render_template('record_summary.html')

@record.route('/test6')
# @jwt_required
def test6():
    return render_template('record_upload.html')

@record.route('/save_data', methods=['POST'])
@jwt_required           # jwt 토큰 확인 (id확인용으로 필수)
def save_data():
    data = request.get_json()

    user_id = get_jwt_identity() #사용자 고유 id 

    print(data['keywords'])  # keywords 값 출력
    
    content = data['content']
    
    keywords = data['keywords']

    record_model = RecordModel()
    record_model.insert_record(user_id, content, keywords)

    return jsonify({'message': 'Data saved successfully'}), 200
