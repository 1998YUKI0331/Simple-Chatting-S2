import './Message.css'
import ReactEmoji from 'react-emoji'

const Message = ({ message: { user, text }, name }) => {
  let isSentByCurrentUser = false

  const trimName = name.trim().toLowerCase()
  if (user === trimName) {
    isSentByCurrentUser = true
  }

  const clickedBtn = (e) => {
    window.location.href = "/"
    e.stopPropagation()
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimName}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText">
          {ReactEmoji.emojify(text)}
        </p>
      </div>
    </div>
  ) : (
    text === "채팅이 종료되었습니다" ?
    <div className='popup'>
      <div className='popup-inner'>
        <button onClick={clickedBtn}>
          확인</button>
      </div>
    </div>
    :
    <div className="messageContainer justifyStart">
      <div className="messageBox backgroundLight">
        <p className="messageText colorDark">
          {ReactEmoji.emojify(text)}
        </p>
      </div>
      <p className="sentText pl-10">{user}</p>
    </div>
  )
}

export default Message
