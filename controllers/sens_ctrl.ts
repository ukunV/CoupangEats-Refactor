import { NCPClient } from 'node-sens';
import { sensSecret as sensKey } from '../config/sens_config';

export const sendSMS = async (to: string, content: string) => {
  const ncp = new NCPClient({
    phoneNumber: sensKey.phoneNumber,
    serviceId: sensKey.serviceId,
    secretKey: sensKey.secretKey,
    accessKey: sensKey.accessKey,
  });

  const { success, msg, status } = await ncp.sendSMS({
    to,
    content,
    countryCode: '82',
  });

  return { success, msg, status };
};
