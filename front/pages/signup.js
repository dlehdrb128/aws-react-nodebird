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
        <title>?????? ??????</title>
      </Head>
    <Form onFinish={onSubmit}>
      <div>
        <label htmlFor="user-email">?????????</label>
        <br />
       <Input name="user-email"  type="email" value={email} required onChange={onChangeEmail} />
      </div>
      <div>
        <label htmlFor="user-nick">?????????</label>
        <br />
       <Input name="user-nick" value={nickname} required onChange={onChangeINickname} />
      </div>
      <div>
        <label htmlFor="user-password">????????????</label>
        <br />
       <Input name="user-password"  type='password' value={password} required onChange={onChangePassword} />
      </div>
      <div>
        <label htmlFor="user-password-check">??????????????????</label>
        <br />
       <Input name="user-password-check"  type='password' value={PasswordCheck} required onChange={onChangePasswordCheck} />
       {passwordError && <ErrorMessage>??????????????? ???????????? ????????????.</ErrorMessage>}
      </div>
      <div>
        <Checkbox name ="user-term" checked={term} onChange = {onChangeTerm}>????????? ?????? ??? ?????? ?????? ?????? ?????????.</Checkbox>
        {termError && <ErrorMessage >????????? ??????????????? ?????????.</ErrorMessage>}
      </div>
        <div style={{marginTop:10}}>
          <Button type="primary" htmlType="submit" loading={signUpLoading}>????????????</Button>
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
