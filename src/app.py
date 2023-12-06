"""
Flask Kakao OAuth Application Sample
"""
import os
from flask import Flask, render_template, request, jsonify, make_response, session, redirect, url_for
from flask_jwt_extended import (
    JWTManager, create_access_token, 
    get_jwt_identity, jwt_required,
    set_access_cookies, set_refresh_cookies, 
    unset_jwt_cookies, create_refresh_token,
    jwt_refresh_token_required,
)
from config import CLIENT_ID, REDIRECT_URI
from controller import Oauth
from model import UserModel, UserData
from flask import Flask
from flask import Flask
from routes.index import index_bp
from routes.model_index import RecordModel
from routes.record import record
from routes.community import community






app = Flask(__name__)
app.secret_key = 'qhrwl12345'
app.config['JWT_SECRET_KEY'] = "I'M IML."
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = False
app.config['JWT_COOKIE_CSRF_PROTECT'] = True
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 3600 * 24

jwt = JWTManager(app)


app.register_blueprint(index_bp)
app.register_blueprint(record)
app.register_blueprint(community)


@app.route("/")
def index():
    return render_template('login.html')



@app.route("/oauth")
def oauth_api():
    """
    # OAuth API [GET]
    사용자로부터 authorization code를 인자로 받은 후,
    아래의 과정 수행함
    1. 전달받은 authorization code를 통해서
        access_token, refresh_token을 발급.
    2. access_token을 이용해서, Kakao에서 사용자 식별 정보 획득
    3. 해당 식별 정보를 서비스 DB에 저장 (회원가입)
    3-1. 만약 이미 있을 경우, (3) 과정 스킵
    4. 사용자 식별 id를 바탕으로 서비스 전용 access_token 생성
    """
    code = str(request.args.get('code'))
    
    oauth = Oauth()
    auth_info = oauth.auth(code)
    user = oauth.userinfo("Bearer " + auth_info['access_token'])
    
    user = UserData(user)
    UserModel().upsert_user(user)

    resp = make_response(render_template('login.html'))
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    session['access_token'] = access_token
    resp.set_cookie("logined", "true")
    set_access_cookies(resp, access_token)
    set_refresh_cookies(resp, refresh_token)

    return resp


@app.route('/token/refresh')
@jwt_refresh_token_required
def token_refresh_api():
    """
    Refresh Token을 이용한 Access Token 재발급
    """
    user_id = get_jwt_identity()
    resp = jsonify({'result': True})
    access_token = create_access_token(identity=user_id)
    set_access_cookies(resp, access_token)
    return resp


@app.route('/token/remove')
def token_remove_api():
    """
    Cookie에 등록된 Token 제거
    """
    resp = jsonify({'result': True})
    unset_jwt_cookies(resp)
    resp.delete_cookie('logined')
    return resp
    # return redirect('/')


@app.route("/userinfo")
@jwt_required
def userinfo():
    """
    Access Token을 이용한 DB에 저장된 사용자 정보 가져오기
    """
    user_id = get_jwt_identity()
    userinfo = UserModel().get_user(user_id).serialize()
    return jsonify(userinfo)


@app.route('/oauth/url')
def oauth_url_api():
    """
    Kakao OAuth URL 가져오기
    """
    return jsonify(
        kakao_oauth_url="https://kauth.kakao.com/oauth/authorize?client_id=%s&redirect_uri=%s&response_type=code" \
        % (CLIENT_ID, REDIRECT_URI)
    )


@app.route("/oauth/refresh", methods=['POST'])
def oauth_refesh_api():
    """
    # OAuth Refresh API
    refresh token을 인자로 받은 후,
    kakao에서 access_token 및 refresh_token을 재발급.
    (% refresh token의 경우, 
    유효기간이 1달 이상일 경우 결과에서 제외됨)
    """
    refresh_token = request.get_json()['refresh_token']
    result = Oauth().refresh(refresh_token)
    return jsonify(result)


@app.route("/oauth/userinfo", methods=['POST'])
def oauth_userinfo_api():
    """
    # OAuth Userinfo API
    kakao access token을 인자로 받은 후,
    kakao에서 해당 유저의 실제 Userinfo를 가져옴
    """
    access_token = request.get_json()['access_token']
    result = Oauth().userinfo("Bearer " + access_token)
    return jsonify(result)


@app.route("/logout")
def logout():
    return render_template('logout.html')

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
    

