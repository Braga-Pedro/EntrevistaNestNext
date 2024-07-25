"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Group {
    id: string;
    name: string;
}

export default function GroupPage() {
    const router = useRouter();
    const [groups, setGroups] = useState<Group[]>([]);
    const [group, setGroup] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Função para buscar os grupos do backend
    const fetchGroups = async () => {
        try {
            const response = await fetch('http://localhost:3001/groups');
            const data = await response.json();
            if (Array.isArray(data)) {
                setGroups(data);
            } else {
                const message = 'A resposta da API não é um array'
                setErrorMessage(message);
            }
        } catch (error) {
            const message = 'Erro ao buscar os grupos'
            setErrorMessage(message);
        }
    };

    useEffect(() => {
        fetchGroups();
    }, []);

    // Função para criar um grupo
    const handleSubmitGroup = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/groups', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: group }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message);
                } else {
                    throw new Error('Erro ao criar o grupo');
                }
                return;
            }

            setSuccessMessage('Grupo criado com sucesso!');
            fetchGroups(); // Atualiza a lista de grupos
        } catch (error) {
            setErrorMessage('Erro ao criar o grupo!');
        }
    };

    // Função para enviar o arquivo CSV
    const handleUploadCsv = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedGroup) {
            setErrorMessage('Por favor, selecione um grupo.');
            return;
        }

        if (!csvFile) {
            setErrorMessage('Por favor, selecione um arquivo CSV.');
            return;
        }

        const formData = new FormData();
        formData.append('group', selectedGroup);
        formData.append('file', csvFile);

        try {
            const response = await fetch('http://localhost:3001/groups/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                if (response.status === 401) {
                    const errorData = await response.json();
                    setErrorMessage(errorData.message);
                } else {
                    throw new Error('Erro ao enviar o arquivo CSV!');
                }
                return;
            }

            setSuccessMessage('Arquivo CSV enviado com sucesso!');
            router.push('/contact'); 
        } catch (error) {
            setErrorMessage('Erro ao enviar o arquivo CSV!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6 d:-8">
            <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6">Grupos</h1>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                {successMessage && <p className="text-green-500">{successMessage}</p>}

                <form onSubmit={handleSubmitGroup}>
                    <div className="mb-4">
                        <label htmlFor="group" className="block text-sm font-medium text-gray-700">Criar Novo Grupo:</label>
                        <input
                            type="text"
                            id="group"
                            value={group}
                            onChange={(e) => setGroup(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">Criar Grupo</button>
                </form>

                <hr className="my-6" />

                <form onSubmit={handleUploadCsv}>
                    <div className="mb-4">
                        <label htmlFor="groupSelect" className="block text-sm font-medium text-gray-700">Selecione um Grupo:</label>
                        <select
                            id="groupSelect"
                            value={selectedGroup || ''}
                            onChange={(e) => setSelectedGroup(e.target.value)}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded text-black"
                        >
                            <option value="">Selecione um grupo</option>
                            {groups.map((group) => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700">Upload CSV:</label>
                        <input
                            type="file"
                            id="csvFile"
                            accept=".csv"
                            onChange={(e) => {
                                if (e.target.files) {
                                    setCsvFile(e.target.files[0]);
                                }
                            }}
                            required
                            className="mt-1 block w-full p-2 border border-gray-300 rounded text-black"
                        />
                    </div>
                    <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">Enviar CSV</button>
                </form>
            </div>
        </div>
    );
}
