
import React from "react";


const NewsList = ({ news }) => {
       return (
	       <div className="space-y-4">
		       {(!news || news.length === 0) ? (
			       <p className="text-gray-500 text-sm italic">Belum ada berita.</p>
		       ) : (
			       news.map((n) => {
				       const imgUrl = n.imageUrl || n.image_url;
				       return (
					       <div key={n.id || n._id || Math.random()} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-all">
						       <div className="flex justify-between items-start mb-2">
							       <h4 className="font-bold text-lg text-gray-900">{n.title}</h4>
							       <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">Published</span>
						       </div>
						       {imgUrl && (
							       <div className="mb-4">
								       <img src={imgUrl} alt={n.title} className="max-h-48 rounded-lg border object-cover w-full" />
							       </div>
						       )}
						       <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3">{n.content}</p>
						       <p className="text-xs text-gray-400 font-medium">Diposting: {n.createdAt ? new Date(n.createdAt).toLocaleDateString("id-ID") : "-"}</p>
					       </div>
				       );
			       })
		       )}
	       </div>
       );
};

export default NewsList;
