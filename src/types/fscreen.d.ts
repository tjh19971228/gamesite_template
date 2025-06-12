declare module 'fscreen' {
  interface FScreen {
    fullscreenEnabled: boolean;
    fullscreenElement: Element | null;
    requestFullscreen(element: Element): Promise<void>;
    exitFullscreen(): Promise<void>;
    addEventListener(type: 'fullscreenchange', listener: () => void): void;
    removeEventListener(type: 'fullscreenchange', listener: () => void): void;
  }

  const fscreen: FScreen;
  export default fscreen;
} 