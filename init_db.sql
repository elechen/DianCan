create table if not exists users(
	id integer primary key autoincrement,
	name text,
	pwd text,
	priority integer
);