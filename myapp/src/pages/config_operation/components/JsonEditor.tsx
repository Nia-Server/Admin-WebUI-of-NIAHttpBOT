import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Modal, Radio, Form, Input, Dropdown, Menu, message } from 'antd';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';
import { DownOutlined, RightOutlined, PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface CodeEditorProps {
  language: string;
  defaultValue: string;
  file_api: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ language, defaultValue, file_api }) => {
  const [content, setContent] = useState<string>(defaultValue);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'editor' | 'form'>('editor');
  const editorRef = useRef(null);

  // 动态设置字体大小
  const getFontSize = () => {
    const width = window.innerWidth;
    if (width >= 1200) return 16;
    if (width >= 992) return 14;
    if (width >= 768) return 12;
    return 10;
  };

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await axios.get(file_api);
        if (response.status === 200) {
          setContent(response.data);
        } else {
          console.error('获取文件失败，使用默认文件');
        }
      } catch (error) {
        console.error('请求失败，使用默认文件', error);
      }
    };
    fetchFile();
  }, [file_api]);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setContent(value);
    }
  };

  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  const handleViewModeChange = (e: any) => {
    setViewMode(e.target.value);
  };

  return (
    <div
      style={{
        padding: '20px',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f5f5'
      }}
    >
      <h2>代码编辑器</h2>
      <Radio.Group
        value={viewMode}
        onChange={handleViewModeChange}
        style={{ marginBottom: '10px' }}
      >
        <Radio.Button value="editor">代码编辑器</Radio.Button>
        <Radio.Button value="form">表单视图</Radio.Button>
      </Radio.Group>
      {viewMode === 'editor' ? (
        <div
          ref={editorRef}
          style={{
            width: '80%',
            height: '80%',
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'hidden',
            marginBottom: '10px',
            background: '#fff'
          }}
        >
          <MonacoEditor
            language={language}
            theme="solarized-light"
            value={content}
            onChange={handleEditorChange}
            options={{
              selectOnLineNumbers: true,
              automaticLayout: true,
              minimap: { enabled: false },
              fontSize: getFontSize(),
            }}
            height="100%"
          />
        </div>
      ) : (
        <div
          style={{
            width: '80%',
            height: '80%',
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'auto',
            marginBottom: '10px',
            background: '#fff'
          }}
        >
          <JsonFormView
            jsonString={content}
            onDataChange={(newData) => {
              // 更新后的 JSON 数据回写编辑器
              setContent(JSON.stringify(newData, null, 2));
            }}
          />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button type="primary" onClick={handleSubmit}>
          提交
        </Button>
      </div>
      <Modal
        title="内容"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <pre>{content}</pre>
      </Modal>
    </div>
  );
};

interface JsonFormViewProps {
  jsonString: string;
  onDataChange?: (data: any) => void;
}

const JsonFormView: React.FC<JsonFormViewProps> = ({ jsonString, onDataChange }) => {
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    try {
      // 对于极大 JSON 文件，建议只解析一次，后续操作仅修改局部数据
      const parsed = JSON.parse(jsonString);
      setFormData(parsed);
    } catch (error) {
      setFormData(null);
    }
  }, [jsonString]);

  if (formData === null) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        解析 JSON 失败，请检查格式！
      </div>
    );
  }

  const handleDataChange = (newData: any) => {
    setFormData(newData);
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  return (
    <Form layout="vertical" style={{ padding: '20px' }}>
      <MemoJsonItem
        label="根节点"
        value={formData}
        path={[]}
        onValueChange={handleDataChange}
        level={0}
        isRoot={true}
        defaultCollapsed={false}
      />
    </Form>
  );
};

interface JsonItemProps {
  label?: string;
  value: any;
  path: (string | number)[];
  onValueChange: (newValue: any) => void;
  level?: number;
  isRoot?: boolean;
  defaultCollapsed?: boolean;
}

