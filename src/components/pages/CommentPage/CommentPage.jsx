import React from 'react'
import { soccerappClient } from '../../../provider/api'
import './CommentPage.css'
import { useMediaQuery } from "react-responsive"
import { Team } from '../TeamPage/TeamPage'
import { TeamContext } from '../../../provider/ProtectedRoute'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faThumbsUp, faReply, faChevronUp, faChevronDown, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"

const Comment = ({ initial, handleAddReply, handleDelete }) => {
  const [commentInfo, setCommentInfo] = React.useState(initial)
  const [addReplyPresent, setAddReplyPresent] = React.useState(false)

  const [isPopUpPresent, setIsPopUpPresent] = React.useState(false)
  const [isForUpdate, setIsForUpdate] = React.useState(false)


  // like the comment 
  const likeComment = () => {
    soccerappClient.post(`/like_comment/${commentInfo.id}`)
      .then((response) => {
        console.log(`Status for liking comment ${commentInfo.id}: ${response.status}`)
        setCommentInfo(response.data)
      })
      .catch((error) => console.log(error));
  }

  // update the content of the comment with new content 
  const updateCommentContent = (newContent) => {
    soccerappClient.put(`/comments/${commentInfo.id}`, { content: newContent })
      .then((response) => {
        console.log(`Status for updating comment ${commentInfo.id}: ${response.status}`)
        setCommentInfo(response.data) // new comment info (but just the content is updated )
      })
      .catch((error) => console.log(error));
  }

  return (
    <div style={{ position: "relative", maxWidth: "800px", margin: "auto" }}>
      {!isForUpdate ? (
        <>
          <div className="comment-wrapper">
            <div className="avatar-wrapper"><img src="https://th.bing.com/th/id/OIP.YKalkZxRK47yMN0HEKM-UwAAAA?w=167&h=180&c=7&r=0&o=5&dpr=2&pid=1.7" /></div>
            <div>
              <div className="first-part-wrapper">
                <div className="username">@{commentInfo.username}</div>
                <div className="created-time">{commentInfo.created_time}</div>
              </div>
              <div className="comment-content">
                {commentInfo.replyToUsername !== "" && (<span style={{ color: "blue" }}>@{commentInfo.replyToUsername}</span>)} {commentInfo.content}
              </div>
              <div className="second-part-wrapper">
                <div className="comment-likes" onClick={likeComment}>
                  <FontAwesomeIcon icon={faThumbsUp} style={{ color: commentInfo.is_liked_by_user ? "black" : "gray" }} /> {commentInfo.likes}
                </div>
                <div className="comment-reply" onClick={() => setAddReplyPresent(true)}><FontAwesomeIcon icon={faReply} /> Reply</div>
              </div>
            </div>
            {commentInfo.is_from_user && (
              <div style={{ fontSize: "1.25rem", display: "flex", alignItems: "center" }}
                onClick={() => setIsPopUpPresent(!isPopUpPresent)}><FontAwesomeIcon icon={faEllipsisVertical} /></div>
            )}
          </div>
          {isPopUpPresent && (
            <div className="delete-update">
              <div onClick={() => { setIsForUpdate(true); setIsPopUpPresent(false) }}>Update</div>
              <div onClick={() => handleDelete(commentInfo.id)}>Delete</div>
            </div>
          )}
        </>
      ) : (
        <div style={{ marginTop: "1.3rem" }}>
          <AddCommentArea avatar="https://th.bing.com/th/id/OIP.YKalkZxRK47yMN0HEKM-UwAAAA?w=167&h=180&c=7&r=0&o=5&dpr=2&pid=1.7"
            cancel={true} forUpdate={true} defaultText={commentInfo.content}
            handleCancel={() => { setIsForUpdate(false) }} handleUpdate={updateCommentContent} />
        </div>
      )}
      {addReplyPresent && (<AddCommentArea cancel={true} handleCancel={() => setAddReplyPresent(false)}
        handleAddReply={(content) => handleAddReply(commentInfo.username, content)} />
      )}
    </div>
  )
}

const AddCommentArea = ({
  forUpdate = false, cancel = false, defaultText = "",
  handleCancel = null, handleAddReply = null, handleUpdate = null,
  avatar = "https://i.pinimg.com/originals/68/76/99/6876993a25a8fc274cc09aee12171034.jpg" }) => {
  const [content, setContent] = React.useState(defaultText);

  return (
    <div className="add-comment-wrapper">
      <div className="add-comment-area">
        <div className="avatar-wrapper"><img src={avatar} /></div>
        <div className="text-area">
          <textarea className="text" cols="30" rows="3" placeholder="Add a comment"
            onChange={(e) => setContent(e.target.value)} value={content}></textarea>
        </div>
      </div>
      <div className="comment-button-wrapper">
        {cancel && <button className="comment-button" onClick={handleCancel}>Cancel</button>}
        {forUpdate ? (
          <button className={`comment-button ${content === "" ? "disabled" : "non-disabled"}`} disabled={content === ""} onClick={() => {
            handleUpdate(content);
            handleCancel();
          }}>Update</button>
        ) : (
          <button className={`comment-button ${content === "" && "disabled"}`} disabled={content === ""} onClick={() => {
            handleAddReply(content);
            if (handleCancel !== null) {
              handleCancel(); // if this is for cancel, close the reply area 
            } else {
              // clear the content and words in the text area 
              setContent("");
            }
          }}>Comment</button>
        )}
      </div>
    </div>
  )
}

