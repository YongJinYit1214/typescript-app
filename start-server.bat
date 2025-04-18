@echo off
echo Starting server for mobile app...
echo Your app will be available at: http://192.168.1.103:3000
serve -s dist -l 3000 --no-clipboard
