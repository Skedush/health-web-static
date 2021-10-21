declare module '*.css';
declare module '*.png';
declare module '*.less' {
  const content: any;
  export default content;
}

declare var API_PREFIX: string;
declare var PRE_DOMAIN: string;
declare var DETAIL_DOMAIN: string;
declare var DOMAIN: string;
declare interface Window {
  cancelRequest: any;
  less: any;
}
