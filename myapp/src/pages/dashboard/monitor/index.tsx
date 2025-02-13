import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import MonacoEditor from '@monaco-editor/react';

const JsonEditor: React.FC = () => {
  const [jsonContent, setJsonContent] = useState<string>(`
  {
    "greeting": "Hello World",
    "color": "#ff3e00",
    "ok": true,
    "values": [1, 2, 3, 4, 5]
  }`);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      setJsonContent(value);
    }
  };

  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: '20px', height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2>JSON 编辑器</h2>
      <div style={{ width: '80%', maxWidth: '800px', border: '1px solid #e8e8e8', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
        <MonacoEditor
          language="json"
          theme="vs-dark"
          value={jsonContent}
          onChange={handleEditorChange}
          options={{
            selectOnLineNumbers: true,
            automaticLayout: true,
            minimap: { enabled: false },
          }}
          height="400px"
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0' }}>
        <Button type="primary" onClick={handleSubmit}>
          提交
        </Button>
      </div>
      <Modal
        title="JSON 内容"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
      >
        <pre>{jsonContent}</pre>
      </Modal>
    </div>
  );
};

export default JsonEditor;
