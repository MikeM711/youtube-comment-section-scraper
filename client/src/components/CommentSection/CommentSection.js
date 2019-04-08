import React, { Component } from 'react';
import ReplyComponent from  '../Reply/Reply'
import './CommentSection.css'
import undefAvatar from '../../Images/question-mark.jpg'
import checkmarkImg from '../../Images/checkmark.png'
// let JSONresult = require('../ResultTest2')

class CommentSection extends Component {

  render() {
    const { Result } = this.props
    let JSONresult = JSON.parse(Result)

    function CreatorReplyFilter(OPpost) {
      if (OPpost.replies) {
        var creatorReply = OPpost.replies.filter(replyPost => {
          return replyPost.isCreatorRep === true
        })
        if(creatorReply.length > 0){
          return OPpost
        }
      } 
      return null
    }

    function LikesReplyFilter(OPpost,likeBound){
      if (OPpost.replies) {
        var likesFilter = OPpost.replies.filter(replyPost => {
          let numRepLikes = Number(replyPost.likesRep)
          return numRepLikes >= likeBound
        })

        if (likesFilter.length > 0) {
          return OPpost
        } else {
          return null
        }
      }
    }

    function StringReplyFilter(OPpost,repStr) {
      if (OPpost.replies) {
        var stringReply = OPpost.replies.filter(replyPost => {
          return replyPost.reply.toLowerCase().includes(repStr)
        })
        if(stringReply.length > 0){
          return OPpost
        }
      } 
      return null
    }

    function LikesOPFilter(OPpost,likeBound) {
      if(OPpost.likes >= likeBound){
        return OPpost
      } else {
        return null
      }
    }

    function DateOPFilter(OPpost,time) {

      if(OPpost.date.includes(time)){
        return OPpost
      } else {
        return null
      }
    }

    function DateReplyFilter(OPpost, time) {
      if (OPpost.replies) {
        var stringReply = OPpost.replies.filter(replyPost => {
          return replyPost.dateRep.includes(time)
        })
        if(stringReply.length > 0){
          return OPpost
        }
      } 
      return null
    }

    function NameReplyFilter(OPpost,YTname) {
      if (OPpost.replies) {
        var stringReply = OPpost.replies.filter(replyPost => {
          return replyPost.nameRep === YTname
        })
        if(stringReply.length > 0){
          return OPpost
        }
      } 
      return null
    }

    // Filtering example
    if(JSONresult){
      JSONresult = JSONresult.filter(OPpost => {
        
        // return threads where the video creator is the OP
        let creatorOPFilter = OPpost.isCreator === true
        
        // return threads where the video creator is the replier
        let creatorRepFilter = CreatorReplyFilter(OPpost)

        // return threads where the OP includes a certain string
        let wordOPFilter = OPpost.comment.toLowerCase().includes('night')

        // return threads where the replier includes a certain string
        let stringRepFilter = StringReplyFilter(OPpost, 'night');
        
        // return threads where OP has a certain amount of likes
        let likesOPFilter = LikesOPFilter(OPpost,10)

        // return threads that have one or more replies of a certain amount of likes
        let likesRepFilter = LikesReplyFilter(OPpost,10)

        // return threads that were made within 24 hours
        let dateOPFilter = DateOPFilter(OPpost, 'hours ago')

        // return threads where a reply was made within 24 hours
        let dateRepFilter = DateReplyFilter(OPpost, 'hours ago')

        // return threads created by a certain user
        let nameOPFilter = OPpost.name === "Alabaster Kros"

        let nameRepFilter = NameReplyFilter(OPpost,"Alabaster Kros")

        /*
        Returns video creator threads AND video creator replies
          return creatorOPFilter || creatorRepFilter

        Returns full threads if OP posts or replies use a certain word
          return stringRepFilter || wordOPFilter

        Returns full threads if OP or Reply has a certain amount of likes
          return likesOPFilter || likesRepFilter

        Returns full thread if OP or Reply have a certain date
          return dateRepFilter || dateOPFilter
        
        Returns full thread if OP or Reply are created by a certain person
          return nameOPFilter || nameRepFilter
        */
        
        // return likesOPFilter || likesRepFilter
        return OPpost
      })
    }
    

    const comments = JSONresult.length ? ( 
      JSONresult.map(OPcomment => {

        const Creator = OPcomment.isCreator ? ("comment-header-creator") : ("comment-header")
        const checkmark = OPcomment.isCreator ? (checkmarkImg) : (null)
        const Avatar = OPcomment.avatar !== "" ? (OPcomment.avatar) : (undefAvatar)

        // Below variable adds "finder" to the className of a div to show what post has been found, due to filtering
        
        // const finder = " finder"
        const finder = ""
        
        const replies = OPcomment.replies.length ? (
          OPcomment.replies.map(reply => {
            return (
              <ReplyComponent
                key = {reply.id}
                reply = {reply}
              />
            )
          })
        ) : (null)
        
        return (
          <div className="comment-thread collection" key={OPcomment.id}>
            <div className="comment-class card">

              <div className={Creator}> 
                <img src={Avatar} alt=""></img>
                <span> <b>{OPcomment.name}</b> </span>
                <img src={checkmark} alt=""/>
                <span> | Date: {OPcomment.date} | </span>
                <span>Likes: {OPcomment.likes} | </span>
                <span>
                  <a href={OPcomment.link} target="_blank" rel="noopener noreferrer" >Context </a> 
                </span>
                {/*<span>Creator? {Creator} </span> */}
              </div>

              <div className={"comment-content" + finder}>
                <p>{OPcomment.comment}</p>
              </div>

            </div>

            <div className="comment-class-reply">
              {replies}
            </div>
            
          </div>
        )
      })) : (<div className="center">No Comments found</div>)

    return (
      <div className="progress-class">
        <div>
          <h2>Result</h2>
        </div>
        {/* Filter component 
          - Have a "filter state"
          - send "filter" instructions by function out of component
          - start with a hard-coded filter
            - ie: comments/replies of isCreator and isCreatorRep = true
        
        */}
        <div className="comment-class">
          {comments}
        </div>
      </div>
    )
  }
}

export default CommentSection;