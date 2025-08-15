// ==UserScript==
// @name         EmuParadise Auto-Download
// @version      2.0.0
// @description  Automatically downloads ROMs and adds manual download option
// @author       Enhanced Version
// @match        https://www.emuparadise.me/*/*/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    
    var id = ((document.URL).split("/"))[5];
    
    if (!id || !id.match(/^\d+$/)) {
        return;
    }
    
    var downloadUrl = "/roms/get-download.php?gid=" + id + "&test=true";
    
    $(".download-link").prepend(`
        <div style="background: #4CAF50; padding: 10px; margin: 10px 0; border-radius: 5px;">
            <a target="_blank" 
               href="${downloadUrl}" 
               style="color: white; text-decoration: none; font-weight: bold;"
               title="Download using the workaround script">
               Manual Download (Workaround)
            </a>
        </div>
    `);
    
    function attemptAutoDownload() {
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = downloadUrl;
        document.body.appendChild(iframe);
        
        setTimeout(function() {
            try {
                document.body.removeChild(iframe);
            } catch(e) {
                console.log("Iframe removed");
            }
        }, 5000);
    }
    
    function showNotification(message, type) {
        var notification = $(`
            <div id="auto-download-notification" style="
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                background: ${type === 'success' ? '#4CAF50' : '#f44336'};
                color: white;
                border-radius: 5px;
                z-index: 10000;
                font-family: Arial, sans-serif;
                font-size: 14px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                max-width: 300px;
            ">
                ${message}
                <div style="margin-top: 10px;">
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(function() {
            $('#auto-download-notification').fadeOut(500, function() {
                $(this).remove();
            });
        }, 10000);
    }
    
    function addControlPanel() {
        var controlPanel = $(`
            <div id="auto-download-controls" style="
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #333;
                color: white;
                padding: 15px;
                border-radius: 8px;
                z-index: 9999;
                font-family: Arial, sans-serif;
                font-size: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                min-width: 200px;
            ">
                <div style="font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #555; padding-bottom: 5px;">
                    Auto-Download Controls
                </div>
                <div style="margin-bottom: 8px;">
                    Game ID: <span style="color: #4CAF50;">${id}</span>
                </div>
                <button id="manual-download-btn" style="
                    background: #4CAF50;
                    border: none;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    margin-right: 5px;
                    font-size: 11px;
                ">Download Now</button>
                <button id="close-panel-btn" style="
                    background: #666;
                    border: none;
                    color: white;
                    padding: 8px 12px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 11px;
                ">Hide</button>
                <div style="margin-top: 10px; font-size: 10px; color: #aaa;">
                    Auto-download: <span id="auto-status" style="color: #4CAF50;">Ready</span>
                </div>
            </div>
        `);
        
        $('body').append(controlPanel);
        
        $('#manual-download-btn').click(function() {
            attemptAutoDownload();
        });
        
        $('#close-panel-btn').click(function() {
            $('#auto-download-controls').fadeOut();
        });
    }
    
    $(document).ready(function() {
        addControlPanel();
        
        setTimeout(function() {
            if ($(".download-link").length > 0) {
                $('#auto-status').text('Downloading...').css('color', '#ff9800');
                attemptAutoDownload();
            } else {
                $('#auto-status').text('No download links found').css('color', '#f44336');
            }
        }, 2000);
    });
    
})();
