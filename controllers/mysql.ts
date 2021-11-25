import { pool } from '../config/database';
import { logger } from '../config/winston';
import { errResponse } from '../config/response';
import { baseResponse } from '../config/baseResponseStatus';

export const connect_provider = async (
  func: any,
  loc: string,
  ...args: any
) => {
  const con: any = await pool.getConnection();

  const result = await func(con, ...args).catch((err: any) => {
    con.release();
    logger.error(`${loc} : ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  });

  con.release();

  return result;
};

export const connect_service = async (func: any, loc: string, ...args: any) => {
  const con: any = await pool.getConnection();

  try {
    await con.beginTransaction();

    const result = await func(con, ...args);

    await con.commit();

    con.release();

    return result;
  } catch (err: any) {
    con.release();
    logger.error(`${loc} : ${err.message}`);
    return errResponse(baseResponse.DB_ERROR);
  }
};
