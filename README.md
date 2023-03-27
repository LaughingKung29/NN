@echo off
set nn_user=用户名
set nn_pwd=密码
pip install requests
curl https://ghproxy.com/https://raw.githubusercontent.com/lijiansen7/Plus7xza/main/NN.py 
-o NN.py
python NN.py
del NN.py
pause
