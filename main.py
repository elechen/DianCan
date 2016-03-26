#coding utf-8

from flask import Flask, session, request, redirect, url_for, \
	render_template, make_response, flash

app = Flask('DianCan')
app.secret_key = "YL_DIANCAN_20160326_SECRET_KEY"

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

if __name__ == '__main__':
	app.run(host='127.0.0.1', debug=False)

