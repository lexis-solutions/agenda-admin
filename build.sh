yarn --cwd client build --prod
yarn --cwd api build
mkdir ./api/client
cp -R ./client/build/* ./api/client
cp ./README.md ./api/README.md
