'use client';
import { useEffect, useState } from 'react';

interface Group {
  id: number;
  name: string;
}

interface PhoneNumber {
  id: number;
  name: string;
  number: string;
  groupId: number;
  createdAt: string;
}

const Contact = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<number | null>(null);

  useEffect(() => {
    // Fetch all groups
    const fetchGroups = async () => {
      const response = await fetch('http://localhost:3001/groups');
      const data = await response.json();
      setGroups(data);
    };

    fetchGroups();
  }, []);

  const handleGroupChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const groupId = parseInt(event.target.value, 10);
    setSelectedGroup(groupId);

    // Fetch phone numbers for selected group
    const response = await fetch('http://localhost:3001/groups/numbers');
    const data = await response.json();
    setPhoneNumbers(data.filter((number: PhoneNumber) => number.groupId === groupId));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Visualização de Contatos</h1>

        <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-4">
          Selecione um Grupo:
          <select
            id="group"
            value={selectedGroup || ''}
            onChange={handleGroupChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded text-black"
          >
            <option value="">Escolha um grupo</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </label>

        {selectedGroup && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Contatos do Grupo {selectedGroup}</h2>
            {phoneNumbers.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado Em</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {phoneNumbers.map(phone => (
                    <tr key={phone.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{phone.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{phone.number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(phone.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">Nenhum contato encontrado para este grupo.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;