const JsonItem: React.FC<JsonItemProps> = ({ label, value, path, onValueChange, level = 0, isRoot = false, defaultCollapsed = true }) => {
  const [collapsed, setCollapsed] = useState(level === 0 ? false : defaultCollapsed);
  const toggleCollapse = useCallback(() => setCollapsed(c => !c), []);

  // 根据类型返回默认值
  const getDefaultValue = (type: string) => {
    switch (type) {
      case 'object': return {};
      case 'array': return [];
      case 'string': return '';
      case 'number': return 0;
      case 'boolean': return false;
      case 'null': return null;
      default: return '';
    }
  };

  const typeOptions = [
    { key: 'object', label: '对象' },
    { key: 'array', label: '数组' },
    { key: 'string', label: '字符串' },
    { key: 'number', label: '数字' },
    { key: 'boolean', label: '布尔' },
    { key: 'null', label: '空' },
  ];

  // 修改当前节点的类型
  const handleChangeType = ({ key }: any) => {
    const newVal = getDefaultValue(key);
    onValueChange(newVal);
  };

  const typeMenu = (
    <Menu onClick={handleChangeType}>
      {typeOptions.map(option => (
        <Menu.Item key={option.key}>{option.label}</Menu.Item>
      ))}
    </Menu>
  );

  // 新增子项（对象属性或数组元素）
  const handleAddChild = (type: string, keyName?: string) => {
    const newChild = getDefaultValue(type);
    if (Array.isArray(value)) {
      onValueChange([...value, newChild]);
    } else if (typeof value === 'object' && value !== null) {
      if (!keyName) {
        message.error('属性名不能为空');
        return;
      }
      if (value.hasOwnProperty(keyName)) {
        message.error('属性名已存在');
        return;
      }
      onValueChange({ ...value, [keyName]: newChild });
    }
  };

  // 数组中添加元素菜单
  const arrayAddMenu = (
    <Menu onClick={info => { handleAddChild(info.key); }}>
      {typeOptions.map(option => (
        <Menu.Item key={option.key}>{option.label}</Menu.Item>
      ))}
    </Menu>
  );

  // 对象新增属性时，提示输入属性名
  const promptForKey = (type: string) => {
    let inputVal = '';
    Modal.confirm({
      title: '添加属性',
      content: (
        <Input placeholder="请输入属性名" onChange={e => { inputVal = e.target.value; }} />
      ),
      onOk: () => {
        if (!inputVal) {
          message.error('属性名不能为空');
          return Promise.reject();
        }
        handleAddChild(type, inputVal);
        return Promise.resolve();
      },
    });
  };

  // 操作按钮：折叠、删除、修改类型
  const renderActions = () => (
    <div style={{ display: 'flex', alignItems: 'center', marginRight: 5 }}>
      <Button type="link" onClick={toggleCollapse} size="small">
        {collapsed ? <RightOutlined /> : <DownOutlined />}
      </Button>
      {!isRoot && (
        <Button
          type="link"
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => onValueChange(undefined)}
        />
      )}
      {!(typeof value === 'object' && value !== null) && (
        <Dropdown overlay={typeMenu}>
          <Button type="link" icon={<EditOutlined />} size="small" />
        </Dropdown>
      )}
    </div>
  );

  // 根据数据类型递归渲染
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return (
        <div style={{ marginLeft: level * 16, marginBottom: 8, border: '1px solid #ddd', borderRadius: 4, padding: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {renderActions()}
              {label && <strong>{label} (数组)</strong>}
            </div>
            <Dropdown overlay={arrayAddMenu}>
              <Button type="primary" size="small">
                <PlusOutlined /> 添加元素
              </Button>
            </Dropdown>
          </div>
          {!collapsed && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {value.map((item, index) => (
                <div key={index} style={{ flex: '1 0 200px' }}>
                  <MemoJsonItem
                    label={`项 ${index}`}
                    value={item}
                    path={[...path, index]}
                    onValueChange={newVal => {
                      if (newVal === undefined) {
                        onValueChange(value.filter((_: any, i: number) => i !== index));
                      } else {
                        const newArr = [...value];
                        newArr[index] = newVal;
                        onValueChange(newArr);
                      }
                    }}
                    level={level + 1}
                    isRoot={false}
                    defaultCollapsed={true}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      );
    } else {
      // 对象类型
      return (
        <div style={{ marginLeft: level * 16, marginBottom: 8, border: '1px solid #ddd', borderRadius: 4, padding: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {renderActions()}
              {label && <strong>{label} (对象)</strong>}
            </div>
            <Dropdown
              overlay={
                <Menu onClick={info => promptForKey(info.key)}>
                  {typeOptions.map(option => (
                    <Menu.Item key={option.key}>{option.label}</Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Button type="primary" size="small">
                <PlusOutlined /> 添加属性
              </Button>
            </Dropdown>
          </div>
          {!collapsed && (
            <div style={{ marginTop: 8 }}>
              {Object.keys(value).map(key => (
                <MemoJsonItem
                  key={key}
                  label={key}
                  value={value[key]}
                  path={[...path, key]}
                  onValueChange={newVal => {
                    if (newVal === undefined) {
                      const { [key]: omit, ...rest } = value;
                      onValueChange(rest);
                    } else {
                      onValueChange({ ...value, [key]: newVal });
                    }
                  }}
                  level={level + 1}
                  isRoot={false}
                  defaultCollapsed={true}
                />
              ))}
            </div>
          )}
        </div>
      );
    }
  } else {
    // 基本类型
    return (
      <div style={{ marginLeft: level * 16, marginBottom: 8, display: 'flex', alignItems: 'center' }}>
        {renderActions()}
        {label && <strong style={{ marginRight: 8 }}>{label}:</strong>}
        <Input
          value={value}
          onChange={e => onValueChange(e.target.value)}
          style={{ width: 200 }}
        />
        <Dropdown overlay={typeMenu}>
          <Button type="link" icon={<EditOutlined />} size="small" />
        </Dropdown>
      </div>
    );
  }
};

const MemoJsonItem = React.memo(JsonItem);

export default CodeEditor;
