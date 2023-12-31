/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */ // Desactiva las advertencias de Next.js relacionadas con el elemento img

// Importa las dependencias necesarias
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

// Define el componente ProductForm
export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}) {
  // Utiliza el estado local para manejar los datos del formulario
  const [title, setTitle] = useState(existingTitle || ''); // Nombre del producto
  const [images, setImages] = useState(existingImages || []); // Imágenes del producto
  const [description, setDescription] = useState(existingDescription || ''); // Descripción del producto
  (existingDescription || '');
  const [category, setCategory] = useState(assignedCategory || '');
 const [productProperties, setProductProperties] = 
 useState(assignedProperties ||{})
 const [price, setPrice] = useState(existingPrice || ''); // Precio del producto
  const [goToProducts, setGoToProducts] = useState(false); // Variable para redireccionar a la página de productos
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState([])
  const router = useRouter(); // Instancia del enrutador de Next.js
  
  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    })
  }, []);

  // Función asincrónica para guardar un producto
  async function saveProduct(ev) {
    ev.preventDefault();
    const data = { 
      title, description, price, images, category, productProperties
    };
    if (_id) {
      // Si _id existe, actualiza el producto existente
      await axios.put('/api/products', { ...data, _id });
    } else {
      // Si no existe _id, crea un nuevo producto
      await axios.post('/api/products', data);
    }
    setGoToProducts(true); // Establece la variable para redirigir a la página de productos
  }

  // Función asincrónica para cargar imágenes a Cloudinary
  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }

      try {
        // Realiza una solicitud para cargar las imágenes a Cloudinary
        const response = await axios.post('/api/upload-to-cloudinary', data);
        // Actualiza el estado local de las imágenes con las nuevas imágenes cargadas
        setImages((oldImages) => [...oldImages, ...response.data.links]);
      } catch (error) {
        console.error('Error al cargar las imágenes en Cloudinary:', error);
      }
      setIsUploading(false);
    }
  }

  // Si la variable goToProducts es verdadera, redirige a la página de productos
  if (goToProducts) {
    router.push('/products');
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while(catInfo?.parent?.id){
        const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
        propertiesToFill.push(...parentCat.properties)
        catInfo = parentCat;
    }
  }

  function setProductProp(propName,value){
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName]= value;
      return newProductProps;
        });
  }

  // Renderiza el formulario
  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type="text"
        placeholder="product name"
        value={title}
        onChange={ev => setTitle(ev.target.value)}
      />
      <label>Category</label>
            <select value={category} onChange={ev => setCategory(ev.target.value)}>
            <option value="">Uncategorized</option>
                 {categories.length > 0 &&
                 categories.map(c => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))
              }
            </select>
            {propertiesToFill.length > 0 && propertiesToFill.map((p, index) => (
  <div key={p._id} className="">
    <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
    <div>
    <select value={productProperties[p.name]}
      onChange={ev => setProductProp(p.name, ev.target.value)}>
      {p.values.map((v, valueIndex) => (
        <option key={valueIndex} value={v}>{v}</option>
      ))}
    </select>
    </div>
  </div>
))}


      <label>Photos</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {/* Mapea las imágenes y las muestra en el formulario */}
          {!!images?.length > 0 && images.map((link, index) => (
            <div key={link + index} className="h-24 bg-white p-4 shadow-sm rounded-sm 
            border border-gray-200">
              <img src={link} alt=""
                className="rounded-lg" />
            </div>
          ))
          }
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1
         text-primary rounded-sm bg-white shadow-sm border-border-primary">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <div>
            Add image
          </div>
          {/* Input para seleccionar archivos de imágenes */}
          <input type="file" onChange={uploadImages} className="hidden"></input>
        </label>
      </div>
      <label>Description</label>
      <textarea
        className="p-3 flex"
        placeholder="description"
        value={description}
        onChange={ev => setDescription(ev.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        type="number"
        placeholder="price"
        name="price"
        value={price}
        onChange={ev => setPrice(ev.target.value)}
      />
      <button
        type="submit"
        className="btn-primary"
      >Save</button>
    </form>
  );
}