// the wrapper of the comment and its replies 
const CommentReplyArea = ({ commentInfo, handleDelete }) => {
  const teamId = React.useContext(TeamContext)

  const [replyList, setReplyList] = React.useState([])
  const [replyListLoaded, setReplyListLoaded] = React.useState(false)
  const [isReplyPresent, setIsReplyPresent] = React.useState(false)

  // get the list of replies to this comment, called only after the click
  const getReplyList = () => {
    soccerappClient.get(`/comments?team=${teamId}&reply_to=${commentInfo.id}`)
      .then((response) => {
        console.log(`Status for getting the reply list of comment ${commentInfo.id}: ${response.status}`)
        setReplyList(response.data)
      })
      .catch(error => console.log(error));
  }

  // add the reply to list of replies to this comment 
  const addReply = (toUsername, content) => {
    let commentData = { // data to be posed to the database
      content: content,
      replyToUsername: toUsername,
      replyToComment: commentInfo.id,
      likes: []
    }
    soccerappClient.post(`/comments?team=${teamId}`, commentData)
      .then((response) => {
        console.log(`Status for adding reply to comment ${commentInfo.id}: ${response.status}`)
        const newReply = response.data
        setReplyList([...replyList, newReply]) // add the new reply to the list of replies 
        setIsReplyPresent(true) // show the list of replies 
      })
      .catch((error) => console.log(error));
  }

  // delete the comment from the list 
  const deleteReply = (replyId) => {
    soccerappClient.delete(`/comments/${replyId}`)
      .then((response) => {
        console.log(`Status for deleting: ${response.status}`)
        // filter the reply with the given id from the list 
        setReplyList(replyList.filter(reply => reply.id !== replyId))
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="comment-section">
      <Comment initial={commentInfo} handleAddReply={addReply} handleDelete={handleDelete} />
      <div className="see-reply-wrapper" onClick={() => {
        if (!isReplyPresent && !replyListLoaded) {
          getReplyList(); // fetch the list replies to this comment 
          setReplyListLoaded(true); // mark that list has been loaded 
        }
        setIsReplyPresent(!isReplyPresent); // convert back original state
      }}><FontAwesomeIcon icon={isReplyPresent ? faChevronUp : faChevronDown} /> Replies</div>
      {isReplyPresent && (
        <div className="reply-wrapper">
          <div className="vertical-line"></div>
          <div>
            {replyList.map(reply => <Comment key={reply.id} initial={reply} handleAddReply={addReply} handleDelete={deleteReply} />)}
          </div>
        </div>
      )}
    </div>
  )
}

// THE PAGE SHOWING THE INFO OF THE 
const CommentPage = () => {
  const teamId = React.useContext(TeamContext)

  const [teamInfo, setTeamInfo] = React.useState({})
  const [commentList, setCommentList] = React.useState([])

  const isSmallDevice = useMediaQuery({ query: "(max-width: 500px)" });

  // get the list of comments to this team 
  React.useEffect(() => {
    Promise.all([
      soccerappClient.get(`/teams/${teamId}`),
      soccerappClient.get(`/comments?team=${teamId}`),
    ])
      .then((response) => {
        console.log(`Status for getting comment list: ${response[1].status}`)
        setTeamInfo(response[0].data) // info of the team 
        setCommentList(response[1].data)
      })
      .catch(error => console.log(error));
  }, [])

  // add the comment to this team 
  const addComment = (content) => {
    let commentData = { // data to be posed to the database
      content: content,
      replyToUsername: "",
      replyToComment: null,
      likes: []
    }
    soccerappClient.post(`/comments?team=${teamId}`, commentData)
      .then((response) => {
        console.log(`Status for adding comment to team: ${response.status}`)
        const newComment = response.data
        setCommentList([...commentList, newComment]) // add the new comment 
      })
      .catch((error) => console.log(error));
  }

  // delete the comment from the list 
  const deleteComment = (commentId) => {
    soccerappClient.delete(`/comments/${commentId}`)
      .then((response) => {
        console.log(`Status for deleting: ${response.status}`)
        // filter the comment with the given id from the list 
        setCommentList(commentList.filter(comment => comment.id !== commentId))
      })
      .catch((error) => console.log(error));
  }

  return (
    <div className="comment-page">
      {/* The info of the team */}
      <Team teamInfo={teamInfo} isSmallDevice={isSmallDevice} />

      <div className="comment-section">
        <h2 className="comment-section-title" style={{ maxWidth: "800px", margin: "auto" }}>{commentList.length} Comments</h2>
        {/* Top area for the user to add comment to this team */}
        <AddCommentArea handleAddReply={addComment} />
        <div>
          {commentList.map(comment => <CommentReplyArea key={comment.id} commentInfo={comment} handleDelete={deleteComment} />)}
        </div>
      </div>
    </div>
  )
}

export default CommentPage; 