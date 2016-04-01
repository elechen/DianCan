#coding=utf-8

from contextlib import closing
import sqlite3

def init_db(app, dbname):
	with closing(connect_db(dbname)) as db:
		with app.open_resource('init_db.sql', mode='r') as f:
			print(db.cursor().executescript(f.read()))
		db.commit()
		return db

def connect_db(dbname):
    return sqlite3.connect(dbname)
