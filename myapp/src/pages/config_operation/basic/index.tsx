import React from 'react';
import CodeEditor from '../components/CodeEditor';
import styles from '../global.less'

const Page: React.FC = () => {

  const defaultCode = `
[基础配置]

LanguageFile = ""
ServerLocate = D:\\NiaServer-Core\\bedrock_server.exe
AutoBackup = false
AutoStartServer = false
IPAddress = 127.0.0.1
ServerPort = 10086

[功能配置]

UseCmd = false

[QQ机器人配置]

UseQQBot = false
ClientPort = 10023
Locate = /qqEvent
OwnerQQ = 123456789
QQGroup = 123456789
`;


  return (
    <div className={styles.page}>
      < CodeEditor language="ini" defaultValue={defaultCode} file_api='../../api'/>
    </div>
  );
};

export default Page;
