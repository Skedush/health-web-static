declare module '*.css';
declare module '*.png';
declare module '*.less' {
  const content: any;
  export default content;
}

declare var API_PREFIX: string;
declare var CARD_READER_HOST: string;
declare var CARD_READER_OPENED: boolean;
declare interface Window {
  cancelRequest: any;
  less: any;
}
