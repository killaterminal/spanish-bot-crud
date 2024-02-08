import React, { useState, useEffect } from 'react'
import './App.css'

function RodrigoCRUD() {
    const [items, setItems] = useState([]);

    useEffect(() => {
        async function fetchItems() {
            try {
                const response = await fetch('https://good-pear-abalone-sari.cyclic.app/items');
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

        try {
            const response = await fetch('https://good-pear-abalone-sari.cyclic.app/add', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                return true;
            } else {
                console.error('Ошибка при отправке файла');
                return false;
            }
        } catch (error) {
            console.error('Произошла ошибка', error);
            return false;
        }
    }

    async function deleteReview(id) {
        try {
            const response = await fetch(`https://good-pear-abalone-sari.cyclic.app/delete/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setItems(items.filter(item => item.id !== id));
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
                <h1>Отзывы Rodrigo</h1>
                <h2>Добавить отзыв</h2>
                <div>
                    <label htmlFor="text">Файл: </label>
                    {/* <input type="file" id="file" onChange={handleFileChangeRodrigo} /> */}
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

export default RodrigoCRUD;