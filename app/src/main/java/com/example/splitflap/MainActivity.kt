package com.example.splitflap

import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val webView = WebView(this)
        setContentView(webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            loadWithOverviewMode = true
            useWideViewPort = true
            // Allow file access for local assets if needed (usually file:///android_asset/ works without this but good to have)
            allowFileAccess = true 
            mediaPlaybackRequiresUserGesture = false 
        }

        webView.loadUrl("file:///android_asset/index.html")
    }
}
