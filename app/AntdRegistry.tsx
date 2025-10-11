"use client";

import React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";

export default function AntdRegistry({ children }: { children: React.ReactNode }) {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);

  useServerInsertedHTML(() => {
    // 避免重复插入
    if (isServerInserted.current) {
      return;
    }
    isServerInserted.current = true;
    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
}
