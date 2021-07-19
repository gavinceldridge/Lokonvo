INSERT INTO users (username, password, email, is_admin)
VALUES
    ('admin',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'gchacka@gmail.com',
    TRUE),
    ('testuser',
    '$2b$12$AZH7virni5jlTTiGgEg4zu3lSvAw68qVEfSIOjJ3RqtbJbdW/Oi5q',
    'test@test.com',
    FALSE);

INSERT INTO topics (title, created_by, area_zone)
VALUES
    ('Vegan Restaurants',
    'admin',
    'Chico');

INSERT INTO posts (title, content, created_by, topic_title)
VALUES
    ('Om Foods',
    'Om has some of the most delicious food in Chico. You must try their nachos!',
    'admin',
    'Vegan Restaurants');