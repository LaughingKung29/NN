@echo off
set nn_user=用户名
set nn_pwd=密码
pip install requests
curl https://ghproxy.com/https://raw.githubusercontent.com/LaughingKung29/NN/main/NN.py 
-o NN.py
python NN.py
del NN.py
pause
