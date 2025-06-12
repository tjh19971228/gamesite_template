import React from 'react';

interface SchemaOrgProps {
  data: unknown;
}

/**
 * Schema.org Structured Data Component
 * 在页面头部添加结构化数据的组件
 */
export function SchemaOrg({ data }: SchemaOrgProps) {
  if (!data) {
    return null;
  }

  // 将对象转换为JSON字符串
  const schemaString = JSON.stringify(data);
  
  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaString }}
    />
  );
} 