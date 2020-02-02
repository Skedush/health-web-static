// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/no-extraneous-dependencies */
// import client from 'webpack-theme-color-replacer/client';
import Themes from '@/themes/templates';

let lessNodesAppended;
export default {
  changeColor(themeName: string): void {
    // if (!(themeName in Themes)) {
    //   console.warn('the theme name not in themes: ', themeName);
    //   return Promise.resolve();
    // }

    // const options = {
    //   // new colors array, one-to-one corresponde with `matchColors`
    //   newColors: Object.values(Themes[themeName]),
    //   changeUrl(cssUrl: string): string {
    //     // while router is not `hash` mode, it needs absolute path
    //     return `/${cssUrl}`;
    //   },
    // };

    // return client.changer.changeColor(options, Promise);

    // Don't compile less in production!
    // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

    // const hideMessage = message.loading('正在编译主题！', 0);
    function buildIt() {
      if (!window.less) {
        return;
      }
      setTimeout(() => {
        window.less
          .modifyVars(Themes[themeName])
          .then(() => {
            // hideMessage();
            console.log('modifyVars done');
          })
          .catch(() => {
            // message.error('Failed to update theme');
            // hideMessage();
          });
      }, 200);
    }
    if (!lessNodesAppended) {
      // insert less.js and color.less
      const lessStyleNode = document.createElement('link');
      const lessConfigNode = document.createElement('script');
      const lessScriptNode = document.createElement('script');
      lessStyleNode.setAttribute('rel', 'stylesheet/less');
      lessStyleNode.setAttribute('href', '/color.less');
      lessConfigNode.innerHTML = `
        window.less = {
          async: true,
          env: 'production',
          javascriptEnabled: true
        };
      `;
      lessScriptNode.src = 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js';
      lessScriptNode.async = true;
      lessScriptNode.onload = () => {
        buildIt();
        lessScriptNode.onload = null;
      };
      document.body.appendChild(lessStyleNode);
      document.body.appendChild(lessConfigNode);
      document.body.appendChild(lessScriptNode);
      lessNodesAppended = true;
    } else {
      buildIt();
    }
  },
};
