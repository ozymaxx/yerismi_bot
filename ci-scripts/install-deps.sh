sudo apt update
sudo apt install build-essential libreadline-dev libnanomsg-dev
git clone https://github.com/ozymaxx/distro.git ./torch --recursive
cd ./torch
bash install-deps
./install.sh -b
cd ..
npm install
