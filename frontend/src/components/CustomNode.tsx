import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function CustomNode({ data }: any) {
  return (
    <div className="px-4 py-2 shadow-xl shadow-primary/10 rounded-xl bg-white border-2 border-primary/20 min-w-[120px] text-center transition-transform hover:scale-105 hover:border-primary cursor-pointer relative group">
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-primary border-2 border-white" />
      <div className="flex flex-col">
        <span className="text-xl font-bold text-slate-800 group-hover:text-primary transition-colors">{data.label}</span>
        <span className="text-xs text-slate-500 font-medium mt-1 bg-slate-100 rounded-md py-0.5 px-2 inline-block mx-auto">{data.pos}</span>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-secondary border-2 border-white" />
    </div>
  );
}

export default memo(CustomNode);
