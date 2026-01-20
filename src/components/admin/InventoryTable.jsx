import React from "react";
import { Image, Tag, Weight, Ruler, Trash2, Edit } from "lucide-react";

const InventoryTable = ({ tools, onDelete }) => {
  if (!tools || tools.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500 bg-white border border-gray-200 rounded-xl">
        <p>Belum ada data alat medis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tools.map((tool) => (
        <div key={tool.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6">
          
          <div className="w-full md:w-48 h-48 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group">
            {tool.image_url ? (
              <img src={tool.image_url} alt={tool.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Image className="w-10 h-10 mb-2" />
                <span className="text-xs">No Image</span>
              </div>
            )}
            <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded backdrop-blur-sm uppercase font-bold tracking-wider">
              {tool.category}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
                <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
                <p className="text-sm text-gray-500 font-medium mb-3 flex items-center gap-2">
                    {tool.type && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs border border-blue-100">{tool.type}</span>}
                    {tool.description}
                </p>

              <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100">
                 {tool.size && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Tag className="w-4 h-4 text-teal-500" />
                        <span className="text-xs text-gray-500 uppercase font-bold">Size:</span>
                        <span className="font-medium">{tool.size}</span>
                    </div>
                 )}
                 {tool.weight_cap && (
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Weight className="w-4 h-4 text-teal-500" />
                        <span className="text-xs text-gray-500 uppercase font-bold">Cap:</span>
                        <span className="font-medium">{tool.weight_cap}</span>
                    </div>
                 )}
                 {tool.dimensions && (
                    <div className="flex items-center gap-2 text-sm text-gray-700 col-span-2">
                        <Ruler className="w-4 h-4 text-teal-500" />
                        <span className="text-xs text-gray-500 uppercase font-bold">Dim:</span>
                        <span className="font-medium">{tool.dimensions}</span>
                    </div>
                 )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-48 flex-shrink-0 flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Stok Gudang</p>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold text-teal-600">{tool.stock}</span>
                <span className="text-sm text-gray-500 mb-1">Unit</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5"><div className="bg-teal-500 h-1.5 rounded-full w-full"></div></div>
            </div>

            <div>
               <p className="text-xs text-gray-500 mb-1 font-bold uppercase">Kondisi</p>
               <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${tool.condition === 'baik' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {tool.condition ? tool.condition.toUpperCase() : 'BAIK'}
               </span>
            </div>

            <div className="mt-4 flex gap-2">
                <button className="btn btn-xs btn-outline flex-1 normal-case gap-1 rounded-lg bg-gray-100 border-gray-300 hover:bg-gray-200" title="Edit">
                    <Edit className="w-3 h-3" /> Edit
                </button>
                <button 
                    onClick={() => onDelete(tool.id)} 
                    className="btn btn-xs btn-outline btn-error px-2 rounded-lg bg-slate-300 border-red-300 hover:bg-red-100" 
                    title="Hapus"
                >
                    <Trash2 className="w-3 h-3" />
                </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryTable;