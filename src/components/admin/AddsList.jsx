import React from "react";

const AddsList = ({ ads, onDelete }) => {
	return (
		<div>
			<h3 className="font-bold text-xl text-gray-900 mb-6">Iklan Aktif ({ads?.length || 0})</h3>
			{(ads?.length || 0) === 0 ? (
				<div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed text-gray-500">
					Belum ada iklan yang aktif. Homepage akan menampilkan iklan dummy.
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{ads.map((ad) => (
						<div key={ad.id || ad._id} className="relative group rounded-xl overflow-hidden shadow-md bg-black h-64 border border-gray-200">
							<img 
								src={ad.image_url} 
								alt={ad.title} 
								className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-300" 
							/>
							<div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-12">
								<h4 className="text-white font-bold text-xl mb-1">{ad.title}</h4>
								<p className="text-gray-300 text-sm line-clamp-2">{ad.description}</p>
							</div>
							<div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
								<button 
									onClick={() => onDelete(ad.id || ad._id)}
									className="btn btn-sm btn-error bg-red-600 border-none text-white shadow-lg gap-2 p-2"
								>
									Hapus
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default AddsList;
