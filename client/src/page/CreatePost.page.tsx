import { FormEvent, useState } from 'react';
import { Input } from '../comp/Input.comp';
import { ReturnNav } from '../comp/ReturnNav';
import { Button } from '../comp/Button.comp';
import { Side, SideUser } from '../comp/Side.comp';
import { PostDetails } from '../../types/page/CreatePost.page.types';
import { BsImage } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { request } from '../utilities/request.utilities';
import '../style/page/CreatePost.page.scss';

export const CreatePost = () => {
  const navigate = useNavigate();
  const [postDetails, setPostDetails] = useState<PostDetails>({
    post: '',
    file: undefined
  });

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      const formData = new FormData();

      formData.append('post', postDetails.post);

      if (postDetails.file) {
        formData.append('file', postDetails.file);
      }

      const post = await request('/createPost', 'POST', formData);

      if (post) {
        navigate(-1);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <>
      <ReturnNav />
      <SideUser />
      <form
        id="createPost"
        method="POST"
        autoComplete="off"
        noValidate
        onSubmit={async (e) => {
          await handleSubmit(e);
        }}
      >
        <Input<PostDetails>
          id="post"
          type="text"
          value={postDetails.post}
          setValue={setPostDetails}
          placeholder="How are you today?"
          isTextarea
        />
        <div>
          <Input<PostDetails>
            id="file"
            type="file"
            className="file"
            setValue={setPostDetails}
            placeholder="Post picture"
            SVG={<BsImage />}
          />
          <div>{postDetails.post.length}</div>
          <Button
            type="submit"
            onClick={() => {}}
            label="createPost"
            className="buttonPrimary"
            name={'Create'}
          />
        </div>
      </form>
      <Side />
    </>
  );
};
