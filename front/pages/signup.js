import React, { useCallback, useEffect, useState} from 'react';
import Head from 'next/head';
import { Form, Input, Checkbox, Button } from 'antd';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';

import useInput from '../hooks/useInput';
import { SIGN_UP_REQUEST, LOAD_MY_INFO_REQUEST } from '../reducers/user';
import AppLayout from '../components/AppLayout';
import wrapper from '../store/configureStore';


const ErrorMessage = styled.div`   
color:red;
`;

const Signup = () => {
  const dispatch = useDispatch();
  const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);

  useEffect(() => {
    if (me && me.id) {
      Router.replace('/');
    }
  }, [me && me.id]);

  useEffect(() => {
    if (signUpDone) {
      Router.replace('/');
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeINickname] = useInput('');
  const [password, onChangePassword] = useInput('');

  const [PasswordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setPasswordError(e.target.value !== password);
  }, [password]);

  const [term, setTerm] = useState(false);
  console.log(term);
  const [termError, setTermError] = useState(false);
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSubmit = useCallback(() => {
    if (password !== PasswordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      return setTermError(true);
    }
    console.log(email, nickname, password, term);
    dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, password, nickname },
    });
  }, [email, password, PasswordCheck, term]);

  return (
    <AppLayout>
      <Head>
        <title>회원 가입</title>
      </Head>
    <Form onFinish={onSubmit}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
       <Input name="user-email"  type="email" value={email} required onChange={onChangeEmail} />
      </div>
      <div>
        <label htmlFor="user-nick">닉네임</label>
        <br />
       <Input name="user-nick" value={nickname} required onChange={onChangeINickname} />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
       <Input name="user-password"  type='password' value={password} required onChange={onChangePassword} />
      </div>
      <div>
        <label htmlFor="user-password-check">비밀번호체크</label>
        <br />
       <Input name="user-password-check"  type='password' value={PasswordCheck} required onChange={onChangePasswordCheck} />
       {passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
      </div>
      <div>
        <Checkbox name ="user-term" checked={term} onChange = {onChangeTerm}>제로초 말을 잘 들을 것을 동의 합니다.</Checkbox>
        {termError && <ErrorMessage >약관에 동의하셔야 합니다.</ErrorMessage>}
      </div>
        <div style={{marginTop:10}}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
        </div>
    </Form>
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Signup;
