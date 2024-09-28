import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RootState, useSelector, useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  /** TODO: взять переменную из стора */
  /* const user = useSelector((state) => state.user.userInfo); */
  const { userInfo } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  const [formValue, setFormValue] = useState({
    name: userInfo?.name || '',
    email: userInfo?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: userInfo?.name || '',
      email: userInfo?.email || ''
    }));
  }, [userInfo]);

  const isFormChanged =
    formValue.name !== userInfo?.name ||
    formValue.email !== userInfo?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser(formValue));
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: userInfo?.name || '',
      email: userInfo?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
