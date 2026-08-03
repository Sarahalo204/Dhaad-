import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { cn } from '@/lib/utils';

function CustomNode({ data }: any) {
  const pos = data.pos || '';
  
  let borderColor = '#C9A96A';
  let bgColor = 'rgba(201,169,106,0.08)';
  let textColor = '#C9A96A';
  let label = 'كلمة';

  if (pos.includes('فعل')) {
    borderColor = '#3B82F6';
    bgColor = 'rgba(59,130,246,0.1)';
    textColor = '#60A5FA';
    label = 'فعل';
  } else if (pos.includes('اسم')) {
    borderColor = '#2A9D8F';
    bgColor = 'rgba(42,157,143,0.1)';
    textColor = '#4ECDC4';
    label = 'اسم';
  } else if (pos.includes('حرف')) {
    borderColor = '#E76F51';
    bgColor = 'rgba(231,111,81,0.1)';
    textColor = '#E76F51';
    label = 'حرف';
  }

  const irab = data.fullData?.irab || '';
  if (irab.includes('مفعول به')) {
    borderColor = '#E63946';
    bgColor = 'rgba(230,57,70,0.1)';
    textColor = '#E63946';
  }

  return (
    <div 
      className="px-5 py-3 rounded-2xl min-w-[130px] text-center transition-all duration-300 hover:scale-110 cursor-pointer relative group"
      style={{
        background: `linear-gradient(135deg, #141824 0%, ${bgColor} 100%)`,
        border: `2px solid ${borderColor}40`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.4), 0 0 1px ${borderColor}40`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = borderColor;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 32px rgba(0,0,0,0.5), 0 0 20px ${borderColor}30`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${borderColor}40`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.4), 0 0 1px ${borderColor}40`;
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: borderColor, width: 10, height: 10, border: '2px solid #0C0E14' }} />
      <div className="flex flex-col">
        <span className="text-2xl font-black" style={{ color: '#F5F0E8' }}>{data.label}</span>
        <span 
          className="text-xs font-bold mt-1.5 rounded-lg py-1 px-3 inline-block mx-auto"
          style={{ 
            background: `${borderColor}15`, 
            color: textColor,
            border: `1px solid ${borderColor}30`
          }}
        >
          {pos || label}
        </span>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: borderColor, width: 10, height: 10, border: '2px solid #0C0E14' }} />
    </div>
  );
}

export default memo(CustomNode);
