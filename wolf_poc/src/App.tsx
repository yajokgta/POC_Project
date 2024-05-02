import React from 'react';
import { Form, Input, Button, Row, Col, Select, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CreateMemo, GetTemplate, UploadFileAttachFiles } from './ApiService';
import {v4 as uuidv4} from 'uuid';

const App = () => {
  const onFinish = async (values: any) => {
    console.log('Received values:', values);
    let file: any = await onHandleUpload(values?.attachment?.fileList);
    let template = await GetTemplate();
    console.log('file:', file[0]);
    template.subject = `สมัครงานตำแหน่ง ${values.position} : ${values.name}`
    template.form.forEach((x: any) => {
      if (x.template.label === "ชื่อ - นามสกุล") {
        x.data.value = values.name;
      }
      if(x.template.label === "อีเมลล์"){
        x.data.value = values.email;
      }
      if(x.template.label === "อีเมลล์"){
        x.data.value = values.email;
      }if(x.template.label === "โทรศัพท์"){
        x.data.value = values.Telephone;
      }
      if(x.template.label === "อายุ"){
        x.data.value = values.age;
      }
      if(x.template.label === "ตำแหน่งที่เปิดรับ"){
        x.data.value = values.position;
      }
      if(x.template.label === "ใบสมัครงาน"){
        x.data.value = `${file[0].fileName}|${file[0].pathUrl}`;
      }
    });
    console.log('Template:', template);
    let result = await CreateMemo(template);
    console.log('result:', result);
    return result;
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const onHandleUpload = async (fileList: any[]) => {
    let uploadedFile: any[] = [];

    const file: any = fileList[0];
      let guid = uuidv4();
      let formData = new FormData();
      formData.append(`files`, file.originFileObj);
      formData.append("Doclib", "TempAttachment");
      formData.append("docSet", guid);
      formData.append("fileDesc", file);
      formData.append("actorID", "1");

      var response: any = await UploadFileAttachFiles(formData);
      if (response?.data.result) {
        delete response?.data.result;
        uploadedFile.push(response?.data);
      }
    return uploadedFile;
  };



  return (
    <div className="centered-form">
      <Form
        name="registration"
        onFinish={(e: any) => onFinish(e)}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="ชื่อ - นามสกุล"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please input ชื่อ - นามสกุล!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="อีเมลล์"
              name="email"
              rules={[
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="โทรศัพท์"
              name="Telephone"
              rules={[
                {
                  required: true,
                  message: 'Please input your Telephone!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="อายุ"
              name="age"
              rules={[
                {
                  required: true,
                  message: 'Please input your age!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="ตำแหน่งที่เปิดรับ"
              name="position"
              rules={[
                {
                  required: true,
                  message: 'Please input your position!',
                },
              ]}
            >
              <Select options={[
                { label: "นักคอมพิวเตอร์ 1", value: "นักคอมพิวเตอร์ 1" },
                { label: "วิศวะกรโครงสร้าง", value: "วิศวะกรโครงสร้าง" }
              ]} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Upload Attachment"
              name="attachment"
            >
              <Upload
                beforeUpload={() => false}
                multiple={false}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default App;