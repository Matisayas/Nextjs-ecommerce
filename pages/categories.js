/* eslint-disable react/jsx-key */
import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from "react-sweetalert2";

function Categories({swal}){
  const[editedCategory, setEditedCategory]=useState(null)
  // Estados para el nombre de la categoría y la categoría principal
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  // Estado para almacenar las categorías disponibles
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Cargar categorías cuando el componente se monta
    fetchCategories();
  }, []);

  function fetchCategories() {
    // Obtener las categorías disponibles desde tu API
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {name, parentCategory}
    if(editedCategory){
      data._id= editedCategory._id
      await axios.put('/api/categories',data);
      setEditedCategory(null);
    }else{
      await axios.post('/api/categories', data);
    }
    // Limpiar el campo de entrada de nombre
    setName('');
    // Limpiar la categoría principal seleccionada
    setParentCategory('');
    // Volver a cargar las categorías para mostrar la nueva
    fetchCategories();
  }
    //Edita la categoria
  function editCategory(category){
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
  }

  function deleteCategory(category){
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}`,
      showCancelButton: true,
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes, delete!',
      confirmButtonColor:'#d55',
      reverseButtons: true,
    }).then( async result => {
      if(result.isConfirmed){
        const{_id} = category;
        await axios.delete('/api/categories?_id='+_id);
        fetchCategories();
      }
      });
 
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>{editedCategory
      ? `Edit Category ${editedCategory.name}`: 
      'Create new category'}
      </label>
      <form onSubmit={saveCategory} className="flex gap-1">
        {/* Campo de entrada para el nombre de la categoría */}
        <input
          className="mb-0"
          type="text"
          placeholder={'Category name'}
          onChange={ev => setName(ev.target.value)}
          value={name}
        />
        {/* Selección de categoría principal */}
        <select
          className="mb-0"
          onChange={ev => setParentCategory(ev.target.value)}
          value={parentCategory}
        >
          <option value="0">No parent category</option>
          {categories.length > 0 && categories.map(category => (
            // Usamos category._id como clave única en las opciones
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
        {/* Botón para guardar la categoría */}
        <button type="submit" className="btn-primary py-1">
          Save
        </button>
      </form>
      <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map(category => (
              // Usamos category._id como clave única en las filas de la tabla
              <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td>
                  <button 
                  onClick={()=> editCategory(category)} 
                  className="btn-primary mr-1">
                    Edit
                  </button>
                  <button
                  onClick={()=> deleteCategory(category)}
                   className="btn-primary">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({swal}, ref) => (
<Categories swal={swal}/>
  ));