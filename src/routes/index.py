from functools import wraps
from flask import Blueprint, redirect, render_template, make_response, Flask, session
from flask_restful import Api, Resource
import pandas as pd
import csv
from html import escape

app = Flask(__name__)

index_bp = Blueprint('index', __name__)
api = Api(index_bp)

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'access_token' not in session:
            print('access_token not in session')
            return redirect('/')
        return f(*args, **kwargs)
    
    return decorated_function

class Index(Resource):
    # @login_required
    def get(self):
        headers = {'Content-Type': 'text/html'}
        return make_response(render_template('index.html'), 200, headers)

@index_bp.route('/wbs')
# @login_required
def wbs():
    data = pd.read_csv('resource/wbs.csv')
    data = data.fillna('')  # Replace NaN values with an empty string
    data_dict = data.to_dict('records')
    return render_template('wbs.html', data=data_dict)


api.add_resource(Index, '/demo')
#api.add_resource(Index, '/home')

# api.add_resource(WBS, '/wbs')

# class WBS(Resource):
#     def get(self):
#         df = pd.read_csv('resource/wbs.csv', encoding='cp949')  # or 'euc-kr'
#         html = df.to_html()
#         headers = {'Content-Type': 'text/html'}
#         return make_response(html, 200, headers)