drop table if exists users;
create table users(
	id integer primary key autoincrement,
	name text,
	pwd text,
	priority integer
);
insert into users (name, pwd, priority) values ("admin", "admin", 1);