import React, { useState, useEffect, useRef } from 'react';
import { Button, Modal, Radio } from 'antd';
import MonacoEditor from '@monaco-editor/react';
import axios from 'axios';

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

    // 获取屏幕宽度来动态设置字体大小
    const getFontSize = () => {
        const width = window.innerWidth;
        if (width >= 1200) {
            return 16;
        } else if (width >= 992) {
            return 14;
        } else if (width >= 768) {
            return 12;
        } else {
            return 10;
        }
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
    }, []);

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
                height: '100vh', // 高度设置为视口高度
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
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
                        height: '80%', // 高度设置为父容器的80%
                        border: '1px solid #e8e8e8',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '10px',
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
                            fontSize: getFontSize(), // 动态设置字体大小
                        }}
                        height="100%"
                    />
                </div>
            ) : (
                <div
                    style={{
                        width: '80%',
                        height: '80%',
                        border: '1px solid #e8e8e8',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        marginBottom: '10px',
                    }}
                >
                    {/* 在此处添加表单视图的内容 */}
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0' }}>
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

export default CodeEditor;
