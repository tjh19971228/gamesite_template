"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Link from "next/link";
import { Game, GameCategory } from "@/types";

// 定义组件属性类型
interface ExpandableCardGridProps {
  categories: GameCategory[];
  games: Game[];
  maxPreviewGames?: number;
}

export default function ExpandableCardDemo({ 
  categories = [], 
  games = [],
  maxPreviewGames = 3
}: ExpandableCardGridProps) {
  const [active, setActive] = useState<GameCategory | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  // 修复 ref 类型问题，确保 ref 不为 null
  useOutsideClick(ref as React.MutableRefObject<HTMLDivElement>, () => setActive(null));

  // 获取分类相关的游戏
  const getCategoryGames = (categoryName: string) => {
    return games
      .filter(game => game.category === categoryName)
      .sort((a, b) => 
        new Date(b.releaseDate || "").getTime() - 
        new Date(a.releaseDate || "").getTime()
      )
      .slice(0, maxPreviewGames);
  };

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.button
              key={`button-${active.name}-${id}`}
              layout
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05,
                },
              }}
              className="flex absolute top-2 right-2 lg:hidden items-center justify-center bg-white rounded-full h-6 w-6"
              onClick={() => setActive(null)}
            >
              <CloseIconSvg />
            </motion.button>
            <motion.div
              layoutId={`card-${active.name}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-white dark:bg-neutral-900 sm:rounded-3xl overflow-hidden"
            >
              <motion.div 
                layoutId={`image-${active.name}-${id}`}
                className="w-full h-40 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${active.color}20, ${active.color}40)`,
                }}
              >
                <div className="text-5xl">{active.icon}</div>
              </motion.div>

              <div>
                <div className="flex justify-between items-start p-4">
                  <div className="">
                    <motion.h3
                      layoutId={`title-${active.name}-${id}`}
                      className="font-medium text-neutral-700 dark:text-neutral-200 text-base"
                    >
                      {active.name}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${active.count}-${id}`}
                      className="text-neutral-600 dark:text-neutral-400 text-base"
                    >
                      {active.count} games available
                    </motion.p>
                  </div>

                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Link
                      href={`/category/${active.slug}`}
                      className="px-4 py-3 text-sm rounded-full font-bold bg-green-500 text-white inline-block"
                    >
                      Browse All
                    </Link>
                  </motion.div>
                </div>
                <div className="pt-4 relative px-4">
                  <motion.div
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-neutral-600 text-xs md:text-sm lg:text-base pb-10 flex flex-col items-start gap-4 overflow-auto dark:text-neutral-400"
                  >
                    <div>
                      <h4 className="font-semibold text-base mb-2">About this category</h4>
                      <p>{active.description}</p>
                    </div>
                    
                    <div className="w-full">
                      <h4 className="font-semibold text-base mb-2">Latest Games</h4>
                      <div className="grid gap-2">
                        {getCategoryGames(active.name).map((game) => (
                          <Link 
                            key={game.slug} 
                            href={`/game/${game.slug}`}
                            className="flex items-center gap-3 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                          >
                            <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                              <img 
                                src={game.thumbnail || game.images[0]} 
                                alt={game.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h5 className="font-medium">{game.title}</h5>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                {game.releaseDate ? new Date(game.releaseDate).toLocaleDateString() : "No date"}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <ul className="max-w-2xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 items-start gap-4">
        {categories.map((category) => (
          <motion.div
            layoutId={`card-${category.name}-${id}`}
            key={category.name}
            onClick={() => setActive(category)}
            className="p-4 flex flex-col hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl cursor-pointer"
          >
            <div className="flex gap-4 flex-col w-full">
              <motion.div 
                layoutId={`image-${category.name}-${id}`}
                className="h-40 w-full rounded-lg flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${category.color}20, ${category.color}40)`,
                }}
              >
                <div className="text-4xl">{category.icon}</div>
              </motion.div>
              <div className="flex justify-center items-center flex-col">
                <motion.h3
                  layoutId={`title-${category.name}-${id}`}
                  className="font-medium text-neutral-800 dark:text-neutral-200 text-center md:text-left text-base"
                >
                  {category.name}
                </motion.h3>
                <motion.p
                  layoutId={`description-${category.count}-${id}`}
                  className="text-neutral-600 dark:text-neutral-400 text-center md:text-left text-base"
                >
                  {category.count} games available
                </motion.p>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIconSvg = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05,
        },
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};