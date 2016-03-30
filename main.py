#coding utf-8

from flask import Flask, session, request, redirect, url_for, \
	render_template, make_response, flash, g

from init_db import init_db, connect_db

app = Flask('DianCan')
app.secret_key = 'YL_DIANCAN_20160326_SECRET_KEY'
DATABASE = 'diancan.db'
app.config.from_object(__name__)

@app.route('/')
def index():
	check_auto_login()
	if session.get('logged_in'):
		return redirect(url_for('home'))
	else:
		return render_template('index.html')

def check_auto_login():
	username = request.cookies.get('username')
	password = request.cookies.get('password')
	print(username, password, "auto_login")
	if username and password and is_valid_user(username, password):
		session['logged_in'] = True
		session['username'] = username

def is_valid_user(name, pwd):
	sql = "select * from users where name=\'%s\' and pwd=\'%s\'" % (name, pwd)
	db = connect_db(app.config["DATABASE"])
	result = db.execute(sql)
	for row in result:
		return True

@app.route('/login', methods=['GET', 'POST'])
def login():
	error = None
	if session.get("logged_in"):
		return redirect(url_for('home'))
	if request.method == 'POST':
		username, password = request.form['username'], request.form['password']
		if is_valid_user(username, password):
			resp = make_response(redirect(url_for('index')))
			resp.set_cookie('username', username, max_age=365*24*60*60)
			resp.set_cookie('password', password, max_age=365*24*60*60)
			session['logged_in'] = True
			session['username'] = username
			return resp
		else:
			error = 1

	return render_template('login.html', error=error)

@app.route('/logout')
def logout():
	session.pop('logged_in', None)
	session.pop('username', None)
	flash('You were logged out')
	resp = make_response(redirect(url_for('index')))
	resp.delete_cookie('username')
	resp.delete_cookie('password')
	return resp

@app.route('/home')
def home():
	if session.get('logged_in'):
		return '你好, %s' % (session['username'])
	else:
		return redirect(url_for('login'))


@app.before_request
def before_request():
	g.db = init_db(app, app.config['DATABASE'])

@app.teardown_request
def teardown_request(exception):
	db = getattr(g, 'db', None)
	if db is not None:
		db.close()

if __name__ == '__main__':
	app.run(debug=True, use_reloader=False)

