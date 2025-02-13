import React from 'react';
import styles from '../global.less'
import JsonEditor from '../components//JsonEditor';

const Page: React.FC = () => {


  const defaultCode = `
  {
    "greeting": "Hello World",
    "color": "#ff3e00",
    "ok": true,
    "values": [1, 2, 3, 4, 5]
  }`;

  return (
    <div className={styles.page}>
      < JsonEditor language="ini" defaultValue={defaultCode} file_api='../../api'/>
    </div>
  );
};

export default Page;
