import LeftMenu from "@/components/leftMenu/LeftMenu";
import CreateProduct from "@/components/marketplace/CreateProduct";
import prisma from "@/lib/client";
import Image from "next/image";


const MarketplacePage = async () => {
  const products = await prisma.product.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex gap-6 pt-6">
      <div className="hidden xl:block w-[20%]">
        <LeftMenu type="home" />
      </div>

      <div className="w-full lg:w-[80%] xl:w-[80%] mx-auto">
        <div className="flex flex-col gap-6">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md p-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-white">
            <div>
              <h1 className="text-3xl font-bold mb-2">Marketplace Estudiantil</h1>
              <p className="text-blue-100 max-w-lg">Compra, vende o intercambia libros, uniformes, equipos y más con la comunidad.</p>
            </div>
            <CreateProduct />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center py-20 bg-white rounded-lg shadow-sm">
                No hay artículos a la venta en este momento. ¡Sé el primero en publicar!
              </p>
            ) : (
              products.map((product) => (
                <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col group">
                  <div className="relative w-full h-56 bg-gray-100 overflow-hidden">
                    {product.img ? (
                      <Image
                        src={product.img}
                        alt={product.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">Sin foto</div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm border border-gray-100">
                      {product.category}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="font-bold text-gray-800 text-lg line-clamp-1 mb-1" title={product.title}>{product.title}</h3>
                    <p className="text-emerald-600 font-bold text-2xl mb-3">${product.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-grow">{product.description}</p>

                    <div className="flex items-center gap-3 mt-auto border-t border-gray-100 pt-4">
                      <Image
                        src={product.user.avatar || "/noAvatar.png"}
                        alt="Seller"
                        width={32}
                        height={32}
                        className="rounded-full object-cover w-8 h-8 border border-gray-200"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800 line-clamp-1">
                          {product.user.name && product.user.surname ? `${product.user.name} ${product.user.surname}` : product.user.username}
                        </span>
                        <span className="text-[11px] text-gray-500">{new Date(product.createdAt).toLocaleDateString("es-ES")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;
