CREATE TABLE blogs ( id SERIAL PRIMARY KEY, author text, url text NOT NULL, title text NOT NULL, likes integer DEFAULT 0 );

CREATE TABLE users ( id SERIAL PRIMARY KEY, username text NOT NULL, name text NOT NULL );