import React, { useState } from 'react'
import { SiCockroachlabs } from "react-icons/si";
import './App.css'

function App() {
  const [data, setData] = useState(null)
  const [file, setFile] = useState(null);
  const [text, setText] = useState(null);

  async function fetchItems() {
    const response = await fetch('https://kind-rose-termite.cyclic.app/items');
    const items = await response.json();
    setData(items);
  };

  async function handleFileChange(event) {
    setFile(event.target.files[0]);
  }

  async function addReview() {
    let formData = new FormData();
    formData.append('file', file);
    console.log(file);
    try {
      const response = await fetch('https://kind-rose-termite.cyclic.app/add', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Файл успешно отправлен');
        fetchItems();
      } else {
        console.error('Ошибка при отправке файла');
      }
    } catch (error) {
      console.error('Произошла ошибка', error);
    }
  }


  async function deleteReview(id) {
    try {
      const response = await fetch(`https://kind-rose-termite.cyclic.app/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Отзыв успешно удален');
        fetchItems();
      } else {
        console.error('Ошибка при удалении отзыва');
      }
    } catch (error) {
      console.error('Произошла ошибка', error);
    }
  }

  React.useEffect(() => {
    fetchItems();
  }, []);

  if (data) {
    return (
      <>
        <SiCockroachlabs />
        <h1>Отзывы Luiz</h1>
        <ul id="items-list"></ul>

        <h2>Добавить отзыв</h2>
        <div>
          <label htmlFor="text">Файл:</label>
          <input type="file" id="file" onChange={handleFileChange} />
          <br />
          <label htmlFor="text">Текст:</label>
          <input type="text" name="text" onChange={(e) => setText(e.target.value)} required />
          <br />
          <button type="button" onClick={async () => addReview()}>Добавить отзыв</button>
        </div>

        <div className='container-photos'>
          {data && data.map((item, index) => (
            <div className='container-content' key={index}>
              {item.text}
              {console.log(item.file)}
              <img src={`data:image/png;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(item.file.data)))}` } className='photo'/>
              {/* <img src={`http://localhost:3000/uploads/${item.file.data}`} className='img' alt={`Item ${index}`} /> */}
              <button onClick={async () => deleteReview(item._id)}>Удалить</button>
            </div>
          ))}
        </div>
      </>
    )
  }
}
export default App
