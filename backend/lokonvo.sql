\echo 'Delete and recreate lokonvo db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE lokonvo;
CREATE DATABASE lokonvo;
\connect lokonvo

\i lokonvo-schema.sql
\i lokonvo-seed.sql

\echo 'Delete and recreate lokonvo_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo

DROP DATABASE lokonvo_test;
CREATE DATABASE lokonvo_test;
\connect lokonvo_test

\i lokonvo-schema.sql
