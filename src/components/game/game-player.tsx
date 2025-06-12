import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import fscreen from "fscreen";
import { Game } from "@/types";

// Game player component
interface GamePlayerProps {
  game: Game;
}

export const GamePlayer = ({ game }: GamePlayerProps) => {
  const [showAd] = useState(false); // Keep state for potential future ad integration
  const [showOverlay, setShowOverlay] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [cssFullscreen, setCssFullscreen] = useState(false); // CSS模拟全屏状态
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isMobile = useRef(false);

  // 检测iOS设备和屏幕宽度
  useEffect(() => {
    if (typeof window !== "undefined") {
      isMobile.current = window.innerWidth < 768;
      const isIOSDevice =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
      setIsIOS(isIOSDevice);
    }
  }, []);

  // 预加载游戏资源和处理iframe加载
  useEffect(() => {
    const handleIframeLoad = () => {
      setIsLoading(false);
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad);
      // Set loading to false also if iframe already loaded (cached)
      if (iframe.contentDocument?.readyState === 'complete') {
        setIsLoading(false);
      }
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad);
      }
    };
  }, []);

  // 监听原生全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!fscreen.fullscreenElement);
      if (!fscreen.fullscreenElement) {
        setCssFullscreen(false); // Exit CSS fullscreen if native exits
      }
    };

    if (fscreen.fullscreenEnabled) {
      fscreen.addEventListener("fullscreenchange", handleFullscreenChange);
    }

    return () => {
      if (fscreen.fullscreenEnabled) {
        fscreen.removeEventListener("fullscreenchange", handleFullscreenChange);
      }
    };
  }, []);

  // 处理CSS模拟全屏的退出事件
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && cssFullscreen) {
        setCssFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleEscKey);

    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [cssFullscreen]);

  // 处理全屏请求
  const handleFullscreen = () => {
    if (!gameContainerRef.current) return;

    if (isIOS) {
      setCssFullscreen(!cssFullscreen);
      return;
    }

    try {
      if (fscreen.fullscreenElement) {
        fscreen.exitFullscreen();
      } else {
        fscreen.requestFullscreen(gameContainerRef.current);
      }
    } catch (err) {
      console.error(`Fullscreen error: ${err}`);
      setCssFullscreen(!cssFullscreen); // Fallback to CSS fullscreen on error
    }
  };

  // 处理播放按钮点击
  const handlePlay = () => {
    if (isMobile.current) {
      handleFullscreen();
    }
    setShowOverlay(false);
  };

  // 构建游戏容器类名
  const gameContainerClassName = cn(
    "bg-gray-800 dark:bg-dark-900 rounded-lg overflow-hidden aspect-video w-full shadow-lg relative",
    cssFullscreen && "fixed inset-0 z-50 bg-black rounded-none aspect-auto" // CSS全屏样式
  );

  return (
    <div ref={gameContainerRef} className={gameContainerClassName}>
      {/* 加载指示器 */} 
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/70">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-t-4 border-primary-500 border-solid rounded-full animate-spin"></div>
            <p className="mt-4 text-white">Game Loading...</p>
          </div>
        </div>
      )}

      {/* CSS全屏模式下的关闭按钮 */} 
      {cssFullscreen && (
        <button
          onClick={() => setCssFullscreen(false)}
          className="absolute top-4 right-4 z-30 bg-black/70 text-white p-2 rounded-full"
          aria-label="Exit Fullscreen"
        >
          {/* Exit Fullscreen Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* 播放覆盖层 */} 
      {!showAd && showOverlay && (
        <div className="absolute inset-0 z-10 bg-black/70 dark:bg-white/20 flex items-center justify-center">
          <button
            onClick={handlePlay}
            className="bg-primary-600 dark:bg-primary-500 hover:bg-primary-700 dark:hover:bg-primary-600 text-white w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-transform hover:scale-110"
            aria-label="Play Game"
          >
            {/* Play Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 md:h-12 md:w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      )}

      {/* 游戏 Iframe */} 
      <iframe
        ref={iframeRef}
        src={game.playUrl}
        className="w-full h-full border-0"
        allowFullScreen
        title={game.title}
        loading="eager"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        referrerPolicy="no-referrer"
        allow="gamepad *;"
        style={{ pointerEvents: showOverlay ? "none" : "auto" }} // Disable interaction when overlay is shown
      ></iframe>

      {/* 游戏控制按钮 (如全屏) */} 
      {!cssFullscreen && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={handleFullscreen}
            className="bg-black/70 dark:bg-white/20 hover:bg-black/90 dark:hover:bg-white/30 text-white p-2 rounded-full transition-colors"
            aria-label={isFullscreen || cssFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {/* Fullscreen/Exit Fullscreen Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isFullscreen || cssFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> // Exit icon
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" /> // Enter icon
              )}
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}; 