#
saved_score = 0

questions = [
    {"question_id": 1, "question_text": "출근하는 생각만 해도 짜증과 함께 가슴이 답답함을 느낀다."},
    {"question_id": 2, "question_text": "직장에서 칭찬을 들어도 썩 즐거운 기분이 들지 않는다."},
    {"question_id": 3, "question_text": "직장생활 외에 개인적인 생활이나 시간이 거의 없다."},
    {"question_id": 4, "question_text": "기력이 없고 쇠약해진 느낌이 든다."},
    {"question_id": 5, "question_text": "일하는 것에 심적 부담과 자신의 한계를 느낀다."},
    {"question_id": 6, "question_text": "충분한 시간의 잠을 자도 계속 피곤함을 느낀다."},
    {"question_id": 7, "question_text": "이전에는 그냥 넘어가던 일에도 화를 참을 수 없다."},
    {"question_id": 8, "question_text": "혼자 지내는 시간이 많아졌다."},
    {"question_id": 9, "question_text": "현재 업무에 대한 관심이 크게 줄었다."},
    {"question_id": 10, "question_text": "주변 사람에게 실망하는 일이 잦다."},
    {"question_id": 11, "question_text": "주변에서 고민이 많거나 아파보인다는 말을 자주 듣는다."},
    {"question_id": 12, "question_text": "성욕이 감소했다."},
    {"question_id": 13, "question_text": "나의 직무 기여도에 대해 스스로 매우 낮다는 생각을 한다."},
    {"question_id": 14, "question_text": "만성피로, 감기나 두통, 요통, 소화불량이 늘었다."},
    {"question_id": 15, "question_text": "주변 사람과 대화를 나누는 것이 힘들게 느껴진다."},
]

@app.route('/survey')
def survey():
    return render_template('survey.html')

questions_stress = [
    {"question_stress_id": 1, "question_text": "그 경험에 관한 악몽을 꾸거나, 생각하고 싶지 않은데도 그 경험이 떠오른 적이 있다."},
    {"question_stress_id": 2, "question_text": "그 경험에 대해 생각하지 않으려고 애쓰거나, 그 경험을 떠오르게 하는 상황을 피하기 위해 특별히 노력하였다."},
    {"question_stress_id": 3, "question_text": "늘 주변을 살피고 경계하거나, 쉽게 놀라게 되었다."},
    {"question_stress_id": 4, "question_text": "다른 사람, 일상활동, 또는 주변 상황에 대해 가졌던 느낌이 없어지거나, 그것에 대해 멀어진 느낌이 들었다."},
    {"question_stress_id": 5, "question_text": "그 사건이나 그 사건으로 인해 생긴 문제에 대해 죄책감을 느끼거나, 자기자신이나 다른 사람에 대한 원망을 멈출 수가 없었다."},
]

questions_relation = [
    {"question_relation_id": 1, "question_text": "상대방이 화가 나있거나, 고민을 하고 있으면 나 때문은 아닌지 걱정하게 된다."},
    {"question_relation_id": 2, "question_text": "작은 실수라도 하게 되면, 한동안 떠올리며 자책을 하거나 마음이 불편하다."},
    {"question_relation_id": 3, "question_text": "나는 그다지 존재감이 있거나 가치 있는 사람이 아닌 것 같다."},
    {"question_relation_id": 4, "question_text": "상대방의 배려나 칭찬이 어색하거나 불편하다."},
    {"question_relation_id": 5, "question_text": "고마움이나 행복함, 슬픔 등의 감정에 대한 표현이 어렵다."},
    {"question_relation_id": 6, "question_text": "순간의 감정으로 짜증이나 화를 냈지만, 무거워진 분위기가 너무 힘들게 느껴진다."},
    {"question_relation_id": 7, "question_text": "다른 사람에게 도와달라는 말을 하기가 어렵다."},
    {"question_relation_id": 8, "question_text": "일과 휴식의 균형을 적절하게 배분하기가 어렵다."},
    {"question_relation_id": 9, "question_text": "다른 사람에 도움이 되었다고 느껴질 때 내 가치가 높아지는 것 같다."},
    {"question_relation_id": 10, "question_text": "상대방의 부탁을 거절할 때 죄책감을 느끼게 된다."},
    {"question_relation_id": 11, "question_text": "하고 싶지 않은 일이지만, 때로는 자원을 하기도 한다."},
    {"question_relation_id": 12, "question_text": "내가 좋아하거나, 오직 나만을 위한 일을 하면 이기적이라 생각하게 된다."},
    {"question_relation_id": 13, "question_text": "내가 힘들거나 하기 싫더라도 상대방이 원하는대로 하게 된다."},
    {"question_relation_id": 14, "question_text": "상대방이 어떤 반응을 보일지 걱정되서 내 감정을 솔직하게 표현하지 못한다."},
    {"question_relation_id": 15, "question_text": "상대방과 단 둘이 있을 때, 나로 인해 불편하거나 어색해할까봐 걱정을 한다."},
    {"question_relation_id": 16, "question_text": "종종 공허함이나 외로움과 같은 감정을 느낄때가 많다."},
    {"question_relation_id": 17, "question_text": "상대방이 한동안 나에게 말을 걸지 않으면, 내가 싫어졌는지 걱정하게 된다."},
    {"question_relation_id": 18, "question_text": "현실에서 하지 못한 감정표현을 상상으로는 과감히 표출하는 생각을 자주한다."}
]

