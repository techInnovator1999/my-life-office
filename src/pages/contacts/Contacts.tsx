import { useState } from 'react'
import { ContactType } from '@/types/contact'

type ContactSource = 'Main Contact' | 'Google Contacts' | 'Lead Buckets' | 'Referral Partners'

type DummyContact = {
  id: number
  name: string
  email: string
  type: string
  leadSource: string
  phone: string
  dob: string
}

const dummyContacts: DummyContact[] = [
  {
    id: 1,
    name: 'Snow',
    email: 'Jon@gmail.com',
    type: 'Client',
    leadSource: 'Existing',
    phone: '+44 20 1234 6549',
    dob: '12.06.1009',
  },
  {
    id: 2,
    name: 'Lannister',
    email: 'Cersei@gmail.com',
    type: 'Client',
    leadSource: 'Existing',
    phone: '+44 20 1234 6549',
    dob: '12.06.1009',
  },
  {
    id: 3,
    name: 'Lannister',
    email: 'Jaime@gmail.com',
    type: 'Client',
    leadSource: 'Existing',
    phone: '+44 20 1234 6549',
    dob: '12.06.1009',
  },
  {
    id: 4,
    name: 'Stark',
    email: 'Arya@gmail.com',
    type: 'Client',
    leadSource: 'Existing',
    phone: '+44 20 1234 6549',
    dob: '12.06.1009',
  },
  {
    id: 5,
    name: 'Targaryen',
    email: 'Daenerys@gmail.com',
    type: 'Client',
    leadSource: 'Existing',
    phone: '+44 20 1234 6549',
    dob: '12.06.1009',
  },
  {
    id: 6,
    name: 'Melisandre',
    email: 'mel@gmail.com',
    type: 'Client',
    leadSource: 'Existing',
    phone: '+44 20 1234 6549',
    dob: '12.06.1009',
  },
]

export function Contacts() {
  const [selectedContactType, setSelectedContactType] = useState<'Individual' | 'Business'>('Individual')
  const [selectedContactSource, setSelectedContactSource] = useState<ContactSource>('Main Contact')

  const handleDelete = (id: number) => {
    console.log('Delete contact:', id)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-text-main dark:text-white font-display">Contact</h1>
        <button className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-md shadow-sm hover:bg-primary-hover hover:shadow-md active:bg-primary-800 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add Contact
          </span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        {/* Contact Type Filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Type:</span>
          <button
            onClick={() => setSelectedContactType('Individual')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedContactType === 'Individual'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white dark:bg-surface-dark text-gray-700 dark:text-gray-300 border border-neutral-200 dark:border-[#302938] hover:bg-neutral-50 dark:hover:bg-[#302938] hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            Individual
          </button>
          <button
            onClick={() => setSelectedContactType('Business')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              selectedContactType === 'Business'
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white dark:bg-surface-dark text-gray-700 dark:text-gray-300 border border-neutral-200 dark:border-[#302938] hover:bg-neutral-50 dark:hover:bg-[#302938] hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">business</span>
            Business
          </button>
        </div>

        {/* Contact Source Filters */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Source:</span>
          {(['Main Contact', 'Google Contacts', 'Lead Buckets', 'Referral Partners'] as ContactSource[]).map((source) => (
            <button
              key={source}
              onClick={() => setSelectedContactSource(source)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                selectedContactSource === source
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white dark:bg-surface-dark text-gray-700 dark:text-gray-300 border border-neutral-200 dark:border-[#302938] hover:bg-neutral-50 dark:hover:bg-[#302938] hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {source === 'Google Contacts' && <span className="text-[18px] font-bold">G</span>}
              {source === 'Main Contact' && <span className="material-symbols-outlined text-[18px]">person</span>}
              {source === 'Lead Buckets' && <span className="material-symbols-outlined text-[18px]">shopping_basket</span>}
              {source === 'Referral Partners' && <span className="material-symbols-outlined text-[18px]">diamond</span>}
              {source}
            </button>
          ))}
        </div>
      </div>

      {/* Table Controls */}
      <div className="flex items-center gap-4">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-surface-dark border border-neutral-200 dark:border-[#302938] rounded-md hover:bg-neutral-50 dark:hover:bg-[#302938] hover:shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">view_column</span>
          Columns
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-surface-dark border border-neutral-200 dark:border-[#302938] rounded-md hover:bg-neutral-50 dark:hover:bg-[#302938] hover:shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">tune</span>
          Filters
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-surface-dark border border-neutral-200 dark:border-[#302938] rounded-md hover:bg-neutral-50 dark:hover:bg-[#302938] hover:shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">view_agenda</span>
          Density
        </button>
        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-surface-dark border border-neutral-200 dark:border-[#302938] rounded-md hover:bg-neutral-50 dark:hover:bg-[#302938] hover:shadow-sm active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-card border border-neutral-200 dark:border-[#302938]/50 overflow-hidden">
        <div className="overflow-x-auto auto-scrollbar">
          <table className="w-full">
            <thead className="bg-neutral-50 dark:bg-surface-darker border-b border-neutral-200 dark:border-[#302938]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Lead Source
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  phone
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  DOB
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-[#302938]">
              {dummyContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-neutral-50 dark:hover:bg-surface-darker transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main dark:text-white">
                    {contact.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-main dark:text-white">
                    {contact.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {contact.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main dark:text-white">
                    {contact.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main dark:text-white">
                    {contact.leadSource}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main dark:text-white">
                    {contact.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-main dark:text-white">
                    {contact.dob}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200"
                      aria-label="Delete contact"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

