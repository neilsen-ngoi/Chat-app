import { useEffect, useState } from 'react'
import { Channel, Members } from 'pusher-js'

import useActiveList from './useActiveList'
import { pusherClient } from '../libs/Pusher'

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList()
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null)

  // listen for people joining or leaving channel.
  useEffect(() => {
    let channel = activeChannel

    if (!channel) {
      channel = pusherClient.subscribe('presence-messenger')
      setActiveChannel(channel)
    }

    channel.bind('pusher:subscription_succeeded', (members: Members) => {
      const initialMembers: string[] = []
      // members is speacial class from pusher and is not an array, so dont use forEach
      members.each((member: Record<string, any>) =>
        initialMembers.push(member.id)
      )
      set(initialMembers)
    })

    channel.bind('pusher:member_added', (member: Record<string, any>) => {
      add(member.id)
    })

    channel.bind('pusher:member_removed', (member: Record<string, any>) => {
      remove(member.id)
    })

    return
    if (activeChannel) {
      pusherClient.unsubscribe('presence-messenger')
      setActiveChannel(null)
    }
  }, [activeChannel, set, remove, add])
}

export default useActiveChannel
