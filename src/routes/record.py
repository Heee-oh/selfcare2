import base64
import os
from functools import wraps
from flask import Blueprint, jsonify, redirect, render_template, make_response, Flask, session, request, url_for
import pandas as pd
import pymysql

from .model_index import RecordModel,RecordData, CommentModel

from .model_index import CommentModel, RecordModel,RecordData
from flask_jwt_extended import jwt_required, get_jwt_identity, jwt_refresh_token_required
from werkzeug.utils import secure_filename
from datetime import datetime
from werkzeug.utils import secure_filename
import os


record = Blueprint('record', __name__)




@record.route('/test')
@jwt_required
def test():
    record_data = RecordModel()
    user_id = get_jwt_identity()
    records = record_data.get_my_today_records(user_id)
    record = records[0].serialize() if records else None

    like_records = record_data.get_all_like_records()

    return render_template('home.html', record=record, like_records=like_records)

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



# 게시글 저장
@record.route('/save_data', methods=['POST'])
@jwt_required
def save_data():
    data = request.get_json()

    if data is None:
        return jsonify({'message': 'No data provided'}), 400

    user_id = get_jwt_identity()
    keywords = data.get('tags')
    content = data.get('content')
    situation = data.get('situation')
    anonymous = data.get('anonymous')
    image_data = data.get('imageData')
    content_happy = data.get('contenthappy')
    
    # 이미지 데이터를 파일로 저장
    if image_data:

        image_data = base64.b64decode(image_data.split(',')[1])
        now = datetime.now()
        formatted_now = now.strftime("%Y-%m-%d %H:%M:%S")

        filename = secure_filename(f'{user_id}_{formatted_now}.png')


        file_path = os.path.join('static', 'images', filename)


        with open(file_path, 'wb') as f:
            f.write(image_data)


        image_data = file_path

    record_model = RecordModel()
    # 파일 경로를 데이터베이스에 저장
    record_model.insert_record(user_id, content, keywords, situation, anonymous, image_data, content_happy)

    return jsonify({'message': 'Data saved successfully'}), 200

# 게시글 삭제
@record.route('/delete/<postId>', methods=['DELETE'])
def delete_post(postId):
    record_model = RecordModel()
    Comment_Model = CommentModel()
    # Comment_Model.delete_comment(postId)
    record_model.delete_record(postId)


    return jsonify({'message': 'Data deleted successfully'}), 200



@record.route('/update/<postId>', methods=['GET'])
def update_post(postId):
    record_model = RecordModel()
    record = record_model.get_record(postId)
    
    
    return jsonify(record=record.serialize())


@record.route('/update-post', methods=['GET'])
def update_upload():
    return render_template('u_record_upload.html')

@record.route('/update-post/<postId>', methods=['POST'])
def update_post_upload(postId):
    record_model = RecordModel()
    data = request.get_json()
    keywords = data.get('tags')
    content = data.get('content')
    situation = data.get('situation')
    anonymous = data.get('anonymous')
    image_data = data.get('imageData')
    content_happy = data.get('contenthappy')

    
        # 이미지 데이터를 파일로 저장
    if image_data:
        # Decode the image data
        image_data = base64.b64decode(image_data.split(',')[1])
        now = datetime.now()
        formatted_now = now.strftime("%Y-%m-%d %H:%M:%S")
        # Create a secure filename
        filename = secure_filename(f'{postId}_{formatted_now}.png')

        # Define the path to save the image
        file_path = os.path.join('static', 'images', filename)

        # Save the image data to a file
        with open(file_path, 'wb') as f:
            f.write(image_data)

        # Update the image_data variable to the file path
        image_data = file_path
    
    
    record_model.update_record(postId, content, keywords, situation, anonymous, image_data, content_happy)
    return jsonify({'message': 'Data updated successfully'}), 200


@record.route('/calendar/<int:year>/<int:month>')
@jwt_required
def calendar(year, month):
    record_data = RecordModel()
    user_id = get_jwt_identity()
    records = record_data.get_records_by_month(year, month, user_id)
    record_objects = [record.serialize() for record in records]
    return jsonify(records=record_objects)


@record.route('/calendar')
def calender():
    return render_template('calendar.html')



# @record.route('/save_data', methods=['POST'])
# @jwt_required           # jwt 토큰 확인 (id확인용으로 필수)
# def save_data():
#     data = request.get_json()

#     user_id = get_jwt_identity() #사용자 고유 id 

    
#     keywords = data['tags']
#     content = data['content']
#     situation = data['situation']
#     anonymous = data['anonymous']
#     image_data = data['image']
#     content_happy = data['contenthappy']

#     record_model = RecordModel()
#     record_model.insert_record(user_id, content, keywords,situation, anonymous, image_data, content_happy )


#     return jsonify({'message': 'Data saved successfully'}), 200






# # RecordModel 인스턴스 생성
# model = RecordModel()

# # 모든 레코드 가져오기
# records = model.get_all_records()

# # 각 레코드의 데이터 출력
# for record in records:
#     data = record.serialize()  # RecordData 객체를 딕셔너리로 변환
#     print(data)