questions_panic = [
    {"question_panic_id": 1, "question_text": "숨이 가쁘고 숨 막히는 느낌이 든다."},
    {"question_panic_id": 2, "question_text": "심하게 땀을 흘린다."},
    {"question_panic_id": 3, "question_text": "심장이 두근거리고 맥박이 빨라진다."},
    {"question_panic_id": 4, "question_text": "몸이 떨리거나 전율을 느낀다."},
    {"question_panic_id": 5, "question_text": "질식할 것 같다."},
    {"question_panic_id": 6, "question_text": "가슴이 아프고 답답하다."},
    {"question_panic_id": 7, "question_text": "토할 것 같거나 복부가 불편하다."},
    {"question_panic_id": 8, "question_text": "현기증, 불안정감, 머리 띵함 또는 어지럼증이 있다."},
    {"question_panic_id": 9, "question_text": "주위가 비현실적인 것 같고 자신에서 분리되는 듯 하다."},
    {"question_panic_id": 10, "question_text": "자제력이 상실되거나 미칠 것 같아서 두려운 느낌이 든다."},
    {"question_panic_id": 11, "question_text": "죽을 것 같은 느낌이 든다."},
    {"question_panic_id": 12, "question_text": "실수에 대해 지나치게 집착한다."},
    {"question_panic_id": 13, "question_text": "오한이 나고 얼굴이 화끈 달아오른다."}

]

@app.route('/survey_stress')
def survey_stress():
    return render_template('survey_stress.html')

@app.route('/survey_relation')
def survey_relation():
    return render_template('survey_relation.html')

@app.route('/survey_panic')
def survey_panic():
    return render_template('survey_panic.html')


@app.route('/get_question_stress/<int:question_stress_id>', methods=['GET'])
def get_question_stress(question_stress_id):
    for question in questions_stress:
        if question['question_stress_id'] == question_stress_id:
            return jsonify(question)
    return jsonify({'message': 'Question not found'})

@app.route('/get_question_relation/<int:question_relation_id>', methods=['GET'])
def get_question_relation(question_relation_id):
    for question in questions_relation:
        if question['question_relation_id'] == question_relation_id:
            return jsonify(question)
    return jsonify({'message': 'Question not found'})

@app.route('/get_question_panic/<int:question_panic_id>', methods=['GET'])
def get_question_panic(question_panic_id):
    for question in questions_panic:
        if question['question_panic_id'] == question_panic_id:
            return jsonify(question)
    return jsonify({'message': 'Question not found'})

@app.route('/get_question/<int:question_id>', methods=['GET'])
def get_question(question_id):
    for question in questions:
        if question['question_id'] == question_id:
            return jsonify(question)
    return jsonify({'message': 'Question not found'})

@app.route('/save_result', methods=['POST'])
def save_result():
    global saved_score

    data = request.json
    saved_score = data.get('totalScore', 0)

    return jsonify({'message': 'Result saved successfully!'})

@app.route('/get_result', methods=['GET'])
def get_result():
    global saved_score

    return jsonify({'totalScore': saved_score})

@jwt.unauthorized_loader
def missing_token_callback(error):
    return render_template('401_error.html'), 401

if __name__ == '__main__':
    app.run(debug=True)






