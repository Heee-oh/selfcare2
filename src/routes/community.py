from functools import wraps
from flask import Blueprint, jsonify, redirect, render_template, make_response, Flask, session, request
import pandas as pd
import pymysql
from .model_index import RecordModel,RecordData, CommentModel
from .like_model import LikeData
from flask_jwt_extended import jwt_required, get_jwt_identity, jwt_refresh_token_required



community = Blueprint('community', __name__)



# @community.route('/community/data')
# def community_data():
#     # Create a RecordData object
#     record_data = RecordModel()

#     # Get all records from the database
#     records = record_data.get_all_records_open()

#     # Convert the records to a format suitable for the web page
#     records = [record.serialize() for record in records]

#     # Return the records as JSON
#     return jsonify(records)


@community.route('/community')
def community_home():
    return render_template('community.html')


@community.route('/community/data')
def get_data():
    page = request.args.get('page', default=1, type=int)
    per_page = 10  # Change this to your desired number of items per page

    record_data = RecordModel()
    records = record_data.get_all_records_open(page, per_page)

    return jsonify([record.serialize() for record in records])



@community.route('/community/<int:mr_id>')
def post_detail(mr_id):
    record_data = RecordModel()
    record = record_data.get_record(mr_id)

    return render_template('community_detail.html', record=record.serialize())





# @community.route('/update-sympathy', methods=['POST'])
# # @jwt_required
# def update_sympathy():
#     data = request.get_json()
#     mr_id = data['mr_id']
#     increment = data['increment']
#     record_data = RecordModel()
#     new_sympathy = record_data.update_sympathy(mr_id, increment)
#     if new_sympathy is None:
#         return jsonify(success=False, message="Record not found"), 404

#     return jsonify(success=True, sympathy=new_sympathy)


@community.route('/add-comment', methods=['POST'])
@jwt_required
def add_comment():
    data = request.get_json()
    mr_id = data['mr_id']
    userid = get_jwt_identity()
    comment = data['content']
    comment_data = CommentModel()

    new_comment = comment_data.add_comment(userid, mr_id, comment)
    if new_comment is None:
        return jsonify(success=False, message="Record not found"), 404
    else:
        return jsonify(success=True, message="Comment added successfully"), 200
    


@community.route('/get-comments/<int:mr_id>', methods=['GET'])
@jwt_required
def get_comments(mr_id):
    comment_data = CommentModel()
    comments = comment_data.get_comment(mr_id)
    id = get_jwt_identity()
    

    return jsonify(user_id=id, comments=[comment.serialize() for comment in comments])


@community.route('/delete_comment/<int:comment_id>/<int:mr_id>', methods=['DELETE'])
def delete_comment(comment_id, mr_id):
    comment_data = CommentModel()
    comment_data.delete_comment(comment_id, mr_id)

    return jsonify(success=True, message="Comment deleted successfully"), 200



@community.route('/get_like', methods=['POST'])
def get_like_route():
    data = request.get_json()
    mr_id = data.get('mr_id')  
    like_data = RecordModel()  
    sympathy = like_data.get_like(mr_id)

    return jsonify({'sympathy': sympathy})

@community.route('/like', methods=['POST'])
@jwt_required
def update_like():
    user_id = get_jwt_identity()  
    mr_id = request.json.get('mr_id')  

    like_data = LikeData()

    like = like_data.get_user_like(user_id, mr_id)
    if like:
        if like['like_ox'] == 1:  # Use like['like'] instead of like.like
            like_data.un_like(user_id, mr_id)
            return {'like': False }, 200
        else:
            like_data.like(user_id, mr_id)
            return {'like': True }, 200

    else:
        like_data.add_like(user_id, mr_id)
        return {'like': True}, 200
   

@community.route('/get_first_like', methods=['POST'])
@jwt_required
def get_first_like():
    data = request.get_json()
    mr_id = data.get('mr_id')  
    id = get_jwt_identity()
    like_data = LikeData()
    likeData = like_data.get_first_like(mr_id, id)
    try:
        return {'like': likeData['like_ox']}
    except TypeError:
        return {'like': None}