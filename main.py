#coding utf-8

from flask import Flask, session, request, redirect, url_for, \
	render_template, make_response, flash

app = Flask('DianCan')
app.secret_key = "YL_DIANCAN_20160326_SECRET_KEY"

@app.route('/')
def index():
	check_auto_login()
	resp = make_response(render_template('index.html'))
	resp.set_cookie("lang", "CN")
	print(request, "==================")
	print(request.cookies, "==================")
	return resp

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
	if request.method == 'POST':
		username, password = request.form['username'], request.form['password']
		if is_valid_user(username, password):
			resp = make_response(render_template('index.html'))
			resp.set_cookie('username', value=username)
			resp.set_cookie('password', value=password)
			session['logged_in'] = True
			session['username'] = username
			return redirect(url_for('home'))
		else:
			error = 1
			session['logged_in'] = False

	return render_template('login.html', error=error)

@app.route('/logout')
def logout():
	session.pop('logged_in', None)
	flash('You were logged out')
	return redirect(url_for('index'))

def on_login_done(name):
	session['logged_in'] = True
	session['username'] = name
	return redirect(url_for('home'))

@app.route('/home')
def home():
	return 'welcome to DianCan, %s' % (session['username'])

if __name__ == '__main__':
	app.run(host='127.0.0.1', debug=False)

