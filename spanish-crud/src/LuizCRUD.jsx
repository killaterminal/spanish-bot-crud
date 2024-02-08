import React, { useState, useEffect } from 'react'
import './App.css'


function LuizCRUD() {
  const [items, setItems] = useState([]);
  const [file, setFile] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    async function fetchItems() {
      try {
        const response = await fetch('https://kind-rose-termite.cyclic.app/items');
        const itemsData = await response.json();
        setItems(itemsData);
      } catch (error) {
        console.error('Произошла ошибка при загрузке данных', error);
      }
    }
    fetchItems();
  }, []);

  async function addReview(file) {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('text', text);

    try {
      const response = await fetch('https://kind-rose-termite.cyclic.app/add', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const imageUrl = await response.json();
        const reviewAdded = await saveReview(imageUrl);
        if (reviewAdded) {
          return true;
        } else {
          console.error('Ошибка при сохранении отзыва');
          return false;
        }
      } else {
        console.error('Ошибка при загрузке файла');
        return false;
      }
    } catch (error) {
      console.error('Произошла ошибка', error);
      return false;
    }
  }

  async function deleteReview(id) {
    try {
      const response = await fetch(`https://kind-rose-termite.cyclic.app/delete/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems(items.filter(item => item._id !== id));
        return true;
      } else {
        console.error('Ошибка при удалении отзыва');
        return false;
      }
    } catch (error) {
      console.error('Произошла ошибка', error);
      return false;
    }
  }
  return (
    <>
      <div>
        <h1>Отзывы Luiz</h1>
        <h2>Добавить отзыв</h2>
        <div>
          <label htmlFor="text">Файл: </label>
          {/* <input type="file" id="file" onChange={handleFileChangeLuiz} /> */}
          <input type="text" name="text" onChange={(e) => setFile(e.target.value)} required />
          <br />
          <label htmlFor="text">Текст: </label>
          <input type="text" name="text" onChange={(e) => setText(e.target.value)} required />
          <br />
          <button type="button" onClick={async () => addReview()}>Добавить отзыв</button>
        </div>

        <div className='container-photos'>
          {items && items.map((item, index) => (
            <div className='container-content' key={index}>
              {item.text}
              {console.log(item.file)}
              <img src={`${item.file}`} className='photo'></img>
              {/* <img src={`data:image/png;base64,${btoa(String.fromCharCode.apply(null, new Uint8Array(item.file.data)))}`} className='photo' /> */}
              {/* <img src={`http://localhost:3000/uploads/${item.file.data}`} className='img' alt={`Item ${index}`} /> */}
              <button onClick={async () => deleteReview(item._id)}>Удалить</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default LuizCRUD;
