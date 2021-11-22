import axios from 'axios';
import * as crypto from 'crypto';
import { sensSecret as sensKey } from '../config/sens_config';

class NCPClient {
  constructor(options) {
    const { phoneNumber, serviceId, secretKey, accessKey } = options;
    this.phoneNumber = phoneNumber;
    this.serviceId = serviceId;
    this.secretKey = secretKey;
    this.accessKey = accessKey;
    this.url = `https://sens.apigw.ntruss.com/sms/v2/services/${this.serviceId}/messages`;
    this.method = 'POST';
  }

  async sendSMS({ to, content, countryCode = '82' }) {
    try {
      const { timestamp, signature } = this.prepareSignature();

      const response = await axios({
        method: this.method,
        url: this.url,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'x-ncp-apigw-timestamp': timestamp,
          'x-ncp-iam-access-key': this.accessKey,
          'x-ncp-apigw-signature-v2': signature,
        },
        data: {
          type: 'SMS',
          contentType: 'COMM',
          countryCode,
          from: this.phoneNumber,
          content,
          messages: [
            {
              to: `${to}`,
            },
          ],
        },
      });

      if (response.status === 202) {
        return {
          success: true,
          status: response.status,
          msg: response.statusText,
        };
      } else {
        return {
          success: false,
          status: response.status,
          msg: response.statusText,
        };
      }
    } catch (error) {
      return {
        success: false,
        msg: error.response.statusText || 'Internal Server Error',
        status: error.response.status || 500,
      };
    }
  }

  prepareSignature() {
    const space = ' ';
    const newLine = '\n';
    const message = [];
    const hmac = crypto.createHmac('sha256', this.secretKey);
    const url2 = `/sms/v2/services/${this.serviceId}/messages`;
    const timestamp = Date.now().toString();

    message.push(this.method);
    message.push(space);
    message.push(url2);
    message.push(newLine);
    message.push(timestamp);
    message.push(newLine);
    message.push(this.accessKey);

    const signature = hmac.update(message.join('')).digest('base64');

    return {
      timestamp,
      signature,
    };
  }
}

// 랜덤 인증번호 생성 함수
function createAuthNum() {
  const randNum = Math.floor(Math.random() * 900000) + 100000;

  return randNum;
}

// ncp-sens 문자전송 함수
const messageAuth = async function (
  type: number,
  phoneNum: string,
  authNum: number
) {
  const ncp = new NCPClient({
    ...sensKey,
  });

  const to = phoneNum;
  let content;

  if (type === 1)
    content = `쿠팡 휴대폰 인증번호 [${authNum}] 위 번호를 인증 창에 입력하세요.`;
  else
    content = `비밀번호 변경을 위한 인증번호는 [${authNum}]입니다. 신규 비밀번호로 재설정해주세요.`;

  const { success, status, msg } = await ncp.sendSMS({
    to,
    content,
  });

  if (!success) {
    console.log(
      `(ERROR) node-sens error: ${msg}, Status ${status} Date ${Date.now()}`
    );
  } else {
    console.log(success);
    console.log(status);
    console.log(msg);
  }
};

module.exports = {
  NCPClient,
  createAuthNum,
  messageAuth,
};
