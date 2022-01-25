yarn --cwd client build 
yarn --cwd api build
mkdir ./api/public
cp -R ./client/build/* ./api/public