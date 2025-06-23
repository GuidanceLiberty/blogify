import { FaRegCalendarAlt } from 'react-icons/fa';
import userImg from '../../assets/images/user.png';

const Comments = ({comments}) => {

    const img_path = process.env.REACT_APP_UPLOAD_URL

  return (
    <section>
        {
            comments && comments?.comments?.map((comment) => (
                <div className="comment-div">
                    <div className="comment-user-info">
                        <div className="user-img">
                            <img src={comment?.author ? img_path+comment?.author?.photo: userImg} alt="user" className='w-10 h-10' />
                        </div>

                        <div className="user-info">
                            <span> 
                                {
                                    comment?.author?.name
                                }
                            </span>

                            <div className="flex items-center gap-1 !text-sm">
                                <FaRegCalendarAlt className='text-gray-400' />
                                {
                                    new Date(comment?.createdAt).getDate()
                                }
                                {
                                    " "
                                }
                                {
                                   new Date(comment?.createdAt).toLocaleString('default', {month: "long",}) 
                                }
                            </div>
                        </div>

                        
                    </div>

                    <p className="comment-content">
                       {
                        comment?.content
                       }
                    </p>
                </div>
            ))
        }
      
    </section>
  )
}

export default Comments
