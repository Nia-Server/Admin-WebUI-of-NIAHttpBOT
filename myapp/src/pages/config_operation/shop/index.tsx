import React from 'react';
import JsonEditor from '../components/JsonEditor';
import styles from '../global.less'

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
      <JsonEditor  language="json" defaultValue={defaultCode}/>
    </div>
  );
};

export default Page;
