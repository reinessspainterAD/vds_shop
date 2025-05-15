import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Settings.module.css';
import apiClient from '../../api/apiClient';
import defaultAvatar from '../../assets/user1.svg';
import LogoTextRow from '../../components/HeaderGroup/LogoTextRow/LogoText.jsx'
import DropDownMenuD from '../../components/HeaderGroup/DropDownMenuD/DropDownMenuD.jsx'


import men1 from '../../assets/menPack/men1.svg';
import men2 from '../../assets/menPack/men2.svg';
import men3 from '../../assets/menPack/men3.svg';
import men4 from '../../assets/menPack/men4.svg';
import men5 from '../../assets/menPack/men5.svg';

import women1 from '../../assets/womenPack/women1.svg';
import women2 from '../../assets/womenPack/women2.svg';
import women3 from '../../assets/womenPack/women3.svg';
import women4 from '../../assets/womenPack/women4.svg';
import women5 from '../../assets/womenPack/women5.svg';

import home from '../../assets/home.png'

const predefinedAvatars = [
  men1, men2, men3, men4, men5,
  women1, women2, women3, women4, women5,

];

function Settings(){
    const [openUserMenu, setOpenUserMenu] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');
    const [preview, setPreview] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUser() {
            const res = await apiClient.get('/api/user-data');
            if(res.data.status === 'ok'){
                setName(res.data.user.name);
                setEmail(res.data.user.email);
                setImage(res.data.user.image || '');
                setPreview(res.data.user.image || defaultAvatar);
            }
        }
        fetchUser();
    }, []);

    const handleConfirm = async (field, value, endpoint, message) => {
        if(!window.confirm(message)) return;
        await apiClient.put(endpoint, { [field]: value });
        if(field === 'newEmail' || field === 'password'){
            localStorage.removeItem('token');
            navigate('/login');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
            setImage(reader.result);
        };
        reader.readAsDataURL(file);
    };

    console.log(image)


    return(
        <section className={styles.settings}>
            <div className={styles.header}>
                <div className={styles.leftPart}><LogoTextRow/></div>
                
                <div className={styles.usermenu} onClick={() => setOpenUserMenu((prev) => !prev)}>
                    <div>
                        <h2>{name}</h2>
                        <p>{email}</p>
                    </div>
                    <img
                        src={image ? image : defaultAvatar}
                        alt="userphoto"
                        className={styles.userImg}
                    />
                    {
                        openUserMenu && <DropDownMenuD />
                    }
                </div>
                <button className={styles.homeBtn}><img src={home} alt="home" onClick={() => {navigate('/dashboard')}}/></button>
            </div>
            <div className={styles.body}>
                <div className={styles.inputs}>
                    <h2 className={styles.h2}>Настройки профиля</h2>
                    {/* Имя */}
                    <div className={styles.block}>
                        <label className={styles.inputLabels}>Имя:</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} />
                        <button onClick={() => handleConfirm('name', name, '/api/user/update-name', 'Вы уверены, что хотите изменить имя?')}>Изменить</button>
                    </div>

                    {/* Email */}
                    <div className={styles.block}>
                        <label className={styles.inputLabels}>Email:</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} />
                        <button onClick={() => handleConfirm('newEmail', email, '/api/user/update-email', 'Вы уверены, что хотите изменить email? После этого потребуется повторная авторизация.')}>Изменить</button>
                    </div>

                    {/* Пароль */}
                    <div className={styles.block}>
                        <label className={styles.inputLabels}>Новый пароль:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <button onClick={() => handleConfirm('password', password, '/api/user/update-password', 'Вы уверены, что хотите изменить пароль? После этого потребуется повторная авторизация.')}>Изменить</button>
                    </div>
                </div>

                <div className={styles.images}>
                    {/* Аватар */}
                    <div className={styles.block}>
                        <label className={styles.labelh2}>Аватар:</label>
                        <div className={styles.upperBlock}>
                            <img className={styles.preview} src={preview || defaultAvatar} alt="avatar" />
                            <input type="file" accept="image/*" id="fileInput" onChange={handleImageUpload} style={{ display: 'none' }}/>
                            <label htmlFor="fileInput" className={styles.uploadBtn}>
                                Загрузить фото
                            </label>
                        </div>
                        <div className={styles.predefinedAvatars}>
                            {predefinedAvatars.map((src, i) => (
                                <img key={i} src={src} alt={`avatar-${i}`} onClick={() => { setPreview(src); setImage(src); }} className={styles.choice}/>
                            ))}
                        </div>
                        <button onClick={() => handleConfirm('image', image, '/api/user/update-avatar', 'Вы уверены, что хотите изменить аватар?')}>Сохранить аватар</button>
                    </div>
                </div>
            </div>
            
        </section>
    )
};

export default Settings