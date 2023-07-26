import 'antd/dist/antd.css';
import { useEffect } from 'react';
import { AppProps } from 'next/app';
import Script from 'next/script';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../../styles/theme';
import createEmotionCache from '../../src/lib/createEmotionCache';
import { StoreProvider } from '../../utils/Store';
import { useRouter } from 'next/router';
import * as gtag from '../lib/gtag';
import * as fbq from '../lib/fpixel';
import * as microsoft from '../lib/microsoft';
import TagManager from 'react-gtm-module';
import GooglePlacesScript from '../../utils/googlePlacesScript';
import '../../styles/servicesSheet.css';
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const App = (props: MyAppProps) => {
  const router = useRouter();
    useEffect(() => {
    TagManager.initialize({ gtmId: `${gtag.GTM_ID}` });
    fbq.pageview();

    const handleRouteChange = (url: URL) => {
      gtag.pageview(url);
      fbq.pageview();
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return (
    <CacheProvider value={emotionCache}>
      <StoreProvider>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}
          />
          <Script
            id="gtag-tracking-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gtag.GA_TRACKING_ID}', {
              page_path: window.location.pathname,
            });
            gtag('config', '${gtag.GA_ADS_ID}');
          `,
            }}
          />
          <Script
            id="fbq-tracking-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${fbq.FB_PIXEL_ID}');
          `,
            }}
          />
          <Script
            id="microsoft-tracking-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
              (function(w,d,t,r,u)
              {
                  var f,n,i;
                  w[u]=w[u]||[],f=function()
                  {
                      var o={ti: '${microsoft.MICROSOFT_PAGEVIEW_TAG_ID}', enableAutoSpaTracking: true};
                      o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")
                  },
                  n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function()
                  {
                      var s=this.readyState;
                      s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)
                  },
                  i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)
              })
              (window,document,"script","//bat.bing.com/bat.js","uetq");
          `,
            }}
          />
          <GooglePlacesScript />
          <Component {...pageProps} />
        </ThemeProvider>
      </StoreProvider>
    </CacheProvider>
  );
};

export default App;
