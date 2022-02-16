directory=${PUBLIC_DIR_NAME:-public}
yarn --cwd client build --prod
yarn --cwd api build
mkdir ./api/$directory
cp -R ./client/build/* ./api/$directory
cp ./README.md ./api/README.md
