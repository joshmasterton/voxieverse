import { FormEvent, useState } from 'react';
import { Input } from '../comp/Input.comp';
import { Button } from '../comp/Button.comp';
import { Side } from '../comp/Side.comp';
import { PostDetails } from '../../types/page/CreatePost.page.types';
import { BsImage } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { request } from '../utilities/request.utilities';
import { usePopup } from '../context/Popup.context';
import '../style/page/CreatePost.page.scss';

export const CreatePost = () => {
  const navigate = useNavigate();
  const { setPopup } = usePopup();
  const [loading, setLoading] = useState(false);
  const [postDetails, setPostDetails] = useState<PostDetails>({
    text: '',
    file: undefined
  });

  const handleSubmit = async (e: FormEvent) => {
    try {
      setLoading(true);
      e.preventDefault();
      const formData = new FormData();

      formData.append('text', postDetails.text);
      formData.append('type', 'post');

      if (postDetails.file) {
        formData.append('file', postDetails.file);
      }

      const post = await request('/createPostComment', 'POST', formData);

      if (post) {
        navigate(-1);
      }
    } catch (error) {
      if (error instanceof Error) {
        setPopup(error.message);
        console.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
          id="text"
          type="text"
          value={postDetails.text}
          setValue={setPostDetails}
          placeholder="New post here..."
          isTextarea
        />
        <div>
          <Input<PostDetails>
            id="file"
            type="file"
            disabled={loading}
            className="file"
            setValue={setPostDetails}
            placeholder="Post picture"
            SVG={<BsImage />}
          />
          <div>{postDetails.text.length}</div>
          <Button
            type="submit"
            loading={loading}
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
