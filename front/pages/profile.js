import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Router from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import UseSWR from 'swr';

import NicknameEditForm from '../components/NicknameEditForm';
import AppLayout from '../components/AppLayout';
import FollowList from '../components/FollowList';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const fetcher = (url) => axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data: followersData, error: followerError } = UseSWR(`http://localhost:3065/user/followers?limit=${followersLimit}`, fetcher);
  const { data: followingsData, error: followingError } = UseSWR(`http://localhost:3065/user/followings?limit=${followingsLimit}`, fetcher);
  console.log(followingsData, followingError, '데이터텉터터터터터터터');
  useEffect(() => {
    console.log(me);
    // console.log(me.id, '보너스');
    // console.log(me && me.id, '이건알아야되');
    // console.log(!(me && me.id), '이건알아야되');
    if (!(me && me.id)) {
      Router.push('/');
    }
  }, [me && me.id]);

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return '내 정보 로딩중...';
  }

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div> 팔로잉/팔로워 로딩 중 에러가 발생합니다. </div>;
  }

  return (
    <AppLayout>
      <NicknameEditForm />
      <FollowList
        header="팔로잉 목록"
        data={followingsData}
        onClickMore={loadMoreFollowings}
        loading={!followingsData && !followingError}
      />
      <FollowList
        header="팔로워 목록"
        data={followersData}
        onClickMore={loadMoreFollowers}
        loading={!followersData && !followerError}
      />
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

export default Profile;
