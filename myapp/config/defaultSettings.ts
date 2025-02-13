import { ProLayoutProps } from '@ant-design/pro-components';

const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  title: 'NiaServer WebUI',
  navTheme: 'light',
  colorPrimary: '#660874', // 设置主色为紫色
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  pwa: true,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  token: {
    header: {
      
    },
    sider: {
      
    }
    // ...其他token配置项
  },
  siderMenuType: 'sub',
  splitMenus: false,
};

export default Settings;
