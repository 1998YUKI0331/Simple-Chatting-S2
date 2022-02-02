import './Messages.css'
import ScrollToBottom from 'react-scroll-to-bottom'
import Message from './Message/Message'

const Messages = ({ messages, name, notice, setNotice, sendNotice }) => (
  <ScrollToBottom className="messages">
    공지사항: 
    <input value={notice} onChange={(event) => setNotice(event.target.value)} />
    <button onClick={(event) => sendNotice(event)}>등록</button>
    {messages.map((message, index) => (
      <div key={index}>
        <Message message={message} name={name} />
      </div>
    ))}
  </ScrollToBottom>
)

export default Messages
