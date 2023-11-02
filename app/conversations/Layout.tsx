import SideBar from '../components/sidebar/Sidebar'
import ConversationList from './components/ConversationList'
export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SideBar>
      <div className="h-full">
        <ConversationList />
        {children}
      </div>
    </SideBar>
  )
}
