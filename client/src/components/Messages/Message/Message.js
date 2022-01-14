import './Message.css'
import parse from 'html-react-parser';

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

  const checkUrlForm = (text) => {
    let expUrl = /^http[s]?\:\/\//i;

    text.split(' ').forEach((item) => {
      if (expUrl.test(item)) {
        text = text.replace(item, `<a href=${item} target='_blank'>${item}</a>`);
      }
    });

    return text;
  }

  return isSentByCurrentUser ? (
    <div className="messageContainer justifyEnd">
      <p className="sentText pr-10">{trimName}</p>
      <div className="messageBox backgroundBlue">
        <p className="messageText">
          {parse(checkUrlForm(text))}
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
          {parse(checkUrlForm(text))}
        </p>
      </div>
      <p className="sentText pl-10">{user}</p>
    </div>
  )
}

export default Message
