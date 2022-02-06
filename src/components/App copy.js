import {firebase} from './firebase'
import {getFirestore, collection, getDocs} from 'firebase/firestore/lite'

function App() {

  const db= getFirestore(firebase)

  const getTareas = async (db) => {
    const tareasCollection= collection(db,'tareas')
    const tareasData= await getDocs(tareasCollection)
    // const tareasList=  tareasData.docs.map(doc =>doc.data())
    // return tareasList
    return tareasData
  }

  const nn = getTareas(db);
  console.log('------------------------');
  console.log(nn);
  console.log(typeof(nn));



  return (
    <>
      <h1>Tareas | Última versión de FireBase</h1>
    </>
  );
}

export default App;
