import configuration from '../config.json';
import axios from 'axios';

export interface FetchData {
  uri: string;
  body: any;
  headers: [string, string][];
}
export const UploadFileAttachFiles = async (dataJson: any) => {
  return await axios({
    method: 'post',
    url: `${configuration.apiUrl}api/AttachFiles/AddFile`,
    data: dataJson,
  });
};
export const CreateMemo = async (request: any) => {
  const respone = await fetch(`${configuration.apiUrl}api/v1/memorandum`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })
    .then((response) => response.blob())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error(err);
    });

  return respone;
};

export const GetTemplate = async () => {
  const respone = await fetch(`${configuration.apiUrl}api/v1/template?documentCode=AJ`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((resp) => resp.json())
    .then((data) => {
      return data;
    });
  return respone;
};

export async function CallAPIPost(request: FetchData) {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  if (request.headers.length != 0) {
    request.headers.forEach((x) => {
      headers.append(x[0], x[1]);
    });
  }

  const respone = await fetch(configuration.apiUrl + request.uri, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(request.body),
  });

  if (!respone.ok) {
    throw new Error('Fail');
  }

  const data = await respone.json();
  return data;
}

export async function CallAPIGet(request: FetchData) {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  if (request.headers.length != 0) {
    request.headers.forEach((x) => {
      headers.append(x[0], x[1]);
    });
  }

  const respone = await fetch(configuration.apiUrl + request.uri, {
    method: 'GET',
    headers: headers,
  });

  if (!respone.ok) {
    throw new Error('Fail');
  }

  const data = await respone.json();
  return data;
}
