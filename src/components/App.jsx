import React, { useEffect } from 'react';
import { collection, doc, getDocs, addDoc, deleteDoc, updateDoc } from "firebase/firestore";

import db from '../firebase/firebaseConfig'

// Definición del componente
const App = () => {
  //
  // Definición de FUNCIONES
  //
  // Toma los datos y los guarda en arreglo del estado "tareas"
  const getDataFirestore = async () => {
    try {
      const collectionDb = collection(db, 'tareas');
      const docsTable = await getDocs(collectionDb);
      const dataList = docsTable.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTareas(dataList);
    } catch (error) {
      console.log(error);
    }
  }
  // Agrega un registro a la tabla en la BD. OJO: Se llama en el SUBMIT del FORMULARIO y no en un botón.
  const fnAgregar = async e => {
    e.preventDefault();
    if (!tarea.trim()) {
      console.log('¡Tarea vacia!: Ingrese una tarea.')
      return
    }
    try {
      // Crea registro con la tarea a guardar
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now()
      }
      // Guarda en la colección el documento que hay en el estado "tarea"
      const nuevoDocData = await addDoc(collection(db, 'tareas'), nuevaTarea);
      console.log('Tarea agregada con ID: ' + nuevoDocData.id);
      // Limpia el campo de tarea con su respectivo estado
      setTareas([
        ...tareas,
        { ...nuevaTarea, id: nuevoDocData.id }
      ])
      setTarea('');
    } catch (error) {

      console.log(error)
    }
  }
  // Borra un registro de la tabla en la BD
  const fnEliminar = async id => {
    try {
      await deleteDoc(doc(db, 'tareas', id))
      const arrayFiltrado = tareas.filter(item => item.id !== id)
      setTareas(arrayFiltrado)
    } catch (error) {
      console.log(error)
    }
  }
  // Se encarga de actualizar los estados para poner el componente en modo edición y poder llamar la función de editar 
  // desde el SUBMIT del FORULARIO, de igual forma que se hizo en agregar un registro
  const fnActivarEdicion = item => {
    setModoEdicion(true)
    setTarea(item.name)
    setId(item.id)
  }
  // Editar un registro de la tabla en la BD y guardarlo modificado.  OJO: Se llama en el SUBMIT del FORMULARIO y no en un botón.
  const fnEditar = async e => {
    e.preventDefault()
    if (!tarea.trim()) {
      console.log('¡Tarea vacia!: Ingrese una tarea.')
      return
    }
    try {
      await updateDoc(
        doc(db, 'tareas', id),
        {
          name: tarea
        })
      const arrayEditado = tareas.map(item => (
        item.id === id
          ? { id: item.id, fecha: item.fecha, name: tarea }
          : item
      ))
      setTareas(arrayEditado)
      setModoEdicion(false)
      setTarea('')
      setId('')
    } catch (error) {
      console.log(error)
    }
  }
  //
  // Definición de HOOKS
  const [tareas, setTareas] = React.useState([]);
  const [tarea, setTarea] = React.useState('');
  const [id, setId] = React.useState('')
  const [modoEdicion, setModoEdicion] = React.useState(false)

  useEffect(() => {
    getDataFirestore();
  }, [])
  //
  // Definición y construcción HTML
  return (
    <>
      <div className='container'>
        <div className='row'>
          {/* Lista de tareas */}
          <div className='col-12 col-sm-6 mt-3'>
            <ul className='list-group'>
              {
                // MAP para recorrer el estado "tareas" que tiene el arreglo de las tareas
                tareas.map(item => (
                  <li className="list-group-item" key={item.id}>
                    <button
                      className='btn btn-sm btn-danger float-end'
                      onClick={() => fnEliminar(item.id)}
                    >
                      Eliminar
                    </button>
                    <button
                      className={modoEdicion
                        ? 'btn btn-sm btn-info me-2 float-end'
                        : 'btn btn-sm btn-warning me-2 float-end'
                      }
                      onClick={() => fnActivarEdicion(item)}
                    >
                      Editar
                    </button>
                    {item.name}
                  </li>
                ))
              }
            </ul>
          </div>
          {/* ------------------------------- */}
          {/* Formulario de captura de tareas */}
          <div className='col-12 col-sm-6 mt-3'>
            <h3>
              {modoEdicion ? 'Editar Tarea' : 'Agregar Tarea'}
            </h3>
            <form onSubmit={modoEdicion ? fnEditar : fnAgregar}
            >
              <input
                type="text"
                className="form-control mb-2"
                placeholder='Ingrese la Tarea'
                value={tarea}
                onChange={e => setTarea(e.target.value)}
              />
              <button
                type='submit'
                className={
                  modoEdicion
                    ? "btn btn-info btn-block w-100 opacity-75"
                    : "btn btn-success btn-block w-100 opacity-75"}
              >
                {modoEdicion ? 'Modificar Tarea' : 'Agregar Tarea'}
              </button>
            </form>
          </div>
        </div> {/* End: row */}
      </div> {/* End: container */}
    </>
  );
};

export default App;
