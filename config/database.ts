import * as mysql from 'mysql2/promise';

// TODO: 본인의 DB 계정 입력
export const pool = mysql.createPool({
  host: 'note-rds-soft-squared.ch1ke3pfbclp.ap-northeast-2.rds.amazonaws.com',
  user: 'note',
  port: 3306,
  password: 'note0827!',
  database: 'CoupangEats',
});
