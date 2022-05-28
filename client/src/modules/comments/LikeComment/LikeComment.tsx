import IUser from 'interfaces/IUser';
import { useLikeComment, useUnlikeComment } from 'modules/posts/apiClient';
import { useCallback, useEffect, useState } from 'react';
import { AiFillLike } from 'react-icons/ai';
import postsService from 'services/posts.service';
import { useAppSelector } from 'store/store';
import { FcLike } from 'react-icons/fc';
import { getCurrentUser } from 'store/selectors/appSelectors';

type LikeCommentProps = {
  postId: string;
  commentId: string;
  initialLikes: IUser[];
};

const LikeComment = ({ commentId, initialLikes }: LikeCommentProps) => {
  const currentUser = useAppSelector(getCurrentUser);

  const [likes, setLikes] = useState(initialLikes);
  const [isCommentLiked, setIsCommentLiked] = useState(postsService.isItemLiked(initialLikes, currentUser?._id));

  const { execute: likeComment, isSucceeded: isLikeCommentSucceeded } = useLikeComment(commentId);
  const { execute: unlikeComment, isSucceeded: isUnlikeCommentSucceeded } = useUnlikeComment(commentId);

  const onClick = useCallback(() => {
    if (isCommentLiked) {
      unlikeComment();
      return;
    }
    likeComment();
  }, [isCommentLiked, likeComment, unlikeComment]);

  useEffect(() => {
    if (!isLikeCommentSucceeded) return;
    setIsCommentLiked(true);
    setLikes((prev) => [...prev, currentUser]);
  }, [currentUser, isLikeCommentSucceeded]);

  useEffect(() => {
    if (!isUnlikeCommentSucceeded) return;
    setIsCommentLiked(false);
    setLikes((prev) => prev.filter((user) => user._id !== currentUser._id));
  }, [isUnlikeCommentSucceeded, currentUser]);

  return (
    <div className='flex gap-2 items-center'>
      <p className='text-md'>{likes.length}</p>
      <button onClick={onClick}>{isCommentLiked ? <FcLike /> : <AiFillLike />}</button>
    </div>
  );
};

export default LikeComment;
