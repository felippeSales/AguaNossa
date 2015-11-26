package com.example.felipesales.aguanossa;

import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.os.Build;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.*;
import android.util.Log;


public class MainActivity extends ActionBarActivity {



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }


    @Override
    public void onStart() {
        super.onStart();

        WebView webView =  (WebView)findViewById(R.id.webView2);
        //enable JavaScript
        webView.getSettings().setJavaScriptEnabled(true);


        if (Build.VERSION.SDK_INT >= 21) {
            webView.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
        }
        webView.setWebChromeClient(new WebChromeClient() {

            public void onConsoleMessage(String message, int lineNumber, String sourceID) {

                Log.d("WebConsole", message + " -- From line "
                        + lineNumber + " of "
                        + sourceID);
            }
        });

        webView.loadUrl("file:///android_asset/index.html");

    }
}

