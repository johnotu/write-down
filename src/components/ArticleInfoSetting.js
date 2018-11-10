import React, { Component } from "react";
import { Form, Icon, Input, Modal, Collapse ,Tabs } from "antd";

import PhotoSearch from "./PhotoSearch";

import styles from "./Header.module.css";

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

class ArticleInfoSettingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      data: ''
    };

    this.formRef = null;

    this.setFormRef = (form) => {
      this.formRef = form
    };
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({
      visible: false,
    });

    const data = this.formRef.props.form.getFieldsValue();
    console.log(data);
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <div>
        <button className={styles.button} type="primary" onClick={this.showModal}>
          <Icon type="profile" theme="outlined" />
        </button>
        <Modal
          style={{top: 20}}
          width={920}
          title="Article Info Setting"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <WrappedFormInModal wrappedComponentRef={this.setFormRef}/>
        </Modal>
      </div>
    );
  }
}

class ArticleInfoForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      coverUrl: '',
      isUrlChanged: false,
      isCoverUrlValid: false,
      coverPreviewMsg: 'The preview of cover will be here.'
    };
  }

  selectCover = (cover) => {
    const form = this.props.form;

    form.setFieldsValue({ cover });

    this.checkCoverUrl(undefined, cover, () => {});
  };

  checkCoverUrl = async(rule, url, cb) => {
    try {
      const coverUrl = await checkImageUrlIsValid(url);

      this.setState({
        coverUrl: coverUrl,
        isUrlChanged: true,
        isCoverUrlValid: true
      });
    } catch (error) {
      this.setState({
        coverPreviewMsg: 'The url of cover is invalid. Please check the url.',
        isUrlChanged: true,
        isCoverUrlValid: false
      });
    }

    cb();
  };

  onSubmit = (e) => {
    e.preventDefault();
    const data = this.props.form.getFieldsValue();
    console.log(data);
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        <Form layout={'vertical'}>
          <Form.Item {...formItemLayout} label={'Title'}>
            {getFieldDecorator('title', {
              rules: [{
                required: true,
                message: 'Please input your article header',
              }]
            })(
              <Input placeholder="Please input your article header" />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label={'Excerpt'}>
            {getFieldDecorator('excerpt', {
              rules: [{
                required: true,
                message: 'Please input your article header',
              }]
            })(
              <Input.TextArea
                rows={8}
                autosize={true}
                placeholder='Please input your article excerpt'
              />
            )}
          </Form.Item>
          <Form.Item {...formItemLayout} label={'Cover'}>
            {getFieldDecorator('cover', {
              rules: [{
                validator: this.checkCoverUrl
              }]
            })(
              <Input placeholder="Please input a valid url of the cover of your article" />
            )}
          </Form.Item>
          <div className={styles.coverPreviewArea}>
            {
              this.state.isCoverUrlValid
                ? <img className={styles.coverPreviewImage} src={this.state.coverUrl} alt=" loading..."/>
                :
                (
                  <div className={styles.coverPreviewAreaTipWrapper}>
                    {
                      this.state.isUrlChanged
                        ? <p className={styles.coverPreviewAreaTipWithFeedback}>{this.state.coverPreviewMsg}</p>
                        : <p className={styles.coverPreviewAreaTip}>{this.state.coverPreviewMsg}</p>
                    }
                  </div>
                )
            }
          </div>
          <Form.Item style={{margin: 0}}>
            <Collapse bordered={false}>
              <Collapse.Panel header={"Tips for setting cover"} key={"tips"}>
                <pre className={styles.coverSettingTip}>
                Choose an approach to set your cover:
                <br/>
                1. Search photo from Unsplash by keyword and click on the photo you selected. The url of the photo will be filled in automatically.
                <br/>
                2. Upload the cover to image hosting service, and paste the valid image url to the cover field.
                <br/>
                <br/>
                Important: Image in landscape mode is recommended.
                </pre>
              </Collapse.Panel>
            </Collapse>

            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Choose a photo from Unsplash" key="1">
                <PhotoSearch selectCover={this.selectCover}/>
              </Tabs.TabPane>
              <Tabs.TabPane tab="Upload your photo" key="2">
                <div style={{marginTop: 12}}>
                  <pre className={styles.coverSettingTip}>
                    You can use any image hosting service to store your cover, like <a href="http://imgur.com/" target="_blank" rel="noopener noreferrer">Imgur</a>, <a href="https://www.dropbox.com/" target="_blank" rel="noopener noreferrer">Dropbox</a>, <a href="https://imageshack.us/" target="_blank" rel="noopener noreferrer">Imageshack</a>, and other free image hosting service.
                    <br/>
                    <br/>
                    Remember to paste url back to the cover field.
                  </pre>
                </div>
              </Tabs.TabPane>
            </Tabs>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const WrappedFormInModal = Form.create()(ArticleInfoForm);


/**
 * checkImageUrlIsValid 检查url是否是合法的
 *
 * @param url
 * @return {Promise<any>}
 */
function checkImageUrlIsValid(url) {
  return new Promise(function(resolve, reject) {
    const img = new Image();
    img.onload = function() {
      resolve(url);
    };

    img.onerror = function(){
      reject('The url of image is invalid.');
    };

    img.src = url;
  });
}

export default ArticleInfoSettingModal;