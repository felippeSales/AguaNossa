package com.example.felipesales.aguanossa;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Message;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.os.Build;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.webkit.*;
import android.util.Log;
import android.widget.FrameLayout;
import android.widget.Toast;
import android.content.Intent;

public class MainActivity extends Activity {

/* URL saved to be loaded after fb login */
//private static final String target_url="http://felippesales.github.io/";
final String target_url="file:///android_asset/index.html";
private static final String target_url_prefix="www.example.com";
private Context mContext;
private WebView mWebview;
private WebView mWebviewPop;
private FrameLayout mContainer;
private long mLastBackPressTime = 0;
private Toast mToast;

@TargetApi(Build.VERSION_CODES.JELLY_BEAN)
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    setContentView(R.layout.activity_main);
    // final View controlsView =
    // findViewById(R.id.fullscreen_content_controls);
    CookieManager cookieManager = CookieManager.getInstance();
    cookieManager.setAcceptCookie(true);
    mWebview = (WebView) findViewById(R.id.webview);
    //mWebviewPop = (WebView) findViewById(R.id.webviewPop);
    mContainer = (FrameLayout) findViewById(R.id.webview_frame);
    WebSettings webSettings = mWebview.getSettings();
    webSettings.setJavaScriptEnabled(true);
    webSettings.setAppCacheEnabled(true);
    webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
    webSettings.setSupportMultipleWindows(true);

    webSettings.setAllowFileAccessFromFileURLs(true);
    webSettings.setAllowUniversalAccessFromFileURLs(true);

   // webSettings.setBuiltInZoomControls(true);
    webSettings.setDisplayZoomControls(false);
    mWebview.setWebViewClient(new UriWebViewClient());
    mWebview.setWebChromeClient(new UriChromeClient());
    mWebview.loadUrl(target_url);

    mContext=this.getApplicationContext();

}

@Override
public boolean onKeyDown(int keyCode, KeyEvent event) {
    // Check if the key event was the Back button and if there's history
    if (keyCode == KeyEvent.KEYCODE_BACK ) {
        mWebview.loadUrl(target_url);
        return true;
    }
    // If it wasn't the Back key or there's no web page history, bubble up to the default
    // system behavior (probably exit the activity)
    return super.onKeyDown(keyCode, event);
}


private class UriWebViewClient extends WebViewClient {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, String url) {
        if (url != null && (url.startsWith("http://") || url.startsWith("https://"))) {
            Log.d("URl error", url);
            Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse(url));

            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            view.getContext().startActivity(i);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public void onReceivedSslError(WebView view, SslErrorHandler handler,
                                   SslError error) {
        handler.proceed(); // Ignore SSL certificate errors
    }
}

class UriChromeClient extends WebChromeClient {

            @Override
        public boolean onCreateWindow(WebView view, boolean isDialog,
                                          boolean isUserGesture, Message resultMsg) {

                mWebviewPop = new WebView(mContext);
                mWebviewPop.setWebViewClient(new UriWebViewClient());
                mWebviewPop.getSettings().setJavaScriptEnabled(true);
                mWebviewPop.setLayoutParams(new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                       ViewGroup.LayoutParams.MATCH_PARENT));
                WebView.WebViewTransport transport = (WebView.WebViewTransport) resultMsg.obj;
                transport.setWebView(mWebviewPop);
                resultMsg.sendToTarget();


        Log.d("onOpenWindow", "called");
        return true;
    }

    @Override
    public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
        Log.d("WebConsoleMessage", consoleMessage.message() + " -- From line "
                + consoleMessage.lineNumber() + " of "
                + consoleMessage.sourceId());

        return true;
    }

    @Override
    public void onCloseWindow(WebView window) {
        Log.d("onCloseWindow", "called");
    }

}
}