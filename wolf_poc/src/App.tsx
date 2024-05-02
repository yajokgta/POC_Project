import { Form, Input, Button, Row, Col, Select, Upload, Result } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { CreateMemo, GetTemplate, UploadFileAttachFiles } from './ApiService';
import { v4 as uuidv4 } from 'uuid';
import { useState } from 'react';

const App = () => {
  const [step, setStep] = useState<number>(0);
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    setStep(1);
    console.log('Received values:', values);
    let file: any = await onHandleUpload(values?.attachment?.fileList);
    let template = await GetTemplate();
    console.log('file:', file[0]);
    template.subject = `สมัครงานตำแหน่ง ${values.position} : ${values.name}`;
    template.form.forEach((x: any) => {
      if (x.template.label === 'ชื่อ - นามสกุล') {
        x.data.value = values.name;
      }
      if (x.template.label === 'อีเมลล์') {
        x.data.value = values.email;
      }
      if (x.template.label === 'อีเมลล์') {
        x.data.value = values.email;
      }
      if (x.template.label === 'โทรศัพท์') {
        x.data.value = values.Telephone;
      }
      if (x.template.label === 'อายุ') {
        x.data.value = values.age;
      }
      if (x.template.label === 'ตำแหน่งที่เปิดรับ') {
        x.data.value = values.position;
      }
      if (x.template.label === 'ใบสมัครงาน') {
        x.data.value = `${file[0].fileName}|${file[0].pathUrl}`;
      }
    });
    console.log('Template:', template);
    let result = await CreateMemo(template);
    console.log('result:', result);
    setStep(2);
    return result;
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    setStep(0);
  };

  const onHandleUpload = async (fileList: any[]) => {
    let uploadedFile: any[] = [];

    const file: any = fileList[0];
    let guid = uuidv4();
    let formData = new FormData();
    formData.append(`files`, file.originFileObj);
    formData.append('Doclib', 'TempAttachment');
    formData.append('docSet', guid);
    formData.append('fileDesc', file);
    formData.append('actorID', '1');

    var response: any = await UploadFileAttachFiles(formData);
    if (response?.data.result) {
      delete response?.data.result;
      uploadedFile.push(response?.data);
    }
    return uploadedFile;
  };

  const resetAll = () => {
    form.resetFields();
    setStep(0);
  };

  return (
    <>
      <div style={{ height: '55px', width: '100%', background: '#fff', boxShadow: '2px 2px 11px #afafaf', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start' }}>
        <img src="Logo.png" style={{ height: '100%', marginLeft: '16px' }} />
        <span style={{ color: '#8c1e21', fontSize: '20px', fontFamily: 'Arial', fontWeight: 'bold' }}>Unique Engineering and Construction Public Company Limited</span>
      </div>
      <br />
      {step < 2 ? (
        <div className="centered-form" style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ maxWidth: '600px', width: '100%' }}>
            <div>
              <h2>แบบฟอร์มสมัครงาน</h2>
            </div>
            <Form name="registration" form={form} onFinish={(e: any) => onFinish(e)} onFinishFailed={onFinishFailed} layout="vertical">
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
                    <Select
                      options={[
                        { label: 'นักคอมพิวเตอร์ 1', value: 'นักคอมพิวเตอร์ 1' },
                        { label: 'วิศวะกรโครงสร้าง', value: 'วิศวะกรโครงสร้าง' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Upload Attachment" name="attachment">
                    <Upload beforeUpload={() => false} multiple={false}>
                      <Button icon={<UploadOutlined />}>Click to Upload</Button>
                    </Upload>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={step == 1}>
                  Register
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      ) : (
        <Result
          status="success"
          title="ใบสมัครถูกส่งแล้ว เราจะรีบดำเนินการต่อไป"
          // subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
          extra={[
            <Button type="primary" key="console" onClick={() => resetAll()}>
              กรอกใบสมัครอีกครั้ง
            </Button>,
          ]}
        />
      )}
    </>
  );
};

export default App;
