import { useState, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { Routess } from './routes';
import LandingPg from './component/landingPg/LandingPg';
import DataPrepare from './component/data_prepare/DataPrepare';
import TextAnalyticsLayout from './component/text_analytics/TextAnalyticsLayout';
import { Hidden } from '@mui/material';
import HomePg from './component/home_pg/HomePg';
import Header from './component/header/Header';
import SummaryAzureopenAi from './component/text_analytics/summary/Summary';
import DeployedQndA from './component/text_analytics/qna/QnA';
import TextInsightAzureOpenAi from './component/text_analytics/text_insight/TextInsight';
import DocumentTranslation from './component/text_analytics/translate/DocumentTranslation';
import MinimizableWebChat from './component/chatbot/Chatbotnew/chatbot/MinimizableWebChat';
import { useSelector, useDispatch } from 'react-redux';
import { useTracking } from 'react-tracking';
import { addTrackingData } from './component/Redux/Store/Store';
import MonitoringTab from './component/monitoring/MonitoringTab';
import './App.css';
import SignIn from './component/auth/SignIn';
import jwtDecode from 'jwt-decode'; 

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const accountInfo = useSelector((state) => state.accountInfo);
  const { trackEvent } = useTracking();
  const dispatch = useDispatch(); // Initialize useDispatch


  const isTokenExpired = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Decode the token to extract expiration time
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds
      console.log("test",decodedToken.exp)
      // Check if the current time is past the token expiration time
      return decodedToken.exp < currentTime;
    }
    return true; // No token means it's expired or non-existent
  };

  useEffect(() => {
    // Redirect to login page if token is expired
    if (isTokenExpired()) {
      navigate('/'); // Redirect to login
    }
  }, [navigate]);

  // Track page views
  useEffect(() => {
    const eventData = { event: 'page_view', page_path: location.pathname };
    trackEvent(eventData);
    dispatch(addTrackingData(eventData));
  }, [location.pathname, trackEvent, dispatch]);

  // Redirect to login if the user is not authenticated
  useEffect(() => {
    if (!accountInfo?.account?.userName && location.pathname !== '/') {
      navigate('/');
    }
  }, [accountInfo, location.pathname, navigate]);

  // Function to check the role and render routes
  const renderRoutesByRole = () => {
    const userEmail = accountInfo?.account?.userName;
    const userName = userEmail?.split('@')[0]; // Extract the username from email
    if (userName === 'user1') {
      return (
        <>
          <Route path={Routess.DataPrepare} element={<TextAnalyticsLayout />} />
          <Route path={Routess.TextAnalysis} element={<TextAnalyticsLayout />} />
          <Route path={Routess.Monitoring} element={<MonitoringTab />} />
        </>
      );
    } else if (userName === 'user2') {
      return (
        <>
          <Route path={Routess.DataPrepare} element={<TextAnalyticsLayout />} />
          <Route path={Routess.TextAnalysis} element={<TextAnalyticsLayout />} />
          <Route path={Routess.Monitoring} element={<MonitoringTab />} />x
        </>
      );
    } else if (userName === 'navin') {
      return (
        <>
          <Route path={Routess.QndA} element={<DeployedQndA />} />
          <Route path={Routess.TextInsight} element={<TextInsightAzureOpenAi />} />
          <Route path={Routess.DataPrepare} element={<TextAnalyticsLayout />} />
          <Route path={Routess.Translate} element={<DocumentTranslation />} />
          {/* MonitoringTab is not accessible */}
        </>
      );
    } else if (userName === 'anshu.pal') {
      return (
        <>
          {/* <Route path={Routess.QndA} element={<DeployedQndA />} /> */}
          <Route path={Routess.DataPrepare} element={<TextAnalyticsLayout />} />
          <Route path={Routess.TextAnalysis} element={<TextAnalyticsLayout />} />
          <Route path={Routess.Monitoring} element={<MonitoringTab />} />
        </>
      );
    } else {
      return (
        <>
          <Route path={Routess.Login} element={<SignIn />} />
          <Route path={Routess.DataPrepare} element={<TextAnalyticsLayout />} />
          <Route path={Routess.TextAnalysis} element={<TextAnalyticsLayout />} />
          <Route path={Routess.Monitoring} element={<MonitoringTab />} />
        </>
      );
    }
  };

  return (
    <>
     {/* {accountInfo?.account?.userName && location.pathname !== '/' && <SignIn />} */}
      <Hidden mdDown>
        <Routes>
          <Route path={Routess.Login} element={<SignIn />} />
          <Route path={Routess.Home} element={<LandingPg />} />
          {renderRoutesByRole()}
        </Routes>
      </Hidden>
      <Hidden mdUp>
        <Header />
        <Routes>
          {/* <Route path={Routess.Login} element={<SignIn />} />
          <Route path={Routess.Home} element={<HomePg />} />
          {renderRoutesByRole()} */}
          <Route path={Routess.Login} element={<SignIn />} />
          <Route path={Routess.Home} element={<HomePg />} />
          <Route path={Routess.DataPrepare} element={<DataPrepare />} />
          {/* <Route path={Routess.TextAnalysis} element={<MainbyTabs/>}></Route> */}
          <Route path={Routess.Summary} element={<SummaryAzureopenAi />} />
          <Route path={Routess.QndA} element={<DeployedQndA />} />
          <Route path={Routess.TextInsight} element={<TextInsightAzureOpenAi />} />
          <Route path={Routess.Translate} element={<DocumentTranslation />} />
          {/* <Route path={Routess.ContentModeration} element={<AzureModerator />} /> */}
          {/* <Route path={Routess.Monitoring} element={<MonitoringTab />} /> */}
        </Routes>
      </Hidden>
      {accountInfo?.account?.userName && location.pathname !== '/' && <MinimizableWebChat />}
    </>
  );
}

export default App;
