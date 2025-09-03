// frontend/src/pages/member/ProfilePage.jsx (VERSIÓN FINAL)

import React, { useState, useEffect } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { getMyProfile, updateMyProfile } from '../../api/profileApi';

const ProfilePage = () => {
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        phone: '',
        profile_picture_url: ''
    });
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Cargar los datos del perfil al montar el componente
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getMyProfile();
                setProfile(data);
                if (data.profile_picture_url) {
                    setPreviewUrl(`http://127.0.0.1:8000${data.profile_picture_url}`);
                }
            } catch (error) {
                console.error("Error al cargar el perfil:", error);
                setMessage({ type: 'error', text: 'No se pudo cargar tu perfil.' });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        setProfile({ ...profile, [e.target.id]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewProfilePic(file);
            setPreviewUrl(URL.createObjectURL(file)); // Crea una URL temporal para la vista previa
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        // Usamos FormData porque vamos a enviar un archivo
        const formData = new FormData();
        formData.append('full_name', profile.full_name);
        formData.append('phone', profile.phone || '');
        if (newProfilePic) {
            formData.append('profile_picture', newProfilePic);
        }

        try {
            await updateMyProfile(formData);
            setMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
        } catch (error) {
            console.error("Error al actualizar el perfil:", error);
            setMessage({ type: 'error', text: 'Hubo un error al actualizar tu perfil.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Spinner />;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mi Perfil</h1>
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Sección Foto de Perfil */}
                    <div className="flex flex-col items-center space-y-4">
                        <img
                            src={previewUrl || 'https://via.placeholder.com/150'}
                            alt="Foto de perfil"
                            className="h-32 w-32 rounded-full object-cover border-4 border-gray-200"
                        />
                        <label
                            htmlFor="profile-pic-upload"
                            className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg"
                        >
                            Cambiar Foto
                        </label>
                        <input
                            id="profile-pic-upload"
                            type="file"
                            className="hidden"
                            accept="image/png, image/jpeg"
                            onChange={handleFileChange}
                        />
                    </div>

                    {/* Sección Información Personal */}
                    <Input id="full_name" label="Nombre Completo" value={profile.full_name} onChange={handleInputChange} required />
                    <Input id="email" label="Email (no se puede cambiar)" value={profile.email} disabled />
                    <Input id="phone" label="Teléfono" type="tel" value={profile.phone || ''} onChange={handleInputChange} />

                    <div className="flex justify-end pt-4">
                        <Button type="submit" color="primary" disabled={saving}>
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>

                    {/* Mensajes de feedback */}
                    {message.text && (
                        <div className={`mt-4 text-center p-3 rounded-lg ${
                            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {message.text}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;