import React, { Component } from 'react';
import ReplyComponent from  '../Reply/Reply'
import Filter from '../Filter/Filter'
import './CommentSection.css'
import undefAvatar from '../../Images/question-mark.jpg'
import checkmarkImg from '../../Images/checkmark.png'
// let JSONresult = require('../ResultTest2')

class CommentSection extends Component {
  state = {
    videoCreatorComRep: false,
    wordFilter: false,
    likesFilter: false,
    dateFilter: false, // 'hours ago'
    nameFilter: false, // 'Holtzapple Dalton'
  }

  handleCreatorFilter = (isActive) => {
    // console.log(isActive)
    this.setState({
      videoCreatorComRep: isActive,
    })
  }

  render() {
    const { Result } = this.props
    let JSONresult = JSON.parse(Result)

    const {videoCreatorComRep, wordFilter, likesFilter, dateFilter, nameFilter} = this.state

    // Filtering example
    if(JSONresult){
      JSONresult = JSONresult.filter(OPpost => {

        var display = true

        if(videoCreatorComRep){
          if(!OPpost.isCreator){
            display = false
            // future: we will continue and see if replies have any creator comments
          }
        }

        if(wordFilter){
          if(!OPpost.comment.toLowerCase().includes(wordFilter)){
            display = false // future: we will continue, no null
          }
        }

        if(likesFilter){
          if(OPpost.likes < likesFilter){
            display = false // future: we will continue, no null
          }
        }

        if(dateFilter){
          if(!OPpost.date.includes(dateFilter)){
            display = false // future: we will continue, no null
          }
        }

        if(nameFilter) {
          if(OPpost.name !== nameFilter){
            display = false // future: we will continue, no null
          }
        }

        // if we passed all of the "OP post" filters, display the thread
        if(display){
          return OPpost
        }
        // If we have not passed all of the "OP post" filters, we will continue on
        // Do our replies meet our criteria?

        // Filter through replies
        function PostReplies(OPpost, display) {
          if (OPpost.replies.length > 0) {
            const replyPost = OPpost.replies
            // If filter finds one reply that meets ALL criteria, return the whole thread
            for (let i = 0; i < replyPost.length; i++) {
              display = true
              //console.log(replyPost[i])

              if (videoCreatorComRep) {
                if (!replyPost[i].isCreatorRep) {
                  display = false // future: we will continue and see if replies have any creator comments
                } else {
                  display = true
                }
              }

              // If display is still true, enter wordfilter if it exists
              if(wordFilter && display){
                if(!replyPost[i].reply.toLowerCase().includes(wordFilter)){
                  display = false 
                } else {
                  display = true
                }
              }

              if(likesFilter && display){
                if(replyPost[i].likesRep < likesFilter){
                  display = false // future: we will continue, no null
                } else {
                  display = true
                }
              }

              if(dateFilter && display){
                if(!replyPost[i].dateRep.includes(dateFilter)){
                  display = false // future: we will continue, no null
                } else {
                  display = true
                }
              }

              if(nameFilter && display) {
                if(replyPost[i].nameRep !== nameFilter){
                  display = false // future: we will continue, no null
                } else {
                  display = true
                }
              }

              // If we have passed through all of the reply filters, return out of the function
              if(display === true){
                return display
              }

            }
            return display = false
          } else {

            // if no replies, just use the same "display" case
            return display
          }
        }

        // more filter checking
        display = PostReplies(OPpost,display)
        
        if(display){
          return OPpost
        } else {
          return null
        }

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
          <Filter 
            creatorFilter = {this.handleCreatorFilter}
          />
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