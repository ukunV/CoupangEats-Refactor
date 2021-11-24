// 주문 배달완료 여부 check
export const checkOrderAlive = async function (
  connection: any,
  orderId: string
) {
  const query = `
                  select exists(select id
                                from OrderList
                                where id = ?
                                and status != 0
                                and status != 5) as exist;
                  `;

  const row = await connection.query(query, orderId);

  return row[0][0]['exist'];
};

// 주문 상태 check (status = 1)
export const checkOrderStatus = async function (
  connection: any,
  orderId: string,
  status: string
) {
  const query = `
                  select exists(select id
                                from OrderList
                                where id = ?
                                and status = ?) as exist;
                  `;

  const row = await connection.query(query, [orderId, status]);

  return row[0][0]['exist'];
};

// 주문 상태 변경(주문 수락됨)
export const updateOrderStatus = async function (
  connection: any,
  orderId: number,
  status: number
) {
  const query = `
                  update OrderList
                  set status = ?
                  where id = ?;
                  `;

  const row = await connection.query(query, [status, orderId]);

  return row[0].info;
};

// 주문 존재 여부 check
export const checkOrderExist = async function (
  connection: any,
  storeId: string,
  orderId: string
) {
  const query = `
                  select exists(select id
                                from OrderList
                                where storeId = ?
                                and id = ?) as exist;
                  `;

  const row = await connection.query(query, [storeId, orderId]);

  return row[0][0]['exist'];
};

// 라이더 위치 초기 세팅
export const createRider = async function (
  connection: any,
  storeId: number,
  orderId: number
) {
  const query1 = `
                  select storeLatitude, storeLongtitude
                  from Store
                  where id = ?;
                  `;

  const row1 = await connection.query(query1, storeId);

  const riderLat = row1[0][0]['storeLatitude'];
  const riderLng = row1[0][0]['storeLongtitude'];

  const query2 = `
                  insert into RiderLocation (orderId, riderLatitude, riderLongtitude)
                  values (?, ?, ?);
                  `;

  const row2 = await connection.query(query2, [orderId, riderLat, riderLng]);

  return row2[0];
};

// 라이더 위치 갱신
export const updateRider = async function (
  connection: any,
  orderId: number,
  lat: string,
  lng: string
) {
  const query = `
                  update RiderLocation
                  set riderLatitude = ?, riderLongtitude = ?
                  where orderId = ?;
                  `;

  const row = await connection.query(query, [lat, lng, orderId]);

  return row[0].info;
};
