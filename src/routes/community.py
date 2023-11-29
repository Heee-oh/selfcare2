from functools import wraps
from flask import Blueprint, jsonify, redirect, render_template, make_response, Flask, session, request
import pandas as pd
import pymysql
from .model_index import RecordModel,RecordData, CommentModel
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
    print(record)

    return render_template('community_detail.html', record=record.serialize())



@community.route('/update-sympathy', methods=['POST'])
# @jwt_required
def update_sympathy():
    data = request.get_json()
    mr_id = data['mr_id']
    increment = data['increment']
    record_data = RecordModel()
    new_sympathy = record_data.update_sympathy(mr_id, increment)
    if new_sympathy is None:
        return jsonify(success=False, message="Record not found"), 404

    return jsonify(success=True, sympathy=new_sympathy)


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
def get_comments(mr_id):
    comment_data = CommentModel()
    comments = comment_data.get_comment(mr_id)

    return jsonify(comments=[comment.serialize() for comment in comments])