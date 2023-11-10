'use client'
import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'

interface ModalProps {
  isOpen?: boolean
  onClose: () => void
  children: React.ReactNode
}
const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
