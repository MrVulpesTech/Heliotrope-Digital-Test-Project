declare module 'react-lottie' {
    import { Component } from 'react';
  
    export interface Options {
      loop: boolean;
      autoplay: boolean;
      animationData: any;
      rendererSettings: {
        preserveAspectRatio: string;
      };
    }
  
    export interface LottieProps {
      options: Options;
      height?: number;
      width?: number;
      isStopped?: boolean;
      isPaused?: boolean;
      eventListeners?: Array<{
        eventName: string;
        callback: () => void;
      }>;
    }
  
    export default class Lottie extends Component<LottieProps> {}
  }
  