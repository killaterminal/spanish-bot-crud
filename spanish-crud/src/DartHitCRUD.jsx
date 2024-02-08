import React, { useState, useEffect } from 'react'
import './App.css'

function DartHitCRUD() {
    const [userData, setUserData] = useState([]);
    const [partnerData, setPartnerData] = useState([]);
    const [editing, setEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editedFields, setEditedFields] = useState({});
    const [activeTab, setActiveTab] = useState('Users');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch('https://rose-blackbuck-wrap.cyclic.app/users');
                const items = await response.json();
                setUserData(items);

                const partnerResponse = await fetch('https://rose-blackbuck-wrap.cyclic.app/partners');
                const partnerData = await partnerResponse.json();
                setPartnerData(partnerData);
            } catch (error) {
                console.error('Произошла ошибка при загрузке данных', error);
            }
        }

        fetchData();
    }, []);

    async function updateUser(id, newData) {
        try {
            const response = await fetch(`https://rose-blackbuck-wrap.cyclic.app/updateUser/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            });

            if (response.ok) {
                setUserData(userData.map(item => item._id === id ? { ...item, ...newData } : item));
                return true;
            } else {
                console.error('Ошибка при обновлении данных пользователя');
                return false;
            }
        } catch (error) {
            console.error('Произошла ошибка', error);
            return false;
        }
    }

    async function deleteItem(id, type) {
        try {
            const response = await fetch(`https://rose-blackbuck-wrap.cyclic.app/delete${type}/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                if (type === 'User') {
                    setUserData(userData.filter(item => item._id !== id));
                } else if (type === 'Partner') {
                    setPartnerData(partnerData.filter(item => item._id !== id));
                }
                return true;
            } else {
                console.error('Ошибка при удалении');
                return false;
            }
        } catch (error) {
            console.error('Произошла ошибка', error);
            return false;
        }
    }
    const handleEdit = (user) => {
        setSelectedUser(user);
        setEditing(true);

        setEditedFields({
            balance: user.balance,
            luck: user.luck,
            min_balance_to_payout: user.min_balance_to_payout,
            deposit_amounts: user.deposit_amounts.map(amount => String(amount))
        });
    };

    const handleSave = async () => {
        if (!selectedUser || !editedFields) return;

        const updatedData = { ...selectedUser, ...editedFields };

        if (updatedData.deposit_amounts) {
            updatedData.deposit_amounts = updatedData.deposit_amounts.map(amount => Number(amount));
        }

        const success = await updateUser(selectedUser._id, updatedData);

        if (success) {
            setEditing(false);
            setEditedFields({});
        }
    };

    const handleFieldChange = (e, index) => {
        const newValue = e.target.value;
        setEditedFields(prevState => {
            const updatedAmounts = [...prevState.deposit_amounts];
            updatedAmounts[index] = newValue;
            return { ...prevState, deposit_amounts: updatedAmounts };
        });
    };

    return (
        <>
            <div>
                <h1>Dart Hit Bot</h1>
                <div className="tabs">
                    <button onClick={() => setActiveTab('Users')}>Users</button>
                    <button onClick={() => setActiveTab('Partners')}>Partners</button>
                </div>
                <div className='container-photos'>
                    {activeTab === 'Users' && userData && userData.map((item, index) => (
                        <div className='container-content' key={index}>
                            {editing && selectedUser && selectedUser._id === item._id ? (
                                <>
                                    <p>Имя: {item.name}</p>
                                    <p>Номер телефона: {item.phoneNumber}</p>
                                    <p>Имя пользователя: @{item.username}</p>
                                    <p>ID пользователя: {item.userId}</p>
                                    <p>Баланс: <input type="text" value={editedFields.balance} onChange={(e) => handleFieldChange(e, 'balance')} /></p>
                                    <p>Удача: <input type="text" value={editedFields.luck} onChange={(e) => handleFieldChange(e, 'luck')} /></p>
                                    <p>Минимальный баланс для вывода:<input type="text" value={editedFields.min_balance_to_payout} onChange={(e) => handleFieldChange(e, 'min_balance_to_payout')} /></p>
                                    {editedFields.deposit_amounts && editedFields.deposit_amounts.map((amount, index) => (
                                        <input key={index} type="text" value={amount} onChange={(e) => handleFieldChange(e, index)} />
                                    ))}
                                    <p>Был зачитан: {item.hasBeenCounted ? 'Да' : 'Нет'}</p>
                                    <button onClick={handleSave}>Сохранить</button>
                                </>
                            ) : (
                                <>
                                    <p>Имя: {item.name}</p>
                                    <p>Номер телефона: {item.phoneNumber}</p>
                                    <p>Имя пользователя: @{item.username}</p>
                                    <p>ID пользователя: {item.userId}</p>
                                    <p>Баланс: {item.balance}</p>
                                    <p>Удача: {item.luck}</p>
                                    <p>Минимальный баланс для вывода: {item.min_balance_to_payout}</p>
                                    <p>Суммы пополнения: {item.deposit_amounts.map((amount, index) => (
                                        <span key={index}>{amount} </span>
                                    ))}</p>
                                    <p>Был зачитан: {item.hasBeenCounted ? 'Да' : 'Нет'}</p>
                                    <div className="button-row">
                                        <button onClick={() => deleteItem(item._id, 'User')}>Удалить</button>
                                        <button onClick={() => handleEdit(item)}>Изменить</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    {activeTab === 'Partners' && partnerData && partnerData.map((item, index) => (
                        <div className='container-content' key={index}>
                            <p>Имя: {item.name}</p>
                            <p>Номер телефона: {item.phoneNumber}</p>
                            <p>Имя пользователя: @{item.username}</p>
                            <p>ID пользователя: {item.userId}</p>
                            <p>Кол-во обрабов: {item.referals}</p>
                            <div className="button-row">
                                <button onClick={() => deleteItem(item._id, 'Partner')}>Удалить</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )

}

export default DartHitCRUD;
