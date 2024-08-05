import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function OauthLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const accessToken = queryParams.get('token');
//const nickname = queryParams.get('nickname');

  useEffect(() => {
    window.localStorage.setItem('AccessToken', accessToken);
    //window.localStorage.setItem('nickname', nickname);
    navigate('/mygumi_login');
  });

  return <div>로딩중..</div>;
}

export default OauthLoginPage;