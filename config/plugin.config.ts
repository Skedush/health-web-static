// Change theme plugin
// eslint-disable-next-line eslint-comments/abdeils - enable - pair;
/* eslint-disable import/no-extraneous-dependencies */
// import ThemeColorReplacer from 'webpack-theme-color-replacer';
import Themes from '@/themes/templates';
import MergeLessPlugin from 'antd-pro-merge-less';
import AntDesignThemePlugin from 'antd-theme-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import path from 'path';

function getModulePackageName(module: { context: string }) {
  if (!module.context) return null;

  const nodeModulesPath = path.join(__dirname, '../node_modules/');
  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName: string | null = moduleDirName;
  // handle tree shaking
  if (packageName && packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)![1];
  }
  return packageName;
}

export default (config: any) => {
  // TODO: fix compile error when import Config
  // const defaultTheme = Config.defaultTheme || 'light';
  const theme = Themes.light;

  // config.plugin('webpack-theme-color-replacer').use(ThemeColorReplacer, [
  //   {
  //     fileName: 'css/theme-colors-[contenthash:8].css',
  //     matchColors: Object.values(theme), // 主色系列
  //     // 改变样式选择器，解决样式覆盖问题
  //     changeSelector(selector: string): string {
  //       switch (selector) {
  //         case '.ant-calendar-today .ant-calendar-date':
  //           return ':not(.ant-calendar-selected-date)' + selector;
  //         case '.ant-btn:focus,.ant-btn:hover':
  //           return '.ant-btn:focus:not(.ant-btn-primary),.ant-btn:hover:not(.ant-btn-primary)';
  //         case '.ant-btn.active,.ant-btn:active':
  //           return '.ant-btn.active:not(.ant-btn-primary),.ant-btn:active:not(.ant-btn-primary)';
  //         default:
  //           return selector;
  //       }
  //     },
  //     // isJsUgly: true,
  //   },
  // ]);

  if (process.env.NODE_ENV === 'production') {
    // Gzip压缩
    config.plugin('compression-webpack-plugin').use(CompressionPlugin, [
      {
        test: /\.(js|css|html)$/i, // 匹配
        threshold: 10240, // 超过10k的文件压缩
        deleteOriginalAssets: false, // 不删除源文件
      },
    ]);
  }

  // 将所有 less 合并为一个供 themePlugin使用
  const outFile = path.join(__dirname, '../.temp/ant-design-pro.less');
  const stylesDir = path.join(__dirname, '../src/');

  config.plugin('merge-less').use(MergeLessPlugin, [
    {
      stylesDir,
      outFile,
    },
  ]);

  config.plugin('ant-design-theme').use(AntDesignThemePlugin, [
    {
      antDir: path.join(__dirname, '../node_modules/antd'),
      stylesDir,
      varFile: path.join(__dirname, '../node_modules/antd/lib/style/themes/default.less'),
      mainLessFile: outFile,
      themeVariables: Object.keys(theme),
      indexFileName: 'index.html',
      generateOne: false,
      lessUrl: '/scripts/less.min.js',
    },
  ]);

  // optimize chunks
  config.optimization
    // share the same chunks across different modules
    .runtimeChunk(false)
    .splitChunks({
      chunks: 'async',
      name: 'vendors',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          test: (module: { context: string }) => {
            const packageName = getModulePackageName(module) || '';
            if (packageName) {
              return [
                'bizcharts',
                'gg-editor',
                'g6',
                '@antv',
                'gg-editor-core',
                'bizcharts-plugin-slider',
              ].includes(packageName);
            }
            return false;
          },
          name(module: { context: string }) {
            const packageName = getModulePackageName(module);
            if (packageName) {
              if (['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0) {
                return 'viz'; // visualization package
              }
            }
            return 'misc';
          },
        },
      },
    });
};
